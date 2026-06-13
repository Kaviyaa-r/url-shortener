// Import React library and useState hook to manage modal form processes
import React, { useState } from 'react';
// Import control icons from the lucide-react graphics library
import { X, Copy, Check, Loader2, Link as LinkIcon, Sparkles } from 'lucide-react';
// Import the configured Axios instance to trigger API requests
import axios from '../api/axios';
// Import toast notification wrapper
import { toast } from 'react-hot-toast';

// Define the CreateUrlModal overlay component
const CreateUrlModal = ({ isOpen, onClose, onSuccess }) => {
  // Return null immediately if the modal open flag is set to false
  if (!isOpen) return null;

  // Local state to store the long target URL input value
  const [originalUrl, setOriginalUrl] = useState('');
  // Local state to store the custom alias string input value
  const [customAlias, setCustomAlias] = useState('');
  // Local state to store the expiry date string input value
  const [expiresAt, setExpiresAt] = useState('');
  // Local state to track loading indicators during API submissions
  const [loading, setLoading] = useState(false);
  // Local state to hold API error feedback strings
  const [errorMsg, setErrorMsg] = useState('');
  // Local state storing the returned short URL object details on success
  const [successData, setSuccessData] = useState(null);
  // Local state indicating whether the generated short URL has been copied
  const [copied, setCopied] = useState(false);

  // Helper validation logic to check if input is a valid URL format
  const validateUrl = (url) => {
    try {
      // Test URL formatting checks via browser built-in constructor
      new URL(url);
      // Return true if parsing completes successfully
      return true;
    } catch (_) {
      // Return false if URL constructor raises parser errors
      return false;
    }
  };

  // Click handler wrapper to dismiss modal when clicking outside the panel
  const handleBackdropClick = (e) => {
    // If click target matches the overlay background wrapper container itself
    if (e.target === e.currentTarget) {
      // Trigger close callback to dismiss modal
      onClose();
    }
  };

  // Form submit handler to request a new shortened URL
  const handleSubmit = async (e) => {
    // Prevent default form browser reload on submit
    e.preventDefault();
    // Clear any previous error messages
    setErrorMsg('');

    // Check if the originalUrl input value is completely empty
    if (!originalUrl.trim()) {
      // Set validation failure feedback message
      setErrorMsg('Long URL is required');
      // Halt execution
      return;
    }

    // Verify format of the input URL
    if (!validateUrl(originalUrl.trim())) {
      // Set format mismatch warning message
      setErrorMsg('Please enter a valid absolute URL (e.g. https://google.com)');
      // Halt execution
      return;
    }

    // Set loading spinner state to true
    setLoading(true);

    try {
      // Package payload variables
      const payload = {
        originalUrl: originalUrl.trim(),
        customAlias: customAlias.trim() || undefined,
        expiresAt: expiresAt || undefined
      };

      // Dispatch request to create shortened URL
      const response = await axios.post('/urls', payload);

      // If response returns success
      if (response.data.success) {
        // Set success response state data
        setSuccessData(response.data.data);
        // Show success banner notification
        toast.success('URL shortened successfully!');
        // Check if onSuccess callback is defined
        if (onSuccess) {
          // Trigger parent component refresh routine
          onSuccess();
        }
      } else {
        // Print response errors inside modal
        setErrorMsg(response.data.error || 'Failed to shorten URL');
      }
    } catch (err) {
      // Read response error message or fallback to server error string
      const errResponse = err.response?.data?.error || err.response?.data?.message || 'Server error. Please try again.';
      // Set error message state
      setErrorMsg(errResponse);
      // Fire toast notification alert
      toast.error(errResponse);
    } finally {
      // Deactivate submit loader
      setLoading(false);
    }
  };

  // Copy-to-clipboard handler for the generated short URL
  const handleCopy = async () => {
    // Check if successData exists containing the link
    if (successData?.shortUrl) {
      try {
        // Write the short URL string to the system clipboard
        await navigator.clipboard.writeText(successData.shortUrl);
        // Set copied flag state to true
        setCopied(true);
        // Show success alert toast
        toast.success('Short link copied to clipboard!');
        // Set a timeout to reset copied feedback icons after 2 seconds
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        // Show error toast on failure
        toast.error('Failed to copy link');
      }
    }
  };

  // Reset form states to create another shortened URL
  const handleReset = () => {
    // Clear long URL input
    setOriginalUrl('');
    // Clear custom alias input
    setCustomAlias('');
    // Clear expiration date input
    setExpiresAt('');
    // Reset success database state to null
    setSuccessData(null);
    // Reset clipboard copy flag to false
    setCopied(false);
    // Clear validation error strings
    setErrorMsg('');
  };

  return (
    // Backdrop overlay container styled with dark opacity background filters
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
    >
      {/* Modal dialog box card */}
      <div className="relative w-full max-w-lg bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl overflow-hidden">
        
        {/* Absolute top right close trigger */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700"
        >
          {/* Close graphic icon */}
          <X className="h-5 w-5" />
        </button>

        {/* Render Form interface if creation is not completed yet */}
        {!successData ? (
          <div>
            {/* Header section containing labels */}
            <div className="flex items-center gap-2 mb-6">
              {/* Graphic icon wrapper */}
              <div className="p-2 bg-indigo-500/10 rounded-lg">
                {/* Logo icon */}
                <LinkIcon className="h-5 w-5 text-indigo-400" />
              </div>
              {/* Title label */}
              <h3 className="text-xl font-bold text-white">Shorten a URL</h3>
            </div>

            {/* Modal submit form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Target long URL input parameter container */}
              <div>
                {/* Input label */}
                <label className="block text-sm font-medium text-slate-300 mb-1" htmlFor="modal-long-url">
                  Long URL <span className="text-red-500">*</span>
                </label>
                {/* Long URL text input component */}
                <input
                  id="modal-long-url"
                  type="text"
                  value={originalUrl}
                  // Set value change handler to update state on input
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="https://example.com/very/long/path/to/resource"
                />
              </div>

              {/* Custom Alias input parameter container */}
              <div>
                {/* Input label */}
                <label className="block text-sm font-medium text-slate-300 mb-1" htmlFor="modal-alias">
                  Custom Alias <span className="text-xs text-slate-500">(Optional)</span>
                </label>
                {/* Custom alias text input component */}
                <input
                  id="modal-alias"
                  type="text"
                  value={customAlias}
                  // Set value change handler to update state on input
                  onChange={(e) => setCustomAlias(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="my-brand"
                />
              </div>

              {/* Expiration Date input parameter container */}
              <div>
                {/* Input label */}
                <label className="block text-sm font-medium text-slate-300 mb-1" htmlFor="modal-expiry">
                  Expiry Date <span className="text-xs text-slate-500">(Optional)</span>
                </label>
                {/* Date input component */}
                <input
                  id="modal-expiry"
                  type="date"
                  value={expiresAt}
                  // Set value change handler to update state on input
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Tally error display box */}
              {errorMsg && (
                <p className="text-sm text-red-500 font-medium">{errorMsg}</p>
              )}

              {/* Submit and close buttons row */}
              <div className="flex gap-3 justify-end mt-6">
                {/* Cancel button */}
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-700 hover:bg-slate-700 rounded-lg text-sm font-semibold text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                {/* Shorten submission trigger button */}
                <button
                  type="submit"
                  // Disable interaction during loading
                  disabled={loading}
                  className="flex items-center justify-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-semibold text-white"
                >
                  {loading ? (
                    // Loader animation
                    <Loader2 className="animate-spin h-4 w-4" />
                  ) : (
                    // Standard action layout
                    <>
                      {/* Graphics icon decoration */}
                      <Sparkles className="h-4 w-4" />
                      <span>Shorten Link</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          // Render Success Screen after short URL is returned
          <div className="text-center py-4">
            {/* Header decoration containing check icons */}
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-500/10 mb-4">
              {/* Check mark graphics */}
              <Check className="h-6 w-6 text-green-500" />
            </div>
            {/* Action complete title */}
            <h3 className="text-xl font-bold text-white mb-2">Short Link Generated!</h3>
            {/* Brief tag */}
            <p className="text-sm text-slate-400 mb-6">Your premium short URL is ready to share.</p>

            {/* Link display container */}
            <div className="flex items-center gap-2 p-3 bg-slate-900 border border-slate-700 rounded-lg mb-6">
              {/* Readonly output link field */}
              <input
                type="text"
                readOnly
                value={successData.shortUrl}
                className="w-full bg-transparent border-none text-indigo-400 font-semibold text-sm focus:outline-none focus:ring-0"
              />
              {/* Copy URL clipboard action button */}
              <button
                onClick={handleCopy}
                className={`p-2 rounded-lg border ${copied ? 'border-green-500/30 bg-green-500/10 text-green-400' : 'border-slate-700 hover:bg-slate-700 text-slate-400 hover:text-white'}`}
              >
                {copied ? (
                  // Checked checkmark feedback icon
                  <Check className="h-4 w-4" />
                ) : (
                  // Uncopied copy icon
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Success screen action buttons footer */}
            <div className="flex gap-3 justify-center">
              {/* Shorten another link button */}
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-semibold text-white"
              >
                Shorten Another
              </button>
              {/* Close modal wrapper button */}
              <button
                onClick={onClose}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-semibold text-white"
              >
                Done
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

// Export the CreateUrlModal overlay component
export default CreateUrlModal;
