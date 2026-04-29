import { useEffect } from 'react';
import { Loader2, FileSearch, CheckCircle2 } from 'lucide-react';

interface ExtractingDetailsStepProps {
  onComplete: () => void;
}

export function ExtractingDetailsStep({ onComplete }: ExtractingDetailsStepProps) {
  useEffect(() => {
    // Simulate extraction process (3 seconds)
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)] p-12">
        <div className="text-center max-w-lg mx-auto">
          <div className="w-20 h-20 bg-[#e3f2fd] rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <FileSearch className="w-10 h-10 text-[#101F36]" />
            <Loader2 className="w-24 h-24 text-[#101F36] absolute animate-spin opacity-20" />
          </div>

          <h4 className="text-[1.5rem] font-semibold text-[#212121] mb-3">
            Extracting Details from Documents
          </h4>
          <p className="text-[0.875rem] text-[#616161] mb-8">
            Please wait while we process your documents and extract the information...
          </p>

          {/* Progress Steps */}
          <div className="space-y-3 max-w-md mx-auto">
            <div className="flex items-start gap-3 p-3 border border-[#e0e0e0] rounded-lg bg-[#fafafa]">
              <CheckCircle2 className="w-5 h-5 text-[#00c853] flex-shrink-0 mt-0.5" />
              <div className="flex-1 text-left">
                <p className="text-[0.875rem] font-medium text-[#212121]">Documents uploaded</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 border-2 border-[#101F36] rounded-lg bg-[#e3f2fd]">
              <Loader2 className="w-5 h-5 text-[#101F36] flex-shrink-0 mt-0.5 animate-spin" />
              <div className="flex-1 text-left">
                <p className="text-[0.875rem] font-medium text-[#212121]">Analyzing ID document</p>
                <p className="text-[0.75rem] text-[#616161] mt-1">
                  Extracting name, date of birth, and document details
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 border border-[#e0e0e0] rounded-lg opacity-50">
              <Loader2 className="w-5 h-5 text-[#616161] flex-shrink-0 mt-0.5" />
              <div className="flex-1 text-left">
                <p className="text-[0.875rem] font-medium text-[#616161]">Analyzing proof of address</p>
                <p className="text-[0.75rem] text-[#616161] mt-1">
                  Extracting issuer and document type
                </p>
              </div>
            </div>
          </div>

          <p className="text-[0.75rem] text-[#616161] mt-8">
            This usually takes 5-10 seconds
          </p>
        </div>
      </div>
    </div>
  );
}
