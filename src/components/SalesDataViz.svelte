---
// Sales Data Visualization Component
// /components/SalesDataViz.svelte

<script lang="ts">
  import { onMount } from 'svelte';
  
  interface SalesRecord {
    country: string;
    region: string;
    record_count: number;
    total_revenue: number;
    total_units: number;
    categories: number;
    avg_revenue: number;
  }
  
  interface OverallStats {
    total_records: number;
    countries_count: number;
    categories_count: number;
    total_revenue: number;
    total_units: number;
    avg_revenue: number;
    latest_date: string;
    earliest_date: string;
  }
  
  let salesData: SalesRecord[] = [];
  let overallStats: OverallStats | null = null;
  let loading = true;
  let error = '';
  let selectedRegion = 'all';
  let sortBy = 'total_revenue';
  let sortOrder = 'desc';
  
  const regions = ['all', 'North America', 'Europe', 'Asia', 'South America', 'Oceania'];
  
  onMount(async () => {
    await loadSalesData();
  });
  
  async function loadSalesData() {
    try {
      loading = true;
      const response = await fetch('/api/admin/sales-data-import');
      const data = await response.json();
      
      if (data.success) {
        overallStats = data.stats;
        salesData = data.countries || [];
      } else {
        error = data.error || 'Failed to load data';
      }
    } catch (e) {
      error = `Network error: ${e}`;
    } finally {
      loading = false;
    }
  }
  
  $: filteredData = salesData
    .filter(item => selectedRegion === 'all' || item.region === selectedRegion)
    .sort((a, b) => {
      const modifier = sortOrder === 'desc' ? -1 : 1;
      return modifier * (a[sortBy] - b[sortBy]);
    });
  
  function getCountryFlag(country: string): string {
    const flags: Record<string, string> = {
      'USA': '🇺🇸', 'Germany': '🇩🇪', 'Japan': '🇯🇵', 'UK': '🇬🇧',
      'France': '🇫🇷', 'Canada': '🇨🇦', 'Australia': '🇦🇺', 'Brazil': '🇧🇷',
      'India': '🇮🇳', 'China': '🇨🇳', 'Russia': '🇷🇺', 'Italy': '🇮🇹',
      'Spain': '🇪🇸', 'Netherlands': '🇳🇱', 'Sweden': '🇸🇪', 'Norway': '🇳🇴',
      'Mexico': '🇲🇽', 'South Korea': '🇰🇷', 'Singapore': '🇸🇬', 'Switzerland': '🇨🇭'
    };
    return flags[country] || '🌍';
  }
  
  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
  
  function formatNumber(num: number): string {
    return new Intl.NumberFormat('en-US').format(num);
  }
  
  function getRegionColor(region: string): string {
    const colors: Record<string, string> = {
      'North America': 'text-blue-400',
      'Europe': 'text-green-400',
      'Asia': 'text-purple-400',
      'South America': 'text-orange-400',
      'Oceania': 'text-teal-400'
    };
    return colors[region] || 'text-gray-400';
  }
</script>

