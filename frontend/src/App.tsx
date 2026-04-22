import React, { useState, useEffect } from 'react';
import './App.css';

// Matches your backend data structure
interface Status {
  id: number;
  title: string;
  message: string;
  severity: string;
  createdAt: number; 
}

const API_URL = 'http://localhost:5000';

function App() {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [formData, setFormData] = useState({ title: '', message: '', severity: 'low' });
  const [loading, setLoading] = useState(true);

  // 1. Initial Data Load
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(`${API_URL}/statuses`);
        if (!res.ok) throw new Error('Failed to fetch data');
        const data = await res.json();
        setStatuses(data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []); // Run once on mount

  // 2. Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/statuses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newItem = await response.json();
        
        // Update the list instantly by adding the server response to the state
        setStatuses((prev) => [newItem, ...prev]); 
        
        // Reset form
        setFormData({ title: '', message: '', severity: 'low' }); 
      }
    } catch (err) {
      console.error("Error posting data:", err);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Status Board</h1>
      </header>

      {/* FORM SECTION */}
      <section className="form-container">
        <form onSubmit={handleSubmit} className="status-form">
          <input 
            placeholder="Service Title" 
            value={formData.title} 
            onChange={(e) => setFormData({...formData, title: e.target.value})} 
            required 
          />
          <textarea 
            placeholder="Describe the current status or issue..." 
            value={formData.message} 
            onChange={(e) => setFormData({...formData, message: e.target.value})} 
            required 
          />
          <div className="form-footer">
            <select 
              value={formData.severity} 
              onChange={(e) => setFormData({...formData, severity: e.target.value})}
            >
              <option value="low">Low Severity</option>
              <option value="medium">Medium Severity</option>
              <option value="high">High Severity</option>
              <option value="critical">Critical</option>
            </select>
            <button type="submit">Post Update</button>
          </div>
        </form>
      </section>

      <hr />

      {/* FEED SECTION */}
      <div className="feed">
        {loading ? (
          <p className="loading-text">Loading updates from server...</p>
        ) : statuses.length === 0 ? (
          <p className="empty-text">All systems operational. No updates reported.</p>
        ) : (
          statuses.map(s => (
            <div key={s.id} className={`card severity-${s.severity}`}>
              <div className="card-header">
                <h3>{s.title}</h3>
                <span className="badge">{s.severity.toUpperCase()}</span>
              </div>
              <p>{s.message}</p>
              <small>{new Date(s.createdAt).toLocaleString()}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;