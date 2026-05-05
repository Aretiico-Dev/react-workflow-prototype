import { useMemo, useState } from 'react';
import { AlertCircle, Building2, UserRound } from 'lucide-react';
import { CancelOrderDialog } from '../v2/CancelOrderDialog';
import {
  adobeOrganizations,
  adobeOrganizationUsers,
  organizationStatusConfig,
  userStatusConfig,
} from './adobeSigningData';

interface AdobeCertificateOrderStepProps {
  onNext: (organizationId: string, userId?: string) => void;
  onCancel?: () => void;
}

export function AdobeCertificateOrderStep({ onNext, onCancel }: AdobeCertificateOrderStepProps) {
  const defaultOrganization = adobeOrganizations.find((org) => org.status === 'validated');
  const [selectedOrganization, setSelectedOrganization] = useState(defaultOrganization?.id || '');
  const [selectedUser, setSelectedUser] = useState('');
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const organization = adobeOrganizations.find((org) => org.id === selectedOrganization);
  const organizationUsers = useMemo(
    () => adobeOrganizationUsers.filter((user) => user.organizationId === selectedOrganization),
    [selectedOrganization]
  );
  const selectedUserDetails = organizationUsers.find((user) => user.id === selectedUser);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOrganization && organization?.status === 'validated') {
      onNext(selectedOrganization, selectedUser || undefined);
    }
  };

  const handleOrganizationChange = (organizationId: string) => {
    setSelectedOrganization(organizationId);
    setSelectedUser('');
  };

  const handleCancelOrder = () => {
    setCancelDialogOpen(false);
    onCancel?.();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[1.25rem] font-semibold text-[#212121] mb-2">Purchase Adobe Document Signing Certificate</h3>
        <p className="text-[0.875rem] text-[#616161]">
          Select a validated organisation and optionally attest a validated user.
        </p>
      </div>

      <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)]">
        <div className="border-b border-[#e0e0e0] px-6 py-4">
          <h4 className="text-[1.125rem] font-semibold text-[#212121]">Certificate Subject</h4>
          <p className="text-[0.875rem] text-[#616161] mt-1">Adobe document signing certificates must include a validated organisation.</p>
        </div>

        <div className="px-6 py-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[#101F36]">
                <Building2 className="w-4 h-4" />
                <label htmlFor="adobe-organization" className="block text-[0.875rem] font-medium text-[#212121]">
                  Select Organisation
                </label>
              </div>

              <select
                id="adobe-organization"
                value={selectedOrganization}
                onChange={(e) => handleOrganizationChange(e.target.value)}
                className="w-full px-4 py-2.5 border border-[#787878] rounded-lg bg-white text-[0.875rem] text-[#212121] focus:outline-none focus:border-[#101F36] focus:ring-1 focus:ring-[#101F36]"
                required
              >
                <option value="" disabled>Select a validated organisation</option>
                {adobeOrganizations.map((org) => {
                  const config = organizationStatusConfig[org.status];

                  return (
                    <option key={org.id} value={org.id} disabled={org.status !== 'validated'}>
                      {org.name} - {config.label}{org.status !== 'validated' ? ` (${config.reason})` : ''}
                    </option>
                  );
                })}
              </select>

              {organization && (
                <div className="p-3 border border-[#e0e0e0] rounded bg-[#fafafa]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[0.875rem] font-medium text-[#212121]">{organization.name}</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.625rem] font-semibold border ${organizationStatusConfig[organization.status].color}`}>
                      {organizationStatusConfig[organization.status].label}
                    </span>
                  </div>
                  <p className={`text-[0.75rem] mt-1 ${organization.status === 'validated' ? 'text-[#616161]' : 'text-[#f44336]'}`}>
                    {organization.validatedUntil && organization.status === 'validated'
                      ? `Valid until ${new Date(organization.validatedUntil).toLocaleDateString()}`
                      : organizationStatusConfig[organization.status].reason}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[#101F36]">
                <UserRound className="w-4 h-4" />
                <label htmlFor="adobe-user" className="block text-[0.875rem] font-medium text-[#212121]">
                  Individual Attestation
                </label>
              </div>

              <div className="flex items-start gap-2 p-3 bg-[#e3f2fd] border border-[#90caf9] rounded">
                <AlertCircle className="w-4 h-4 text-[#101F36] mt-0.5 flex-shrink-0" />
                <p className="text-[0.75rem] text-[#212121]">
                  Leave this unselected for an OV certificate, or select a validated user for an OVIV certificate.
                </p>
              </div>

              <select
                id="adobe-user"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full px-4 py-2.5 border border-[#787878] rounded-lg bg-white text-[0.875rem] text-[#212121] focus:outline-none focus:border-[#101F36] focus:ring-1 focus:ring-[#101F36]"
                disabled={!selectedOrganization || organization?.status !== 'validated'}
              >
                <option value="">No individual attestation - issue OV certificate</option>
                {organizationUsers.map((user) => {
                  const config = userStatusConfig[user.status];

                  return (
                    <option key={user.id} value={user.id} disabled={user.status !== 'validated'}>
                      {user.name} - {user.email} - {config.label}{user.status !== 'validated' ? ` (${config.reason})` : ''}
                    </option>
                  );
                })}
              </select>

              {selectedUserDetails ? (
                <div className="p-3 border border-[#e0e0e0] rounded bg-[#fafafa]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[0.875rem] font-medium text-[#212121]">{selectedUserDetails.name}</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.625rem] font-semibold border ${userStatusConfig[selectedUserDetails.status].color}`}>
                      {userStatusConfig[selectedUserDetails.status].label}
                    </span>
                  </div>
                  <p className="text-[0.75rem] text-[#616161] mt-1">{selectedUserDetails.email} · {selectedUserDetails.role}</p>
                  <p className="text-[0.75rem] text-[#616161] mt-1">
                    {selectedUserDetails.validatedUntil && selectedUserDetails.status === 'validated'
                      ? `Valid until ${new Date(selectedUserDetails.validatedUntil).toLocaleDateString()}`
                      : userStatusConfig[selectedUserDetails.status].reason}
                  </p>
                </div>
              ) : (
                <div className="p-3 border border-[#e0e0e0] rounded bg-[#fafafa]">
                  <p className="text-[0.875rem] font-medium text-[#212121]">No individual attestation</p>
                  <p className="text-[0.75rem] text-[#616161] mt-1">
                    This order will issue an OV certificate with organisation details only.
                  </p>
                </div>
              )}
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
                disabled={!selectedOrganization || organization?.status !== 'validated'}
                className="flex-1 px-6 py-3 bg-[#101F36] text-white rounded hover:bg-[#1565c0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                SUBMIT FOR APPROVAL
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
