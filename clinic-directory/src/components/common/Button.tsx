import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import { BorderRadius, Layout } from '../../constants/spacing';
import { Typography } from '../../constants/typography';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
  fullWidth = false,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const getHeight = () => {
    if (size === 'sm') return Layout.buttonHeightSm;
    if (size === 'lg') return Layout.buttonHeightLg;
    return Layout.buttonHeight;
  };

  const getTextStyle = (): TextStyle => {
    const base: TextStyle = {
      ...Typography.button,
      color: Colors.textWhite,
    };
    if (size === 'sm') return { ...base, ...Typography.buttonSmall };
    if (size === 'lg') return { ...base, ...Typography.buttonLarge };
    return base;
  };

  const containerStyle: ViewStyle = {
    height: getHeight(),
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    opacity: isDisabled ? 0.6 : 1,
    ...(fullWidth ? { width: '100%' } : {}),
    ...style,
  };

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        style={containerStyle}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={[Colors.primary, Colors.primaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          {loading ? (
            <ActivityIndicator color={Colors.textWhite} />
          ) : (
            <View style={styles.contentRow}>
              {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
              <Text style={[getTextStyle(), textStyle]}>{title}</Text>
              {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (variant === 'gold') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        style={containerStyle}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={[Colors.secondary, Colors.secondaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          {loading ? (
            <ActivityIndicator color={Colors.textWhite} />
          ) : (
            <View style={styles.contentRow}>
              {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
              <Text style={[getTextStyle(), { color: Colors.primaryDark }, textStyle]}>{title}</Text>
              {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'secondary':
        return { backgroundColor: Colors.primaryUltraLight };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: Colors.primary,
        };
      case 'ghost':
        return { backgroundColor: 'transparent' };
      case 'danger':
        return { backgroundColor: Colors.error };
      default:
        return { backgroundColor: Colors.primary };
    }
  };

  const getVariantTextColor = (): string => {
    switch (variant) {
      case 'secondary':
        return Colors.primary;
      case 'outline':
        return Colors.primary;
      case 'ghost':
        return Colors.primary;
      case 'danger':
        return Colors.textWhite;
      default:
        return Colors.textWhite;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.base,
        { height: getHeight() },
        getVariantStyle(),
        containerStyle,
      ]}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={getVariantTextColor()} />
      ) : (
        <View style={styles.contentRow}>
          {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
          <Text style={[getTextStyle(), { color: getVariantTextColor() }, textStyle]}>{title}</Text>
          {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});
