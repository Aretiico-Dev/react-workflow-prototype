import { useState } from 'react';
import { Menu, Bell, Globe, User, Shield, FileText, Building2, CheckSquare, Mail, Home } from 'lucide-react';
import { workflows, WorkflowType } from '../workflows/WorkflowSelector';

interface AppShellProps {
  children: React.ReactNode;
  currentWorkflow?: WorkflowType;
  onWorkflowChange?: (workflow: WorkflowType) => void;
  showPrototypeControls?: boolean;
  fullWidthContent?: boolean;
}

export function AppShell({
  children,
  currentWorkflow,
  onWorkflowChange,
  showPrototypeControls = true,
  fullWidthContent = false,
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const defaultNavItems = [
    { icon: Home, label: 'Dashboard', active: false },
    { icon: Shield, label: 'Certificates', active: true },
    { icon: Building2, label: 'Organisations', active: false },
    { icon: CheckSquare, label: 'Verifications', active: false },
    { icon: FileText, label: 'Domains', active: false },
    { icon: Mail, label: 'Invites', active: false },
  ];
  const showWorkflowNav = showPrototypeControls && currentWorkflow && onWorkflowChange;

  const handleWorkflowChange = (workflow: WorkflowType) => {
    onWorkflowChange?.(workflow);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Top App Bar */}
      <header className="h-20 bg-white border-b border-[#e0e0e0] fixed top-0 left-0 right-0 z-30">
        <div className="h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-[#101F36]" />
              <span className="text-xl font-semibold text-[#101F36]" style={{ fontFamily: 'Titillium Web, sans-serif' }}>
                Aretiico
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full relative">
              <Bell className="w-5 h-5 text-[#616161]" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#f44336] rounded-full"></span>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Globe className="w-5 h-5 text-[#616161]" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <User className="w-5 h-5 text-[#616161]" />
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`
        fixed top-20 left-0 bottom-0 w-64 bg-white border-r border-[#e0e0e0] z-20
        overflow-y-auto overscroll-contain transition-transform duration-300 lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <nav className="p-4 pb-8 space-y-1">
          {showWorkflowNav ? (
            <>
              <div className="px-4 pb-2 text-[0.75rem] font-semibold uppercase tracking-wide text-[#616161]">
                Prototypes
              </div>
              {workflows.map((workflow) => {
                const Icon = workflow.icon;
                const active = workflow.id === currentWorkflow;

                return (
                  <button
                    key={workflow.id}
                    type="button"
                    onClick={() => handleWorkflowChange(workflow.id)}
                    aria-current={active ? 'page' : undefined}
                    className={`
                      w-full flex items-start gap-3 px-4 py-3 rounded text-left transition-colors
                      ${active
                        ? 'bg-[#e3f2fd] text-[#101F36] font-medium'
                        : 'text-[#616161] hover:bg-gray-50'
                      }
                    `}
                    style={{ fontFamily: 'Titillium Web, sans-serif' }}
                  >
                    <Icon className="mt-0.5 w-5 h-5 shrink-0" />
                    <span className="min-w-0">
                      <span className="block text-sm leading-5">{workflow.title}</span>
                      <span className={`block text-[0.75rem] leading-4 ${active ? 'text-[#455a64]' : 'text-[#757575]'}`}>
                        {workflow.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </>
          ) : (
            defaultNavItems.map((item) => (
              <button
                key={item.label}
                type="button"
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded text-left transition-colors
                  ${item.active
                    ? 'bg-[#e3f2fd] text-[#101F36] font-medium'
                    : 'text-[#616161] hover:bg-gray-50'
                  }
                `}
                style={{ fontFamily: 'Titillium Web, sans-serif' }}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </button>
            ))
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="pt-20 lg:pl-64">
        <div className={fullWidthContent ? 'w-full' : 'max-w-7xl mx-auto p-6'}>
          {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
