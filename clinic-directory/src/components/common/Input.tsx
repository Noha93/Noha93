import React, { useState, ReactNode } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { BorderRadius, Layout, Spacing } from '../../constants/spacing';
import { Typography, FontSize } from '../../constants/typography';
import { useLanguage } from '../../context/LanguageContext';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  containerStyle?: ViewStyle;
  isPassword?: boolean;
  required?: boolean;
}

export default function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  containerStyle,
  isPassword = false,
  required = false,
  style,
  ...props
}: InputProps) {
  const { isRTL } = useLanguage();
  const [secureText, setSecureText] = useState(isPassword);
  const [isFocused, setIsFocused] = useState(false);

  const borderColor = error
    ? Colors.error
    : isFocused
    ? Colors.primary
    : Colors.border;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <View style={styles.labelRow}>
          <Text style={[styles.label, isRTL && styles.rtlText]}>{label}</Text>
          {required && <Text style={styles.required}> *</Text>}
        </View>
      )}
      <View
        style={[
          styles.inputWrapper,
          { borderColor },
          isFocused && styles.focusedWrapper,
        ]}
      >
        {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            isRTL && styles.rtlInput,
            leftIcon ? { paddingLeft: 0 } : {},
            (rightIcon || isPassword) ? { paddingRight: 0 } : {},
            style,
          ]}
          placeholderTextColor={Colors.textMuted}
          secureTextEntry={secureText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          textAlign={isRTL ? 'right' : 'left'}
          {...props}
        />
        {isPassword ? (
          <TouchableOpacity
            style={styles.rightIconContainer}
            onPress={() => setSecureText(!secureText)}
          >
            <Ionicons
              name={secureText ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color={Colors.textMuted}
            />
          </TouchableOpacity>
        ) : rightIcon ? (
          <View style={styles.rightIconContainer}>{rightIcon}</View>
        ) : null}
      </View>
      {error ? (
        <Text style={[styles.error, isRTL && styles.rtlText]}>{error}</Text>
      ) : hint ? (
        <Text style={[styles.hint, isRTL && styles.rtlText]}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  label: {
    ...Typography.label,
    color: Colors.textPrimary,
  },
  required: {
    color: Colors.error,
    fontSize: FontSize.base,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundWhite,
    height: Layout.inputHeight,
    paddingHorizontal: Spacing.base,
  },
  focusedWrapper: {
    backgroundColor: Colors.primaryUltraLight,
  },
  input: {
    flex: 1,
    ...Typography.body,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  rtlInput: {
    textAlign: 'right',
  },
  rtlText: {
    textAlign: 'right',
  },
  leftIconContainer: {
    marginRight: Spacing.sm,
  },
  rightIconContainer: {
    marginLeft: Spacing.sm,
  },
  error: {
    ...Typography.caption,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
  hint: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
});
