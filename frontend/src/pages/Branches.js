import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { qr } from '../services/api';

export default function Branches() {
  const { businessId } = useParams();
  const [branches, setBranches] = useState([]);
  const [form, setForm] = useState({ branchName: '', address: '' });

  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = async () => {
    const res = await qr.getBranches(businessId);
    setBranches(res.data);
  };

  const createBranch = async (e) => {
    e.preventDefault();
    await qr.createBranch({ businessId, ...form });
    setForm({ branchName: '', address: '' });
    loadBranches();
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Branches</h1>
      <form onSubmit={createBranch} className="mb-8 space-y-4">
        <input className="w-full p-2 border rounded" placeholder="Branch Name" value={form.branchName} onChange={(e) => setForm({...form, branchName: e.target.value})} />
        <input className="w-full p-2 border rounded" placeholder="Address" value={form.address} onChange={(e) => setForm({...form, address: e.target.value})} />
        <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded">Create Branch</button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {branches.map(b => (
          <div key={b._id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{b.branchName}</h2>
            <p className="text-gray-600">{b.address}</p>
            {b.qrCodeImage && <img src={b.qrCodeImage} alt="QR" className="mt-2 w-32 h-32" />}
          </div>
        ))}
      </div>
    </div>
  );
}