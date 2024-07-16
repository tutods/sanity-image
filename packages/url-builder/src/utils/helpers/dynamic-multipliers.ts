const dynamicMultipliers = (width: number): number[] => {
  // For really small images, use larger steps
  if (width < 160) {
    return [0.5, 1, 2];
  }

  // For typical width images, use standard steps
  if (width < 750) {
    return [0.5, 1, 1.5, 2];
  }

  // For larger images, include 0.25x and 0.75x steps
  if (width < 1400) {
    return [0.25, 0.5, 0.75, 1, 1.5, 2];
  }

  // For really large images, use a wider range of steps at the low end, and smaller steps at the high end
  return [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
};

export { dynamicMultipliers };
