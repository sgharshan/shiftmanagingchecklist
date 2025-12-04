import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface SectionCardProps {
    title: string;
    children: ReactNode;
    className?: string;
    icon?: ReactNode;
}

export function SectionCard({ title, children, className, icon }: SectionCardProps) {
    return (
        <div className={twMerge("bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden", className)}>
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                {icon && <span className="text-blue-600">{icon}</span>}
                <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
            </div>
            <div className="p-6">
                {children}
            </div>
        </div>
    );
}
