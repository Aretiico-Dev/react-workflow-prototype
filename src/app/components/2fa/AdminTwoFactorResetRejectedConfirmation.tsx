export function AdminTwoFactorResetRejectedConfirmation({ reason }: { reason: string }) {
  return (
    <div className="max-w-lg mx-auto bg-white rounded shadow p-8 mt-8 text-center">
      <h2 className="text-xl font-semibold mb-4">2FA Reset Rejected</h2>
      <p>The request has been rejected. Reason provided:</p>
      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded text-red-700 text-left inline-block max-w-md mx-auto">
        {reason}
      </div>
    </div>
  );
}
