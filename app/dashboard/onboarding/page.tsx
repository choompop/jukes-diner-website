'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Rocket,
  CheckCircle2,
  Circle,
  ChevronRight,
  Phone,
  Clock,
  DollarSign,
  Upload,
  Info
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export default function Onboarding() {
  const [selectedStep, setSelectedStep] = useState<number | null>(0);

  const steps = [
    {
      title: "Business License",
      location: "Davidson County",
      status: "pending",
      instructions: "Apply for a standard business license through the Davidson County Clerk's office. This is required before any other permits.",
      contact: "County Clerk Office",
      timeline: "2-3 Weeks",
      cost: "$15.00",
      details: "You will need your EIN and proof of residency."
    },
    {
      title: "Health Permit",
      location: "Metro Health",
      status: "in-progress",
      instructions: "Submit your mobile food unit plans for review. Once approved, schedule an opening inspection.",
      contact: "Hector (Inspector)",
      phone: "(615) 555-0192",
      timeline: "4-6 Weeks",
      cost: "$250.00",
      details: "Ensure your commissary agreement is signed before applying."
    },
    {
      title: "Fire Extinguisher Certification",
      location: "Local Fire Marshal",
      status: "completed",
      instructions: "Truck must have a Class K extinguisher and a 2A10BC extinguisher, both with current tags.",
      contact: "Fire Safety Pros",
      timeline: "1 Day",
      cost: "$85.00",
      details: "Tags must be visible and updated annually."
    },
    {
      title: "Screen Door Installation",
      location: "Serving Window",
      status: "pending",
      instructions: "Metro Health requires a fine-mesh screen door on all serving windows to prevent pests.",
      contact: "Truck Builder",
      timeline: "1 Week",
      cost: "$450.00",
      details: "Must be self-closing and tight-fitting."
    },
    {
      title: "Insurance (COI)",
      location: "Goosehead Insurance",
      status: "pending",
      instructions: "Obtain a Certificate of Insurance naming Juke's Diner Franchise LLC as additionally insured.",
      contact: "Goosehead Agent",
      timeline: "3 Days",
      cost: "Varies",
      details: "General liability and commercial auto required."
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl text-diner-black mb-1">GETTING STARTED</h1>
        <p className="text-gray-500 font-serif italic">Your journey to launch. Justin's current permit journey feeds this in real time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checklist Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50">
              <h2 className="font-display text-lg">LAUNCH CHECKLIST</h2>
              <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-diner-teal w-[35%] transition-all duration-1000" />
              </div>
              <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest">35% COMPLETE</p>
            </div>
            <div className="p-2">
              {steps.map((step, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedStep(i)}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-2xl transition-all text-left group",
                    selectedStep === i ? "bg-diner-cream" : "hover:bg-gray-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {step.status === 'completed' ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : step.status === 'in-progress' ? (
                      <div className="h-5 w-5 rounded-full border-2 border-diner-teal border-t-transparent animate-spin" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-300 group-hover:text-diner-red" />
                    )}
                    <div>
                      <h4 className={cn(
                        "text-sm font-bold",
                        selectedStep === i ? "text-diner-red" : "text-gray-700"
                      )}>{step.title}</h4>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest">{step.location}</p>
                    </div>
                  </div>
                  <ChevronRight className={cn(
                    "h-4 w-4 transition-transform",
                    selectedStep === i ? "translate-x-1 text-diner-red" : "text-gray-300"
                  )} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step Details */}
        <div className="lg:col-span-2">
          {selectedStep !== null ? (
            <motion.div
              key={selectedStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-8"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl text-diner-black mb-2">{steps[selectedStep].title}</h2>
                  <span className={cn(
                    "text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest",
                    steps[selectedStep].status === 'completed' ? "bg-green-100 text-green-700" :
                    steps[selectedStep].status === 'in-progress' ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
                  )}>
                    {steps[selectedStep].status.replace('-', ' ')}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-gray-500">
                    <Info className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <div className="flex items-center gap-2 text-diner-red mb-1">
                    <Clock className="h-4 w-4" />
                    <span className="text-[10px] font-display uppercase tracking-widest">Timeline</span>
                  </div>
                  <p className="text-sm font-bold">{steps[selectedStep].timeline}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <div className="flex items-center gap-2 text-diner-teal mb-1">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-[10px] font-display uppercase tracking-widest">Est. Cost</span>
                  </div>
                  <p className="text-sm font-bold">{steps[selectedStep].cost}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <div className="flex items-center gap-2 text-blue-500 mb-1">
                    <Phone className="h-4 w-4" />
                    <span className="text-[10px] font-display uppercase tracking-widest">Contact</span>
                  </div>
                  <p className="text-sm font-bold">{steps[selectedStep].contact}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-display text-sm uppercase tracking-widest text-gray-400">Instructions</h3>
                <p className="text-lg text-gray-700 font-serif leading-relaxed italic">
                  &ldquo;{steps[selectedStep].instructions}&rdquo;
                </p>
                <div className="p-4 bg-diner-cream/50 rounded-2xl border border-diner-chrome/30">
                  <p className="text-sm text-gray-600 font-serif">
                    <span className="font-bold text-diner-red">Pro Tip:</span> {steps[selectedStep].details}
                  </p>
                </div>
              </div>

              <div className="pt-8 border-t border-gray-50">
                <h3 className="font-display text-sm uppercase tracking-widest text-gray-400 mb-4">Proof of Completion</h3>
                <div className="border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center hover:border-diner-teal transition-colors cursor-pointer group">
                  <Upload className="h-12 w-12 text-gray-300 mx-auto mb-4 group-hover:text-diner-teal transition-colors" />
                  <p className="text-sm text-gray-500 font-serif italic">Drag and drop your permit or receipt here, or click to browse.</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
              <Rocket className="h-24 w-24 mb-6" />
              <h2 className="text-3xl font-display">SELECT A STEP</h2>
              <p className="font-serif italic max-w-xs">Choose a task from the checklist to see detailed instructions and requirements.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
