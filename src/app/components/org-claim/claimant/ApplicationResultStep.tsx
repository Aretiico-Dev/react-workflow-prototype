import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface ApplicationResultStepProps {
  status: 'approved' | 'rejected';
  organisationName: string;
  rejectionReason?: string;
}

export function ApplicationResultStep({ status, organisationName, rejectionReason }: ApplicationResultStepProps) {
  const isApproved = status === 'approved';

  return (
    <div className="space-y-6">
      <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)] p-12">
        <div className="text-center max-w-lg mx-auto">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
            isApproved ? 'bg-[#b9f6ca]' : 'bg-[#f9d8d8]'
          }`}>
            {isApproved ? (
              <CheckCircle2 className="w-12 h-12 text-[#00c853]" />
            ) : (
              <XCircle className="w-12 h-12 text-[#f44336]" />
            )}
          </div>

          <h4 className="text-[1.5rem] font-semibold text-[#212121] mb-3">
            {isApproved ? 'Application Approved' : 'Application Not Approved'}
          </h4>
          <p className="text-[0.875rem] text-[#616161] mb-8">
            {isApproved
              ? `You are now the verified representative for ${organisationName}`
              : `Your application to represent ${organisationName} has not been approved`}
          </p>

          {isApproved && (
            <>
              {/* Success Details */}
              <div className="bg-[#b9f6ca]/30 border border-[#00c853] rounded-lg p-6 mb-6">
                <div className="space-y-3 text-left">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#00c853] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[0.875rem] font-medium text-[#212121]">Verified Representative</p>
                      <p className="text-[0.75rem] text-[#616161] mt-1">
                        You can now act on behalf of {organisationName} in the Aretiico portal
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#00c853] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[0.875rem] font-medium text-[#212121]">Access Granted</p>
                      <p className="text-[0.75rem] text-[#616161] mt-1">
                        Your account now has access to organisation management features
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* What You Can Do */}
              <div className="bg-[#e3f2fd] border border-[#90caf9] rounded-lg p-4 text-left mb-6">
                <p className="text-[0.75rem] font-medium text-[#212121] mb-2">What You Can Do Now</p>
                <ul className="text-[0.75rem] text-[#212121] space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="text-[#101F36]">•</span>
                    <span>Purchase TLS certificates for {organisationName}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#101F36]">•</span>
                    <span>Manage organisation validation status</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#101F36]">•</span>
                    <span>Update organisation contact details</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#101F36]">•</span>
                    <span>Add additional organisation representatives</span>
                  </li>
                </ul>
              </div>
            </>
          )}

          {!isApproved && (
            <>
              {/* Rejection Reason */}
              {rejectionReason && (
                <div className="bg-[#f9d8d8]/30 border border-[#f44336] rounded-lg p-6 mb-6 text-left">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-[#f44336] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[0.875rem] font-medium text-[#212121] mb-2">Reason for Rejection</p>
                      <p className="text-[0.875rem] text-[#212121] whitespace-pre-wrap">{rejectionReason}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* What You Can Do */}
              <div className="bg-[#fff8e1] border border-[#ffc107] rounded-lg p-4 text-left mb-6">
                <p className="text-[0.75rem] font-medium text-[#212121] mb-2">What You Can Do</p>
                <ul className="text-[0.75rem] text-[#212121] space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="text-[#ffc107]">•</span>
                    <span>Review the reason for rejection above</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ffc107]">•</span>
                    <span>Contact support if you believe this is an error</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ffc107]">•</span>
                    <span>Address the issues mentioned and reapply</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ffc107]">•</span>
                    <span>Ensure you have proper authorization from the organisation</span>
                  </li>
                </ul>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {!isApproved && (
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-6 py-3 bg-[#101F36] text-white rounded hover:bg-[#1565c0] transition-colors text-[0.875rem] font-medium"
              >
                START NEW APPLICATION
              </button>
            )}
            <button
              onClick={() => window.location.href = '/'}
              className={`${isApproved ? 'w-full' : 'flex-1'} px-6 py-3 ${
                isApproved
                  ? 'bg-[#101F36] text-white hover:bg-[#1565c0]'
                  : 'border border-[#e0e0e0] hover:bg-[#fafafa]'
              } rounded transition-colors text-[0.875rem] font-medium`}
            >
              RETURN TO DASHBOARD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
