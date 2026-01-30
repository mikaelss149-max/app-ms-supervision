import React, { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Condominium, Inspection, AreaInspection, InspectionStatus } from '../types';

interface Props {
  condos: Condominium[];
  saveInspection: (inspection: Inspection) => void;
}

const InspectionWizard: React.FC<Props> = ({ condos, saveInspection }) => {
  const { condoId } = useParams();
  const navigate = useNavigate();
  const condo = condos.find(c => c.id === condoId);

  const [currentStep, setCurrentStep] = useState(0);
  const [areaInspections, setAreaInspections] = useState<AreaInspection[]>(
    condo?.areas.map(a => ({
      areaId: a.id,
      areaName: a.name,
      status: InspectionStatus.CONFORME,
      notes: '',
      photos: []
    })) || []
  );

  if (!condo) return <div className="p-6 text-center">Condomínio não encontrado.</div>;

  const currentArea = areaInspections[currentStep];

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Added explicit type to 'file' to resolve 'unknown' not assignable to 'Blob' error on line 49
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          if (base64) {
            setAreaInspections(prev => {
              const updated = [...prev];
              updated[currentStep] = {
                ...updated[currentStep],
                photos: [...updated[currentStep].photos, base64]
              };
              return updated;
            });
          }
        };
        reader.readAsDataURL(file);
      });
    }
    e.target.value = '';
  };

  const removePhoto = (index: number) => {
    setAreaInspections(prev => {
      const updated = [...prev];
      const newPhotos = [...updated[currentStep].photos];
      newPhotos.splice(index, 1);
      updated[currentStep] = { ...updated[currentStep], photos: newPhotos };
      return updated;
    });
  };

  const updateStatus = (status: InspectionStatus) => {
    setAreaInspections(prev => {
      const updated = [...prev];
      updated[currentStep] = { ...updated[currentStep], status };
      return updated;
    });
  };

  const updateNotes = (notes: string) => {
    setAreaInspections(prev => {
      const updated = [...prev];
      updated[currentStep] = { ...updated[currentStep], notes };
      return updated;
    });
  };

  const nextStep = () => {
    if (currentStep < areaInspections.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      finishInspection();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const finishInspection = () => {
    const newInspection: Inspection = {
      id: Math.random().toString(36).substr(2, 9),
      condominiumId: condo.id,
      condominiumName: condo.name,
      date: new Date().toISOString(),
      inspector: 'Mikael',
      areas: areaInspections
    };
    saveInspection(newInspection);
    navigate(`/history/${newInspection.id}`);
  };

  const progress = ((currentStep + 1) / areaInspections.length) * 100;

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="p-4 bg-white border-b flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <button onClick={() => navigate('/condos')} className="text-slate-400 p-2 active:bg-slate-100 rounded-full">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <div className="text-center px-2 flex-1">
          <h2 className="text-[9px] font-black text-slate-400 uppercase tracking-widest truncate">{condo.name}</h2>
          <p className="text-sm font-bold text-slate-800">Vistoria em Andamento</p>
        </div>
        <div className="w-12 text-right font-black text-xs text-slate-400 bg-slate-50 py-1 px-2 rounded-lg">
          {currentStep + 1}/{areaInspections.length}
        </div>
      </header>

      <div className="w-full h-1.5 bg-slate-200">
        <div className="h-full bg-slate-900 transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
      </div>

      <main className="p-6 flex-1 overflow-y-auto">
        <div className="mb-8">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ambiente Selecionado</span>
          <h1 className="text-2xl font-black text-slate-900 mt-1 leading-tight">{currentArea.areaName}</h1>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <button 
              type="button"
              onClick={() => updateStatus(InspectionStatus.CONFORME)}
              className={`p-5 rounded-2xl flex flex-col items-center justify-center space-y-3 border-2 transition-all ${currentArea.status === InspectionStatus.CONFORME ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md' : 'border-white bg-white text-slate-300 shadow-sm'}`}
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${currentArea.status === InspectionStatus.CONFORME ? 'bg-emerald-500 text-white shadow-lg scale-110' : 'bg-slate-100'}`}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
              </div>
              <span className="font-black text-[10px] uppercase tracking-wider">Conforme</span>
            </button>
            <button 
              type="button"
              onClick={() => updateStatus(InspectionStatus.NAO_CONFORME)}
              className={`p-5 rounded-2xl flex flex-col items-center justify-center space-y-3 border-2 transition-all ${currentArea.status === InspectionStatus.NAO_CONFORME ? 'border-red-500 bg-red-50 text-red-700 shadow-md' : 'border-white bg-white text-slate-300 shadow-sm'}`}
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${currentArea.status === InspectionStatus.NAO_CONFORME ? 'bg-red-500 text-white shadow-lg scale-110' : 'bg-slate-100'}`}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
              </div>
              <span className="font-black text-[10px] uppercase tracking-wider">Não Conforme</span>
            </button>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Observações Técnicas</label>
            <textarea 
              value={currentArea.notes}
              onChange={e => updateNotes(e.target.value)}
              className="w-full p-5 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-slate-900 outline-none min-h-[160px] text-slate-700 text-base"
              placeholder="Descreva detalhes..."
              autoComplete="off"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4 px-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registros Fotográficos</label>
              <span className="text-[10px] font-black text-slate-900 bg-slate-200 px-2 py-0.5 rounded-full">{currentArea.photos.length} / 6</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {currentArea.photos.map((photo, index) => (
                <div key={index} className="relative aspect-square">
                  <img src={photo} className="w-full h-full object-cover rounded-2xl border-2 border-white shadow-sm" alt="Vistoria" />
                  <button 
                    onClick={() => removePhoto(index)}
                    className="absolute -top-2 -right-2 bg-slate-900 text-white rounded-full p-1.5 shadow-xl"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
              {currentArea.photos.length < 6 && (
                <label className="aspect-square bg-white rounded-2xl flex flex-col items-center justify-center text-slate-400 cursor-pointer border-2 border-dashed border-slate-200 shadow-sm">
                  <input type="file" multiple accept="image/*" onChange={handlePhoto} className="hidden" />
                  <svg className="w-8 h-8 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span className="text-[10px] font-black mt-2">FOTO</span>
                </label>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="p-6 bg-white border-t flex space-x-4 z-10">
        {currentStep > 0 && (
          <button 
            type="button"
            onClick={prevStep}
            className="flex-1 border-2 border-slate-100 text-slate-500 py-4 rounded-xl font-black text-sm uppercase tracking-wider"
          >
            Anterior
          </button>
        )}
        <button 
          type="button"
          onClick={nextStep}
          className={`bg-slate-900 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-xl ${currentStep > 0 ? 'flex-[1.5]' : 'w-full'}`}
        >
          {currentStep < areaInspections.length - 1 ? 'Próximo Item' : 'Finalizar Vistoria'}
        </button>
      </footer>
    </div>
  );
};

export default InspectionWizard;