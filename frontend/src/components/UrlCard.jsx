// Import React library and useState hook to manage copy and delete actions
import React, { useState } from 'react';
// Import useNavigate hook to redirect pages to the analytics dashboard
import { useNavigate } from 'react-router-dom';
// Import graphics and layout icons from the lucide-react library
import { Copy, Check, QrCode, BarChart3, Trash2, Calendar, MousePointerClick } from 'lucide-react';
// Import toast notification client to present alert banners
import { toast } from 'react-hot-toast';

// Define the UrlCard component which renders information for each link
const UrlCard = ({ url, onDelete, onShowQR }) => {
  // Local state to manage copy action status feedback
  const [copied, setCopied] = useState(false);
  // Local state to indicate if deletion process is loading
  const [deleting, setDeleting] = useState(false);
  // Instantiate navigate hook to route views
  const navigate = useNavigate();

  // Format creation timestamp into readable layout (e.g. Jan 12, 2026)
  const formatDate = (dateString) => {
    // Instantiate date constructor from ISO string
    const date = new Date(dateString);
    // Return formatted string matching local specifications
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Copy handler to send the shortened link directly to system clipboard
  const handleCopy = async () => {
    try {
      // Write shortUrl string parameter to system clipboard
      await navigator.clipboard.writeText(url.shortUrl);
      // Set copied feedback flag state to true
      setCopied(true);
      // Show success alert toast
      toast.success('Copied to clipboard!');
      // Reset copied state back to false after 2 seconds to restore copy icon
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Show error toast on copy failure
      toast.error('Failed to copy link');
    }
  };

  // Delete handler triggered when pressing trash icon
  const handleDelete = async () => {
    // Present browser native confirm overlay dialog before deleting URL
    const confirmDelete = window.confirm('Are you absolutely sure you want to delete this short URL and all associated visit metrics?');
    
    // Halt deletion process if user cancels the confirmation
    if (!confirmDelete) return;

    // Set local deleting loader flag to true
    setDeleting(true);

    try {
      // Trigger parent callback function passing target URL Mongo ID
      await onDelete(url._id);
    } catch (err) {
      // Catch exceptions and log them
      console.error('Delete error inside card component:', err);
    } finally {
      // Set local deleting loader flag back to false
      setDeleting(false);
    }
  };

  return (
    // Card outer wrapper container with dark backgrounds, custom borders, and hover effects
    <div className="bg-slate-800 border border-slate-700 hover:border-indigo-500 rounded-xl p-4 shadow-md transition-all duration-300">
      {/* Upper section containing title headers and click counter badges */}
      <div className="flex justify-between items-start gap-4 mb-3">
        {/* URL content title block */}
        <div className="min-w-0 flex-1">
          {/* Truncated original URL heading */}
          <p className="text-xs font-medium text-slate-400 truncate mb-1" title={url.originalUrl}>
            {url.originalUrl}
          </p>
          {/* Output Short Link title */}
          <a
            href={url.shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base font-bold text-indigo-400 hover:text-indigo-300 break-all"
          >
            {url.shortUrl}
          </a>
        </div>
        
        {/* Click count pill badge */}
        <div className="flex items-center gap-1 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full text-indigo-400 shrink-0">
          {/* Mouse pointer cursor visual icon */}
          <MousePointerClick className="h-3.5 w-3.5" />
          {/* Aggregate clicks count */}
          <span className="text-xs font-bold">{url.clickCount}</span>
        </div>
      </div>

      {/* Timestamp section displaying calendar details */}
      <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4 border-b border-slate-700/50 pb-3">
        {/* Calendar visual icon */}
        <Calendar className="h-3.5 w-3.5" />
        {/* Date string */}
        <span>Created: {formatDate(url.createdAt)}</span>
        
        {/* Optional expiration badge indicator */}
        {url.expiresAt && (
          // Expiry marker showing date limitations
          <span className="ml-auto text-[10px] bg-red-500/10 border border-red-500/20 text-red-400 px-2 py-0.5 rounded">
            Expires: {formatDate(url.expiresAt)}
          </span>
        )}
      </div>

      {/* Button action controls footer row */}
      <div className="flex justify-between items-center gap-2">
        {/* Standard operational actions group */}
        <div className="flex gap-2">
          {/* Clipboard Copy link button */}
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border ${copied ? 'border-green-500/30 bg-green-500/10 text-green-400' : 'border-slate-700 hover:bg-slate-700 text-slate-300 hover:text-white'}`}
            title="Copy Short URL"
          >
            {copied ? (
              // Success feedback check mark icon
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              // Standard copy clipboard icon
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          {/* View QR Code button */}
          <button
            // Bind click to callback passing short link
            onClick={() => onShowQR(url.shortUrl)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-700 hover:bg-slate-700 text-slate-300 hover:text-white"
            title="Generate QR Code"
          >
            {/* QR Code visual icon */}
            <QrCode className="h-3.5 w-3.5" />
            <span>QR</span>
          </button>

          {/* Navigate to Analytics detail board button */}
          <button
            // Route user towards /analytics/shortCode view
            onClick={() => navigate(`/analytics/${url.shortCode}`)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-700 hover:bg-slate-700 text-slate-300 hover:text-white"
            title="View Analytics"
          >
            {/* Chart graphical icon */}
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Stats</span>
          </button>
        </div>

        {/* Delete link action button */}
        <button
          onClick={handleDelete}
          // Disable click action during deletions
          disabled={deleting}
          className="p-1.5 rounded-lg border border-slate-700 hover:border-red-500/50 text-slate-400 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Delete Short URL"
        >
          {deleting ? (
            // Spinner animation during deletions
            <div className="animate-spin h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full"></div>
          ) : (
            // Trash graphical icon
            <Trash2 className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
};

// Export the UrlCard component
export default UrlCard;
