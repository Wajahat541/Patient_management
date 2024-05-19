import React, { useState } from 'react';
import axios from 'axios';

const UpdatePatientForm = ({ patientId }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [disease, setDisease] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/patient/update/${patientId}`, {
        name,
        age,
        gender,
        disease
      });
      console.log('Patient updated successfully');
    } catch (error) {
      console.error('Error updating patient:', error);
    }
  };

  return (
    <div>
      <h2>Update Patient</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label>Age:</label>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
        </div>
        <div>
          <label>Gender:</label>
          <input type="text" value={gender} onChange={(e) => setGender(e.target.value)} />
        </div>
        <div>
          <label>Disease:</label>
          <input type="text" value={disease} onChange={(e) => setDisease(e.target.value)} />
        </div>
        <button type="submit">Update Patient</button>
      </form>
    </div>
  );
};

export default UpdatePatientForm;
