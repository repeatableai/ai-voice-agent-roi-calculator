import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Clock, DollarSign, TrendingUp, ArrowLeft, Target, 
  CheckCircle, AlertCircle, Zap, BarChart3, Brain,
  ChevronDown, ChevronUp
} from 'lucide-react';
import Breadcrumbs from './Breadcrumbs';
import HaradaMatrix from './HaradaMatrix';
import DeliverableModal from './DeliverableModal';

export default function AnalysisDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDeliverable, setSelectedDeliverable] = useState(null);
  const [selectedDeliverableIndex, setSelectedDeliverableIndex] = useState(null);
  const [showImplementationDetails, setShowImplementationDetails] = useState(false);
  const [additionalImpactAnswers, setAdditionalImpactAnswers] = useState({});

  useEffect(() => {
    fetchAnalysis();
  }, [id]);

  const fetchAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/aiva/analyses/${id}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analysis');
      }

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (err) {
      console.error('Error fetching analysis:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDeliverableClick = (deliverable, index) => {
    setSelectedDeliverable(deliverable);
    setSelectedDeliverableIndex(index);
  };

  const handleCloseModal = () => {
    setSelectedDeliverable(null);
    setSelectedDeliverableIndex(null);
  };

  const handleAdditionalImpactAnswer = (deliverableId, questionId, answer) => {
    setAdditionalImpactAnswers(prev => ({
      ...prev,
      [deliverableId]: {
        ...prev[deliverableId],
        [questionId]: answer
      }
    }));
  };

  const generateAdditionalImpactNarrative = (deliverable, answers) => {
    if (!answers || Object.keys(answers).length === 0) return null;

    const impacts = Object.values(answers);
    const highImpacts = impacts.filter(a => a.impact === 'high');
    const mediumImpacts = impacts.filter(a => a.impact === 'medium');

    if (highImpacts.length === 0 && mediumImpacts.length === 0) {
      return {
        level: 'low',
        narrative: `Your ${deliverable.title.toLowerCase()} delivered the ${formatCurrency(deliverable.payrollFreed)} direct payroll freed value.`
      };
    }

    let narrative = `**Downstream Impact Beyond ${formatCurrency(deliverable.payrollFreed)} Direct Value:**\n\n`;
    let estimatedValue = { low: 0, high: 0 };

    highImpacts.forEach(impact => {
      if (impact.value === 'prevented_downtime') {
        narrative += `**Downtime Prevention:** By addressing this proactively, you kept production running. Unplanned downtime costs $10K-$50K per hour. Preventing even one 4-6 hour event represents $40K-$300K in preserved production value.\n\n`;
        estimatedValue.low += 40000;
        estimatedValue.high += 300000;
      }
      if (impact.value === 'prevented_revenue_loss' || impact.value === 'saved_account') {
        narrative += `**Revenue Protection:** Fast resolution prevented customer churn or revenue loss. Enterprise customer churn typically costs $50K-$500K in lifetime value.\n\n`;
        estimatedValue.low += 50000;
        estimatedValue.high += 500000;
      }
      if (impact.value === 'prevented_overruns' || impact.value === 'better_roi') {
        narrative += `**Cost Avoidance:** Proactive management prevented budget overruns or optimized spend. Typical impact: $25K-$150K in avoided costs annually.\n\n`;
        estimatedValue.low += 25000;
        estimatedValue.high += 150000;
      }
      if (impact.value === 'higher_connect' || impact.value === 'faster_fills') {
        narrative += `**Accelerated Outcomes:** Faster execution led to more wins, faster closes, or quicker placements. Revenue acceleration worth $30K-$200K annually.\n\n`;
        estimatedValue.low += 30000;
        estimatedValue.high += 200000;
      }
      if (impact.value === 'prevented_exec_escalation') {
        narrative += `**Executive Protection:** Preventing executive-level escalations protects leadership time and company reputation. Each prevented escalation saves $10K-$50K in emergency discounts, credits, and executive time.\n\n`;
        estimatedValue.low += 10000;
        estimatedValue.high += 50000;
      }
      if (impact.value === 'became_standard') {
        narrative += `**Organizational Multiplier:** Your process became the new standard, multiplying impact across your entire team. Team-wide adoption creates 5-10x value multiplication.\n\n`;
        estimatedValue.low += 50000;
        estimatedValue.high += 250000;
      }
      if (impact.value === 'prevented_lawsuit') {
        narrative += `**Legal Risk Mitigation:** Fast, proper response prevented potential lawsuit and legal exposure. Employment lawsuits cost $125K-$500K in legal fees and settlements.\n\n`;
        estimatedValue.low += 125000;
        estimatedValue.high += 500000;
      }
      if (impact.value === 'prevented_waste') {
        narrative += `**Budget Protection:** Catching underperforming campaigns early prevented wasted marketing spend. Typical waste from unoptimized campaigns: $10K-$50K monthly.\n\n`;
        estimatedValue.low += 40000;
        estimatedValue.high += 200000;
      }
      if (impact.value === 'prevented_delay' || impact.value === 'unblocked_team') {
        narrative += `**Project Velocity:** Preventing delays or unblocking teams preserves project value and accelerates time-to-market. Each week of delay typically costs $25K-$75K in lost opportunity.\n\n`;
        estimatedValue.low += 25000;
        estimatedValue.high += 75000;
      }
      if (impact.value === 'won_deal' || impact.value === 'advanced_deal') {
        narrative += `**Revenue Impact:** Winning or advancing deals faster directly drives revenue. Enterprise deals won through better positioning represent $100K-$500K in closed revenue.\n\n`;
        estimatedValue.low += 100000;
        estimatedValue.high += 500000;
      }
    });

    if (mediumImpacts.length > 0 && highImpacts.length === 0) {
      narrative += `**Incremental Improvements:** Multiple smaller improvements that compound over time.\n\n`;
      estimatedValue.low = 15000;
      estimatedValue.high = 75000;
    }

    if (estimatedValue.low > 0) {
      narrative += `\n**Conservative downstream value estimate: ${formatCurrency(estimatedValue.low)} - ${formatCurrency(estimatedValue.high)} annually**`;
    } else {
      narrative += `\n**Estimated downstream value: $50K-$200K annually**`;
    }

    return {
      level: highImpacts.length > 0 ? 'high' : 'medium',
      narrative,
      estimatedLow: estimatedValue.low || 50000,
      estimatedHigh: estimatedValue.high || 200000
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Analysis</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/analyses')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Analyses
          </button>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  const analysisData = typeof analysis.analysis_data === 'string' 
    ? JSON.parse(analysis.analysis_data) 
    : analysis.analysis_data || {};
  
  const deliverables = analysisData.deliverables || [];
  const metrics = analysisData.metrics || {};
  const haradaMatrix = analysisData.haradaMatrix || null;
  const valueAddedSuggestions = analysisData.valueAddedSuggestions || [];
  const companyContext = typeof analysis.company_context === 'string'
    ? JSON.parse(analysis.company_context)
    : analysis.company_context;

  // Calculate hourly rate from saved data
  const hourlyRate = analysis.hourly_rate || (metrics.hourlyRate || 0);

  // Prepare metrics in the format expected by the UI
  const displayMetrics = {
    productivityMultiplier: metrics.productivityMultiplier || analysis.productivity_multiplier || 0,
    annualTimeSavings: metrics.annualTimeSavings || analysis.total_annual_hours_freed || 0,
    totalPayrollFreed: metrics.totalPayrollFreed || analysis.total_payroll_freed || 0,
    conservativeEstimate: metrics.conservativeEstimate || metrics.annualValueCreated || analysis.annual_value_created || 0,
    annualValueCreated: metrics.annualValueCreated || analysis.annual_value_created || 0,
    paybackDays: metrics.paybackDays || analysis.payback_days || 0
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <Breadcrumbs />
        
        {/* Header - matching initial report */}
        <div className="text-center mb-8">
          <Link
            to="/analyses"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Analyses
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your AI Voice Impact Report</h1>
          <p className="text-xl text-gray-600 mb-4">
            {analysis.job_title} • {analysis.industry} • {formatCurrency(hourlyRate)}/hr
          </p>
          <p className="text-sm text-gray-500">
            Created on {formatDate(analysis.created_at)}
          </p>
        </div>

        {/* Company Context */}
        {companyContext && (
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 mb-8 max-w-4xl mx-auto">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center">
              <Brain className="w-5 h-5 mr-2 text-blue-600" />
              Analysis Personalized for {analysis.company_name}
            </h3>
            <div className="text-sm text-gray-700 space-y-1">
              {companyContext.companySize && (
                <p><strong>Team Size:</strong> ~{companyContext.companySize}</p>
              )}
              {companyContext.products && (
                <p><strong>Focus:</strong> {companyContext.products.substring(0, 150)}...</p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                This analysis incorporates insights from your website to make scenarios more realistic and contextually relevant to {analysis.company_name}.
              </p>
            </div>
          </div>
        )}

        {/* Harada Matrix */}
        {haradaMatrix && (
          <HaradaMatrix
            haradaData={haradaMatrix}
            companyName={analysis.company_name}
            jobTitle={analysis.job_title}
            deliverables={deliverables}
            onDeliverableClick={handleDeliverableClick}
          />
        )}

        {/* Deliverable Modal */}
        <DeliverableModal
          deliverable={selectedDeliverable}
          index={selectedDeliverableIndex}
          totalDeliverables={deliverables.length}
          isOpen={selectedDeliverable !== null}
          onClose={handleCloseModal}
          formatCurrency={formatCurrency}
          additionalImpactAnswers={additionalImpactAnswers}
          handleAdditionalImpactAnswer={handleAdditionalImpactAnswer}
          generateAdditionalImpactNarrative={generateAdditionalImpactNarrative}
          companyName={analysis.company_name}
          jobTitle={analysis.job_title}
          industry={analysis.industry}
        />

        {/* Key Metrics Cards - matching initial report */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8" />
              <span className="text-3xl font-bold">{displayMetrics.productivityMultiplier}x</span>
            </div>
            <p className="text-blue-100 text-sm">Productivity Multiplier</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8" />
              <span className="text-3xl font-bold">{displayMetrics.annualTimeSavings}</span>
            </div>
            <p className="text-purple-100 text-sm">Hours Freed Annually</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8" />
              <span className="text-2xl font-bold">{formatCurrency(displayMetrics.totalPayrollFreed)}</span>
            </div>
            <p className="text-green-100 text-sm">Payroll Freed to Reallocate</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-8 h-8" />
              <span className="text-2xl font-bold">{formatCurrency(displayMetrics.conservativeEstimate)}</span>
            </div>
            <p className="text-orange-100 text-sm">Per {analysis.job_title} × Headcount ROI</p>
            <p className="text-orange-200 text-xs mt-1">Conservative annual estimate</p>
          </div>
        </div>

        {/* Implementation & Payback Analysis */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <button
            onClick={() => setShowImplementationDetails(!showImplementationDetails)}
            className="w-full flex items-center justify-between text-gray-900 hover:text-blue-600 transition-colors"
          >
            <div className="flex items-center">
              <DollarSign className="w-6 h-6 mr-3 text-blue-600" />
              <span className="text-xl font-bold">Implementation & Payback Analysis</span>
            </div>
            {showImplementationDetails ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
          </button>

          {showImplementationDetails && (
            <div className="mt-6 space-y-6">
              <p className="text-gray-600">
                Here's the business case for implementing AI voice partners, including investment requirements and payback timeline.
              </p>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Time to Implementation</p>
                  <p className="text-2xl font-bold text-gray-900">1-2 weeks</p>
                  <p className="text-xs text-gray-500 mt-1">Setup & go-live timeline</p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Payback Period</p>
                  <p className="text-2xl font-bold text-blue-600">{displayMetrics.paybackDays} days</p>
                  <p className="text-xs text-gray-500 mt-1">Time to break even</p>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Minimum Conservative Estimate</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(displayMetrics.conservativeEstimate)}</p>
                  <p className="text-xs text-gray-500 mt-1">First year value return</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                <h3 className="font-bold text-gray-900 mb-3">Progressive Value Timeline</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">90-Day Value:</span>
                    <span className="font-bold text-blue-600">{formatCurrency((displayMetrics.annualValueCreated / 365) * 90)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">6-Month Value:</span>
                    <span className="font-bold text-indigo-600">{formatCurrency(displayMetrics.annualValueCreated * 0.5)}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-gray-300 pt-2">
                    <span className="text-gray-900 font-semibold">1-Year Value:</span>
                    <span className="font-bold text-green-600">{formatCurrency(displayMetrics.annualValueCreated)}</span>
                  </div>
                  <div className="flex justify-between items-center border-t-2 border-purple-300 pt-3 mt-2">
                    <span className="text-gray-900 font-bold">3-Year Total Value:</span>
                    <span className="font-bold text-purple-600 text-lg">{formatCurrency(displayMetrics.annualValueCreated * 3)}</span>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <p className="mb-2"><strong>What's included in implementation:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>AI voice platform setup and integration</li>
                  <li>Custom voice partner development for your role</li>
                  <li>Team training and onboarding</li>
                  <li>Knowledge base integration with your systems</li>
                  <li>6 months of optimization and support</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Freed Time Portfolio */}
        {valueAddedSuggestions && valueAddedSuggestions.length > 0 && (
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-xl p-8 mb-8">
            <div className="text-center mb-8">
              <Target className="w-12 h-12 text-purple-600 mx-auto mb-3" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Freed Time Portfolio</h2>
              <p className="text-xl text-gray-700 mb-4">
                {valueAddedSuggestions.reduce((sum, s) => sum + (s.hours || 0), 0)} hours freed annually
              </p>

              <div className="grid grid-cols-3 gap-4 mt-6 max-w-3xl mx-auto">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(valueAddedSuggestions.reduce((sum, s) => sum + (s.hours || 0), 0) / 40)}
                  </div>
                  <div className="text-sm text-gray-600">Full Work Weeks</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(valueAddedSuggestions.reduce((sum, s) => sum + (s.hours || 0), 0) * hourlyRate)}
                  </div>
                  <div className="text-sm text-gray-600">Value to Reallocate</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round((valueAddedSuggestions.reduce((sum, s) => sum + (s.hours || 0), 0) / 2080) * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">of Your Year Freed</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">💡 The Real Value: What You Can Do With This Time</h3>
              <p className="text-gray-700 mb-4">
                Instead of spending {valueAddedSuggestions.reduce((sum, s) => sum + (s.hours || 0), 0)} hours/year on repetitive tasks,
                you can reallocate this time to high-impact activities that accelerate your career and drive organizational results:
              </p>
            </div>

            <div className="space-y-6">
              {valueAddedSuggestions.map((suggestion, index) => (
                <div key={index} className="bg-white rounded-xl p-6 border-l-4 border-purple-500">
                  <div className="flex justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{index + 1}. {suggestion.activity}</h3>
                    <span className="text-lg font-bold text-purple-600">{suggestion.hours}h/year</span>
                  </div>
                  <p className="text-gray-700 mb-3">{suggestion.description}</p>
                  <div className="bg-green-50 rounded-lg p-3 mb-3">
                    <p className="text-sm font-semibold text-green-800">🚀 {suggestion.expectedImpact}</p>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>That's ~{Math.round((suggestion.hours || 0) / 52)} hours per week you can spend on this</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">🎯 Bottom Line</h3>
              <p className="text-gray-800">
                By freeing {valueAddedSuggestions.reduce((sum, s) => sum + (s.hours || 0), 0)} hours annually from repetitive work,
                you shift from being <strong>tactically busy</strong> to being <strong>strategically impactful</strong>.
                This is how top performers in your role operate—they don't work harder, they work on higher-leverage activities.
              </p>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Build Your AI Voice Partners?</h2>
          <p className="text-xl text-gray-600 mb-8">You've seen the {formatCurrency(displayMetrics.totalPayrollFreed)} opportunity</p>

          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-8 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
          >
            Analyze Another Role
          </button>
        </div>
      </div>
    </div>
  );
}
