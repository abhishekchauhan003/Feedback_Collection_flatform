import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { analytics } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function Analytics() {
  const { businessId } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    const res = await analytics.get(businessId);
    setData(res.data);
  };

  if (!data) return <div>Loading...</div>;

  // Prepare data for charts
  const tagData = Object.entries(data.tagFrequency).map(([name, value]) => ({ name, value }));
  const ratingData = Array.from({ length: 5 }, (_, i) => i+1).map(r => ({
    name: `${r}★`,
    count: data.recentFeedbacks.filter(f => f.rating === r).length,
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Analytics</h1>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="border p-4 rounded shadow">
          <p className="text-gray-500">Total Feedbacks</p>
          <p className="text-3xl font-bold">{data.total}</p>
        </div>
        <div className="border p-4 rounded shadow">
          <p className="text-gray-500">Average Rating</p>
          <p className="text-3xl font-bold">{data.averageRating}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="border p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Rating Distribution</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ratingData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="border p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Top Tags</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={tagData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60}>
                {tagData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 border p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Recent Feedbacks</h2>
        {data.recentFeedbacks.map(f => (
          <div key={f.id} className="border-b py-2">
            <div className="flex items-center">
              <span className="font-bold mr-2">{f.rating}★</span>
              <span className="text-gray-600">{f.tags.join(', ')}</span>
            </div>
            {f.comment && <p className="text-sm text-gray-500">{f.comment}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}