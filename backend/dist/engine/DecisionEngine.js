"use strict";
// This engine calculates the Expected Net Realisation (ENR) for a given farmer and produce,
// and returns a ranked list of recommended markets and buyers.
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecisionEngine = void 0;
class DecisionEngine {
    constructor() {
        this.TRANSPORT_RATE_PER_KM_QUINTAL = 2.5; // Example: Rs 2.5 per km per quintal
        this.STORAGE_RATE_PER_DAY_QUINTAL = 5.0; // Example: Rs 5 per day per quintal
        this.TRANSACTION_FEE = 150; // Flat fee for simplicity
        this.RISK_PENALTY_UNVERIFIED_BUYER = 0.05; // 5% penalty on price
    }
    calculateENR(pricePerQuintal, distance, constraints, isUnverifiedBuyer = false) {
        const expectedSellingPrice = pricePerQuintal * constraints.quantity;
        const transportCost = distance * this.TRANSPORT_RATE_PER_KM_QUINTAL * constraints.quantity;
        // If urgent, no storage used. If not urgent, maybe they store for a few days (simplified assumption)
        const storageCost = constraints.urgencyDays > 3 && constraints.storageAvailable
            ? 5 * this.STORAGE_RATE_PER_DAY_QUINTAL * constraints.quantity
            : 0;
        // Expected loss (e.g. 1% due to transport damage/spillage)
        const expectedLoss = expectedSellingPrice * 0.01;
        // Risk adjustment (monetary penalty applied for unverified buyers or highly volatile markets)
        const riskAdjustment = isUnverifiedBuyer ? expectedSellingPrice * this.RISK_PENALTY_UNVERIFIED_BUYER : 0;
        const expectedNetRealisation = expectedSellingPrice -
            transportCost -
            storageCost -
            this.TRANSACTION_FEE -
            expectedLoss -
            riskAdjustment;
        return {
            expectedSellingPrice,
            transportCost,
            storageCost,
            transactionCost: this.TRANSACTION_FEE,
            expectedLoss,
            riskAdjustment,
            expectedNetRealisation
        };
    }
    rankOptions(options) {
        // Sort descending by calculated score (which defaults to ENR if weights are equal)
        return options.sort((a, b) => b.score - a.score);
    }
}
exports.DecisionEngine = DecisionEngine;
