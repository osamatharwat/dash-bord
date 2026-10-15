import React, { useState } from 'react';
import { useIntelligence } from '../../context/IntelligenceContext';
import { CommitteeCategory, ReportingCadence } from '../../types';
import { Plus, CheckCircle2 } from 'lucide-react';

export const AddCommitteeModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { addCommittee } = useIntelligence();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState<CommitteeCategory>('Operations');
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [memberCount, setMemberCount] = useState<number>(10);
  const [description, setDescription] = useState('');
  const [reportingCadence, setReportingCadence] = useState<ReportingCadence>('Weekly');
  const [meetingDay, setMeetingDay] = useState('Sundays 18:00');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim() || !leadName.trim()) return;

    addCommittee({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      category,
      leadName: leadName.trim(),
      leadEmail: leadEmail.trim() || `${code.toLowerCase()}@aliens-activity.org`,
      memberCount: Number(memberCount) || 1,
      description: description.trim() || `${name} committee operational governance`,
      reportingCadence,
      meetingDay,
      status: 'On Track'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-semibold text-white">Register New ALIENS Committee</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Add a new functional committee to the organization registry without code changes.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-sm">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="my-4 space-y-4 overflow-y-auto pr-1 text-xs">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-1">
              <label className="text-slate-300 font-medium">Committee Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Human Resources"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Code *</label>
              <input
                type="text"
                required
                maxLength={4}
                placeholder="HR"
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono uppercase focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as CommitteeCategory)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500 cursor-pointer"
              >
                <option value="Operations">Operations</option>
                <option value="Communications">Communications</option>
                <option value="Strategy & Data">Strategy & Data</option>
                <option value="Logistics & Finance">Logistics & Finance</option>
                <option value="Community">Community</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Reporting Cadence</label>
              <select
                value={reportingCadence}
                onChange={e => setReportingCadence(e.target.value as ReportingCadence)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500 cursor-pointer"
              >
                <option value="Weekly">Weekly</option>
                <option value="Bi-Weekly">Bi-Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Per Event">Per Event</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Lead Officer Name *</label>
              <input
                type="text"
                required
                placeholder="Full Name"
                value={leadName}
                onChange={e => setLeadName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Active Headcount</label>
              <input
                type="number"
                min="1"
                max="100"
                value={memberCount}
                onChange={e => setMemberCount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Lead Email</label>
              <input
                type="email"
                placeholder="lead@aliens-activity.org"
                value={leadEmail}
                onChange={e => setLeadEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Weekly Sync Schedule</label>
              <input
                type="text"
                placeholder="e.g. Mondays 19:00"
                value={meetingDay}
                onChange={e => setMeetingDay(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-medium">Mandate & Operational Scope</label>
            <textarea
              rows={2}
              placeholder="Primary responsibilities and deliverable workflows..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-semibold text-slate-900 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Committee</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
