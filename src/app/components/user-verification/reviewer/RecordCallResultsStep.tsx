import { useState } from 'react';
import { Upload, FileVideo, Flag, X, CheckCircle } from 'lucide-react';

interface RecordCallResultsStepProps {
  onNext: (callRecording: File, comments: string, flag?: { comment: string }) => void;
}

export function RecordCallResultsStep({ onNext }: RecordCallResultsStepProps) {
  const [flagged, setFlagged] = useState(false);
  const [flagComment, setFlagComment] = useState('');
  const [callRecording, setCallRecording] = useState<File | null>(null);
  const [comments, setComments] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setCallRecording(file);
    }
  };

  const handleContinue = () => {
    if (!callRecording) return;

    if (flagged && flagComment.trim()) {
      onNext(callRecording, comments, { comment: flagComment });
    } else if (!flagged) {
      onNext(callRecording, comments);
    }
  };

  return (
    <div className="space-y-6">
      {/* Flag Banner */}
      {flagged && (
        <div className="bg-[#fff8e1] border-l-4 border-[#ffc107] p-4 rounded">
          <div className="flex items-start gap-3">
            <Flag className="w-5 h-5 text-[#ffc107] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-[0.875rem] font-medium text-[#212121] mb-2">
                This verification has been flagged for review
              </p>
              <textarea
                value={flagComment}
                onChange={(e) => setFlagComment(e.target.value)}
                placeholder="Add a comment explaining why this verification has been flagged..."
                className="w-full px-3 py-2 border border-[#e0e0e0] rounded text-[0.875rem] min-h-[80px] resize-none"
              />
            </div>
            <button
              onClick={() => {
                setFlagged(false);
                setFlagComment('');
              }}
              className="p-1 hover:bg-[#ffc107]/10 rounded"
            >
              <X className="w-4 h-4 text-[#616161]" />
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)] p-8">
        <div className="max-w-2xl mx-auto">
          <h4 className="text-[1.125rem] font-semibold text-[#212121] mb-2">
            Record Call Results
          </h4>
          <p className="text-[0.875rem] text-[#616161] mb-6">
            Upload the call recording and add any additional notes or observations
          </p>

          {/* Upload Call Recording */}
          <div className="mb-6">
            <label className="text-[0.875rem] font-medium text-[#212121] block mb-3">
              Call Recording *
            </label>
            {!callRecording ? (
              <label className="cursor-pointer block">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-[#101F36] rounded-lg p-8 hover:bg-[#e3f2fd] transition-colors">
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-[#101F36] mx-auto mb-3" />
                    <p className="text-[0.875rem] font-medium text-[#212121] mb-1">
                      Upload Video Recording
                    </p>
                    <p className="text-[0.75rem] text-[#616161]">
                      Click to browse or drag and drop your file here
                    </p>
                    <p className="text-[0.75rem] text-[#616161] mt-2">
                      Supported formats: MP4, MOV, AVI, WebM
                    </p>
                  </div>
                </div>
              </label>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-[#b9f6ca]/20 border border-[#00c853] rounded-lg">
                <FileVideo className="w-8 h-8 text-[#00c853] flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-[0.875rem] font-medium text-[#212121]">{callRecording.name}</p>
                  <p className="text-[0.75rem] text-[#616161]">
                    {(callRecording.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => setCallRecording(null)}
                  className="px-3 py-1.5 text-[0.75rem] text-[#f44336] hover:bg-[#f9d8d8] rounded transition-colors"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Comments */}
          <div className="mb-6">
            <label className="text-[0.875rem] font-medium text-[#212121] block mb-3">
              Additional Comments (Optional)
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Add any observations, concerns, or notes about the video call..."
              className="w-full px-4 py-3 border border-[#e0e0e0] rounded text-[0.875rem] min-h-[120px] resize-none focus:outline-none focus:border-[#101F36]"
            />
            <p className="text-[0.75rem] text-[#616161] mt-2">
              Note any suspicious behavior, technical issues, or other relevant information
            </p>
          </div>

          {/* Verification Checklist */}
          <div className="bg-[#e3f2fd] border border-[#90caf9] rounded-lg p-4 mb-6">
            <p className="text-[0.75rem] font-medium text-[#212121] mb-2">Call Verification Checklist</p>
            <ul className="text-[0.75rem] text-[#212121] space-y-1.5">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#00c853] flex-shrink-0 mt-0.5" />
                <span>User successfully completed AI detection test</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#00c853] flex-shrink-0 mt-0.5" />
                <span>ID document shown matches submitted documentation</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#00c853] flex-shrink-0 mt-0.5" />
                <span>Person on camera matches ID document photo</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#00c853] flex-shrink-0 mt-0.5" />
                <span>User verbally confirmed personal details</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#00c853] flex-shrink-0 mt-0.5" />
                <span>No signs of deepfake or AI-generated video</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#00c853] flex-shrink-0 mt-0.5" />
                <span>Call recording uploaded successfully</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-[#e0e0e0] flex gap-3 justify-end">
            {!flagged && callRecording && (
              <button
                onClick={() => setFlagged(true)}
                className="flex items-center gap-2 px-6 py-3 border border-[#ffc107] text-[#ffc107] rounded hover:bg-[#fff8e1] transition-colors text-[0.875rem] font-medium"
              >
                <Flag className="w-4 h-4" />
                FLAG FOR REVIEW
              </button>
            )}
            <button
              onClick={handleContinue}
              disabled={!callRecording || (flagged && !flagComment.trim())}
              className="px-6 py-3 bg-[#101F36] text-white rounded hover:bg-[#1565c0] transition-colors text-[0.875rem] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              CONTINUE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
