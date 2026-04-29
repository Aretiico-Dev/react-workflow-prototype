import { useState, useEffect } from 'react';
import { Download, CheckCircle2, FileText, Copy, Loader2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { RevokeCertificateDialog } from './RevokeCertificateDialog';

interface CertificateDownloadStepProps {
  domain: string;
  certificateType: 'dv' | 'ov';
  includeOrg: boolean;
  onRevoke?: () => void;
}

type IssuanceStatus = 'processing' | 'ready';

export function CertificateDownloadStep({ domain, certificateType, includeOrg, onRevoke }: CertificateDownloadStepProps) {
  const [status, setStatus] = useState<IssuanceStatus>('processing');
  const [serialNumber] = useState(() =>
    Array.from({ length: 16 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join(':').toUpperCase()
  );
  const [issuedDate] = useState(new Date());
  const [expiryDate] = useState(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000));
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);

  const mockCertificate = `-----BEGIN CERTIFICATE-----
MIIFXzCCBEegAwIBAgISA${Math.random().toString(36).substring(2, 15)}AAAAMA0GCSqGSIb3
DQEBCwUAMDIxCzAJBgNVBAYTAlVTMRYwFAYDVQQKEw1MZXQncyBFbmNyeXB0MQsw
CQYDVQQDEwJSMzAeFw0yNjA0MjEwMDAwMDBaFw0yNzA0MjEyMzU5NTlaMBcxFTAT
BgNVBAMTDCR7ZG9tYWlufTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEB
AL5N8vVi${Math.random().toString(36).substring(2, 25)}YjRFVkVzQ3BT
-----END CERTIFICATE-----`;

  const mockChain = `-----BEGIN CERTIFICATE-----
MIIFFjCCAv6gAwIBAgIRAJErCErPDBinU/bWLiWnX1owDQYJKoZIhvcNAQELBQAw
TzELMAkGA1UEBhMCVVMxKTAnBgNVBAoTIEludGVybmV0IFNlY3VyaXR5IFJlc2Vh
cmNoIEdyb3VwMRUwEwYDVQQDEwxJU1JHIFJvb3QgWDEwHhcNMjAwOTA0MDAwMDAw
WhcNMjUwOTE1MTYwMDAwWjAyMQswCQYDVQQGEwJVUzEWMBQGA1UEChMNTGV0J3Mg
RW5jcnlwdDELMAkGA1UEAxMCUjMwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEK
AoIBAQC7AhUozPagl${Math.random().toString(36).substring(2, 30)}NUE=
-----END CERTIFICATE-----`;

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus('ready');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
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

  const handleRevokeCertificate = (revocationReason: string, additionalDetails?: string) => {
    setRevokeDialogOpen(false);
    toast.success('Certificate revoked successfully');
    if (onRevoke) {
      onRevoke();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[1.25rem] font-semibold text-[#212121] mb-2">Certificate Issued</h3>
        <p className="text-[0.875rem] text-[#616161]">
          Your TLS certificate is ready to download
        </p>
      </div>

      {status === 'processing' && (
        <div className="flex items-start gap-3 p-4 bg-[#e3f2fd] border border-[#90caf9] rounded">
          <Loader2 className="h-5 w-5 text-[#101F36] animate-spin flex-shrink-0 mt-0.5" />
          <p className="text-[0.875rem] text-[#212121]">
            Generating your certificate... This will take just a moment.
          </p>
        </div>
      )}

      {status === 'ready' && (
        <div className="flex items-start gap-3 p-4 bg-[#b9f6ca] border border-[#00c853] rounded">
          <CheckCircle2 className="h-5 w-5 text-[#00c853] flex-shrink-0 mt-0.5" />
          <p className="text-[0.875rem] text-[#212121]">
            Your {includeOrg ? 'OV' : 'DV'} certificate has been successfully issued!
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
              <p className="text-[0.75rem] text-[#616161]">Domain</p>
              <p className="text-[0.875rem] font-medium text-[#212121]">{domain}</p>
            </div>
            <div>
              <p className="text-[0.75rem] text-[#616161]">Certificate Type</p>
              <p className="text-[0.875rem] font-medium text-[#212121]">
                {includeOrg ? 'Organization Validated (OV)' : 'Domain Validated (DV)'}
              </p>
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
            <h4 className="text-[1.125rem] font-semibold text-[#212121]">Download Files</h4>
            <p className="text-[0.75rem] text-[#616161] mt-1">All files needed for installation</p>
          </div>
          <div className="px-6 py-6 space-y-3">
            <button
              onClick={() => downloadFile(mockCertificate, `${domain}.crt`)}
              className="w-full flex items-center gap-2 px-4 py-2.5 border border-[#e0e0e0] rounded hover:bg-[#fafafa] transition-colors text-left disabled:opacity-50"
              disabled={status === 'processing'}
            >
              <FileText className="w-4 h-4 text-[#616161]" />
              <span className="text-[0.875rem] text-[#212121]">Certificate ({domain}.crt)</span>
            </button>
            <button
              onClick={() => downloadFile(mockChain, `${domain}-chain.crt`)}
              className="w-full flex items-center gap-2 px-4 py-2.5 border border-[#e0e0e0] rounded hover:bg-[#fafafa] transition-colors text-left disabled:opacity-50"
              disabled={status === 'processing'}
            >
              <FileText className="w-4 h-4 text-[#616161]" />
              <span className="text-[0.875rem] text-[#212121]">Certificate Chain</span>
            </button>
            <button
              onClick={() => {
                downloadFile(mockCertificate, `${domain}.crt`);
                setTimeout(() => downloadFile(mockChain, `${domain}-chain.crt`), 500);
              }}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#81D742] text-white rounded hover:bg-[#6bc12f] transition-colors disabled:opacity-50"
              disabled={status === 'processing'}
            >
              <Download className="w-4 h-4" />
              DOWNLOAD ALL FILES
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)]">
        <div className="border-b border-[#e0e0e0] px-6 py-4">
          <h4 className="text-[1.125rem] font-semibold text-[#212121]">Certificate Content</h4>
          <p className="text-[0.75rem] text-[#616161] mt-1">View and copy your certificate files</p>
        </div>

        <div className="px-6 py-6 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[0.875rem] font-medium text-[#212121]">Certificate</label>
              <button
                onClick={() => copyToClipboard(mockCertificate, 'Certificate')}
                disabled={status === 'processing'}
                className="flex items-center gap-2 px-3 py-1.5 text-[0.75rem] text-[#616161] hover:text-[#101F36] disabled:opacity-50"
              >
                <Copy className="w-3 h-3" />
                COPY
              </button>
            </div>
            <pre className="p-4 bg-[#fafafa] border border-[#e0e0e0] rounded text-[0.625rem] overflow-x-auto font-mono">
              {status === 'processing' ? 'Generating...' : mockCertificate}
            </pre>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[0.875rem] font-medium text-[#212121]">Certificate Chain</label>
              <button
                onClick={() => copyToClipboard(mockChain, 'Certificate chain')}
                disabled={status === 'processing'}
                className="flex items-center gap-2 px-3 py-1.5 text-[0.75rem] text-[#616161] hover:text-[#101F36] disabled:opacity-50"
              >
                <Copy className="w-3 h-3" />
                COPY
              </button>
            </div>
            <pre className="p-4 bg-[#fafafa] border border-[#e0e0e0] rounded text-[0.625rem] overflow-x-auto font-mono">
              {status === 'processing' ? 'Generating...' : mockChain}
            </pre>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 bg-[#fff8e1] border border-[#ffc107] rounded">
        <p className="text-[0.875rem] text-[#212121]">
          <strong>Installation Note:</strong> Install both the certificate and the certificate chain on your web server.
          The chain file ensures browsers can verify the complete trust path.
        </p>
      </div>

      {onRevoke && status === 'ready' && (
        <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)]">
          <div className="border-b border-[#e0e0e0] px-6 py-4">
            <h4 className="text-[1.125rem] font-semibold text-[#212121]">Certificate Management</h4>
          </div>
          <div className="px-6 py-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h5 className="text-[0.875rem] font-medium text-[#212121] mb-1">Revoke Certificate</h5>
                <p className="text-[0.75rem] text-[#616161]">
                  Permanently invalidate this certificate. This action cannot be undone and will immediately
                  prevent the certificate from being trusted by browsers.
                </p>
              </div>
              <button
                onClick={() => setRevokeDialogOpen(true)}
                className="flex items-center gap-2 px-6 py-2.5 border border-[#f44336] text-[#f44336] rounded hover:bg-[#f9d8d8] transition-colors flex-shrink-0"
              >
                <XCircle className="w-4 h-4" />
                REVOKE CERTIFICATE
              </button>
            </div>
          </div>
        </div>
      )}

      <RevokeCertificateDialog
        open={revokeDialogOpen}
        onOpenChange={setRevokeDialogOpen}
        onConfirm={handleRevokeCertificate}
      />
    </div>
  );
}
