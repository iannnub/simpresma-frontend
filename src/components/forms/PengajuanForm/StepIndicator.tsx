import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
}

const STEPS = [
  { step: 1, title: 'Informasi Lomba', desc: 'Data & Capaian' },
  { step: 2, title: 'Tautan Bukti', desc: 'Sertifikat & Dokumen' },
  { step: 3, title: 'Mata Kuliah', desc: 'Pilihan Konversi SKS' },
  { step: 4, title: 'Konfirmasi', desc: 'Review & Submit' },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="w-full py-4 px-2 sm:px-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-soft-sm transition-colors duration-200">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {STEPS.map((item, index) => {
          const isCompleted = item.step < currentStep;
          const isCurrent = item.step === currentStep;

          return (
            <React.Fragment key={item.step}>
              {/* Step Circle & Label */}
              <div className="flex flex-col items-center text-center">
                <div
                  className={cn(
                    'w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200',
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : isCurrent
                      ? 'bg-primary text-primary-foreground ring-4 ring-primary/20 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700'
                  )}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : item.step}
                </div>
                <div className="mt-2">
                  <p
                    className={cn(
                      'text-xs font-semibold leading-tight hidden sm:block',
                      isCurrent
                        ? 'text-primary'
                        : isCompleted
                        ? 'text-slate-800 dark:text-slate-200'
                        : 'text-slate-400 dark:text-slate-500'
                    )}
                  >
                    {item.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground hidden md:block">
                    {item.desc}
                  </p>
                </div>
              </div>

              {/* Connecting Line between steps */}
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-2 sm:mx-4 transition-colors duration-200 -mt-6 sm:-mt-8',
                    item.step < currentStep
                      ? 'bg-emerald-600'
                      : 'bg-slate-200 dark:bg-slate-800'
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
