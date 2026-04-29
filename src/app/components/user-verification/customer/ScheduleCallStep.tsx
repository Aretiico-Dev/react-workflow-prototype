import { useState } from 'react';
import { ChevronLeft, ChevronRight, Video, Clock, RefreshCw, AlertCircle, Shield } from 'lucide-react';

interface ScheduleCallStepProps {
  onNext: (scheduledDate: string, scheduledTime: string) => void;
  onCancel: () => void;
}

type CallState = 'scheduling' | 'scheduled';

export function ScheduleCallStep({ onNext, onCancel }: ScheduleCallStepProps) {
  const [callState, setCallState] = useState<CallState>('scheduling');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Mock available time slots for selected date
  const availableSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateClick = (day: number) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selected >= today) {
      setSelectedDate(selected);
      setSelectedTime(null); // Reset time when date changes
    }
  };

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      setCallState('scheduled');
    }
  };

  const handleReschedule = () => {
    setCallState('scheduling');
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleJoinCall = () => {
    if (selectedDate && selectedTime) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      onNext(dateStr, selectedTime);
    }
  };

  const isDateDisabled = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isDateSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth.getMonth() &&
      selectedDate.getFullYear() === currentMonth.getFullYear()
    );
  };

  // Scheduling view
  if (callState === 'scheduling') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)] overflow-hidden">
          <div className="grid md:grid-cols-[280px_1fr] min-h-[500px]">
            {/* Left Sidebar */}
            <div className="bg-[#fafafa] border-r border-[#e0e0e0] p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#101F36] rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-[0.875rem] font-semibold text-[#212121]">Aretiico</span>
              </div>

              <h4 className="text-[1.125rem] font-semibold text-[#212121] mb-4">
                Identity Verification Call
              </h4>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[0.875rem] text-[#616161]">
                  <Clock className="w-4 h-4" />
                  <span>10 minutes</span>
                </div>
                <div className="flex items-center gap-2 text-[0.875rem] text-[#616161]">
                  <Video className="w-4 h-4" />
                  <span>Microsoft Teams</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[#e0e0e0]">
                <p className="text-[0.75rem] text-[#616161] mb-3">What to bring:</p>
                <ul className="text-[0.75rem] text-[#212121] space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-[#00c853]">✓</span>
                    <span>Your government-issued ID</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00c853]">✓</span>
                    <span>Good lighting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00c853]">✓</span>
                    <span>Quiet environment</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Content */}
            <div className="p-6">
              <div className="max-w-2xl mx-auto">
                <h5 className="text-[0.875rem] font-medium text-[#212121] mb-4">Select a Date & Time</h5>

                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={handlePreviousMonth}
                    className="p-2 hover:bg-[#fafafa] rounded transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-[#616161]" />
                  </button>
                  <span className="text-[0.875rem] font-semibold text-[#212121]">
                    {currentMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                  </span>
                  <button
                    onClick={handleNextMonth}
                    className="p-2 hover:bg-[#fafafa] rounded transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-[#616161]" />
                  </button>
                </div>

                {/* Selected Date Display */}
                {selectedDate && (
                  <div className="mb-4 text-[0.875rem] text-[#101F36] font-medium">
                    {selectedDate.toLocaleDateString('en-GB', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </div>
                )}

                <div className="grid grid-cols-[2fr_1fr] gap-6">
                  {/* Calendar */}
                  <div>
                    {/* Day Headers */}
                    <div className="grid grid-cols-7 mb-2">
                      {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                        <div key={day} className="text-center text-[0.625rem] font-medium text-[#616161] py-1">
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Calendar Days */}
                    <div className="grid grid-cols-7 gap-1">
                      {/* Empty cells for days before month starts */}
                      {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                        <div key={`empty-${i}`} />
                      ))}

                      {/* Days of the month */}
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const disabled = isDateDisabled(day);
                        const selected = isDateSelected(day);

                        return (
                          <button
                            key={day}
                            onClick={() => handleDateClick(day)}
                            disabled={disabled}
                            className={`
                              aspect-square flex items-center justify-center text-[0.875rem] rounded transition-colors
                              ${disabled ? 'text-[#e0e0e0] cursor-not-allowed' : 'text-[#212121] hover:bg-[#e3f2fd] cursor-pointer'}
                              ${selected ? 'bg-[#101F36] text-white hover:bg-[#1565c0]' : ''}
                            `}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>

                    {/* Timezone */}
                    <div className="mt-4 pt-4 border-t border-[#e0e0e0]">
                      <p className="text-[0.75rem] text-[#616161]">
                        Time zone: Europe/London (GMT+1)
                      </p>
                    </div>
                  </div>

                  {/* Time Slots */}
                  <div>
                    {selectedDate ? (
                      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                        {availableSlots.map(slot => (
                          <button
                            key={slot}
                            onClick={() => setSelectedTime(slot)}
                            className={`
                              w-full px-4 py-2.5 border rounded text-[0.875rem] transition-colors
                              ${selectedTime === slot
                                ? 'bg-[#101F36] text-white border-[#101F36]'
                                : 'bg-white text-[#101F36] border-[#101F36] hover:bg-[#e3f2fd]'
                              }
                            `}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-[0.75rem] text-[#616161] py-8">
                        Select a date to see available times
                      </div>
                    )}
                  </div>
                </div>

                {/* Confirm Button */}
                {selectedDate && selectedTime && (
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleConfirm}
                      className="px-6 py-2.5 bg-[#101F36] text-white rounded hover:bg-[#1565c0] transition-colors text-[0.875rem] font-medium"
                    >
                      CONFIRM
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Cancel Button */}
        <div className="flex justify-center">
          <button
            onClick={onCancel}
            className="px-6 py-3 border border-[#e0e0e0] rounded hover:bg-[#fafafa] transition-colors text-[0.875rem] font-medium"
          >
            CANCEL VERIFICATION
          </button>
        </div>
      </div>
    );
  }

  // Scheduled view
  return (
    <div className="space-y-6">
      <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)] p-12">
        <div className="text-center max-w-lg mx-auto">
          <div className="w-16 h-16 bg-[#b9f6ca] rounded-full flex items-center justify-center mx-auto mb-4">
            <Video className="w-8 h-8 text-[#00c853]" />
          </div>

          <h4 className="text-[1.125rem] font-semibold text-[#212121] mb-2">
            Video Call Scheduled
          </h4>
          <p className="text-[0.875rem] text-[#616161] mb-6">
            Your verification call has been successfully scheduled
          </p>

          {/* Scheduled Details */}
          <div className="bg-[#fafafa] border border-[#e0e0e0] rounded-lg p-6 mb-6">
            <p className="text-[1rem] font-semibold text-[#212121] mb-2">
              {selectedDate?.toLocaleDateString('en-GB', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <p className="text-[0.875rem] text-[#616161]">{selectedTime}</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleJoinCall}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#00c853] text-white rounded hover:bg-[#00a844] transition-colors text-[0.875rem] font-medium"
            >
              <Video className="w-5 h-5" />
              JOIN VIDEO CALL
            </button>

            <button
              onClick={handleReschedule}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-[#e0e0e0] rounded hover:bg-[#fafafa] transition-colors text-[0.875rem] font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              RESCHEDULE
            </button>
          </div>

          {/* Reminder */}
          <div className="flex items-start gap-3 p-4 bg-[#e3f2fd] border border-[#90caf9] rounded mt-6 text-left">
            <AlertCircle className="w-5 h-5 text-[#101F36] mt-0.5 flex-shrink-0" />
            <p className="text-[0.75rem] text-[#212121]">
              You'll receive an email reminder 24 hours before your call. Please ensure you have your ID document ready.
            </p>
          </div>
        </div>
      </div>

      {/* Cancel Button */}
      <div className="flex justify-center">
        <button
          onClick={onCancel}
          className="px-6 py-3 border border-[#e0e0e0] rounded hover:bg-[#fafafa] transition-colors text-[0.875rem] font-medium"
        >
          CANCEL VERIFICATION
        </button>
      </div>
    </div>
  );
}
