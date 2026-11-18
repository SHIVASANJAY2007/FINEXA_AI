"""
FINEXA AI & n8n Latency Benchmark Chart Generator for IEEE Paper
Generates publication-quality charts from finexa_n8n_test_results.csv
"""

import os
import csv
import matplotlib.pyplot as plt
import numpy as np

def generate_benchmark_figures():
    csv_path = os.path.join(os.path.dirname(__file__), 'finexa_n8n_test_results.csv')
    if not os.path.exists(csv_path):
        print(f"Error: CSV file not found at {csv_path}")
        return

    test_nums = []
    chat_durations = []
    n8n_durations = []
    short_labels = [
        "Q1: SIP/Lump",
        "Q2: Sharpe",
        "Q3: Inflation",
        "Q4: CAGR",
        "Q5: Diversify",
        "Q6: Retire",
        "Q7: Debt",
        "Q8: Returns",
        "Q9: Capital",
        "Q10: Interest"
    ]

    with open(csv_path, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            test_nums.append(int(row['Test_Number']))
            chat_durations.append(float(row['Chat_API_Duration_ms']) / 1000.0) # convert to seconds
            n8n_durations.append(float(row['n8n_Duration_ms']) / 1000.0)

    # IEEE Style settings
    plt.rcParams.update({
        'font.family': 'serif',
        'font.size': 10,
        'axes.labelsize': 11,
        'axes.titlesize': 12,
        'xtick.labelsize': 9,
        'ytick.labelsize': 9,
        'legend.fontsize': 9,
        'figure.titlesize': 13
    })

    x = np.arange(len(short_labels))
    width = 0.38

    fig, ax = plt.subplots(figsize=(10, 5), dpi=300)
    rects1 = ax.bar(x - width/2, chat_durations, width, label='Chat API Round-Trip ($T_{chat}$)', color='#6B1E2B')
    rects2 = ax.bar(x + width/2, n8n_durations, width, label='n8n Workflow Duration ($T_{n8n}$)', color='#C5A059')

    ax.set_ylabel('Execution Duration (Seconds)')
    ax.set_xlabel('Standardized Financial Inquiries')
    ax.set_title('FINEXA AI & n8n Latency Benchmark Across 10 Test Cases')
    ax.set_xticks(x)
    ax.set_xticklabels(short_labels, rotation=35, ha='right')
    ax.legend()
    ax.grid(axis='y', linestyle='--', alpha=0.6)

    # Attach value labels on top of bars
    for rect in rects1:
        height = rect.get_height()
        ax.annotate(f'{height:.2f}s',
                    xy=(rect.get_x() + rect.get_width() / 2, height),
                    xytext=(0, 3),  # 3 points vertical offset
                    textcoords="offset points",
                    ha='center', va='bottom', fontsize=7.5)

    for rect in rects2:
        height = rect.get_height()
        ax.annotate(f'{height:.2f}s',
                    xy=(rect.get_x() + rect.get_width() / 2, height),
                    xytext=(0, 3),
                    textcoords="offset points",
                    ha='center', va='bottom', fontsize=7.5)

    plt.tight_layout()
    output_img = os.path.join(os.path.dirname(__file__), 'latency_benchmark_figure.png')
    plt.savefig(output_img, dpi=300)
    print(f"Chart successfully generated and saved to: {output_img}")

if __name__ == '__main__':
    generate_benchmark_figures()
