import { useState } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, Globe, FileText } from 'lucide-react';

interface VerificationMethodStepProps {
  domain: string;
  onNext: (method: 'http' | 'dns') => void;
  onBack: () => void;
}

export function VerificationMethodStep({ domain, onNext, onBack }: VerificationMethodStepProps) {
  const [method, setMethod] = useState<'http' | 'dns'>('http');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(method);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" onClick={onBack} className="gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      <div>
        <h1 className="text-3xl">Domain Verification</h1>
        <p className="text-gray-600 mt-1">Choose how you want to verify ownership of {domain}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Verification Method</CardTitle>
          <CardDescription>Select your preferred verification method</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Label>How would you like to verify domain control?</Label>

              <label className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                method === 'http' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="method"
                  value="http"
                  checked={method === 'http'}
                  onChange={(e) => setMethod(e.target.value as 'http')}
                  className="mt-1"
                />
                <FileText className="w-5 h-5 text-gray-600 mt-0.5" />
                <div className="flex-1">
                  <div className="font-medium">HTTP File Upload</div>
                  <p className="text-sm text-gray-600 mt-1">
                    Upload a verification file to your web server at a specific path
                  </p>
                  <div className="mt-3 p-3 bg-gray-100 rounded text-sm font-mono">
                    http://{domain}/.well-known/pki-validation/fileauth.txt
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    <strong>Best for:</strong> Users with direct file system or FTP access
                  </div>
                </div>
              </label>

              <label className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                method === 'dns' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="method"
                  value="dns"
                  checked={method === 'dns'}
                  onChange={(e) => setMethod(e.target.value as 'dns')}
                  className="mt-1"
                />
                <Globe className="w-5 h-5 text-gray-600 mt-0.5" />
                <div className="flex-1">
                  <div className="font-medium">DNS TXT Record</div>
                  <p className="text-sm text-gray-600 mt-1">
                    Add a TXT record to your domain's DNS configuration
                  </p>
                  <div className="mt-3 p-3 bg-gray-100 rounded text-sm font-mono">
                    _acme-challenge.{domain}
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    <strong>Best for:</strong> Users with DNS management access. May take longer due to DNS propagation.
                  </div>
                </div>
              </label>
            </div>

            <Button type="submit" className="w-full">
              Continue
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
