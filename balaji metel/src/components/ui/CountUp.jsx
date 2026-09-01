import React, { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion';

export default function CountUp({ end, duration = 2, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!isInView) return;

    const finalValue = typeof end === 'number' ? end : parseInt(String(end).replace(/[^0-9]/g, ''), 10);
    if (isNaN(finalValue)) return;

    let currentStep = 0;
    const totalSteps = 50;
    const stepTime = (duration * 1000) / totalSteps;

    const timer = setInterval(() => {
      currentStep += 1;
      const progress = currentStep / totalSteps;
      // Smooth ease-out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.round(easeOut * finalValue);

      setCount(currentCount);

      if (currentStep >= totalSteps) {
        setCount(finalValue);
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, end, duration]);

  return (
    <span ref={ref} className="inline-block tabular-nums">
      {prefix}
      {count}
      {suffix}
    </span>
  );
}
