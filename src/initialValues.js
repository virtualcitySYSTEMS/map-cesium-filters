import { PostProcessStageLibrary } from '@vcmap-cesium/engine';

export function getAmbientOcclusionInitials(map) {
  const ambientOcclusion = map.getScene()?.postProcessStages?.ambientOcclusion;
  if (ambientOcclusion) {
    return {
      enabled: ambientOcclusion.enabled,
      intensity: ambientOcclusion.uniforms.intensity,
      bias: ambientOcclusion.uniforms.bias,
      lengthCap: ambientOcclusion.uniforms.lengthCap,
      stepSize: ambientOcclusion.uniforms.stepSize,
      frustumLength: ambientOcclusion.uniforms.frustumLength,
      blurStepSize: ambientOcclusion.uniforms.blurStepSize,
      ambientOcclusionOnly: ambientOcclusion.uniforms.ambientOcclusionOnly,
    };
  } else {
    return undefined;
  }
}

export function getBloomInitials(map) {
  const bloom = map.getScene()?.postProcessStages?.bloom;
  if (bloom) {
    return {
      enabled: bloom.enabled,
      contrast: bloom.uniforms.contrast,
      brightness: bloom.uniforms.brightness,
      delta: bloom.uniforms.delta,
      sigma: bloom.uniforms.sigma,
      stepSize: bloom.uniforms.stepSize,
      glowOnly: bloom.uniforms.glowOnly,
    };
  } else {
    return undefined;
  }
}

export function getDepthOfFieldInitials(map) {
  if (map.getScene()?.postProcessStages) {
    const dofStage = map
      .getScene()
      ?.postProcessStages?.getStageByName('czm_depth_of_field');
    if (dofStage) {
      return {
        enabled: dofStage.enabled,
        focalDistance: dofStage.uniforms.focalDistance,
        delta: dofStage.uniforms.delta,
        sigma: dofStage.uniforms.sigma,
        stepSize: dofStage.uniforms.stepSize,
      };
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
}
export function getBlackAndWhiteInitials(map) {
  if (map.getScene()?.postProcessStages) {
    const bawStage = map
      .getScene()
      ?.postProcessStages?.getStageByName('czm_black_and_white');
    if (bawStage) {
      return {
        gradations: bawStage.uniforms.gradations,
        enabled: bawStage.enabled,
      };
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
}

export function getBrightnessInitials(map) {
  if (map.getScene()?.postProcessStages) {
    const brtStage = map
      .getScene()
      ?.postProcessStages?.getStageByName('czm_brightness');
    if (brtStage) {
      return {
        enabled: brtStage.enabled,
        brightness: brtStage.uniforms.brightness,
      };
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
}

export function getHDRInitials(map) {
  const hdr = map.getScene();

  if (hdr) {
    return {
      gamma: hdr.gamma,
      enabled: hdr.highDynamicRange,
    };
  } else {
    return undefined;
  }
}

export function getBlurInitials(map) {
  if (map.getScene()?.postProcessStages) {
    const blrStage = map
      .getScene()
      ?.postProcessStages?.getStageByName('czm_blur');
    if (blrStage) {
      return {
        enabled: blrStage.enabled,
        delta: blrStage.uniforms.delta,
        sigma: blrStage.uniforms.sigma,
        stepSize: blrStage.uniforms.stepSize,
      };
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
}

export function getNightVisionInitials(map) {
  if (map.getScene()?.postProcessStages) {
    const nvStage = map
      .getScene()
      ?.postProcessStages?.getStageByName('czm_night_vision');
    if (nvStage) {
      return {
        enabled: nvStage.enabled,
      };
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
}

export function getSilhouetteInitials(map) {
  const silStage = PostProcessStageLibrary.createSilhouetteStage();

  if (map.getScene()?.postProcessStages?.getStageByName(silStage.name)) {
    const silhouette = map
      .getScene()
      ?.postProcessStages?.getStageByName(silStage.name);
    if (silhouette) {
      return {
        enabled: silhouette.enabled,
        color: silhouette.uniforms.color,
      };
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
}

export function getLightingInitials(map) {
  return {
    light: map.getScene().light,
    dynamicAtmosphereLighting: map.getScene().globe.dynamicAtmosphereLighting,
    dynamicAtmosphereLightingFromSun:
      map.getScene().globe.dynamicAtmosphereLighting,
    intensity: map.getScene().light.intensity,
    color: map.getScene().light.color,
  };
}

export function collectInitialValues(map) {
  return {
    map,
    ambientOcclusion: getAmbientOcclusionInitials(map),
    blackAndWhite: getBlackAndWhiteInitials(map),
    bloom: getBloomInitials(map),
    hdr: getHDRInitials(map),
    depthOfField: getDepthOfFieldInitials(map),
    brightness: getBrightnessInitials(map),
    blur: getBlurInitials(map),
    silhouette: getSilhouetteInitials(map),
    nightVision: getNightVisionInitials(map),
    lighting: getLightingInitials(map),
  };
}
