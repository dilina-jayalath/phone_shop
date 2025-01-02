import React, { useState } from 'react';
import { useSelector } from 'react-redux';

export default function RepairForm() {
  const [deviceType, setDeviceType] = useState('');
  const [deviceName, setDevice] = useState('');
  const [issue, setIssue] = useState('');
  const [notes, setNotes] = useState('');

  const userId = useSelector((state) => state.auth.userId);
  const handleSubmit = (e) => {


    e.preventDefault();
    const newRepair = {
   
      deviceType,
      deviceName,
      issue,
      notes,
      userId,
    };
    addRepair(newRepair);
    // Clear form fields after submission
    setDeviceType('');
    setDevice('');
    setIssue('');
    setNotes('');
  };

  const addRepair = (newRepair) => {
    fetch('http://localhost/api/repairs.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newRepair),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          alert('Repair added successfully!');
        } else {
          alert(data.error || 'Failed to add repair');
        }
      })
      .catch((error) => console.error('Error:', error));
  };
  

  return (
    <div className='py-10'>
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
        <label className="block text-gray-700">Device Name</label>
        <input
          type="text"
          value={deviceName}
          onChange={(e) => setDevice(e.target.value)}
          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
          placeholder="Enter deviceName Name"
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
