import { inRange, optional } from '@vcsuite/check';

export const ambientOcclusionPattern = {
  enabled: Boolean,
  intensity: inRange(0, 100, Number),
  bias: inRange(0, 1, Number),
  lengthCap: inRange(0, 1000, Number),
  stepSize: inRange(0, 10, Number),
  frustumLength: inRange(0, 10000, Number),
  blurStepSize: inRange(0, 10, Number),
  ambientOcclusionOnly: Boolean,
};

export const bloomPattern = {
  enabled: Boolean,
  contrast: inRange(-255, 255, Number),
  brightness: inRange(-1, 1, Number),
  delta: inRange(-10, 10, Number),
  sigma: inRange(-10, 100, Number),
  stepSize: inRange(0, 100, Number),
  glowOnly: Boolean,
};

export const depthOfFieldPattern = {
  enabled: Boolean,
  focalDistance: inRange(0, 1000, Number),
  delta: inRange(0, 100, Number),
  sigma: inRange(0, 100, Number),
  stepSize: inRange(0, 100, Number),
};

export const blackAndWhitePattern = {
  enabled: Boolean,
  gradations: inRange(0, 1000, Number),
};

export const brightnessPattern = {
  enabled: Boolean,
  brightness: inRange(0, 10, Number),
};

export const blurPattern = {
  enabled: Boolean,
  delta: inRange(0, 10, Number),
  sigma: inRange(0, 10, Number),
  stepSize: inRange(0, 100, Number),
};

export const hdrPattern = {
  enabled: Boolean,
  gamma: inRange(0, 1000, Number),
};

export const nightVisionPattern = {
  enabled: Boolean,
};

export const silhouettePattern = {
  enabled: Boolean,
  color: String,
};

export const lightingPattern = {
  enabled: Boolean,
  selected: inRange(0, 3, Number),
  lightIntensity: inRange(0, 100, Number),
  color: String,
  showButton: Boolean,
  x: Number,
  y: Number,
  z: Number,
};

export function makeOptional(pattern) {
  const optionalPattern = {};
  Object.keys(pattern).forEach((key) => {
    optionalPattern[key] = optional(pattern[key]);
  });
  return optionalPattern;
}
