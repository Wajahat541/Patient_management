import React, { useState, useEffect } from 'react';
import api from '../utils/apis';

const VisitComponent = ({ onChange }) => {
  const [visits, setVisits] = useState([]);
  const [selectedVisit, setSelectedVisit] = useState('');

  useEffect(() => {
    api.get('/api/visits')
      .then(response => setVisits(response.data))
      .catch(error => console.error('Error fetching visits:', error));
  }, []);

  const handleVisitChange = e => {
    setSelectedVisit(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div>
      <label>
        Select Visit:
        <select name="visit" value={selectedVisit} onChange={handleVisitChange}>
          <option value="">-- Select --</option>
          {visits.map(visit => (
            <option key={visit.visitId} value={visit.visitId}>
              {visit.visitDateTime}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default VisitComponent;
