import React from 'react';

interface ClaimedOrgOptionsStepProps {
  organisationName: string;
  onRequestJoin: () => void;
  onDisputeOwnership: () => void;
}

export function ClaimedOrgOptionsStep({ organisationName, onRequestJoin, onDisputeOwnership }: ClaimedOrgOptionsStepProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)] p-8">
        <h4 className="text-[1.125rem] font-semibold text-[#212121] mb-2">
          {organisationName} is already managed
        </h4>
        <p className="text-[0.875rem] text-[#616161] mb-6">
          This organisation is already claimed and actively managed. You can:
        </p>
        <div className="flex flex-col gap-4">
          <button
            onClick={onRequestJoin}
            className="px-6 py-3 bg-[#101F36] text-white rounded hover:bg-[#1565c0] transition-colors text-[0.875rem] font-medium"
          >
            Request to Join {organisationName}
          </button>
          <button
            onClick={onDisputeOwnership}
            className="px-6 py-3 bg-white border border-[#101F36] text-[#101F36] rounded hover:bg-[#e3f2fd] transition-colors text-[0.875rem] font-medium"
          >
            Dispute Organisation Ownership
          </button>
        </div>
      </div>
    </div>
  );
}
