
import React, { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Inspection, InspectionStatus } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Props {
  inspections: Inspection[];
}

const InspectionDetail: React.FC<Props> = ({ inspections }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const inspection = inspections.find(i => i.id === id);

  if (!inspection) {
    return (
      <div className="p-10 text-center">
        <p className="text-slate-500">Vistoria não encontrada.</p>
        <button onClick={() => navigate('/')} className="mt-4 text-slate-900 font-bold underline">Voltar</button>
      </div>
    );
  }

  const generatePDF = async () => {
    if (!reportRef.current || isGenerating) return;
    
    try {
      setIsGenerating(true);
      const element = reportRef.current;
      
      const canvas = await html2canvas(element, { 
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.8);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`MS_RELATORIO_${inspection.condominiumName.toUpperCase().replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar o PDF. Verifique as permissões do navegador.');
    } finally {
      setIsGenerating(false);
    }
  };

  const shareReport = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Relatório MS SUPERVISION - ${inspection.condominiumName}`,
          text: `Vistoria realizada em ${new Date(inspection.date).toLocaleDateString('pt-BR')}`,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Erro ao compartilhar:', err);
      }
    } else {
      alert('Compartilhamento não suportado. Baixe o PDF para enviar.');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <header className="p-4 bg-white border-b flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <button onClick={() => navigate('/history')} className="text-slate-600 p-2 active:bg-slate-100 rounded-full">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="text-center">
          <h1 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Visualização</h1>
          <p className="text-xs font-bold text-slate-900">Relatório Técnico</p>
        </div>
        <div className="flex space-x-1">
          <button 
            onClick={generatePDF} 
            disabled={isGenerating}
            className={`p-2 rounded-full ${isGenerating ? 'text-slate-300' : 'text-slate-900 active:bg-slate-100'}`}
          >
            {isGenerating ? (
              <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            )}
          </button>
          <button onClick={shareReport} className="p-2 text-slate-900 active:bg-slate-100 rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto bg-slate-100 p-4">
        <div ref={reportRef} className="bg-white shadow-xl mx-auto max-w-full overflow-hidden rounded-sm origin-top">
          <div className="p-8 bg-slate-900 text-white flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-black tracking-tighter">MS SUPERVISION</h2>
              <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest mt-1">Relatório de Inspeção Predial</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold opacity-60">EMISSÃO</p>
              <p className="text-sm font-bold">{new Date(inspection.date).toLocaleDateString('pt-BR')}</p>
            </div>
          </div>

          <div className="p-8 space-y-8">
            <div className="grid grid-cols-2 gap-8 pb-8 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Condomínio</span>
                <p className="text-lg font-bold text-slate-900 leading-tight">{inspection.condominiumName}</p>
                <p className="text-xs text-slate-500 mt-1">Status: Concluído</p>
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Responsável</span>
                <p className="text-lg font-bold text-slate-900">{inspection.inspector}</p>
                <p className="text-xs text-slate-500 mt-1">Supervisor de Campo</p>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase text-slate-900 tracking-[0.3em] flex items-center">
                <span className="bg-slate-900 w-2 h-2 mr-2"></span>
                Áreas Vistoriadas
              </h3>
              
              {inspection.areas.map((area, idx) => (
                <div key={idx} className="group border border-slate-100 rounded-2xl p-5 space-y-4 break-inside-avoid shadow-sm">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-slate-900 text-base">{area.areaName}</h4>
                    <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      area.status === InspectionStatus.CONFORME 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-red-500 text-white'
                    }`}>
                      {area.status}
                    </div>
                  </div>
                  
                  {area.notes && (
                    <div className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border-l-4 border-slate-900 italic font-medium">
                      "{area.notes}"
                    </div>
                  )}

                  {area.photos.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {area.photos.map((photo, pIdx) => (
                        <div key={pIdx} className="aspect-[4/3] rounded-lg overflow-hidden border border-slate-100">
                          <img src={photo} alt="Evidência" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-12 mt-12 border-t border-slate-100 text-center">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">MS SUPERVISION • PROFISSIONAL</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6 bg-white border-t sticky bottom-0 z-30">
        <button 
          onClick={() => navigate('/')}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl active:scale-[0.98] transition-all"
        >
          Voltar ao Dashboard
        </button>
      </div>
    </div>
  );
};

export default InspectionDetail;
