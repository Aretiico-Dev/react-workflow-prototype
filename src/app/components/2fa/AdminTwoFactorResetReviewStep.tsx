import { useState } from 'react';

interface User {
  id: string;
  name: string;
  aretiicoId: string;
}

interface AdminTwoFactorResetReviewStepProps {
  request: {
    aretiicoId: string;
    legalName: string;
    email: string;
    idFileName: string;
  };
  users: User[];
  onSendForApproval: (userId: string) => void;
  onReject: (reason: string) => void;
}

export function AdminTwoFactorResetReviewStep({ request, users, onSendForApproval, onReject }: AdminTwoFactorResetReviewStepProps) {
  const [selectedUser, setSelectedUser] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  return (
    <div className="max-w-xl mx-auto bg-white rounded shadow p-8 mt-8">
      <h2 className="text-xl font-semibold mb-4">2FA Reset Request Review</h2>
      <div className="mb-6">
        <div className="mb-2"><strong>Aretiico ID:</strong> {request.aretiicoId}</div>
        <div className="mb-2"><strong>Full Legal Name:</strong> {request.legalName}</div>
        <div className="mb-2"><strong>Email:</strong> {request.email}</div>
        <div className="mb-2"><strong>ID File:</strong> {request.idFileName}</div>
      </div>
      <div className="mb-6">
        <label className="block font-medium mb-1">Link to User in System</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={selectedUser}
          onChange={e => setSelectedUser(e.target.value)}
        >
          <option value="">Select user...</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.name} ({user.aretiicoId})</option>
          ))}
        </select>
      </div>
      <div className="flex gap-4 mt-6">
        <button
          className="flex-1 rounded bg-[#101F36] text-white py-3 font-medium disabled:opacity-50"
          disabled={!selectedUser}
          onClick={() => selectedUser && onSendForApproval(selectedUser)}
        >
          Send for Approval
        </button>
        <button
          className="flex-1 rounded bg-red-600 text-white py-3 font-medium"
          onClick={() => setShowRejectModal(true)}
        >
          Reject
        </button>
      </div>
      {showRejectModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white rounded shadow p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-2">Reject Request</h3>
            <label className="block mb-2">Reason for rejection (required):</label>
            <textarea
              className="w-full border rounded px-3 py-2 mb-4"
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              required
            />
            <div className="flex gap-2 justify-end">
              <button
                className="rounded px-4 py-2 bg-gray-200"
                onClick={() => setShowRejectModal(false)}
              >
                Cancel
              </button>
              <button
                className="rounded px-4 py-2 bg-red-600 text-white disabled:opacity-50"
                disabled={!rejectReason.trim()}
                onClick={() => {
                  if (rejectReason.trim()) {
                    onReject(rejectReason);
                    setShowRejectModal(false);
                  }
                }}
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
