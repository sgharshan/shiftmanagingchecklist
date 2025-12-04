import { useState, useEffect } from 'react';
import type { DailyRecord, StaffShift, ScratchCard, TemperatureLog, TemperatureReadings } from '../types';

const INITIAL_SCRATCH_CARDS: ScratchCard[] = Array.from({ length: 20 }, (_, i) => {
    const id = i + 1;
    let price = 5;
    if (id >= 9) price = 3;
    if (id >= 14) price = 2;
    if (id >= 19) price = 1;
    return {
        id,
        price,
        batches: [{ id: crypto.randomUUID(), opening: 0, closing: 0, isFinished: false }]
    };
});

const INITIAL_TEMPS: TemperatureReadings = {
    morning: '',
    afternoon: '',
    closing: ''
};

const INITIAL_STATE: DailyRecord = {
    date: new Date().toISOString().split('T')[0],
    staffShifts: [
        { id: crypto.randomUUID(), name: '', startTime: '', endTime: '' },
        { id: crypto.randomUUID(), name: '', startTime: '', endTime: '' },
        { id: crypto.randomUUID(), name: '', startTime: '', endTime: '' },
    ],
    scratchCards: INITIAL_SCRATCH_CARDS,
    temperatures: {
        freezer1: { ...INITIAL_TEMPS },
        freezer2: { ...INITIAL_TEMPS },
        chiller: { ...INITIAL_TEMPS },
        drinksFridge: { ...INITIAL_TEMPS },
        alcoholFridge: { ...INITIAL_TEMPS },
    },
    notes: '',
};

export function useShopData() {
    const [data, setData] = useState<DailyRecord>(() => {
        const saved = localStorage.getItem('shopData');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Migration checks
                // 1. Check if temps are objects (new) or numbers (old)
                if (typeof parsed.temperatures?.freezer1 !== 'object') {
                    return INITIAL_STATE;
                }
                return parsed;
            } catch (e) {
                return INITIAL_STATE;
            }
        }
        return INITIAL_STATE;
    });

    useEffect(() => {
        localStorage.setItem('shopData', JSON.stringify(data));
    }, [data]);

    // Staff Logic
    const updateStaff = (index: number, field: keyof StaffShift, value: string) => {
        const newShifts = [...data.staffShifts];
        newShifts[index] = { ...newShifts[index], [field]: value };
        setData(prev => ({ ...prev, staffShifts: newShifts }));
    };

    const addStaff = () => {
        setData(prev => ({
            ...prev,
            staffShifts: [...prev.staffShifts, { id: crypto.randomUUID(), name: '', startTime: '', endTime: '' }]
        }));
    };

    const removeStaff = (index: number) => {
        if (confirm('Remove this staff slot?')) {
            const newShifts = [...data.staffShifts];
            newShifts.splice(index, 1);
            setData(prev => ({ ...prev, staffShifts: newShifts }));
        }
    };

    // Scratch Card Logic
    const updateScratchCardBatch = (cardIndex: number, batchIndex: number, field: 'opening' | 'closing' | 'isFinished', value: number | boolean) => {
        const newCards = [...data.scratchCards];
        const newBatches = [...newCards[cardIndex].batches];
        newBatches[batchIndex] = { ...newBatches[batchIndex], [field]: value };
        newCards[cardIndex] = { ...newCards[cardIndex], batches: newBatches };
        setData(prev => ({ ...prev, scratchCards: newCards }));
    };

    const addScratchCardBatch = (cardIndex: number) => {
        const newCards = [...data.scratchCards];
        newCards[cardIndex].batches.push({
            id: crypto.randomUUID(),
            opening: 0,
            closing: 0,
            isFinished: false
        });
        setData(prev => ({ ...prev, scratchCards: newCards }));
    };

    const removeScratchCardBatch = (cardIndex: number, batchIndex: number) => {
        const newCards = [...data.scratchCards];
        if (newCards[cardIndex].batches.length > 1) {
            newCards[cardIndex].batches.splice(batchIndex, 1);
            setData(prev => ({ ...prev, scratchCards: newCards }));
        }
    };

    // Temperature Logic
    const updateTemperature = (appliance: keyof TemperatureLog, time: keyof TemperatureReadings, value: number | '') => {
        setData(prev => ({
            ...prev,
            temperatures: {
                ...prev.temperatures,
                [appliance]: {
                    ...prev.temperatures[appliance],
                    [time]: value
                }
            }
        }));
    };

    const updateNotes = (notes: string) => {
        setData(prev => ({ ...prev, notes }));
    };

    const resetData = () => {
        if (confirm('Are you sure you want to reset all data?')) {
            setData(INITIAL_STATE);
        }
    };

    return {
        data,
        updateStaff,
        addStaff,
        removeStaff,
        updateScratchCardBatch,
        addScratchCardBatch,
        removeScratchCardBatch,
        updateTemperature,
        updateNotes,
        resetData,
        setData
    };
}
