import { X, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface NodeCustomizerProps {
  node: any;
  onUpdate: (data: any) => void;
  onDelete: () => void;
  onClose: () => void;
}

export function NodeCustomizer({ node, onUpdate, onDelete, onClose }: NodeCustomizerProps) {
  const [label, setLabel] = useState(node.data.label);
  const [description, setDescription] = useState(node.data.config?.description || '');
  const [emailTo, setEmailTo] = useState(node.data.config?.emailTo || '');
  const [emailSubject, setEmailSubject] = useState(node.data.config?.emailSubject || '');
  const [message, setMessage] = useState(node.data.config?.message || '');
  const [slackChannel, setSlackChannel] = useState(node.data.config?.slackChannel || '');
  const [phoneNumber, setPhoneNumber] = useState(node.data.config?.phoneNumber || '');
  const [meetingLink, setMeetingLink] = useState(node.data.config?.meetingLink || '');
  const [location, setLocation] = useState(node.data.config?.location || '');
  const [formUrl, setFormUrl] = useState(node.data.config?.formUrl || '');
  const [approvers, setApprovers] = useState(node.data.config?.approvers || '');
  const [conditionType, setConditionType] = useState(node.data.config?.conditionType || 'equals');
  const [conditionValue, setConditionValue] = useState(node.data.config?.conditionValue || '');
  const [triggerType, setTriggerType] = useState(node.data.config?.triggerType || 'manual');
  const [scheduleTime, setScheduleTime] = useState(node.data.config?.scheduleTime || '');
  const [webhookUrl, setWebhookUrl] = useState(node.data.config?.webhookUrl || '');

  useEffect(() => {
    const config: any = { description };

    if (node.data.nodeType === 'trigger') {
      config.triggerType = triggerType;
      config.scheduleTime = scheduleTime;
      config.webhookUrl = webhookUrl;
    } else if (node.data.nodeType === 'email') {
      config.emailTo = emailTo;
      config.emailSubject = emailSubject;
      config.message = message;
    } else if (node.data.nodeType === 'sms') {
      config.phoneNumber = phoneNumber;
      config.message = message;
    } else if (node.data.nodeType === 'slack') {
      config.slackChannel = slackChannel;
      config.message = message;
    } else if (node.data.nodeType === 'online-meeting') {
      config.meetingLink = meetingLink;
    } else if (node.data.nodeType === 'offline-meeting') {
      config.location = location;
    } else if (node.data.nodeType === 'webform') {
      config.formUrl = formUrl;
    } else if (node.data.nodeType === 'approval') {
      config.approvers = approvers;
    } else if (node.data.nodeType === 'condition') {
      config.conditionType = conditionType;
      config.conditionValue = conditionValue;
    }

    onUpdate({ label, config });
  }, [label, description, emailTo, emailSubject, message, slackChannel, phoneNumber, meetingLink, location, formUrl, approvers, conditionType, conditionValue, triggerType, scheduleTime, webhookUrl, node.data.nodeType, onUpdate]);

  return (
    <div className="w-80 border-l border-gray-200 bg-white overflow-y-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h3>Customize Node</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Label</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            rows={2}
          />
        </div>

        {node.data.nodeType === 'trigger' && (
          <>
            <div>
              <label className="block text-sm mb-1">Trigger Type</label>
              <select
                value={triggerType}
                onChange={(e) => setTriggerType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              >
                <option value="manual">Manual Start</option>
                <option value="scheduled">Scheduled</option>
                <option value="webhook">Webhook</option>
                <option value="event">Event-based</option>
              </select>
            </div>

            {triggerType === 'scheduled' && (
              <div>
                <label className="block text-sm mb-1">Schedule</label>
                <input
                  type="text"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  placeholder="e.g., Daily at 9:00 AM"
                />
              </div>
            )}

            {triggerType === 'webhook' && (
              <div>
                <label className="block text-sm mb-1">Webhook URL</label>
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  placeholder="https://..."
                />
              </div>
            )}
          </>
        )}

        {node.data.nodeType === 'email' && (
          <>
            <div>
              <label className="block text-sm mb-1">To</label>
              <input
                type="email"
                value={emailTo}
                onChange={(e) => setEmailTo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                placeholder="recipient@example.com"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Subject</label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                rows={3}
              />
            </div>
          </>
        )}

        {node.data.nodeType === 'sms' && (
          <>
            <div>
              <label className="block text-sm mb-1">Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                placeholder="+1234567890"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                rows={3}
              />
            </div>
          </>
        )}

        {node.data.nodeType === 'slack' && (
          <>
            <div>
              <label className="block text-sm mb-1">Channel</label>
              <input
                type="text"
                value={slackChannel}
                onChange={(e) => setSlackChannel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                placeholder="#general"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                rows={3}
              />
            </div>
          </>
        )}

        {node.data.nodeType === 'online-meeting' && (
          <div>
            <label className="block text-sm mb-1">Meeting Link</label>
            <input
              type="url"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              placeholder="https://zoom.us/..."
            />
          </div>
        )}

        {node.data.nodeType === 'offline-meeting' && (
          <div>
            <label className="block text-sm mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              placeholder="Conference Room A"
            />
          </div>
        )}

        {node.data.nodeType === 'webform' && (
          <div>
            <label className="block text-sm mb-1">Form URL</label>
            <input
              type="url"
              value={formUrl}
              onChange={(e) => setFormUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              placeholder="https://..."
            />
          </div>
        )}

        {node.data.nodeType === 'approval' && (
          <div>
            <label className="block text-sm mb-1">Approvers</label>
            <input
              type="text"
              value={approvers}
              onChange={(e) => setApprovers(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              placeholder="john@example.com, jane@example.com"
            />
          </div>
        )}

        {node.data.nodeType === 'condition' && (
          <>
            <div>
              <label className="block text-sm mb-1">Condition Type</label>
              <select
                value={conditionType}
                onChange={(e) => setConditionType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              >
                <option value="equals">Equals</option>
                <option value="not-equals">Not Equals</option>
                <option value="greater-than">Greater Than</option>
                <option value="less-than">Less Than</option>
                <option value="contains">Contains</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Value</label>
              <input
                type="text"
                value={conditionValue}
                onChange={(e) => setConditionValue(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
          </>
        )}

        <button
          onClick={onDelete}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100"
        >
          <Trash2 className="w-4 h-4" />
          Delete Node
        </button>
      </div>
    </div>
  );
}
