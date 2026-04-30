import { useState } from 'react';
import { Menu, Bell, Globe, User, Shield, FileText, Building2, CheckSquare, Mail, Home } from 'lucide-react';
import { WorkflowSelector, WorkflowType } from '../workflows/WorkflowSelector';

interface AppShellProps {
  children: React.ReactNode;
  currentWorkflow?: WorkflowType;
  onWorkflowChange?: (workflow: WorkflowType) => void;
  showPrototypeControls?: boolean;
}

export function AppShell({
  children,
  currentWorkflow,
  onWorkflowChange,
  showPrototypeControls = true,
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { icon: Home, label: 'Dashboard', active: false },
    { icon: Shield, label: 'Certificates', active: true },
    { icon: Building2, label: 'Organisations', active: false },
    { icon: CheckSquare, label: 'Verifications', active: false },
    { icon: FileText, label: 'Domains', active: false },
    { icon: Mail, label: 'Invites', active: false },
  ];

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
            {showPrototypeControls && currentWorkflow && onWorkflowChange && (
              <>
                <div className="h-8 w-px bg-[#e0e0e0] hidden md:block"></div>
                <div className="hidden md:flex items-center gap-4">
                  <span className="text-[0.75rem] text-[#616161] uppercase tracking-wide">Prototype:</span>
                  <WorkflowSelector
                    currentWorkflow={currentWorkflow}
                    onWorkflowChange={onWorkflowChange}
                  />
                </div>
              </>
            )}
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
        transition-transform duration-300 lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
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
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="pt-20 lg:pl-64">
        <div className="max-w-7xl mx-auto p-6">
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
