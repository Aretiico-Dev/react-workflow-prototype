import { useState } from 'react';
import { Flag, X } from 'lucide-react';

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
  }, evidence: {
    decisionNotes: string;
    supportingFiles: File[];
  }, flag?: { comment: string }) => void;
}

export function VerifyPSCContactsStep({ providedContacts, onNext }: VerifyPSCContactsStepProps) {
  const [flagged, setFlagged] = useState(false);
  const [flagComment, setFlagComment] = useState('');
  const [contacts, setContacts] = useState(providedContacts);
  const [decisionNotes, setDecisionNotes] = useState('');
  const [supportingFiles, setSupportingFiles] = useState<File[]>([]);

  const handleContinue = () => {
    if (flagged && flagComment.trim()) {
      onNext(contacts, { decisionNotes, supportingFiles }, { comment: flagComment });
    } else if (!flagged) {
      onNext(contacts, { decisionNotes, supportingFiles });
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
            Verify that the contact details provided for the person with significant control are credible. Any edits you make here will be saved when you continue.
          </p>

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
                className="w-full px-4 py-3 border border-[#e0e0e0] rounded text-[0.875rem] focus:outline-none focus:border-[#101F36]"
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
                className="w-full px-4 py-3 border border-[#e0e0e0] rounded text-[0.875rem] focus:outline-none focus:border-[#101F36]"
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
                className="w-full px-4 py-3 border border-[#e0e0e0] rounded text-[0.875rem] focus:outline-none focus:border-[#101F36]"
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
                className="w-full px-4 py-3 border border-[#e0e0e0] rounded text-[0.875rem] focus:outline-none focus:border-[#101F36]"
              />
            </div>
          </div>

          {/* Verification Instructions */}
          <div className="bg-[#e3f2fd] border border-[#90caf9] rounded-lg p-4 mb-6">
            <p className="text-[0.75rem] font-medium text-[#212121] mb-2">Verification Steps</p>
            <ul className="text-[0.75rem] text-[#212121] space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-[#101F36]">•</span>
                <span>Search for the person online (Government registers, LinkedIn, company website, etc.)</span>
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
                <span>Click continue once you're confident these are the correct details to use</span>
              </li>
            </ul>
          </div>

          <div className="mb-6">
            <label className="text-[0.875rem] font-medium text-[#212121] block mb-2">
              Decision Evidence Notes
            </label>
            <p className="text-[0.75rem] text-[#616161] mb-3">
              Optionally record the evidence you reviewed and explain how you concluded that this person with significant control is valid. Include the sources checked, what matched public records, and any judgement you applied.
            </p>
            <textarea
              value={decisionNotes}
              onChange={(e) => setDecisionNotes(e.target.value)}
              placeholder="Optional notes about the evidence used to validate this PSC..."
              className="w-full px-4 py-3 border border-[#e0e0e0] rounded text-[0.875rem] min-h-[120px] resize-y focus:outline-none focus:border-[#101F36]"
            />
          </div>

          <div className="mb-6">
            <label className="text-[0.875rem] font-medium text-[#212121] block mb-2">
              Supporting Evidence Files
            </label>
            <p className="text-[0.75rem] text-[#616161] mb-3">
              Optionally upload one or more supporting files, such as screenshots, extracts, or saved evidence from the sources you checked.
            </p>
            <input
              type="file"
              multiple
              onChange={(e) => setSupportingFiles(Array.from(e.target.files || []))}
              className="block w-full text-[0.875rem] text-[#212121] file:mr-4 file:rounded file:border-0 file:bg-[#e3f2fd] file:px-4 file:py-2 file:text-[0.875rem] file:font-medium file:text-[#101F36] hover:file:bg-[#d2e9fc]"
            />
            {supportingFiles.length > 0 && (
              <div className="mt-3 rounded border border-[#e0e0e0] bg-[#fafafa] p-3">
                <p className="text-[0.75rem] font-medium text-[#212121] mb-2">
                  Selected files ({supportingFiles.length})
                </p>
                <ul className="space-y-1">
                  {supportingFiles.map((file, index) => (
                    <li key={`${file.name}-${index}`} className="text-[0.75rem] text-[#616161]">
                      {file.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-[#e0e0e0] flex gap-3 justify-end">
            {!flagged && (
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
              disabled={!contacts.name || !contacts.role || !contacts.phone || !contacts.email || (flagged && !flagComment.trim())}
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
