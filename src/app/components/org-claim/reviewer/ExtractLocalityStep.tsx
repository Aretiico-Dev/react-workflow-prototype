import { useState } from 'react';
import { MapPin, Flag, X, AlertCircle } from 'lucide-react';

interface ExtractLocalityStepProps {
  organisationName: string;
  registeredAddress: {
    line1: string;
    line2?: string;
    line3?: string;
    postcode: string;
    country: string;
  };
  onNext: (locality: string, state: string, flag?: { comment: string }) => void;
}

export function ExtractLocalityStep({ organisationName, registeredAddress, onNext }: ExtractLocalityStepProps) {
  const [flagged, setFlagged] = useState(false);
  const [flagComment, setFlagComment] = useState('');
  const [locality, setLocality] = useState('');
  const [state, setState] = useState('');

  const handleContinue = () => {
    if (!locality.trim() || !state.trim()) return;

    if (flagged && flagComment.trim()) {
      onNext(locality, state, { comment: flagComment });
    } else if (!flagged) {
      onNext(locality, state);
    }
  };

  const addressLines = [
    registeredAddress.line1,
    registeredAddress.line2,
    registeredAddress.line3,
    registeredAddress.postcode,
    registeredAddress.country,
  ].filter(Boolean);

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
        <div className="max-w-2xl mx-auto">
          <h4 className="text-[1.125rem] font-semibold text-[#212121] mb-2">
            Extract Locality and State
          </h4>
          <p className="text-[0.875rem] text-[#616161] mb-6">
            Review the registered address and determine the locality and state for certificate issuance
          </p>

          {/* Organisation Info */}
          <div className="bg-[#fafafa] border border-[#e0e0e0] rounded-lg p-4 mb-6">
            <p className="text-[0.75rem] text-[#616161] mb-2">Organisation</p>
            <p className="text-[1rem] font-semibold text-[#212121]">{organisationName}</p>
          </div>

          {/* Registered Address */}
          <div className="mb-6">
            <h5 className="text-[1rem] font-semibold text-[#212121] mb-3">Registered Address</h5>
            <div className="bg-[#e3f2fd] border border-[#90caf9] rounded-lg p-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#101F36] flex-shrink-0 mt-0.5" />
                <div>
                  {addressLines.map((line, index) => (
                    <p key={index} className="text-[0.875rem] text-[#212121]">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Extract Fields */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="text-[0.875rem] font-medium text-[#212121] block mb-2">
                Locality *
              </label>
              <input
                type="text"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                placeholder="e.g. Westminster, Oxford, City of London"
                className="w-full px-4 py-3 border border-[#e0e0e0] rounded text-[0.875rem] focus:outline-none focus:border-[#101F36]"
              />
              <p className="text-[0.75rem] text-[#616161] mt-1">
                The town, city, or district where the organisation is located
              </p>
            </div>

            <div>
              <label className="text-[0.875rem] font-medium text-[#212121] block mb-2">
                State/Province/County *
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. Greater London, Oxfordshire, Surrey"
                className="w-full px-4 py-3 border border-[#e0e0e0] rounded text-[0.875rem] focus:outline-none focus:border-[#101F36]"
              />
              <p className="text-[0.75rem] text-[#616161] mt-1">
                The state, province, or county where the organisation is located
              </p>
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-[#fff8e1] border border-[#ffc107] rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#ffc107] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[0.75rem] font-medium text-[#212121] mb-2">Guidelines</p>
                <ul className="text-[0.75rem] text-[#212121] space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="text-[#ffc107]">•</span>
                    <span>These values will appear on TLS and S/MIME certificates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ffc107]">•</span>
                    <span>Use your best judgment for ambiguous addresses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ffc107]">•</span>
                    <span>You may need to research online to determine the correct locality and state</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ffc107]">•</span>
                    <span>Example: "Buckingham Palace, London" → Locality: Westminster, State: Greater London</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ffc107]">•</span>
                    <span>For addresses outside England, use appropriate administrative divisions</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-[#e0e0e0] flex gap-3 justify-end">
            {!flagged && locality.trim() && state.trim() && (
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
              disabled={!locality.trim() || !state.trim() || (flagged && !flagComment.trim())}
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
