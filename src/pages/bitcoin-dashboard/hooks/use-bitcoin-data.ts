// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { useEffect, useState } from 'react';

export interface BitcoinPriceData {
  date: Date;
  price: number;
  marketCap: number;
  volume: number;
}

interface BitcoinDataState {
  currentPrice: number;
  priceChange24h: number;
  priceChange7d: number;
  priceChange30d: number;
  priceChangePercentage24h: number;
  priceChangePercentage7d: number;
  priceChangePercentage30d: number;
  marketCap: number;
  volume: number;
  circulatingSupply: number;
  allTimeHigh: number;
  priceHistory: BitcoinPriceData[];
  loading: boolean;
  error: Error | null;
}

const initialState: BitcoinDataState = {
  currentPrice: 0,
  priceChange24h: 0,
  priceChange7d: 0,
  priceChange30d: 0,
  priceChangePercentage24h: 0,
  priceChangePercentage7d: 0,
  priceChangePercentage30d: 0,
  marketCap: 0,
  volume: 0,
  circulatingSupply: 21000000 * 0.9, // Approximate
  allTimeHigh: 69000, // Approximate
  priceHistory: [],
  loading: true,
  error: null,
};

export function useBitcoinData() {
  const [data, setData] = useState<BitcoinDataState>(initialState);

  useEffect(() => {
    const fetchBitcoinData = async () => {
      try {
        // Use a more conservative approach with error handling and timeouts
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30',
          {
            signal: controller.signal,
            headers: {
              Accept: 'application/json',
            },
          },
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Failed to fetch Bitcoin data: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();

        if (!result || !result.prices || !Array.isArray(result.prices) || result.prices.length === 0) {
          throw new Error('Invalid API response format');
        }

        // Process prices data
        const priceData = result.prices.map((item: [number, number]) => ({
          date: new Date(item[0]),
          price: item[1],
        }));

        // Process market cap data
        const marketCapData = result.market_caps.map((item: [number, number]) => ({
          timestamp: item[0],
          marketCap: item[1],
        }));

        // Process volume data
        const volumeData = result.total_volumes.map((item: [number, number]) => ({
          timestamp: item[0],
          volume: item[1],
        }));

        // Combine the data
        const combinedData: BitcoinPriceData[] = priceData.map((priceItem: { date: Date; price: number }) => {
          const marketCapItem = marketCapData.find(item => item.timestamp === priceItem.date.getTime());

          const volumeItem = volumeData.find(item => item.timestamp === priceItem.date.getTime());

          return {
            date: priceItem.date,
            price: priceItem.price,
            marketCap: marketCapItem ? marketCapItem.marketCap : 0,
            volume: volumeItem ? volumeItem.volume : 0,
          };
        });

        // Ensure we have data before processing
        if (combinedData.length === 0) {
          throw new Error('No data received from API');
        }

        // Get current price (last item in the array)
        const currentPrice = combinedData[combinedData.length - 1]?.price || 0;

        // Calculate price changes
        const last24hIndex = combinedData.length - 24; // Approximation for 24h
        const last7dIndex = combinedData.length - 168; // Approximation for 7 days (24 * 7)
        const last30dIndex = 0; // First item in the 30-day dataset

        const price24hAgo =
          last24hIndex >= 0 && combinedData[last24hIndex]
            ? combinedData[last24hIndex].price
            : combinedData[0]?.price || 0;

        const price7dAgo =
          last7dIndex >= 0 && combinedData[last7dIndex] ? combinedData[last7dIndex].price : combinedData[0]?.price || 0;

        const price30dAgo = combinedData[last30dIndex]?.price || 0;

        const priceChange24h = currentPrice - price24hAgo;
        const priceChange7d = currentPrice - price7dAgo;
        const priceChange30d = currentPrice - price30dAgo;

        const priceChangePercentage24h = price24hAgo !== 0 ? (priceChange24h / price24hAgo) * 100 : 0;
        const priceChangePercentage7d = price7dAgo !== 0 ? (priceChange7d / price7dAgo) * 100 : 0;
        const priceChangePercentage30d = price30dAgo !== 0 ? (priceChange30d / price30dAgo) * 100 : 0;

        // Get current market cap and volume
        const marketCap = combinedData[combinedData.length - 1]?.marketCap || 0;
        const volume = combinedData[combinedData.length - 1]?.volume || 0;

        setData({
          currentPrice,
          priceChange24h,
          priceChange7d,
          priceChange30d,
          priceChangePercentage24h,
          priceChangePercentage7d,
          priceChangePercentage30d,
          marketCap,
          volume,
          circulatingSupply: 19000000, // Approximate value
          allTimeHigh: 69000, // Approximate value
          priceHistory: combinedData,
          loading: false,
          error: null,
        });
      } catch (error) {
        setData(prevState => ({
          ...prevState,
          loading: false,
          error: error instanceof Error ? error : new Error('Unknown error occurred'),
        }));
      }
    };

    fetchBitcoinData();

    // Set up a polling interval to refresh data
    const intervalId = setInterval(fetchBitcoinData, 5 * 60 * 1000); // Every 5 minutes

    return () => clearInterval(intervalId);
  }, []);

  return data;
}
