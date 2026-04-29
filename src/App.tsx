import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toJpeg } from 'html-to-image';
import jsPDF from 'jspdf';
import { QRCodeSVG } from 'qrcode.react';
import { 
  User, 
  Briefcase, 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  Copy, 
  Check,
  Image as ImageIcon,
  Smartphone,
  Eye,
  Settings2,
  MessageSquareText,
  CreditCard,
  Download,
  Layout,
  QrCode
} from 'lucide-react';

// Default values based on the Morada Urbana theme
const DEFAULT_VALUES = {
  firstName: "Jeferson",
  lastName: "Bernardes",
  title: "Consultor e Avaliador Imobiliário",
  company: "Morada Urbana",
  phone: "(11) 98712-1667",
  whatsapp: "(11) 98712-1667",
  email: "jeferson@moradaurbana.com.br",
  website: "www.moradaurbana.com.br",
  address: "Rua das Orquídeas, 123 • Sala 45 • Moema, SP",
  creci: "297955-F",
  cnai: "54866",
  slogan: "CONECTANDO PESSOAS AOS MELHORES LUGARES.",
  pillarTitle1: "ATENDIMENTO PERSONALIZADO",
  pillarDesc1: "FOCADO NAS SUAS NECESSIDADES",
  pillarTitle2: "EXPERIÊNCIA E CONFIANÇA",
  pillarDesc2: "EM CADA NEGOCIAÇÃO",
  pillarTitle3: "ESPECIALISTA EM IMÓVEIS",
  pillarDesc3: "RESIDENCIAIS E COMERCIAIS",
  photoUrl: "https://i.ibb.co/60qG0F8/corretor-exemplo.png",
  logoUrl: "https://i.ibb.co/PmdXm4z/logo-morada.png",
  accentColor: "#F27D26",
  textColor: "#1D2431",
  showPillars: true,
  showQRCode: true
};

