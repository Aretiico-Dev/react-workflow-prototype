interface TwoFactorResetRequestConfirmationProps {
  onStartAnotherRequest?: () => void;
}

export function TwoFactorResetRequestConfirmation({ onStartAnotherRequest }: TwoFactorResetRequestConfirmationProps) {
  return (
    <div className="max-w-lg mx-auto bg-white rounded shadow p-8 mt-8 text-center">
      <h2 className="text-xl font-semibold mb-4">Request Received</h2>
      <p>Your request has been received and will be processed within 48 hours. You will receive an email confirmation of the result.</p>
      {onStartAnotherRequest && (
        <button
          type="button"
          className="mt-6 rounded border border-[#e0e0e0] bg-white px-4 py-2 text-[0.875rem] font-medium text-[#212121] hover:border-[#90caf9]"
          onClick={onStartAnotherRequest}
        >
          Start another preview
        </button>
      )}
    </div>
  );
}
