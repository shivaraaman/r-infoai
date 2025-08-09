import React from 'react';
import { CheckCircle, FileText, MapPin, MessageSquare, Lightbulb } from 'lucide-react';
import { QueryAnswer } from '../types/api';

interface ResultsDisplayProps {
  answers: QueryAnswer[];
  questions: string[];
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ answers, questions }) => {
  if (answers.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <CheckCircle className="w-5 h-5 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-800">Query Results</h3>
        <span className="text-sm text-gray-500">({answers.length} answers)</span>
      </div>

      <div className="space-y-6">
        {answers.map((answer, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            {/* Question */}
            <div className="mb-4 pb-4 border-b border-gray-100">
              <div className="flex items-start gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Question {index + 1}</p>
                  <p className="text-gray-800 mt-1">{questions[index] || 'Question not available'}</p>
                </div>
              </div>
            </div>

            {/* Answer */}
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-green-800 mb-1">Answer</p>
                    <p className="text-green-700">{answer.answer}</p>
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-800">Section</span>
                  </div>
                  <p className="text-blue-700 text-sm">{answer.section || 'Not specified'}</p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-purple-600" />
                    <span className="font-medium text-purple-800">Page</span>
                  </div>
                  <p className="text-purple-700 text-sm">
                    {answer.page ? `Page ${answer.page}` : 'Not specified'}
                  </p>
                </div>
              </div>

              {/* Clause */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-start gap-2 mb-2">
                  <FileText className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                  <span className="font-medium text-gray-800">Relevant Clause</span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed italic">
                  "{answer.clause}"
                </p>
              </div>

              {/* Rationale */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span className="font-medium text-amber-800">Rationale</span>
                </div>
                <p className="text-amber-700 text-sm">{answer.rationale}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};