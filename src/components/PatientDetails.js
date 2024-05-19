import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/apis.js';
import './PatientDetails.css';

const PatientDetails = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [editedPatient, setEditedPatient] = useState({});
  const [diseases, setDiseases] = useState([]);
  const [visits, setVisits] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingDiseases, setEditingDiseases] = useState([]);
  const [editingVisits, setEditingVisits] = useState([]);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const patientResponse = await api.get(`/patient/getPatientById/${id}`);
        const diseasesResponse = await api.get(`/api/diseases/patient/${id}`);
        const visitsResponse = await api.get(`/api/visits/patient/${id}`);

        setPatient(patientResponse.data);
        setEditedPatient(patientResponse.data);
        setDiseases(diseasesResponse.data);
        setEditingDiseases(diseasesResponse.data);
        setVisits(visitsResponse.data);
        setEditingVisits(visitsResponse.data);
      } catch (error) {
        console.error('Error fetching patient details:', error);
      }
    };

    fetchPatientDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPatient(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleDiseaseChange = (index, e) => {
    const { name, value } = e.target;
    setEditingDiseases(prevState => {
      const newDiseases = [...prevState];
      newDiseases[index][name] = value;
      return newDiseases;
    });
  };

  const handleVisitChange = (index, e) => {
    const { name, value } = e.target;
    setEditingVisits(prevState => {
      const newVisits = [...prevState];
      newVisits[index][name] = value;
      return newVisits;
    });
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/patient/update/${id}`, editedPatient);
      await Promise.all(editingDiseases.map(disease => api.put(`/api/diseases/${disease.diseaseId}`, { ...disease, patientId: id })));
      await Promise.all(editingVisits.map(visit => api.put(`/api/visits/${visit.visitId}`, { ...visit, patientId: id })));
      setIsEditing(false);
      setDiseases(editingDiseases);
      setVisits(editingVisits);
      setPatient(editedPatient);
    } catch (error) {
      console.error('Error updating patient:', error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  if (!patient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="patient-details-container">
      <h2>Patient Details</h2>
      {isEditing ? (
        <div className="edit-form">
          <label className="form-label">
            Name:
            <input type="text" name="name" value={editedPatient.name} onChange={handleInputChange} className="form-input" />
          </label>
          <label className="form-label">
            Age:
            <input type="text" name="age" value={editedPatient.age} onChange={handleInputChange} className="form-input" />
          </label>
          <label className="form-label">
            Gender:
            <input type="text" name="gender" value={editedPatient.gender} onChange={handleInputChange} className="form-input" />
          </label>

          <h3>Diseases</h3>
          {editingDiseases.map((disease, index) => (
            <div key={disease.diseaseId} className="form-group">
              <input type="text" name="diseaseName" value={disease.diseaseName} onChange={(e) => handleDiseaseChange(index, e)} className="form-input" />
            </div>
          ))}

          <h3>Visits</h3>
          {editingVisits.map((visit, index) => (
            <div key={visit.visitId} className="form-group">
              <input type="text" name="visitDateTime" value={visit.visitDateTime} onChange={(e) => handleVisitChange(index, e)} className="form-input" />
            </div>
          ))}

          <button onClick={handleUpdate} className="form-button save-button">Save</button>
          <button onClick={handleCancelEdit} className="form-button cancel-button">Cancel</button>
        </div>
      ) : (
        <div className="patient-details">
          <p><strong>Name:</strong> {patient.name}</p>
          <p><strong>Age:</strong> {patient.age}</p>
          <p><strong>Gender:</strong> {patient.gender}</p>

          <h3>Diseases</h3>
          {diseases.length > 0 ? (
            <ul>
              {diseases.map(disease => (
                <li key={disease.diseaseId}>{disease.diseaseName}</li>
              ))}
            </ul>
          ) : (
            <p>No diseases recorded.</p>
          )}

          <h3>Visits</h3>
          {visits.length > 0 ? (
            <ul>
              {visits.map(visit => (
                <li key={visit.visitId}>{visit.visitDateTime}</li>
              ))}
            </ul>
          ) : (
            <p>No visits recorded.</p>
          )}

          <button onClick={() => setIsEditing(true)} className="edit-button">Edit</button>
        </div>
      )}
    </div>
  );
};

export default PatientDetails;