export default function App() {
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('signature_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_VALUES;
      }
    }
    return DEFAULT_VALUES;
  });
  
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('preview');
  const [appMode, setAppMode] = useState<'signature' | 'card'>('signature');
  const [isExporting, setIsExporting] = useState(false);
  
  const signatureRef = useRef<HTMLTableElement>(null);
  const cardFrontRef = useRef<HTMLDivElement>(null);
  const cardBackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('signature_data', JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const copyToClipboard = () => {
    if (!signatureRef.current) return;
    
    const range = document.createRange();
    range.selectNode(signatureRef.current);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
    
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
    
    window.getSelection()?.removeAllRanges();
  };

  const [showRawHtml, setShowRawHtml] = useState(false);

  const getRawHtml = () => {
    return signatureRef.current?.outerHTML || '';
  };

  const generateVCard = () => {
    const cleanPhone = (phone: string) => phone ? phone.replace(/\D/g, '') : '';
    // Minimalist vCard 2.1 for maximum scanability
    return [
      'BEGIN:VCARD',
      'VERSION:2.1',
      `FN:${formData.firstName} ${formData.lastName}`,
      `TEL;CELL;VOICE:${cleanPhone(formData.whatsapp)}`,
      `EMAIL;INTERNET:${formData.email}`,
      'END:VCARD'
    ].join('\r\n');
  };

  const downloadFullPDF = async () => {
    const front = document.getElementById('export-front');
    const back = document.getElementById('export-back');
    if (!front || !back) return;
    
    setIsExporting(true);
    try {
      // High-res pixel ratio for printing (4x capture = ~4000px width)
      const frontData = await toJpeg(front, { quality: 1, pixelRatio: 4 });
      const backData = await toJpeg(back, { quality: 1, pixelRatio: 4 });
      
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [90, 50],
        compress: true 
      });
      
      // Page 1: Front
      pdf.addImage(frontData, 'JPEG', 0, 0, 90, 50, undefined, 'FAST');
      
      // Page 2: Back
      pdf.addPage([90, 50], 'landscape');
      pdf.addImage(backData, 'JPEG', 0, 0, 90, 50, undefined, 'FAST');
      
      pdf.save(`Cartao_Premium_Morada_${formData.firstName}.pdf`);
    } catch (err) {
      console.error('PDF generation failed', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1D2431] font-sans pb-20">
      {/* Hidden Export Rendering Area (To avoid scale issues) */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <div id="export-front" style={{ width: '1063px', height: '591px', backgroundColor: '#ffffff', position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: '25px', height: '100%', backgroundColor: formData.accentColor }} />
          <div className="h-full w-full flex flex-col items-center justify-center p-20 text-center">
            <img src={formData.logoUrl} alt="Logo" style={{ width: '560px', marginBottom: '50px' }} />
            <div style={{ width: '140px', height: '4px', backgroundColor: formData.accentColor, marginBottom: '36px', borderRadius: '2px' }} />
            <p style={{ fontFamily: 'Arial', fontWeight: 'bold', fontSize: '26px', color: '#666666', letterSpacing: '10px', textTransform: 'uppercase', lineHeight: '1.4' }}>
              {formData.slogan}
            </p>
          </div>
        </div>

        <div id="export-back" style={{ width: '1063px', height: '591px', backgroundColor: '#ffffff', display: 'flex', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', background: `${formData.accentColor}`, opacity: 0.05, borderRadius: '60px', transform: 'rotate(25deg)' }} />
          <div style={{ width: '15px', backgroundColor: formData.accentColor }} />
          <div className="flex-1 flex flex-col justify-between p-16" style={{ position: 'relative', zIndex: 2 }}>
            <div className="flex justify-between items-start">
              <div className="text-left">
                <h2 style={{ fontFamily: 'Arial', fontWeight: 'bold', fontSize: '64px', color: formData.textColor, marginBottom: '6px' }}>
                  {formData.firstName} <span style={{ color: '#666666', fontWeight: 'normal' }}>{formData.lastName}</span>
                </h2>
                <div style={{ height: '6px', width: '120px', backgroundColor: formData.accentColor, marginBottom: '20px' }} />
                <p style={{ fontFamily: 'Arial', fontWeight: 'bold', fontSize: '28px', color: formData.accentColor, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>
                  {formData.title}
                </p>
                <p style={{ fontFamily: 'Arial', fontWeight: 'bold', fontSize: '22px', color: '#999999' }}>
                  {formData.creci ? `CRECI: ${formData.creci}` : ''} {formData.creci && formData.cnai ? ' • ' : ''} {formData.cnai ? `CNAI: ${formData.cnai}` : ''}
                </p>
              </div>
              <img src={formData.logoUrl} alt="Logo Small" style={{ width: '280px', marginTop: '10px' }} />
            </div>
            
            <div className="flex justify-between items-end mt-12">
              <div className="space-y-6 pb-4">
                 {[
                   { icon: 'whatsapp', text: formData.whatsapp },
                   { icon: 'new-post', text: formData.email },
                   { icon: 'globe', text: formData.website },
                 ].filter(i => i.text).map((item, idx) => (
                   <div key={idx} className="flex items-center gap-6">
                     <div style={{ width: '56px', height: '56px', borderRadius: '14px', backgroundColor: '#FDF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src={`https://img.icons8.com/material-rounded/48/${formData.accentColor.replace('#', '')}/${item.icon}.png`} width="28" style={{ margin: '0 auto' }} />
                     </div>
                     <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#333333', fontFamily: 'Arial' }}>{item.text}</span>
                   </div>
                 ))}
              </div>

              {/* QR Code on Back (Export) */}
              {formData.showQRCode && (
                <div style={{ padding: '15px', background: 'white', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' }}>
                  <QRCodeSVG 
                    value={generateVCard()} 
                    size={180} 
                    level="M" 
                    includeMargin={true}
                    fgColor="#000000"
                  />
                  <p style={{ fontSize: '14px', fontWeight: '900', textAlign: 'center', marginTop: '12px', color: formData.accentColor, fontFamily: 'Arial', letterSpacing: '2px', textTransform: 'uppercase' }}>
                    CONTATO DIGITAL
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Raw HTML Modal */}
      <AnimatePresence>
        {showRawHtml && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
            onClick={() => setShowRawHtml(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 1 }}
              className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#F8F9FA]">
                <h3 className="font-bold flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#F27D26]" />
                  Código HTML da Assinatura
                </h3>
                <button onClick={() => setShowRawHtml(false)} className="text-gray-400 hover:text-black">
                  <Check className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <textarea 
                  readOnly 
                  value={getRawHtml()}
                  className="w-full h-80 bg-gray-900 text-gray-300 p-6 rounded-2xl font-mono text-xs focus:outline-none"
                />
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(getRawHtml());
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="mt-6 w-full py-4 bg-[#F27D26] text-white rounded-2xl font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-100"
                >
                  Copiar Código HTML
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-6 px-8 flex flex-col md:flex-row justify-between items-center sticky top-0 z-50 gap-4">
        <div className="flex items-center space-x-3">
          <div className="bg-[#F27D26] p-2 rounded-lg">
            <Layout className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Morada Urbana</h1>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">Central de Materiais</p>
          </div>
        </div>

        {/* Global Mode Switcher */}
        <div className="flex bg-gray-100 p-1.5 rounded-2xl">
          <button 
            onClick={() => setAppMode('signature')}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${appMode === 'signature' ? 'bg-white shadow-md text-[#F27D26]' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Mail className="w-4 h-4" />
            Assinatura
          </button>
          <button 
            onClick={() => setAppMode('card')}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${appMode === 'card' ? 'bg-white shadow-md text-[#F27D26]' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <CreditCard className="w-4 h-4" />
            Cartão de Visita
          </button>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-full md:hidden">
          <button 
            onClick={() => setActiveTab('edit')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${activeTab === 'edit' ? 'bg-white shadow-sm text-[#F27D26]' : 'text-gray-500'}`}
          >
            Editar
          </button>
          <button 
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${activeTab === 'preview' ? 'bg-white shadow-sm text-[#F27D26]' : 'text-gray-500'}`}
          >
            Ver
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 md:p-10 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Controls Panel */}
          <div className={`lg:col-span-4 space-y-8 ${activeTab === 'preview' ? 'hidden md:block' : 'block'}`}>
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center space-x-2 mb-6">
                <Settings2 className="w-4 h-4 text-[#F27D26]" />
                <h2 className="text-sm font-bold uppercase tracking-wider">Informações Gerais</h2>
              </div>
              
              <div className="space-y-5">
                {[
                  { id: 'firstName', label: 'Primeiro Nome', icon: User },
                  { id: 'lastName', label: 'Sobrenome', icon: User },
                  { id: 'title', label: 'Cargo', icon: Briefcase },
                  { id: 'phone', label: 'Telefone', icon: Phone },
                  { id: 'whatsapp', label: 'WhatsApp', icon: Smartphone },
                  { id: 'email', label: 'E-mail', icon: Mail },
                  { id: 'website', label: 'Website', icon: Globe },
                  { id: 'address', label: 'Endereço', icon: MapPin },
                  { id: 'creci', label: 'Nº CRECI', icon: Settings2 },
                  { id: 'cnai', label: 'Nº CNAI', icon: Settings2 },
                  { id: 'slogan', label: 'Slogan da Empresa', icon: MessageSquareText },
                ].map((field) => (
                  <div key={field.id} className="relative">
                    <label htmlFor={field.id} className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
                      {field.label}
                    </label>
                    <div className="relative group">
                      <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-[#F27D26] transition-colors" />
                      <input
                        id={field.id}
                        type="text"
                        name={field.id}
                        value={(formData as any)[field.id]}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#F27D26]/10 focus:border-[#F27D26] focus:bg-white"
                        placeholder={`Digite seu ${field.label.toLowerCase()}...`}
                      />
                    </div>
                  </div>
                ))}

                {appMode === 'card' && (
                  <div className="space-y-5 pt-8 border-t border-gray-100">
                    <div className="flex items-center space-x-2 mb-2">
                       <QrCode className="w-4 h-4 text-[#F27D26]" />
                       <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Configurações do Cartão</h3>
                    </div>
                    
                    <div className="pt-2">
                      <label className="flex items-center justify-between cursor-pointer group p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Incluir QR Code (VCard)</span>
                        <input 
                          type="checkbox" 
                          name="showQRCode"
                          checked={formData.showQRCode}
                          onChange={handleChange}
                          className="w-4 h-4 rounded border-gray-300 text-[#F27D26] focus:ring-[#F27D26]"
                        />
                      </label>
                      <p className="mt-2 text-[10px] text-gray-400 leading-relaxed px-1">
                        O QR Code permite que seus clientes salvem seu contato instantaneamente ao escanear o verso do cartão.
                      </p>
                    </div>
                  </div>
                )}
                {appMode === 'signature' && (
                  <div className="space-y-5 pt-8 border-t border-gray-100">
                    <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Configurações da Assinatura</h3>
                    {[
                      { id: 'pillarTitle1', label: 'Diferencial 1 (Título)', icon: MessageSquareText },
                      { id: 'pillarDesc1', label: 'Diferencial 1 (Desc)', icon: MessageSquareText },
                      { id: 'pillarTitle2', label: 'Diferencial 2 (Título)', icon: MessageSquareText },
                      { id: 'photoUrl', label: 'URL da Foto (Avatar)', icon: ImageIcon },
                      { id: 'logoUrl', label: 'URL do Logotipo', icon: ImageIcon },
                    ].map((field) => (
                      <div key={field.id} className="relative">
                        <label htmlFor={field.id} className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
                          {field.label}
                        </label>
                        <div className="relative group">
                          <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-[#F27D26] transition-colors" />
                          <input
                            id={field.id}
                            type="text"
                            name={field.id}
                            value={(formData as any)[field.id]}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F27D26]/10 focus:border-[#F27D26]"
                          />
                        </div>
                      </div>
                    ))}
                    
                    <div className="pt-4 border-t border-gray-100">
                      <label className="flex items-center justify-between cursor-pointer group p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Exibir Rodapé (Icons)</span>
                        <input 
                          type="checkbox" 
                          name="showPillars"
                          checked={formData.showPillars}
                          onChange={handleChange}
                          className="w-4 h-4 rounded border-gray-300 text-[#F27D26] focus:ring-[#F27D26]"
                        />
                      </label>
                    </div>

                    <button 
                      onClick={() => setShowRawHtml(true)}
                      className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye className="w-3 h-3" />
                      Visualizar HTML
                    </button>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Preview Panel */}
          <div className={`lg:col-span-8 space-y-8 ${activeTab === 'edit' ? 'hidden md:block' : 'block'}`}>
            
            {appMode === 'signature' ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-[#F27D26]" />
                    <h2 className="text-sm font-bold uppercase tracking-wider">Assinatura de E-mail</h2>
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className={`flex items-center space-x-2 px-8 py-3 rounded-full text-sm font-extrabold transition-all shadow-xl hover:scale-105 active:scale-95 ${
                      copied 
                      ? 'bg-green-500 text-white shadow-green-100' 
                      : 'bg-[#1D2431] text-white hover:bg-black shadow-gray-200'
                    }`}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copiado para o CLipboard!' : 'COPIAR ASSINATURA'}</span>
                  </button>
                </div>

                <div className="bg-white p-6 md:p-12 rounded-[50px] shadow-[0_40px_120px_rgba(0,0,0,0.06)] border border-gray-100 overflow-x-auto">
                  <div className="mx-auto" style={{ width: '650px' }}>
                    <table cellPadding="0" cellSpacing="0" border={0} width="650" ref={signatureRef} style={{ 
                      fontFamily: 'Arial, sans-serif', 
                      color: formData.textColor,
                      backgroundColor: '#ffffff',
                      borderCollapse: 'collapse',
                      msoTableLspace: '0pt',
                      msoTableRspace: '0pt'
                    }}>
                      <tbody>
                        <tr>
                          <td align="left" valign="top" style={{ padding: '0 0 20px 0' }}>
                            <table cellPadding="0" cellSpacing="0" border={0} width="100%" style={{ borderCollapse: 'collapse' }}>
                              <tbody>
                                <tr>
                                  <td width="4" bgcolor={formData.accentColor} valign="top" style={{ width: '4px', backgroundColor: formData.accentColor, fontSize: '1px' }}>&nbsp;</td>
                                  <td width="20" style={{ width: '20px' }}>&nbsp;</td>
                                  <td width="130" valign="middle" align="center">
                                    <img src={formData.photoUrl} alt="User" width="130" height="130" style={{ display: 'block', borderRadius: '4px' }} referrerPolicy="no-referrer" />
                                  </td>
                                  <td width="20" style={{ width: '20px' }}>&nbsp;</td>
                                  <td valign="middle" align="left">
                                    <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold', color: formData.textColor }}>
                                      {formData.firstName} <span style={{ color: '#666666', fontWeight: 'normal' }}>{formData.lastName}</span>
                                    </h2>
                                    <p style={{ margin: '4px 0', fontSize: '12px', fontWeight: 'bold', color: formData.accentColor, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                      {formData.title}
                                    </p>
                                    <p style={{ margin: 0, fontSize: '10px', color: '#999999', fontWeight: 'bold' }}>
                                      {formData.creci ? `CRECI: ${formData.creci}` : ''} {formData.creci && formData.cnai ? ' | ' : ''} {formData.cnai ? `CNAI: ${formData.cnai}` : ''}
                                    </p>
                                    <div style={{ marginTop: '12px' }}>
                                      <table cellPadding="0" cellSpacing="0" border={0}>
                                        <tbody>
                                          {[
                                            { icon: 'phone', text: formData.phone },
                                            { icon: 'whatsapp', text: formData.whatsapp },
                                            { icon: 'new-post', text: formData.email },
                                            { icon: 'globe', text: formData.website }
                                          ].filter(i => i.text).map((item, idx) => (
                                            <tr key={idx}>
                                              <td style={{ paddingBottom: '3px' }}>
                                                <img src={`https://img.icons8.com/material-rounded/24/${formData.accentColor.replace('#', '')}/${item.icon}.png`} width="12" height="12" style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                                                <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#444444' }}>{item.text}</span>
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </td>
                                  <td width="20" style={{ width: '20px' }}>&nbsp;</td>
                                  <td width="1" bgcolor="#EEEEEE" style={{ width: '1px' }}>&nbsp;</td>
                                  <td width="20" style={{ width: '20px' }}>&nbsp;</td>
                                  <td width="160" valign="middle" align="center">
                                    <img src={formData.logoUrl} alt="Logo" width="120" style={{ marginBottom: '10px' }} referrerPolicy="no-referrer" />
                                    <div style={{ width: '40px', height: '2px', backgroundColor: formData.accentColor, margin: '8px 0' }} />
                                    <p style={{ fontSize: '8px', fontWeight: 'bold', color: '#888888', textAlign: 'center', lineHeight: '1.4' }}>{formData.slogan}</p>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        {formData.showPillars && (
                          <tr>
                            <td style={{ paddingTop: '20px', borderTop: '1px solid #F0F0F0' }}>
                              <table width="100%" cellPadding="0" cellSpacing="0">
                                <tr>
                                  {[
                                    { t: formData.pillarTitle1, d: formData.pillarDesc1, i: 'headset' },
                                    { t: formData.pillarTitle2, d: 'EXPERIÊNCIA COMPROVADA', i: 'handshake' },
                                    { t: formData.pillarTitle3, d: 'IMÓVEIS SELECIONADOS', i: 'home' }
                                  ].map((p, i) => (
                                    <td key={i} align="center" width="33%">
                                      <div style={{ backgroundColor: formData.accentColor, width: '24px', height: '24px', margin: '0 auto 8px', textAlign: 'center', borderRadius: '4px' }}>
                                        <img src={`https://img.icons8.com/ios-filled/50/ffffff/${p.i}.png`} width="14" style={{ marginTop: '5px' }} />
                                      </div>
                                      <p style={{ fontSize: '9px', fontWeight: 'bold', margin: 0 }}>{p.t}</p>
                                      <p style={{ fontSize: '7px', color: '#666666', margin: 0 }}>{p.d}</p>
                                    </td>
                                  ))}
                                </tr>
                              </table>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-[#F27D26]" />
                    <h2 className="text-sm font-bold uppercase tracking-wider">Design do Cartão (90x50mm)</h2>
                  </div>
                  <button
                    disabled={isExporting}
                    onClick={downloadFullPDF}
                    className="flex items-center space-x-2 px-8 py-3 rounded-full text-sm font-extrabold transition-all shadow-xl bg-[#F27D26] text-white hover:bg-orange-600 hover:scale-105 active:scale-95 disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isExporting ? 'GERANDO PDF...' : 'BAIXAR PDF PARA IMPRESSÃO'}</span>
                  </button>
                </div>

                <div className="space-y-16 py-10">
                  {/* Front Card rendering at double resolution for output quality */}
                  <div className="flex flex-col items-center">
                    <div className="mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Frente do Cartão (Posicionamento Premium)</span>
                    </div>
                    <div className="bg-white shadow-[0_30px_80px_rgba(0,0,0,0.12)] rounded-sm overflow-hidden" 
                         style={{ width: '540px', height: '300px' }}>
                      <div ref={cardFrontRef} style={{ width: '1063px', height: '591px', transform: 'scale(0.508)', transformOrigin: 'top left', backgroundColor: '#ffffff', position: 'relative' }}>
                        {/* Elegant side bar */}
                        <div style={{ position: 'absolute', left: 0, top: 0, width: '25px', height: '100%', backgroundColor: formData.accentColor }} />
                        
                        <div className="h-full w-full flex flex-col items-center justify-center p-20 text-center">
                          <img src={formData.logoUrl} alt="Logo" style={{ width: '520px', marginBottom: '45px' }} />
                          <div style={{ width: '140px', height: '4px', backgroundColor: formData.accentColor, marginBottom: '36px', borderRadius: '2px' }} />
                          <p style={{ fontFamily: 'Arial', fontWeight: 'bold', fontSize: '26px', color: '#666666', letterSpacing: '10px', textTransform: 'uppercase', lineHeight: '1.4' }}>
                            {formData.slogan}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Back Card */}
                  <div className="flex flex-col items-center pb-20">
                    <div className="mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Verso do Cartão (Contatos Nítidos)</span>
                    </div>
                    <div className="bg-white shadow-[0_30px_80px_rgba(0,0,0,0.12)] rounded-sm overflow-hidden" 
                         style={{ width: '540px', height: '300px' }}>
                      <div ref={cardBackRef} style={{ width: '1063px', height: '591px', transform: 'scale(0.508)', transformOrigin: 'top left', backgroundColor: '#ffffff', display: 'flex', position: 'relative', overflow: 'hidden' }}>
                         
                         {/* Subtle geometric watermark */}
                        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', background: `${formData.accentColor}`, opacity: 0.05, borderRadius: '60px', transform: 'rotate(25deg)' }} />

                         {/* Side accent column */}
                        <div style={{ width: '15px', backgroundColor: formData.accentColor }} />
                        
                        <div className="flex-1 flex flex-col justify-between p-16" style={{ position: 'relative', zIndex: 2 }}>
                          <div className="flex justify-between items-start">
                            <div className="text-left">
                              <h2 style={{ fontFamily: 'Arial', fontWeight: 'bold', fontSize: '64px', color: formData.textColor, marginBottom: '6px' }}>
                                {formData.firstName} <span style={{ color: '#666666', fontWeight: 'normal' }}>{formData.lastName}</span>
                              </h2>
                              <div style={{ height: '6px', width: '120px', backgroundColor: formData.accentColor, marginBottom: '20px' }} />
                              <p style={{ fontFamily: 'Arial', fontWeight: 'bold', fontSize: '28px', color: formData.accentColor, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>
                                {formData.title}
                              </p>
                              <p style={{ fontFamily: 'Arial', fontWeight: 'bold', fontSize: '22px', color: '#999999' }}>
                                {formData.creci ? `CRECI: ${formData.creci}` : ''} {formData.creci && formData.cnai ? ' • ' : ''} {formData.cnai ? `CNAI: ${formData.cnai}` : ''}
                              </p>
                            </div>
                            <img src={formData.logoUrl} alt="Logo Small" style={{ width: '280px', marginTop: '10px' }} />
                          </div>

                          <div className="flex justify-between items-end mt-12">
                            <div className="space-y-6 pb-4">
                               {[
                                 { icon: 'whatsapp', text: formData.whatsapp },
                                 { icon: 'new-post', text: formData.email },
                                 { icon: 'globe', text: formData.website },
                               ].filter(i => i.text).map((item, idx) => (
                                 <div key={idx} className="flex items-center gap-6">
                                   <div style={{ width: '56px', height: '56px', borderRadius: '14px', backgroundColor: '#FDF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                      <img src={`https://img.icons8.com/material-rounded/48/${formData.accentColor.replace('#', '')}/${item.icon}.png`} width="28" style={{ margin: '0 auto' }} />
                                   </div>
                                   <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#333333', fontFamily: 'Arial' }}>{item.text}</span>
                                 </div>
                               ))}
                            </div>

                            {/* QR Code on Back (Preview) */}
                            {formData.showQRCode && (
                              <div style={{ padding: '15px', background: 'white', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' }}>
                                <QRCodeSVG 
                                  value={generateVCard()} 
                                  size={180} 
                                  level="M" 
                                  includeMargin={true}
                                  fgColor="#000000"
                                />
                                <p style={{ fontSize: '14px', fontWeight: '900', textAlign: 'center', marginTop: '12px', color: formData.accentColor, fontFamily: 'Arial', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                  CONTATO DIGITAL
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            <div className="bg-white p-10 rounded-[40px] border border-gray-100 mt-8">
               <h3 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-3">
                 <div className="w-1.5 h-6 bg-[#F27D26] rounded-full" />
                 {appMode === 'signature' ? 'Como Instalar no Outlook/Gmail' : 'Ajustes para Exportação'}
               </h3>
               
               {appMode === 'signature' ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-600">
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                      <p className="font-bold text-[#1D2431] mb-2">Opção 1: Copiar e Colar</p>
                      <p>Use o botão preto acima para copiar o visual. Depois, basta colar diretamente no campo de assinatura do seu Outlook ou Gmail.</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                      <p className="font-bold text-[#1D2431] mb-2">Opção 2: Código HTML</p>
                      <p>Se você usa ferramentas corporativas, pode usar o botão "Visualizar HTML" para pegar o código fonte limpo.</p>
                    </div>
                 </div>
               ) : (
                 <div className="space-y-4 text-sm text-gray-600">
                    <p className="leading-relaxed">
                      O arquivo agora utiliza o formato <strong>90mm x 50mm</strong> com escala de <strong>300 DPI</strong> (ideal para impressão profissional).
                    </p>
                    <div className="flex gap-4">
                      <div className="px-4 py-2 bg-orange-50 text-orange-700 rounded-lg font-bold text-[10px] uppercase">Formato Padrão Gráfica</div>
                      <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-bold text-[10px] uppercase">Exportação Ultra-HD</div>
                    </div>
                 </div>
               )}
            </div>
          </div>

        </div>
      </main>

      <footer className="py-12 px-8 text-center border-t border-gray-100 mt-12">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-[0.2em]">
          &copy; {new Date().getFullYear()} Morada Urbana &bull; Studio Pro v2.5
        </p>
      </footer>
    </div>
  );
}

