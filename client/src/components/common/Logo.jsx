import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { Sparkles } from 'lucide-react';

export default function Logo({ className, showText = true, size = 'md' }) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <Link to="/" className={cn('flex items-center gap-2 group', className)}>
      <div className={cn(
        'relative flex items-center justify-center rounded-xl',
        'bg-gradient-to-br from-primary to-secondary p-2',
        'group-hover:shadow-glow transition-shadow duration-300',
        sizes[size]
      )}>
        <Sparkles className="w-full h-full text-dark-bg" />
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 blur-xl -z-10" />
      </div>
      {showText && (
        <span className={cn(
          'font-bold tracking-tight',
          textSizes[size]
        )}>
          <span className="text-text-primary">AI</span>
          <span className="text-gradient"> Super Hub</span>
        </span>
      )}
    </Link>
  );
}
