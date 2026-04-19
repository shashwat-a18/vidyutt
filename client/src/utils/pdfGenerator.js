import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateShiftPDF = (shiftData) => {
  if (!shiftData) {
    console.error('No shift data provided');
    alert('Error: No shift data provided');
    return;
  }

  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 10;

    // Header with substation info
    doc.setFontSize(16);
    doc.text('UPPTCL 220/132 kV Sub-Station, Banda', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 8;

    doc.setFontSize(12);
    doc.text(`Shift Type: ${shiftData.shiftType} | Operator: ${shiftData.operator}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 6;

    doc.setFontSize(10);
    doc.text(`Date: ${new Date(shiftData.date).toLocaleDateString()} | Report Generated: ${new Date().toLocaleString()}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 8;

    // Bus Readings Table
    doc.setFontSize(11);
    doc.text('Bus Readings', 10, yPosition);
    yPosition += 6;

    const busReadingsData = [
      ['Parameter', 'Value', 'Unit', 'Status'],
      ['220 kV Bus Voltage', shiftData.busReadings?.bus220kV?.toFixed(2) || 'N/A', 'kV', shiftData.busReadings?.bus220kV >= 209 && shiftData.busReadings?.bus220kV <= 231 ? 'Normal' : 'Abnormal'],
      ['132 kV Bus Voltage', shiftData.busReadings?.bus132kV?.toFixed(2) || 'N/A', 'kV', shiftData.busReadings?.bus132kV >= 125.4 && shiftData.busReadings?.bus132kV <= 138.6 ? 'Normal' : 'Abnormal'],
      ['Grid Frequency', shiftData.busReadings?.frequency?.toFixed(2) || 'N/A', 'Hz', shiftData.busReadings?.frequency >= 49.5 && shiftData.busReadings?.frequency <= 50.5 ? 'Normal' : 'Abnormal'],
    ];

    doc.autoTable({
      head: [busReadingsData[0]],
      body: busReadingsData.slice(1),
      startY: yPosition,
      margin: { left: 10, right: 10 },
      didParseCell: (data) => {
        // Color code abnormal values
        if (data.cell && data.cell.text && data.cell.text[0] === 'Abnormal' && data.cell.styles) {
          data.cell.styles.textColor = [220, 38, 38]; // red
        }
      },
    });

    yPosition = doc.lastAutoTable.finalY + 6;

    // Transformer Readings Table
    doc.text('Transformer Readings', 10, yPosition);
    yPosition += 6;

    const transformerData = [['Transformer', 'OTI (°C)', 'WTI (°C)', 'Oil Level', 'OLTC Position', 'Fan Status', 'Remarks']];

    if (shiftData.transformers && Array.isArray(shiftData.transformers)) {
      shiftData.transformers.forEach((tf) => {
        transformerData.push([
          tf.name || 'N/A',
          tf.OTI?.toFixed(1) || 'N/A',
          tf.WTI?.toFixed(1) || 'N/A',
          tf.oilLevel || 'N/A',
          tf.OLTCPosition || 'N/A',
          tf.coolingFanStatus || 'N/A',
          tf.remarks || 'N/A',
        ]);
      });
    }

    doc.autoTable({
      head: [transformerData[0]],
      body: transformerData.slice(1),
      startY: yPosition,
      margin: { left: 10, right: 10 },
      didParseCell: (data) => {
        // Highlight anomalous temperatures
        if (data.cell && data.cell.text && data.cell.styles) {
          if (data.column.index === 1) { // OTI
            const value = parseFloat(data.cell.text[0]);
            if (!isNaN(value)) {
              if (value >= 95) {
                data.cell.styles.textColor = [220, 38, 38];
              } else if (value >= 85) {
                data.cell.styles.textColor = [234, 88, 12];
              }
            }
          }
          if (data.column.index === 2) { // WTI
            const value = parseFloat(data.cell.text[0]);
            if (!isNaN(value)) {
              if (value >= 100) {
                data.cell.styles.textColor = [220, 38, 38];
              } else if (value >= 90) {
                data.cell.styles.textColor = [234, 88, 12];
              }
            }
          }
        }
      },
    });

    yPosition = doc.lastAutoTable.finalY + 6;

    // SF6 Breaker Status Table
    doc.text('SF6 Breaker Status', 10, yPosition);
    yPosition += 6;

    const breakerData = [['Breaker', 'Pressure (bar)', 'Ambient Temp (°C)', 'Corrected Status']];

    if (shiftData.breakers && Array.isArray(shiftData.breakers)) {
      shiftData.breakers.forEach((breaker) => {
        breakerData.push([
          breaker.name || 'N/A',
          breaker.SF6Pressure?.toFixed(2) || 'N/A',
          breaker.ambientTemp || 'N/A',
          breaker.SF6CorrectedStatus || 'N/A',
        ]);
      });
    }

    doc.autoTable({
      head: [breakerData[0]],
      body: breakerData.slice(1),
      startY: yPosition,
      margin: { left: 10, right: 10 },
      didParseCell: (data) => {
        if (data.cell && data.cell.text && data.cell.styles) {
          if (data.column.index === 3) { // Status
            if (data.cell.text[0] === 'Lockout' || data.cell.text[0] === 'Alarm') {
              data.cell.styles.textColor = [220, 38, 38];
            }
          }
        }
      },
    });

    yPosition = doc.lastAutoTable.finalY + 6;

    // Feeder Loading Table
    doc.text('Feeder Loading (132 kV)', 10, yPosition);
    yPosition += 6;

    const feederData = [['Feeder Name', 'MW', 'MVAR', 'Status']];

    if (shiftData.feeders && Array.isArray(shiftData.feeders)) {
      shiftData.feeders.forEach((feeder) => {
        feederData.push([
          feeder.name || 'N/A',
          feeder.MW?.toFixed(2) || 'N/A',
          feeder.MVAR?.toFixed(2) || 'N/A',
          feeder.status || 'N/A',
        ]);
      });
    }

    doc.autoTable({
      head: [feederData[0]],
      body: feederData.slice(1),
      startY: yPosition,
      margin: { left: 10, right: 10 },
    });

    yPosition = doc.lastAutoTable.finalY + 6;

    // Battery Summary
    doc.setFontSize(11);
    doc.text('Battery Bank (110V DC)', 10, yPosition);
    yPosition += 6;

    const batteryData = [
      ['Parameter', 'Value', 'Acceptable Range'],
      ['Float Voltage (V)', shiftData.battery?.floatVoltage?.toFixed(2) || 'N/A', '120–126 V'],
      ['Float Current (A)', shiftData.battery?.floatCurrent?.toFixed(2) || 'N/A', 'Variable'],
      ['Remarks', shiftData.battery?.remarks || 'None', ''],
    ];

    doc.autoTable({
      head: [batteryData[0]],
      body: batteryData.slice(1),
      startY: yPosition,
      margin: { left: 10, right: 10 },
      didParseCell: (data) => {
        if (data.cell && data.cell.text && data.cell.styles) {
          if (data.column.index === 1 && data.row.index === 0) {
            const voltage = parseFloat(data.cell.text[0]);
            if (!isNaN(voltage) && (voltage > 126 || voltage < 120)) {
              data.cell.styles.textColor = [220, 38, 38];
            }
          }
        }
      },
    });

    yPosition = doc.lastAutoTable.finalY + 6;

    // Anomalies Section
    if (shiftData.anomalies && shiftData.anomalies.length > 0) {
      doc.setTextColor(220, 38, 38); // Red
      doc.setFontSize(11);
      doc.text('⚠️ ANOMALIES DETECTED', 10, yPosition);
      yPosition += 6;
      doc.setTextColor(0);
      doc.setFontSize(9);

      shiftData.anomalies.forEach((anomaly) => {
        const lines = doc.splitTextToSize(anomaly, pageWidth - 20);
        lines.forEach((line) => {
          doc.setTextColor(220, 38, 38);
          doc.text(line, 10, yPosition);
          yPosition += 4;
        });
      });
      yPosition += 2;
    }

    // General Remarks
    if (shiftData.generalRemarks) {
      doc.setTextColor(0);
      doc.setFontSize(10);
      doc.text('General Remarks:', 10, yPosition);
      yPosition += 4;
      doc.setFontSize(9);
      const remarksLines = doc.splitTextToSize(shiftData.generalRemarks, pageWidth - 20);
      remarksLines.forEach((line) => {
        doc.text(line, 10, yPosition);
        yPosition += 4;
      });
    }

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(128);
    doc.text(`Report ID: ${shiftData._id || 'N/A'} | Generated: ${new Date().toLocaleString()}`, 10, pageHeight - 10);

    // Download the PDF with sanitized filename
    const dateStr = new Date(shiftData.date).toISOString().split('T')[0];
    const filename = `Shift_Report_${shiftData.shiftType}_${dateStr}.pdf`;

    doc.save(filename);
    console.log(`✓ PDF downloaded successfully: ${filename}`);
  } catch (error) {
    console.error('✗ Error generating PDF:', error);
    alert(`Error generating PDF: ${error.message}`);
  }
};
