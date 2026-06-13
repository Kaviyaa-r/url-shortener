// Import React library and useState/useEffect hooks to handle state events
import React, { useState, useEffect } from 'react';
// Import useParams and useNavigate routing hooks from react-router-dom
import { useParams, useNavigate } from 'react-router-dom';
// Import Axios client instance to coordinate API calls
import axios from '../api/axios';
// Import header navigation panel component
import Navbar from '../components/Navbar';
// Import Recharts bar graph wrapper component
import ClickChart from '../components/ClickChart';
// Import graphic and navigation icons from lucide-react library
import { ArrowLeft, MousePointerClick, Calendar, Link as LinkIcon, Globe, Laptop, AlertCircle, BarChart } from 'lucide-react';
// Import toast notification client
import { toast } from 'react-hot-toast';

// Define the Analytics component which presents URL statistics
const Analytics = () => {
  // Extract the shortCode route parameter using useParams
  const { shortCode } = useParams();
  // Instantiate navigation redirect helper
  const navigate = useNavigate();
  // Local state to store analytics data returned from API
  const [analytics, setAnalytics] = useState(null);
  // Local state to track loading indicators
  const [loading, setLoading] = useState(true);
  // Local state to capture API query failure messages
  const [error, setError] = useState(null);

  // Define data fetch routine to fetch analytics from backend
  const fetchAnalytics = async () => {
    // Set loading indicator state to true
    setLoading(true);
    // Clear any previous error states
    setError(null);

    try {
      // Dispatch GET request targeting the specific shortCode analytics prefix
      const response = await axios.get(`/analytics/${shortCode}`);
      // If retrieval completes successfully
      if (response.data.success) {
        // Save retrieved payload to state
        setAnalytics(response.data.data);
      } else {
        // Set query error message state
        setError(response.data.error || 'Failed to fetch analytics');
      }
    } catch (err) {
      // Read response error message or fallback to default string
      const errMsg = err.response?.data?.error || 'Short URL analytics not found.';
      // Set error message state
      setError(errMsg);
      // Fire toast notification alert
      toast.error(errMsg);
    } finally {
      // Deactivate loader skeletons
      setLoading(false);
    }
  };

  // Run data fetch routine on mount or when shortCode parameter shifts
  useEffect(() => {
    fetchAnalytics();
  }, [shortCode]);

  // Date formatter helper to output formatted timestamp text
  const formatDate = (dateString) => {
    // Return placeholder if date string is missing
    if (!dateString) return 'Never';
    // Instantiate date constructor from ISO string
    const date = new Date(dateString);
    // Return formatted date and time string
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Render a clean loading skeleton dashboard matching dark layouts
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white pb-12">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-800 rounded w-1/4"></div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="h-24 bg-slate-800 rounded-xl"></div>
              <div className="h-24 bg-slate-800 rounded-xl"></div>
              <div className="h-24 bg-slate-800 rounded-xl"></div>
            </div>
            <div className="h-64 bg-slate-800 rounded-xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="h-48 bg-slate-800 rounded-xl"></div>
              <div className="h-48 bg-slate-800 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render an error message block if retrieval attempts fail
  if (error || !analytics) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-full mb-4 text-red-400">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Failed to load analytics</h2>
          <p className="text-sm text-slate-400 max-w-sm mb-6">{error || 'Something went wrong.'}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-semibold text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>
    );
  }

  // Calculate browser stats sum to represent scale percentages
  const browserKeys = Object.keys(analytics.browserStats || {});
  const totalBrowserClicks = browserKeys.reduce((sum, key) => sum + analytics.browserStats[key], 0);

  // Extract device count parameters
  const desktopClicks = analytics.deviceStats?.Desktop || 0;
  const mobileClicks = analytics.deviceStats?.Mobile || 0;
  const tabletClicks = analytics.deviceStats?.Tablet || 0;
  const totalDeviceClicks = desktopClicks + mobileClicks + tabletClicks;

  return (
    // Outer content layout styled with dark background slate shades
    <div className="min-h-screen bg-slate-900 text-white pb-12">
      {/* Render Navbar header panel */}
      <Navbar />

      {/* Main analytics board content panel */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Back navigation button trigger */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 mb-6 group"
        >
          {/* Arrow visual icon transitioning left on hover */}
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Dashboard</span>
        </button>

        {/* Dashboard Title section displaying active shortcode */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white">Analytics</h1>
          <p className="mt-1 text-sm text-slate-400">
            Detailed click traffic metrics for shortcode:{' '}
            <span className="text-indigo-400 font-bold tracking-wider">{analytics.shortCode}</span>
          </p>
        </div>

        {/* Metrics overview row cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-5 mb-8">
          {/* Box: Clicks tally */}
          <div className="bg-slate-800 border border-slate-700/60 rounded-xl p-5">
            <div className="flex justify-between items-start text-indigo-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Clicks</span>
              <MousePointerClick className="h-5 w-5" />
            </div>
            <p className="text-3xl font-extrabold text-indigo-400">{analytics.totalClicks}</p>
          </div>

          {/* Box: Last redirection visit date */}
          <div className="bg-slate-800 border border-slate-700/60 rounded-xl p-5">
            <div className="flex justify-between items-start text-green-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Last Visited</span>
              <Calendar className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-white mt-2 truncate">
              {formatDate(analytics.lastVisited)}
            </p>
          </div>

          {/* Box: Creation date */}
          <div className="bg-slate-800 border border-slate-700/60 rounded-xl p-5">
            <div className="flex justify-between items-start text-yellow-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Created Date</span>
              <Calendar className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-white mt-2 truncate">
              {formatDate(analytics.createdAt)}
            </p>
          </div>

          {/* Box: Link target URL */}
          <div className="bg-slate-800 border border-slate-700/60 rounded-xl p-5">
            <div className="flex justify-between items-start text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Original URL</span>
              <LinkIcon className="h-5 w-5" />
            </div>
            {/* Clickable link to original target */}
            <a
              href={analytics.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm font-semibold text-indigo-400 hover:underline mt-2 truncate"
              title={analytics.originalUrl}
            >
              {analytics.originalUrl}
            </a>
          </div>
        </div>

        {/* Graph Layout component */}
        <div className="mb-8">
          <ClickChart data={analytics.dailyClicks} />
        </div>

        {/* Demographic statistics row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Browser analytics card */}
          <div className="bg-slate-800 border border-slate-700/60 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                <Globe className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Browser Stats</h3>
            </div>
            
            {/* Browser list wrapper */}
            {browserKeys.length > 0 ? (
              <div className="space-y-4">
                {browserKeys.map(key => {
                  // Calculate count value
                  const count = analytics.browserStats[key];
                  // Calculate progress percentage
                  const percentage = totalBrowserClicks > 0 ? Math.round((count / totalBrowserClicks) * 100) : 0;
                  
                  return (
                    <div key={key}>
                      {/* Name and stats indicators */}
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="font-semibold text-slate-300">{key}</span>
                        <span className="font-bold text-indigo-400">{count} clicks ({percentage}%)</span>
                      </div>
                      {/* Progress bar container */}
                      <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                        {/* Dynamic progress bar representing browser share */}
                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              // Empty warning message if no browser data exists
              <p className="text-sm text-slate-400 text-center py-6">No browser logs recorded yet.</p>
            )}
          </div>

          {/* Device analytics card */}
          <div className="bg-slate-800 border border-slate-700/60 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                <Laptop className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Device Breakdown</h3>
            </div>

            {/* Render device stats if data exists */}
            {totalDeviceClicks > 0 ? (
              <div className="space-y-4">
                {/* Desktop Stat display block */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-semibold text-slate-300">Desktop</span>
                    <span className="font-bold text-white">{desktopClicks} clicks</span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${totalDeviceClicks > 0 ? (desktopClicks / totalDeviceClicks) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* Mobile Stat display block */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-semibold text-slate-300">Mobile</span>
                    <span className="font-bold text-white">{mobileClicks} clicks</span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${totalDeviceClicks > 0 ? (mobileClicks / totalDeviceClicks) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* Tablet Stat display block */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-semibold text-slate-300">Tablet</span>
                    <span className="font-bold text-white">{tabletClicks} clicks</span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500 rounded-full"
                      style={{ width: `${totalDeviceClicks > 0 ? (tabletClicks / totalDeviceClicks) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ) : (
              // Empty warning message if no device data exists
              <p className="text-sm text-slate-400 text-center py-6">No device logs recorded yet.</p>
            )}
          </div>
        </div>

        {/* Recent visits data table section */}
        <div className="bg-slate-800 border border-slate-700/60 rounded-xl p-6 shadow-lg overflow-hidden">
          {/* Header layout */}
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
              <BarChart className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Recent Visits (Last 20)</h3>
          </div>

          {/* Table container wrapping element for mobile scrollbars */}
          <div className="overflow-x-auto">
            {analytics.recentVisits && analytics.recentVisits.length > 0 ? (
              <table className="min-w-full divide-y divide-slate-700">
                {/* Table Header indicators */}
                <thead className="bg-slate-900/60">
                  <tr>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Time</th>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Browser</th>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Device</th>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Referrer</th>
                  </tr>
                </thead>
                
                {/* Table Body rows */}
                <tbody className="divide-y divide-slate-700/50 bg-slate-800">
                  {/* Map over visits list up to 20 */}
                  {analytics.recentVisits.map((visit, index) => (
                    // Striped dark backgrounds logic
                    <tr key={visit._id} className={index % 2 === 0 ? 'bg-slate-800/40' : 'bg-slate-800/80'}>
                      {/* Visit timestamp */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {formatDate(visit.visitedAt)}
                      </td>
                      {/* Visit browser profile */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {visit.browser}
                      </td>
                      {/* Visit device profile */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {visit.device}
                      </td>
                      {/* Visit referrer origin URL */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 truncate max-w-xs" title={visit.referer}>
                        {visit.referer}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              // Empty warning message if no logs have been recorded
              <p className="text-sm text-slate-400 text-center py-12">No redirects logged for this URL yet.</p>
            )}
          </div>
        </div>

      </main>
    </div>
  );
};

// Export the Analytics page component
export default Analytics;
