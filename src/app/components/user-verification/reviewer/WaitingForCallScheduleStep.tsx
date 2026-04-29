import { useEffect } from 'react';
import { Calendar, Loader2, AlertCircle } from 'lucide-react';

interface WaitingForCallScheduleStepProps {
  onScheduled: () => void;
}

export function WaitingForCallScheduleStep({ onScheduled }: WaitingForCallScheduleStepProps) {
  useEffect(() => {
    // Simulate user scheduling call (5 seconds for demo)
    const timer = setTimeout(() => {
      onScheduled();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onScheduled]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)] p-12">
        <div className="text-center max-w-lg mx-auto">
          <div className="w-20 h-20 bg-[#e3f2fd] rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <Calendar className="w-10 h-10 text-[#101F36]" />
            <Loader2 className="w-24 h-24 text-[#101F36] absolute animate-spin opacity-20" />
          </div>

          <h4 className="text-[1.5rem] font-semibold text-[#212121] mb-3">
            Waiting for User to Schedule Call
          </h4>
          <p className="text-[0.875rem] text-[#616161] mb-8">
            The user has been notified and can now schedule their verification video call. You'll be able to join once they've selected a time.
          </p>

          {/* Info Box */}
          <div className="flex items-start gap-3 p-4 bg-[#e3f2fd] border border-[#90caf9] rounded text-left">
            <AlertCircle className="w-5 h-5 text-[#101F36] mt-0.5 flex-shrink-0" />
            <div className="text-[0.75rem] text-[#212121]">
              <strong>What happens next?</strong>
              <p className="mt-2">
                Once the user schedules their video call, you'll receive an email notification with the meeting details.
                This page will automatically update when a time has been selected.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
