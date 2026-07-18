import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';
import { radius } from '../constants/theme';

interface Marker {
  id: string;
  x: number;
  y: number;
  color: string;
}

interface Props {
  markers?: Marker[];
  height?: number;
}

/** Stylized static map with a pulsing "you are here" marker + place pins. */
export function NearbyMapView({ markers = [], height = 200 }: Props) {
  const { scheme, colors } = useTheme();
  const dark = scheme === 'dark';
  const land = dark ? '#0F1B2E' : '#EAF0F6';
  const road = dark ? '#1B2942' : '#DDE3EC';
  const green = dark ? '#16324A' : '#D6EEE2';

  return (
    <View style={[styles.wrap, { height, backgroundColor: land, borderRadius: radius.xl }]}>
      <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" style={StyleSheet.absoluteFill}>
        <Rect x={8} y={10} width={26} height={20} rx={2} fill={green} opacity={0.8} />
        <Rect x={66} y={60} width={28} height={26} rx={2} fill={green} opacity={0.8} />
        <Path d="M0 45 H100" stroke={road} strokeWidth={6} />
        <Path d="M50 0 V100" stroke={road} strokeWidth={6} />
        <Path d="M0 78 H100" stroke={road} strokeWidth={3} />
        <Path d="M22 0 V100" stroke={road} strokeWidth={3} />
        <Path d="M78 0 V100" stroke={road} strokeWidth={3} />
      </Svg>

      {markers.map((m) => (
        <View key={m.id} style={[styles.marker, { left: `${m.x}%`, top: `${m.y}%` }]}>
          <View style={[styles.markerDot, { backgroundColor: m.color }]} />
        </View>
      ))}

      <View style={styles.centerWrap} pointerEvents="none">
        <View style={[styles.centerPulse, { backgroundColor: colors.police }]} />
        <View style={[styles.centerDot, { backgroundColor: colors.police }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  marker: {
    position: 'absolute',
    marginLeft: -12,
    marginTop: -24,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#fff',
  },
  centerWrap: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    marginLeft: -14,
    marginTop: -14,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerPulse: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    opacity: 0.3,
  },
  centerDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 3,
    borderColor: '#fff',
  },
});
