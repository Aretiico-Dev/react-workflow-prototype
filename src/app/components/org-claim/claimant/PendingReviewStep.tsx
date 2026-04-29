import { Clock, CheckCircle, Mail } from 'lucide-react';

interface PendingReviewStepProps {
  organisationName: string;
}

export function PendingReviewStep({ organisationName }: PendingReviewStepProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)] p-12">
        <div className="text-center max-w-lg mx-auto">
          <div className="w-20 h-20 bg-[#e3f2fd] rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-10 h-10 text-[#101F36]" />
          </div>

          <h4 className="text-[1.5rem] font-semibold text-[#212121] mb-3">
            Application Submitted
          </h4>
          <p className="text-[0.875rem] text-[#616161] mb-8">
            Thank you for your application to represent <strong>{organisationName}</strong>.
            Your application is now being reviewed.
          </p>

          {/* Status Info */}
          <div className="bg-[#fafafa] border border-[#e0e0e0] rounded-lg p-6 mb-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-left">
                <CheckCircle className="w-5 h-5 text-[#00c853] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[0.875rem] font-medium text-[#212121]">Application Received</p>
                  <p className="text-[0.75rem] text-[#616161] mt-1">
                    We have received your application and supporting information
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-left">
                <div className="w-5 h-5 rounded-full border-2 border-[#101F36] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[0.875rem] font-medium text-[#212121]">Under Review</p>
                  <p className="text-[0.75rem] text-[#616161] mt-1">
                    Our team is currently reviewing your application
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-left opacity-50">
                <div className="w-5 h-5 rounded-full border-2 border-[#e0e0e0] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[0.875rem] font-medium text-[#212121]">Decision</p>
                  <p className="text-[0.75rem] text-[#616161] mt-1">
                    You'll be notified of our decision
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* What Happens Next */}
          <div className="bg-[#e3f2fd] border border-[#90caf9] rounded-lg p-4 text-left mb-6">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-[#101F36] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[0.75rem] font-medium text-[#212121] mb-2">What Happens Next</p>
                <ul className="text-[0.75rem] text-[#212121] space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="text-[#101F36]">•</span>
                    <span>We will conduct verification checks with the organisation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#101F36]">•</span>
                    <span>A person with significant control will be contacted to verify this application</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#101F36]">•</span>
                    <span>You'll receive an email when a decision has been made</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#101F36]">•</span>
                    <span>This process typically takes 3-5 business days</span>
                  </li>
                </ul>
              </div>
            </div>
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
