import React, { useState } from 'react';

const AddVisitForm = ({ onSuccess, onClose }) => {
  const [visitData, setVisitData] = useState({
    visitDateAndTime: '',
  });

  const handleChange = e => {
    setVisitData({ ...visitData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSuccess(visitData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Visit Date and Time:
        <input type="datetime-local" name="visitDateAndTime" value={visitData.visitDateAndTime} onChange={handleChange} required />
      </label>
      <button type="submit">Add Visit</button>
    </form>
  );
};

export default AddVisitForm;
