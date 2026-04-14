import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle, FileCheck2, ShieldAlert } from "lucide-react";

export function DocumentPreviewModal({ open, onOpenChange, document }) {
  if (!document) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileCheck2 className="h-5 w-5 text-primary" />
            {document.docType} Preview
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto bg-slate-50 p-6 rounded-md border shadow-inner relative">
          {document.alertMessage && (
            <div className="mb-6 flex items-center gap-3 bg-amber-100 border border-amber-300 text-amber-900 px-4 py-3 rounded-lg shadow-sm">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
              <p className="font-semibold text-sm">{document.alertMessage}</p>
            </div>
          )}

          {/* Fake Document content */}
          <div className="bg-white mx-auto max-w-2xl border-2 border-slate-200 shadow-sm p-8 min-h-[500px] relative">
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <ShieldAlert className="w-96 h-96" />
            </div>

            <div className="text-center mb-8 border-b-2 border-slate-800 pb-4">
              <h2 className="text-2xl font-black uppercase tracking-widest text-slate-800">
                GOVERNMENT OF INDIA
              </h2>
              <p className="text-sm font-semibold text-slate-600 uppercase mt-1">
                Transport Department
              </p>
              <h3 className="text-xl font-bold mt-4 uppercase text-primary">
                {document.docType} CERTIFICATE
              </h3>
            </div>

            <div className="space-y-6 relative z-10">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold">Registration No.</p>
                  <p className="text-lg font-bold text-slate-800">{document.vehicleNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold">Status</p>
                  <p className="text-lg font-bold text-slate-800">{document.status}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold">Date of Expiry</p>
                  <p className="text-lg font-bold text-slate-800">{document.expiry}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold">Document ID</p>
                  <p className="text-lg font-bold text-slate-800 uppercase">{document.id}-{Math.floor(Math.random() * 10000)}</p>
                </div>
              </div>

              <div className="border border-slate-200 p-4 bg-slate-50 mt-6">
                <p className="text-xs text-slate-500 uppercase font-bold mb-2">Terms & Conditions / Remarks</p>
                <div className="text-sm text-slate-600 space-y-2">
                  <p>1. This document is valid throughout the territory of India unless otherwise specified.</p>
                  <p>2. Subject to provisions of the Motor Vehicles Act, 1988.</p>
                  <p>3. This is a computer generated document. Fake or tampered documents will attract severe penalties.</p>
                </div>
              </div>

              <div className="mt-12 flex justify-between items-end border-t border-dashed border-slate-300 pt-8">
                <div className="text-center">
                  <div className="w-24 border-b border-slate-800 mx-auto"></div>
                  <p className="text-xs text-slate-500 font-bold mt-2 uppercase">Holder Signature</p>
                </div>
                <div className="text-center">
                  <div className="w-24 border-b border-slate-800 mx-auto"></div>
                  <p className="text-xs text-slate-500 font-bold mt-2 uppercase">Issuing Authority</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
