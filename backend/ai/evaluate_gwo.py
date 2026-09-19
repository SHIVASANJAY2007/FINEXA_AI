"""
evaluate_gwo.py

Comprehensive Accuracy, Performance, and Benchmark Evaluation Suite for
FINEXA AlphaPack™ (Grey Wolf Optimizer - GWO).

Evaluates:
1. Proximity to Mathematical Ground Truth (Exact Global Optimum via SciPy SLSQP / Convex Optimization)
2. Comparison against Metaheuristics & Baselines:
   - Particle Swarm Optimization (PSO)
   - Genetic Algorithm (GA)
   - Monte Carlo Random Search (10,000 samples)
   - Equal Weight (1/N) Baseline
   - Traditional 60/40 Equity-Debt Allocation
3. Multi-Trial Monte Carlo Statistical Stability (N=100 runs per profile)
4. Convergence Speed, NFE (Number of Function Evaluations), and Runtime Efficiency
5. Risk-Profile Adaptability (Safe, Balanced, Aggressive)
"""

import sys
import os
import time
import math
import random
import json
import numpy as np
from scipy.optimize import minimize

# Ensure UTF-8
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Import core GWO definitions
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from gwo_optimizer_engine import (
    ASSET_BENCHMARKS,
    COV_MATRIX,
    RISK_FREE_RATE,
    normalize_weights,
    calculate_portfolio_metrics,
    fitness_function,
    run_gwo_optimizer
)

DIM = len(ASSET_BENCHMARKS)
COV_NP = np.array(COV_MATRIX)
RETURNS_NP = np.array([a["meanReturn"] for a in ASSET_BENCHMARKS])


# ==========================================
# 1. EXACT MATHEMATICAL GROUND TRUTH (SLSQP)
# ==========================================
def solve_ground_truth_slsqp(risk_preference="balanced", horizon_years=5):
    """
    Computes theoretical optimal portfolio weights and fitness using Sequential
    Least Squares Quadratic Programming (SLSQP) with multiple random starts.
    """
    def obj_func(w):
        # We negate fitness because minimize() minimizes the objective
        w_norm = normalize_weights(w)
        score, _ = fitness_function(w_norm, risk_preference, horizon_years)
        return -score

    bounds = [(0.01, 1.0) for _ in range(DIM)]
    constraints = ({'type': 'eq', 'fun': lambda w: sum(w) - 1.0})

    best_score = -math.inf
    best_weights = None

    # Multi-start to ensure true global optimum
    for seed in range(20):
        np.random.seed(seed * 42)
        w0 = np.random.uniform(0.05, 0.95, DIM)
        w0 /= np.sum(w0)
        res = minimize(obj_func, w0, method='SLSQP', bounds=bounds, constraints=constraints, tol=1e-8)
        if res.success:
            score = -res.fun
            if score > best_score:
                best_score = score
                best_weights = normalize_weights(res.x)

    # Fallback to single run if multi-start had quirks
    if best_weights is None:
        w0 = [1.0 / DIM] * DIM
        res = minimize(obj_func, w0, method='SLSQP', bounds=bounds, constraints=constraints)
        best_score = -res.fun
        best_weights = normalize_weights(res.x)

    metrics = calculate_portfolio_metrics(best_weights)
    return {
        "score": best_score,
        "weights": best_weights,
        "metrics": metrics
    }


# ==========================================
# 2. COMPARATIVE ALGORITHMS (PSO, GA, RANDOM)
# ==========================================
def run_pso_optimizer(risk_preference="balanced", horizon_years=5, swarm_size=25, max_iter=40):
    """Particle Swarm Optimization implementation for benchmark comparison."""
    # Particles: position & velocity
    particles = [[random.uniform(0.05, 0.95) for _ in range(DIM)] for _ in range(swarm_size)]
    velocities = [[random.uniform(-0.1, 0.1) for _ in range(DIM)] for _ in range(swarm_size)]
    pbest = [list(p) for p in particles]
    pbest_scores = [-math.inf] * swarm_size
    gbest = [1.0 / DIM] * DIM
    gbest_score = -math.inf

    w_inertia = 0.7
    c1, c2 = 1.5, 1.5

    for i in range(swarm_size):
        score, _ = fitness_function(particles[i], risk_preference, horizon_years)
        pbest_scores[i] = score
        if score > gbest_score:
            gbest_score = score
            gbest = list(particles[i])

    for t in range(max_iter):
        for i in range(swarm_size):
            for d in range(DIM):
                r1, r2 = random.random(), random.random()
                velocities[i][d] = (w_inertia * velocities[i][d] +
                                    c1 * r1 * (pbest[i][d] - particles[i][d]) +
                                    c2 * r2 * (gbest[d] - particles[i][d]))
                particles[i][d] = max(0.01, min(1.0, particles[i][d] + velocities[i][d]))

            score, _ = fitness_function(particles[i], risk_preference, horizon_years)
            if score > pbest_scores[i]:
                pbest_scores[i] = score
                pbest[i] = list(particles[i])
                if score > gbest_score:
                    gbest_score = score
                    gbest = list(particles[i])

    best_weights = normalize_weights(gbest)
    score, metrics = fitness_function(best_weights, risk_preference, horizon_years)
    return {"score": score, "weights": best_weights, "metrics": metrics}


