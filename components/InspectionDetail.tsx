
import React, { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Inspection, InspectionStatus } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Props {
  inspections: Inspection[];
}

const InspectionDetail: React.FC<Props> = ({ inspections }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const reportRef = useRef<HTMLDivElement>(null);
  
  const inspection = inspections.find(i => i.id === id);

  if (!inspection) return <div className="p-6">Vistoria não encontrada.</div>;

  const generatePDF = async () => {
    if (!reportRef.current) return;
    
    const element = reportRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Relatorio_${inspection.condominiumName}_${new Date(inspection.date).toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`);
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
        console.error('Error sharing:', err);
      }
    } else {
      alert('Compartilhamento não suportado neste navegador. Use a função de Download PDF.');
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="p-4 bg-white border-b flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <button onClick={() => navigate('/history')} className="text-slate-600 p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-sm font-bold uppercase text-slate-900 tracking-wider">Detalhes da Vistoria</h1>
        <div className="flex space-x-1">
          <button onClick={generatePDF} className="p-2 text-slate-600" title="Baixar PDF">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </button>
          <button onClick={shareReport} className="p-2 text-slate-600" title="Compartilhar">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto" id="report-content">
        <div ref={reportRef} className="bg-white p-8 space-y-8">
          {/* PDF Header */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter">MS SUPERVISION</h2>
              <p className="text-xs font-bold text-slate-500 uppercase mt-1">Relatório Técnico de Vistoria</p>
            </div>
            <div className="text-right text-xs text-slate-500">
              <p>ID: #{inspection.id.toUpperCase()}</p>
              <p>DATA: {new Date(inspection.date).toLocaleDateString('pt-BR')}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-slate-50 p-4 rounded-lg">
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Condomínio</span>
              <p className="font-bold text-slate-900">{inspection.condominiumName}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Responsável</span>
              <p className="font-bold text-slate-900">{inspection.inspector}</p>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase border-b pb-2 text-slate-900">Itens Vistoriados</h3>
            {inspection.areas.map((area, idx) => (
              <div key={idx} className="border rounded-xl p-4 space-y-3 break-inside-avoid">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-800">{area.areaName}</h4>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${area.status === InspectionStatus.CONFORME ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {area.status}
                  </span>
                </div>
                
                {area.notes && (
                  <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border-l-4 border-slate-300">
                    {area.notes}
                  </div>
                )}

                {area.photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {area.photos.map((photo, pIdx) => (
                      <img key={pIdx} src={photo} alt="Evidência" className="w-full aspect-square object-cover rounded-lg border shadow-sm" />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <footer className="pt-10 text-center text-[10px] text-slate-400 border-t">
            Este relatório foi gerado via MS SUPERVISION. Registros digitais invioláveis.
          </footer>
        </div>
      </div>
      
      <div className="p-4 bg-white border-t">
        <button 
          onClick={() => navigate('/')}
          className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold shadow-lg"
        >
          Voltar ao Início
        </button>
      </div>
    </div>
  );
};

export default InspectionDetail;
