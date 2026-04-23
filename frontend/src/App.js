import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit2, Package, DollarSign, List, Activity } from 'lucide-react';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://pharamacymanager-production.up.railway.app/api';

function App() {
  const [medicines, setMedicines] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', quantity: '', category: 'General', statusbar: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/medicines`);
      setMedicines(res.data);
    } catch (err) {
      console.error("Error fetching data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.quantity) return alert("Please fill all fields");

    try {
      if (editingId) {
        await axios.put(`${API_URL}/medicines/${editingId}`, form);
        setEditingId(null);
      } else {
        await axios.post(`${API_URL}/medicines`, form);
      }
      setForm({ name: '', price: '', quantity: '', category: 'General', statusbar: '' });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  const deleteMedicine = async (id) => {
    if (window.confirm("Are you sure you want to delete this medicine?")) {
      try {
        await axios.delete(`${API_URL}/medicines/${id}`);
        fetchData();
      } catch (err) {
        alert("Error deleting medicine");
      }
    }
  };

  const handleEdit = (med) => {
    setForm({ name: med.name, price: med.price, quantity: med.quantity, category: med.category || 'General', statusbar: med.statusbar });
    setEditingId(med._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getStockStatus = (qty) => {
    if (qty === 0) return <span className="badge badge-none">Out of Stock</span>;
    if (qty < 10) return <span className="badge badge-low">Low Stock</span>;
    return <span className="badge badge-stock">In Stock</span>;
  };

  return (
    <div className="app-container">
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Activity size={32} color="var(--primary)" />
          <h1>PharmaCare <span style={{ fontWeight: 300, fontSize: '0.9rem', color: 'var(--text-muted)' }}>v1.0</span></h1>
        </div>
        <div className="med-info">
          <p>Total Items: <strong>{medicines.length}</strong></p>
        </div>
      </header>

      <main className="main-grid">
        <section className="card">
          <h2>{editingId ? 'Update Medicine' : 'Add New Medicine'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Medicine Name</label>
              <div style={{ position: 'relative' }}>
                <input
                  placeholder="Enter name..."
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                <option value="General">General</option>
                <option value="Antibiotics">Antibiotics</option>
                <option value="Painkillers">Painkillers</option>
                <option value="Supplements">Supplements</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Price ($)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  placeholder="0"
                  value={form.quantity}
                  onChange={e => setForm({ ...form, quantity: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Status Bar</label>
                <input
                  type="text"
                  placeholder="Status Bar"
                  value={form.statusbar}
                  onChange={e => setForm({ ...form, statusbar: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" className="btn">
              {editingId ? 'Update Record' : <><Plus size={18} style={{ marginRight: '8px' }} /> Add to Inventory</>}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-secondary"
                style={{ marginTop: '0.5rem' }}
                onClick={() => { setEditingId(null); setForm({ name: '', price: '', quantity: '', category: 'General', statusbar: '' }); }}
              >
                Cancel
              </button>
            )}
          </form>
        </section>

        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <List size={20} color="var(--text-muted)" />
            <h2 style={{ fontSize: '1.25rem' }}>Inventory List</h2>
          </div>

          {loading ? (
            <p>Loading inventory...</p>
          ) : (
            <div className="medicine-list">
              {medicines.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                  <Package size={48} color="var(--border-color)" style={{ marginBottom: '1rem' }} />
                  <p style={{ color: 'var(--text-muted)' }}>No medicines found in inventory.</p>
                </div>
              ) : (
                medicines.map(m => (
                  <div key={m._id} className="medicine-item">
                    <div className="med-info">
                      <h3>{m.name}</h3>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <p style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <DollarSign size={14} /> {m.price}
                        </p>
                        <p style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Package size={14} /> {m.quantity} units
                        </p>
                        {getStockStatus(m.quantity)}
                      </div>
                      {m.statusbar && (
                        <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', fontStyle: 'italic' }}>
                          Status: {m.statusbar}
                        </p>
                      )}
                    </div>
                    <div className="med-actions">
                      <button className="icon-btn" onClick={() => handleEdit(m)}>
                        <Edit2 size={18} />
                      </button>
                      <button className="icon-btn delete" onClick={() => deleteMedicine(m._id)}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
