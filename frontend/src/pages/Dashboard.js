import React, { useEffect, useState } from 'react';
import { business } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    businessName: '',
    businessType: '',
    reviewDestination: '',
    description: '',
    experienceTags: '',
  });

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth');
      return;
    }
    loadBusinesses();
  }, []);

  const loadBusinesses = async () => {
    try {
      setLoading(true);
      const res = await business.getAll();
      setBusinesses(res.data);
      setError('');
    } catch (err) {
      if (err.response?.status === 401) {
        // Token invalid or expired – redirect to login
        localStorage.removeItem('token');
        navigate('/auth');
      } else {
        setError('Failed to load businesses. Please try again.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createBusiness = async (e) => {
    e.preventDefault();
    try {
      const tags = form.experienceTags.split(',').map(s => s.trim());
      await business.create({ ...form, experienceTags: tags });
      setForm({
        businessName: '',
        businessType: '',
        reviewDestination: '',
        description: '',
        experienceTags: '',
      });
      loadBusinesses(); // refresh list
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating business');
    }
  };

  if (loading) {
    return <div className="p-8">Loading businesses...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <form onSubmit={createBusiness} className="mb-8 space-y-4">
        <input
          className="w-full p-2 border rounded"
          placeholder="Business Name"
          value={form.businessName}
          onChange={(e) => setForm({ ...form, businessName: e.target.value })}
        />
        <input
          className="w-full p-2 border rounded"
          placeholder="Business Type"
          value={form.businessType}
          onChange={(e) => setForm({ ...form, businessType: e.target.value })}
        />
        <input
          className="w-full p-2 border rounded"
          placeholder="Review Destination URL"
          value={form.reviewDestination}
          onChange={(e) => setForm({ ...form, reviewDestination: e.target.value })}
        />
        <input
          className="w-full p-2 border rounded"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          className="w-full p-2 border rounded"
          placeholder="Experience Tags (comma separated)"
          value={form.experienceTags}
          onChange={(e) => setForm({ ...form, experienceTags: e.target.value })}
        />
        <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
          Create Business
        </button>
      </form>

      <div className="grid gap-4">
        {businesses.length === 0 ? (
          <p className="text-gray-500">No businesses yet. Create one above!</p>
        ) : (
          businesses.map((b) => (
            <div key={b._id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{b.businessName}</h2>
              <p className="text-gray-600">{b.businessType}</p>
              <div className="mt-2 space-x-2">
                <Link to={`/branches/${b._id}`} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                  Branches
                </Link>
                <Link to={`/analytics/${b._id}`} className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600">
                  Analytics
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}