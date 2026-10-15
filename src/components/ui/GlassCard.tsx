import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gold' | 'dark';
}

export function GlassCard({
  children,
  className = '',
  variant = 'default',
  ...props
}: GlassCardProps) {
  const variantStyles = {
    default: 'bg-navy-light/60 border-white/10 hover:border-white/20',
    gold: 'bg-navy-mid/70 border-gold/30 hover:border-gold/60 shadow-gold/5',
    dark: 'bg-navy/80 border-white/5 hover:border-white/15',
  };

  return (
    <div
      className={`relative backdrop-blur-xl rounded-2xl border p-6 md:p-8 transition-all duration-300 shadow-xl ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
