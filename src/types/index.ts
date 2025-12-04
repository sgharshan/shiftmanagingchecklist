export interface StaffShift {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
}

export interface ScratchCardBatch {
    id: string;
    opening: number;
    closing: number;
    isFinished: boolean;
}

export interface ScratchCard {
    id: number;
    price: number;
    batches: ScratchCardBatch[];
}

export interface TemperatureReadings {
    morning: number | '';
    afternoon: number | '';
    closing: number | '';
}

export interface TemperatureLog {
    freezer1: TemperatureReadings;
    freezer2: TemperatureReadings;
    chiller: TemperatureReadings;
    drinksFridge: TemperatureReadings;
    alcoholFridge: TemperatureReadings;
}

export interface DailyRecord {
    date: string;
    staffShifts: StaffShift[];
    scratchCards: ScratchCard[];
    temperatures: TemperatureLog;
    notes: string;
}
