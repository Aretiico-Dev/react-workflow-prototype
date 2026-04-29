import { useState } from 'react';
import { Phone, CheckCircle, Mail, Calendar, MessageSquare, Flag, X, XCircle } from 'lucide-react';

interface PhoneCallStepProps {
  pscContact: {
    name: string;
    role: string;
    phone: string;
  };
  claimantName: string;
  reviewerName: string;
  onNext: (callData: {
    orgAccepts: boolean;
    teamsEmail: string;
    callDateTime: string;
    comments: string;
  }, flag?: { comment: string }) => void;
  onCancel: (reason: string) => void;
}

export function PhoneCallStep({ pscContact, claimantName, reviewerName, onNext, onCancel }: PhoneCallStepProps) {
  const [flagged, setFlagged] = useState(false);
  const [flagComment, setFlagComment] = useState('');
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const [orgAccepts, setOrgAccepts] = useState(false);
  const [teamsEmail, setTeamsEmail] = useState('');
  const [callDateTime, setCallDateTime] = useState('');
  const [comments, setComments] = useState('');

  const isValid = orgAccepts && teamsEmail.trim() && callDateTime;

  const handleContinue = () => {
    if (!isValid) return;

    if (flagged && flagComment.trim()) {
      onNext({ orgAccepts, teamsEmail, callDateTime, comments }, { comment: flagComment });
    } else if (!flagged) {
      onNext({ orgAccepts, teamsEmail, callDateTime, comments });
    }
  };

  const handleCancelApplication = () => {
    if (cancelReason.trim()) {
      onCancel(cancelReason);
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

      {/* Cancel Dialog */}
      {showCancelDialog && (
        <div className="bg-[#f9d8d8] border-l-4 border-[#f44336] p-4 rounded">
          <div className="flex items-start gap-3">
            <XCircle className="w-5 h-5 text-[#f44336] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-[0.875rem] font-medium text-[#212121] mb-2">
                Cancel This Application
              </p>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Provide a reason for cancelling this application..."
                className="w-full px-3 py-2 border border-[#e0e0e0] rounded text-[0.875rem] min-h-[80px] resize-none mb-3"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCancelDialog(false)}
                  className="px-4 py-2 border border-[#e0e0e0] rounded hover:bg-white transition-colors text-[0.75rem]"
                >
                  KEEP APPLICATION
                </button>
                <button
                  onClick={handleCancelApplication}
                  disabled={!cancelReason.trim()}
                  className="px-4 py-2 bg-[#f44336] text-white rounded hover:bg-[#d32f2f] transition-colors text-[0.75rem] disabled:opacity-50"
                >
                  CONFIRM CANCELLATION
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)] p-8">
        <div className="max-w-2xl mx-auto">
          <h4 className="text-[1.125rem] font-semibold text-[#212121] mb-2">
            Phone Call Verification
          </h4>
          <p className="text-[0.875rem] text-[#616161] mb-6">
            Call the person with significant control to verify the application
          </p>

          {/* Contact Information */}
          <div className="bg-[#e3f2fd] border border-[#90caf9] rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <Phone className="w-5 h-5 text-[#101F36]" />
              <p className="text-[0.875rem] font-medium text-[#212121]">Contact Details</p>
            </div>
            <div className="space-y-2 text-[0.875rem]">
              <div className="flex gap-2">
                <span className="text-[#616161] w-20">Name:</span>
                <span className="text-[#212121] font-medium">{pscContact.name}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-[#616161] w-20">Role:</span>
                <span className="text-[#212121]">{pscContact.role}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-[#616161] w-20">Phone:</span>
                <span className="text-[#212121] font-medium">{pscContact.phone}</span>
              </div>
            </div>
          </div>

          {/* Call Script */}
          <div className="border border-[#e0e0e0] rounded-lg p-4 mb-6">
            <p className="text-[0.875rem] font-medium text-[#212121] mb-3">Call Script</p>
            <div className="space-y-3 text-[0.875rem]">
              <p className="text-[#212121]">
                "Hello, this is {reviewerName} from Aretiico. I'm calling about an application we received from {claimantName}{' '}
                to become an official representative for your organisation."
              </p>
              <p className="text-[#212121]">
                "Are you aware of this application, and can you confirm that {claimantName} is authorized to represent
                your organisation in our system?"
              </p>
              <p className="text-[#616161] text-[0.75rem] italic">
                If they confirm: "Great. We'll need to schedule a brief Teams video call to complete the verification.
                Could you provide an email address where we can send the meeting invite?"
              </p>
            </div>
          </div>

          {/* Call Results */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="flex items-center gap-3 cursor-pointer p-3 border-2 border-[#e0e0e0] rounded hover:bg-[#fafafa] transition-colors">
                <input
                  type="checkbox"
                  checked={orgAccepts}
                  onChange={(e) => setOrgAccepts(e.target.checked)}
                  className="w-5 h-5"
                />
                <div className="flex-1">
                  <span className="text-[0.875rem] font-medium text-[#212121]">
                    Organisation accepts the claimant as their representative
                  </span>
                </div>
                {orgAccepts && <CheckCircle className="w-5 h-5 text-[#00c853]" />}
              </label>
            </div>

            <div>
              <label className="text-[0.875rem] font-medium text-[#212121] block mb-2">
                Email for Teams Call <span className="text-[#f44336]">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#616161]" />
                <input
                  type="email"
                  value={teamsEmail}
                  onChange={(e) => setTeamsEmail(e.target.value)}
                  placeholder="email@company.com"
                  className="w-full pl-10 pr-4 py-3 border border-[#e0e0e0] rounded text-[0.875rem] focus:outline-none focus:border-[#101F36]"
                />
              </div>
              <p className="text-[0.75rem] text-[#616161] mt-2">
                Enter the email address provided during the phone call. It does not need to match the PSC email verified earlier.
              </p>
            </div>

            <div>
              <label className="text-[0.875rem] font-medium text-[#212121] block mb-2">
                Teams Call Date & Time <span className="text-[#f44336]">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#616161]" />
                <input
                  type="datetime-local"
                  value={callDateTime}
                  onChange={(e) => setCallDateTime(e.target.value)}
                  disabled={!orgAccepts}
                  className="w-full pl-10 pr-4 py-3 border border-[#e0e0e0] rounded text-[0.875rem] focus:outline-none focus:border-[#101F36] disabled:bg-[#fafafa] disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="text-[0.875rem] font-medium text-[#212121] block mb-2">
                Call Notes (Optional)
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-[#616161]" />
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Add any notes or observations from the phone call..."
                  className="w-full pl-10 pr-4 py-3 border border-[#e0e0e0] rounded text-[0.875rem] min-h-[100px] resize-none focus:outline-none focus:border-[#101F36]"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-[#e0e0e0] flex gap-3 justify-between">
            <button
              onClick={() => setShowCancelDialog(true)}
              className="flex items-center gap-2 px-6 py-3 border border-[#f44336] text-[#f44336] rounded hover:bg-[#f9d8d8] transition-colors text-[0.875rem] font-medium"
            >
              <XCircle className="w-4 h-4" />
              CANCEL APPLICATION
            </button>

            <div className="flex gap-3">
              {!flagged && isValid && (
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
                disabled={!isValid || (flagged && !flagComment.trim())}
                className="px-6 py-3 bg-[#101F36] text-white rounded hover:bg-[#1565c0] transition-colors text-[0.875rem] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                CONTINUE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
