
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import CondominiumList from './components/CondominiumList';
import CondominiumForm from './components/CondominiumForm';
import InspectionWizard from './components/InspectionWizard';
import History from './components/History';
import InspectionDetail from './components/InspectionDetail';
import { Condominium, Inspection } from './types';

const App: React.FC = () => {
  const [condos, setCondos] = useState<Condominium[]>(() => {
    const saved = localStorage.getItem('ms_supervision_condos');
    return saved ? JSON.parse(saved) : [];
  });

  const [inspections, setInspections] = useState<Inspection[]>(() => {
    const saved = localStorage.getItem('ms_supervision_inspections');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('ms_supervision_condos', JSON.stringify(condos));
  }, [condos]);

  useEffect(() => {
    localStorage.setItem('ms_supervision_inspections', JSON.stringify(inspections));
  }, [inspections]);

  const addCondo = (condo: Condominium) => setCondos([...condos, condo]);
  const updateCondo = (updated: Condominium) => setCondos(condos.map(c => c.id === updated.id ? updated : c));
  const deleteCondo = (id: string) => setCondos(condos.filter(c => c.id !== id));

  const addInspection = (inspection: Inspection) => setInspections([inspection, ...inspections]);

  return (
    <div className="mobile-frame flex flex-col min-h-screen">
      <HashRouter>
        <Routes>
          <Route path="/" element={<Dashboard inspector="Mikael" />} />
          <Route path="/condos" element={<CondominiumList condos={condos} deleteCondo={deleteCondo} />} />
          <Route path="/condos/new" element={<CondominiumForm saveCondo={addCondo} />} />
          <Route path="/condos/edit/:id" element={<CondominiumForm condos={condos} saveCondo={updateCondo} />} />
          <Route path="/inspection/:condoId" element={<InspectionWizard condos={condos} saveInspection={addInspection} />} />
          <Route path="/history" element={<History inspections={inspections} />} />
          <Route path="/history/:id" element={<InspectionDetail inspections={inspections} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </HashRouter>
    </div>
  );
};

export default App;
