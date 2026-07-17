import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: 'default' | 'premium' | 'glass'
}

export function Card({ children, className = '', variant = 'default', ...props }: CardProps) {
  const baseStyle = 'rounded-xl border transition-all duration-300'
  
  const variants = {
    default: 'bg-zinc-900/50 border-zinc-800 text-zinc-100 shadow-lg',
    premium: 'bg-gradient-to-br from-zinc-900 to-black border-emerald-500/20 text-zinc-100 shadow-xl relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-emerald-500/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:pointer-events-none',
    glass: 'bg-zinc-950/60 backdrop-blur-md border-zinc-800/80 text-zinc-100 shadow-2xl'
  }

  return (
    <div 
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-6 pb-4 border-b border-zinc-800/50 ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className = '', ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={`text-lg font-semibold tracking-tight text-white ${className}`} {...props}>
      {children}
    </h3>
  )
}

export function CardDescription({ children, className = '', ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`text-sm text-zinc-400 ${className}`} {...props}>
      {children}
    </p>
  )
}

export function CardContent({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-6 pt-4 border-t border-zinc-800/50 ${className}`} {...props}>
      {children}
    </div>
  )
}
