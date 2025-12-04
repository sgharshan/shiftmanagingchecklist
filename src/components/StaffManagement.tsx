import { Users, Clock, Plus, Trash2 } from 'lucide-react';
import { SectionCard } from './SectionCard';
import type { StaffShift } from '../types';

interface StaffManagementProps {
    shifts: StaffShift[];
    onUpdate: (index: number, field: keyof StaffShift, value: string) => void;
    onAdd: () => void;
    onRemove: (index: number) => void;
}

export function StaffManagement({ shifts, onUpdate, onAdd, onRemove }: StaffManagementProps) {
    const calculateDuration = (start: string, end: string) => {
        if (!start || !end) return null;
        const startTime = new Date(`1970-01-01T${start}:00`);
        const endTime = new Date(`1970-01-01T${end}:00`);
        const diffMs = endTime.getTime() - startTime.getTime();
        if (diffMs < 0) return "Invalid";
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    };

    return (
        <SectionCard title="Staff Information" icon={<Users className="w-5 h-5" />}>
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {shifts.map((shift, index) => (
                        <div key={shift.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200 relative group">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                                        {index + 1}
                                    </div>
                                    <span className="font-medium text-slate-700 text-sm">Staff Member</span>
                                </div>
                                <button
                                    onClick={() => onRemove(index)}
                                    className="text-slate-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={shift.name}
                                        onChange={(e) => onUpdate(index, 'name', e.target.value)}
                                        placeholder="Enter name"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">Start</label>
                                        <input
                                            type="time"
                                            value={shift.startTime}
                                            onChange={(e) => onUpdate(index, 'startTime', e.target.value)}
                                            className="w-full px-2 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">End</label>
                                        <input
                                            type="time"
                                            value={shift.endTime}
                                            onChange={(e) => onUpdate(index, 'endTime', e.target.value)}
                                            className="w-full px-2 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-slate-600 bg-white p-2 rounded border border-slate-100">
                                    <Clock className="w-4 h-4 text-slate-400" />
                                    <span className="font-medium">
                                        {calculateDuration(shift.startTime, shift.endTime) || '--'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={onAdd}
                    className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Add Staff Member
                </button>
            </div>
        </SectionCard>
    );
}
