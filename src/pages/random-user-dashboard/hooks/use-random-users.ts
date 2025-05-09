// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { useState, useEffect, useCallback } from 'react';
import { RandomUser, RandomUserFilter, RandomUserResponse } from '../types';

export function useRandomUsers() {
  const [users, setUsers] = useState<RandomUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<RandomUserFilter>({
    resultsCount: 25, // Increased for table view
  });

  const fetchUsers = useCallback(
    async (forceRefresh = false) => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        params.append('results', `${filter.resultsCount || 25}`);

        if (filter.gender) {
          params.append('gender', filter.gender);
        }

        if (filter.nationality) {
          params.append('nat', filter.nationality);
        }

        // Add a seed for consistent results unless forcing a refresh
        if (!forceRefresh) {
          params.append('seed', 'cloudscape-demo');
        }

        const response = await fetch(`https://randomuser.me/api/?${params.toString()}`);

        if (!response.ok) {
          throw new Error(`API response error: ${response.status}`);
        }

        const data: RandomUserResponse = await response.json();
        setUsers(data.results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    },
    [filter],
  );

  // Fetch users when filter changes
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    filter,
    setFilter,
    refreshUsers: () => fetchUsers(true),
  };
}
