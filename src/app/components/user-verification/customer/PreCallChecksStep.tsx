import { useEffect } from 'react';
import { Loader2, Shield, CheckCircle2, AlertCircle } from 'lucide-react';

interface PreCallChecksStepProps {
  onComplete: () => void;
}

export function PreCallChecksStep({ onComplete }: PreCallChecksStepProps) {
  useEffect(() => {
    // Simulate background checks (5 seconds for demo)
    const timer = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)] p-12">
        <div className="text-center max-w-lg mx-auto">
          <div className="w-20 h-20 bg-[#e3f2fd] rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <Shield className="w-10 h-10 text-[#101F36]" />
            <Loader2 className="w-24 h-24 text-[#101F36] absolute animate-spin opacity-20" />
          </div>

          <h4 className="text-[1.5rem] font-semibold text-[#212121] mb-3">
            Running Initial Background Checks
          </h4>
          <p className="text-[0.875rem] text-[#616161] mb-8">
            We're conducting preliminary verification checks before scheduling your video call. This process typically takes 1-2 business days.
          </p>

          {/* Progress Steps */}
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3 p-4 border border-[#e0e0e0] rounded-lg bg-[#fafafa]">
              <CheckCircle2 className="w-5 h-5 text-[#00c853] flex-shrink-0 mt-0.5" />
              <div className="flex-1 text-left">
                <p className="text-[0.875rem] font-medium text-[#212121]">Documents uploaded</p>
                <p className="text-[0.75rem] text-[#616161] mt-1">ID and proof of address received</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 border border-[#e0e0e0] rounded-lg bg-[#fafafa]">
              <CheckCircle2 className="w-5 h-5 text-[#00c853] flex-shrink-0 mt-0.5" />
              <div className="flex-1 text-left">
                <p className="text-[0.875rem] font-medium text-[#212121]">Details confirmed</p>
                <p className="text-[0.75rem] text-[#616161] mt-1">Personal information verified</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 border-2 border-[#101F36] rounded-lg bg-[#e3f2fd]">
              <Loader2 className="w-5 h-5 text-[#101F36] flex-shrink-0 mt-0.5 animate-spin" />
              <div className="flex-1 text-left">
                <p className="text-[0.875rem] font-medium text-[#212121]">Initial screening</p>
                <p className="text-[0.75rem] text-[#616161] mt-1">
                  Running preliminary identity verification checks
                </p>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="flex items-start gap-3 p-4 bg-[#e3f2fd] border border-[#90caf9] rounded text-left">
            <AlertCircle className="w-5 h-5 text-[#101F36] mt-0.5 flex-shrink-0" />
            <div className="text-[0.75rem] text-[#212121]">
              <strong>What happens next?</strong>
              <p className="mt-2">
                Once our initial checks are complete, you'll be able to schedule your verification video call.
                We'll send you an email when you're ready to proceed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
