import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="font-medium text-red-800 mb-2">Error Processing Request</h4>
          <p className="text-red-700 text-sm mb-4">{error}</p>
          
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          )}
          
          <div className="mt-4 text-xs text-red-600">
            <p className="font-medium mb-1">Common issues:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Invalid or inaccessible document URL</li>
              <li>Network connectivity problems</li>
              <li>Invalid Bearer token</li>
              <li>API server temporarily unavailable</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};