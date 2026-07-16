import { useState } from 'react';
import { Download, Eye } from 'lucide-react';
import api from '../utils/api';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const Reports = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const generateReport = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      const res = await api.get(`/reports/financial?${params.toString()}`);
      setReportData(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const generateReportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // Top Header Banner
    doc.setFillColor(30, 41, 59); // Deep slate blue (#1e293b)
    doc.rect(0, 0, pageWidth, 28, 'F');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text("SYAM INFRA", 14, 12);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("EXECUTIVE FINANCIAL REPORT", 14, 20);

    doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, pageWidth - 14, 16, { align: 'right' });

    // Summary Card Box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, 34, pageWidth - 28, 20, 2, 2, 'FD');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text(`Report Period: ${startDate || 'All Time (Start)'} to ${endDate || 'Present'}`, 18, 46);

    autoTable(doc, {
      startY: 62,
      head: [['Financial Metric', 'Amount (Rs.)']],
      body: [
        ['Total Revenue (Inflows)', `Rs. ${reportData.total_revenue.toLocaleString('en-IN')}`],
        ['Total Expenses (Outflows)', `Rs. ${reportData.total_expenses.toLocaleString('en-IN')}`],
        ['Net Profit / Balance', `Rs. ${reportData.profit.toLocaleString('en-IN')}`]
      ],
      theme: 'grid',
      headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { halign: 'right', fontStyle: 'bold', cellWidth: 70 }
      },
      didParseCell: function (data) {
        if (data.section === 'body' && data.row.index === 2) {
          const isProfit = reportData.profit >= 0;
          data.cell.styles.textColor = isProfit ? [22, 163, 74] : [185, 28, 28];
          data.cell.styles.fontStyle = 'bold';
        }
      }
    });

    // Footer across all pages
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setDrawColor(226, 232, 240);
      doc.line(14, pageHeight - 15, pageWidth - 14, pageHeight - 15);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text("SYAM INFRA - Confidential Financial Record", 14, pageHeight - 9);
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - 14, pageHeight - 9, { align: 'right' });
    }
    
    return doc;
  };

  const exportReport = () => {
    if (!reportData) return;
    const doc = generateReportPDF();
    doc.save(`Financial_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const viewReport = () => {
    if (!reportData) return;
    const doc = generateReportPDF();
    window.open(doc.output('bloburl'), '_blank');
  };

  return (
    <div>
      <h2 className="page-title">Reports</h2>
      
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Generate Financial Report</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div className="input-group" style={{ marginBottom: 0, flex: 1, minWidth: '200px' }}>
            <label>Start Date</label>
            <input type="date" className="input" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>
          <div className="input-group" style={{ marginBottom: 0, flex: 1, minWidth: '200px' }}>
            <label>End Date</label>
            <input type="date" className="input" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={generateReport} disabled={loading} style={{ height: '42px' }}>
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>

      {reportData && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Financial Summary</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-secondary" onClick={viewReport} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Eye size={16} /> View
              </button>
              <button className="btn btn-secondary" onClick={exportReport} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Download size={16} /> Export
              </button>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div style={{ padding: '1.5rem', backgroundColor: 'var(--success-bg)', borderRadius: 'var(--border-radius)', border: '1px solid var(--success)' }}>
              <p style={{ color: 'var(--success)', fontWeight: 600, marginBottom: '0.5rem' }}>Total Revenue</p>
              <h2 style={{ fontSize: '2rem', color: 'var(--success)' }}>₹{reportData.total_revenue.toLocaleString('en-IN')}</h2>
            </div>
            <div style={{ padding: '1.5rem', backgroundColor: 'var(--danger-bg)', borderRadius: 'var(--border-radius)', border: '1px solid var(--danger)' }}>
              <p style={{ color: 'var(--danger)', fontWeight: 600, marginBottom: '0.5rem' }}>Total Expenses</p>
              <h2 style={{ fontSize: '2rem', color: 'var(--danger)' }}>₹{reportData.total_expenses.toLocaleString('en-IN')}</h2>
            </div>
            <div style={{ padding: '1.5rem', backgroundColor: reportData.profit >= 0 ? 'var(--success-bg)' : 'var(--danger-bg)', borderRadius: 'var(--border-radius)', border: `1px solid ${reportData.profit >= 0 ? 'var(--success)' : 'var(--danger)'}` }}>
              <p style={{ color: reportData.profit >= 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 600, marginBottom: '0.5rem' }}>Net Profit/Loss</p>
              <h2 style={{ fontSize: '2rem', color: reportData.profit >= 0 ? 'var(--success)' : 'var(--danger)' }}>₹{reportData.profit.toLocaleString('en-IN')}</h2>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
