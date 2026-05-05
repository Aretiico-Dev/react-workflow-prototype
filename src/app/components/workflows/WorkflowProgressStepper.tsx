export interface WorkflowProgressStep {
  id: string;
  label: string;
  onClick?: () => void;
}

interface WorkflowProgressStepperProps {
  steps: WorkflowProgressStep[];
  currentStepId: string;
  className?: string;
}

export function WorkflowProgressStepper({ steps, currentStepId, className = '' }: WorkflowProgressStepperProps) {
  const currentStepIndex = Math.max(steps.findIndex((step) => step.id === currentStepId), 0);

  return (
    <div className={`bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)] p-6 ${className}`}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isComplete = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const StepContent = (
            <>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[0.75rem] font-semibold transition-colors ${
                isComplete ? 'bg-[#00c853] text-white' :
                isCurrent ? 'bg-[#101F36] text-white' :
                'bg-[#e0e0e0] text-[#616161]'
              }`}>
                {index + 1}
              </div>
              <span className={`text-[0.875rem] hidden sm:inline ${
                isCurrent ? 'font-medium text-[#212121]' : 'text-[#616161]'
              }`}>
                {step.label}
              </span>
            </>
          );

          return (
            <div key={step.id} className="flex items-center flex-1">
              {step.onClick ? (
                <button
                  type="button"
                  onClick={step.onClick}
                  className="flex items-center gap-2 text-left"
                >
                  {StepContent}
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  {StepContent}
                </div>
              )}
              {index < steps.length - 1 && (
                <div className={`h-0.5 flex-1 mx-2 transition-colors ${
                  isComplete ? 'bg-[#00c853]' : 'bg-[#e0e0e0]'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
