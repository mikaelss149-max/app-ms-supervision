
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Condominium } from '../types';

interface Props {
  condos: Condominium[];
  deleteCondo: (id: string) => void;
}

const CondominiumList: React.FC<Props> = ({ condos, deleteCondo }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full">
      <header className="p-6 border-b bg-white sticky top-0 z-10 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="text-slate-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-lg font-bold text-slate-900">Condomínios</h1>
        <Link to="/condos/new" className="bg-slate-800 text-white p-2 rounded-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
        </Link>
      </header>

      <main className="p-4 flex-1 overflow-y-auto">
        {condos.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p>Nenhum condomínio cadastrado.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {condos.map(condo => (
              <div key={condo.id} className="bg-white border rounded-xl overflow-hidden shadow-sm">
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-slate-900">{condo.name}</h3>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => navigate(`/condos/edit/${condo.id}`)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button 
                        onClick={() => { if(confirm('Excluir condomínio?')) deleteCondo(condo.id) }}
                        className="text-red-400 hover:text-red-600"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{condo.address}</p>
                  <div className="mt-3 flex items-center text-xs text-slate-400">
                    <span className="mr-3">{condo.areas.length} áreas cadastradas</span>
                  </div>
                </div>
                <button 
                  onClick={() => navigate(`/inspection/${condo.id}`)}
                  className="w-full bg-slate-900 text-white py-3 font-bold text-sm uppercase tracking-wider"
                >
                  Nova Vistoria
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CondominiumList;
