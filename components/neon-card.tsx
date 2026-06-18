import { View, type ViewProps } from 'react-native';
import { cn } from '@/lib/utils';

interface NeonCardProps extends ViewProps {
  className?: string;
  children?: React.ReactNode;
  glow?: boolean;
}

export function NeonCard({ className, children, glow = true, ...props }: NeonCardProps) {
  return (
    <View
      className={cn(
        'bg-surface rounded-xl p-4 border',
        glow ? 'border-primary shadow-lg' : 'border-border',
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
}
