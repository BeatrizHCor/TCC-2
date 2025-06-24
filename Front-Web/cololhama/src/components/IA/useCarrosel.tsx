import { useState } from 'react';

export const useCarousel = (totalItems: number) => {
  const [activeStep, setActiveStep] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, totalItems - 1));
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleDotClick = (index: number) => {
    setActiveStep(index);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && activeStep < totalItems - 1) {
      handleNext();
    }
    if (isRightSwipe && activeStep > 0) {
      handleBack();
    }
  };

  return {
    activeStep,
    handleNext,
    handleBack,
    handleDotClick,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
};