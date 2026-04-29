import { useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface PersonalDetails {
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  dateOfBirth: string;
  idCountry: string;
  idType: string;
}

interface AddressDetails {
  issuer: string;
  issueDate: string;
  documentType: string;
}

interface ConfirmDetailsStepProps {
  extractedPersonalDetails: PersonalDetails;
  extractedAddressDetails: AddressDetails;
  onNext: (personalDetails: PersonalDetails, addressDetails: AddressDetails) => void;
  onCancel: () => void;
}

const documentTypes = ['Bank Statement', 'Utility Bill', 'Council Tax Bill', 'Other'];

export function ConfirmDetailsStep({
  extractedPersonalDetails,
  extractedAddressDetails,
  onNext,
  onCancel
}: ConfirmDetailsStepProps) {
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>(extractedPersonalDetails);
  const [addressDetails, setAddressDetails] = useState<AddressDetails>(extractedAddressDetails);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(personalDetails, addressDetails);
  };

  const updatePersonalDetail = (field: keyof PersonalDetails, value: string) => {
    setPersonalDetails(prev => ({ ...prev, [field]: value }));
  };

  const updateAddressDetail = (field: keyof AddressDetails, value: string) => {
    setAddressDetails(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 p-4 bg-[#e3f2fd] border border-[#90caf9] rounded">
        <CheckCircle2 className="w-5 h-5 text-[#101F36] mt-0.5 flex-shrink-0" />
        <div className="text-[0.875rem] text-[#212121]">
          <strong>Documents Uploaded Successfully</strong>
          <p className="mt-1">
            We've extracted the information from your documents. Please review and correct any errors below.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Details from ID */}
        <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)] p-6">
          <h4 className="text-[1.125rem] font-semibold text-[#212121] mb-4">
            Personal Details (from ID)
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-[0.875rem] font-medium text-[#212121]">
                Title
              </label>
              <input
                id="title"
                type="text"
                value={personalDetails.title}
                onChange={(e) => updatePersonalDetail('title', e.target.value)}
                placeholder="e.g., Mr, Mrs, Dr, Prof, etc."
                className="w-full px-4 py-2.5 border border-[#787878] rounded-lg focus:outline-none focus:border-[#101F36] focus:ring-1 focus:ring-[#101F36]"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="firstName" className="block text-[0.875rem] font-medium text-[#212121]">
                First Name <span className="text-[#f44336]">*</span>
              </label>
              <input
                id="firstName"
                type="text"
                value={personalDetails.firstName}
                onChange={(e) => updatePersonalDetail('firstName', e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-[#787878] rounded-lg focus:outline-none focus:border-[#101F36] focus:ring-1 focus:ring-[#101F36]"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="middleName" className="block text-[0.875rem] font-medium text-[#212121]">
                Middle Name(s)
              </label>
              <input
                id="middleName"
                type="text"
                value={personalDetails.middleName}
                onChange={(e) => updatePersonalDetail('middleName', e.target.value)}
                className="w-full px-4 py-2.5 border border-[#787878] rounded-lg focus:outline-none focus:border-[#101F36] focus:ring-1 focus:ring-[#101F36]"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="lastName" className="block text-[0.875rem] font-medium text-[#212121]">
                Last Name <span className="text-[#f44336]">*</span>
              </label>
              <input
                id="lastName"
                type="text"
                value={personalDetails.lastName}
                onChange={(e) => updatePersonalDetail('lastName', e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-[#787878] rounded-lg focus:outline-none focus:border-[#101F36] focus:ring-1 focus:ring-[#101F36]"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="suffix" className="block text-[0.875rem] font-medium text-[#212121]">
                Suffix
              </label>
              <input
                id="suffix"
                type="text"
                value={personalDetails.suffix}
                onChange={(e) => updatePersonalDetail('suffix', e.target.value)}
                placeholder="e.g., Jr, Sr, II, III, etc."
                className="w-full px-4 py-2.5 border border-[#787878] rounded-lg focus:outline-none focus:border-[#101F36] focus:ring-1 focus:ring-[#101F36]"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="dateOfBirth" className="block text-[0.875rem] font-medium text-[#212121]">
                Date of Birth <span className="text-[#f44336]">*</span>
              </label>
              <input
                id="dateOfBirth"
                type="date"
                value={personalDetails.dateOfBirth}
                onChange={(e) => updatePersonalDetail('dateOfBirth', e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-[#787878] rounded-lg focus:outline-none focus:border-[#101F36] focus:ring-1 focus:ring-[#101F36]"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="idCountry" className="block text-[0.875rem] font-medium text-[#212121]">
                ID Issuing Country <span className="text-[#f44336]">*</span>
              </label>
              <input
                id="idCountry"
                type="text"
                value={personalDetails.idCountry}
                onChange={(e) => updatePersonalDetail('idCountry', e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-[#787878] rounded-lg focus:outline-none focus:border-[#101F36] focus:ring-1 focus:ring-[#101F36]"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="idType" className="block text-[0.875rem] font-medium text-[#212121]">
                ID Document Type <span className="text-[#f44336]">*</span>
              </label>
              <select
                id="idType"
                value={personalDetails.idType}
                onChange={(e) => updatePersonalDetail('idType', e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-[#787878] rounded-lg focus:outline-none focus:border-[#101F36] focus:ring-1 focus:ring-[#101F36]"
              >
                <option value="Passport">Passport</option>
                <option value="Driving License">Driving License</option>
              </select>
            </div>
          </div>
        </div>

        {/* Proof of Address Details */}
        <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)] p-6">
          <h4 className="text-[1.125rem] font-semibold text-[#212121] mb-4">
            Proof of Address Details
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="issuer" className="block text-[0.875rem] font-medium text-[#212121]">
                Document Issuer <span className="text-[#f44336]">*</span>
              </label>
              <input
                id="issuer"
                type="text"
                value={addressDetails.issuer}
                onChange={(e) => updateAddressDetail('issuer', e.target.value)}
                placeholder="e.g., Barclays Bank, British Gas, etc."
                required
                className="w-full px-4 py-2.5 border border-[#787878] rounded-lg focus:outline-none focus:border-[#101F36] focus:ring-1 focus:ring-[#101F36]"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="issueDate" className="block text-[0.875rem] font-medium text-[#212121]">
                Issue Date <span className="text-[#f44336]">*</span>
              </label>
              <input
                id="issueDate"
                type="date"
                value={addressDetails.issueDate}
                onChange={(e) => updateAddressDetail('issueDate', e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-[#787878] rounded-lg focus:outline-none focus:border-[#101F36] focus:ring-1 focus:ring-[#101F36]"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="documentType" className="block text-[0.875rem] font-medium text-[#212121]">
                Document Type <span className="text-[#f44336]">*</span>
              </label>
              <select
                id="documentType"
                value={addressDetails.documentType}
                onChange={(e) => updateAddressDetail('documentType', e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-[#787878] rounded-lg focus:outline-none focus:border-[#101F36] focus:ring-1 focus:ring-[#101F36]"
              >
                {documentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="flex items-start gap-3 p-4 bg-[#fff8e1] border border-[#ffc107] rounded">
          <AlertCircle className="w-5 h-5 text-[#ffc107] mt-0.5 flex-shrink-0" />
          <p className="text-[0.75rem] text-[#212121]">
            <strong>Please ensure all information is accurate.</strong> Incorrect details may delay your verification
            or result in rejection.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-[#e0e0e0] rounded hover:bg-[#fafafa] transition-colors text-[0.875rem] font-medium"
          >
            CANCEL VERIFICATION
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-[#101F36] text-white rounded hover:bg-[#1565c0] transition-colors"
          >
            CONFIRM AND CONTINUE
          </button>
        </div>
      </form>
    </div>
  );
}
