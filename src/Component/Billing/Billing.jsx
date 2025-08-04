import React, { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Billing.css';

function Billing() {
  const [customer, setCustomer] = useState('');
  const [date, setDate] = useState('');
  const [items, setItems] = useState([{ name: '', quantity: 1, price: 0 }]);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = field === 'name' ? value : parseFloat(value);
    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([...items, { name: '', quantity: 1, price: 0 }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const getTotal = () => {
    return items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  };

  const handleGeneratePDF = async () => {
    const invoice = document.getElementById('invoiceContent');

    await new Promise((resolve) => setTimeout(resolve, 100));

    html2canvas(invoice, {
      scale: 2,
      useCORS: true,
      windowWidth: document.documentElement.scrollWidth,
      windowHeight: document.documentElement.scrollHeight
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice_${customer || 'Customer'}_${Date.now()}.pdf`);
    });
  };

  return (
    <div className="container my-5">

      {/* 📦 Invoice area to include in PDF */}
      <div id="invoiceContent" className="billing-box p-4 shadow rounded bg-white">
        <h2 className="text-center text-primary mb-4">🧾 OM CLOTH STORE</h2>

        <div className="row mb-3">
          <div className="col-md-6">
            <label>Customer Name</label>
            <input
              type="text"
              className="form-control"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              placeholder="Enter customer name"
            />
          </div>
          <div className="col-md-6">
            <label>Billing Date</label>
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        <table className="table table-bordered text-center">
          <thead className="table-light">
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Total</th>
              <th>❌</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx}>
                <td>
                  <input
                    className="form-control"
                    value={item.name}
                    onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                    placeholder="Item name"
                  />
                </td>
                <td>
                  <input
                    className="form-control"
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="form-control"
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.price}
                    onChange={(e) => handleItemChange(idx, 'price', e.target.value)}
                  />
                </td>
                <td>₹{(item.quantity * item.price).toFixed(2)}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => removeItem(idx)}>
                    ✖
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ✅ Included in PDF */}
        <div className="text-end mb-3">
          <button className="btn btn-outline-success" onClick={addItem}>
            + Add Item
          </button>
        </div>

        <div className="text-end">
          <p><strong>Subtotal:</strong> ₹{getTotal().toFixed(2)}</p>
          <h5><strong>Total:</strong> ₹{getTotal().toFixed(2)}</h5>
        </div>
      </div>

      {/* ❌ Not included in PDF */}
      <div className="text-center mt-4">
        <button className="btn btn-primary" onClick={handleGeneratePDF}>
          Generate Invoice PDF
        </button>
      </div>
    </div>
  );
}

export default Billing;
