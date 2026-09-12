import {
    createResultModel,
    roundNumber
} from './common.js';

/**
 * Versionable Capital Gains Tax Rules Configuration
 * Default configuration follows Indian Income Tax Act regulations (FY 2024-25 / FY 2025-26 update)
 */
export const TAX_CONFIG_VERSIONS = {
    'FY_2024_25': {
        financialYear: '2024-25',
        equity: {
            stcgRate: 20.0,       // STCG 20% on Equity
            ltcgRate: 12.5,       // LTCG 12.5% on Equity
            ltcgExemptionLimit: 125000, // ₹1.25 Lakh LTCG Exemption
            holdingMonthsThreshold: 12  // 12 months equity holding period threshold
        },
        debt: {
            stcgRate: 30.0,       // Debt gains taxed at slab (assumed peak 30%)
            ltcgRate: 12.5,
            ltcgExemptionLimit: 0,
            holdingMonthsThreshold: 24
        }
    }
};

/**
 * Capital Gains Tax Estimator Engine
 * 
 * @param {Object} params
 * @param {number} params.purchasePrice - Buy price per share/unit (₹)
 * @param {number} params.sellingPrice - Sale price per share/unit (₹)
 * @param {number} params.quantity - Number of shares/units
 * @param {number} params.holdingMonths - Duration asset was held in months
 * @param {string} [params.assetType='equity'] - Asset class ('equity' | 'debt')
 * @param {string} [params.taxVersion='FY_2024_25'] - Tax rule version key
 */
export const calculateCapitalGains = ({
    purchasePrice = 100,
    sellingPrice = 150,
    quantity = 1000,
    holdingMonths = 18,
    assetType = 'equity',
    taxVersion = 'FY_2024_25'
} = {}) => {
    const warnings = [];
    const taxRules = TAX_CONFIG_VERSIONS[taxVersion] || TAX_CONFIG_VERSIONS['FY_2024_25'];
    const rules = taxRules[assetType] || taxRules.equity;

    const buy = Math.max(0, Number(purchasePrice) || 0);
    const sell = Math.max(0, Number(sellingPrice) || 0);
    const qty = Math.max(0, Number(quantity) || 0);
    const months = Math.max(0, Math.min(360, Number(holdingMonths) || 0));

    if (buy === 0) {
        warnings.push('Purchase price per share is ₹0.');
    }
    if (sell === 0) {
        warnings.push('Selling price per share is ₹0.');
    }
    if (qty === 0) {
        warnings.push('Quantity of shares is 0.');
    }

    const invested = buy * qty;
    const saleValue = sell * qty;
    const grossGain = saleValue - invested;

    const isLongTerm = months >= rules.holdingMonthsThreshold;
    const taxType = isLongTerm ? 'LTCG' : 'STCG';
    const rate = isLongTerm ? rules.ltcgRate : rules.stcgRate;

    let exemptionApplied = 0;
    let taxableGain = 0;
    let taxAmount = 0;

    if (grossGain > 0) {
        if (isLongTerm) {
            exemptionApplied = Math.min(grossGain, rules.ltcgExemptionLimit);
            taxableGain = Math.max(0, grossGain - rules.ltcgExemptionLimit);
            taxAmount = taxableGain * (rules.ltcgRate / 100);
        } else {
            exemptionApplied = 0;
            taxableGain = grossGain;
            taxAmount = grossGain * (rules.stcgRate / 100);
        }
    } else if (grossGain < 0) {
        warnings.push('Capital loss incurred. No capital gains tax liability.');
    }

    const netProfit = grossGain - taxAmount;

    const assumptions = [
        `Tax Rules applied: ${taxRules.financialYear} (${assetType.toUpperCase()})`,
        `Holding threshold for Long-Term Capital Gains: ${rules.holdingMonthsThreshold} Months`,
        isLongTerm
            ? `LTCG tax rate: ${rules.ltcgRate}% with an annual exemption limit of ₹${rules.ltcgExemptionLimit.toLocaleString()}`
            : `STCG tax rate: ${rules.stcgRate}% on gross capital gains`,
        `Tax calculations are estimates for educational guidance and subject to individual tax assessments`
    ];

    const projection = [
        {
            period: 0,
            year: 'Purchase',
            contribution: Math.round(invested),
            invested: Math.round(invested),
            growth: 0,
            withdrawal: 0,
            balance: Math.round(invested),
            value: Math.round(invested),
            returns: 0
        },
        {
            period: 1,
            year: 'Sale (Pre-Tax)',
            contribution: 0,
            invested: Math.round(invested),
            growth: Math.round(Math.max(0, grossGain)),
            withdrawal: 0,
            balance: Math.round(saleValue),
            value: Math.round(saleValue),
            returns: Math.round(Math.max(0, grossGain))
        },
        {
            period: 2,
            year: 'Net Value (Post-Tax)',
            contribution: 0,
            invested: Math.round(invested),
            growth: Math.round(Math.max(0, netProfit)),
            withdrawal: 0,
            balance: Math.round(invested + netProfit),
            value: Math.round(invested + netProfit),
            returns: Math.round(Math.max(0, netProfit))
        }
    ];

    return createResultModel({
        summary: {
            totalInvested: Math.round(invested),
            finalValue: Math.round(invested + netProfit),
            totalReturns: Math.round(Math.max(0, netProfit)),
            tax: Math.round(taxAmount),
            taxType,
            rate,
            primaryMetric: { label: `${taxType} Tax Liability (${rate}%)`, value: Math.round(taxAmount) }
        },
        metrics: {
            purchaseOutlay: Math.round(invested),
            grossSaleProceeds: Math.round(saleValue),
            grossCapitalGain: Math.round(grossGain),
            holdingPeriodMonths: months,
            taxType,
            taxRatePercent: rate,
            exemptionApplied: Math.round(exemptionApplied),
            taxableGain: Math.round(taxableGain),
            taxLiability: Math.round(taxAmount),
            netPostTaxProfit: Math.round(netProfit),
            effectiveTaxPercentage: grossGain > 0 ? roundNumber((taxAmount / grossGain) * 100, 2) : 0
        },
        projection,
        assumptions,
        warnings
    });
};
