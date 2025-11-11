import React, { useState } from 'react';
import { X, Clock, DollarSign, Target, Lightbulb, TrendingUp, Download, Bot } from 'lucide-react';

export default function DeliverableModal({
  deliverable,
  index,
  isOpen,
  onClose,
  formatCurrency,
  additionalImpactAnswers,
  handleAdditionalImpactAnswer,
  generateAdditionalImpactNarrative,
  companyName,
  jobTitle,
  industry
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen || !deliverable) return null;

  const answers = additionalImpactAnswers[deliverable.id] || {};
  const additionalImpact = generateAdditionalImpactNarrative(deliverable, answers);

  // Handle DOCX download
  const handleDownloadGuide = async () => {
    setIsDownloading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3002';
      const response = await fetch(`${apiUrl}/api/aiva/download-voice-agent-guide`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deliverable,
          companyName,
          jobTitle,
          industry
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate DOCX');
      }

      // Get filename from headers or create default
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : `Voice_Agent_Guide_${deliverable.title.replace(/[^a-z0-9]/gi, '_')}.docx`;

      // Download file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      console.log(`✅ Downloaded: ${filename}`);
    } catch (error) {
      console.error('Error downloading DOCX:', error);
      alert('Failed to download guide. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto my-8">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex justify-between items-start">
          <div className="flex items-start">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 text-white font-bold mr-4 flex-shrink-0 text-xl">
              {index + 1}
            </span>
            <div>
              <h2 className="text-2xl font-bold">{deliverable.title}</h2>
              <p className="text-blue-100 text-sm mt-1">
                {deliverable.baselineHours}h → {deliverable.aiEnabledHours.toFixed(2)}h ({deliverable.frequency})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="sticky top-[104px] bg-white border-b border-gray-200 px-8 flex gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === 'overview'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('voice-agent')}
            className={`px-6 py-3 font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'voice-agent'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Bot className="w-4 h-4" />
            Voice Agent Setup
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
          {/* The Situation */}
          <div>
            <p className="text-sm font-semibold text-purple-600 mb-2 uppercase tracking-wide">The Situation:</p>
            <p className="text-gray-800 leading-relaxed">{deliverable.scenario}</p>
          </div>

          {/* The Old Way */}
          <div className="bg-gray-50 rounded-lg p-5">
            <p className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">The Old Way:</p>
            <p className="text-gray-700 leading-relaxed">{deliverable.oldWay}</p>
          </div>

          {/* The AI Voice Way */}
          <div className="bg-blue-50 rounded-lg p-5 border-l-4 border-blue-500">
            <p className="text-sm font-semibold text-blue-700 mb-2 uppercase tracking-wide">The AI Voice Way:</p>
            <p className="text-gray-800 leading-relaxed">{deliverable.aiVoiceWay}</p>
          </div>

          {/* The Immediate Win */}
          <div className="bg-green-50 rounded-lg p-5">
            <p className="text-sm font-bold text-green-900 mb-3 uppercase tracking-wide flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              The Immediate Win:
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-green-700 font-semibold mb-1">Time Freed:</p>
                <p className="text-lg font-bold text-green-900">
                  {(deliverable.baselineHours - deliverable.aiEnabledHours).toFixed(2)}h
                </p>
                <p className="text-xs text-green-700">per {deliverable.frequency}</p>
              </div>
              <div>
                <p className="text-xs text-green-700 font-semibold mb-1">Payroll Freed:</p>
                <p className="text-lg font-bold text-green-900">{formatCurrency(deliverable.payrollFreed)}</p>
                <p className="text-xs text-green-700">annually</p>
              </div>
              <div>
                <p className="text-xs text-green-700 font-semibold mb-1">Speed Multiplier:</p>
                <p className="text-lg font-bold text-green-900">{deliverable.timeMultiplier}x</p>
                <p className="text-xs text-green-700">faster</p>
              </div>
            </div>
          </div>

          {/* Productivity Impact Summary */}
          {deliverable.productivityImpact && (
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-5 border-l-4 border-gray-400">
              <h3 className="text-lg font-bold text-gray-900 mb-3">📊 Productivity Impact</h3>
              <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                {deliverable.productivityImpact}
              </div>
            </div>
          )}

          {/* Emotional/Psychological Impact */}
          {deliverable.emotionalImpact && (
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-5 border-l-4 border-pink-400">
              <h3 className="text-lg font-bold text-gray-900 mb-3">💭 Emotional/Psychological Impact</h3>
              <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                {deliverable.emotionalImpact}
              </div>
            </div>
          )}

          {/* Business ROI Impact */}
          {deliverable.businessROI && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-5 border-l-4 border-green-500">
              <h3 className="text-lg font-bold text-gray-900 mb-3">💰 Business ROI Impact</h3>
              <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                {deliverable.businessROI}
              </div>
            </div>
          )}

          {/* Did You Know */}
          {deliverable.didYouKnow?.show && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-5">
              <p className="text-sm font-semibold text-yellow-900 mb-2 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2" />
                Did You Know?
              </p>
              <p className="text-sm text-yellow-800 leading-relaxed">{deliverable.didYouKnow.insight}</p>
            </div>
          )}

          {/* Downstream Impact Questions */}
          {deliverable.additionalImpactQuestions && deliverable.additionalImpactQuestions.length > 0 && (
            <div className="border-t-2 border-gray-200 pt-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Calculate Additional Downstream Impact</h3>
              <p className="text-sm text-gray-600 mb-4">
                The direct payroll freed ({formatCurrency(deliverable.payrollFreed)}) is just the beginning. Answer these questions to reveal the full compound value.
              </p>

              <div className="space-y-5">
                {deliverable.additionalImpactQuestions.map((question) => (
                  <div key={question.id} className="bg-purple-50 rounded-lg p-5">
                    <p className="font-semibold text-gray-900 mb-3">{question.question}</p>
                    <div className="space-y-2">
                      {question.options.map((option) => (
                        <label
                          key={option.value}
                          className={`flex items-start p-4 rounded-lg cursor-pointer transition-all ${
                            answers[question.id]?.value === option.value
                              ? 'bg-purple-200 border-2 border-purple-600 shadow-md'
                              : 'bg-white border-2 border-gray-200 hover:border-purple-400 hover:shadow-sm'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`${deliverable.id}-${question.id}`}
                            checked={answers[question.id]?.value === option.value}
                            onChange={() => handleAdditionalImpactAnswer(deliverable.id, question.id, option)}
                            className="mt-1 mr-3"
                          />
                          <span className="text-gray-800">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                {additionalImpact && (
                  <div className={`p-6 rounded-lg ${
                    additionalImpact.level === 'high' ? 'bg-green-50 border-2 border-green-500' :
                    additionalImpact.level === 'medium' ? 'bg-blue-50 border-2 border-blue-400' :
                    'bg-gray-50 border-2 border-gray-300'
                  }`}>
                    <div className="prose prose-sm max-w-none">
                      <div
                        className="text-gray-800 leading-relaxed whitespace-pre-line"
                        dangerouslySetInnerHTML={{ __html: additionalImpact.narrative.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Additional Impact Beyond Direct Payroll Freed */}
          {deliverable.additionalRippleEffects && (
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-5 border-l-4 border-indigo-500">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                🌊 Additional Impact Beyond the {formatCurrency(deliverable.payrollFreed)} Payroll Freed
              </h3>
              <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                {deliverable.additionalRippleEffects}
              </div>
            </div>
          )}

          {/* Value-Added Reallocation */}
          {deliverable.valueAddedSuggestion && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-5 border-2 border-purple-300">
              <p className="text-sm font-bold text-gray-900 mb-2 flex items-center">
                <Target className="w-5 h-5 mr-2 text-purple-600" />
                Reallocate {deliverable.valueAddedSuggestion.hours.toFixed(0)} Hours Annually To:
              </p>
              <p className="text-base font-semibold text-purple-900 mb-2">{deliverable.valueAddedSuggestion.activity}</p>
              <p className="text-sm text-gray-700 mb-3">{deliverable.valueAddedSuggestion.description}</p>
              <p className="text-sm font-semibold text-green-700">🚀 {deliverable.valueAddedSuggestion.expectedImpact}</p>
            </div>
          )}

          {/* The Compounding Effect */}
          {deliverable.compoundingEffect && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-5 border-l-4 border-purple-500">
              <h3 className="text-lg font-bold text-gray-900 mb-3">♻️ The Compounding Effect</h3>
              <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                {deliverable.compoundingEffect}
              </div>
            </div>
          )}
            </>
          )}

          {/* Voice Agent Setup Tab */}
          {activeTab === 'voice-agent' && (
            <>
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Bot className="w-7 h-7 text-purple-600" />
                  AI Voice Agent Implementation Guide
                </h2>
                <p className="text-gray-700">
                  This comprehensive guide provides everything needed to build an AI voice agent for this deliverable.
                  Download the DOCX file to use as training material for your voice agent system.
                </p>
              </div>

              {/* Section 1: Voice Agent Overview */}
              {deliverable.voiceAgentOverview && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2 border-b-2 border-purple-200 pb-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-sm">1</span>
                    Voice Agent Overview
                  </h3>
                  <div className="bg-white rounded-lg p-5 border-l-4 border-purple-500">
                    <div className="text-gray-800 leading-relaxed whitespace-pre-line">
                      {deliverable.voiceAgentOverview}
                    </div>
                  </div>
                </div>
              )}

              {/* Section 2: Personality & Communication Style */}
              {deliverable.voiceAgentPersonality && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2 border-b-2 border-purple-200 pb-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-sm">2</span>
                    Personality & Communication Style
                  </h3>
                  <div className="bg-purple-50 rounded-lg p-5 border-l-4 border-purple-500">
                    <div className="text-gray-800 leading-relaxed whitespace-pre-line">
                      {deliverable.voiceAgentPersonality}
                    </div>
                  </div>
                </div>
              )}

              {/* Section 3: Core Knowledge Base */}
              {deliverable.voiceAgentKnowledgeBase && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2 border-b-2 border-purple-200 pb-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-sm">3</span>
                    Core Knowledge Base
                  </h3>
                  <div className="bg-blue-50 rounded-lg p-5 border-l-4 border-blue-500">
                    <div className="text-gray-800 leading-relaxed whitespace-pre-line">
                      {deliverable.voiceAgentKnowledgeBase}
                    </div>
                  </div>
                </div>
              )}

              {/* Section 4: System Prompt & Instructions */}
              {deliverable.voiceAgentSystemPrompt && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2 border-b-2 border-purple-200 pb-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-sm">4</span>
                    System Prompt & Instructions
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-5 border-l-4 border-gray-500">
                    <p className="text-sm text-gray-600 italic mb-3">
                      Copy this system prompt directly into your voice agent configuration:
                    </p>
                    <div className="bg-white rounded p-4 font-mono text-sm text-gray-800 leading-relaxed whitespace-pre-line border border-gray-300 overflow-x-auto">
                      {deliverable.voiceAgentSystemPrompt}
                    </div>
                  </div>
                </div>
              )}

              {/* Section 5: Sample Conversations */}
              {deliverable.voiceAgentSampleConversations && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2 border-b-2 border-purple-200 pb-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-sm">5</span>
                    Sample Conversations
                  </h3>
                  <div className="bg-green-50 rounded-lg p-5 border-l-4 border-green-500">
                    <div className="text-gray-800 leading-relaxed whitespace-pre-line">
                      {deliverable.voiceAgentSampleConversations}
                    </div>
                  </div>
                </div>
              )}

              {/* Section 6: Training Dialogues */}
              {deliverable.voiceAgentTrainingData && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2 border-b-2 border-purple-200 pb-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-sm">6</span>
                    Training Dialogues
                  </h3>
                  <div className="bg-yellow-50 rounded-lg p-5 border-l-4 border-yellow-500">
                    <div className="text-gray-800 leading-relaxed whitespace-pre-line">
                      {deliverable.voiceAgentTrainingData}
                    </div>
                  </div>
                </div>
              )}

              {/* Section 7: Integration Guide */}
              {deliverable.voiceAgentIntegrationGuide && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2 border-b-2 border-purple-200 pb-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-sm">7</span>
                    Integration & Technical Specifications
                  </h3>
                  <div className="bg-indigo-50 rounded-lg p-5 border-l-4 border-indigo-500">
                    <div className="text-gray-800 leading-relaxed whitespace-pre-line">
                      {deliverable.voiceAgentIntegrationGuide}
                    </div>
                  </div>
                </div>
              )}

              {/* Download DOCX Button */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border-2 border-purple-300">
                <h4 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Download className="w-5 h-5 text-purple-600" />
                  Download Complete Implementation Guide
                </h4>
                <p className="text-sm text-gray-700 mb-4">
                  Get the complete guide as a professionally formatted DOCX file, ready to use as training material for your AI voice agent system.
                </p>
                <button
                  onClick={handleDownloadGuide}
                  disabled={isDownloading}
                  className={`px-6 py-3 font-semibold rounded-lg transition-all flex items-center gap-2 ${
                    isDownloading
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  <Download className="w-5 h-5" />
                  {isDownloading ? 'Generating...' : 'Download DOCX Guide'}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer with Navigation */}
        <div className="sticky bottom-0 bg-gray-50 border-t-2 border-gray-200 p-6 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
          <p className="text-sm text-gray-600">
            Deliverable {index + 1} of 5
          </p>
        </div>
      </div>
    </div>
  );
}
