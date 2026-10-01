import { useEffect, useRef, useState } from "react";
import { AccessibilityInfo, Animated, Easing } from "react-native";

/** True while the OS asks for less motion; animated components then hold still. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    let live = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((v) => live && setReduced(v));
    const sub = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduced);
    return () => {
      live = false;
      sub.remove();
    };
  }, []);
  return reduced;
}

/** Loops 0 -> 1 -> 0 (pulse) or 0 -> 1 (slide) unless reduced motion is on. */
export function useLoop(duration: number, mode: "pulse" | "slide") {
  const value = useRef(new Animated.Value(0)).current;
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const to = (toValue: number, d: number) => Animated.timing(value, { toValue, duration: d, easing: Easing.inOut(Easing.ease), useNativeDriver: true });
    const loop = Animated.loop(Animated.sequence(mode === "pulse" ? [to(1, duration), to(0, duration)] : [to(0, 0), to(1, duration)]));
    loop.start();
    return () => loop.stop();
  }, [value, reduced, duration, mode]);
  return value;
}
