import { CheckCircle2, Clock } from 'lucide-react';

interface ReviewSentStepProps {
  organisationName: string;
}

export function ReviewSentStep({ organisationName }: ReviewSentStepProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)] p-12">
        <div className="text-center max-w-lg mx-auto">
          <div className="w-20 h-20 bg-[#b9f6ca] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-[#00c853]" />
          </div>

          <h4 className="text-[1.5rem] font-semibold text-[#212121] mb-3">
            Sent for Admin Review
          </h4>
          <p className="text-[0.875rem] text-[#616161] mb-8">
            This organisation claim for {organisationName} has been successfully submitted to the admin approver for final review
          </p>

          {/* Status Info */}
          <div className="bg-[#fafafa] border border-[#e0e0e0] rounded-lg p-6 mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Clock className="w-5 h-5 text-[#101F36]" />
              <span className="text-[0.875rem] font-medium text-[#212121]">
                Pending Admin Approval
              </span>
            </div>
            <p className="text-[0.75rem] text-[#616161]">
              The admin approver will review all evidence and make a final decision
            </p>
          </div>

          {/* What's Next */}
          <div className="bg-[#e3f2fd] border border-[#90caf9] rounded-lg p-4 text-left mb-6">
            <p className="text-[0.75rem] font-medium text-[#212121] mb-2">What Happens Next</p>
            <ul className="text-[0.75rem] text-[#212121] space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-[#101F36]">•</span>
                <span>The admin approver will review all verification evidence</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#101F36]">•</span>
                <span>They will either approve or reject the organisation claim</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#101F36]">•</span>
                <span>The claimant will be notified of the final decision</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#101F36]">•</span>
                <span>You'll receive a notification when the review is complete</span>
              </li>
            </ul>
          </div>

          {/* Action Button */}
          <button
            onClick={() => window.location.href = '/'}
            className="px-8 py-3 bg-[#101F36] text-white rounded hover:bg-[#1565c0] transition-colors text-[0.875rem] font-medium"
          >
            RETURN TO DASHBOARD
          </button>
        </div>
      </div>
    </div>
  );
}
