import React, { useState, useCallback } from 'react';
import { Plus, Trash2, MessageCircle } from 'lucide-react';

interface QuestionInputProps {
  questions: string[];
  onQuestionsChange: (questions: string[]) => void;
  disabled?: boolean;
}

export const QuestionInput: React.FC<QuestionInputProps> = ({
  questions,
  onQuestionsChange,
  disabled = false,
}) => {
  const [newQuestion, setNewQuestion] = useState('');

  const addQuestion = useCallback(() => {
    if (newQuestion.trim()) {
      onQuestionsChange([...questions, newQuestion.trim()]);
      setNewQuestion('');
    }
  }, [newQuestion, questions, onQuestionsChange]);

  const removeQuestion = useCallback((index: number) => {
    onQuestionsChange(questions.filter((_, i) => i !== index));
  }, [questions, onQuestionsChange]);

  const updateQuestion = useCallback((index: number, value: string) => {
    const updated = [...questions];
    updated[index] = value;
    onQuestionsChange(updated);
  }, [questions, onQuestionsChange]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addQuestion();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800">Questions</h3>
        <span className="text-sm text-gray-500">({questions.length})</span>
      </div>

      {/* Existing Questions */}
      {questions.length > 0 && (
        <div className="space-y-3">
          {questions.map((question, index) => (
            <div key={index} className="flex gap-2">
              <div className="flex-1">
                <textarea
                  value={question}
                  onChange={(e) => updateQuestion(index, e.target.value)}
                  disabled={disabled}
                  placeholder={`Question ${index + 1}`}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 resize-none"
                  rows={2}
                />
              </div>
              <button
                onClick={() => removeQuestion(index)}
                disabled={disabled}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 self-start mt-1"
                title="Remove question"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add New Question */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <textarea
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={disabled}
            placeholder="Enter your question about the document..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 resize-none"
            rows={2}
          />
          <button
            onClick={addQuestion}
            disabled={disabled || !newQuestion.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors self-start"
            title="Add question"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500">
          Press Enter to add question, or click the + button
        </p>
      </div>

      {questions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No questions added yet</p>
          <p className="text-sm">Add questions to query your document</p>
        </div>
      )}
    </div>
  );
};