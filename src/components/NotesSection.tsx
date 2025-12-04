import { ClipboardList } from 'lucide-react';
import { SectionCard } from './SectionCard';

interface NotesSectionProps {
    notes: string;
    onUpdate: (notes: string) => void;
}

export function NotesSection({ notes, onUpdate }: NotesSectionProps) {
    return (
        <SectionCard title="Manager Notes" icon={<ClipboardList className="w-5 h-5" />}>
            <textarea
                value={notes}
                onChange={(e) => onUpdate(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-y"
                placeholder="Write any important notes, incidents, or reminders for the next shift..."
            />
        </SectionCard>
    );
}
