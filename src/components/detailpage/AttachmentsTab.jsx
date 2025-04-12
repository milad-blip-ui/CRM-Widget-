import React, { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const FileIcon = ({ extension }) => {
  const iconClass = {
    pdf: 'far fa-file-pdf text-red-500',
    doc: 'far fa-file-word text-blue-500',
    docx: 'far fa-file-word text-blue-500',
    xls: 'far fa-file-excel text-green-500',
    xlsx: 'far fa-file-excel text-green-500',
    png: 'far fa-file-image text-purple-500',
    jpg: 'far fa-file-image text-purple-500',
    jpeg: 'far fa-file-image text-purple-500',
    gif: 'far fa-file-image text-purple-500',
    txt: 'far fa-file-alt text-gray-500',
    default: 'far fa-file text-gray-400'
  };

  return <i className={iconClass[extension] || iconClass.default} />;
};

const AttachmentsTab = ({ estimate }) => {
  const [activeTab, setActiveTab] = useState('customer');
  const [previewFile, setPreviewFile] = useState(null);
  const [fileType, setFileType] = useState('');
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfError, setPdfError] = useState(false);
  const [zoom, setZoom] = useState(1);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getFileUrl = (attachment) => {
    return attachment.file?.url || attachment.fileURL || '';
  };

  const handleFileClick = (attachment) => {
    const fileName = attachment.fileName || '';
    const fileExtension = fileName.split('.').pop().toLowerCase();
    const fileUrl = getFileUrl(attachment);

    setPreviewFile({ ...attachment, url: fileUrl });
    setPdfError(false);

    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension)) {
      setFileType('image');
    } else if (fileExtension === 'pdf') {
      setFileType('pdf');
    } else if (['doc', 'docx', 'txt'].includes(fileExtension)) {
      setFileType('document');
    } else {
      setFileType('unsupported');
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const closeModal = () => {
    setPreviewFile(null);
    setFileType('');
    setPageNumber(1);
  };

  const renderFilePreview = () => {
    if (!previewFile) return null;

    switch (fileType) {
      case 'image':
        return (
          <div className="relative h-full flex items-center justify-center">
            <img 
              src={previewFile.url} 
              alt="Preview" 
              style={{ transform: `scale(${zoom})` }}
              className="max-h-[90vh] max-w-full object-contain transition-transform duration-200"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'path-to-fallback-image.png';
              }}
            />
          </div>
        );
      case 'pdf':
        return (
          <div className="w-full">
            <Document
              file={previewFile.url}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={() => setPdfError(true)}
              loading={<div className="text-center py-8">Loading PDF...</div>}
              error={<div className="text-center py-8 text-red-500">Error loading PDF</div>}
            >
              <div className="flex flex-col items-center space-y-4">
                {Array.from(new Array(numPages), (el, index) => (
                  <div key={`page_${index + 1}`} className="flex justify-center">
                    <Page 
                      pageNumber={index + 1}
                      width={Math.min(window.innerWidth * 0.9, 800) * zoom}
                      loading={<div className="text-center py-4">Loading page {index + 1}...</div>}
                    />
                  </div>
                ))}
              </div>
            </Document>
          </div>
        );
      case 'document':
        return (
          <div className="w-full h-full">
            <iframe 
              src={`https://docs.google.com/gview?url=${encodeURIComponent(previewFile.url)}&embedded=true`}
              className="w-full h-full m-0 p-0"
              frameBorder="0"
              title="Document Preview"
            ></iframe>
          </div>
        );
      default:
        return (
          <div className="fixed inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div 
              id="default-case" 
              className="text-center p-8 px-20 bg-white rounded-md shadow-md max-w-md pointer-events-auto"
            >
              <i className="fa-regular fa-circle-question text-4xl text-indigo-500"></i>
              <p className="text-gray-700 mb-1 mt-2 text-sm">
                Preview is not available for the file format.
              </p>
              <p className="text-gray-700 mb-4 text-sm">
                Please click Download to view the file.
              </p>
              <a 
                href={previewFile.url} 
                download
                className="inline-block px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors"
              >
                Download File
              </a>
            </div>
          </div>
        );
    }
  };

  const renderAttachmentsTable = (attachments, sectionName) => {
    if (!attachments || attachments.length === 0) {
      return <p className="text-gray-500">No {sectionName.toLowerCase()} found</p>;
    }

    return (
      <table className="min-w-full border border-gray-200 text-sm">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="py-2 px-4 border border-gray-100 text-left">File</th>
            <th className="py-2 px-4 border border-gray-100 text-left">Description</th>
          </tr>
        </thead>
        <tbody>
          {attachments.map((attachment, index) => {
            const fileName = attachment.fileName || `${sectionName} ${index + 1}`;
            const fileExtension = fileName.split('.').pop().toLowerCase();
            const fileUrl = getFileUrl(attachment);

            return (
              <tr key={`${sectionName}-${index}`} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-2 px-4 flex items-center">
                  <FileIcon extension={fileExtension} />
                  <button
                    onClick={() => handleFileClick(attachment)}
                    className="text-indigo-500 hover:underline ml-2 text-left"
                    disabled={!fileUrl}
                  >
                    {fileName}
                  </button>
                </td>
                <td className="py-2 px-4">
                  {attachment.fileDescription || 'No description available'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <div className="py-4 relative">
      <div className="border-b border-gray-200">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500">
          <li className="me-2">
            <button
              onClick={() => handleTabChange("customer")}
              className={`inline-flex items-center justify-center p-2 border-b-2 rounded-t-lg ${
                activeTab === "customer"
                  ? "text-indigo-500 border-indigo-500"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300"
              }`}
            >
              Customer Attachments
            </button>
          </li>
          <li className="me-2">
            <button
              onClick={() => handleTabChange("private")}
              className={`inline-flex items-center justify-center p-2 border-b-2 rounded-t-lg ${
                activeTab === "private"
                  ? "text-indigo-500 border-indigo-500"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300"
              }`}
            >
              Private Attachments
            </button>
          </li>
          <li className="me-2">
            <button
              onClick={() => handleTabChange("reference")}
              className={`inline-flex items-center justify-center p-2 border-b-2 rounded-t-lg ${
                activeTab === "reference"
                  ? "text-indigo-500 border-indigo-500"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300"
              }`}
            >
              Reference URL
            </button>
          </li>
        </ul>
      </div>

      <div className="py-4">
        {activeTab === "customer" &&
          renderAttachmentsTable(estimate.Customer_Attachments, "customer attachments")}
        
        {activeTab === "private" &&
          renderAttachmentsTable(estimate.Private_Attachments, "private attachments")}
        
        {activeTab === "reference" &&
          (estimate.Reference_URL?.length > 0 ? (
            <table className="min-w-full border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="py-2 px-4 border border-gray-100 text-left">URL</th>
                  <th className="py-2 px-4 border border-gray-100 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                {estimate.Reference_URL.map((ref, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-4">
                      <a
                        href={ref.Url?.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-500 hover:underline"
                      >
                        {ref.Url?.url}
                      </a>
                    </td>
                    <td className="py-2 px-4">
                      {ref.Description || "No description available"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No reference URLs found</p>
          ))}
      </div>

      {previewFile && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col p-2">
          <div className="flex justify-between items-center mb-4">
            <p className="text-white">
              {previewFile.fileName || previewFile.url?.split("/").pop() || "File Preview"}
            </p>
            {["image", "pdf"].includes(fileType) && (
              <div className="flex items-center gap-2 bg-black/80 p-1 rounded">
                <button
                  onClick={() => setZoom((z) => Math.max(z - 0.1, 0.5))}
                  className="px-2 py-1 text-white"
                  disabled={zoom <= 0.5}
                >
                  -
                </button>
                <span className="text-white text-sm w-12 text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={() => setZoom((z) => Math.min(z + 0.1, 3))}
                  className="px-2 py-1 text-white"
                  disabled={zoom >= 3}
                >
                  +
                </button>
                <button
                  onClick={() => setZoom(1)}
                  className="px-2 py-1 text-white text-xs"
                  disabled={zoom === 1}
                >
                  Reset
                </button>
              </div>
            )}
            <div className="flex items-center gap-2">
              <a
                href={previewFile.url}
                download
                className="text-white hover:text-gray-300 text-xl bg-black px-2"
              >
                <i className="fa fa-download text-xs"></i>
              </a>
              <button
                onClick={closeModal}
                className="text-white hover:text-gray-300 text-xl bg-black px-2"
              >
                &times;
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">{renderFilePreview()}</div>
        </div>
      )}
    </div>
  );
};

export default AttachmentsTab;