def run_ga_optimizer(risk_preference="balanced", horizon_years=5, pop_size=25, generations=40):
    """Genetic Algorithm with tournament selection, blend crossover, and Gaussian mutation."""
    population = [[random.uniform(0.05, 0.95) for _ in range(DIM)] for _ in range(pop_size)]
    
    def evaluate(pop):
        scores = []
        for ind in pop:
            s, _ = fitness_function(ind, risk_preference, horizon_years)
            scores.append(s)
        return scores

    scores = evaluate(population)
    best_idx = np.argmax(scores)
    best_score = scores[best_idx]
    best_ind = list(population[best_idx])

    for _ in range(generations):
        new_pop = [best_ind]  # Elitism
        while len(new_pop) < pop_size:
            # Tournament selection
            i1, i2 = random.sample(range(pop_size), 2)
            p1 = population[i1] if scores[i1] > scores[i2] else population[i2]
            i3, i4 = random.sample(range(pop_size), 2)
            p2 = population[i3] if scores[i3] > scores[i4] else population[i4]

            # Blend crossover (alpha=0.5)
            child = [(p1[d] + p2[d]) / 2.0 + random.uniform(-0.05, 0.05) for d in range(DIM)]
            # Mutation
            if random.random() < 0.2:
                child = [max(0.01, min(1.0, child[d] + random.gauss(0, 0.1))) for d in range(DIM)]
            else:
                child = [max(0.01, min(1.0, child[d])) for d in range(DIM)]
            new_pop.append(child)

        population = new_pop
        scores = evaluate(population)
        curr_best_idx = np.argmax(scores)
        if scores[curr_best_idx] > best_score:
            best_score = scores[curr_best_idx]
            best_ind = list(population[curr_best_idx])

    best_weights = normalize_weights(best_ind)
    score, metrics = fitness_function(best_weights, risk_preference, horizon_years)
    return {"score": score, "weights": best_weights, "metrics": metrics}


def run_random_search(risk_preference="balanced", horizon_years=5, samples=10000):
    """Monte Carlo uniform random sampling baseline."""
    best_score = -math.inf
    best_weights = None

    for _ in range(samples):
        w = [random.uniform(0.01, 1.0) for _ in range(DIM)]
        w_norm = normalize_weights(w)
        score, _ = fitness_function(w_norm, risk_preference, horizon_years)
        if score > best_score:
            best_score = score
            best_weights = w_norm

    score, metrics = fitness_function(best_weights, risk_preference, horizon_years)
    return {"score": score, "weights": best_weights, "metrics": metrics}


def run_equal_weight_baseline(risk_preference="balanced", horizon_years=5):
    """1/N Uniform Equal Weight Portfolio."""
    weights = [1.0 / DIM] * DIM
    score, metrics = fitness_function(weights, risk_preference, horizon_years)
    return {"score": score, "weights": weights, "metrics": metrics}


def run_traditional_60_40_baseline(risk_preference="balanced", horizon_years=5):
    """Traditional 60% Equity (Nifty+MidCap) / 40% Debt & Gold baseline."""
    # Nifty50: 35%, Midcap: 25%, Debt: 30%, Gold: 10%, US Tech: 0%
    weights = [0.35, 0.25, 0.30, 0.10, 0.00]
    score, metrics = fitness_function(weights, risk_preference, horizon_years)
    return {"score": score, "weights": weights, "metrics": metrics}


