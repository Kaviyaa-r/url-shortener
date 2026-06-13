// Import React library to render components
import React from 'react';
// Import QRCodeSVG component from qrcode.react library
import { QRCodeSVG } from 'qrcode.react';
// Import graphic icons from lucide-react library
import { X, Download, QrCode } from 'lucide-react';
// Import toast notification helper
import { toast } from 'react-hot-toast';

// Define the QRModal component which overlays a QR code popup
const QRModal = ({ isOpen, onClose, shortUrl }) => {
  // Return null immediately if the modal open state is set to false
  if (!isOpen) return null;

  // Handler to convert QRCodeSVG to a PNG image and trigger local download
  const handleDownload = () => {
    // Locate the SVG node element by ID
    const svgElement = document.getElementById('snaplink-qr-svg');
    // Abort if the target SVG node element is missing
    if (!svgElement) {
      toast.error('QR code element not found.');
      return;
    }

    try {
      // Serialize the XML markup from target SVG node
      const svgString = new XMLSerializer().serializeToString(svgElement);
      // Create a Blob containing raw SVG string data formatted as image/svg+xml
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      // Create a local blob resource URL mapping to the Blob
      const blobURL = window.URL.createObjectURL(svgBlob);
      // Create a new offscreen HTML Image constructor
      const image = new Image();

      // Configure image load listener to convert image format
      image.onload = () => {
        // Create a temporary offscreen Canvas element
        const canvas = document.createElement('canvas');
        // Define canvas width matching QR SVG size requirements
        canvas.width = 200;
        // Define canvas height matching QR SVG size requirements
        canvas.height = 200;
        // Retrieve the 2D rendering context from canvas
        const context = canvas.getContext('2d');
        
        // Draw the loaded SVG image onto the 2D canvas context
        context.drawImage(image, 0, 0, 200, 200);
        // Convert canvas contents to a base64 encoded PNG data URI string
        const pngURL = canvas.toDataURL('image/png');
        // Create an offscreen anchor download link helper
        const downloadLink = document.createElement('a');

        // Bind image reference to link target
        downloadLink.href = pngURL;
        // Set filename property
        downloadLink.download = 'snaplink-qr.png';
        // Append anchor node to browser document body
        document.body.appendChild(downloadLink);
        // Trigger programmatic click event to prompt download dialog
        downloadLink.click();
        // Remove link helper node from browser document body
        document.body.removeChild(downloadLink);
        // Revoke the temporary local blob URL to free system memory
        window.URL.revokeObjectURL(blobURL);
      };

      // Set target source of offscreen image to blob URL to trigger load sequence
      image.src = blobURL;
    } catch (err) {
      // Print conversion errors
      console.error('QR Code download failed:', err);
      // Fire error toast message
      toast.error('Failed to download QR code image.');
    }
  };

  // Click handler to close modal when clicking outside the main card panel
  const handleBackdropClick = (e) => {
    // If click target matches the overlay background container
    if (e.target === e.currentTarget) {
      // Close modal
      onClose();
    }
  };

  return (
    // Backdrop dark wrapper layout styled with backdrop blur effects
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
    >
      {/* Modal structure container */}
      <div className="relative w-full max-w-sm bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl">
        
        {/* Close action trigger button in top right corner */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700"
          title="Close Modal"
        >
          {/* Close visual graphic icon */}
          <X className="h-5 w-5" />
        </button>

        {/* Modal headers section */}
        <div className="flex items-center gap-2 mb-6">
          {/* Logo icon wrapper */}
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            {/* Logo icon */}
            <QrCode className="h-5 w-5 text-indigo-400" />
          </div>
          {/* Title heading */}
          <h3 className="text-xl font-bold text-white">QR Code</h3>
        </div>

        {/* QR Code graphic body panel */}
        <div className="flex flex-col items-center justify-center p-4 bg-slate-900/50 border border-slate-700/50 rounded-xl mb-6">
          {/* Render target QRCodeSVG from qrcode.react */}
          <QRCodeSVG
            id="snaplink-qr-svg"
            value={shortUrl}
            size={200}
            bgColor="#1e293b" // Slate-800 matching background styling
            fgColor="#ffffff" // White matching contrast colors
            level="H" // High error correction level for reliable scanning
            includeMargin={true} // Add margin around code matrix
          />
          
          {/* Short URL link text display */}
          <p className="mt-4 text-xs font-semibold text-indigo-400 select-all tracking-wide break-all text-center">
            {shortUrl}
          </p>
        </div>

        {/* Action button triggers row */}
        <div className="flex gap-3">
          {/* Cancel button */}
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-slate-700 hover:bg-slate-700 rounded-lg text-xs font-semibold text-slate-300 hover:text-white"
          >
            Close
          </button>
          
          {/* Download button trigger */}
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-xs font-semibold text-white"
          >
            {/* Download graphic icon */}
            <Download className="h-4 w-4" />
            <span>Download PNG</span>
          </button>
        </div>

      </div>
    </div>
  );
};

// Export the QRModal component
export default QRModal;
