import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gold' | 'dark' | 'soft';
}

export function GlassCard({
  children,
  className = '',
  variant = 'default',
  ...props
}: GlassCardProps) {
  const variantStyles = {
    default:
      'bg-white border-[#E9E2D0] hover:border-[#B8913A]/50 shadow-[0_8px_30px_rgba(143,107,30,0.08)] hover:shadow-[0_14px_36px_rgba(143,107,30,0.14)]',
    gold:
      'bg-[#FAF7F0] border-[#D4AF5A]/40 hover:border-[#B8913A] shadow-[0_8px_30px_rgba(143,107,30,0.08)] hover:shadow-[0_14px_36px_rgba(143,107,30,0.16)]',
    dark:
      'bg-white border-[#E9E2D0] hover:border-[#B8913A]/50 shadow-[0_8px_30px_rgba(143,107,30,0.08)] hover:shadow-[0_14px_36px_rgba(143,107,30,0.14)]',
    soft:
      'bg-[#FAF7F0] border-[#E9E2D0] hover:border-[#B8913A]/40 shadow-[0_8px_30px_rgba(143,107,30,0.06)] hover:shadow-[0_14px_36px_rgba(143,107,30,0.12)]',
  };

  return (
    <div
      className={`relative rounded-2xl border p-6 md:p-8 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
