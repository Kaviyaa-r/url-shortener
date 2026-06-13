// Import the Url mongoose model to verify shortCode ownership
const Url = require('../models/Url');
// Import the Visit mongoose model to query click tracking metrics
const Visit = require('../models/Visit');

// Fetch analytics breakdown for a single shortened URL
exports.getAnalytics = async (req, res, next) => {
  // Extract shortCode parameter from the path
  const { shortCode } = req.params;
  // Retrieve current user ID from decoded JWT payload
  const userId = req.user.id || req.user._id;

  try {
    // Find URL details using the shortCode
    const url = await Url.findOne({ shortCode });

    // Return 404 response if the shortCode does not exist
    if (!url) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Short URL not found',
        error: 'Not Found'
      });
    }

    // Verify if the current user is the owner of the URL
    if (url.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        data: null,
        message: 'You are not authorized to view analytics for this URL',
        error: 'Forbidden'
      });
    }

    // Fetch all visit logs associated with this URL, sorted by date descending
    const visits = await Visit.find({ url: url._id }).sort({ visitedAt: -1 });

    // Get the most recent 20 visit logs
    const recentVisits = visits.slice(0, 20);

    // Initialize map of weekday names for daily aggregation
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    // Initialize temporary helper array to build the last 7 days in order
    const last7Days = [];
    // Key-value map to hold click counts per date string
    const dateCounts = {};

    // Generate date strings for the last 7 calendar days
    for (let i = 6; i >= 0; i--) {
      // Instantiate a date object pointing to today
      const date = new Date();
      // Shift date backwards by i days
      date.setDate(date.getDate() - i);
      // Get the readable weekday abbreviation (e.g. Mon, Tue)
      const dayLabel = daysOfWeek[date.getDay()];
      // Generate a timezone-safe key (toDateString ignores time details)
      const dateKey = date.toDateString();

      // Push initial data structure
      last7Days.push({
        date: dayLabel,
        dateKey: dateKey
      });

      // Default count to 0 in lookup map
      dateCounts[dateKey] = 0;
    }

    // Initialize browser and device counters
    const browserStats = {};
    const deviceStats = {};

    // Traverse all visit logs to tally analytics parameters
    visits.forEach(visit => {
      // Extract client browser name, default to Unknown if empty
      const browser = visit.browser || 'Unknown';
      // Tally browser frequency
      browserStats[browser] = (browserStats[browser] || 0) + 1;

      // Extract client device category, default to Desktop if empty
      const device = visit.device || 'Desktop';
      // Tally device frequency
      deviceStats[device] = (deviceStats[device] || 0) + 1;

      // Extract the visit calendar date as a string
      const visitDateKey = new Date(visit.visitedAt).toDateString();
      // Increment daily click count if visit falls in the last 7 days window
      if (visitDateKey in dateCounts) {
        dateCounts[visitDateKey]++;
      }
    });

    // Construct the final dailyClicks response array matching requirements format
    const dailyClicks = last7Days.map(day => ({
      date: day.date,
      count: dateCounts[day.dateKey]
    }));

    // Package analytics data object
    const analyticsData = {
      totalClicks: url.clickCount,
      lastVisited: url.lastVisited,
      createdAt: url.createdAt,
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      recentVisits,
      dailyClicks,
      browserStats,
      deviceStats
    };

    // Return the analytics data with success header
    return res.status(200).json({
      success: true,
      data: analyticsData,
      message: 'Analytics retrieved successfully',
      error: null
    });
  } catch (error) {
    // Forward error to global handler
    next(error);
  }
};
