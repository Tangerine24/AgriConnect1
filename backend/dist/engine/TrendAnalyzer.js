"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrendAnalyzer = void 0;
class TrendAnalyzer {
    analyze(currentPrice, historicalAverage, storageAvailable, urgencyDays) {
        // Basic Rule-Based logic for MVP
        // If the farmer has a tight deadline, they must sell now regardless of price
        if (urgencyDays <= 2) {
            return {
                indicator: 'SELL NOW',
                confidence: 'HIGH',
                reason: 'Selling deadline is imminent. Waiting is not an option.'
            };
        }
        // If no storage is available, they can't wait
        if (!storageAvailable) {
            return {
                indicator: 'SELL NOW',
                confidence: 'HIGH',
                reason: 'No storage available to hold the produce.'
            };
        }
        // Price Analysis
        const priceRatio = currentPrice / historicalAverage;
        if (priceRatio > 1.05) {
            // Current price is > 5% above historical average
            return {
                indicator: 'SELL NOW',
                confidence: 'HIGH',
                reason: 'Current prices are significantly higher than recent averages.'
            };
        }
        else if (priceRatio >= 0.95 && priceRatio <= 1.05) {
            // Prices are stable
            return {
                indicator: 'WAIT',
                confidence: 'MODERATE',
                reason: 'Prices are stable. If storage costs are low, waiting might yield slightly better margins.'
            };
        }
        else {
            // Prices have crashed
            return {
                indicator: 'WAIT',
                confidence: 'HIGH',
                reason: 'Current prices are below average. Recommended to hold produce in storage until prices recover.'
            };
        }
    }
}
exports.TrendAnalyzer = TrendAnalyzer;