<div class="sales-viz-container">
  {#if loading}
    <div class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <span class="ml-3 text-gray-300">Loading sales data...</span>
    </div>
  {:else if error}
    <div class="bg-red-900/50 border border-red-500 rounded-lg p-6 text-center">
      <div class="text-red-400 text-4xl mb-2">⚠️</div>
      <h3 class="text-xl text-red-200 mb-2">Error Loading Data</h3>
      <p class="text-red-300">{error}</p>
      <button 
        on:click={loadSalesData}
        class="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        Retry
      </button>
    </div>
  {:else}
    <!-- Overall Stats -->
    {#if overallStats}
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="stat-card bg-blue-800/30 border-blue-500/30">
          <div class="stat-icon text-blue-400">📊</div>
          <div class="stat-content">
            <p class="stat-label text-blue-200">Total Records</p>
            <p class="stat-value text-white">{formatNumber(overallStats.total_records)}</p>
          </div>
        </div>
        
        <div class="stat-card bg-green-800/30 border-green-500/30">
          <div class="stat-icon text-green-400">🌎</div>
          <div class="stat-content">
            <p class="stat-label text-green-200">Countries</p>
            <p class="stat-value text-white">{overallStats.countries_count}</p>
          </div>
        </div>
        
        <div class="stat-card bg-purple-800/30 border-purple-500/30">
          <div class="stat-icon text-purple-400">💰</div>
          <div class="stat-content">
            <p class="stat-label text-purple-200">Total Revenue</p>
            <p class="stat-value text-white">{formatCurrency(overallStats.total_revenue)}</p>
          </div>
        </div>
        
        <div class="stat-card bg-orange-800/30 border-orange-500/30">
          <div class="stat-icon text-orange-400">📦</div>
          <div class="stat-content">
            <p class="stat-label text-orange-200">Units Sold</p>
            <p class="stat-value text-white">{formatNumber(overallStats.total_units)}</p>
          </div>
        </div>
      </div>
    {/if}
    
    <!-- Filters -->
    <div class="filters-section bg-gray-800/50 rounded-lg p-4 mb-6">
      <div class="flex flex-wrap items-center gap-4">
        <div class="filter-group">
          <label class="text-gray-300 text-sm">Region:</label>
          <select bind:value={selectedRegion} class="filter-select">
            {#each regions as region}
              <option value={region}>{region === 'all' ? 'All Regions' : region}</option>
            {/each}
          </select>
        </div>
        
        <div class="filter-group">
          <label class="text-gray-300 text-sm">Sort by:</label>
          <select bind:value={sortBy} class="filter-select">
            <option value="total_revenue">Revenue</option>
            <option value="record_count">Records</option>
            <option value="total_units">Units</option>
            <option value="avg_revenue">Avg Revenue</option>
          </select>
        </div>
        
        <button 
          on:click={() => sortOrder = sortOrder === 'desc' ? 'asc' : 'desc'}
          class="sort-toggle-btn"
        >
          {sortOrder === 'desc' ? '↓' : '↑'} {sortOrder.toUpperCase()}
        </button>
        
        <button 
          on:click={loadSalesData}
          class="refresh-btn"
        >
          🔄 Refresh
        </button>
      </div>
    </div>
    
    <!-- Data Table -->
    <div class="data-table-container">
      <div class="table-header">
        <h2 class="text-xl font-bold text-white">🏆 Sales Performance by Country</h2>
        <p class="text-gray-400">Showing {filteredData.length} countries</p>
      </div>
      
      <div class="table-wrapper">
        <table class="data-table">
          <thead class="table-head">
            <tr>
              <th class="table-th">Country</th>
              <th class="table-th">Region</th>
              <th class="table-th">Records</th>
              <th class="table-th">Revenue</th>
              <th class="table-th">Units</th>
              <th class="table-th">Categories</th>
              <th class="table-th">Avg Revenue</th>
            </tr>
          </thead>
          <tbody class="table-body">
            {#each filteredData as row, index}
              <tr class="table-row">
                <td class="table-td">
                  <div class="country-cell">
                    <span class="country-flag">{getCountryFlag(row.country)}</span>
                    <span class="country-name">{row.country}</span>
                  </div>
                </td>
                <td class="table-td">
                  <span class={`region-badge ${getRegionColor(row.region)}`}>
                    {row.region}
                  </span>
                </td>
                <td class="table-td text-blue-300">{formatNumber(row.record_count)}</td>
                <td class="table-td text-green-300 font-bold">{formatCurrency(row.total_revenue)}</td>
                <td class="table-td text-purple-300">{formatNumber(row.total_units)}</td>
                <td class="table-td text-orange-300">{row.categories}</td>
                <td class="table-td text-yellow-300">{formatCurrency(row.avg_revenue)}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
    
    {#if filteredData.length === 0}
      <div class="no-data-message">
        <div class="text-6xl mb-4">📊</div>
        <h3 class="text-xl text-gray-300 mb-2">No Data Available</h3>
        <p class="text-gray-400">No sales data matches the current filters</p>
      </div>
    {/if}
  {/if}
</div>

<style>
  .sales-viz-container {
    @apply w-full;
  }
  
  .stat-card {
    @apply backdrop-blur-sm rounded-xl p-4 border flex items-center space-x-3;
  }
  
  .stat-icon {
    @apply text-2xl;
  }
  
  .stat-content {
    @apply flex-1;
  }
  
  .stat-label {
    @apply text-xs font-medium;
  }
  
  .stat-value {
    @apply text-lg font-bold;
  }
  
  .filters-section {
    @apply border border-gray-600/30;
  }
  
  .filter-group {
    @apply flex flex-col space-y-1;
  }
  
  .filter-select {
    @apply bg-gray-700 border border-gray-600 text-white px-3 py-1 rounded text-sm focus:outline-none focus:border-blue-500;
  }
  
  .sort-toggle-btn {
    @apply bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors;
  }
  
  .refresh-btn {
    @apply bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors;
  }
  
  .data-table-container {
    @apply bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-600/30 overflow-hidden;
  }
  
  .table-header {
    @apply p-4 border-b border-gray-600/30 flex justify-between items-center;
  }
  
  .table-wrapper {
    @apply overflow-x-auto;
  }
  
  .data-table {
    @apply w-full;
  }
  
  .table-head {
    @apply bg-gray-700/50;
  }
  
  .table-th {
    @apply px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider;
  }
  
  .table-body {
    @apply divide-y divide-gray-600/30;
  }
  
  .table-row {
    @apply hover:bg-gray-700/30 transition-colors;
  }
  
  .table-td {
    @apply px-4 py-3 whitespace-nowrap text-sm;
  }
  
  .country-cell {
    @apply flex items-center space-x-2;
  }
  
  .country-flag {
    @apply text-lg;
  }
  
  .country-name {
    @apply text-white font-medium;
  }
  
  .region-badge {
    @apply font-medium;
  }
  
  .no-data-message {
    @apply text-center py-12;
  }
</style>