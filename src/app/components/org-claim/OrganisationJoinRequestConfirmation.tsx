interface OrganisationJoinRequestConfirmationProps {
  decision: 'accepted' | 'rejected';
}

export function OrganisationJoinRequestConfirmation({ decision }: OrganisationJoinRequestConfirmationProps) {
  return (
    <div className="max-w-lg mx-auto bg-white rounded shadow p-8 mt-8 text-center">
      <h2 className="text-xl font-semibold mb-4">Decision Sent</h2>
      {decision === 'accepted' ? (
        <p>The applicant has been informed that they have been accepted to join your organisation.</p>
      ) : (
        <p>The applicant has been informed of your decision and will see your reason for rejection.</p>
      )}
    </div>
  );
}
