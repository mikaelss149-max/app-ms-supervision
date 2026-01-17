
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Inspection } from '../types';

interface Props {
  inspections: Inspection[];
}

const History: React.FC<Props> = ({ inspections }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('');

  const filtered = inspections.filter(i => 
    i.condominiumName.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="p-6 bg-white border-b sticky top-0 z-10 flex items-center space-x-4">
        <button onClick={() => navigate('/')} className="text-slate-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-xl font-bold text-slate-900">Histórico</h1>
      </header>

      <div className="p-4 bg-white border-b">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Filtrar por condomínio..." 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full p-3 pl-10 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-slate-800 outline-none text-sm"
          />
          <svg className="w-5 h-5 absolute left-3 top-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>

      <main className="p-4 flex-1 overflow-y-auto space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">Nenhuma vistoria encontrada.</div>
        ) : (
          filtered.map(inspection => (
            <button 
              key={inspection.id}
              onClick={() => navigate(`/history/${inspection.id}`)}
              className="w-full bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <div className="text-left">
                <h3 className="font-bold text-slate-900">{inspection.condominiumName}</h3>
                <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
                  <span>{new Date(inspection.date).toLocaleDateString('pt-BR')}</span>
                  <span>•</span>
                  <span>{inspection.areas.filter(a => a.status === 'Não Conforme').length} problemas</span>
                </div>
              </div>
              <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          ))
        )}
      </main>
    </div>
  );
};

export default History;
