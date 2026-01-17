
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Condominium, Area } from '../types';
import { DEFAULT_AREAS } from '../constants';

interface Props {
  condos?: Condominium[];
  saveCondo: (condo: Condominium) => void;
}

const CondominiumForm: React.FC<Props> = ({ condos = [], saveCondo }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [tower, setTower] = useState('');
  const [notes, setNotes] = useState('');
  const [areas, setAreas] = useState<Area[]>([]);
  const [newAreaName, setNewAreaName] = useState('');

  // Sincroniza dados do condomínio para edição
  useEffect(() => {
    if (id && condos.length > 0) {
      const condo = condos.find(c => c.id === id);
      if (condo) {
        setName(condo.name);
        setAddress(condo.address);
        setTower(condo.tower || '');
        setNotes(condo.notes || '');
        setAreas(condo.areas);
      }
    } else if (!id && areas.length === 0) {
      // Carrega áreas padrão apenas se for um novo cadastro e a lista estiver vazia
      setAreas(DEFAULT_AREAS.map(a => ({ id: Math.random().toString(36).substr(2, 9), name: a })));
    }
  }, [id, condos]);

  const addArea = useCallback(() => {
    const trimmedName = newAreaName.trim();
    if (trimmedName) {
      setAreas(prev => [...prev, { 
        id: Math.random().toString(36).substr(2, 9), 
        name: trimmedName 
      }]);
      setNewAreaName(''); // Limpa o campo após adicionar
    }
  }, [newAreaName]);

  const removeArea = (areaId: string) => {
    setAreas(prev => prev.filter(a => a.id !== areaId));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim()) {
      alert('Nome e endereço são obrigatórios');
      return;
    }
    
    const condo: Condominium = {
      id: id || Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      address: address.trim(),
      tower: tower.trim(),
      notes: notes.trim(),
      areas
    };
    saveCondo(condo);
    navigate('/condos');
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <header className="p-6 border-b bg-white sticky top-0 z-10 flex items-center shadow-sm">
        <button 
          type="button"
          onClick={() => navigate('/condos')} 
          className="mr-4 text-slate-600 p-1 active:bg-slate-100 rounded-full"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-bold text-slate-900">{id ? 'Editar' : 'Novo'} Condomínio</h1>
      </header>

      <form onSubmit={handleSave} className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6 pb-32">
          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Informações Básicas</h2>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Nome do Condomínio</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none text-slate-900"
                placeholder="Ex: Edifício Central Park"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Endereço Completo</label>
              <input 
                type="text" 
                value={address} 
                onChange={e => setAddress(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none text-slate-900"
                placeholder="Rua, número, bairro..."
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Bloco / Torre</label>
                <input 
                  type="text" 
                  value={tower} 
                  onChange={e => setTower(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none text-slate-900"
                  placeholder="Ex: Torre B"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Observações Gerais</label>
              <textarea 
                value={notes} 
                onChange={e => setNotes(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none min-h-[80px] text-slate-900"
                placeholder="Notas sobre o acesso ou particularidades..."
              />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Ambientes para Vistoria</h2>
            
            <div className="flex space-x-2">
              <input 
                type="text" 
                autoComplete="off"
                value={newAreaName} 
                onChange={e => setNewAreaName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addArea();
                  }
                }}
                className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-slate-900 text-slate-900"
                placeholder="Nova área (ex: Academia)"
              />
              <button 
                type="button" 
                onClick={(e) => {
                  e.preventDefault();
                  addArea();
                }}
                className="bg-slate-900 text-white px-6 rounded-xl font-bold active:bg-slate-700"
              >
                Add
              </button>
            </div>

            <div className="space-y-2">
              {areas.map((area) => (
                <div key={area.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                  <span className="text-sm font-medium text-slate-700">{area.name}</span>
                  <button 
                    type="button" 
                    onClick={() => removeArea(area.id)} 
                    className="text-red-400 p-1 active:bg-red-50 rounded-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="p-6 bg-white border-t fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto w-full z-20">
          <button 
            type="submit"
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold shadow-xl active:scale-[0.98] transition-transform uppercase tracking-wider"
          >
            Salvar Condomínio
          </button>
        </div>
      </form>
    </div>
  );
};

export default CondominiumForm;
