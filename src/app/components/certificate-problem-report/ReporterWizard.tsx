import { ChangeEvent } from 'react';
import { AlertTriangle, CheckCircle2, FileImage, Info, Paperclip, ShieldCheck, X } from 'lucide-react';
import { WorkflowProgressStepper } from '../workflows/WorkflowProgressStepper';
import {
  authenticatedReporter,
  ProblemReportDraft,
  problemReportReasons,
  ReporterScenario,
} from './data';

interface ReporterWizardProps {
  draft: ProblemReportDraft;
  currentStep: number;
  onDraftChange: (draft: ProblemReportDraft) => void;
  onStepChange: (step: number) => void;
  onSubmit: () => void;
}

const steps = [
  { id: 'contact', label: 'Reporter' },
  { id: 'identify', label: 'Certificate' },
  { id: 'reason', label: 'Problem' },
  { id: 'summary', label: 'Submit' },
];

export function ReporterWizard({ draft, currentStep, onDraftChange, onStepChange, onSubmit }: ReporterWizardProps) {
  const canSubmit = Boolean(draft.reason && draft.reasonDetails.trim());

  function updateField<K extends keyof ProblemReportDraft>(key: K, value: ProblemReportDraft[K]) {
    onDraftChange({ ...draft, [key]: value });
  }

  function updateScenario(scenario: ReporterScenario) {
    onDraftChange({
      ...draft,
      reporterScenario: scenario,
      name: scenario === 'authenticated' ? authenticatedReporter.name : '',
      email: scenario === 'authenticated' || scenario === 'guest-email' ? authenticatedReporter.email : '',
      captchaComplete: scenario === 'authenticated',
    });
    onStepChange(0);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || [])
      .filter((file) => file.type.startsWith('image/'))
      .slice(0, Math.max(0, 3 - draft.files.length))
      .map((file) => ({
        name: file.name,
        type: file.type,
        sizeLabel: `${Math.max(1, Math.round(file.size / 1024))} KB`,
      }));

    if (files.length) {
      updateField('files', [...draft.files, ...files]);
    }
    event.target.value = '';
  }

  function removeFile(indexToRemove: number) {
    updateField('files', draft.files.filter((_, index) => index !== indexToRemove));
  }

  return (
    <div className="space-y-6">
      <div className="rounded border border-[#e0e0e0] bg-white p-4 shadow-[1px_0_20px_rgb(0_0_0_/_8%)]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-[1.5rem] font-semibold text-[#212121]">Report a certificate problem</h2>
            <p className="text-[0.875rem] text-[#616161]">Submit evidence for investigation by the certificate operations team.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              ['authenticated', 'Authenticated'],
              ['guest-email', 'Guest with email'],
              ['guest-no-email', 'Guest no email'],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => updateScenario(value as ReporterScenario)}
                className={`rounded border px-3 py-2 text-[0.75rem] font-medium ${
                  draft.reporterScenario === value
                    ? 'border-[#101F36] bg-[#101F36] text-white'
                    : 'border-[#e0e0e0] bg-white text-[#616161] hover:border-[#90caf9]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <WorkflowProgressStepper
        currentStepId={steps[currentStep].id}
        steps={steps.map((step, index) => ({
          ...step,
          onClick: () => onStepChange(index),
        }))}
      />

      <div className="rounded border border-[#e0e0e0] bg-white p-6 shadow-[1px_0_20px_rgb(0_0_0_/_8%)]">
        {currentStep === 0 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-[1.125rem] font-semibold text-[#212121]">Reporter details</h3>
              <p className="mt-1 text-[0.875rem] text-[#616161]">Contact details are optional for guests, but they help us follow up.</p>
            </div>

            {draft.reporterScenario === 'authenticated' ? (
              <div className="grid max-w-xl gap-4">
                <ReadOnlyField label="Name on account" value={authenticatedReporter.name} />
                <ReadOnlyField label="Email on account" value={authenticatedReporter.email} />
                <Field
                  label="Telephone number"
                  value={draft.telephone}
                  onChange={(value) => updateField('telephone', value)}
                  placeholder="Optional"
                />
              </div>
            ) : (
              <>
                <div className="rounded border-l-4 border-[#ffc107] bg-[#fff8e1] p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#c77800]" />
                    <p className="text-[0.875rem] text-[#212121]">
                      You can submit this report without contact details. At the end we will show you a private status URL, but if you lose it we will not be able to contact you or remind you where to check progress.
                    </p>
                  </div>
                </div>
                <div className="grid max-w-xl gap-4">
                  <Field label="Name" value={draft.name} onChange={(value) => updateField('name', value)} placeholder="Optional" />
                  <Field label="Email" value={draft.email} onChange={(value) => updateField('email', value)} placeholder="Optional" />
                  <Field label="Telephone" value={draft.telephone} onChange={(value) => updateField('telephone', value)} placeholder="Optional" />
                </div>
                <button
                  type="button"
                  onClick={() => updateField('captchaComplete', !draft.captchaComplete)}
                  className={`flex w-full items-center gap-3 rounded border p-4 text-left ${
                    draft.captchaComplete ? 'border-[#00c853] bg-[#f1fff4]' : 'border-[#e0e0e0] bg-[#fafafa]'
                  }`}
                >
                  <span className={`flex h-6 w-6 items-center justify-center rounded border ${
                    draft.captchaComplete ? 'border-[#00c853] bg-[#00c853]' : 'border-[#bdbdbd] bg-white'
                  }`}>
                    {draft.captchaComplete && <CheckCircle2 className="h-4 w-4 text-white" />}
                  </span>
                  <span>
                    <span className="block text-[0.875rem] font-medium text-[#212121]">Mock captcha completed</span>
                    <span className="block text-[0.75rem] text-[#616161]">Prototype only. No external captcha service is called.</span>
                  </span>
                </button>
              </>
            )}
          </div>
        )}

        {currentStep === 1 && (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-5">
              <div>
                <h3 className="text-[1.125rem] font-semibold text-[#212121]">Help us identify the certificate</h3>
                <p className="mt-1 text-[0.875rem] text-[#616161]">Provide whatever information you have. It does not need to be complete.</p>
              </div>
              <textarea
                value={draft.certificateDetails}
                onChange={(event) => updateField('certificateDetails', event.target.value)}
                className="min-h-[180px] w-full resize-none rounded border border-[#e0e0e0] px-3 py-3 text-[0.875rem] focus:border-[#101F36] focus:outline-none focus:ring-1 focus:ring-[#101F36]"
                placeholder="Domain names, serial numbers, email addresses, CSR text, certificate viewer details..."
              />
              <div>
                <label className={`flex items-center justify-center gap-2 rounded border border-dashed px-4 py-4 text-[0.875rem] font-medium ${
                  draft.files.length >= 3
                    ? 'cursor-not-allowed border-[#e0e0e0] bg-[#fafafa] text-[#9e9e9e]'
                    : 'cursor-pointer border-[#90caf9] bg-[#fafafa] text-[#101F36] hover:bg-[#e3f2fd]'
                }`}>
                  <Paperclip className="h-4 w-4" />
                  Upload image evidence ({draft.files.length}/3)
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    disabled={draft.files.length >= 3}
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                {draft.files.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {draft.files.map((file, index) => (
                      <div key={`${file.name}-${index}`} className="flex items-center justify-between rounded border border-[#e0e0e0] bg-[#fafafa] px-3 py-2">
                        <div className="flex min-w-0 items-center gap-2">
                          <FileImage className="h-4 w-4 shrink-0 text-[#616161]" />
                          <span className="truncate text-[0.875rem] font-medium text-[#212121]">{file.name}</span>
                          <span className="shrink-0 text-[0.75rem] text-[#616161]">{file.sizeLabel}</span>
                        </div>
                        <button type="button" onClick={() => removeFile(index)} className="rounded p-1 text-[#616161] hover:bg-white">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="rounded border border-[#90caf9] bg-[#e3f2fd] p-5">
              <div className="mb-3 flex items-start gap-3">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#101F36]" />
                <h4 className="text-[1rem] font-semibold text-[#212121]">Useful evidence</h4>
              </div>
              <ul className="space-y-2 text-[0.875rem] text-[#212121]">
                <li>Screenshots of warnings or certificate details.</li>
                <li>Domain names and URLs where you saw the certificate.</li>
                <li>Email addresses, certificate serial numbers, or CSRs.</li>
                <li>Any other context that helps identify the certificate.</li>
              </ul>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-[1.125rem] font-semibold text-[#212121]">Problem reason</h3>
              <p className="mt-1 text-[0.875rem] text-[#616161]">Select the closest reason and explain the issue in your own words.</p>
            </div>
            <div>
              <label className="mb-2 block text-[0.75rem] font-medium uppercase tracking-wide text-[#616161]">Reason for report</label>
              <select
                value={draft.reason}
                onChange={(event) => updateField('reason', event.target.value)}
                className="w-full rounded border border-[#e0e0e0] bg-white px-3 py-3 text-[0.875rem] text-[#212121] focus:border-[#101F36] focus:outline-none focus:ring-1 focus:ring-[#101F36]"
              >
                {problemReportReasons.map((reason) => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-[0.75rem] font-medium uppercase tracking-wide text-[#616161]">More information</label>
              <textarea
                value={draft.reasonDetails}
                onChange={(event) => updateField('reasonDetails', event.target.value)}
                className="min-h-[180px] w-full resize-none rounded border border-[#e0e0e0] px-3 py-3 text-[0.875rem] focus:border-[#101F36] focus:outline-none focus:ring-1 focus:ring-[#101F36]"
                placeholder="Explain what is wrong and why you selected this reason."
              />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-[1.125rem] font-semibold text-[#212121]">Submit report</h3>
              <p className="mt-1 text-[0.875rem] text-[#616161]">Check the summary before creating the status page.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <SummaryCard label="Reporter" value={reporterSummary(draft)} />
              <SummaryCard label="Reason" value={draft.reason || 'Not selected'} />
              <SummaryCard label="Certificate details" value={draft.certificateDetails || 'No details provided'} />
              <SummaryCard label="Problem explanation" value={draft.reasonDetails || 'No explanation provided'} />
            </div>
            <div className="rounded border border-[#e0e0e0] bg-[#fafafa] p-4">
              <p className="mb-2 text-[0.75rem] font-medium uppercase tracking-wide text-[#616161]">Uploaded image files</p>
              {draft.files.length ? (
                <div className="flex flex-wrap gap-2">
                  {draft.files.map((file, index) => (
                    <span key={`${file.name}-${index}`} className="rounded border border-[#e0e0e0] bg-white px-3 py-1 text-[0.75rem] text-[#212121]">
                      {file.name} ({file.sizeLabel})
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[0.875rem] text-[#616161]">No images uploaded.</p>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 border-t border-[#e0e0e0] pt-5 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={() => onStepChange(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="rounded border border-[#e0e0e0] px-5 py-3 text-[0.875rem] font-medium text-[#212121] disabled:opacity-50"
          >
            Back
          </button>
          {currentStep < 3 ? (
            <button
              type="button"
              onClick={() => onStepChange(Math.min(3, currentStep + 1))}
              className="rounded bg-[#101F36] px-5 py-3 text-[0.875rem] font-medium text-white"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              disabled={!canSubmit}
              onClick={onSubmit}
              className="rounded bg-[#101F36] px-5 py-3 text-[0.875rem] font-medium text-white disabled:opacity-50"
            >
              Submit problem report
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[0.75rem] font-medium uppercase tracking-wide text-[#616161]">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded border border-[#e0e0e0] px-3 py-3 text-[0.875rem] focus:border-[#101F36] focus:outline-none focus:ring-1 focus:ring-[#101F36]"
      />
    </label>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-[#e0e0e0] bg-[#fafafa] p-3">
      <p className="mb-1 text-[0.75rem] text-[#616161]">{label}</p>
      <p className="text-[0.875rem] font-medium text-[#212121]">{value}</p>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-[#e0e0e0] bg-[#fafafa] p-4">
      <p className="mb-2 text-[0.75rem] font-medium uppercase tracking-wide text-[#616161]">{label}</p>
      <p className="whitespace-pre-wrap text-[0.875rem] text-[#212121]">{value}</p>
    </div>
  );
}

function reporterSummary(draft: ProblemReportDraft) {
  if (draft.reporterScenario === 'authenticated') {
    return `${authenticatedReporter.name}\n${authenticatedReporter.email}${draft.telephone ? `\n${draft.telephone}` : ''}`;
  }

  const parts = [draft.name, draft.email, draft.telephone].filter(Boolean);
  return parts.length ? parts.join('\n') : 'No contact details provided';
}
