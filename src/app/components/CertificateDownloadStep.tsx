import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Download, CheckCircle2, FileText, Shield, Copy, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface CertificateDownloadStepProps {
  domain: string;
  certificateType: 'dv' | 'ov';
  includeOrg: boolean;
}

type IssuanceStatus = 'processing' | 'ready';

export function CertificateDownloadStep({ domain, certificateType, includeOrg }: CertificateDownloadStepProps) {
  const [status, setStatus] = useState<IssuanceStatus>('processing');
  const [serialNumber] = useState(() =>
    Array.from({ length: 16 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join(':').toUpperCase()
  );
  const [issuedDate] = useState(new Date());
  const [expiryDate] = useState(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000));

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

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="w-8 h-8 text-green-600" />
        <div>
          <h1 className="text-3xl">Certificate Issued</h1>
          <p className="text-gray-600 mt-1">Your TLS certificate is ready to download</p>
        </div>
      </div>

      {status === 'processing' && (
        <Alert className="border-blue-200 bg-blue-50">
          <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
          <AlertDescription className="text-blue-800">
            Generating your certificate... This will take just a moment.
          </AlertDescription>
        </Alert>
      )}

      {status === 'ready' && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Your {includeOrg ? 'OV' : 'DV'} certificate has been successfully issued!
          </AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Certificate Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Domain</p>
              <p className="font-medium">{domain}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Certificate Type</p>
              <p className="font-medium">
                {includeOrg ? 'Organization Validated (OV)' : 'Domain Validated (DV)'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Serial Number</p>
              <p className="font-mono text-xs">{serialNumber}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Issued</p>
                <p className="font-medium">{issuedDate.toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Expires</p>
                <p className="font-medium">{expiryDate.toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Download Files</CardTitle>
            <CardDescription>All files needed for installation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={() => downloadFile(mockCertificate, `${domain}.crt`)}
              className="w-full justify-start"
              variant="outline"
              disabled={status === 'processing'}
            >
              <FileText className="w-4 h-4 mr-2" />
              Certificate ({domain}.crt)
            </Button>
            <Button
              onClick={() => downloadFile(mockChain, `${domain}-chain.crt`)}
              className="w-full justify-start"
              variant="outline"
              disabled={status === 'processing'}
            >
              <FileText className="w-4 h-4 mr-2" />
              Certificate Chain
            </Button>
            <Button
              onClick={() => {
                downloadFile(mockCertificate, `${domain}.crt`);
                setTimeout(() => downloadFile(mockChain, `${domain}-chain.crt`), 500);
              }}
              className="w-full"
              disabled={status === 'processing'}
            >
              <Download className="w-4 h-4 mr-2" />
              Download All Files
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Certificate Content</CardTitle>
          <CardDescription>View and copy your certificate files</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-medium">Certificate</label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(mockCertificate, 'Certificate')}
                disabled={status === 'processing'}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </div>
            <pre className="p-4 bg-gray-100 rounded text-xs overflow-x-auto">
              {status === 'processing' ? 'Generating...' : mockCertificate}
            </pre>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-medium">Certificate Chain</label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(mockChain, 'Certificate chain')}
                disabled={status === 'processing'}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </div>
            <pre className="p-4 bg-gray-100 rounded text-xs overflow-x-auto">
              {status === 'processing' ? 'Generating...' : mockChain}
            </pre>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <AlertDescription>
          <strong>Installation Note:</strong> Install both the certificate and the certificate chain on your web server.
          The chain file ensures browsers can verify the complete trust path.
        </AlertDescription>
      </Alert>
    </div>
  );
}
