'use client';

import React from 'react';
import { Search, Cpu, CheckCircle2 } from 'lucide-react';

export const WorkflowSteps: React.FC = () => {
  const steps = [
    {
      num: '01',
      icon: Search,
      title: 'Target Specification',
      desc: 'Enter any public username, handle, or identity string. Filter optionally across categories like Developer, Social, Media, or Finance.',
    },
    {
      num: '02',
      icon: Cpu,
      title: 'Parallel Asynchronous Scan',
      desc: 'UserScope dispatches concurrent GraphQL and REST probe workers across 700+ public registries, streaming responses back in real time.',
    },
    {
      num: '03',
      icon: CheckCircle2,
      title: 'Correlate, Map & Export',
      desc: 'Explore unified avatar history, bio snippets, and account age. Pivot into graph clusters or download formatted forensic reports.',
    },
  ];

  return (
    <section className="space-y-6 pt-8 sm:pt-14">
      {/* Section Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <span className="text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full bg-apple-well text-apple-label-secondary border border-apple-border">
          Workflow
        </span>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-apple-label">
          How UserScope Investigates
        </h2>
        <p className="text-xs sm:text-sm text-apple-label-secondary leading-relaxed">
          From target handle to comprehensive footprint map in three simple steps.
        </p>
      </div>

      {/* 3 Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="apple-card rounded-[20px] sm:rounded-[24px] p-5 sm:p-6 border border-apple-border flex flex-col justify-between space-y-4 relative"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-[10px] bg-apple-blue/15 text-apple-blue flex items-center justify-center font-bold text-sm shadow-sm">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-mono text-xs font-semibold text-apple-label-tertiary">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-apple-label tracking-tight">
                  {step.title}
                </h3>
                <p className="text-xs text-apple-label-secondary leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
