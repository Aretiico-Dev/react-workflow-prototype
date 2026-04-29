import { useState } from 'react';
import { Video, Copy, CheckCircle, Flag, X, ExternalLink } from 'lucide-react';

interface JoinCallStepProps {
  scheduledDate: string;
  scheduledTime: string;
  onRecordResults: (flag?: { comment: string }) => void;
}

export function JoinCallStep({ scheduledDate, scheduledTime, onRecordResults }: JoinCallStepProps) {
  const [flagged, setFlagged] = useState(false);
  const [flagComment, setFlagComment] = useState('');
  const [aiTestCodeCopied, setAiTestCodeCopied] = useState(false);
  const [callStarted, setCallStarted] = useState(false);

  // Generate random 6-digit code
  const aiTestCode = Math.floor(100000 + Math.random() * 900000).toString();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setAiTestCodeCopied(true);
    setTimeout(() => setAiTestCodeCopied(false), 2000);
  };

  const handleStartCall = () => {
    // Open Teams call in new window (simulated)
    window.open('https://teams.microsoft.com/l/meetup-join/', '_blank');
    setCallStarted(true);
  };

  const handleRecordResults = () => {
    if (flagged && flagComment.trim()) {
      onRecordResults({ comment: flagComment });
    } else if (!flagged) {
      onRecordResults();
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
        <div className="max-w-3xl mx-auto">
          <h4 className="text-[1.125rem] font-semibold text-[#212121] mb-2">
            Verification Video Call
          </h4>
          <p className="text-[0.875rem] text-[#616161] mb-6">
            Join the scheduled Teams call and follow the verification script below
          </p>

          {/* Call Details */}
          <div className="bg-[#e3f2fd] border border-[#90caf9] rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Video className="w-6 h-6 text-[#101F36]" />
              <span className="text-[1rem] font-semibold text-[#212121]">Scheduled Call</span>
            </div>
            <p className="text-[0.875rem] text-[#212121] mb-1">
              {new Date(scheduledDate).toLocaleDateString('en-GB', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
            <p className="text-[0.875rem] text-[#616161]">{scheduledTime}</p>
          </div>

          {/* AI Test Code */}
          <div className="bg-[#fff8e1] border border-[#ffc107] rounded-lg p-6 mb-6">
            <p className="text-[0.875rem] font-medium text-[#212121] mb-3">AI Detection Test Code</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-white border border-[#e0e0e0] rounded p-4">
                <p className="text-[2rem] font-bold text-[#212121] text-center font-mono tracking-wider">
                  {aiTestCode}
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(aiTestCode)}
                className="flex items-center gap-2 px-4 py-3 bg-[#101F36] text-white rounded hover:bg-[#1565c0] transition-colors text-[0.875rem] font-medium"
              >
                {aiTestCodeCopied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {aiTestCodeCopied ? 'COPIED' : 'COPY'}
              </button>
            </div>
            <p className="text-[0.75rem] text-[#616161] mt-3">
              Send this code in the Teams chat and ask the user to read it back to you aloud. This helps verify they are not an AI.
            </p>
          </div>

          {/* Verification Script */}
          <div className="border border-[#e0e0e0] rounded-lg p-6 mb-6">
            <h5 className="text-[1rem] font-semibold text-[#212121] mb-4">Verification Script</h5>
            <div className="space-y-4 text-[0.875rem]">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[#101F36] text-white flex items-center justify-center text-[0.75rem] flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="font-medium text-[#212121]">Introduction</p>
                  <p className="text-[#616161] mt-1">
                    "Hello, thank you for joining this verification call. I'm [Your Name] from Aretiico. This call should take about 10 minutes. Is now still a good time?"
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[#101F36] text-white flex items-center justify-center text-[0.75rem] flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="font-medium text-[#212121]">AI Detection Test</p>
                  <p className="text-[#616161] mt-1">
                    "I'm going to send you a 6-digit code in the chat. Can you please read it back to me out loud?"
                  </p>
                  <p className="text-[0.75rem] text-[#ffc107] mt-2">⚠ If the user cannot read the code correctly, flag this verification.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[#101F36] text-white flex items-center justify-center text-[0.75rem] flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="font-medium text-[#212121]">Identity Verification</p>
                  <p className="text-[#616161] mt-1">
                    "Can you please hold up your ID document to the camera? Make sure all four corners are visible."
                  </p>
                  <p className="text-[0.75rem] text-[#616161] mt-2">Verify the document matches the submitted image and the person on camera.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[#101F36] text-white flex items-center justify-center text-[0.75rem] flex-shrink-0">
                  4
                </div>
                <div>
                  <p className="font-medium text-[#212121]">Confirmation Questions</p>
                  <p className="text-[#616161] mt-1">
                    Ask the user to verbally confirm their full name, date of birth, and current address.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[#101F36] text-white flex items-center justify-center text-[0.75rem] flex-shrink-0">
                  5
                </div>
                <div>
                  <p className="font-medium text-[#212121]">Closing</p>
                  <p className="text-[#616161] mt-1">
                    "Thank you for your time. We'll review the recording and you'll hear from us within 1-2 business days."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Important Reminders */}
          <div className="bg-[#fafafa] border border-[#e0e0e0] rounded-lg p-4 mb-6">
            <p className="text-[0.75rem] font-medium text-[#212121] mb-2">Important Reminders</p>
            <ul className="text-[0.75rem] text-[#616161] space-y-1">
              <li>• Ensure the call is being recorded in Teams</li>
              <li>• Watch for signs of AI-generated video or deepfakes</li>
              <li>• Flag any suspicious behavior or inconsistencies</li>
              <li>• Take notes during the call if needed</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-[#e0e0e0] flex gap-3 justify-end">
            {!flagged && (
              <button
                onClick={() => setFlagged(true)}
                className="flex items-center gap-2 px-6 py-3 border border-[#ffc107] text-[#ffc107] rounded hover:bg-[#fff8e1] transition-colors text-[0.875rem] font-medium"
              >
                <Flag className="w-4 h-4" />
                FLAG FOR REVIEW
              </button>
            )}
            {!callStarted ? (
              <button
                onClick={handleStartCall}
                className="flex items-center gap-2 px-6 py-3 bg-[#00c853] text-white rounded hover:bg-[#00a844] transition-colors text-[0.875rem] font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                START CALL IN TEAMS
              </button>
            ) : (
              <button
                onClick={handleRecordResults}
                disabled={flagged && !flagComment.trim()}
                className="flex items-center gap-2 px-6 py-3 bg-[#101F36] text-white rounded hover:bg-[#1565c0] transition-colors text-[0.875rem] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle className="w-4 h-4" />
                RECORD RESULTS
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
