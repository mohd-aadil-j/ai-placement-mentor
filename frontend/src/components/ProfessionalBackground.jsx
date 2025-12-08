import React from "react";

const ProfessionalBackground = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Main background gradient - professional tech look */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #0f172a 50%, #1a1f35 75%, #0f172a 100%)
          `,
          backgroundSize: '400% 400%',
        }}
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(0deg, transparent 24%, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,0.05) 75%, rgba(255,255,255,0.05) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,0.05) 75%, rgba(255,255,255,0.05) 76%, transparent 77%, transparent)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Accent gradient orbs (subtle, non-animated) */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 opacity-10 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/3 w-80 h-80 opacity-10 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute top-1/2 right-1/4 w-72 h-72 opacity-10 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, transparent 70%)',
        }}
      />
    </div>
  );
};

export default ProfessionalBackground;
