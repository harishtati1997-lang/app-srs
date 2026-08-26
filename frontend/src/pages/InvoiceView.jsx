import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Printer } from 'lucide-react';
import api from '../utils/api';
import { numberToWords } from '../utils/numberToWords';
import { Toaster } from 'react-hot-toast';
import '../App.css';

const InvoiceView = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [project, setProject] = useState(null);
  const [client, setClient] = useState(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const invRes = await api.get(`/invoices/${id}`);
      const inv = invRes.data;
      setInvoice(inv);

      const projRes = await api.get(`/projects/${inv.project_id}`);
      const proj = projRes.data;
      setProject(proj);

      setClient({
        name: proj.client_name || 'N/A',
        phone: proj.client_phone || 'N/A'
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!invoice || !project || !client) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Invoice Data...</div>;

  return (
    <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', padding: '2rem', fontFamily: 'Arial, sans-serif', color: '#000' }}>
      <Toaster position="top-right" />
      <div className="print-controls" style={{ maxWidth: '800px', margin: '0 auto 1rem', display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={handlePrint} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Printer size={18} /> Print / Save PDF
        </button>
      </div>

      {/* Invoice Document */}
      <div className="invoice-document" style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        backgroundColor: 'white', 
        padding: '3rem 4rem', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
          <div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#C5A059', margin: '0 0 0.5rem 0', letterSpacing: '1px' }}>SREE SRS CONSTRUCTIONS</h2>
            <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem' }}>Near Addala Sai Baba Temple, Padmavathi Nagar,</p>
            <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem' }}>Balaji Nagar, Nellore - 524 002</p>
            <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem' }}>Phone: +91 9490142143, 8499849989</p>
            <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem' }}>Email: sreesrsconstructions@gmail.com</p>
            <p style={{ margin: '0', fontSize: '0.95rem' }}>GSTIN: 37BWZPS8630Q1Z0</p>
          </div>
        </div>

        {/* Bill No */}
        <div style={{ textAlign: 'right', marginBottom: '2rem' }}>
          <p style={{ fontWeight: 'bold', margin: 0, fontSize: '1.1rem' }}>BILL NO: {invoice.id.replace('INV-', '')}</p>
        </div>

        {/* Title */}
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0 0 1.5rem 0' }}>SERVICE INVOICE</h3>

        {/* Info Grid */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <div style={{ fontSize: '1rem' }}>
            Bill To: {client.name}
          </div>
          <div style={{ fontSize: '1rem' }}>
            Date: {invoice.date}
          </div>
        </div>
        <div style={{ fontSize: '1rem', marginBottom: '2rem' }}>
          Project Site: {project.name}
        </div>

        {/* Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem', border: '1px solid #000' }}>
          <thead>
            <tr style={{ backgroundColor: '#C5A059', color: 'white' }}>
              <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 'normal', border: '1px solid #000', width: '70%' }}>Detailed Work Description</th>
              <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 'normal', border: '1px solid #000', width: '30%' }}>Amount (INR)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '0.75rem', border: '1px solid #000', minHeight: '60px' }}>
                {invoice.description || 'Initial payment'}
              </td>
              <td style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #000' }}>
                {invoice.subtotal.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Totals */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '0.5rem', gap: '2rem' }}>
          <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Total Payable Balance:</div>
          <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#C5A059' }}>Rs. {invoice.total_amount.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '4rem' }}>
          <div style={{ fontSize: '0.95rem', fontStyle: 'italic', color: '#555' }}>
            Amount in Words: {numberToWords(invoice.total_amount)}
          </div>
        </div>

        {/* Signature */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontWeight: 'bold', margin: '0 0 3rem 0', fontSize: '0.9rem' }}>For SREE SRS CONSTRUCTIONS</p>
            <div style={{ borderBottom: '1px solid #000', width: '200px', margin: '0 auto 0.5rem' }}></div>
            <p style={{ fontWeight: 'bold', margin: 0, fontSize: '0.9rem' }}>Authorized Signatory</p>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .invoice-document, .invoice-document * { visibility: visible; }
          .invoice-document { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none; padding: 0; }
          .print-controls { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default InvoiceView;
