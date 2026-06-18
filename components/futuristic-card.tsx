import React from 'react';
import { View, ViewProps } from 'react-native';
import { cn } from '@/lib/utils';

interface FuturisticCardProps extends ViewProps {
  className?: string;
  gradient?: 'cyan' | 'purple' | 'pink' | 'blue' | 'green';
  glow?: boolean;
}

export function FuturisticCard({
  children,
  className,
  gradient = 'cyan',
  glow = true,
  style,
  ...props
}: FuturisticCardProps) {
  const gradientClasses = {
    cyan: 'bg-gradient-to-br from-cyan-500/20 via-transparent to-blue-500/20',
    purple: 'bg-gradient-to-br from-purple-500/20 via-transparent to-pink-500/20',
    pink: 'bg-gradient-to-br from-pink-500/20 via-transparent to-red-500/20',
    blue: 'bg-gradient-to-br from-blue-500/20 via-transparent to-cyan-500/20',
    green: 'bg-gradient-to-br from-green-500/20 via-transparent to-cyan-500/20',
  };

  return (
    <View
      className={cn(
        'relative rounded-2xl border border-cyan-500/30 overflow-hidden',
        gradientClasses[gradient],
        glow && 'shadow-lg shadow-cyan-500/20',
        className
      )}
      style={[
        glow && {
          shadowColor: '#00D9FF',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 8,
        },
        style,
      ]}
      {...props}
    >
      {/* Animated border glow effect */}
      <View
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          borderWidth: 1,
          borderColor: 'rgba(0, 217, 255, 0.2)',
        }}
      />
      {children}
    </View>
  );
}
