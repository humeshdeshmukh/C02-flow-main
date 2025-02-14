import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

export const generateComprehensiveReport = (data) => {
  const {
    calculatedData,
    aiInsights,
    reductionStrategies,
    predictions,
    sustainabilityReport,
    supplyChainAnalysis,
    complianceReport,
  } = data;

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  let yPos = 20;

  // Helper function for adding section headers
  const addSectionHeader = (text) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(255, 183, 77); // #FFB74D
    doc.text(text, 20, yPos);
    yPos += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
  };

  // Title Page
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(255, 183, 77);
  doc.text('CO2 Flow', pageWidth / 2, 40, { align: 'center' });
  doc.setFontSize(20);
  doc.text('Comprehensive Emission Analysis Report', pageWidth / 2, 55, { align: 'center' });
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Generated on: ${format(new Date(), 'PPP')}`, pageWidth / 2, 70, { align: 'center' });

  // Table of Contents
  yPos = 90;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Table of Contents', 20, yPos);
  yPos += 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);

  const sections = [
    'Executive Summary',
    'Current Emissions Analysis',
    'AI-Powered Insights',
    'Reduction Strategies',
    'Future Predictions',
    'Sustainability Assessment',
    'Supply Chain Analysis',
    'Compliance Status',
    'Recommendations',
  ];

  sections.forEach((section, index) => {
    doc.text(`${index + 1}. ${section}`, 25, yPos);
    doc.setTextColor(0, 0, 255);
    doc.textWithLink(`${index + 1}. ${section}`, 25, yPos, {
      pageNumber: index + 2,
    });
    doc.setTextColor(0, 0, 0);
    yPos += 8;
  });

  // Executive Summary
  doc.addPage();
  yPos = 20;
  addSectionHeader('1. Executive Summary');
  
  if (sustainabilityReport?.executiveSummary) {
    const { keyFindings, challenges, recommendations } = sustainabilityReport.executiveSummary;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Key Findings:', 20, yPos += 15);
    doc.setFont('helvetica', 'normal');
    keyFindings.forEach(finding => {
      doc.text(`• ${finding}`, 25, yPos += 8);
    });

    yPos += 10;
    doc.setFont('helvetica', 'bold');
    doc.text('Critical Challenges:', 20, yPos += 10);
    doc.setFont('helvetica', 'normal');
    challenges.forEach(challenge => {
      doc.text(`• ${challenge}`, 25, yPos += 8);
    });

    yPos += 10;
    doc.setFont('helvetica', 'bold');
    doc.text('Strategic Recommendations:', 20, yPos += 10);
    doc.setFont('helvetica', 'normal');
    recommendations.forEach(rec => {
      doc.text(`• ${rec}`, 25, yPos += 8);
    });
  }

  // Current Emissions
  doc.addPage();
  yPos = 20;
  addSectionHeader('2. Current Emissions Analysis');
  
  if (calculatedData?.calculated) {
    const emissionsTable = [
      ['Emission Type', 'Value', 'Unit'],
      ['Scope 1 (Direct)', calculatedData.calculated.scope1.fuelConsumption.value.toFixed(2), 'kg CO2e'],
      ['Scope 2 (Indirect)', calculatedData.calculated.scope2.electricityUsage.value.toFixed(2), 'kg CO2e'],
      ['Scope 3 (Value Chain)', calculatedData.calculated.scope3.businessTravel.value.toFixed(2), 'kg CO2e'],
    ];

    doc.autoTable({
      startY: yPos + 10,
      head: [emissionsTable[0]],
      body: emissionsTable.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [255, 183, 77] },
    });
  }

  // AI Insights
  doc.addPage();
  yPos = 20;
  addSectionHeader('3. AI-Powered Insights');
  
  if (aiInsights?.trends) {
    doc.setFont('helvetica', 'bold');
    doc.text('Key Trends:', 20, yPos += 15);
    doc.setFont('helvetica', 'normal');
    aiInsights.trends.forEach(trend => {
      doc.text(`• ${trend}`, 25, yPos += 8);
    });
  }

  // Add charts and visualizations using Canvas
  if (aiInsights?.industryComparison) {
    yPos += 20;
    doc.setFont('helvetica', 'bold');
    doc.text('Industry Comparison:', 20, yPos);
    // Add chart here using Canvas
  }

  // Reduction Strategies
  doc.addPage();
  yPos = 20;
  addSectionHeader('4. Reduction Strategies');
  
  if (reductionStrategies) {
    Object.entries(reductionStrategies).forEach(([timeframe, strategies]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(`${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} Term:`, 20, yPos += 15);
      doc.setFont('helvetica', 'normal');
      
      strategies.forEach(strategy => {
        doc.text(`• ${strategy.action}`, 25, yPos += 8);
        doc.setFontSize(10);
        doc.text(`  ROI: ${strategy.roi} | Complexity: ${strategy.complexity}`, 30, yPos += 6);
        doc.setFontSize(12);
      });
      
      yPos += 5;
    });
  }

  // Future Predictions
  doc.addPage();
  yPos = 20;
  addSectionHeader('5. Future Predictions');
  
  if (predictions) {
    doc.setFont('helvetica', 'bold');
    doc.text('Emission Forecasts:', 20, yPos += 15);
    doc.setFont('helvetica', 'normal');
    
    // Add forecast visualization here
    
    yPos += 100; // Space for chart
    doc.setFont('helvetica', 'bold');
    doc.text('Key Influencing Factors:', 20, yPos += 10);
    doc.setFont('helvetica', 'normal');
    
    predictions.factors.forEach(factor => {
      doc.text(`• ${factor.name}: ${factor.impact}`, 25, yPos += 8);
    });
  }

  // Supply Chain Analysis
  doc.addPage();
  yPos = 20;
  addSectionHeader('7. Supply Chain Analysis');
  
  if (supplyChainAnalysis?.hotspots) {
    const hotspotsTable = [
      ['Area', 'Emission Level', 'Priority', 'Action Required'],
      ...supplyChainAnalysis.hotspots.map(h => [
        h.area,
        h.emissionLevel,
        h.priority,
        h.action,
      ]),
    ];

    doc.autoTable({
      startY: yPos + 10,
      head: [hotspotsTable[0]],
      body: hotspotsTable.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [255, 183, 77] },
    });
  }

  // Compliance Status
  doc.addPage();
  yPos = 20;
  addSectionHeader('8. Compliance Status');
  
  if (complianceReport?.requirements) {
    const complianceTable = [
      ['Requirement', 'Status', 'Compliance'],
      ...complianceReport.requirements.map(r => [
        r.requirement,
        r.status,
        r.compliance ? 'Compliant' : 'Action Required',
      ]),
    ];

    doc.autoTable({
      startY: yPos + 10,
      head: [complianceTable[0]],
      body: complianceTable.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [255, 183, 77] },
    });
  }

  // Add page numbers
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }

  return doc;
};
