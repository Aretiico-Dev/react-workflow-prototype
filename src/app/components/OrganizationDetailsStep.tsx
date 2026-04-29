import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { ArrowLeft, Building2, CheckCircle2 } from 'lucide-react';

interface OrganizationDetailsStepProps {
  domain: string;
  certificateType: 'dv' | 'ov';
  onNext: (includeOrg: boolean) => void;
  onBack: () => void;
}

export function OrganizationDetailsStep({ domain, certificateType, onNext, onBack }: OrganizationDetailsStepProps) {
  const [includeOrg, setIncludeOrg] = useState(certificateType === 'ov');

  const mockOrgData = {
    name: 'Acme Corporation',
    country: 'United States',
    state: 'California',
    city: 'San Francisco',
    validatedDate: '2025-08-15',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(includeOrg);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" onClick={onBack} className="gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      <div>
        <h1 className="text-3xl">Organization Details</h1>
        <p className="text-gray-600 mt-1">Configure organization validation for {domain}</p>
      </div>

      <Alert className="border-green-200 bg-green-50">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Domain ownership verified successfully
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Certificate Type</CardTitle>
          <CardDescription>Choose whether to include your organization details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <label className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                !includeOrg ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="orgOption"
                  checked={!includeOrg}
                  onChange={() => setIncludeOrg(false)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="font-medium">Domain Validated Only</div>
                  <p className="text-sm text-gray-600 mt-1">
                    Issue a standard DV certificate without organization information
                  </p>
                </div>
              </label>

              <label className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                includeOrg ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="orgOption"
                  checked={includeOrg}
                  onChange={() => setIncludeOrg(true)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="font-medium">Organization Validated (OV)</div>
                  <p className="text-sm text-gray-600 mt-1">
                    Include your validated organization details in the certificate for enhanced trust
                  </p>
                </div>
              </label>
            </div>

            {includeOrg && (
              <Card className="bg-gray-50">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <CardTitle className="text-lg">Validated Organization</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Organization Name</p>
                      <p className="font-medium">{mockOrgData.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Country</p>
                      <p className="font-medium">{mockOrgData.country}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">State/Province</p>
                      <p className="font-medium">{mockOrgData.state}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">City</p>
                      <p className="font-medium">{mockOrgData.city}</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t">
                    <p className="text-sm text-gray-500">Validated on</p>
                    <p className="font-medium">{new Date(mockOrgData.validatedDate).toLocaleDateString()}</p>
                  </div>
                  <Alert>
                    <AlertDescription className="text-sm">
                      These details will be included in your certificate's subject field
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            )}

            <Button type="submit" className="w-full">
              {includeOrg ? 'Issue OV Certificate' : 'Issue DV Certificate'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
