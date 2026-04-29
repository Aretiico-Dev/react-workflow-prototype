import { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, Shield, AlertCircle, Flag, X } from 'lucide-react';

interface AutomatedTasksStepProps {
  onNext: (flag?: { comment: string }) => void;
}

type TaskStatus = 'pending' | 'running' | 'complete' | 'failed';

interface Task {
  id: string;
  name: string;
  description: string;
  status: TaskStatus;
}

export function AutomatedTasksStep({ onNext }: AutomatedTasksStepProps) {
  const [flagged, setFlagged] = useState(false);
  const [flagComment, setFlagComment] = useState('');
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', name: 'Identity Database Check', description: 'Verifying identity against government databases', status: 'pending' },
    { id: '2', name: 'Document Authenticity', description: 'Analyzing document for signs of forgery or tampering', status: 'pending' },
    { id: '3', name: 'Address Verification', description: 'Validating address against postal records', status: 'pending' },
    { id: '4', name: 'Sanctions Screening', description: 'Checking against sanctions and watchlists', status: 'pending' },
    { id: '5', name: 'PEP Check', description: 'Politically Exposed Person screening', status: 'pending' },
  ]);

  useEffect(() => {
    // Simulate automated tasks running in sequence
    const runTasks = async () => {
      for (let i = 0; i < tasks.length; i++) {
        // Set current task to running
        setTasks(prev => prev.map((task, idx) =>
          idx === i ? { ...task, status: 'running' as TaskStatus } : task
        ));

        // Wait for simulated task duration
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Set current task to complete
        setTasks(prev => prev.map((task, idx) =>
          idx === i ? { ...task, status: 'complete' as TaskStatus } : task
        ));
      }
    };

    runTasks();
  }, []);

  const allComplete = tasks.every(task => task.status === 'complete');

  const handleContinue = () => {
    if (flagged && flagComment.trim()) {
      onNext({ comment: flagComment });
    } else if (!flagged) {
      onNext();
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

      <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)] p-12">
        <div className="text-center max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-[#e3f2fd] rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <Shield className="w-10 h-10 text-[#101F36]" />
            {!allComplete && (
              <Loader2 className="w-24 h-24 text-[#101F36] absolute animate-spin opacity-20" />
            )}
          </div>

          <h4 className="text-[1.5rem] font-semibold text-[#212121] mb-3">
            {allComplete ? 'Automated Checks Complete' : 'Running Automated Checks'}
          </h4>
          <p className="text-[0.875rem] text-[#616161] mb-8">
            {allComplete
              ? 'All automated verification tasks have completed successfully'
              : 'Automated verification tasks are running in the background'}
          </p>

          {/* Tasks List */}
          <div className="space-y-3 mb-8">
            {tasks.map(task => (
              <div
                key={task.id}
                className={`flex items-start gap-3 p-4 border rounded-lg text-left transition-colors ${
                  task.status === 'complete'
                    ? 'border-[#00c853] bg-[#b9f6ca]/30'
                    : task.status === 'running'
                    ? 'border-[#101F36] bg-[#e3f2fd]'
                    : 'border-[#e0e0e0] bg-[#fafafa]'
                }`}
              >
                {task.status === 'complete' && (
                  <CheckCircle2 className="w-5 h-5 text-[#00c853] flex-shrink-0 mt-0.5" />
                )}
                {task.status === 'running' && (
                  <Loader2 className="w-5 h-5 text-[#101F36] flex-shrink-0 mt-0.5 animate-spin" />
                )}
                {task.status === 'pending' && (
                  <div className="w-5 h-5 rounded-full border-2 border-[#e0e0e0] flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="text-[0.875rem] font-medium text-[#212121]">{task.name}</p>
                  <p className="text-[0.75rem] text-[#616161] mt-1">{task.description}</p>
                </div>
              </div>
            ))}
          </div>

          {allComplete && (
            <div className="flex items-start gap-3 p-4 bg-[#e3f2fd] border border-[#90caf9] rounded text-left mb-6">
              <AlertCircle className="w-5 h-5 text-[#101F36] mt-0.5 flex-shrink-0" />
              <div className="text-[0.75rem] text-[#212121]">
                <strong>All checks passed</strong>
                <p className="mt-2">
                  No issues were detected during automated verification. You can proceed to manual tasks.
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          {allComplete && (
            <div className="flex gap-3 justify-center">
              {!flagged && (
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
                disabled={flagged && !flagComment.trim()}
                className="px-6 py-3 bg-[#101F36] text-white rounded hover:bg-[#1565c0] transition-colors text-[0.875rem] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                CONTINUE
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