# ==========================================
# 3. EVALUATION EXECUTION SUITE
# ==========================================
def evaluate_all():
    print("=" * 80)
    print("FINEXA AlphaPack™ (Grey Wolf Optimizer) — Comprehensive Evaluation Suite")
    print("=" * 80)

    profiles = ["safe", "balanced", "aggressive"]
    horizons = [5, 10]
    results_summary = {}

    for profile in profiles:
        print(f"\n>>> EVALUATING RISK PROFILE: {profile.upper()} (Horizon: 5 Years)")
        gt = solve_ground_truth_slsqp(risk_preference=profile, horizon_years=5)
        print(f"  [Ground Truth Optimal] Fitness: {gt['score']:.4f} | Sharpe: {gt['metrics']['sharpeRatio']:.2f} | "
              f"Exp. Return: {gt['metrics']['expectedReturn']:.2f}% | Vol: {gt['metrics']['volatility']:.2f}%")
        print(f"  [Ground Truth Weights] Nifty:{gt['weights'][0]*100:.1f}% | Mid:{gt['weights'][1]*100:.1f}% | "
              f"Debt:{gt['weights'][2]*100:.1f}% | Gold:{gt['weights'][3]*100:.1f}% | Tech:{gt['weights'][4]*100:.1f}%")

        # Monte Carlo 100 Runs for GWO Statistical Robustness
        n_trials = 100
        gwo_scores = []
        gwo_sharpes = []
        gwo_returns = []
        gwo_vols = []
        gwo_weight_errors = []
        runtimes = []

        for seed in range(n_trials):
            random.seed(seed)
            t0 = time.perf_counter()
            res = run_gwo_optimizer({
                "monthlyInvestment": 15000,
                "horizonYears": 5,
                "riskPreference": profile,
                "packSize": 25,
                "iterations": 40
            })
            t1 = time.perf_counter()
            runtimes.append((t1 - t0) * 1000.0)

            alpha = res["packLeaders"]["alpha"]
            alpha_score, _ = fitness_function(alpha["metrics"]["weights"], profile, 5)
            gwo_scores.append(alpha_score)
            gwo_sharpes.append(alpha["metrics"]["sharpeRatio"])
            gwo_returns.append(alpha["metrics"]["expectedReturn"])
            gwo_vols.append(alpha["metrics"]["volatility"])

            # L2 Euclidean weight error vs ground truth
            w_diff = np.array(alpha["metrics"]["weights"]) - np.array(gt["weights"])
            l2_err = np.linalg.norm(w_diff)
            gwo_weight_errors.append(l2_err)

        mean_score = np.mean(gwo_scores)
        std_score = np.std(gwo_scores)
        min_score = np.min(gwo_scores)
        max_score = np.max(gwo_scores)
        mean_accuracy = (1.0 - abs(gt["score"] - mean_score) / abs(gt["score"])) * 100.0
        mean_weight_err = np.mean(gwo_weight_errors)
        mean_runtime = np.mean(runtimes)

        # Baseline comparisons
        pso_res = run_pso_optimizer(profile, 5)
        ga_res = run_ga_optimizer(profile, 5)
        rand_res = run_random_search(profile, 5, samples=10000)
        eq_res = run_equal_weight_baseline(profile, 5)
        trad_res = run_traditional_60_40_baseline(profile, 5)

        print(f"\n  [GWO 100-Trial Statistics]:")
        print(f"    - Accuracy vs Exact Optimum : {mean_accuracy:.2f}%")
        print(f"    - Mean Fitness Score       : {mean_score:.4f} ± {std_score:.4f} (Min: {min_score:.4f}, Max: {max_score:.4f})")
        print(f"    - Weight Error (L2 Norm)   : {mean_weight_err:.4f}")
        print(f"    - Mean Sharpe Ratio        : {np.mean(gwo_sharpes):.2f}")
        print(f"    - Mean Expected Return     : {np.mean(gwo_returns):.2f}%")
        print(f"    - Mean Volatility          : {np.mean(gwo_vols):.2f}%")
        print(f"    - Mean Execution Time      : {mean_runtime:.2f} ms")

        print(f"\n  [Benchmarking Against Other Solvers]:")
        print(f"    - GWO (25 wolves x 40 iters = 1,000 NFE) : Fitness = {mean_score:.4f} | Sharpe = {np.mean(gwo_sharpes):.2f}")
        print(f"    - PSO (25 particles x 40 iters = 1,000 NFE): Fitness = {pso_res['score']:.4f} | Sharpe = {pso_res['metrics']['sharpeRatio']:.2f}")
        print(f"    - GA  (25 pop x 40 gens = 1,000 NFE)    : Fitness = {ga_res['score']:.4f} | Sharpe = {ga_res['metrics']['sharpeRatio']:.2f}")
        print(f"    - Random Search (10,000 NFE)            : Fitness = {rand_res['score']:.4f} | Sharpe = {rand_res['metrics']['sharpeRatio']:.2f}")
        print(f"    - Equal Weight 1/N Baseline             : Fitness = {eq_res['score']:.4f} | Sharpe = {eq_res['metrics']['sharpeRatio']:.2f}")
        print(f"    - Traditional 60/40 Baseline            : Fitness = {trad_res['score']:.4f} | Sharpe = {trad_res['metrics']['sharpeRatio']:.2f}")

        results_summary[profile] = {
            "ground_truth": gt,
            "gwo_stats": {
                "mean_score": float(mean_score),
                "std_score": float(std_score),
                "min_score": float(min_score),
                "max_score": float(max_score),
                "accuracy_pct": float(mean_accuracy),
                "weight_l2_error": float(mean_weight_err),
                "mean_sharpe": float(np.mean(gwo_sharpes)),
                "mean_return": float(np.mean(gwo_returns)),
                "mean_volatility": float(np.mean(gwo_vols)),
                "mean_runtime_ms": float(mean_runtime)
            },
            "pso": pso_res,
            "ga": ga_res,
            "random_search": rand_res,
            "equal_weight": eq_res,
            "traditional_60_40": trad_res
        }

    return results_summary


if __name__ == "__main__":
    results = evaluate_all()
    with open("backend/ai/gwo_eval_results.json", "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)
    print("\n[SUCCESS] Detailed evaluation results exported to backend/ai/gwo_eval_results.json")
