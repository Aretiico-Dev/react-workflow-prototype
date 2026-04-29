import { useState } from 'react';
import { Building2, User } from 'lucide-react';

interface Organisation {
  id: string;
  name: string;
  type: string;
  registrationNumber: string;
  source: string;
}

interface OrganisationDetailsStepProps {
  organisation: Organisation;
  claimantName: string;
  onRequestJoinInstead?: () => void;
  onNext: (details: {
    role: string;
    website: string;
    telephone: string;
    email: string;
    isPSC: boolean;
    pscName?: string;
    pscRole?: string;
  }) => void;
}

export function OrganisationDetailsStep({
  organisation,
  claimantName,
  onRequestJoinInstead,
  onNext,
}: OrganisationDetailsStepProps) {
  const [role, setRole] = useState('');
  const [website, setWebsite] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [isPSC, setIsPSC] = useState(false);
  const [pscName, setPscName] = useState('');
  const [pscRole, setPscRole] = useState('');

  const isValid = role.trim() && website.trim() && telephone.trim() && email.trim() &&
    (isPSC || (pscName.trim() && pscRole.trim()));

  const handleSubmit = () => {
    if (!isValid) return;

    onNext({
      role,
      website,
      telephone,
      email,
      isPSC,
      pscName: isPSC ? undefined : pscName,
      pscRole: isPSC ? undefined : pscRole,
    });
  };

  return (
    <div className="space-y-6">
      {/* Application Context */}
      <div className="bg-[#e3f2fd] border border-[#90caf9] rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Building2 className="w-5 h-5 text-[#101F36] flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className="text-[0.875rem] text-[#212121]">
              You, <strong>{claimantName}</strong>, are applying to become the official representative of{' '}
              <strong>{organisation.name}</strong>
            </p>
            {onRequestJoinInstead && (
              <button
                type="button"
                onClick={onRequestJoinInstead}
                className="text-[0.75rem] font-medium text-[#101F36] underline underline-offset-2 hover:text-[#1565c0] transition-colors"
              >
                Request to join instead
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)] p-8">
        <div className="max-w-2xl mx-auto">
          <h4 className="text-[1.125rem] font-semibold text-[#212121] mb-2">
            Organisation Details
          </h4>
          <p className="text-[0.875rem] text-[#616161] mb-6">
            Provide details about your role and how we can contact the organisation
          </p>

          {/* Your Details */}
          <div className="mb-6">
            <h5 className="text-[1rem] font-semibold text-[#212121] mb-4">Your Details</h5>
            <div className="space-y-4">
              <div>
                <label className="text-[0.875rem] font-medium text-[#212121] block mb-2">
                  Your Role at {organisation.name} *
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Director, CEO, Company Secretary"
                  className="w-full px-4 py-3 border border-[#e0e0e0] rounded text-[0.875rem] focus:outline-none focus:border-[#101F36]"
                />
              </div>
            </div>
          </div>

          {/* Organisation Contact Details */}
          <div className="mb-6">
            <h5 className="text-[1rem] font-semibold text-[#212121] mb-4">Organisation Contact Details</h5>
            <div className="space-y-4">
              <div>
                <label className="text-[0.875rem] font-medium text-[#212121] block mb-2">
                  Organisation Website *
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://www.example.com"
                  className="w-full px-4 py-3 border border-[#e0e0e0] rounded text-[0.875rem] focus:outline-none focus:border-[#101F36]"
                />
              </div>

              <div>
                <label className="text-[0.875rem] font-medium text-[#212121] block mb-2">
                  Organisation Telephone Number *
                </label>
                <input
                  type="tel"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  placeholder="+44 20 1234 5678"
                  className="w-full px-4 py-3 border border-[#e0e0e0] rounded text-[0.875rem] focus:outline-none focus:border-[#101F36]"
                />
              </div>

              <div>
                <label className="text-[0.875rem] font-medium text-[#212121] block mb-2">
                  Organisation Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@example.com"
                  className="w-full px-4 py-3 border border-[#e0e0e0] rounded text-[0.875rem] focus:outline-none focus:border-[#101F36]"
                />
              </div>
            </div>
          </div>

          {/* Person with Significant Control */}
          <div className="mb-6">
            <h5 className="text-[1rem] font-semibold text-[#212121] mb-4">Person with Significant Control</h5>
            <p className="text-[0.75rem] text-[#616161] mb-4">
              We need to speak with a person with significant control to verify this application.
              If possible, please provide details for someone other than yourself.
            </p>

            <div className="mb-4">
              <label className="flex items-start gap-3 cursor-pointer p-3 border border-[#e0e0e0] rounded hover:bg-[#fafafa] transition-colors">
                <input
                  type="checkbox"
                  checked={isPSC}
                  onChange={(e) => setIsPSC(e.target.checked)}
                  className="mt-0.5 w-4 h-4"
                />
                <span className="text-[0.875rem] text-[#212121]">
                  I am a person with significant control
                </span>
              </label>
            </div>

            <div className={`space-y-4 ${isPSC ? 'opacity-50 pointer-events-none' : ''}`}>
              <div>
                <label className="text-[0.875rem] font-medium text-[#212121] block mb-2">
                  Name of Person with Significant Control {!isPSC && '*'}
                </label>
                <input
                  type="text"
                  value={pscName}
                  onChange={(e) => setPscName(e.target.value)}
                  disabled={isPSC}
                  placeholder="Full name"
                  className="w-full px-4 py-3 border border-[#e0e0e0] rounded text-[0.875rem] focus:outline-none focus:border-[#101F36] disabled:bg-[#fafafa]"
                />
              </div>

              <div>
                <label className="text-[0.875rem] font-medium text-[#212121] block mb-2">
                  Their Role {!isPSC && '*'}
                </label>
                <input
                  type="text"
                  value={pscRole}
                  onChange={(e) => setPscRole(e.target.value)}
                  disabled={isPSC}
                  placeholder="e.g. Director, Shareholder"
                  className="w-full px-4 py-3 border border-[#e0e0e0] rounded text-[0.875rem] focus:outline-none focus:border-[#101F36] disabled:bg-[#fafafa]"
                />
              </div>
            </div>
          </div>

          {/* Action */}
          <div className="pt-6 border-t border-[#e0e0e0] flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={!isValid}
              className="px-6 py-3 bg-[#101F36] text-white rounded hover:bg-[#1565c0] transition-colors text-[0.875rem] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              SUBMIT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
