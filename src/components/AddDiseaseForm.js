import React, { useState } from 'react';

const AddDiseaseForm = ({ onSuccess, onClose }) => {
  const [diseaseData, setDiseaseData] = useState({
    diseaseName: '',
  });

  const handleChange = e => {
    setDiseaseData({ ...diseaseData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSuccess(diseaseData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Disease Name:
        <input type="text" name="diseaseName" value={diseaseData.diseaseName} onChange={handleChange} required />
      </label>
      <button type="submit">Add Disease</button>
    </form>
  );
};

export default AddDiseaseForm;
