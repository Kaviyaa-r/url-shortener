// Import React core library and useState/useEffect hooks to manage states
import React, { useState, useEffect } from 'react';
// Import Axios client instance to communicate with API endpoints
import axios from '../api/axios';
// Import header navbar layout component
import Navbar from '../components/Navbar';
// Import individual shortcode display card component
import UrlCard from '../components/UrlCard';
// Import modal overlay to shorten URLs
import CreateUrlModal from '../components/CreateUrlModal';
// Import modal overlay to view QR codes
import QRModal from '../components/QRModal';
// Import graphic icons from lucide-react library
import { Link as LinkIcon, MousePointerClick, Activity, Search, Plus, Sparkles, AlertCircle } from 'lucide-react';
// Import toast notifications client
import { toast } from 'react-hot-toast';

// Define the Dashboard component
const Dashboard = () => {
  // Local state to store retrieved list of user URLs
  const [urls, setUrls] = useState([]);
  // Local state to track loading indicators
  const [loading, setLoading] = useState(true);
  // Local state to control visibility of URL creation modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  // Local state to control visibility of QR code viewing modal
  const [isQROpen, setIsQROpen] = useState(false);
  // Local state to hold current selected link string for QR code generation
  const [selectedQRUrl, setSelectedQRUrl] = useState('');
  // Local state to track text inputs in search bar
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch URLs created by the current user from backend
  const fetchUrls = async () => {
    try {
      // Fire GET request to backend URL endpoint
      const response = await axios.get('/urls');
      // If retrieval completes successfully
      if (response.data.success) {
        // Assign retrieved list array to state
        setUrls(response.data.data);
      }
    } catch (err) {
      // Show error toast message on failure
      toast.error('Failed to load short URLs.');
    } finally {
      // Deactivate page-wide loader spinner
      setLoading(false);
    }
  };

  // Run data fetch routine once on mount
  useEffect(() => {
    fetchUrls();
  }, []);

  // Delete callback to remove link records by Mongo ID
  const handleDelete = async (urlId) => {
    try {
      // Dispatch DELETE request targeting the URL MongoDB ID parameter
      const response = await axios.delete(`/urls/${urlId}`);
      // If delete transaction returns success status
      if (response.data.success) {
        // Show success alert toast
        toast.success(response.data.message || 'URL deleted successfully.');
        // Refresh local URL dataset from database
        fetchUrls();
      } else {
        // Display error message
        toast.error(response.data.error || 'Failed to delete short URL.');
      }
    } catch (err) {
      // Extract response error messages or fall back to string
      const errMsg = err.response?.data?.error || 'Failed to delete short link.';
      // Display error inside toast popups
      toast.error(errMsg);
    }
  };

  // Open QR Code popup utility
  const handleShowQR = (shortUrl) => {
    // Save target short link to state
    setSelectedQRUrl(shortUrl);
    // Open QR Code modal
    setIsQROpen(true);
  };

  // Tally stats aggregates by mapping over the local urls array
  const totalUrls = urls.length;
  // Calculate click sums using Array reduce
  const totalClicks = urls.reduce((sum, item) => sum + (item.clickCount || 0), 0);
  // Calculate active links filtering items that are active and not expired yet
  const activeLinks = urls.filter(item => {
    // Verify general status flag
    const isActive = item.isActive;
    // Verify if expiration date does not exist or sits in the future
    const isNotExpired = !item.expiresAt || new Date(item.expiresAt) > new Date();
    // Return aggregate bool status
    return isActive && isNotExpired;
  }).length;

  // Filter local URLs list based on search bar entries
  const filteredUrls = urls.filter(url =>
    // Search target matches original link text
    url.originalUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
    // Or target matches shortcode string
    url.shortCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Skeleton Card loading layout structure displaying animated pulse frames
  const SkeletonCard = () => (
    <div className="bg-slate-800 border border-slate-700/50 rounded-xl p-4 animate-pulse">
      {/* Short description bar */}
      <div className="h-3 bg-slate-700 rounded w-3/4 mb-3"></div>
      {/* Header bar */}
      <div className="h-5 bg-slate-700 rounded w-1/2 mb-3"></div>
      {/* Timestamp label bar */}
      <div className="h-3 bg-slate-700 rounded w-1/3 mb-4"></div>
      {/* Bottom actions row placeholder */}
      <div className="flex justify-between items-center pt-3 border-t border-slate-700/50">
        {/* Buttons outline blocks */}
        <div className="flex gap-2">
          <div className="h-7 bg-slate-700 rounded w-14"></div>
          <div className="h-7 bg-slate-700 rounded w-10"></div>
          <div className="h-7 bg-slate-700 rounded w-12"></div>
        </div>
        {/* Trash button outline block */}
        <div className="h-7 bg-slate-700 rounded w-7"></div>
      </div>
    </div>
  );

  return (
    // Outer content layout styled with dark background slate shades
    <div className="min-h-screen bg-slate-900 text-white pb-12">
      {/* Render Navbar header panel */}
      <Navbar />

      {/* Main dashboard content dashboard box layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Title header bar and create link trigger */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            {/* Title heading */}
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Dashboard</h1>
            {/* Subheading tag */}
            <p className="mt-1.5 text-sm text-slate-400">Manage your shortened URLs and monitor redirect counts.</p>
          </div>
          
          {/* Create shortened URL trigger button */}
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center justify-center gap-1.5 self-start sm:self-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-sm font-semibold rounded-lg shadow-md transition-colors"
          >
            {/* Graphic icon decoration */}
            <Plus className="h-5 w-5" />
            <span>Shorten URL</span>
          </button>
        </div>

        {/* Aggregate statistics row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {/* Stat Box: Total URLs Created */}
          <div className="bg-slate-800 border border-slate-700/60 rounded-xl p-5 flex items-center gap-4">
            {/* Icon wrapper styled with custom indigo theme background */}
            <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-400">
              <LinkIcon className="h-6 w-6" />
            </div>
            <div>
              {/* Stat metadata descriptor label */}
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total URLs</p>
              {/* Stat count value */}
              <p className="text-2xl font-bold text-white mt-1">{totalUrls}</p>
            </div>
          </div>

          {/* Stat Box: Total click counts */}
          <div className="bg-slate-800 border border-slate-700/60 rounded-xl p-5 flex items-center gap-4">
            {/* Icon wrapper styled with custom green background */}
            <div className="p-3 bg-green-500/10 rounded-lg text-green-400">
              <MousePointerClick className="h-6 w-6" />
            </div>
            <div>
              {/* Stat metadata descriptor label */}
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Clicks</p>
              {/* Stat count value */}
              <p className="text-2xl font-bold text-white mt-1">{totalClicks}</p>
            </div>
          </div>

          {/* Stat Box: Active links */}
          <div className="bg-slate-800 border border-slate-700/60 rounded-xl p-5 flex items-center gap-4">
            {/* Icon wrapper styled with custom yellow background */}
            <div className="p-3 bg-yellow-500/10 rounded-lg text-yellow-400">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              {/* Stat metadata descriptor label */}
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Links</p>
              {/* Stat count value */}
              <p className="text-2xl font-bold text-white mt-1">{activeLinks}</p>
            </div>
          </div>
        </div>

        {/* Search bar and control panel */}
        <div className="relative mb-6">
          {/* Magnifying glass graphic icon positioned inside input border */}
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Search className="h-5 w-5" />
          </div>
          {/* Main search text input field */}
          <input
            type="text"
            value={searchQuery}
            // Set value update handler
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="Search and filter by original URL..."
          />
        </div>

        {/* Render loading skeletons if loading state is set to true */}
        {loading ? (
          // Render a grid showing 3 loading skeleton placeholders
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          // Render data content once loaders deactivate
          <>
            {/* Render Empty State if no URLs match filtered search criteria */}
            {filteredUrls.length === 0 ? (
              // Empty panel styled with dashed borders and centered icons
              <div className="flex flex-col items-center justify-center border border-dashed border-slate-700 bg-slate-800/20 rounded-2xl py-16 px-4 text-center">
                {/* Visual icon container */}
                <div className="p-4 bg-slate-800 border border-slate-700 rounded-full mb-4 text-slate-500">
                  <LinkIcon className="h-8 w-8" />
                </div>
                {/* Heading label */}
                <h3 className="text-lg font-bold text-white mb-1">No links yet</h3>
                {/* Subtitle helper description */}
                <p className="text-sm text-slate-400 max-w-sm mb-6">
                  {searchQuery ? 'No results found matching your search filter.' : 'Create your first short URL to track analytics.'}
                </p>
                
                {/* Fallback button to create url if dataset is empty */}
                {!searchQuery && (
                  <button
                    onClick={() => setIsCreateOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-semibold text-white shadow-md transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Shorten URL</span>
                  </button>
                )}
              </div>
            ) : (
              // Render URL Cards list grid if data results exist
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Map over filteredUrls to print UrlCards */}
                {filteredUrls.map(item => (
                  <UrlCard
                    key={item._id}
                    url={item}
                    // Pass delete handler callback
                    onDelete={handleDelete}
                    // Pass QR code view handler callback
                    onShowQR={handleShowQR}
                  />
                ))}
              </div>
            )}
          </>
        )}

      </main>

      {/* URL Creation Modal component wrapper */}
      <CreateUrlModal
        isOpen={isCreateOpen}
        // Bind close callback to set toggle state to false
        onClose={() => setIsCreateOpen(false)}
        // Bind success callback to refresh local URLs list
        onSuccess={fetchUrls}
      />

      {/* QR Code display Modal component wrapper */}
      <QRModal
        isOpen={isQROpen}
        // Bind close callback to set toggle state to false
        onClose={() => setIsQROpen(false)}
        // Pass target short link
        shortUrl={selectedQRUrl}
      />
    </div>
  );
};

// Export the Dashboard page component
export default Dashboard;
