import { useState } from 'react';
import { Download, FileText, AlertCircle } from 'lucide-react';

interface AcceptTermsStepProps {
  onNext: () => void;
}

export function AcceptTermsStep({ onNext }: AcceptTermsStepProps) {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)] p-8">
        <div className="max-w-4xl mx-auto">
          <h4 className="text-[1.125rem] font-semibold text-[#212121] mb-2">
            Terms and Conditions
          </h4>
          <p className="text-[0.875rem] text-[#616161] mb-6">
            Please review and accept our terms and conditions to continue
          </p>

          {/* PDF Viewer */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#101F36]" />
                <span className="text-[0.875rem] font-medium text-[#212121]">
                  Organisation Representative Terms & Conditions
                </span>
              </div>
              <a
                href="/terms/organisation-representative-terms.pdf"
                download
                className="flex items-center gap-2 px-3 py-1.5 border border-[#101F36] text-[#101F36] rounded hover:bg-[#e3f2fd] transition-colors text-[0.75rem]"
              >
                <Download className="w-3 h-3" />
                Download PDF
              </a>
            </div>

            {/* Embedded PDF Viewer */}
            <div className="border border-[#e0e0e0] rounded-lg overflow-hidden bg-[#fafafa] min-h-[600px]">
              <iframe
                src="/terms/organisation-representative-terms.pdf"
                className="w-full h-[600px]"
                title="Terms and Conditions"
              />
              {/* Fallback if PDF doesn't load */}
              <div className="p-8 text-center">
                <FileText className="w-12 h-12 text-[#616161] mx-auto mb-3" />
                <p className="text-[0.875rem] text-[#616161] mb-3">
                  Unable to display PDF in browser
                </p>
                <a
                  href="/terms/organisation-representative-terms.pdf"
                  download
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#101F36] text-white rounded hover:bg-[#1565c0] transition-colors text-[0.875rem]"
                >
                  <Download className="w-4 h-4" />
                  Download to View
                </a>
              </div>
            </div>
          </div>

          {/* Key Points */}
          <div className="bg-[#e3f2fd] border border-[#90caf9] rounded-lg p-4 mb-6">
            <p className="text-[0.75rem] font-medium text-[#212121] mb-2">Key Points</p>
            <ul className="text-[0.75rem] text-[#212121] space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-[#101F36]">•</span>
                <span>You confirm you have authority to represent this organisation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#101F36]">•</span>
                <span>You agree to act in accordance with the organisation's interests</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#101F36]">•</span>
                <span>You will notify us if your relationship with the organisation changes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#101F36]">•</span>
                <span>You understand that false information may result in legal action</span>
              </li>
            </ul>
          </div>

          {/* Acceptance */}
          <div className="mb-6">
            <label className="flex items-start gap-3 cursor-pointer p-4 border-2 border-[#e0e0e0] rounded hover:bg-[#fafafa] transition-colors">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="mt-0.5 w-5 h-5"
              />
              <span className="text-[0.875rem] text-[#212121]">
                I have read and accept the Terms and Conditions for Organisation Representatives
              </span>
            </label>
          </div>

          {!accepted && (
            <div className="flex items-start gap-3 p-4 bg-[#fff8e1] border border-[#ffc107] rounded mb-6">
              <AlertCircle className="w-5 h-5 text-[#ffc107] flex-shrink-0 mt-0.5" />
              <p className="text-[0.75rem] text-[#212121]">
                You must accept the terms and conditions to submit your application
              </p>
            </div>
          )}

          {/* Action */}
          <div className="pt-6 border-t border-[#e0e0e0] flex justify-end">
            <button
              onClick={onNext}
              disabled={!accepted}
              className="px-6 py-3 bg-[#101F36] text-white rounded hover:bg-[#1565c0] transition-colors text-[0.875rem] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              COMPLETE APPLICATION
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
