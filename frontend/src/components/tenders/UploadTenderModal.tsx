import React, { useState } from 'react';
import {
  X,
  UploadCloud,
  FileText,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Tender, TenderRequirement } from '../../types';

interface UploadTenderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTenderCreated: (newTender: Tender) => void;
}

export const UploadTenderModal: React.FC<UploadTenderModalProps> = ({
  isOpen,
  onClose,
  onTenderCreated
}) => {
  const [step, setStep] = useState<'FORM' | 'PROCESSING' | 'COMPLETE'>('FORM');
  const [processingStage, setProcessingStage] = useState(0);

  const [title, setTitle] = useState('Procurement of Subsea Fire-Fighting Pumps & Valves');
  const [refNo, setRefNo] = useState('CPCL/OFFSHORE/2026/PUMPS/019');
  const [authority, setAuthority] = useState('Chennai Petroleum Corporation Limited (CPCL)');
  const [category, setCategory] = useState('Safety & Firefighting Equipment');
  const [estimatedValue, setEstimatedValue] = useState('₹ 11.50 Crore');
  const [deadline, setDeadline] = useState('2026-10-15');
  const [selectedFileName, setSelectedFileName] = useState('CPCL_Tender_Notice_Pumps_2026.pdf');

  if (!isOpen) return null;

  const stages = [
    'PyMuPDF / pdfplumber: Native digital text extracted (42 pages)',
    'Document Intelligence: Classification of clauses & financial schedules',
    'RAG Retrieval Layer: Vector chunking & Sentence-Transformer embeddings',
    'Applicability Engine: Deterministic rule generation (8 Applicable, 1 Not Applicable)'
  ];

  const handleStartProcessing = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('PROCESSING');
    setProcessingStage(0);

    const interval = setInterval(() => {
      setProcessingStage(prev => {
        if (prev < stages.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setStep('COMPLETE');
          return prev;
        }
      });
    }, 800);
  };

  const handleFinish = () => {
    const newId = `tender-${Date.now()}`;
    const generatedRequirements: TenderRequirement[] = [
      {
        id: `req-${newId}-1`,
        tenderId: newId,
        category: 'statutory',
        code: 'STAT-01',
        title: 'Valid GST Registration and Regular Returns',
        description: 'Mandatory active GSTIN registration with regular GSTR-3B filings.',
        ruleType: 'string_match',
        ruleValue: 'ACTIVE_AND_FILED',
        isMandatory: true,
        isApplicable: true,
        applicabilityReason: 'Mandatory tax integrity rule across CPCL contracts.',
        clauseRef: 'Clause 2.1'
      },
      {
        id: `req-${newId}-2`,
        tenderId: newId,
        category: 'financial',
        code: 'FIN-01',
        title: 'Minimum Financial Turnover ₹8.00 Cr',
        description: 'Average annual audited turnover of at least ₹8.00 Cr for last 3 financial years.',
        ruleType: 'numeric_minimum',
        ruleValue: '80000000',
        isMandatory: true,
        isApplicable: true,
        applicabilityReason: 'Ensures capital backing for subsea engineering deliverables.',
        clauseRef: 'Clause 3.1'
      },
      {
        id: `req-${newId}-3`,
        tenderId: newId,
        category: 'technical',
        code: 'TECH-01',
        title: 'OEM Authorization Form (MAF)',
        description: 'Direct manufacturer authorization for centrifugal pump assemblies.',
        ruleType: 'document_present',
        ruleValue: 'VALID_MAF',
        isMandatory: true,
        isApplicable: true,
        applicabilityReason: 'Safety-critical firefighting apparatus requires guaranteed manufacturer parts.',
        clauseRef: 'Clause 4.3'
      },
      {
        id: `req-${newId}-4`,
        tenderId: newId,
        category: 'statutory',
        code: 'STAT-02',
        title: 'Make in India Class-I Supplier (≥50%)',
        description: 'Local content declaration of at least 50% under MII policy.',
        ruleType: 'percentage_threshold',
        ruleValue: '50',
        isMandatory: true,
        isApplicable: true,
        applicabilityReason: 'Mandatory preferential purchase order under MoPNG guidelines.',
        clauseRef: 'Clause 5.1'
      },
      {
        id: `req-${newId}-5`,
        tenderId: newId,
        category: 'technical',
        code: 'TECH-02',
        title: 'Civil Construction Grading License',
        description: 'Civil structural excavation license.',
        ruleType: 'document_present',
        ruleValue: 'NOT_REQUIRED',
        isMandatory: false,
        isApplicable: false,
        applicabilityReason: 'NOT APPLICABLE: Procurement scope is machinery delivery only; civil works excluded.',
        clauseRef: 'Clause 1.2'
      }
    ];

    const newTender: Tender = {
      id: newId,
      refNo: refNo,
      title: title,
      authority: authority,
      department: 'Fire & Safety Engineering Group',
      category: category,
      submissionDeadline: deadline,
      status: 'OPEN',
      estimatedValue: estimatedValue,
      bidsCount: 0,
      requirementsCount: generatedRequirements.length,
      description: `Procurement for ${title} under reference ${refNo}. Extracted via Document Intelligence & Applicability Engine.`,
      createdAt: new Date().toISOString().split('T')[0],
      requirements: generatedRequirements
    };

    onTenderCreated(newTender);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
              <UploadCloud size={18} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Upload &amp; Ingest New Tender
              </h3>
              <p className="text-xs text-slate-500">
                Automated Requirement Extraction &amp; Applicability Matrix Generation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {step === 'FORM' && (
            <form onSubmit={handleStartProcessing} className="space-y-4 text-xs">
              {/* File Upload Drop Area */}
              <div className="p-4 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-blue-50/50 transition-colors text-center cursor-pointer">
                <FileText className="mx-auto text-blue-600 mb-2" size={28} />
                <div className="font-semibold text-slate-800">
                  {selectedFileName}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Ready for Document Intelligence parsing (PDF format supported)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tender Subject / Title:
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tender Reference No:
                  </label>
                  <input
                    type="text"
                    required
                    value={refNo}
                    onChange={e => setRefNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 font-mono text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Procuring Authority:
                  </label>
                  <input
                    type="text"
                    required
                    value={authority}
                    onChange={e => setAuthority(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Estimated Contract Value:
                  </label>
                  <input
                    type="text"
                    required
                    value={estimatedValue}
                    onChange={e => setEstimatedValue(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Submission Deadline:
                  </label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={e => setDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 font-mono text-slate-900"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50/70 rounded-lg text-blue-950 border border-blue-200 flex items-start gap-2 text-[11px]">
                <Sparkles size={16} className="text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Deterministic Rule Engine Boundary:</span>
                  <p className="mt-0.5 text-blue-800">
                    The AI/RAG engine classifies clauses and extracts candidate thresholds into JSON, which are then strictly evaluated by deterministic rule functions.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs transition-colors cursor-pointer"
                >
                  Run Document Intelligence Pipeline
                </button>
              </div>
            </form>
          )}

          {step === 'PROCESSING' && (
            <div className="py-8 space-y-6 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-50 border-2 border-blue-600 border-t-transparent animate-spin mx-auto flex items-center justify-center text-blue-600">
                <Cpu size={24} />
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-900">
                  Processing Document & Building Applicability Matrix...
                </h4>
                <p className="text-xs text-slate-500">
                  Executing multi-stage NLP & RAG chunking pipeline
                </p>
              </div>

              <div className="space-y-2.5 max-w-md mx-auto text-left">
                {stages.map((st, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-xs transition-all ${
                      i <= processingStage
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    {i <= processingStage ? (
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                    )}
                    <span className="font-medium">{st}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 'COMPLETE' && (
            <div className="py-6 space-y-5 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 size={32} />
              </div>

              <div className="space-y-1">
                <h4 className="text-lg font-bold text-slate-900">
                  Tender Ingested & Matrix Generated!
                </h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Extracted 5 structured requirements. The Applicability Engine tagged 4 applicable checks and 1 non-applicable rule with documented justifications.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-left max-w-md mx-auto space-y-1.5">
                <div className="font-semibold text-slate-900">Extraction Summary:</div>
                <div className="text-slate-600 text-[11px]">&bull; Financial: Min Turnover ₹8.00 Cr (3-yr CA audited)</div>
                <div className="text-slate-600 text-[11px]">&bull; Technical: Valid OEM Authorization Form (MAF) required</div>
                <div className="text-slate-600 text-[11px]">&bull; Statutory: Make in India Class-I (≥50%)</div>
                <div className="text-slate-500 text-[11px] italic">&bull; Not Applicable: Civil excavation license excluded</div>
              </div>

              <div className="pt-4 flex justify-center">
                <button
                  onClick={handleFinish}
                  className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2"
                >
                  <span>Open Tender in Applicability Matrix</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
