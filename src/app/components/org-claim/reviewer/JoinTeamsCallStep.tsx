import { useState } from 'react';
import { Video, ExternalLink, Flag, X, CheckCircle } from 'lucide-react';

interface JoinTeamsCallStepProps {
  callDateTime: string;
  pscName: string;
  claimantName: string;
  reviewerName: string;
  onContinue: (flag?: { comment: string }) => void;
}

export function JoinTeamsCallStep({ callDateTime, pscName, claimantName, reviewerName, onContinue }: JoinTeamsCallStepProps) {
  const [flagged, setFlagged] = useState(false);
  const [flagComment, setFlagComment] = useState('');

  const handleStartCall = () => {
    window.open('https://teams.microsoft.com/l/meetup-join/', '_blank');
  };

  const handleRecordResults = () => {
    if (flagged && flagComment.trim()) {
      onContinue({ comment: flagComment });
    } else if (!flagged) {
      onContinue();
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
            Organisation Verification Call
          </h4>
          <p className="text-[0.875rem] text-[#616161] mb-6">
            Join the scheduled Teams call to verify the organisation's acceptance
          </p>

          {/* Call Details */}
          <div className="bg-[#e3f2fd] border border-[#90caf9] rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Video className="w-6 h-6 text-[#101F36]" />
              <span className="text-[1rem] font-semibold text-[#212121]">Scheduled Call</span>
            </div>
            <p className="text-[0.875rem] text-[#212121] mb-1">
              {new Date(callDateTime).toLocaleDateString('en-GB', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
            <p className="text-[0.875rem] text-[#616161]">
              {new Date(callDateTime).toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>

          {/* Call Script */}
          <div className="border border-[#e0e0e0] rounded-lg p-6 mb-6">
            <h5 className="text-[1rem] font-semibold text-[#212121] mb-4">Call Script</h5>
            <div className="space-y-4 text-[0.875rem]">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[#101F36] text-white flex items-center justify-center text-[0.75rem] flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="font-medium text-[#212121]">Introduction</p>
                  <p className="text-[#616161] mt-1">
                    "Hello {pscName}, thank you for joining this call. I'm {reviewerName} from Aretiico.
                    This call should take about 10 minutes."
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[#101F36] text-white flex items-center justify-center text-[0.75rem] flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="font-medium text-[#212121]">Confirm Identity</p>
                  <p className="text-[#616161] mt-1">
                    "Can you confirm your full name and your role at the organisation for our records?"
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[#101F36] text-white flex items-center justify-center text-[0.75rem] flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="font-medium text-[#212121]">Verify Application</p>
                  <p className="text-[#616161] mt-1">
                    "Can you confirm that {claimantName} is authorized to act as your organisation's
                    representative in the Aretiico system?"
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[#101F36] text-white flex items-center justify-center text-[0.75rem] flex-shrink-0">
                  4
                </div>
                <div>
                  <p className="font-medium text-[#212121]">Email Confirmation</p>
                  <p className="text-[#616161] mt-1">
                    "We'll need you to send us a confirmation email from your organisation's email address.
                    Please send it to validations@aretiico.com with the subject 'Organisation Representative Confirmation'.
                    The email should state that you confirm {claimantName}'s authority to represent your organisation."
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[#101F36] text-white flex items-center justify-center text-[0.75rem] flex-shrink-0">
                  5
                </div>
                <div>
                  <p className="font-medium text-[#212121]">Closing</p>
                  <p className="text-[#616161] mt-1">
                    "Thank you for your time. Once we receive your email confirmation, we'll complete the verification process.
                    You should hear from us within 1-2 business days."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-[#fafafa] border border-[#e0e0e0] rounded-lg p-4 mb-6">
            <p className="text-[0.75rem] font-medium text-[#212121] mb-2">Important Reminders</p>
            <ul className="text-[0.75rem] text-[#616161] space-y-1">
              <li>• Ensure the call is being recorded in Teams</li>
              <li>• Verify the person matches the expected contact details</li>
              <li>• Note any concerns or unusual responses</li>
              <li>• Explain the email confirmation requirement clearly</li>
            </ul>
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
              onClick={handleStartCall}
              className="flex items-center gap-2 px-6 py-3 bg-[#00c853] text-white rounded hover:bg-[#00a844] transition-colors text-[0.875rem] font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              JOIN CALL IN TEAMS
            </button>
            <button
              onClick={handleRecordResults}
              className="flex items-center gap-2 px-6 py-3 bg-[#101F36] text-white rounded hover:bg-[#1565c0] transition-colors text-[0.875rem] font-medium"
            >
              <CheckCircle className="w-4 h-4" />
              CONTINUE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
