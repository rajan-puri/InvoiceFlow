import React from "react";

export default function SocialProof() {
  const brands = [
    { name: "Horizon Media Dynamics", tag: "Creative Agency" },
    { name: "Apex Logistics India", tag: "Supply Chain" },
    { name: "Veloce Cloud Labs", tag: "SaaS & Tech" },
    { name: "Quadra Design Studio", tag: "Product Studio" },
    { name: "Zenith Retail Solutions", tag: "Commerce" },
  ];

  return (
    <section className="py-10 bg-slate-50/70 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-6">
          Built for businesses, agencies & freelancers
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-75">
          {brands.map((brand, i) => (
            <div
              key={i}
              className="flex items-center gap-2 py-1 px-3 rounded-md text-slate-700 bg-white border border-slate-200/60 shadow-2xs"
            >
              <div className="w-2 h-2 rounded-full bg-blue-600/70" />
              <span className="text-xs sm:text-sm font-semibold tracking-tight text-slate-800">
                {brand.name}
              </span>
              <span className="text-[10px] uppercase font-medium text-slate-400 ml-1">
                {brand.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
