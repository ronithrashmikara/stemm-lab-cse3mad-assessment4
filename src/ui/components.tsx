import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ReactNode } from 'react';

import { colors, globalStyles } from './theme';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
};

export function PrimaryButton({ label, onPress, variant = 'primary', disabled = false }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          variant === 'primary' && styles.primaryText,
          variant !== 'primary' && styles.secondaryText,
          disabled && styles.disabledText,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

type CardProps = {
  title: string;
  children: ReactNode;
};

export function SectionCard({ title, children }: CardProps) {
  return (
    <View style={styles.card}>
      <Text style={globalStyles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

export function StatusPill({ label, tone = 'neutral' }: { label: string; tone?: 'good' | 'warn' | 'bad' | 'neutral' }) {
  return (
    <View
      style={[
        styles.pill,
        tone === 'good' && styles.pillGood,
        tone === 'warn' && styles.pillWarn,
        tone === 'bad' && styles.pillBad,
      ]}
    >
      <Text style={styles.pillText}>{label}</Text>
    </View>
  );
}

export function MetricTile({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  primary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.75,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0,
  },
  primaryText: {
    color: '#ffffff',
  },
  secondaryText: {
    color: colors.primary,
  },
  disabledText: {
    color: colors.muted,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderColor: colors.border,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  pill: {
    borderRadius: 999,
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: 'flex-start',
  },
  pillGood: {
    backgroundColor: colors.softGreen,
    borderColor: '#a7d8bf',
  },
  pillWarn: {
    backgroundColor: colors.softAmber,
    borderColor: '#e3c37a',
  },
  pillBad: {
    backgroundColor: '#ffe8e4',
    borderColor: '#e2aaa5',
  },
  pillText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  metric: {
    flex: 1,
    minWidth: 92,
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    gap: 4,
  },
  metricValue: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 20,
  },
  metricLabel: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 16,
  },
});
