import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { ArrowLeft, Copy, CheckCircle2, Clock, XCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface VerificationInProgressStepProps {
  domain: string;
  method: 'http' | 'dns';
  onVerified: () => void;
  onBack: () => void;
}

type VerificationStatus = 'pending' | 'verifying' | 'success' | 'failed';

export function VerificationInProgressStep({ domain, method, onVerified, onBack }: VerificationInProgressStepProps) {
  const [status, setStatus] = useState<VerificationStatus>('pending');
  const [verificationToken] = useState(() =>
    Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  );
  const [attempts, setAttempts] = useState(0);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const verificationInstructions = method === 'http' ? {
    title: 'HTTP File Upload Instructions',
    steps: [
      'Download or create a file named "fileauth.txt"',
      `Upload the file to: http://${domain}/.well-known/pki-validation/`,
      'Ensure the file is publicly accessible',
      'Click "Verify Domain" to check'
    ],
    filepath: `http://${domain}/.well-known/pki-validation/fileauth.txt`,
  } : {
    title: 'DNS TXT Record Instructions',
    steps: [
      'Log in to your DNS provider',
      `Add a TXT record with name: _acme-challenge.${domain}`,
      `Set the value to: ${verificationToken}`,
      'Wait for DNS propagation (typically 5-30 minutes)',
      'Click "Verify Domain" to check'
    ],
    recordName: `_acme-challenge.${domain}`,
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const simulateVerification = () => {
    setStatus('verifying');
    setLastChecked(new Date());
    setAttempts(prev => prev + 1);

    setTimeout(() => {
      if (Math.random() > 0.3 && attempts >= 1) {
        setStatus('success');
        setTimeout(() => onVerified(), 1500);
      } else {
        setStatus('failed');
      }
    }, 2000);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'verifying') {
      interval = setInterval(() => {
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [status]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" onClick={onBack} className="gap-2" disabled={status === 'verifying'}>
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      <div>
        <h1 className="text-3xl">Verify Domain Ownership</h1>
        <p className="text-gray-600 mt-1">Complete the verification process for {domain}</p>
      </div>

      {status === 'success' && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Domain verified successfully! Proceeding to next step...
          </AlertDescription>
        </Alert>
      )}

      {status === 'failed' && (
        <Alert className="border-red-200 bg-red-50">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Verification failed. Please check your configuration and try again.
            {method === 'dns' && ' DNS records may take up to 30 minutes to propagate.'}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{verificationInstructions.title}</CardTitle>
          <CardDescription>Follow these steps to verify your domain ownership</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            {verificationInstructions.steps.map((step, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-sm flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-sm pt-0.5">{step}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {method === 'http' && (
              <div className="space-y-2">
                <label className="text-sm">Verification Token</label>
                <div className="flex gap-2">
                  <div className="flex-1 p-3 bg-gray-100 rounded font-mono text-sm break-all">
                    {verificationToken}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(verificationToken, 'Token')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-500">This is the content your file should contain</p>
              </div>
            )}

            {method === 'dns' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm">Record Name</label>
                  <div className="flex gap-2">
                    <div className="flex-1 p-3 bg-gray-100 rounded font-mono text-sm break-all">
                      {verificationInstructions.recordName}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(verificationInstructions.recordName!, 'Record name')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm">Record Value</label>
                  <div className="flex gap-2">
                    <div className="flex-1 p-3 bg-gray-100 rounded font-mono text-sm break-all">
                      {verificationToken}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(verificationToken, 'Record value')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    DNS changes can take 5-30 minutes to propagate globally. If verification fails, please wait and try again.
                  </AlertDescription>
                </Alert>
              </>
            )}
          </div>

          {lastChecked && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              Last checked: {lastChecked.toLocaleTimeString()}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={simulateVerification}
              disabled={status === 'verifying'}
              className="flex-1"
            >
              {status === 'verifying' ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Domain'
              )}
            </Button>
          </div>

          <p className="text-sm text-gray-500 text-center">
            Verification is automatic. Click the button above after completing the setup.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
