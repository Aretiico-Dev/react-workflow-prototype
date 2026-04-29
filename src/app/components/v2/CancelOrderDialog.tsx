import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { AlertCircle } from 'lucide-react';

interface CancelOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason?: string) => void;
}

export function CancelOrderDialog({ open, onOpenChange, onConfirm }: CancelOrderDialogProps) {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    onConfirm(reason || undefined);
    setReason('');
  };

  const handleCancel = () => {
    onOpenChange(false);
    setReason('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[1.125rem] font-semibold text-[#212121]">
            <AlertCircle className="w-5 h-5 text-[#ffc107]" />
            Cancel Certificate Order
          </DialogTitle>
          <DialogDescription className="text-[0.875rem] text-[#616161]">
            Are you sure you want to cancel this certificate order? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">

          <div className="space-y-2">
            <label htmlFor="cancel-reason" className="block text-[0.875rem] font-medium text-[#212121]">
              Reason for cancellation (optional)
            </label>
            <textarea
              id="cancel-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for cancelling this order..."
              rows={4}
              className="w-full px-4 py-2.5 border border-[#787878] rounded-lg focus:outline-none focus:border-[#101F36] focus:ring-1 focus:ring-[#101F36] resize-none"
            />
            <p className="text-[0.75rem] text-[#616161]">
              This information will be recorded in the order history
            </p>
          </div>
        </div>

        <DialogFooter>
          <button
            onClick={handleCancel}
            className="px-6 py-2.5 border border-[#e0e0e0] rounded hover:bg-[#fafafa] transition-colors text-[0.875rem] font-medium"
          >
            KEEP ORDER
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2.5 bg-[#f44336] text-white rounded hover:bg-[#d32f2f] transition-colors text-[0.875rem] font-medium"
          >
            CANCEL ORDER
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
