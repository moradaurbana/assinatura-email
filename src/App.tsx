/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  MessageSquareText
} from 'lucide-react';

// Default values based on the Morada Urbana theme
const DEFAULT_VALUES = {
  firstName: "JEFERSON",
  lastName: "SOBRENOME",
  title: "CONSULTORIA IMOBILIÁRIA",
  company: "Morada Urbana",
  phone: "(11) 9 1234-5678",
  whatsapp: "(11) 9 1234-5678",
  email: "contato@moradaurbana.com.br",
  website: "www.moradaurbana.com.br",
  address: "Rua das Orquídeas, 123 • Sala 45 • Moema, SP",
  creci: "CRECI: 123.456-F",
  cnai: "CNAI: 45.678",
  slogan: "CONECTANDO PESSOAS AOS MELHORES LUGARES.",
  pillarTitle1: "ATENDIMENTO PERSONALIZADO",
  pillarDesc1: "FOCADO NAS SUAS NECESSIDADES",
  pillarTitle2: "EXPERIÊNCIA E CONFIANÇA",
  pillarDesc2: "EM CADA NEGOCIAÇÃO",
  pillarTitle3: "ESPECIALISTA EM IMÓVEIS",
  pillarDesc3: "RESIDENCIAIS E COMERCIAIS",
  photoUrl: "input_file_0.png",
  logoUrl: "input_file_1.png",
  accentColor: "#F27D26",
  textColor: "#1D2431",
  showPillars: true
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
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const signatureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('signature_data', JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const copyToClipboard = () => {
    if (!signatureRef.current) return;
    
    // Create a range and select the content
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
    return signatureRef.current?.innerHTML || '';
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1D2431] font-sans pb-20">
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
      <header className="bg-white border-b border-gray-200 py-6 px-8 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="bg-[#F27D26] p-2 rounded-lg">
            <Mail className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Morada Urbana</h1>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">Gerador de Assinaturas</p>
          </div>
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
                <h2 className="text-sm font-bold uppercase tracking-wider">Informações</h2>
              </div>
              
              <div className="space-y-5">
                {[
                  { id: 'firstName', label: 'Primeiro Nome', icon: User },
                  { id: 'lastName', label: 'Sobrenome', icon: User },
                  { id: 'title', label: 'Cargo/Subtitle', icon: Briefcase },
                  { id: 'phone', label: 'Telefone', icon: Phone },
                  { id: 'whatsapp', label: 'WhatsApp', icon: Smartphone },
                  { id: 'email', label: 'E-mail', icon: Mail },
                  { id: 'website', label: 'Website', icon: Globe },
                  { id: 'address', label: 'Endereço', icon: MapPin },
                  { id: 'creci', label: 'CRECI', icon: Settings2 },
                  { id: 'cnai', label: 'CNAI', icon: Settings2 },
                  { id: 'slogan', label: 'Slogan (Direita)', icon: MessageSquareText },
                  { id: 'pillarTitle1', label: 'Diferencial 1 (Título)', icon: MessageSquareText },
                  { id: 'pillarDesc1', label: 'Diferencial 1 (Subtítulo)', icon: MessageSquareText },
                  { id: 'pillarTitle2', label: 'Diferencial 2 (Título)', icon: MessageSquareText },
                  { id: 'pillarDesc2', label: 'Diferencial 2 (Subtítulo)', icon: MessageSquareText },
                  { id: 'pillarTitle3', label: 'Diferencial 3 (Título)', icon: MessageSquareText },
                  { id: 'pillarDesc3', label: 'Diferencial 3 (Subtítulo)', icon: MessageSquareText },
                  { id: 'photoUrl', label: 'URL da Foto (Link Direto)', icon: ImageIcon },
                  { id: 'logoUrl', label: 'URL do Logo (Link Direto)', icon: ImageIcon },
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
                        className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#F27D26]/10 focus:border-[#F27D26] focus:bg-white ${
                          (field.id === 'photoUrl' || field.id === 'logoUrl') && 
                          (formData as any)[field.id].includes('ibb.co/') && !(formData as any)[field.id].includes('i.ibb.co') 
                          ? 'border-amber-300' : 'border-gray-100'
                        }`}
                        placeholder={`Digite seu ${field.label.toLowerCase()}...`}
                      />
                    </div>
                    {(field.id === 'photoUrl' || field.id === 'logoUrl') && 
                     (formData as any)[field.id].includes('ibb.co/') && !(formData as any)[field.id].includes('i.ibb.co') && (
                      <p className="mt-1 text-[10px] text-amber-600 font-medium">
                        ⚠️ No ImgBB, use o <b>"Link Direto"</b> (botão de copiar link direto).
                      </p>
                    )}
                  </div>
                ))}

                <div className="pt-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Cor de Destaque</label>
                    <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-xl border border-gray-100">
                      <input 
                        type="color" 
                        name="accentColor"
                        value={formData.accentColor}
                        onChange={handleChange as any}
                        className="w-10 h-10 rounded-lg border-none cursor-pointer bg-transparent"
                      />
                      <span className="text-xs font-mono text-gray-500">{formData.accentColor}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Cor do Texto</label>
                    <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-xl border border-gray-100">
                      <input 
                        type="color" 
                        name="textColor"
                        value={formData.textColor}
                        onChange={handleChange as any}
                        className="w-10 h-10 rounded-lg border-none cursor-pointer bg-transparent"
                      />
                      <span className="text-xs font-mono text-gray-500">{formData.textColor}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <label className="flex items-center justify-between cursor-pointer group p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Exibir Diferenciais (Rodapé)</span>
                    <input 
                      type="checkbox" 
                      name="showPillars"
                      checked={formData.showPillars}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-gray-300 text-[#F27D26] focus:ring-[#F27D26]"
                    />
                  </label>
                </div>

                <div className="pt-4 border-t border-gray-50">
                  <button 
                    onClick={() => setShowRawHtml(true)}
                    className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="w-3 h-3" />
                    Ver Código HTML (Avançado)
                  </button>
                </div>
              </div>
            </section>

            <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
              <h3 className="text-orange-800 text-xs font-bold uppercase tracking-wider mb-2">Dica Pro</h3>
              <p className="text-orange-700/80 text-sm leading-relaxed">
                Para que sua assinatura apareça corretamente para todos, use URLs de fotos hospedadas publicamente (ex: seu site ou LinkedIn).
              </p>
            </div>
          </div>

          {/* Preview Panel */}
          <div className={`lg:col-span-8 space-y-8 ${activeTab === 'edit' ? 'hidden md:block' : 'block'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-[#F27D26]" />
                <h2 className="text-sm font-bold uppercase tracking-wider">Visualização Realista</h2>
              </div>
              <button
                onClick={copyToClipboard}
                className={`flex items-center space-x-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg ${
                  copied 
                  ? 'bg-green-500 text-white shadow-green-200' 
                  : 'bg-[#1D2431] text-white hover:bg-black shadow-gray-200 active:scale-95'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copiado!' : 'Copiar Assinatura'}</span>
              </button>
            </div>

            {/* The Actual Signature Container */}
            <div className="bg-white p-4 md:p-8 rounded-[40px] shadow-[0_30px_100px_rgba(0,0,0,0.06)] border border-gray-100 overflow-x-auto">
              <div className="mx-auto" style={{ width: '600px' }} ref={signatureRef}>
                {/* Main Banner Table */}
                <table cellPadding="0" cellSpacing="0" border={0} width="600" style={{ 
                  fontFamily: 'Arial, Helvetica, sans-serif', 
                  color: formData.textColor,
                  backgroundColor: '#ffffff',
                  width: '600px',
                }}>
                  <tbody>
                    {/* Top Content Row */}
                    <tr>
                      <td style={{ padding: '10px 0 20px 0' }}>
                        <table cellPadding="0" cellSpacing="0" border={0} width="100%">
                          <tbody>
                            <tr>
                              {/* Photo Column */}
                              {formData.photoUrl && (
                                <td width="120" valign="middle" align="center">
                                  <img 
                                    src={formData.photoUrl} 
                                    alt={formData.firstName} 
                                    width="110"
                                    height="135"
                                    style={{ 
                                      display: 'block', 
                                      width: '110px',
                                      height: '135px',
                                      objectFit: 'cover',
                                      borderLeft: `5px solid ${formData.accentColor}`,
                                      borderRadius: '4px'
                                    }} 
                                    referrerPolicy="no-referrer"
                                  />
                                </td>
                              )}

                              {/* Info Column */}
                              <td valign="middle" style={{ paddingLeft: '20px' }}>
                                <div style={{ fontSize: '24px', textTransform: 'uppercase', color: formData.textColor, margin: '0', fontWeight: 'bold', lineHeight: '1.2' }}>
                                  {formData.firstName} <span style={{ fontWeight: '300', color: '#666666' }}>{formData.lastName}</span>
                                </div>
                                
                                <div style={{ fontSize: '11px', color: formData.accentColor, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '2px', marginTop: '4px' }}>
                                  {formData.title}
                                </div>
                                <div style={{ fontSize: '9px', color: '#9CA3AF', fontWeight: 'bold', marginBottom: '10px' }}>
                                  {formData.creci} {formData.creci && formData.cnai && '|'} {formData.cnai}
                                </div>

                                {/* Contact Details */}
                                <table cellPadding="0" cellSpacing="0" border={0}>
                                  <tbody>
                                    {[
                                      { icon: 'https://img.icons8.com/ios-filled/50/' + formData.accentColor.replace('#', '') + '/phone.png', text: formData.phone },
                                      { icon: 'https://img.icons8.com/ios-filled/50/' + formData.accentColor.replace('#', '') + '/whatsapp.png', text: formData.whatsapp },
                                      { icon: 'https://img.icons8.com/ios-filled/50/' + formData.accentColor.replace('#', '') + '/mail.png', text: formData.email },
                                      { icon: 'https://img.icons8.com/ios-filled/50/' + formData.accentColor.replace('#', '') + '/globe.png', text: formData.website }
                                    ].map((item, i) => (
                                      <tr key={i}>
                                        <td style={{ paddingBottom: '4px' }}>
                                          <table cellPadding="0" cellSpacing="0" border={0}>
                                            <tbody>
                                              <tr>
                                                <td width="15" valign="middle">
                                                  <img src={item.icon} width="11" height="11" style={{ display: 'block' }} />
                                                </td>
                                                <td style={{ paddingLeft: '8px', color: '#4B5563', fontSize: '10px', fontWeight: '600' }}>{item.text}</td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </td>

                              {/* Vertical Separator */}
                              <td width="1" bgcolor="#f3f3f3" style={{ padding: '0' }}></td>

                              {/* Logo Column */}
                              <td width="160" valign="middle" align="center" style={{ paddingLeft: '20px' }}>
                                {formData.logoUrl && (
                                  <table cellPadding="0" cellSpacing="0" border={0}>
                                    <tbody>
                                      <tr>
                                        <td align="center">
                                          <img 
                                            src={formData.logoUrl} 
                                            alt="Logo" 
                                            height="45"
                                            style={{ display: 'block', height: '45px', width: 'auto', maxWidth: '140px', marginBottom: '10px' }} 
                                            referrerPolicy="no-referrer"
                                          />
                                          <div style={{ height: '2px', width: '30px', backgroundColor: formData.accentColor, margin: '8px auto' }}></div>
                                          <div style={{ fontSize: '8px', color: '#888', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', maxWidth: '130px', marginTop: '8px', lineHeight: '1.4' }}>
                                            {formData.slogan}
                                          </div>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                )}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>

                    {/* Footer - Floating / 3D Look */}
                    {formData.showPillars && (
                      <tr>
                        <td style={{ paddingTop: '20px' }}>
                          <table cellPadding="0" cellSpacing="0" border={0} width="600">
                            <tbody>
                              <tr>
                                {[
                                  { title: formData.pillarTitle1, desc: formData.pillarDesc1, icon: 'https://img.icons8.com/ios-filled/50/ffffff/headset.png' },
                                  { title: formData.pillarTitle2, desc: formData.pillarDesc2, icon: 'https://img.icons8.com/ios-filled/50/ffffff/handshake.png' },
                                  { title: formData.pillarTitle3, desc: formData.pillarDesc3, icon: 'https://img.icons8.com/ios-filled/50/ffffff/home.png' }
                                ].map((pillar, idx) => (
                                  <td key={idx} width="200" align="center" style={{ padding: '0 8px' }}>
                                    {/* Floating Card Effect */}
                                    <table cellPadding="0" cellSpacing="0" border={0} width="100%" style={{ 
                                      backgroundColor: '#ffffff', 
                                      border: '1px solid #f3f4f6',
                                      borderBottom: `4px solid ${formData.accentColor}`,
                                      borderRadius: '12px',
                                    }}>
                                      <tbody>
                                        <tr>
                                          <td align="center" style={{ padding: '12px 10px' }}>
                                            <table cellPadding="0" cellSpacing="0" border={0}>
                                              <tbody>
                                                <tr>
                                                  <td align="center" valign="middle" bgcolor={formData.accentColor} style={{ width: '22px', height: '22px', borderRadius: '50%' }}>
                                                    <img src={pillar.icon} width="11" height="11" style={{ display: 'block' }} />
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                            <div style={{ fontSize: '9px', fontWeight: 'bold', color: formData.textColor, textTransform: 'uppercase', letterSpacing: '0.3px', marginTop: '8px' }}>{pillar.title}</div>
                                            <div style={{ fontSize: '7.5px', color: '#6B7280', marginTop: '3px', lineHeight: '1.2', maxWidth: '150px' }}>{pillar.desc}</div>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                ))}
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100">
               <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                 <Copy className="w-4 h-4 text-gray-400" />
                 Como usar?
               </h3>
               <ol className="space-y-4 text-sm text-gray-600">
                 <li className="flex gap-3">
                   <span className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-[10px] font-bold">1</span>
                   <span>Preencha seus dados na coluna da esquerda. Os campos vazios serão ocultados automaticamente.</span>
                 </li>
                 <li className="flex gap-3">
                   <span className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-[10px] font-bold">2</span>
                   <span>Clique no botão <strong>"Copiar Assinatura"</strong> acima para copiar o visual formatado.</span>
                 </li>
                 <li className="flex gap-3">
                   <span className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-[10px] font-bold">3</span>
                   <span>No seu Outlook ou Gmail, vá em <strong>Configurações de Assinatura</strong> e simplesmente cole (Ctrl+V) no campo de assinatura.</span>
                 </li>
               </ol>
            </div>
          </div>

        </div>
      </main>

      <footer className="py-12 px-8 text-center border-t border-gray-100 mt-12">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-[0.2em]">
          &copy; {new Date().getFullYear()} Morada Urbana &bull; Design by AI Studio
        </p>
      </footer>
    </div>
  );
}
