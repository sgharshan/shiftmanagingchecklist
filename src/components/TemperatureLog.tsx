import { Thermometer, Sun, Sunset, Moon } from 'lucide-react';
import { SectionCard } from './SectionCard';
import type { TemperatureLog as TempLogType, TemperatureReadings } from '../types';

interface TemperatureLogProps {
    temperatures: TempLogType;
    onUpdate: (appliance: keyof TempLogType, time: keyof TemperatureReadings, value: number | '') => void;
}

export function TemperatureLog({ temperatures, onUpdate }: TemperatureLogProps) {
    const appliances: { key: keyof TempLogType; label: string }[] = [
        { key: 'freezer1', label: 'Freezer 1' },
        { key: 'freezer2', label: 'Freezer 2' },
        { key: 'chiller', label: 'Chiller' },
        { key: 'drinksFridge', label: 'Drinks Fridge' },
        { key: 'alcoholFridge', label: 'Alcohol Fridge' },
    ];

    const timeSlots = [
        { key: 'morning', label: 'Morning', icon: <Sun className="w-3 h-3" /> },
        { key: 'afternoon', label: 'Afternoon', icon: <Sunset className="w-3 h-3" /> },
        { key: 'closing', label: 'Closing', icon: <Moon className="w-3 h-3" /> },
    ] as const;

    return (
        <SectionCard title="Temperature Monitoring" icon={<Thermometer className="w-5 h-5" />}>
            <div className="space-y-6">
                {appliances.map(({ key, label }) => (
                    <div key={key} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <h3 className="font-medium text-slate-700 mb-3 flex items-center gap-2">
                            <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                            {label}
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                            {timeSlots.map(({ key: timeKey, label: timeLabel, icon }) => (
                                <div key={timeKey}>
                                    <label className="flex items-center gap-1 text-[10px] font-medium text-slate-500 mb-1 uppercase">
                                        {icon} {timeLabel}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={temperatures[key][timeKey]}
                                            onChange={(e) => onUpdate(key, timeKey, e.target.value === '' ? '' : parseFloat(e.target.value))}
                                            className="w-full pl-2 pr-6 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                            placeholder="-"
                                        />
                                        <span className="absolute right-2 top-2 text-slate-400 text-xs">°</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </SectionCard>
    );
}
