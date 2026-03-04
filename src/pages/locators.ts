// @ts-nocheck
// src/pages/locators.js
export const locators = {
  insightsNav: (page) => page.getByTestId('/insights'),
  channelsTab: (page) => page.getByText('Channels', { exact: true }),
  videosTab: (page) => page.getByText('Videos', { exact: true }),

  skipForNow: (page) => page.getByText('Skip for now').first(),

  searchChannels: (page) => page.getByRole('searchbox', { name: 'Search Channels' }),

  channelNameExact: (page, name) => page.getByText(name, { exact: true }).first(),

  page3: (page) => page.getByRole('button', { name: 'Page 3' }),

  page200: (page) => page.getByRole('button', { name: 'Page 200' }),

  // Filters
  filtersPopoverButton: (page) => page.getByText('Filters').first(),
  filtersMinCpv: (page) => page.locator('[id="ads_stats.average_cpv"]').getByText('Min'),
  filtersMinCpm: (page) => page.locator('[id="ads_stats.average_cpm"]').getByText('Min'),
  filtersMinCtrV: (page) => page.locator('[id="ads_stats.ctr_v"]').getByText('Min'),
  filtersMinCtr: (page) => page.locator('[id="ads_stats.ctr"]').getByText('Min'),
  filtersMinVideoViewRate: (page) => page.locator('[id="ads_stats.video_view_rate"]').getByText('Min'),
  filtersMinVideoViewRate: (page) => page.locator('[id="ads_stats.video_view_rate"]').getByText('Min'),
  filtersMinSubscribers: (page) => page.locator('[id="stats.last_30day_subscribers"] > .holder.min'),
  filtersMinViews: (page) => page.locator('[id="stats.last_30day_views"] > .holder.min'),
  filtersMinViewsPerVideo: (page) => page.locator('[id="stats.views_per_video"] > .holder.min'),

  filtersApplyButton: (page) => page.getByText('Apply Filters'),
  filtersResetButton: (page) => page.getByText('Reset'),
  filtersResetAllButton: (page) => page.getByText('All'),

  filtersYesButton: (page) => page.getByText(/^Yes\s*\(/),
  filtersNoButton: (page) => page.getByText(/^No\s*\(/),

  // Videos tab
  searchVideos: (page) => page.getByRole('searchbox', { name: 'Search Videos' }),

  filterVideosTotal: (page) => page.locator('[id="stats.views"]').getByText('Min', { exact: true }),
  filterVideosDaily: (page) => page.locator('[id="stats.last_day_views"]').getByText('Min', { exact: true }),
  filterVideosSubscribers: (page) => page.locator('[id="stats.channel_subscribers"]').getByText('Min', { exact: true }),

  


};