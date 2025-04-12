import React from 'react';

const PdfModal = ({
  isVisible,
  onClose,
  printContent,
  quoteNumber,
  pdfSettings,
  onPdfSettingChange,
  onGeneratePdf,
  onDownloadPdf
}) => {
  if (!isVisible) return null;

  // Calculate page dimensions based on settings
  const getPageDimensions = () => {
    switch (pdfSettings.pageSize) {
      case 'letter':
        return { width: 8.5, height: 11, unit: 'in' };
      case 'legal':
        return { width: 8.5, height: 14, unit: 'in' };
      case 'a4':
        return { width: 8.3, height: 11.7, unit: 'in' };
      default:
        return { width: 8.5, height: 11, unit: 'in' };
    }
  };

  const { width, height, unit } = getPageDimensions();

  // Calculate preview styles
  const getPreviewStyles = () => {
    const baseStyles = {
      backgroundColor: 'white',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      position: 'relative',
      width: `${width}${unit}`,
      minHeight: `${height}${unit}`,
      paddingTop: `${pdfSettings.marginTop}${unit === 'mm' ? 'mm' : 'in'}`,
      paddingBottom: `${pdfSettings.marginBottom}${unit === 'mm' ? 'mm' : 'in'}`,
      paddingLeft: `${pdfSettings.marginLeft}${unit === 'mm' ? 'mm' : 'in'}`,
      paddingRight: `${pdfSettings.marginRight}${unit === 'mm' ? 'mm' : 'in'}`,
      transform: `scale(${pdfSettings.scale})`,
      transformOrigin: 'top center',
      margin: '20px auto'
    };

    if (pdfSettings.orientation === 'landscape') {
      return {
        ...baseStyles,
        width: `${height}${unit}`,
        minHeight: `${width}${unit}`,
        transform: `${baseStyles.transform} rotate(90deg)`,
        transformOrigin: 'center center'
      };
    }

    return baseStyles;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-[1380px] max-h-[90vh] flex flex-col shadow-xl rounded-lg overflow-hidden">
        <div className="flex-shrink-0 flex items-center justify-between bg-white border-b px-4 py-2 z-10">
          <h2 className="text-xl font-semibold">Quote #{quoteNumber} - PDF Preview</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            <i className="fa fa-times text-lg"></i>
          </button>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Preview Panel */}
          <div className="flex-1 overflow-auto p-4 bg-gray-100">
            <div 
              id="farzan"
              className="mx-auto bg-white shadow-lg"
              style={getPreviewStyles()}
            >
              {pdfSettings.showHeaderFooter && (
                <div className="header" style={{ 
                  paddingBottom: '0.5in',
                  borderBottom: '1px solid #eee',
                  marginBottom: '0.5in'
                }}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h1 className="text-2xl font-bold">Quote #{quoteNumber}</h1>
                      <p className="text-sm text-gray-600">Date: {new Date().toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">The 1 Source</p>
                      <p className="text-sm text-gray-600">26600 Heyn Drive, Novi, MI</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div 
                className="content" 
                style={{ 
                  padding: '0.5in 0',
                  margin: '0 auto'
                }}
                dangerouslySetInnerHTML={{ __html: printContent }} 
              />
              
              {pdfSettings.includeContactInfo && (
                <div className="footer" style={{ 
                  paddingTop: '0.5in',
                  borderTop: '1px solid #eee',
                  marginTop: '0.5in',
                  fontSize: '10pt',
                  textAlign: 'center'
                }}>
                  <p>Contact: 26600 Heyn Drive, Novi, MI, 48374, United States</p>
                  <p>Phone: +12487359999 | Website: www.the1source.com</p>
                  <p className="mt-2">ISO 9001 Registered | Minority Business Enterprise</p>
                </div>
              )}
              
              {pdfSettings.includeTerms && (
                <div className="terms" style={{ 
                  marginTop: '0.5in',
                  fontSize: '10pt',
                  padding: '0.5in',
                  backgroundColor: '#f9f9f9'
                }}>
                  <h3 className="font-semibold mb-2">Terms & Conditions</h3>
                  <p className="text-justify">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                    Nullam in dui mauris. Vivamus. Lorem ipsum dolor sit amet, 
                    consectetur. Lorem ipsum dolor sit amet, consectetur. 
                    Lorem ipsum dolor sit amet, consectetur. Lorem ipsum.
                  </p>
                </div>
              )}
              
              {pdfSettings.watermark.enabled && (
                <div 
                  className="watermark" 
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%) rotate(-45deg)',
                    fontSize: '72px',
                    color: `rgba(0,0,0,${pdfSettings.watermark.opacity})`,
                    pointerEvents: 'none',
                    userSelect: 'none',
                    zIndex: 100,
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {pdfSettings.watermark.text}
                </div>
              )}
            </div>
          </div>
          
          {/* Controls Panel */}
          <div className="w-96 bg-gray-50 border-l border-gray-200 p-4 overflow-y-auto">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">PDF Settings</h3>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Scale</label>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => onPdfSettingChange('scale', Math.max(0.5, pdfSettings.scale - 0.1))}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="w-12 text-center">{Math.round(pdfSettings.scale * 100)}%</span>
                  <button 
                    onClick={() => onPdfSettingChange('scale', Math.min(1.5, pdfSettings.scale + 0.1))}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Page Size</label>
                <select
                  value={pdfSettings.pageSize}
                  onChange={(e) => onPdfSettingChange('pageSize', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="letter">Letter (8.5" x 11")</option>
                  <option value="legal">Legal (8  .5" x 14")</option>
                  <option value="a4">A4 (210mm x 297mm)</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Orientation</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      checked={pdfSettings.orientation === 'portrait'}
                      onChange={() => onPdfSettingChange('orientation', 'portrait')}
                    />
                    Portrait
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      checked={pdfSettings.orientation === 'landscape'}
                      onChange={() => onPdfSettingChange('orientation', 'landscape')}
                    />
                    Landscape
                  </label>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Margins (inches)</label>
                <div className="grid grid-cols-2 gap-2">
                  {['marginTop', 'marginBottom', 'marginLeft', 'marginRight'].map((margin) => (
                    <div key={margin}>
                      <label className="block text-xs text-gray-500">
                        {margin.replace('margin', '')}
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={pdfSettings[margin]}
                        onChange={(e) => onPdfSettingChange(margin, parseFloat(e.target.value))}
                        className="w-full p-1 border border-gray-300 rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Content Options</label>
                <div className="space-y-1">
                  {[
                    { id: 'showHeaderFooter', label: 'Show Header & Footer' },
                    { id: 'includeTerms', label: 'Include Terms & Conditions' },
                    { id: 'includeContactInfo', label: 'Include Contact Information' }
                  ].map((option) => (
                    <label key={option.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={pdfSettings[option.id]}
                        onChange={(e) => onPdfSettingChange(option.id, e.target.checked)}
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2 border-t pt-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={pdfSettings.watermark.enabled}
                    onChange={(e) => onPdfSettingChange('watermark.enabled', e.target.checked)}
                  />
                  <span className="text-sm font-medium text-gray-700">Watermark</span>
                </label>
                
                {pdfSettings.watermark.enabled && (
                  <div className="pl-6 space-y-2">
                    <div>
                      <label className="block text-xs text-gray-500">Text</label>
                      <input
                        type="text"
                        value={pdfSettings.watermark.text}
                        onChange={(e) => onPdfSettingChange('watermark.text', e.target.value)}
                        className="w-full p-1 border border-gray-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">Opacity</label>
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.1"
                        value={pdfSettings.watermark.opacity}
                        onChange={(e) => onPdfSettingChange('watermark.opacity', parseFloat(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-xs text-gray-500">{pdfSettings.watermark.opacity.toFixed(1)}</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 pt-4 border-t">
                <button
                  onClick={onGeneratePdf}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                >
                  Generate PDF
                </button>
                <button
                  onClick={onDownloadPdf}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfModal;