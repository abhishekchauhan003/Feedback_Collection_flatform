import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { feedback } from '../services/api';

export default function Feedback() {
  const { businessId, branchId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [comment, setComment] = useState('');
  const [feedbackData, setFeedbackData] = useState(null);
  const [feedbackId, setFeedbackId] = useState(null);
  const [drafts, setDrafts] = useState([]);
  const [selectedDraft, setSelectedDraft] = useState('');
  const [editedText, setEditedText] = useState('');

  // Available tags (hardcoded for demo; you can fetch from /experienceTags)
  const availableTags = ['Good food', 'Fast service', 'Clean environment', 'Friendly staff', 'Value for money'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await feedback.submit({ businessId, branchId, rating, selectedTags, customerComment: comment });
    setFeedbackId(res.data._id);
    setFeedbackData(res.data);
    setDrafts(res.data.generatedDrafts);
    setSelectedDraft(res.data.generatedDrafts[0] || '');
  };

  const handleRegenerate = async () => {
    const res = await feedback.regenerate(feedbackId);
    setDrafts(res.data.generatedDrafts);
    setSelectedDraft(res.data.generatedDrafts[0] || '');
  };

  const handleUpdate = async () => {
    await feedback.update(feedbackId, { selectedDraft: selectedDraft, editedFinalText: editedText });
    alert('Updated!');
  };

  const handleRedirect = async () => {
    await feedback.redirect(feedbackId);
    // Navigate to reviewDestination (we don't have it here; we can fetch business)
    navigate('/'); // or external URL
  };

  if (feedbackData) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Your Feedback</h2>
        <div className="mb-4">Rating: {feedbackData.rating} stars</div>
        <div className="mb-4">Tags: {feedbackData.selectedTags.join(', ')}</div>
        <div className="mb-4">Comment: {feedbackData.customerComment}</div>
        <h3 className="text-xl font-semibold mb-2">AI‑Generated Drafts</h3>
        {drafts.map((draft, idx) => (
          <div key={idx} className="border p-2 mb-2 rounded">
            <input
              type="radio"
              name="draft"
              value={draft}
              checked={selectedDraft === draft}
              onChange={() => setSelectedDraft(draft)}
            />
            <label className="ml-2">{draft}</label>
          </div>
        ))}
        <div className="mt-4">
          <textarea
            className="w-full p-2 border rounded"
            rows="3"
            placeholder="Edit final text"
            value={editedText || selectedDraft}
            onChange={(e) => setEditedText(e.target.value)}
          />
        </div>
        <div className="mt-4 space-x-2">
          <button onClick={handleUpdate} className="bg-blue-500 text-white px-4 py-2 rounded">Save Selection</button>
          <button onClick={handleRegenerate} className="bg-yellow-500 text-white px-4 py-2 rounded">Regenerate</button>
          <button onClick={handleRedirect} className="bg-green-500 text-white px-4 py-2 rounded">Post to Review</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Leave a Review</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-semibold">Rating</label>
          <div className="flex space-x-2">
            {[1,2,3,4,5].map(star => (
              <button
                key={star}
                type="button"
                className={`text-2xl ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                onClick={() => setRating(star)}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Experience Tags</label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map(tag => (
              <button
                key={tag}
                type="button"
                className={`px-3 py-1 rounded border ${selectedTags.includes(tag) ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                onClick={() => {
                  if (selectedTags.includes(tag)) setSelectedTags(selectedTags.filter(t => t !== tag));
                  else setSelectedTags([...selectedTags, tag]);
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Optional Comment</label>
          <textarea className="w-full p-2 border rounded" rows="3" value={comment} onChange={(e) => setComment(e.target.value)} />
        </div>
        <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded">Submit</button>
      </form>
    </div>
  );
}