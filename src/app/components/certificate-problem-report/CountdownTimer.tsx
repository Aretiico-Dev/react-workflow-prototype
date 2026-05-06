import { useEffect, useMemo, useState } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  targetAt: string;
  label: string;
  expiredLabel: string;
  tone?: 'normal' | 'warning';
}

function getRemaining(targetAt: string) {
  const remainingMs = new Date(targetAt).getTime() - Date.now();
  const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    expired: remainingMs <= 0,
    label: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
  };
}

export function CountdownTimer({ targetAt, label, expiredLabel, tone = 'normal' }: CountdownTimerProps) {
  const [now, setNow] = useState(Date.now());
  const remaining = useMemo(() => getRemaining(targetAt), [targetAt, now]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className={`rounded border p-4 ${
      tone === 'warning'
        ? 'border-[#ffc107] bg-[#fff8e1]'
        : 'border-[#90caf9] bg-[#e3f2fd]'
    }`}>
      <div className="flex items-center gap-3">
        <Clock className={`h-5 w-5 ${tone === 'warning' ? 'text-[#c77800]' : 'text-[#101F36]'}`} />
        <div>
          <p className="text-[0.75rem] font-medium uppercase tracking-wide text-[#616161]">
            {remaining.expired ? expiredLabel : label}
          </p>
          <p className="text-[1.25rem] font-semibold text-[#212121]">{remaining.label}</p>
        </div>
      </div>
    </div>
  );
}
