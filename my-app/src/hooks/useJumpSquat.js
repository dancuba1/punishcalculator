import { useRef } from 'react';

export function useJumpSquat(initialValue = 3) {
  const jumpSquat = useRef(initialValue);
  return jumpSquat;
}