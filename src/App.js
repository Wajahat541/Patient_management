import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PatientList from './components/PatientList';
import PatientDetails from './components/PatientDetails';
import AddPatientForm from './components/AddPatientForm';
import UpdatePatientForm from './components/UpdatePatientForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PatientList />} />
        <Route path="/patients/:id" element={<PatientDetails />} />
        <Route path="/add-patient" element={<AddPatientForm />} />
        <Route path="/update-patient/:id" element={<UpdatePatientForm />} />
      </Routes>
    </Router>
  );
}
export default App;