import { useState } from 'react';
import { Building2, Mail } from 'lucide-react';
import { CancelOrderDialog } from '../v2/CancelOrderDialog';

export type SmimeCertificateType = 'personal' | 'ov';

interface SmimeEmailInputStepProps {
  onNext: (emailAddress: string, certificateType: SmimeCertificateType, organizationId?: string, ownerId?: string) => void;
  onCancel?: () => void;
  hasValidatedOrganization: boolean;
}

type OrganizationStatus = 'validated' | 'expired' | 'suspended' | 'not-validated';

interface Organization {
  id: string;
  name: string;
  status: OrganizationStatus;
  validatedUntil?: string;
}

interface CertificateOwner {
  id: string;
  name: string;
  type: 'user' | 'organization';
  status: 'active' | OrganizationStatus;
  validatedUntil?: string;
}

export const smimeOrganizations: Organization[] = [
  {
    id: 'org-1',
    name: 'Global Trading Corp',
    status: 'expired',
    validatedUntil: '2025-12-15',
  },
  {
    id: 'org-2',
    name: 'Suspended Industries Ltd',
    status: 'suspended',
  },
  {
    id: 'org-3',
    name: 'Acme Corporation',
    status: 'validated',
    validatedUntil: '2027-03-20',
  },
  {
    id: 'org-4',
    name: 'NewTech Ventures Inc',
    status: 'not-validated',
  },
];

const certificateOwners: CertificateOwner[] = [
  {
    id: 'user-jim-taylor',
    name: 'Jim Taylor',
    type: 'user',
    status: 'active',
  },
  ...smimeOrganizations.map((org) => ({
    id: org.id,
    name: org.name,
    type: 'organization' as const,
    status: org.status,
    validatedUntil: org.validatedUntil,
  })),
];

const statusConfig = {
  validated: {
    label: 'Validated',
    color: 'bg-[#b9f6ca] text-[#00c853] border-[#00c853]',
    reason: 'Eligible for certificate ownership and OV attestation',
  },
  expired: {
    label: 'Expired',
    color: 'bg-[#f9d8d8] text-[#f44336] border-[#f44336]',
    reason: 'Organisation validation has expired',
  },
  suspended: {
    label: 'Suspended',
    color: 'bg-[#fff8e1] text-[#ffc107] border-[#ffc107]',
    reason: 'Organisation access is suspended',
  },
  'not-validated': {
    label: 'Not Validated',
    color: 'bg-[#e0e0e0] text-[#616161] border-[#787878]',
    reason: 'Organisation has not completed validation',
  },
};

const ownerStatusConfig = {
  active: {
    label: 'User',
    color: 'bg-[#e3f2fd] text-[#101F36] border-[#90caf9]',
    reason: 'Personal account',
  },
  ...statusConfig,
};

