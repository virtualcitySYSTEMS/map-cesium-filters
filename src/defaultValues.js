export function getAmbientOcclusionDefaults() {
  return {
    enabled: false,
    intensity: 0.5,
    bias: 0.1,
    lengthCap: 3,
    stepSize: 1.95,
    frustumLength: 1000,
    blurStepSize: 0.86,
    ambientOcclusionOnly: false,
  };
}

export function getBloomDefaults() {
  return {
    enabled: false,
    contrast: 128,
    brightness: -0.3,
    delta: 1,
    sigma: 2,
    stepSize: 1,
    glowOnly: false,
  };
}
export function getDepthOfFieldDefaults() {
  return {
    enabled: false,
    focalDistance: 5,
    delta: 1,
    sigma: 2,
    stepSize: 1,
  };
}
export function getBlackAndWhiteDefaults() {
  return {
    enabled: false,
    gradations: 5,
  };
}

export function getBrightnessDefaults() {
  return {
    enabled: false,
    brightness: 0.5,
  };
}

export function getHDRDefaults() {
  return {
    enabled: false,
    gamma: 2.2,
  };
}

export function getBlurDefaults() {
  return {
    enabled: false,
    delta: 1,
    sigma: 2,
    stepSize: 1,
  };
}

export function getNightVisionDefaults() {
  return {
    enabled: false,
  };
}

export function getSilhouetteDefaults() {
  return {
    enabled: false,
    color: '#E00E0E',
  };
}

export function getLightingDefaults(selected) {
  if (selected === 0) {
    return {
      enabled: false,
      selected,
      lightIntensity: 2,
      color: '#FFFFFF',
      showButton: false,
      x: 0,
      y: 0,
      z: 0,
    };
  } else if (selected === 1) {
    return {
      enabled: false,
      selected,
      lightIntensity: 0.5,
      color: '#E6ECFF',
      showButton: false,
      x: 0,
      y: 0,
      z: 0,
    };
  } else if (selected === 2) {
    return {
      enabled: false,
      selected,
      lightIntensity: 1,
      color: '#FFFFFF',
      showButton: false,
      x: 0,
      y: 0,
      z: 0,
    };
  } else if (selected === 3) {
    return {
      enabled: false,
      selected,
      lightIntensity: 1,
      color: '#FFFFFF',
      showButton: true,
      x: 0,
      y: 0,
      z: 0,
    };
  } else {
    return {
      enabled: false,
      selected: 0,
      lightIntensity: 2,
      color: '#FFFFFF',
      showButton: false,
      x: 0,
      y: 0,
      z: 0,
    };
  }
}

export function getBloomComponentDefaults() {}
