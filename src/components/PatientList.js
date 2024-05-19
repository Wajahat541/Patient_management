import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/apis.js';
import './PatientList.css'; 

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [criteria, setCriteria] = useState({
    age: '',
    gender: '',
    disease: ''
  });
  const [errorMessage, setErrorMessage] = useState('');

  const ageInputRef = useRef(null);
  const genderInputRef = useRef(null);
  const diseaseInputRef = useRef(null);

  const fetchPatients = useCallback(async () => {
    try {
      let response;
      if (criteria.age) {
        response = await api.get(`/patient/age/${criteria.age}`);
      } else if (criteria.gender) {
        response = await api.get(`/patient/gender/${criteria.gender}`);
      } else if (criteria.disease) {
        response = await api.get(`/patient/disease/${criteria.disease}`);
      } else {
        response = await api.get('/patient/get');
      }
      const patientsWithDetails = await Promise.all(response.data.map(async (patient) => {
        const diseasesResponse = await api.get(`/api/diseases/patient/${patient.patientId}`);
        const visitsResponse = await api.get(`/api/visits/patient/${patient.patientId}`);
        return {
          ...patient,
          diseases: diseasesResponse.data,
          visits: visitsResponse.data
        };
      }));
      setPatients(patientsWithDetails);
      setErrorMessage('');
    } catch (error) {
      console.error('Error fetching patients:', error);
      if (error.response?.status === 404) {
        setErrorMessage('Patients not found');
      } else {
        setErrorMessage('Error fetching patients');
      }
    }
  }, [criteria]);

  useEffect(() => {
    fetchPatients(); 
  }, [fetchPatients]);

  const handleCriteriaChange = (e) => {
    const { name, value } = e.target;

    setCriteria(prevState => {
      const newCriteria = { ...prevState, [name]: value };
      // Clear other fields when one criteria is being set
      if (name === 'age') {
        newCriteria.gender = '';
        newCriteria.disease = '';
      } else if (name === 'gender') {
        newCriteria.age = '';
        newCriteria.disease = '';
      } else if (name === 'disease') {
        newCriteria.age = '';
        newCriteria.gender = '';
      }
      return newCriteria;
    });
  };

  const handleSearch = () => {
    fetchPatients();
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/patient/remove/${id}`);
      setPatients(patients.filter(patient => patient.patientId !== id));
      setErrorMessage('');
    } catch (error) {
      console.error('Error deleting patient:', error);
      setErrorMessage('Error deleting patient');
    }
  };

  return (
    <div className="patient-list-container">
      <h1 className="page-title">Patient List</h1>
      <div className="search-form">
        <label className="search-label">
          Age:
          <input type="text" name="age" value={criteria.age} onChange={handleCriteriaChange} ref={ageInputRef} className="search-input" />
        </label>
        <label className="search-label">
          Gender:
          <input type="text" name="gender" value={criteria.gender} onChange={handleCriteriaChange} ref={genderInputRef} className="search-input" />
        </label>
        <label className="search-label">
          Disease:
          <input type="text" name="disease" value={criteria.disease} onChange={handleCriteriaChange} ref={diseaseInputRef} className="search-input" />
        </label>
        <button onClick={handleSearch} className="search-button">Search</button>
      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <table className="patient-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Phone Number</th>
            <th>Address</th>
            <th>Diseases</th>
            <th>Visits</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient, index) => (
            <tr key={patient.patientId || index}>
              <td>{patient.name}</td>
              <td>{patient.age}</td>
              <td>{patient.gender}</td>
              <td>{patient.phoneNumber}</td>
              <td>{patient.address}</td>
              <td>{patient.diseases && patient.diseases.length > 0 ? patient.diseases.map(disease => disease.diseaseName).join(', ') : 'None'}</td>
              <td>{patient.visits && patient.visits.length > 0 ? patient.visits.map(visit => visit.visitDateTime).join(', ') : 'None'}</td>
              <td>
                <Link to={`/patients/${patient.patientId}`} className="edit-button">Edit</Link>
                <button onClick={() => handleDelete(patient.patientId)} className="delete-button">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/add-patient" className="add-patient-link">Add New Patient</Link>
    </div>
  );
};

export default PatientList;
