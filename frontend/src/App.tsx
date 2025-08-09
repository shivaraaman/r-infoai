import React from 'react';
import { useState, useCallback } from 'react';
import { Brain, FileSearch, Zap } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { QuestionInput } from './components/QuestionInput';
import { ResultsDisplay } from './components/ResultsDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorDisplay } from './components/ErrorDisplay';
import { AuthConfig } from './components/AuthConfig';
import { DocumentQueryAPI } from './services/api';
import { MockDocumentQueryAPI } from './services/mockApi';
import { QueryAnswer } from './types/api';

function App() {
  const [documentUrl, setDocumentUrl] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [bearerToken, setBearerToken] = useState('');
  const [apiBaseUrl, setApiBaseUrl] = useState('http://localhost:8000');
  const [demoMode, setDemoMode] = useState(true);
  const [answers, setAnswers] = useState<QueryAnswer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQuery = useCallback(async () => {
    if (!documentUrl || questions.length === 0) {
      setError('Please provide a document URL and at least one question');
      return;
    }

    if (!demoMode && !bearerToken) {
      setError('Please provide a bearer token or enable demo mode');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnswers([]);

    try {
      const api = demoMode 
        ? new MockDocumentQueryAPI() 
        : new DocumentQueryAPI(bearerToken);
      const response = await api.queryDocuments({
        documents: documentUrl,
        questions: questions,
      });
      
      setAnswers(response.answers);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [documentUrl, questions, bearerToken, demoMode]);

  const handleRetry = useCallback(() => {
    setError(null);
    handleQuery();
  }, [handleQuery]);

  const canQuery = documentUrl && questions.length > 0 && (demoMode || bearerToken) && !isLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Intelligent Document Query System
              </h1>
              <p className="text-gray-600">
                Upload a PDF and ask natural language questions powered by AI
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Input */}
          <div className="lg:col-span-2 space-y-8">
            {/* Auth Configuration */}
            <AuthConfig
              bearerToken={bearerToken}
              onBearerTokenChange={setBearerToken}
              apiBaseUrl={apiBaseUrl}
              onApiBaseUrlChange={setApiBaseUrl}
              demoMode={demoMode}
              onDemoModeChange={setDemoMode}
            />

            {/* Document Upload */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <FileUpload
                documentUrl={documentUrl}
                onDocumentUrlChange={setDocumentUrl}
                disabled={isLoading}
              />
            </div>

            {/* Questions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <QuestionInput
                questions={questions}
                onQuestionsChange={setQuestions}
                disabled={isLoading}
              />
            </div>

            {/* Query Button */}
            <div className="flex justify-center">
              <button
                onClick={handleQuery}
                disabled={!canQuery}
                className={`
                  inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform
                  ${canQuery
                    ? `bg-gradient-to-r ${demoMode ? 'from-blue-500 to-cyan-500' : 'from-blue-600 to-purple-600'} text-white hover:from-blue-700 hover:to-purple-700 hover:scale-105 shadow-lg hover:shadow-xl`
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                <Zap className="w-5 h-5" />
                {isLoading ? 'Processing...' : (demoMode ? 'Demo Query' : 'Query Document')}
              </button>
            </div>
          </div>

          {/* Right Column - Features */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileSearch className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-800">How it works</h3>
              </div>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">1</div>
                  <p>Upload a PDF or provide a document URL</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">2</div>
                  <p>Add natural language questions about the document</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">3</div>
                  <p>AI analyzes the document and provides detailed answers</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
              <h4 className="font-semibold text-gray-800 mb-3">Features</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Semantic document search
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  GPT-4 powered answers
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Source citations with page numbers
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Detailed explanations
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="mt-12">
          {isLoading && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <LoadingSpinner message={demoMode 
                ? "Generating demo responses with realistic mock data..." 
                : "Analyzing document and generating intelligent answers..."
              } />
            </div>
          )}

          {error && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <ErrorDisplay error={error} onRetry={handleRetry} />
            </div>
          )}

          {answers.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <ResultsDisplay answers={answers} questions={questions} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
