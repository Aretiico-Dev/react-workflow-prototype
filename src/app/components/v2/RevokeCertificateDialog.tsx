import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { AlertCircle } from 'lucide-react';

interface RevokeCertificateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (revocationReason: string, additionalDetails?: string) => void;
}

const revocationReasons = [
  { value: 'unspecified', label: 'Unspecified' },
  { value: 'keyCompromise', label: 'Key Compromise' },
  { value: 'affiliationChanged', label: 'Affiliation Changed' },
  { value: 'superseded', label: 'Superseded' },
  { value: 'cessationOfOperation', label: 'Cessation of Operation' },
  { value: 'privilegeWithdrawn', label: 'Privilege Withdrawn' },
];

export function RevokeCertificateDialog({ open, onOpenChange, onConfirm }: RevokeCertificateDialogProps) {
  const [revocationReason, setRevocationReason] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleConfirm = () => {
    if (revocationReason && termsAccepted) {
      onConfirm(revocationReason, additionalDetails || undefined);
      setRevocationReason('');
      setAdditionalDetails('');
      setTermsAccepted(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setRevocationReason('');
    setAdditionalDetails('');
    setTermsAccepted(false);
  };

  const canConfirm = revocationReason && termsAccepted;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[1.125rem] font-semibold text-[#212121]">
            <AlertCircle className="w-5 h-5 text-[#f44336]" />
            Revoke Certificate
          </DialogTitle>
          <DialogDescription className="sr-only">
            Permanently revoke this certificate. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-start gap-3 p-4 bg-[#f9d8d8] border border-[#f44336] rounded">
            <AlertCircle className="h-5 w-5 text-[#f44336] flex-shrink-0 mt-0.5" />
            <div className="text-[0.875rem] text-[#212121]">
              <strong>Warning:</strong> Revoking this certificate will immediately invalidate it.
              This action is permanent and cannot be undone.
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="revocation-reason" className="block text-[0.875rem] font-medium text-[#212121]">
              Revocation Reason <span className="text-[#f44336]">*</span>
            </label>
            <select
              id="revocation-reason"
              value={revocationReason}
              onChange={(e) => setRevocationReason(e.target.value)}
              className="w-full px-4 py-2.5 border border-[#787878] rounded-lg focus:outline-none focus:border-[#101F36] focus:ring-1 focus:ring-[#101F36]"
              required
            >
              <option value="">Select a reason...</option>
              {revocationReasons.map((reason) => (
                <option key={reason.value} value={reason.value}>
                  {reason.label}
                </option>
              ))}
            </select>
            <p className="text-[0.75rem] text-[#616161]">
              This reason will be published in the certificate revocation list
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="additional-details" className="block text-[0.875rem] font-medium text-[#212121]">
              Additional Details (optional)
            </label>
            <textarea
              id="additional-details"
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              placeholder="Provide any additional context for this revocation..."
              rows={4}
              className="w-full px-4 py-2.5 border border-[#787878] rounded-lg focus:outline-none focus:border-[#101F36] focus:ring-1 focus:ring-[#101F36] resize-none"
            />
            <p className="text-[0.75rem] text-[#616161]">
              These details are for internal record keeping only
            </p>
          </div>

          <div className="border-t border-[#e0e0e0] pt-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 accent-[#101F36]"
              />
              <span className="text-[0.875rem] text-[#212121]">
                I understand that revoking this certificate will immediately invalidate it and this action
                cannot be reversed. I accept full responsibility for the consequences of this revocation.
              </span>
            </label>
          </div>
        </div>

        <DialogFooter>
          <button
            onClick={handleCancel}
            className="px-6 py-2.5 border border-[#e0e0e0] rounded hover:bg-[#fafafa] transition-colors text-[0.875rem] font-medium"
          >
            CANCEL
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canConfirm}
            className="px-6 py-2.5 bg-[#f44336] text-white rounded hover:bg-[#d32f2f] transition-colors text-[0.875rem] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            REVOKE CERTIFICATE
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
