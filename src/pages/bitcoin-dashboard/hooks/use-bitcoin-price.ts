// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { useState, useEffect, useCallback } from 'react';
import { BitcoinPriceResponse, PriceHistory } from '../types';

const API_URL = 'https://api.coindesk.com/v1/bpi/currentprice.json';

export function useBitcoinPrice() {
  const [priceData, setPriceData] = useState<BitcoinPriceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);

  const fetchBitcoinPrice = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`API response error: ${response.status}`);
      }

      const data: BitcoinPriceResponse = await response.json();
      setPriceData(data);

      // Add current prices to history
      const now = new Date().toISOString();
      setPriceHistory(prevHistory => {
        // Keep only the last 20 entries for each currency
        const newHistory = [...prevHistory];

        // Add new entries for each currency
        Object.entries(data.bpi).forEach(([currency, details]) => {
          newHistory.push({
            currency,
            timestamp: now,
            price: details.rate_float,
          });
        });

        // Sort by timestamp (newest first) and limit to 100 entries
        return newHistory
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 100);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch Bitcoin price data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch price data on initial load
  useEffect(() => {
    fetchBitcoinPrice();

    // Set up polling every 60 seconds
    const intervalId = setInterval(() => {
      fetchBitcoinPrice();
    }, 60000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [fetchBitcoinPrice]);

  return {
    priceData,
    loading,
    error,
    priceHistory,
    refreshPriceData: fetchBitcoinPrice,
  };
}
