async function generatePDF() {
    try {
        const { jsPDF } = window.jspdf;
        if (!jsPDF) {
            throw new Error("jsPDF library is not loaded.");
        }

        const doc = new jsPDF();
        const pageHeight = doc.internal.pageSize.height;
        let yPosition = 10;

        // Title Section
        doc.setFontSize(18);
        doc.text('Shift Record Report', 10, yPosition);
        doc.setFontSize(12);
        doc.text('Generated on: ' + new Date().toLocaleString(), 120, yPosition);
        yPosition += 20;

        // Staff Information Section
        doc.setFontSize(14);
        doc.text('Staff Information:', 10, yPosition);
        yPosition += 10;

        const staffData = [];
        for (let i = 1; i <= 4; i++) {
            const staffName = document.getElementById(`staffName${i}`)?.value.trim() || 'N/A';
            const staffShiftStart = document.getElementById(`shiftStart${i}`)?.value.trim() || 'N/A';
            const staffShiftEnd = document.getElementById(`shiftEnd${i}`)?.value.trim() || 'N/A';

            let staffShiftDuration = 'N/A';
            if (staffShiftStart !== 'N/A' && staffShiftEnd !== 'N/A') {
                const startTime = new Date(`1970-01-01T${staffShiftStart}:00`);
                const endTime = new Date(`1970-01-01T${staffShiftEnd}:00`);
                if (!isNaN(startTime) && !isNaN(endTime)) {
                    const durationMs = endTime - startTime;
                    const hours = Math.floor(durationMs / (1000 * 60 * 60));
                    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
                    staffShiftDuration = `${hours} hours and ${minutes} minutes`;
                }
            }

            staffData.push([`Staff ${i}`, staffName, staffShiftStart, staffShiftEnd, staffShiftDuration]);
        }

        doc.autoTable({
            head: [['Staff', 'Name', 'Shift Start', 'Shift End', 'Shift Duration']],
            body: staffData,
            startY: yPosition,
            theme: 'grid',
            columnStyles: {
                0: { cellWidth: 20 },
                1: { cellWidth: 40 },
                2: { cellWidth: 30 },
                3: { cellWidth: 30 },
                4: { cellWidth: 50 }
            },
            didDrawPage: function (data) {
                yPosition = data.cursor.y;
            }
        });

        yPosition = doc.autoTable.previous.finalY + 10;

        // Scratch Card Information Section
if (yPosition + 30 > pageHeight) doc.addPage(), (yPosition = 10);
doc.setFontSize(14);
doc.text('Scratch Card Information:', 10, yPosition);
yPosition += 10;

let totalSales = 0; // Variable to accumulate total sales
const scratchData = [];
for (let i = 1; i <= 20; i++) {
    const scratchOpening = parseInt(document.getElementById(`scratchOpening${i}`)?.value) || 0;
    const scratchClosing = parseInt(document.getElementById(`scratchClosing${i}`)?.value) || 0;
    const totalScratchSold = scratchOpening - scratchClosing;

    let pricePerCard = 0;
    if (i >= 1 && i <= 8) {
        pricePerCard = 5;
    } else if (i >= 7 && i <= 13) {
        pricePerCard = 3;
    } else if (i >= 12 && i <= 18) {
        pricePerCard = 2;
    } else if (i >= 17 && i <= 20) {
        pricePerCard = 1;
    }

    const totalAmount = totalScratchSold * pricePerCard;
    totalSales += totalAmount; // Add to total sales

    scratchData.push([`Scratch Card ${i}`, scratchOpening, scratchClosing, totalScratchSold, `£${pricePerCard}`, `£${totalAmount}`]);
}

// Add the total sales row
scratchData.push(['Total Sales', '', '', '', '', `£${totalSales}`]);

doc.autoTable({
    head: [['Scratch Card', 'Opening', 'Closing', 'Sold', 'Price Per Card', 'Total Amount']],
    body: scratchData,
    startY: yPosition,
    theme: 'grid',
    columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 20 },
        2: { cellWidth: 20 },
        3: { cellWidth: 20 },
        4: { cellWidth: 20 },
        5: { cellWidth: 30 }
    },
    didDrawPage: function (data) {
        yPosition = data.cursor.y;
    }
});


        yPosition = doc.autoTable.previous.finalY + 10;

        // Temperature Monitoring Section
        if (yPosition + 50 > pageHeight) doc.addPage(), (yPosition = 10);
        doc.setFontSize(12);
        doc.text('Temperature Monitoring:', 10, yPosition);
        yPosition += 10;

        const freezerTemp1 = document.getElementById('freezerTemp1')?.value || 'N/A';
        const freezerTemp2 = document.getElementById('freezerTemp2')?.value || 'N/A';
        const chillerTemp = document.getElementById('chillerTemp')?.value || 'N/A';
        const fridgeTemp1 = document.getElementById('fridgeTemp1')?.value || 'N/A';
        const fridgeTemp2 = document.getElementById('fridgeTemp2')?.value || 'N/A';

        doc.text(`  Freezer 1 : ${freezerTemp1} °C`, 10, yPosition);
        yPosition += 10;
        doc.text(`  Freezer 2: ${freezerTemp2} °C`, 10, yPosition);
        yPosition += 10;
        doc.text(`  Chiller: ${chillerTemp} °C`, 10, yPosition);
        yPosition += 10;
        doc.text(`  Drinks Fridge: ${fridgeTemp1} °C`, 10, yPosition);
        yPosition += 10;
        doc.text(`  Beer and Alcohol Fridge: ${fridgeTemp2} °C`, 10, yPosition);

        // Save the PDF
        doc.save('Shift_Record_Updated.pdf');
    } catch (error) {
        console.error("Error generating PDF:", error);
        alert("An error occurred while generating the PDF. Please check the console for more details.");
    }
}
