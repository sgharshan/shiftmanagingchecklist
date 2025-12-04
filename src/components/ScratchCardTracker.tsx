import { Ticket, Plus, Trash2 } from 'lucide-react';
import { SectionCard } from './SectionCard';
import type { ScratchCard } from '../types';

interface ScratchCardTrackerProps {
    cards: ScratchCard[];
    onUpdate: (cardIndex: number, batchIndex: number, field: 'opening' | 'closing' | 'isFinished', value: number | boolean) => void;
    onAddBatch: (cardIndex: number) => void;
    onRemoveBatch: (cardIndex: number, batchIndex: number) => void;
}

export function ScratchCardTracker({ cards, onUpdate, onAddBatch, onRemoveBatch }: ScratchCardTrackerProps) {
    const calculateBatchSold = (opening: number, closing: number, isFinished: boolean) => {
        if (isFinished) {
            return opening + 1;
        }
        return Math.max(0, opening - closing);
    };

    const calculateCardTotal = (card: ScratchCard) => {
        return card.batches.reduce((acc, batch) => acc + calculateBatchSold(batch.opening, batch.closing, batch.isFinished || false), 0) * card.price;
    };

    const calculateGrandTotal = () => {
        return cards.reduce((acc, card) => acc + calculateCardTotal(card), 0);
    };

    return (
        <SectionCard title="Scratch Card Sales" icon={<Ticket className="w-5 h-5" />}>
            <div className="space-y-4">
                {cards.map((card, cardIndex) => {
                    const cardTotal = calculateCardTotal(card);

                    return (
                        <div key={card.id} className="bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
                            {/* Header */}
                            <div className="bg-white px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-slate-800">#{card.id}</span>
                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">£{card.price}</span>
                                </div>
                                <div className="text-sm font-bold text-blue-600">
                                    Total: £{cardTotal}
                                </div>
                            </div>

                            {/* Batches */}
                            <div className="p-3 space-y-3">
                                {card.batches.map((batch, batchIndex) => {
                                    const sold = calculateBatchSold(batch.opening, batch.closing, batch.isFinished || false);
                                    return (
                                        <div key={batch.id} className="bg-white p-3 rounded border border-slate-200 shadow-sm relative">
                                            {card.batches.length > 1 && (
                                                <div className="absolute -top-2 -right-2">
                                                    <button
                                                        onClick={() => onRemoveBatch(cardIndex, batchIndex)}
                                                        className="bg-red-100 text-red-500 p-1 rounded-full hover:bg-red-200"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            )}

                                            <div className="grid grid-cols-2 gap-3 mb-3">
                                                <div>
                                                    <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Opening</label>
                                                    <input
                                                        type="number"
                                                        value={batch.opening || ''}
                                                        onChange={(e) => onUpdate(cardIndex, batchIndex, 'opening', parseInt(e.target.value) || 0)}
                                                        className="w-full px-2 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                                        placeholder="0"
                                                    />
                                                </div>
                                                <div className={batch.isFinished ? 'opacity-50' : ''}>
                                                    <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Closing</label>
                                                    <input
                                                        type="number"
                                                        value={batch.closing || ''}
                                                        onChange={(e) => onUpdate(cardIndex, batchIndex, 'closing', parseInt(e.target.value) || 0)}
                                                        disabled={batch.isFinished}
                                                        className="w-full px-2 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm disabled:bg-slate-100"
                                                        placeholder="0"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={batch.isFinished || false}
                                                        onChange={(e) => onUpdate(cardIndex, batchIndex, 'isFinished', e.target.checked)}
                                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                                                    />
                                                    <span className="text-xs text-slate-600 font-medium">Pack Empty?</span>
                                                </label>

                                                <div className="text-right">
                                                    <span className="text-[10px] text-slate-400 uppercase mr-1">Sold</span>
                                                    <span className="font-bold text-slate-800 text-lg">{sold}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                <button
                                    onClick={() => onAddBatch(cardIndex)}
                                    className="w-full py-2 border border-dashed border-blue-300 text-blue-600 rounded hover:bg-blue-50 text-sm font-medium flex items-center justify-center gap-1"
                                >
                                    <Plus className="w-4 h-4" /> Add Refill Batch
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 p-4 bg-slate-50 rounded-lg flex justify-between items-center border border-slate-200">
                <span className="font-bold text-slate-700">Total Sales</span>
                <span className="font-bold text-blue-700 text-xl">£{calculateGrandTotal()}</span>
            </div>
        </SectionCard>
    );
}
