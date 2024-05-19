import React, { useState, useEffect } from 'react';
import api from '../utils/apis';
import AddDiseaseForm from './AddDiseaseForm';
import AddVisitForm from './AddVisitForm';
import Modal from 'react-modal';
import './AddPatientForm.css';

Modal.setAppElement('#root');

const AddPatientForm = () => {
  const [patientFormData, setPatientFormData] = useState({
    name: '',
    age: '',
    gender: '',
    phoneNumber: '',
    address: '',
  });
  const [diseases, setDiseases] = useState([]);
  const [visits, setVisits] = useState([]);
  const [tempDiseases, setTempDiseases] = useState([]);
  const [tempVisits, setTempVisits] = useState([]);
  const [isDiseaseModalOpen, setIsDiseaseModalOpen] = useState(false);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/diseases')
      .then(response => setDiseases(response.data))
      .catch(error => console.error('Error fetching diseases:', error));

    api.get('/api/visits')
      .then(response => setVisits(response.data))
      .catch(error => console.error('Error fetching visits:', error));
  }, []);

  const handleChange = e => {
    setPatientFormData({ ...patientFormData, [e.target.name]: e.target.value });
  };

  const handleAddDisease = newDisease => {
    setTempDiseases([...tempDiseases, newDisease]);
    setIsDiseaseModalOpen(false);
  };

  const handleAddVisit = newVisit => {
    setTempVisits([...tempVisits, newVisit]);
    setIsVisitModalOpen(false);
  };

  const handleSubmit = e => {
    e.preventDefault();
    setError('');

    api.post('/patient/add', patientFormData)
      .then(response => {
        const patientId = response.data.patientId;

        const diseasePromises = tempDiseases.map(disease =>
          api.post('/api/diseases', { ...disease, patientId })
        );

        const visitPromises = tempVisits.map(visit =>
          api.post('/api/visits', { ...visit, patientId })
        );

        return Promise.all([...diseasePromises, ...visitPromises]);
      })
      .then(() => {
        window.location.href = '/';
      })
      .catch(error => {
        console.error('Error adding patient:', error);
        setError('An error occurred while adding the patient. Please try again.');
      });
  };

  return (
    <div className="add-patient-form-container">
      <h2>Add Patient</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="add-patient-form">
        <label className="form-label">
          Name:
          <input
            type="text"
            name="name"
            value={patientFormData.name}
            onChange={handleChange}
            required
            className="form-input"
          />
        </label>
        <label className="form-label">
          Age:
          <input
            type="number"
            name="age"
            value={patientFormData.age}
            onChange={handleChange}
            required
            className="form-input"
          />
        </label>
        <label className="form-label">
          Gender:
          <select
            name="gender"
            value={patientFormData.gender}
            onChange={handleChange}
            required
            className="form-input"
          >
            <option value="">-- Select Gender --</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </label>
        <label className="form-label">
          Phone Number:
          <input
            type="text"
            name="phoneNumber"
            value={patientFormData.phoneNumber}
            onChange={handleChange}
            required
            className="form-input"
          />
        </label>
        <label className="form-label">
          Address:
          <input
            type="text"
            name="address"
            value={patientFormData.address}
            onChange={handleChange}
            required
            className="form-input"
          />
        </label>
        <div className="form-buttons">
          <button type="button" onClick={() => setIsDiseaseModalOpen(true)} className="form-button">
            Add Disease
          </button>
          <button type="button" onClick={() => setIsVisitModalOpen(true)} className="form-button">
            Add Visit
          </button>
          <button type="submit" className="form-button submit-button">Add Patient</button>
        </div>
      </form>
      <Modal
        isOpen={isDiseaseModalOpen}
        onRequestClose={() => setIsDiseaseModalOpen(false)}
        contentLabel="Add Disease"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>Add Disease</h2>
        <AddDiseaseForm onSuccess={handleAddDisease} onClose={() => setIsDiseaseModalOpen(false)} />
      </Modal>
      <Modal
        isOpen={isVisitModalOpen}
        onRequestClose={() => setIsVisitModalOpen(false)}
        contentLabel="Add Visit"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>Add Visit</h2>
        <AddVisitForm onSuccess={handleAddVisit} onClose={() => setIsVisitModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default AddPatientForm;
