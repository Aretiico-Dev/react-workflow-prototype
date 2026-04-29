import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Shield } from 'lucide-react';

interface DomainInputStepProps {
  onNext: (domain: string, certificateType: 'dv' | 'ov') => void;
  hasValidatedOrganization: boolean;
}

export function DomainInputStep({ onNext, hasValidatedOrganization }: DomainInputStepProps) {
  const [domain, setDomain] = useState('');
  const [certificateType, setCertificateType] = useState<'dv' | 'ov'>('dv');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (domain) {
      onNext(domain, certificateType);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-3xl">Purchase TLS Certificate</h1>
          <p className="text-gray-600 mt-1">Secure your domain with SSL/TLS encryption</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Domain Information</CardTitle>
          <CardDescription>Enter the domain you want to secure</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="domain">Domain Name</Label>
              <Input
                id="domain"
                type="text"
                placeholder="example.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                required
              />
              <p className="text-sm text-gray-500">Enter the domain without protocol (e.g., example.com)</p>
            </div>

            <div className="space-y-4">
              <Label>Certificate Type</Label>
              <div className="space-y-3">
                <label className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                  certificateType === 'dv' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="certificateType"
                    value="dv"
                    checked={certificateType === 'dv'}
                    onChange={(e) => setCertificateType(e.target.value as 'dv')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-medium">Domain Validated (DV)</div>
                    <p className="text-sm text-gray-600 mt-1">
                      Basic validation. Verifies domain ownership only. Issued within minutes.
                    </p>
                  </div>
                </label>

                <label className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                  certificateType === 'ov' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                } ${!hasValidatedOrganization ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <input
                    type="radio"
                    name="certificateType"
                    value="ov"
                    checked={certificateType === 'ov'}
                    onChange={(e) => setCertificateType(e.target.value as 'ov')}
                    disabled={!hasValidatedOrganization}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-medium">Organization Validated (OV)</div>
                    <p className="text-sm text-gray-600 mt-1">
                      Enhanced validation. Includes organization details in certificate. Better trust indicators.
                    </p>
                    {!hasValidatedOrganization && (
                      <p className="text-sm text-amber-600 mt-2">
                        You must belong to a validated organization to purchase OV certificates.
                      </p>
                    )}
                  </div>
                </label>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={!domain}>
              Continue to Verification
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
