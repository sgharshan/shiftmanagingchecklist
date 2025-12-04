
function calculateShiftDuration(startId, endId, displayId) {
    const start = document.getElementById(startId).value;
    const end = document.getElementById(endId).value;
    const display = document.getElementById(displayId);

    if (start && end) {
        const startTime = new Date(`1970-01-01T${start}:00`);
        const endTime = new Date(`1970-01-01T${end}:00`);
        const diffMs = endTime - startTime;

        if (diffMs >= 0) {
            const hours = Math.floor(diffMs / (1000 * 60 * 60));
            const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            display.textContent = `Duration: ${hours}h ${minutes}m`;
            display.style.color = '#28a745';
        } else {
            display.textContent = `Invalid time range`;
            display.style.color = 'red';
        }
    } else {
        display.textContent = '';
    }
}

['1', '2', '3'].forEach(i => {
    document.getElementById(`shiftStart${i}`).addEventListener('input', () => {
        calculateShiftDuration(`shiftStart${i}`, `shiftEnd${i}`, `duration${i}`);
    });
    document.getElementById(`shiftEnd${i}`).addEventListener('input', () => {
        calculateShiftDuration(`shiftStart${i}`, `shiftEnd${i}`, `duration${i}`);
    });
});


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

    
const priceMap = {
    1: 5, 2: 5, 3: 5, 4: 5, 5: 5, 6: 5, 7: 5, 8: 5,
    9: 3, 10: 3, 11: 3, 12: 3, 13: 3,
    14: 2, 15: 2, 16: 2, 17: 2, 18: 2,
    19: 1, 20: 1
};

    const pricePerCard = priceMap[i] || 0;

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

        
        // Notes Section
        yPosition += 10;
        if (yPosition + 30 > pageHeight) doc.addPage(), (yPosition = 10);
        doc.setFontSize(12);
        doc.text('Manager Notes:', 10, yPosition);
        yPosition += 10;

        const notes = document.getElementById('managerNotes')?.value.trim() || 'N/A';
        const wrappedNotes = doc.splitTextToSize(notes, 180);
        doc.text(wrappedNotes, 10, yPosition);

        // Save the PDF
        doc.save('Shift_Record_Updated.pdf');
    } catch (error) {
        console.error("Error generating PDF:", error);
        alert("An error occurred while generating the PDF. Please check the console for more details.");
    }
}



function updateSummary() {
    let totalSales = 0;
    const priceMap = {
        1: 5, 2: 5, 3: 5, 4: 5, 5: 5, 6: 5, 7: 5, 8: 5,
        9: 3, 10: 3, 11: 3, 12: 3, 13: 3,
        14: 2, 15: 2, 16: 2, 17: 2, 18: 2,
        19: 1, 20: 1
    };

    for (let i = 1; i <= 20; i++) {
        const open = parseInt(document.getElementById(`scratchOpening${i}`).value) || 0;
        const close = parseInt(document.getElementById(`scratchClosing${i}`).value) || 0;
        const sold = open - close;
        const price = priceMap[i] || 0;
        totalSales += sold * price;
    }
    document.getElementById('totalSales').textContent = `£${totalSales}`;

    let totalMinutes = 0;
    for (let i = 1; i <= 3; i++) {
        const start = document.getElementById(`shiftStart${i}`).value;
        const end = document.getElementById(`shiftEnd${i}`).value;
        if (start && end) {
            const startTime = new Date(`1970-01-01T${start}:00`);
            const endTime = new Date(`1970-01-01T${end}:00`);
            const diff = (endTime - startTime) / 60000;
            if (diff > 0) totalMinutes += diff;
        }
    }
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    document.getElementById('totalHours').textContent = `${hours}h ${minutes}m`;
    updateSalesChart();
}

// Event listeners for summary updates
['1','2','3'].forEach(i => {
    ['shiftStart', 'shiftEnd'].forEach(type => {
        document.getElementById(`${type}${i}`).addEventListener('input', updateSummary);
    });
});

for (let i = 1; i <= 20; i++) {
    document.getElementById(`scratchOpening${i}`).addEventListener('input', updateSummary);
    document.getElementById(`scratchClosing${i}`).addEventListener('input', updateSummary);
}



function saveFormData() {
    const inputs = document.querySelectorAll('input, textarea');
    const data = {};
    inputs.forEach(input => {
        data[input.id] = input.value;
    });
    localStorage.setItem('shiftFormData', JSON.stringify(data));
}

function loadFormData() {
    const data = JSON.parse(localStorage.getItem('shiftFormData') || '{}');
    Object.keys(data).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = data[id];
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadFormData();
    updateSummary();

    document.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', () => {
            saveFormData();
            updateSummary();
        });
    });
});

function exportToJSON() {
    const inputs = document.querySelectorAll('input, textarea');
    const data = {};
    inputs.forEach(input => {
        data[input.id] = input.value;
    });

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'shift_record.json';
    link.click();
}

function importFromJSON() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = event => {
            const json = JSON.parse(event.target.result);
            for (const id in json) {
                const el = document.getElementById(id);
                if (el) el.value = json[id];
            }
            updateSummary();
            saveFormData();
        };
        reader.readAsText(file);
    };

    input.click();
}
let salesChart;

function updateSalesChart() {
    const labels = [];
    const data = [];

    const priceMap = {
        1: 5, 2: 5, 3: 5, 4: 5, 5: 5, 6: 5, 7: 5, 8: 5,
        9: 3, 10: 3, 11: 3, 12: 3, 13: 3,
        14: 2, 15: 2, 16: 2, 17: 2, 18: 2,
        19: 1, 20: 1
    };

    for (let i = 1; i <= 20; i++) {
        const opening = parseInt(document.getElementById(`scratchOpening${i}`).value) || 0;
        const closing = parseInt(document.getElementById(`scratchClosing${i}`).value) || 0;
        const sold = opening - closing;
        labels.push(`Card ${i} (£${priceMap[i]})`);
        data.push(sold);
    }

    if (salesChart) {
        salesChart.data.labels = labels;
        salesChart.data.datasets[0].data = data;
        salesChart.update();
    } else {
        const ctx = document.getElementById('salesChart').getContext('2d');
        salesChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Scratch Cards Sold',
                    data: data,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                }
            }
        });
    }
}

function resetForm() {
    if (confirm("Are you sure you want to reset all entries? This will clear all data.")) {
        // Clear all input and textarea values
        document.querySelectorAll('input, textarea').forEach(el => el.value = '');

        // Clear shift duration displays
        document.querySelectorAll('.shift-duration').forEach(el => el.textContent = '');

        // Reset summaries
        document.getElementById('totalSales').textContent = '£0';
        document.getElementById('totalHours').textContent = '0h 0m';

        // Reset chart
        if (salesChart) {
            salesChart.destroy();
            salesChart = null;
        }

        // Clear local storage
        localStorage.removeItem('shiftFormData');
    }
}
