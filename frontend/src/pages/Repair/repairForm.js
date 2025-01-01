import React, { useState } from 'react';

export default function RepairForm({ addRepair }) {
  const [deviceType, setDeviceType] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [issue, setIssue] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRepair = {
      id: Date.now(),
      deviceType,
      brand,
      model,
      issue,
      notes,
    };
    addRepair(newRepair);
    // Clear form fields after submission
    setDeviceType('');
    setBrand('');
    setModel('');
    setIssue('');
    setNotes('');
  };

  return (
    <div className='p-10'>
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Add Repair</h2>
      <div className="mb-4">
        <label className="block text-gray-700">Device Type</label>
        <select
          value={deviceType}
          onChange={(e) => setDeviceType(e.target.value)}
          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
          required
        >
          <option value="">Select Device Type</option>
          <option value="Mobile Phone">Mobile Phone</option>
          <option value="Tablet">Tablet</option>
          <option value="Smart Watch">Smart Watch</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Brand</label>
        <input
          type="text"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
          placeholder="Enter brand"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Model</label>
        <input
          type="text"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
          placeholder="Enter model"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Issue Description</label>
        <textarea
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
          placeholder="Describe the issue"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Additional Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
          placeholder="Any additional notes"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
      >
        Submit Repair
      </button>
    </form>
    </div>
  );
}
