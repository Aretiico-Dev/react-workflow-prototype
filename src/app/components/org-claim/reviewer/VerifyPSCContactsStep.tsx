import { useState } from 'react';
import { CheckCircle, Lock, Unlock, Flag, X } from 'lucide-react';

interface VerifyPSCContactsStepProps {
  providedContacts: {
    name: string;
    role: string;
    phone: string;
    email: string;
  };
  onNext: (verifiedContacts: {
    name: string;
    role: string;
    phone: string;
    email: string;
  }, flag?: { comment: string }) => void;
}

export function VerifyPSCContactsStep({ providedContacts, onNext }: VerifyPSCContactsStepProps) {
  const [flagged, setFlagged] = useState(false);
  const [flagComment, setFlagComment] = useState('');
  const [locked, setLocked] = useState(false);
  const [contacts, setContacts] = useState(providedContacts);

  const handleSave = () => {
    setLocked(true);
  };

  const handleUnlock = () => {
    setLocked(false);
  };

  const handleContinue = () => {
    if (flagged && flagComment.trim()) {
      onNext(contacts, { comment: flagComment });
    } else if (!flagged) {
      onNext(contacts);
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
        <div className="max-w-2xl mx-auto">
          <h4 className="text-[1.125rem] font-semibold text-[#212121] mb-2">
            Verify PSC Contact Details
          </h4>
          <p className="text-[0.875rem] text-[#616161] mb-6">
            Verify that the contact details provided for the person with significant control are credible
          </p>

          {/* Locked Status */}
          {locked && (
            <div className="bg-[#b9f6ca]/30 border border-[#00c853] rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-[#00c853]" />
                <div className="flex-1">
                  <p className="text-[0.875rem] font-medium text-[#212121]">Contact Details Verified</p>
                  <p className="text-[0.75rem] text-[#616161] mt-1">
                    These details have been checked and will be used to contact the organisation
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Contact Form */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="text-[0.875rem] font-medium text-[#212121] block mb-2">
                Name *
              </label>
              <input
                type="text"
                value={contacts.name}
                onChange={(e) => setContacts({ ...contacts, name: e.target.value })}
                disabled={locked}
                className={`w-full px-4 py-3 border border-[#e0e0e0] rounded text-[0.875rem] focus:outline-none focus:border-[#101F36] ${
                  locked ? 'bg-[#fafafa] cursor-not-allowed' : ''
                }`}
              />
            </div>

            <div>
              <label className="text-[0.875rem] font-medium text-[#212121] block mb-2">
                Role *
              </label>
              <input
                type="text"
                value={contacts.role}
                onChange={(e) => setContacts({ ...contacts, role: e.target.value })}
                disabled={locked}
                className={`w-full px-4 py-3 border border-[#e0e0e0] rounded text-[0.875rem] focus:outline-none focus:border-[#101F36] ${
                  locked ? 'bg-[#fafafa] cursor-not-allowed' : ''
                }`}
              />
            </div>

            <div>
              <label className="text-[0.875rem] font-medium text-[#212121] block mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={contacts.phone}
                onChange={(e) => setContacts({ ...contacts, phone: e.target.value })}
                disabled={locked}
                className={`w-full px-4 py-3 border border-[#e0e0e0] rounded text-[0.875rem] focus:outline-none focus:border-[#101F36] ${
                  locked ? 'bg-[#fafafa] cursor-not-allowed' : ''
                }`}
              />
            </div>

            <div>
              <label className="text-[0.875rem] font-medium text-[#212121] block mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={contacts.email}
                onChange={(e) => setContacts({ ...contacts, email: e.target.value })}
                disabled={locked}
                className={`w-full px-4 py-3 border border-[#e0e0e0] rounded text-[0.875rem] focus:outline-none focus:border-[#101F36] ${
                  locked ? 'bg-[#fafafa] cursor-not-allowed' : ''
                }`}
              />
            </div>
          </div>

          {/* Verification Instructions */}
          <div className="bg-[#e3f2fd] border border-[#90caf9] rounded-lg p-4 mb-6">
            <p className="text-[0.75rem] font-medium text-[#212121] mb-2">Verification Steps</p>
            <ul className="text-[0.75rem] text-[#212121] space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-[#101F36]">•</span>
                <span>Search for the person online (LinkedIn, company website, etc.)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#101F36]">•</span>
                <span>Verify their role at the organisation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#101F36]">•</span>
                <span>Check if contact details appear credible and match public information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#101F36]">•</span>
                <span>Update fields if you find more appropriate contact details</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#101F36]">•</span>
                <span>Save once you're confident these are the correct details to use</span>
              </li>
            </ul>
          </div>

          {/* Lock/Unlock Actions */}
          <div className="mb-6 flex gap-3">
            {!locked ? (
              <button
                onClick={handleSave}
                disabled={!contacts.name || !contacts.role || !contacts.phone || !contacts.email}
                className="flex items-center gap-2 px-6 py-3 bg-[#00c853] text-white rounded hover:bg-[#00a844] transition-colors text-[0.875rem] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Lock className="w-4 h-4" />
                SAVE & LOCK DETAILS
              </button>
            ) : (
              <button
                onClick={handleUnlock}
                className="flex items-center gap-2 px-6 py-3 border border-[#e0e0e0] rounded hover:bg-[#fafafa] transition-colors text-[0.875rem] font-medium"
              >
                <Unlock className="w-4 h-4" />
                UNLOCK TO EDIT
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-[#e0e0e0] flex gap-3 justify-end">
            {!flagged && locked && (
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
              disabled={!locked || (flagged && !flagComment.trim())}
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
