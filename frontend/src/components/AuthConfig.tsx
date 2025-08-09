import React, { useState } from 'react';
import { Key, Eye, EyeOff, Settings, TestTube } from 'lucide-react';

interface AuthConfigProps {
  bearerToken: string;
  onBearerTokenChange: (token: string) => void;
  apiBaseUrl: string;
  onApiBaseUrlChange: (url: string) => void;
  demoMode: boolean;
  onDemoModeChange: (enabled: boolean) => void;
}

export const AuthConfig: React.FC<AuthConfigProps> = ({
  bearerToken,
  onBearerTokenChange,
  apiBaseUrl,
  onApiBaseUrlChange,
  demoMode,
  onDemoModeChange,
}) => {
  const [showToken, setShowToken] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 w-full text-left"
      >
        <Settings className="w-4 h-4 text-gray-600" />
        <span className="font-medium text-gray-800">API Configuration</span>
        <span className="text-xs text-gray-500 ml-auto">
          {isExpanded ? 'Hide' : 'Show'}
        </span>
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          {/* Demo Mode Toggle */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TestTube className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-800">Demo Mode</span>
              </div>
              <button
                onClick={() => onDemoModeChange(!demoMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  demoMode ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    demoMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <p className="text-xs text-blue-700 mt-2">
              {demoMode 
                ? 'Using mock responses for testing. Disable to connect to real API.' 
                : 'Connect to your deployed FastAPI backend.'
              }
            </p>
          </div>

          {/* API Base URL */}
          <div className={`space-y-2 ${demoMode ? 'opacity-50' : ''}`}>
            <label className="block text-sm font-medium text-gray-700">
              API Base URL
            </label>
            <input
              type="url"
              value={apiBaseUrl}
              onChange={(e) => onApiBaseUrlChange(e.target.value)}
              disabled={demoMode}
              placeholder="http://localhost:8000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <p className="text-xs text-gray-500">
              The base URL of your FastAPI backend server
            </p>
          </div>

          {/* Bearer Token */}
          <div className={`space-y-2 ${demoMode ? 'opacity-50' : ''}`}>
            <label className="block text-sm font-medium text-gray-700">
              Bearer Token
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showToken ? 'text' : 'password'}
                value={bearerToken}
                onChange={(e) => onBearerTokenChange(e.target.value)}
                disabled={demoMode}
                placeholder="Enter your API bearer token"
                className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                disabled={demoMode}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Required for authentication with your API endpoint
            </p>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-2 text-xs">
            <div className={`w-2 h-2 rounded-full ${
              demoMode ? 'bg-blue-500' : (bearerToken && apiBaseUrl ? 'bg-green-500' : 'bg-red-500')
            }`} />
            <span className={demoMode ? 'text-blue-700' : (bearerToken && apiBaseUrl ? 'text-green-700' : 'text-red-700')}>
              {demoMode 
                ? 'Demo mode active - using mock responses' 
                : (bearerToken && apiBaseUrl ? 'Configuration complete' : 'Missing required configuration')
              }
            </span>
          </div>
        </div>
      )}
    </div>
  );
};