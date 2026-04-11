import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';

interface RatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  showNumber?: boolean;
  reviewCount?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

export default function Rating({
  rating,
  maxRating = 5,
  size = 16,
  showNumber = false,
  reviewCount,
  interactive = false,
  onRate,
}: RatingProps) {
  const stars = Array.from({ length: maxRating }, (_, i) => i + 1);

  const StarIcon = ({ index }: { index: number }) => {
    const filled = index <= Math.floor(rating);
    const half = !filled && index === Math.ceil(rating) && rating % 1 !== 0;
    const name = filled ? 'star' : half ? 'star-half' : 'star-outline';

    if (interactive) {
      return (
        <TouchableOpacity onPress={() => onRate && onRate(index)}>
          <Ionicons name={name} size={size} color={filled || half ? Colors.star : Colors.starEmpty} />
        </TouchableOpacity>
      );
    }

    return <Ionicons name={name} size={size} color={filled || half ? Colors.star : Colors.starEmpty} />;
  };

  return (
    <View style={styles.container}>
      {stars.map(i => (
        <View key={i} style={{ marginHorizontal: 1 }}>
          <StarIcon index={i} />
        </View>
      ))}
      {showNumber && (
        <Text style={[styles.number, { fontSize: size * 0.85 }]}>{rating.toFixed(1)}</Text>
      )}
      {reviewCount !== undefined && (
        <Text style={[styles.count, { fontSize: size * 0.75 }]}>({reviewCount})</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  number: {
    ...Typography.labelSmall,
    color: Colors.textPrimary,
    marginLeft: 4,
    fontWeight: '600',
  },
  count: {
    color: Colors.textMuted,
    marginLeft: 2,
  },
});
