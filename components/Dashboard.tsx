
import React from 'react';
import { Link } from 'react-router-dom';

interface DashboardProps {
  inspector: string;
}

const Dashboard: React.FC<DashboardProps> = ({ inspector }) => {
  return (
    <div className="flex flex-col flex-1">
      <header className="bg-slate-900 text-white p-6 pt-12 pb-12 rounded-b-[40px] shadow-lg">
        <h1 className="text-xs font-bold uppercase tracking-widest opacity-70">MS SUPERVISION</h1>
        <h2 className="text-3xl font-bold mt-1">Olá, {inspector}</h2>
        <p className="text-sm opacity-80 mt-2">Pronto para iniciar vistorias hoje?</p>
      </header>

      <main className="p-6 grid grid-cols-1 gap-4 -mt-8">
        <Link 
          to="/condos"
          className="bg-white p-6 rounded-2xl shadow-md flex items-center space-x-4 border border-slate-100 hover:bg-slate-50 transition-colors"
        >
          <div className="bg-slate-800 text-white p-3 rounded-xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Gerenciar Condomínios</h3>
            <p className="text-xs text-slate-500">Adicionar, editar e organizar áreas</p>
          </div>
        </Link>

        <Link 
          to="/history"
          className="bg-white p-6 rounded-2xl shadow-md flex items-center space-x-4 border border-slate-100 hover:bg-slate-50 transition-colors"
        >
          <div className="bg-emerald-600 text-white p-3 rounded-xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Histórico de Vistorias</h3>
            <p className="text-xs text-slate-500">Relatórios gerados e arquivos</p>
          </div>
        </Link>
      </main>

      <footer className="mt-auto p-6 text-center text-slate-400 text-xs">
        &copy; {new Date().getFullYear()} MS SUPERVISION - Sistema Profissional
      </footer>
    </div>
  );
};

export default Dashboard;
