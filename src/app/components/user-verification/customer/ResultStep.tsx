import { CheckCircle2, XCircle, Calendar, AlertCircle } from 'lucide-react';

interface ResultStepProps {
  status: 'approved' | 'rejected';
}

export function ResultStep({ status }: ResultStepProps) {
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);

  const reminderDate = new Date(expiryDate);
  reminderDate.setMonth(reminderDate.getMonth() - 1);

  const reapplyDate = new Date();
  reapplyDate.setMonth(reapplyDate.getMonth() + 3);

  if (status === 'approved') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)] p-12">
          <div className="text-center max-w-lg mx-auto">
            <div className="w-20 h-20 bg-[#b9f6ca] rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-[#00c853]" />
            </div>

            <h4 className="text-[1.5rem] font-semibold text-[#212121] mb-3">
              Verification Approved
            </h4>
            <p className="text-[0.875rem] text-[#616161] mb-8">
              Congratulations! Your identity verification has been successfully completed.
            </p>

            {/* Validity Information */}
            <div className="bg-[#fafafa] border border-[#e0e0e0] rounded-lg p-6 mb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Calendar className="w-5 h-5 text-[#101F36]" />
                <span className="text-[0.875rem] font-medium text-[#212121]">
                  Verification Valid Until
                </span>
              </div>
              <p className="text-[1.25rem] font-semibold text-[#212121]">
                {expiryDate.toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>

            {/* Success Details */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3 p-4 border border-[#00c853] bg-[#b9f6ca] rounded-lg text-left">
                <CheckCircle2 className="w-5 h-5 text-[#00c853] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-[0.875rem] font-medium text-[#212121]">Verification Complete</p>
                  <p className="text-[0.75rem] text-[#616161] mt-1">
                    Your identity has been verified and approved by our team
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 border border-[#00c853] bg-[#b9f6ca] rounded-lg text-left">
                <Calendar className="w-5 h-5 text-[#00c853] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-[0.875rem] font-medium text-[#212121]">Valid for One Year</p>
                  <p className="text-[0.75rem] text-[#616161] mt-1">
                    Your verification is valid until {expiryDate.toLocaleDateString('en-GB')}
                  </p>
                </div>
              </div>
            </div>

            {/* Renewal Information */}
            <div className="flex items-start gap-3 p-4 bg-[#e3f2fd] border border-[#90caf9] rounded text-left">
              <AlertCircle className="w-5 h-5 text-[#101F36] mt-0.5 flex-shrink-0" />
              <div className="text-[0.75rem] text-[#212121]">
                <strong>Renewal Reminder</strong>
                <p className="mt-2">
                  We'll send you an email notification on{' '}
                  <strong>{reminderDate.toLocaleDateString('en-GB')}</strong> (one month before expiry)
                  inviting you to renew your verification.
                </p>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => window.location.href = '/'}
              className="mt-6 px-8 py-3 bg-[#101F36] text-white rounded hover:bg-[#1565c0] transition-colors text-[0.875rem] font-medium"
            >
              RETURN TO DASHBOARD
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Rejected status
  return (
    <div className="space-y-6">
      <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)] p-12">
        <div className="text-center max-w-lg mx-auto">
          <div className="w-20 h-20 bg-[#f9d8d8] rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-[#f44336]" />
          </div>

          <h4 className="text-[1.5rem] font-semibold text-[#212121] mb-3">
            Verification Not Approved
          </h4>
          <p className="text-[0.875rem] text-[#616161] mb-8">
            Unfortunately, we were unable to approve your identity verification at this time.
          </p>

          {/* Rejection Reasons */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3 p-4 border border-[#f44336] bg-[#f9d8d8] rounded-lg text-left">
              <XCircle className="w-5 h-5 text-[#f44336] flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-[0.875rem] font-medium text-[#212121]">Verification Unsuccessful</p>
                <p className="text-[0.75rem] text-[#616161] mt-1">
                  Our verification team was unable to confirm your identity based on the information provided
                </p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-[#fafafa] border border-[#e0e0e0] rounded-lg p-6 mb-6">
            <h5 className="text-[1rem] font-semibold text-[#212121] mb-4">What You Can Do</h5>
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#101F36] text-white flex items-center justify-center text-[0.75rem] flex-shrink-0">
                  1
                </div>
                <p className="text-[0.875rem] text-[#616161]">
                  Check your email for specific feedback from our verification team
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#101F36] text-white flex items-center justify-center text-[0.75rem] flex-shrink-0">
                  2
                </div>
                <p className="text-[0.875rem] text-[#616161]">
                  Ensure your documents are clear, valid, and meet our requirements
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#101F36] text-white flex items-center justify-center text-[0.75rem] flex-shrink-0">
                  3
                </div>
                <p className="text-[0.875rem] text-[#616161]">
                  Contact support if you need guidance on the verification requirements
                </p>
              </div>
            </div>
          </div>

          {/* Reapplication Info */}
          <div className="flex items-start gap-3 p-4 bg-[#fff8e1] border border-[#ffc107] rounded text-left mb-6">
            <AlertCircle className="w-5 h-5 text-[#ffc107] mt-0.5 flex-shrink-0" />
            <div className="text-[0.75rem] text-[#212121]">
              <strong>Reapplication Policy</strong>
              <p className="mt-2">
                You must wait 3 months before submitting a new verification application.
                You will be able to reapply from{' '}
                <strong>{reapplyDate.toLocaleDateString('en-GB')}</strong>.
              </p>
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
