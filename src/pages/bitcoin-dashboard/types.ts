// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

export interface CurrencyData {
  code: string;
  symbol: string;
  rate: string;
  description: string;
  rate_float: number;
}

export interface BitcoinPriceIndex {
  USD: CurrencyData;
  GBP: CurrencyData;
  EUR: CurrencyData;
}

export interface BitcoinPriceResponse {
  time: {
    updated: string;
    updatedISO: string;
    updateduk: string;
  };
  disclaimer: string;
  chartName: string;
  bpi: BitcoinPriceIndex;
}

export interface PriceHistory {
  currency: string;
  timestamp: string;
  price: number;
}
