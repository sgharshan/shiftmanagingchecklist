import { BarChart3, Clock, PoundSterling } from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { SectionCard } from './SectionCard';
import type { DailyRecord } from '../types';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface DashboardSummaryProps {
    data: DailyRecord;
}

export function DashboardSummary({ data }: DashboardSummaryProps) {
    const calculateBatchSold = (opening: number, closing: number, isFinished: boolean) => {
        if (isFinished) {
            return opening + 1;
        }
        return Math.max(0, opening - closing);
    };

    // Calculate Total Sales
    const totalSales = data.scratchCards.reduce((acc, card) => {
        const cardSold = card.batches.reduce((batchAcc, batch) => {
            return batchAcc + calculateBatchSold(batch.opening, batch.closing, batch.isFinished || false);
        }, 0);
        return acc + (cardSold * card.price);
    }, 0);

    // Calculate Total Hours
    const totalMinutes = data.staffShifts.reduce((acc, shift) => {
        if (!shift.startTime || !shift.endTime) return acc;
        const start = new Date(`1970-01-01T${shift.startTime}:00`);
        const end = new Date(`1970-01-01T${shift.endTime}:00`);
        const diffMs = end.getTime() - start.getTime();
        return acc + (diffMs > 0 ? diffMs / (1000 * 60) : 0);
    }, 0);

    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);

    // Chart Data
    const chartData = {
        labels: data.scratchCards.map(c => `Card ${c.id}`),
        datasets: [
            {
                label: 'Units Sold',
                data: data.scratchCards.map(c =>
                    c.batches.reduce((acc, b) => acc + calculateBatchSold(b.opening, b.closing, b.isFinished || false), 0)
                ),
                backgroundColor: 'rgba(59, 130, 246, 0.6)',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                }
            }
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
                <SectionCard title="Sales Overview" icon={<BarChart3 className="w-5 h-5" />}>
                    <div className="h-64">
                        <Bar options={options} data={chartData} />
                    </div>
                </SectionCard>
            </div>

            <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
                    <div className="p-4 bg-green-100 text-green-600 rounded-full">
                        <PoundSterling className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Total Revenue</p>
                        <h3 className="text-2xl font-bold text-slate-800">£{totalSales.toLocaleString()}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
                    <div className="p-4 bg-blue-100 text-blue-600 rounded-full">
                        <Clock className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Total Staff Hours</p>
                        <h3 className="text-2xl font-bold text-slate-800">{hours}h {minutes}m</h3>
                    </div>
                </div>
            </div>
        </div>
    );
}