export function SmimeEmailInputStep({ onNext, onCancel, hasValidatedOrganization }: SmimeEmailInputStepProps) {
  const [emailAddress, setEmailAddress] = useState('');
  const [certificateType, setCertificateType] = useState<SmimeCertificateType>('personal');
  const [selectedOwner, setSelectedOwner] = useState('user-jim-taylor');
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const selectedOwnerDetails = certificateOwners.find(owner => owner.id === selectedOwner);
  const canOrderOv = selectedOwnerDetails?.type === 'organization' && selectedOwnerDetails.status === 'validated' && hasValidatedOrganization;
  const hasEmailAddress = emailAddress.trim() !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasEmailAddress && (certificateType === 'personal' || canOrderOv)) {
      onNext(emailAddress.trim(), certificateType, certificateType === 'ov' ? selectedOwner : undefined, selectedOwner);
    }
  };

  const handleCancelOrder = () => {
    setCancelDialogOpen(false);
    onCancel?.();
  };

  const handleOwnerChange = (ownerId: string) => {
    const owner = certificateOwners.find(item => item.id === ownerId);
    setSelectedOwner(ownerId);
    if (!(owner?.type === 'organization' && owner.status === 'validated')) {
      setCertificateType('personal');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[1.25rem] font-semibold text-[#212121] mb-2">Purchase S/MIME Certificate</h3>
        <p className="text-[0.875rem] text-[#616161]">
          Secure email signing and encryption for a verified mailbox
        </p>
      </div>

      <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)]">
        <div className="border-b border-[#e0e0e0] px-6 py-4">
          <h4 className="text-[1.125rem] font-semibold text-[#212121]">Email Address</h4>
          <p className="text-[0.875rem] text-[#616161] mt-1">Enter the email address you want to verify</p>
        </div>

        <div className="px-6 py-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[#101F36]">
                <Building2 className="w-4 h-4" />
                <label htmlFor="smime-certificate-owner" className="block text-[0.875rem] font-medium text-[#212121]">
                  Certificate Owner
                </label>
              </div>

              <select
                id="smime-certificate-owner"
                value={selectedOwner}
                onChange={(e) => handleOwnerChange(e.target.value)}
                className="w-full px-4 py-2.5 border border-[#787878] rounded-lg bg-white text-[0.875rem] text-[#212121] focus:outline-none focus:border-[#101F36] focus:ring-1 focus:ring-[#101F36]"
              >
                {certificateOwners.map((owner) => {
                  const config = ownerStatusConfig[owner.status];
                  const disabled = owner.type === 'organization' && owner.status !== 'validated';

                  return (
                    <option key={owner.id} value={owner.id} disabled={disabled}>
                      {owner.name} - {owner.type === 'user' ? 'Individual' : config.label}{disabled ? ` (${config.reason})` : ''}
                    </option>
                  );
                })}
              </select>

              {selectedOwnerDetails && (
                <div className="p-3 border border-[#e0e0e0] rounded bg-[#fafafa]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[0.875rem] font-medium text-[#212121]">{selectedOwnerDetails.name}</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.625rem] font-semibold border ${ownerStatusConfig[selectedOwnerDetails.status].color}`}>
                      {selectedOwnerDetails.type === 'user' ? 'Individual' : ownerStatusConfig[selectedOwnerDetails.status].label}
                    </span>
                  </div>
                  <p className="text-[0.75rem] text-[#616161] mt-1">
                    {selectedOwnerDetails.type === 'user'
                      ? 'This certificate will be owned by and charged to Jim Taylor.'
                      : `This certificate will be owned by and charged to ${selectedOwnerDetails.name}.`}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="smime-email" className="block text-[0.875rem] font-medium text-[#212121]">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#616161]" />
                <input
                  id="smime-email"
                  type="email"
                  placeholder="name@example.com"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-2.5 border border-[#787878] rounded-lg focus:outline-none focus:border-[#101F36] focus:ring-1 focus:ring-[#101F36]"
                />
              </div>
              <p className="text-[0.75rem] text-[#616161]">
                We will verify that you control this inbox before issuing the certificate.
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-[0.875rem] font-medium text-[#212121]">
                Certificate Type
              </label>

              <label className={`flex items-start gap-3 p-4 border rounded cursor-pointer transition-colors ${
                certificateType === 'personal' ? 'border-[#101F36] bg-[#e3f2fd]' : 'border-[#e0e0e0] hover:border-[#90caf9]'
              }`}>
                <input
                  type="radio"
                  name="smimeCertificateType"
                  value="personal"
                  checked={certificateType === 'personal'}
                  onChange={() => setCertificateType('personal')}
                  className="mt-1 accent-[#101F36]"
                />
                <div className="flex-1">
                  <div className="text-[0.875rem] font-medium text-[#212121]">Personal S/MIME</div>
                  <p className="text-[0.75rem] text-[#616161] mt-1">
                    Verifies control of the mailbox. Suitable for email signing and encryption.
                  </p>
                </div>
              </label>

              <label className={`flex items-start gap-3 p-4 border rounded cursor-pointer transition-colors ${
                certificateType === 'ov' ? 'border-[#101F36] bg-[#e3f2fd]' : 'border-[#e0e0e0] hover:border-[#90caf9]'
              } ${!canOrderOv ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <input
                  type="radio"
                  name="smimeCertificateType"
                  value="ov"
                  checked={certificateType === 'ov'}
                  onChange={() => setCertificateType('ov')}
                  disabled={!canOrderOv}
                  className="mt-1 accent-[#101F36]"
                />
                <div className="flex-1">
                  <div className="text-[0.875rem] font-medium text-[#212121]">Organization Validated S/MIME</div>
                  <p className="text-[0.75rem] text-[#616161] mt-1">
                    Includes validated organization details in the certificate subject.
                  </p>
                  {!canOrderOv && (
                    <p className="text-[0.75rem] text-[#ffc107] mt-2">
                      Select a validated organisation as the certificate owner to purchase OV certificates.
                    </p>
                  )}
                </div>
              </label>
            </div>

            <div className="flex gap-3">
              {onCancel && (
                <button
                  type="button"
                  onClick={() => setCancelDialogOpen(true)}
                  className="flex-1 px-6 py-3 border border-[#e0e0e0] rounded hover:bg-[#fafafa] transition-colors"
                >
                  CANCEL ORDER
                </button>
              )}
              <button
                type="submit"
                disabled={!hasEmailAddress || (certificateType === 'ov' && !canOrderOv)}
                className="flex-1 px-6 py-3 bg-[#101F36] text-white rounded hover:bg-[#1565c0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                CONTINUE TO CHECKS
              </button>
            </div>
          </form>
        </div>
      </div>

      <CancelOrderDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        onConfirm={handleCancelOrder}
      />
    </div>
  );
}
