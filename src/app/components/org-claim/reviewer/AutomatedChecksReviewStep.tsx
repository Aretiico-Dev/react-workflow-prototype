import { useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, Download, Flag, X } from 'lucide-react';

interface AutomatedChecksReviewStepProps {
  onNext: (flag?: { comment: string }) => void;
}

interface Check {
  id: string;
  name: string;
  description: string;
  status: 'passed';
  jsonData?: any;
  pdfUrl?: string;
}

export function AutomatedChecksReviewStep({ onNext }: AutomatedChecksReviewStepProps) {
  const [flagged, setFlagged] = useState(false);
  const [flagComment, setFlagComment] = useState('');
  const [expandedCheck, setExpandedCheck] = useState<string | null>(null);

  const checks: Check[] = [
    {
      id: 'sanctions',
      name: 'Sanctions Screening',
      description: 'Organisation checked against international sanctions lists',
      status: 'passed',
      jsonData: {
        result: 'No matches found',
        lists_checked: ['OFAC', 'UN', 'EU', 'HMT'],
        timestamp: '2026-04-23T10:30:00Z'
      }
    },
    {
      id: 'embargo',
      name: 'Embargoed Countries Check',
      description: 'Verification that organisation does not operate in embargoed jurisdictions',
      status: 'passed',
      jsonData: {
        result: 'Pass',
        registered_country: 'United Kingdom',
        operating_countries: ['United Kingdom', 'Ireland'],
        timestamp: '2026-04-23T10:30:05Z'
      }
    },
    {
      id: 'background',
      name: 'Automated Background Check',
      description: 'Comprehensive background report on organisation',
      status: 'passed',
      pdfUrl: '/reports/background-check-abc-limited.pdf'
    },
    {
      id: 'psc-identification',
      name: 'PSC Identification',
      description: 'Persons with Significant Control identified from public registers',
      status: 'passed',
      jsonData: {
        psc_count: 2,
        persons: [
          { name: 'Jane Director', nature_of_control: ['ownership-of-shares-75-to-100-percent'], dob: '1975-03' },
          { name: 'Robert Manager', nature_of_control: ['significant-influence-or-control'], dob: '1980-07' }
        ]
      }
    },
    {
      id: 'psc-sanctions',
      name: 'PSC Sanctions Screening',
      description: 'All identified PSCs checked against sanctions lists',
      status: 'passed',
      jsonData: {
        result: 'All clear',
        checked_individuals: 2,
        matches_found: 0,
        timestamp: '2026-04-23T10:30:15Z'
      }
    }
  ];

  const toggleCheck = (checkId: string) => {
    setExpandedCheck(expandedCheck === checkId ? null : checkId);
  };

  const handleContinue = () => {
    if (flagged && flagComment.trim()) {
      onNext({ comment: flagComment });
    } else if (!flagged) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      {/* Flag Banner */}
      {flagged && (
        <div className="bg-[#fff8e1] border-l-4 border-[#ffc107] p-4 rounded">
          <div className="flex items-start gap-3">
            <Flag className="w-5 h-5 text-[#ffc107] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-[0.875rem] font-medium text-[#212121] mb-2">
                This claim has been flagged for review
              </p>
              <textarea
                value={flagComment}
                onChange={(e) => setFlagComment(e.target.value)}
                placeholder="Add a comment explaining why this claim has been flagged..."
                className="w-full px-3 py-2 border border-[#e0e0e0] rounded text-[0.875rem] min-h-[80px] resize-none"
              />
            </div>
            <button
              onClick={() => {
                setFlagged(false);
                setFlagComment('');
              }}
              className="p-1 hover:bg-[#ffc107]/10 rounded"
            >
              <X className="w-4 h-4 text-[#616161]" />
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)] p-8">
        <div className="max-w-3xl mx-auto">
          <h4 className="text-[1.125rem] font-semibold text-[#212121] mb-2">
            Automated Verification Checks
          </h4>
          <p className="text-[0.875rem] text-[#616161] mb-6">
            Review the automated checks that have been performed on this organisation claim
          </p>

          {/* Success Summary */}
          <div className="bg-[#b9f6ca]/30 border border-[#00c853] rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#00c853]" />
              <div>
                <p className="text-[0.875rem] font-medium text-[#212121]">All Automated Checks Passed</p>
                <p className="text-[0.75rem] text-[#616161] mt-1">
                  All {checks.length} automated verification checks completed successfully
                </p>
              </div>
            </div>
          </div>

          {/* Checks List */}
          <div className="space-y-3 mb-6">
            {checks.map(check => (
              <div key={check.id} className="border border-[#e0e0e0] rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleCheck(check.id)}
                  className="w-full flex items-center gap-3 p-4 hover:bg-[#fafafa] transition-colors text-left"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#00c853] flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-[0.875rem] font-medium text-[#212121]">{check.name}</p>
                    <p className="text-[0.75rem] text-[#616161] mt-0.5">{check.description}</p>
                  </div>
                  {check.pdfUrl && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(check.pdfUrl, '_blank');
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 border border-[#101F36] text-[#101F36] rounded hover:bg-[#e3f2fd] transition-colors text-[0.75rem]"
                    >
                      <Download className="w-3 h-3" />
                      PDF
                    </button>
                  )}
                  {expandedCheck === check.id ? (
                    <ChevronUp className="w-5 h-5 text-[#616161]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#616161]" />
                  )}
                </button>

                {expandedCheck === check.id && check.jsonData && (
                  <div className="border-t border-[#e0e0e0] bg-[#fafafa] p-4">
                    <p className="text-[0.75rem] font-medium text-[#212121] mb-2">Check Results</p>
                    <pre className="text-[0.75rem] bg-white border border-[#e0e0e0] rounded p-3 overflow-x-auto">
                      {JSON.stringify(check.jsonData, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-[#e0e0e0] flex gap-3 justify-end">
            {!flagged && (
              <button
                onClick={() => setFlagged(true)}
                className="flex items-center gap-2 px-6 py-3 border border-[#ffc107] text-[#ffc107] rounded hover:bg-[#fff8e1] transition-colors text-[0.875rem] font-medium"
              >
                <Flag className="w-4 h-4" />
                FLAG FOR REVIEW
              </button>
            )}
            <button
              onClick={handleContinue}
              disabled={flagged && !flagComment.trim()}
              className="px-6 py-3 bg-[#101F36] text-white rounded hover:bg-[#1565c0] transition-colors text-[0.875rem] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              CONTINUE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
