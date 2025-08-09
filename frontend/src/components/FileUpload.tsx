import React, { useCallback } from 'react';
import { Upload, Link, X } from 'lucide-react';

interface FileUploadProps {
  documentUrl: string;
  onDocumentUrlChange: (url: string) => void;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  documentUrl,
  onDocumentUrlChange,
  disabled = false,
}) => {
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      // Create a blob URL for the uploaded file
      const blobUrl = URL.createObjectURL(file);
      onDocumentUrlChange(blobUrl);
    }
  }, [onDocumentUrlChange]);

  const clearDocument = useCallback(() => {
    onDocumentUrlChange('');
  }, [onDocumentUrlChange]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Document Input</h3>
        {documentUrl && (
          <button
            onClick={clearDocument}
            disabled={disabled}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
            title="Clear document"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* File Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Upload PDF File
          </label>
          <div className="relative">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              disabled={disabled}
              className="hidden"
              id="pdf-upload"
            />
            <label
              htmlFor="pdf-upload"
              className={`
                flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                ${disabled 
                  ? 'border-gray-200 bg-gray-50 cursor-not-allowed' 
                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                }
              `}
            >
              <div className="text-center">
                <Upload className={`w-8 h-8 mx-auto mb-2 ${disabled ? 'text-gray-300' : 'text-gray-400'}`} />
                <p className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-600'}`}>
                  Click to upload PDF
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* URL Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Or Enter Document URL
          </label>
          <div className="relative">
            <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="url"
              value={documentUrl}
              onChange={(e) => onDocumentUrlChange(e.target.value)}
              disabled={disabled}
              placeholder="https://example.com/document.pdf"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
        </div>
      </div>

      {documentUrl && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            <strong>Document ready:</strong> {documentUrl.startsWith('blob:') ? 'Uploaded file' : documentUrl}
          </p>
        </div>
      )}
    </div>
  );
};