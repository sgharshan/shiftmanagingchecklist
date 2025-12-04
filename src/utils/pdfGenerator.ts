import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { DailyRecord } from '../types';

export function generatePDF(data: DailyRecord) {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    let yPosition = 10;

    // Title
    doc.setFontSize(18);
    doc.text('Shift Record Report', 10, yPosition);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 120, yPosition);
    yPosition += 20;

    // Staff Section
    doc.setFontSize(14);
    doc.text('Staff Information:', 10, yPosition);
    yPosition += 10;

    const staffData = data.staffShifts.map((shift, index) => {
        let duration = 'N/A';
        if (shift.startTime && shift.endTime) {
            const start = new Date(`1970-01-01T${shift.startTime}:00`);
            const end = new Date(`1970-01-01T${shift.endTime}:00`);
            const diffMs = end.getTime() - start.getTime();
            if (diffMs >= 0) {
                const h = Math.floor(diffMs / (1000 * 60 * 60));
                const m = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                duration = `${h}h ${m}m`;
            }
        }
        return [`Staff ${index + 1}`, shift.name || 'N/A', shift.startTime || 'N/A', shift.endTime || 'N/A', duration];
    });

    autoTable(doc, {
        head: [['Staff', 'Name', 'Start', 'End', 'Duration']],
        body: staffData,
        startY: yPosition,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185] },
    });

    // @ts-ignore
    yPosition = doc.lastAutoTable.finalY + 15;

    // Scratch Card Section
    if (yPosition + 50 > pageHeight) { doc.addPage(); yPosition = 10; }
    doc.setFontSize(14);
    doc.text('Scratch Card Sales:', 10, yPosition);
    yPosition += 10;

    let totalSales = 0;
    const scratchData: any[] = [];

    data.scratchCards.forEach(card => {
        let cardTotalSold = 0;

        card.batches.forEach((batch, index) => {
            let sold = 0;
            let closingDisplay = batch.closing.toString();

            if (batch.isFinished) {
                sold = batch.opening + 1;
                closingDisplay = "EMPTY";
            } else {
                sold = Math.max(0, batch.opening - batch.closing);
            }

            cardTotalSold += sold;

            const batchLabel = card.batches.length > 1 ? ` (Batch ${index + 1})` : '';

            scratchData.push([
                `#${card.id}${batchLabel}`,
                batch.opening,
                closingDisplay,
                sold,
                `£${card.price}`,
                `£${sold * card.price}`
            ]);
        });

        totalSales += cardTotalSold * card.price;
    });

    scratchData.push(['Total', '', '', '', '', `£${totalSales}`]);

    autoTable(doc, {
        head: [['Card', 'Opening', 'Closing', 'Sold', 'Price', 'Total']],
        body: scratchData,
        startY: yPosition,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185] },
    });

    // @ts-ignore
    yPosition = doc.lastAutoTable.finalY + 15;

    // Temperature Section
    if (yPosition + 60 > pageHeight) { doc.addPage(); yPosition = 10; }
    doc.setFontSize(14);
    doc.text('Temperature Log:', 10, yPosition);
    yPosition += 10;

    const tempRows = [
        ['Freezer 1', data.temperatures.freezer1.morning, data.temperatures.freezer1.afternoon, data.temperatures.freezer1.closing],
        ['Freezer 2', data.temperatures.freezer2.morning, data.temperatures.freezer2.afternoon, data.temperatures.freezer2.closing],
        ['Chiller', data.temperatures.chiller.morning, data.temperatures.chiller.afternoon, data.temperatures.chiller.closing],
        ['Drinks Fridge', data.temperatures.drinksFridge.morning, data.temperatures.drinksFridge.afternoon, data.temperatures.drinksFridge.closing],
        ['Alcohol Fridge', data.temperatures.alcoholFridge.morning, data.temperatures.alcoholFridge.afternoon, data.temperatures.alcoholFridge.closing],
    ];

    autoTable(doc, {
        head: [['Appliance', 'Morning (°C)', 'Afternoon (°C)', 'Closing (°C)']],
        body: tempRows,
        startY: yPosition,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185] },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } },
    });

    // @ts-ignore
    yPosition = doc.lastAutoTable.finalY + 15;

    // Notes Section
    if (yPosition + 40 > pageHeight) { doc.addPage(); yPosition = 10; }
    doc.setFontSize(14);
    doc.text('Manager Notes:', 10, yPosition);
    yPosition += 10;

    doc.setFontSize(11);
    const splitNotes = doc.splitTextToSize(data.notes || 'No notes.', 180);
    doc.text(splitNotes, 10, yPosition);

    doc.save(`Shift_Record_${new Date().toISOString().split('T')[0]}.pdf`);
}
