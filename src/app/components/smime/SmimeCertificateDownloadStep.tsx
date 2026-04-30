import { useEffect, useState } from 'react';
import { CheckCircle2, Copy, Download, FileArchive, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { SmimeCertificateType, smimeOrganizations } from './SmimeEmailInputStep';

interface SmimeCertificateDownloadStepProps {
  emailAddress: string;
  certificateType: SmimeCertificateType;
  organizationId?: string;
}

type IssuanceStatus = 'processing' | 'ready';

export function SmimeCertificateDownloadStep({ emailAddress, certificateType, organizationId }: SmimeCertificateDownloadStepProps) {
  const [status, setStatus] = useState<IssuanceStatus>('processing');
  const [serialNumber] = useState(() =>
    Array.from({ length: 16 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join(':').toUpperCase()
  );
  const [issuedDate] = useState(new Date());
  const [expiryDate] = useState(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000));
  const organization = smimeOrganizations.find(org => org.id === organizationId);
  const safeFilename = emailAddress.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();

  const mockP12Bundle = `-----BEGIN PKCS12-----
MIIK${Math.random().toString(36).substring(2, 18).toUpperCase()}SMIME${Math.random().toString(36).substring(2, 18).toUpperCase()}
Email=${emailAddress}
Type=${certificateType === 'ov' ? 'Organization Validated S/MIME' : 'Personal S/MIME'}
Serial=${serialNumber}
-----END PKCS12-----`;

  const mockCertificateSummary = `S/MIME Certificate
Subject Email: ${emailAddress}
Certificate Type: ${certificateType === 'ov' ? 'Organization Validated' : 'Personal'}
${organization ? `Organization: ${organization.name}` : 'Organization: Not included'}
Serial Number: ${serialNumber}`;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setStatus('ready');
    }, 3000);
    return () => window.clearTimeout(timer);
  }, []);

  const downloadFile = (content: string, filename: string, type = 'text/plain') => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`${filename} downloaded`);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[1.25rem] font-semibold text-[#212121] mb-2">Certificate Issued</h3>
        <p className="text-[0.875rem] text-[#616161]">
          Your S/MIME certificate is ready to download
        </p>
      </div>

      {status === 'processing' && (
        <div className="flex items-start gap-3 p-4 bg-[#e3f2fd] border border-[#90caf9] rounded">
          <Loader2 className="h-5 w-5 text-[#101F36] animate-spin flex-shrink-0 mt-0.5" />
          <p className="text-[0.875rem] text-[#212121]">
            Generating your S/MIME certificate bundle... This will take just a moment.
          </p>
        </div>
      )}

      {status === 'ready' && (
        <div className="flex items-start gap-3 p-4 bg-[#b9f6ca] border border-[#00c853] rounded">
          <CheckCircle2 className="h-5 w-5 text-[#00c853] flex-shrink-0 mt-0.5" />
          <p className="text-[0.875rem] text-[#212121]">
            Your {certificateType === 'ov' ? 'OV' : 'personal'} S/MIME certificate has been successfully issued.
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)]">
          <div className="border-b border-[#e0e0e0] px-6 py-4">
            <h4 className="text-[1.125rem] font-semibold text-[#212121]">Certificate Details</h4>
          </div>
          <div className="px-6 py-6 space-y-4">
            <div>
              <p className="text-[0.75rem] text-[#616161]">Email Address</p>
              <p className="text-[0.875rem] font-medium text-[#212121] break-all">{emailAddress}</p>
            </div>
            <div>
              <p className="text-[0.75rem] text-[#616161]">Certificate Type</p>
              <p className="text-[0.875rem] font-medium text-[#212121]">
                {certificateType === 'ov' ? 'Organization Validated S/MIME' : 'Personal S/MIME'}
              </p>
            </div>
            {organization && (
              <div>
                <p className="text-[0.75rem] text-[#616161]">Organization</p>
                <p className="text-[0.875rem] font-medium text-[#212121]">{organization.name}</p>
              </div>
            )}
            <div>
              <p className="text-[0.75rem] text-[#616161]">Email Verification</p>
              <p className="text-[0.875rem] font-medium text-[#00c853]">Verified</p>
            </div>
            <div>
              <p className="text-[0.75rem] text-[#616161]">Serial Number</p>
              <p className="font-mono text-[0.625rem] text-[#212121]">{serialNumber}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[0.75rem] text-[#616161]">Issued</p>
                <p className="text-[0.875rem] font-medium text-[#212121]">{issuedDate.toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-[0.75rem] text-[#616161]">Expires</p>
                <p className="text-[0.875rem] font-medium text-[#212121]">{expiryDate.toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)]">
          <div className="border-b border-[#e0e0e0] px-6 py-4">
            <h4 className="text-[1.125rem] font-semibold text-[#212121]">Download Bundle</h4>
            <p className="text-[0.75rem] text-[#616161] mt-1">Install this file in your email client</p>
          </div>
          <div className="px-6 py-6 space-y-3">
            <button
              onClick={() => downloadFile(mockP12Bundle, `${safeFilename}.p12`, 'application/x-pkcs12')}
              className="w-full flex items-center gap-2 px-4 py-2.5 border border-[#e0e0e0] rounded hover:bg-[#fafafa] transition-colors text-left disabled:opacity-50"
              disabled={status === 'processing'}
            >
              <FileArchive className="w-4 h-4 text-[#616161]" />
              <span className="text-[0.875rem] text-[#212121]">PKCS#12 Bundle ({safeFilename}.p12)</span>
            </button>
            <button
              onClick={() => downloadFile(mockCertificateSummary, `${safeFilename}-certificate-summary.txt`)}
              className="w-full flex items-center gap-2 px-4 py-2.5 border border-[#e0e0e0] rounded hover:bg-[#fafafa] transition-colors text-left disabled:opacity-50"
              disabled={status === 'processing'}
            >
              <FileText className="w-4 h-4 text-[#616161]" />
              <span className="text-[0.875rem] text-[#212121]">Certificate Summary</span>
            </button>
            <button
              onClick={() => downloadFile(mockP12Bundle, `${safeFilename}.p12`, 'application/x-pkcs12')}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#81D742] text-white rounded hover:bg-[#6bc12f] transition-colors disabled:opacity-50"
              disabled={status === 'processing'}
            >
              <Download className="w-4 h-4" />
              DOWNLOAD PKCS#12 BUNDLE
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)]">
        <div className="border-b border-[#e0e0e0] px-6 py-4">
          <h4 className="text-[1.125rem] font-semibold text-[#212121]">Bundle Preview</h4>
          <p className="text-[0.75rem] text-[#616161] mt-1">Mock PKCS#12 content for this prototype</p>
        </div>

        <div className="px-6 py-6 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[0.875rem] font-medium text-[#212121]">PKCS#12 Bundle</label>
            <button
              onClick={() => copyToClipboard(mockP12Bundle, 'PKCS#12 bundle')}
              disabled={status === 'processing'}
              className="flex items-center gap-2 px-3 py-1.5 text-[0.75rem] text-[#616161] hover:text-[#101F36] disabled:opacity-50"
            >
              <Copy className="w-3 h-3" />
              COPY
            </button>
          </div>
          <pre className="p-4 bg-[#fafafa] border border-[#e0e0e0] rounded text-[0.625rem] overflow-x-auto font-mono">
            {status === 'processing' ? 'Generating...' : mockP12Bundle}
          </pre>
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 bg-[#fff8e1] border border-[#ffc107] rounded">
        <p className="text-[0.875rem] text-[#212121]">
          <strong>Installation Note:</strong> Import the PKCS#12 bundle into your mail client or operating system certificate store.
        </p>
      </div>
    </div>
  );
}
