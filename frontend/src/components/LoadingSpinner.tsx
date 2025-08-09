import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Processing your request...' 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
      <p className="text-gray-600 text-center">{message}</p>
      <div className="mt-4 space-y-2 text-sm text-gray-500 text-center">
        <p>• {message.includes('demo') ? 'Simulating document parsing' : 'Parsing document and extracting content'}</p>
        <p>• {message.includes('demo') ? 'Generating mock embeddings' : 'Generating embeddings for semantic search'}</p>
        <p>• {message.includes('demo') ? 'Creating realistic sample responses' : 'Querying AI model for intelligent answers'}</p>
      </div>
    </div>
  );
};