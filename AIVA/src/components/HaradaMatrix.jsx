import React from 'react';
import { ChevronRight, MousePointerClick } from 'lucide-react';

export default function HaradaMatrix({ haradaData, companyName, jobTitle, deliverables, onDeliverableClick }) {
  if (!haradaData || !haradaData.deliverables || haradaData.deliverables.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {jobTitle} Role{companyName ? ` at ${companyName}` : ''}: Harada Deliverable Matrix
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Core deliverables where AI voice creates transformational impact. <strong>Click any row</strong> to see the full detailed analysis.
        </p>
        <div className="mt-3 inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm">
          <MousePointerClick className="w-4 h-4 mr-2" />
          Interactive: Click any deliverable for deep-dive analysis
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full border-collapse shadow-lg">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <th className="text-left p-4 font-semibold border-r border-blue-700">#</th>
              <th className="text-left p-4 font-semibold border-r border-blue-700">Core Deliverable</th>
              <th className="text-left p-4 font-semibold border-r border-blue-700">Key Activities</th>
              <th className="text-left p-4 font-semibold border-r border-blue-700">Success Metrics</th>
              <th className="text-left p-4 font-semibold">Dependencies</th>
            </tr>
          </thead>
          <tbody>
            {haradaData.deliverables.map((matrixRow, index) => {
              const correspondingDeliverable = deliverables.find((d, i) => i === index);
              const isFrustrationDeliverable = correspondingDeliverable?.category === 'custom-frustration';

              return (
                <tr
                  key={index}
                  className={`cursor-pointer transition-all duration-200 ${
                    isFrustrationDeliverable
                      ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500'
                      : index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  } hover:bg-blue-100 hover:shadow-md hover:scale-[1.01]`}
                  onClick={() => correspondingDeliverable && onDeliverableClick(correspondingDeliverable, index)}
                >
                  <td className={`p-4 border border-gray-300 font-bold text-lg ${isFrustrationDeliverable ? 'text-amber-600' : 'text-blue-600'}`}>
                    {index + 1}
                  </td>
                  <td className="p-4 border border-gray-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{matrixRow.name}</span>
                        {isFrustrationDeliverable && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-amber-200 text-amber-900">
                            Your Challenge
                          </span>
                        )}
                      </div>
                      <ChevronRight className={`w-5 h-5 ${isFrustrationDeliverable ? 'text-amber-500' : 'text-blue-500'}`} />
                    </div>
                  </td>
                  <td className="p-4 border border-gray-300">
                    <ul className="text-sm text-gray-700 space-y-1">
                      {matrixRow.keyActivities.slice(0, 4).map((activity, i) => (
                        <li key={i}>• {activity}</li>
                      ))}
                      {matrixRow.keyActivities.length > 4 && (
                        <li className="text-blue-600 font-semibold text-xs">
                          + {matrixRow.keyActivities.length - 4} more activities
                        </li>
                      )}
                    </ul>
                  </td>
                  <td className="p-4 border border-gray-300">
                    <ul className="text-sm text-gray-700 space-y-1">
                      {matrixRow.successMetrics.slice(0, 3).map((metric, i) => (
                        <li key={i}>• {metric}</li>
                      ))}
                      {matrixRow.successMetrics.length > 3 && (
                        <li className="text-blue-600 font-semibold text-xs">
                          + {matrixRow.successMetrics.length - 3} more metrics
                        </li>
                      )}
                    </ul>
                  </td>
                  <td className="p-4 border border-gray-300">
                    <ul className="text-sm text-gray-700 space-y-1">
                      {matrixRow.dependencies.slice(0, 3).map((dep, i) => (
                        <li key={i}>• {dep}</li>
                      ))}
                      {matrixRow.dependencies.length > 3 && (
                        <li className="text-blue-600 font-semibold text-xs">
                          + {matrixRow.dependencies.length - 3} more
                        </li>
                      )}
                    </ul>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {haradaData.deliverables.map((matrixRow, index) => {
          const correspondingDeliverable = deliverables.find((d, i) => i === index);
          const isFrustrationDeliverable = correspondingDeliverable?.category === 'custom-frustration';

          return (
            <div
              key={index}
              className={`border-2 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer ${
                isFrustrationDeliverable ? 'border-amber-400' : 'border-gray-300'
              }`}
              onClick={() => correspondingDeliverable && onDeliverableClick(correspondingDeliverable, index)}
            >
              <div className={`text-white p-4 flex justify-between items-center ${
                isFrustrationDeliverable
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600'
              }`}>
                <div className="flex items-center flex-1 min-w-0">
                  <span className="font-bold mr-3 text-xl flex-shrink-0">{index + 1}.</span>
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold truncate">{matrixRow.name}</span>
                    {isFrustrationDeliverable && (
                      <span className="text-xs bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full mt-1 inline-block self-start">
                        Your Challenge
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 flex-shrink-0 ml-2" />
              </div>

              <div className="p-4 bg-white">
                <div className="mb-3">
                  <p className="text-xs font-semibold text-gray-600 mb-1">KEY ACTIVITIES:</p>
                  <p className="text-sm text-gray-700">{matrixRow.keyActivities.slice(0, 3).join(', ')}...</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1">SUCCESS METRICS:</p>
                  <p className="text-sm text-gray-700">{matrixRow.successMetrics.slice(0, 2).join(', ')}...</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-5">
        <p className="text-sm text-gray-800">
          <strong>📊 Harada Matrix Framework:</strong> A structured approach to analyzing role deliverables with activities, metrics, and dependencies.
          Each row represents a high-impact deliverable where AI voice creates transformational productivity gains{companyName ? ` for ${companyName}` : ''}.
          <strong className="text-purple-700"> Click any row to explore the full detailed analysis.</strong>
        </p>
      </div>
    </div>
  );
}
