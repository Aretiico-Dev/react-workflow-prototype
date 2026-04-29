import { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, ArrowLeft, Eye } from 'lucide-react';

interface UploadProofOfAddressStepProps {
  onNext: (file: File) => void;
  onCancel: () => void;
}

export function UploadProofOfAddressStep({ onNext, onCancel }: UploadProofOfAddressStepProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // Create preview URL
      if (selectedFile.type.startsWith('image/')) {
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  useEffect(() => {
    // Cleanup preview URL on unmount
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);

      // Create preview URL
      if (droppedFile.type.startsWith('image/')) {
        const url = URL.createObjectURL(droppedFile);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      onNext(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)] p-6">
        <h4 className="text-[1.125rem] font-semibold text-[#212121] mb-2">
          Upload Proof of Address
        </h4>
        <p className="text-[0.875rem] text-[#616161] mb-6">
          Please upload a document showing your current residential address
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Accepted Documents */}
          <div className="space-y-3">
            <label className="block text-[0.875rem] font-medium text-[#212121]">
              Accepted Documents
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 border border-[#e0e0e0] rounded bg-[#fafafa]">
                <p className="text-[0.75rem] font-medium text-[#212121]">Bank Statement</p>
              </div>
              <div className="p-3 border border-[#e0e0e0] rounded bg-[#fafafa]">
                <p className="text-[0.75rem] font-medium text-[#212121]">Utility Bill</p>
              </div>
              <div className="p-3 border border-[#e0e0e0] rounded bg-[#fafafa]">
                <p className="text-[0.75rem] font-medium text-[#212121]">Council Tax Bill</p>
              </div>
            </div>
            <p className="text-[0.75rem] text-[#616161]">
              Document must be dated within the last 3 months
            </p>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <label className="block text-[0.875rem] font-medium text-[#212121]">
              Upload Document
            </label>

            {!file ? (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-[#101F36] bg-[#e3f2fd]'
                    : 'border-[#e0e0e0] hover:border-[#90caf9]'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-[#616161] mx-auto mb-4" />
                <p className="text-[0.875rem] text-[#212121] mb-2">
                  Drag and drop your document here, or click to browse
                </p>
                <p className="text-[0.75rem] text-[#616161] mb-4">
                  Accepted formats: PDF, JPG, PNG (max 10MB)
                </p>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="address-upload"
                />
                <label
                  htmlFor="address-upload"
                  className="inline-block px-6 py-2.5 bg-[#101F36] text-white rounded hover:bg-[#1565c0] cursor-pointer transition-colors text-[0.875rem] font-medium"
                >
                  CHOOSE FILE
                </label>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="border border-[#00c853] bg-[#b9f6ca] rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#00c853] mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-[0.875rem] font-medium text-[#212121]">{file.name}</p>
                      <p className="text-[0.75rem] text-[#616161] mt-1">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null);
                        setPreviewUrl(null);
                      }}
                      className="text-[0.75rem] text-[#00c853] hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Preview */}
                {previewUrl && (
                  <div className="border border-[#e0e0e0] rounded-lg p-4 bg-white">
                    <div className="flex items-center gap-2 mb-3">
                      <Eye className="w-4 h-4 text-[#616161]" />
                      <p className="text-[0.875rem] font-medium text-[#212121]">Preview</p>
                    </div>
                    <div className="flex justify-center">
                      <img
                        src={previewUrl}
                        alt="Proof of address preview"
                        className="max-w-full max-h-96 rounded border border-[#e0e0e0]"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Important Notes */}
          <div className="flex items-start gap-3 p-4 bg-[#e3f2fd] border border-[#90caf9] rounded">
            <AlertCircle className="w-5 h-5 text-[#101F36] mt-0.5 flex-shrink-0" />
            <div className="text-[0.75rem] text-[#212121]">
              <strong>Important:</strong>
              <ul className="list-disc ml-4 mt-2 space-y-1">
                <li>Your full name and current address must be clearly visible</li>
                <li>The document must be dated within the last 3 months</li>
                <li>Ensure all text is readable (scan or high-quality photo)</li>
                <li>The entire document should be visible in the image/PDF</li>
              </ul>
            </div>
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
              disabled={!file}
              className="flex-1 px-6 py-3 bg-[#101F36] text-white rounded hover:bg-[#1565c0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              CONTINUE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
