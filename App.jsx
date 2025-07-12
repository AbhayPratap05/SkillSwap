import React, { useState } from 'react';

export default function App() {
  const [form, setForm] = useState({
    name: '',
    location: '',
    profilePhoto: '',
    skillsOffered: '',
    skillsWanted: '',
    availability: '',
    visibility: 'public',
  });

  const [searchSkill, setSearchSkill] = useState('');
  const [swapRequests, setSwapRequests] = useState([]);
  const [ratings, setRatings] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitForm = () => {
    setSwapRequests([...swapRequests, form]);
    alert('Swap Request Submitted!');
    setForm({
      name: '',
      location: '',
      profilePhoto: '',
      skillsOffered: '',
      skillsWanted: '',
      availability: '',
      visibility: 'public',
    });
  };

  const handleRating = (index, feedback, stars) => {
    setRatings([...ratings, { index, feedback, stars }]);
  };

  const filteredRequests = swapRequests.filter((req) =>
    req.skillsOffered.toLowerCase().includes(searchSkill.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">Skill Swap Platform</h1>

        {/* Skill Search Bar */}
        <input
          type="text"
          placeholder="Search skills offered..."
          value={searchSkill}
          onChange={(e) => setSearchSkill(e.target.value)}
          className="w-full mb-6 p-3 border rounded-lg"
        />

        {/* Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Name" name="name" value={form.name} onChange={handleChange} />
          <Input label="Location (Optional)" name="location" value={form.location} onChange={handleChange} />
          <Input label="Profile Photo URL (Optional)" name="profilePhoto" value={form.profilePhoto} onChange={handleChange} />
          <Input label="Skills Offered" name="skillsOffered" value={form.skillsOffered} onChange={handleChange} />
          <Input label="Skills Wanted" name="skillsWanted" value={form.skillsWanted} onChange={handleChange} />

          <div>
            <label className="block text-sm font-medium text-gray-700">Availability</label>
            <select name="availability" value={form.availability} onChange={handleChange} className="w-full mt-1 p-2 border rounded">
              <option value="">Select</option>
              <option value="Weekends">Weekends</option>
              <option value="Evenings">Evenings</option>
              <option value="Anytime">Anytime</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Profile Visibility</label>
            <select name="visibility" value={form.visibility} onChange={handleChange} className="w-full mt-1 p-2 border rounded">
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>

        <button
          onClick={submitForm}
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Swap Request
        </button>

        {/* Display Requests */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Matching Swap Requests</h2>
          {filteredRequests.length === 0 ? (
            <p className="text-gray-500">No matching requests found.</p>
          ) : (
            filteredRequests.map((req, index) => (
              <div key={index} className="border rounded p-4 mb-4 bg-gray-50">
                <p><strong>Name:</strong> {req.name}</p>
                <p><strong>Skills Offered:</strong> {req.skillsOffered}</p>
                <p><strong>Skills Wanted:</strong> {req.skillsWanted}</p>
                <p><strong>Availability:</strong> {req.availability}</p>
                <p><strong>Visibility:</strong> {req.visibility}</p>

                {/* Feedback Form */}
                <div className="mt-3">
                  <label className="text-sm text-gray-700">Give Feedback:</label>
                  <input
                    type="text"
                    placeholder="Write feedback..."
                    onBlur={(e) => handleRating(index, e.target.value, 5)}
                    className="w-full mt-1 p-2 border rounded"
                  />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Feedback List */}
        {ratings.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Feedback Given</h2>
            {ratings.map((r, i) => (
              <div key={i} className="bg-white border p-3 mb-2 rounded shadow-sm">
                <p><strong>User:</strong> {swapRequests[r.index]?.name}</p>
                <p><strong>Stars:</strong> ⭐ {r.stars}</p>
                <p><strong>Feedback:</strong> {r.feedback}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Input({ label, name, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full mt-1 p-2 border rounded"
      />
    </div>
  );
}
