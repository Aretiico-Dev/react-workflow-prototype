import { useState } from 'react';

interface TwoFactorResetRequestStepProps {
  onSubmit: (data: {
    aretiicoId: string;
    legalName: string;
    email: string;
    idFile: File | null;
  }) => void;
}

export function TwoFactorResetRequestStep({ onSubmit }: TwoFactorResetRequestStepProps) {
  const [aretiicoId, setAretiicoId] = useState('');
  const [legalName, setLegalName] = useState('');
  const [email, setEmail] = useState('');
  const [idFile, setIdFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setIdFile(e.target.files[0]);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!aretiicoId || !legalName || !email || !idFile) {
      setError('All fields are required, including uploading your ID.');
      return;
    }
    setError('');
    onSubmit({ aretiicoId, legalName, email, idFile });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white rounded shadow p-8 mt-8 space-y-6">
      <h2 className="text-xl font-semibold mb-4">Two Factor Authentication Reset Request</h2>
      <div>
        <label className="block font-medium mb-1">Aretiico ID (username)</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={aretiicoId}
          onChange={e => setAretiicoId(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Full Legal Name</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={legalName}
          onChange={e => setLegalName(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Email Address</label>
        <input
          className="w-full border rounded px-3 py-2"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Upload Government ID (photo page, PDF or image)</label>
        <input
          className="w-full border rounded px-3 py-2"
          type="file"
          accept=".pdf,image/*"
          onChange={handleFileChange}
          required
        />
      </div>
      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
      <button
        type="submit"
        className="w-full rounded bg-[#101F36] text-white py-3 font-medium mt-2"
      >
        Submit Request
      </button>
    </form>
  );
}
