import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import { IndianRupee, FileText, CheckSquare, Banknote, Activity, Receipt, Package, Download, Eye } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import PaymentsTab from '../components/PaymentsTab';
import ExpensesTab from '../components/ExpensesTab';
import DocumentsTab from '../components/DocumentsTab';
import ProgressTab from '../components/ProgressTab';
import InvoicesTab from '../components/InvoicesTab';
import MaterialsTab from '../components/MaterialsTab';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    const res = await api.get(`/projects/${id}`);
    setProject(res.data);
  };

  if (!project) return <div>Loading...</div>;

  const generateLedgerPDF = async () => {
    const payRes = await api.get(`/payments/project/${project.id}`);
    const expRes = await api.get(`/expenses/project/${project.id}`);
    
    const payments = payRes.data || [];
    const expenses = expRes.data || [];
    
    const totalReceived = payments.reduce((sum, p) => sum + (p.amount_received || 0), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const pendingBalance = project.value - totalReceived;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // --- Top Header Banner ---
    doc.setFillColor(30, 41, 59); // Deep slate blue (#1e293b)
    doc.rect(0, 0, pageWidth, 28, 'F');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text("SYAM INFRA", 14, 12);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("CLIENT LEDGER & FINANCIAL STATEMENT", 14, 20);

    doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, pageWidth - 14, 16, { align: 'right' });

    // --- Project & Client Information Box ---
    doc.setFillColor(248, 250, 252); // Soft light background (#f8fafc)
    doc.setDrawColor(226, 232, 240); // Border color (#e2e8f0)
    doc.roundedRect(14, 34, pageWidth - 28, 30, 2, 2, 'FD');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text(`Project: ${project.name}`, 18, 43);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(`Project ID: ${project.id} | Status: ${project.status}`, 18, 50);
    doc.text(`Client Name: ${project.client_name || 'N/A'} | Contact: ${project.client_phone || 'N/A'}`, 18, 57);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text(`Total Value: Rs. ${project.value.toLocaleString('en-IN')}`, pageWidth - 18, 45, { align: 'right' });
    doc.setFont("helvetica", "normal");
    doc.setTextColor(pendingBalance > 0 ? 220 : 39, pendingBalance > 0 ? 38 : 174, pendingBalance > 0 ? 38 : 96);
    doc.text(`Pending Due: Rs. ${pendingBalance.toLocaleString('en-IN')}`, pageWidth - 18, 54, { align: 'right' });

    // Helper to check page break for section headings
    let currentY = 74;
    const checkPageBreak = (neededSpace) => {
      if (currentY + neededSpace > pageHeight - 25) {
        doc.addPage();
        currentY = 20;
      }
    };

    // --- Section 1: Financial Summary ---
    checkPageBreak(50);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text("1. Financial Summary", 14, currentY);

    autoTable(doc, {
      startY: currentY + 4,
      head: [['Financial Description', 'Amount (Rs.)']],
      body: [
        ['Total Project Value', `Rs. ${project.value.toLocaleString('en-IN')}`],
        ['Amount Received (Till Now)', `Rs. ${totalReceived.toLocaleString('en-IN')}`],
        ['Pending Balance (To Pay)', `Rs. ${pendingBalance.toLocaleString('en-IN')}`],
        ['Total Internal Expenses', `Rs. ${totalExpenses.toLocaleString('en-IN')}`]
      ],
      theme: 'grid',
      headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { halign: 'right', fontStyle: 'bold', cellWidth: 60 }
      },
      didParseCell: function (data) {
        if (data.section === 'body' && data.row.index === 2) {
          data.cell.styles.textColor = [185, 28, 28]; // Red highlight for Pending Balance
          data.cell.styles.fontStyle = 'bold';
        }
      }
    });

    currentY = doc.lastAutoTable.finalY + 12;

    // --- Section 2: Payment Stages & History ---
    if (payments.length > 0) {
      checkPageBreak(40);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(30, 41, 59);
      doc.text("2. Payment Stages & Receipt History", 14, currentY);

      let paymentBody = [];
      payments.forEach(p => {
        paymentBody.push([
          p.stage_name || 'N/A', 
          `Rs. ${p.expected_amount?.toLocaleString('en-IN') || 0}`, 
          `Rs. ${p.amount_received?.toLocaleString('en-IN') || 0}`, 
          p.status || 'Pending', 
          p.due_date || 'N/A'
        ]);
        
        if (p.history && p.history.length > 0) {
          p.history.forEach((h, index) => {
            paymentBody.push([
              `   -> Payment #${index + 1}`,
              '',
              `Rs. ${h.amount?.toLocaleString('en-IN') || 0}`,
              'Received',
              h.payment_date || 'N/A'
            ]);
          });
        }
      });

      autoTable(doc, {
        startY: currentY + 4,
        head: [['Payment Stage / History', 'Expected', 'Received', 'Status', 'Date']],
        body: paymentBody,
        theme: 'striped',
        headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], fontStyle: 'bold' },
        columnStyles: {
          1: { halign: 'right' },
          2: { halign: 'right' },
          3: { halign: 'center' },
          4: { halign: 'center' }
        },
        didParseCell: function (data) {
          if (data.section === 'body') {
            const stageText = data.row.raw[0] || '';
            if (stageText.startsWith('   ->')) {
              data.cell.styles.fontStyle = 'italic';
              data.cell.styles.textColor = [100, 116, 139];
              if (data.column.index === 0) {
                data.cell.styles.cellPadding = { top: 2, right: 2, bottom: 2, left: 8 };
              }
            } else {
              if (data.column.index === 0) {
                data.cell.styles.fontStyle = 'bold';
              }
            }
          }
        }
      });

      currentY = doc.lastAutoTable.finalY + 12;
    }

    // --- Section 3: Project Expenses ---
    if (expenses.length > 0) {
      checkPageBreak(40);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(30, 41, 59);
      doc.text("3. Project Expenses & Outflows", 14, currentY);

      autoTable(doc, {
        startY: currentY + 4,
        head: [['Category', 'Description', 'Date', 'Amount (Rs.)']],
        body: expenses.map(e => [
          e.category || 'N/A', 
          e.description || 'N/A',
          e.date || 'N/A',
          `Rs. ${e.amount?.toLocaleString('en-IN') || 0}`
        ]),
        theme: 'striped',
        headStyles: { fillColor: [185, 28, 28], textColor: [255, 255, 255], fontStyle: 'bold' },
        columnStyles: {
          1: { cellWidth: 65 },
          2: { halign: 'center', cellWidth: 35 },
          3: { halign: 'right', fontStyle: 'bold', cellWidth: 40 }
        }
      });
    }

    // --- Footer across all pages ---
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

  const exportLedger = async () => {
    try {
      const doc = await generateLedgerPDF();
      doc.save(`Ledger_${project.id}.pdf`);
    } catch (err) {
      console.error("Failed to export ledger", err);
      alert("Failed to export ledger. Check console for details.");
    }
  };

  const viewLedger = async () => {
    try {
      const doc = await generateLedgerPDF();
      window.open(doc.output('bloburl'), '_blank');
    } catch (err) {
      console.error("Failed to view ledger", err);
      alert("Failed to view ledger. Check console for details.");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2 className="page-title" style={{ marginBottom: '0.5rem' }}>{project.name}</h2>
        <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          <span>ID: {project.id}</span>
          <span>•</span>
          <span>Status: <strong style={{ color: project.status === 'Completed' ? 'var(--success)' : 'var(--accent-color)' }}>{project.status}</strong></span>
          <span>•</span>
          <span>Value: ₹{project.value.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', overflowX: 'auto' }}>
        {[
          { id: 'overview', label: 'Overview', icon: CheckSquare },
          { id: 'progress', label: 'Progress', icon: Activity },
          { id: 'materials', label: 'Materials', icon: Package },
          { id: 'payments', label: 'Payments', icon: IndianRupee },
          { id: 'expenses', label: 'Expenses', icon: Banknote },
          { id: 'documents', label: 'Documents', icon: FileText },
          { id: 'invoices', label: 'Invoices', icon: Receipt }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 500,
              color: activeTab === tab.id ? 'var(--accent-color)' : 'var(--text-secondary)',
              borderBottom: activeTab === tab.id ? '2px solid var(--accent-color)' : '2px solid transparent',
              marginBottom: '-9px'
            }}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="card" style={{ minHeight: '400px' }}>
        {activeTab === 'overview' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Project Details</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-secondary" onClick={viewLedger} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Eye size={16} /> View Ledger
                </button>
                <button className="btn btn-secondary" onClick={exportLedger} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Download size={16} /> Export
                </button>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Client</p>
                <p style={{ fontWeight: 500 }}>{project.client_name || 'N/A'}</p>
                {project.client_phone && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{project.client_phone}</p>
                )}
              </div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Location</p>
                <p style={{ fontWeight: 500 }}>{project.location || 'N/A'}</p>
              </div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Project Type</p>
                <span className="badge badge-info" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                  {project.project_type || 'Cement + Interiors'}
                </span>
              </div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Start Date</p>
                <p style={{ fontWeight: 500 }}>{project.start_date || 'N/A'}</p>
              </div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Expected Completion</p>
                <p style={{ fontWeight: 500 }}>{project.expected_completion || 'N/A'}</p>
              </div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Overall Progress</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <div style={{ flex: 1, backgroundColor: 'var(--border-color)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${project.progress_percentage}%`, backgroundColor: 'var(--success)', height: '100%', transition: 'width 0.3s ease' }}></div>
                  </div>
                  <span style={{ fontWeight: 500 }}>{project.progress_percentage}%</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'progress' && (
          <ProgressTab 
            project={project} 
            onProgressUpdate={(addedPercentage) => {
              setProject({
                ...project, 
                progress_percentage: Math.min(100, project.progress_percentage + addedPercentage),
                status: project.progress_percentage + addedPercentage >= 100 ? 'Completed' : project.status
              })
            }} 
          />
        )}
        
        {activeTab === 'materials' && <MaterialsTab projectId={project.id} />}
        {activeTab === 'payments' && <PaymentsTab projectId={project.id} />}
        {activeTab === 'expenses' && <ExpensesTab projectId={project.id} />}
        {activeTab === 'documents' && <DocumentsTab projectId={project.id} />}
        {activeTab === 'invoices' && <InvoicesTab projectId={project.id} />}
      </div>
    </div>
  );
};

export default ProjectDetails;
