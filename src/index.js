import { WindowSlot, ButtonLocation } from '@vcmap/ui';
import { CesiumMap } from '@vcmap/core';
import { reactive, computed, watch, shallowReactive } from 'vue';
import {
  PostProcessStageLibrary,
  Color,
  Matrix3,
  Cartesian3,
  defined,
  Transforms,
  SunLight,
  Simon1994PlanetaryPositions,
  DirectionalLight,
} from '@vcmap-cesium/engine';
import { is } from '@vcsuite/check';
import { name, version, mapVersion } from '../package.json';
import getDefaultOptions from './defaultOptions.js';
import FilterEffects, { windowId } from './FilterEffects.vue';
import {
  getAmbientOcclusionDefaults,
  getBlackAndWhiteDefaults,
  getHDRDefaults,
  getBloomDefaults,
  getDepthOfFieldDefaults,
  getBrightnessDefaults,
  getBlurDefaults,
  getNightVisionDefaults,
  getSilhouetteDefaults,
  getLightingDefaults,
} from './defaultValues.js';
import {
  ambientOcclusionPattern,
  blackAndWhitePattern,
  hdrPattern,
  bloomPattern,
  depthOfFieldPattern,
  brightnessPattern,
  blurPattern,
  nightVisionPattern,
  silhouettePattern,
  lightingPattern,
  makeOptional,
} from './validators.js';
import de from './i18n/de.json';
import en from './i18n/en.json';

export function getToggleTitle(action) {
  if (action?.active) {
    return 'cesium-filters.toolState.deactivate';
  }
  return 'cesium-filters.toolState.activate';
}
function setupButton(app) {
  const windowComponent = {
    id: windowId,
    component: FilterEffects,
    slot: WindowSlot.DYNAMIC_RIGHT,
    state: {
      headerTitle: 'cesium-filters.title',
      infoUrlCallback: app.getHelpUrlCallback(
        '/components/genericFunctions.html',
      ),
    },
  };

  const action = reactive({
    name: computed(() => getToggleTitle(this)),
    title: 'cesium-filters.toolState.open',
    icon: '$vcsRectangle',
    active: false,
    disabled: false,
    callback() {
      if (this.active) {
        app.windowManager.remove(windowComponent.id);
        this.active = false;
      } else {
        this.active = true;
        app.windowManager.add(windowComponent, name);
      }
    },
  });

  const listeners = [
    app.windowManager.added.addEventListener(({ id }) => {
      if (id === windowComponent.id) {
        action.active = true;

        action.title = getToggleTitle(action);
      }
    }),
    app.windowManager.removed.addEventListener(({ id }) => {
      if (id === windowComponent.id) {
        action.active = false;
        action.title = getToggleTitle(action);
      }
    }),
  ];

  const destroy = () => {
    listeners.forEach((cb) => cb());
  };
  return { action, destroy, windowComponent };
}
/**
 * @param {PluginConfig} config - the configuration of this plugin instance, passed in from the app.
 * @returns {import("@vcmap/ui/src/vcsUiApp").VcsPlugin<PluginConfig, PluginState>}
 */
export default function FilterEffectsPlugin(config) {
  const myValues = shallowReactive({
    ambientOcclusion: {
      ...getAmbientOcclusionDefaults(),
    },
    blackAndWhite: {
      ...getBlackAndWhiteDefaults(),
    },
    hdr: {
      ...getHDRDefaults(),
    },
    bloom: {
      ...getBloomDefaults(),
    },
    depthOfField: {
      ...getDepthOfFieldDefaults(),
    },
    brightness: {
      ...getBrightnessDefaults(),
    },
    blur: {
      ...getBlurDefaults(),
    },
    nightVision: {
      ...getNightVisionDefaults(),
    },
    silhouette: {
      ...getSilhouetteDefaults(),
    },
    lighting: {
      ...getLightingDefaults(),
    },
  });
  const watcher = [];

  return {
    get name() {
      return name;
    },
    get version() {
      return version;
    },
    get mapVersion() {
      return mapVersion;
    },
    get config() {
      return { ...getDefaultOptions(), ...config };
    },
    get values() {
      return myValues;
    },

    initialize(vcsUiApp, state) {
      this._app = vcsUiApp;
      const { action, destroy, windowComponent } = setupButton(vcsUiApp);
      this._destroyAction = destroy;
      this._mapChangedListener = vcsUiApp.maps.mapActivated.addEventListener(
        (map) => {
          if (!(map instanceof CesiumMap)) {
            if (this._app.windowManager.has(windowId)) {
              this._app.windowManager.remove(windowId);
            }
            action.disabled = true;
          } else {
            action.disabled = false;
            vcsUiApp.windowManager.remove(windowComponent.id);
          }
        },
      );

      function applyState() {
        if (state) {
          if (is(state.ao, makeOptional(ambientOcclusionPattern))) {
            myValues.ambientOcclusion = {
              ...myValues.ambientOcclusion,
              ...state.ao,
            };
          }
        }

        if (state) {
          if (is(state.baw, makeOptional(blackAndWhitePattern))) {
            myValues.blackAndWhite = {
              ...myValues.blackAndWhite,
              ...state.baw,
            };
          }
        }

        if (state) {
          if (is(state.hd, makeOptional(hdrPattern))) {
            myValues.hdr = {
              ...myValues.hdr,
              ...state.hd,
            };
          }
        }

        if (state) {
          if (is(state.blm, makeOptional(bloomPattern))) {
            myValues.bloom = {
              ...myValues.bloom,
              ...state.blm,
            };
          }
        }

        if (state) {
          if (is(state.dof, makeOptional(depthOfFieldPattern))) {
            myValues.depthOfField = {
              ...myValues.depthOfField,
              ...state.dof,
            };
          }
        }

        if (state) {
          if (is(state.brt, makeOptional(brightnessPattern))) {
            myValues.brightness = {
              ...myValues.brightness,
              ...state.brt,
            };
          }
        }

        if (state) {
          if (is(state.blr, makeOptional(blurPattern))) {
            myValues.blur = {
              ...myValues.blur,
              ...state.blr,
            };
          }
        }

        if (state) {
          if (is(state.nv, makeOptional(nightVisionPattern))) {
            myValues.nightVision = {
              ...myValues.nightVision,
              ...state.nv,
            };
          }
        }

        if (state) {
          if (is(state.sil, makeOptional(silhouettePattern))) {
            myValues.silhouette = {
              ...myValues.silhouette,
              ...state.sil,
            };
          }
        }

        if (state) {
          if (is(state.lig, makeOptional(lightingPattern))) {
            myValues.lighting = {
              ...myValues.lighting,
              ...state.lig,
            };
          }
        }
      }
      let initialMapActivatedListener = null;
      if (
        vcsUiApp.maps.activeMap &&
        vcsUiApp.maps.activeMap instanceof CesiumMap
      )
        applyState(); // should be handled by the watchers
      else {
        // This listener applies the state only once when Cesium Map initally activated
        initialMapActivatedListener =
          vcsUiApp.maps.mapActivated.addEventListener((map) => {
            if (map instanceof CesiumMap) {
              applyState();
              initialMapActivatedListener();
            }
          });
      }

      watcher.push(
        watch(
          () => myValues.ambientOcclusion,
          (newValue) => {
            const map = vcsUiApp.maps.activeMap;
            if (map instanceof CesiumMap) {
              const ambientOcclusion =
                map.getScene()?.postProcessStages?.ambientOcclusion;
              if (ambientOcclusion && is(newValue, ambientOcclusionPattern)) {
                ambientOcclusion.uniforms.intensity = newValue.intensity;
                ambientOcclusion.enabled = newValue.enabled;
                ambientOcclusion.uniforms.ambientOcclusionOnly =
                  newValue.ambientOcclusionOnly;
                ambientOcclusion.uniforms.frustumLength =
                  newValue.frustumLength;
                ambientOcclusion.uniforms.blurStepSize = newValue.blurStepSize;
                ambientOcclusion.uniforms.stepSize = newValue.stepSize;
                ambientOcclusion.uniforms.lengthCap = newValue.lengthCap;
                ambientOcclusion.uniforms.bias = newValue.bias;
              }
            }
          },
        ),
      );
      watcher.push(
        watch(
          () => myValues.blackAndWhite,
          (newValue) => {
            const map = vcsUiApp.maps.activeMap;
            if (
              map instanceof CesiumMap &&
              map.getScene()?.postProcessStages &&
              is(newValue, blackAndWhitePattern)
            ) {
              let bawStage = map
                .getScene()
                ?.postProcessStages?.getStageByName('czm_black_and_white');
              if (!bawStage) {
                bawStage = map
                  .getScene()
                  ?.postProcessStages?.add(
                    PostProcessStageLibrary.createBlackAndWhiteStage(),
                  );
              }

              bawStage.uniforms.gradations = newValue.gradations;
              bawStage.enabled = newValue.enabled;
            }
          },
        ),
      );
      watcher.push(
        watch(
          () => myValues.bloom,
          (newValue) => {
            const map = vcsUiApp.maps.activeMap;
            if (map instanceof CesiumMap) {
              const bloom = map.getScene()?.postProcessStages?.bloom;
              if (bloom && is(newValue, bloomPattern)) {
                bloom.enabled = newValue.enabled;
                bloom.uniforms.contrast = newValue.contrast;
                bloom.uniforms.brightness = newValue.brightness;
                bloom.uniforms.delta = newValue.delta;
                bloom.uniforms.sigma = newValue.sigma;
                bloom.uniforms.stepSize = newValue.stepSize;
                bloom.uniforms.glowOnly = newValue.glowOnly;
              }
            }
          },
        ),
      );
      watcher.push(
        watch(
          () => myValues.hdr,
          (newValue) => {
            const map = vcsUiApp.maps.activeMap;
            if (map instanceof CesiumMap) {
              const hdr = map.getScene();

              if (hdr && is(newValue, hdrPattern)) {
                hdr.gamma = newValue.gamma;
                hdr.highDynamicRange = newValue.enabled;
              }
            }
          },
        ),
      );

      watcher.push(
        watch(
          () => myValues.depthOfField,
          (newValue) => {
            const map = vcsUiApp.maps.activeMap;
            if (
              map instanceof CesiumMap &&
              map.getScene()?.postProcessStages &&
              is(newValue, depthOfFieldPattern)
            ) {
              let dofStage = map
                .getScene()
                ?.postProcessStages?.getStageByName('czm_depth_of_field');
              if (!dofStage) {
                dofStage = map
                  .getScene()
                  ?.postProcessStages?.add(
                    PostProcessStageLibrary.createDepthOfFieldStage(),
                  );
              }
              dofStage.uniforms.focalDistance = newValue.focalDistance;
              dofStage.enabled = newValue.enabled;
              dofStage.uniforms.delta = newValue.delta;
              dofStage.uniforms.sigma = newValue.sigma;
              dofStage.uniforms.stepSize = newValue.stepSize;
            }
          },
        ),
      );
      watcher.push(
        watch(
          () => myValues.brightness,
          (newValue) => {
            const map = vcsUiApp.maps.activeMap;
            if (
              map instanceof CesiumMap &&
              map.getScene()?.postProcessStages &&
              is(newValue, brightnessPattern)
            ) {
              let brtStage = map
                .getScene()
                ?.postProcessStages?.getStageByName('czm_brightness');
              if (!brtStage) {
                brtStage = map
                  .getScene()
                  ?.postProcessStages?.add(
                    PostProcessStageLibrary.createBrightnessStage(),
                  );
              }
              brtStage.uniforms.brightness = newValue.brightness;
              brtStage.enabled = newValue.enabled;
            }
          },
        ),
      );

      watcher.push(
        watch(
          () => myValues.blur,
          (newValue) => {
            const map = vcsUiApp.maps.activeMap;
            if (
              map instanceof CesiumMap &&
              map.getScene()?.postProcessStages &&
              is(newValue, blurPattern)
            ) {
              let blrStage = map
                .getScene()
                ?.postProcessStages?.getStageByName('czm_blur');
              if (!blrStage) {
                blrStage = map
                  .getScene()
                  ?.postProcessStages?.add(
                    PostProcessStageLibrary.createBlurStage(),
                  );
              }
              blrStage.uniforms.delta = newValue.delta;
              blrStage.uniforms.sigma = newValue.sigma;
              blrStage.uniforms.stepSize = newValue.stepSize;
              blrStage.enabled = newValue.enabled;
            }
          },
        ),
      );
      let edgedetect = null;
      watcher.push(
        watch(
          () => myValues.silhouette,
          (newValue) => {
            const map = vcsUiApp.maps.activeMap;
            if (map instanceof CesiumMap) {
              if (!edgedetect) {
                edgedetect = PostProcessStageLibrary.createEdgeDetectionStage();
              }
              if (edgedetect && is(newValue, silhouettePattern)) {
                edgedetect.uniforms.color = Color.fromCssColorString(
                  newValue.color,
                );
                const silStage = PostProcessStageLibrary.createSilhouetteStage([
                  edgedetect,
                ]);
                let silhouette;
                if (
                  map
                    .getScene()
                    ?.postProcessStages?.getStageByName(silStage.name)
                ) {
                  silhouette = map
                    .getScene()
                    ?.postProcessStages?.getStageByName(silStage.name);
                } else {
                  silhouette = map.getScene()?.postProcessStages?.add(silStage);
                }
                if (silhouette && is(newValue, silhouettePattern)) {
                  silhouette.enabled = newValue.enabled;
                }
              }
            }
          },
        ),
      );

      const scratchIcrfToFixed = new Matrix3();
      const scratchMoonPosition = new Cartesian3();
      const scratchMoonDirection = new Cartesian3();

      function getMoonDirection(result) {
        const map = vcsUiApp.maps.activeMap;
        if (map instanceof CesiumMap) {
          const cesiumWidget = map.getCesiumWidget();
          // eslint-disable-next-line no-param-reassign
          result = defined(result) ? result : new Cartesian3();
          const date = cesiumWidget.clock.currentTime;
          if (
            !defined(
              Transforms.computeIcrfToFixedMatrix(date, scratchIcrfToFixed),
            )
          ) {
            Transforms.computeTemeToPseudoFixedMatrix(date, scratchIcrfToFixed);
          }
          const moonPosition =
            Simon1994PlanetaryPositions.computeMoonPositionInEarthInertialFrame(
              date,
              scratchMoonPosition,
            );
          Matrix3.multiplyByVector(
            scratchIcrfToFixed,
            moonPosition,
            moonPosition,
          );
          const moonDirection = Cartesian3.normalize(
            moonPosition,
            scratchMoonDirection,
          );
          return Cartesian3.negate(moonDirection, result);
        } else {
          return '';
        }
      }

      watcher.push(
        watch(
          () => myValues.lighting,
          (newValue) => {
            const map = vcsUiApp.maps.activeMap;

            if (map instanceof CesiumMap) {
              if (newValue.selected === 0) {
                const sunLight = new SunLight();
                map.getScene().light = sunLight;
                map.getScene().globe.dynamicAtmosphereLighting = true;
                map.getScene().globe.dynamicAtmosphereLightingFromSun = false;
                map.getScene().light.intensity = newValue.lightIntensity;
                map.getScene().light.color = Color.fromCssColorString(
                  newValue.color,
                );
              } else if (newValue.selected === 1) {
                const moonLight = new DirectionalLight({
                  direction: getMoonDirection(),
                  color: new Color(0.9, 0.925, 1.0),
                  intensity: 0.5,
                });
                map.getScene()?.preRender.addEventListener((scene) => {
                  if (scene.light === moonLight) {
                    scene.light.direction = getMoonDirection(
                      scene.light.direction,
                    );
                  }
                });
                map.getScene().light = moonLight;
                map.getScene().globe.dynamicAtmosphereLightingFromSun = true;
                map.getScene().light.intensity = newValue.lightIntensity;
                map.getScene().light.color = Color.fromCssColorString(
                  newValue.color,
                );
              } else if (newValue.selected === 2) {
                const flashlight = new DirectionalLight({
                  direction: map.getScene().camera.directionWC,
                });
                map.getScene().light = flashlight;
                map.getScene().globe.dynamicAtmosphereLighting = false;
                map.getScene().light.intensity = newValue.lightIntensity;
                map.getScene().light.color = Color.fromCssColorString(
                  newValue.color,
                );
              } else if (newValue.selected === 3) {
                let directionalLight;
                if (newValue.x !== 0 || newValue.y !== 0 || newValue.z !== 0) {
                  directionalLight = new DirectionalLight({
                    direction: new Cartesian3(
                      newValue.x,
                      newValue.y,
                      newValue.z,
                    ),
                  });
                } else {
                  directionalLight = new DirectionalLight({
                    direction: new Cartesian3(
                      map.getScene().camera.direction.x,
                      map.getScene().camera.direction.y,
                      map.getScene().camera.direction.z,
                    ),
                  });
                }
                map.getScene().light = directionalLight;
                map.getScene().light.intensity = newValue.lightIntensity;
                map.getScene().light.color = Color.fromCssColorString(
                  newValue.color,
                );
              }
            }
          },
        ),
      );
      watcher.push(
        watch(
          () => myValues.nightVision,
          (newValue) => {
            const map = vcsUiApp.maps.activeMap;
            if (
              map instanceof CesiumMap &&
              map.getScene()?.postProcessStages &&
              is(newValue, nightVisionPattern)
            ) {
              let nvStage = map
                .getScene()
                ?.postProcessStages?.getStageByName('czm_night_vision');
              if (!nvStage) {
                nvStage = map
                  .getScene()
                  ?.postProcessStages?.add(
                    PostProcessStageLibrary.createNightVisionStage(),
                  );
              }

              nvStage.enabled = newValue.enabled;
            }
          },
        ),
      );
      vcsUiApp.navbarManager.add(
        {
          id: windowId,
          action,
        },
        name,
        ButtonLocation.MENU,
      );
    },

    getState() {
      const state = {};
      if (myValues.ambientOcclusion.enabled) {
        const ao = {};
        Object.keys(myValues.ambientOcclusion).forEach((key) => {
          if (
            myValues.ambientOcclusion[key] !==
            getAmbientOcclusionDefaults()[key]
          ) {
            ao[key] = myValues.ambientOcclusion[key];
          }
        });

        state.ao = ao;
      }
      if (myValues.blackAndWhite.enabled) {
        const baw = {};
        Object.keys(myValues.blackAndWhite).forEach((key) => {
          if (myValues.blackAndWhite[key] !== getBlackAndWhiteDefaults()[key]) {
            baw[key] = myValues.blackAndWhite[key];
          }
        });

        state.baw = baw;
      }
      if (myValues.hdr.enabled) {
        const hd = {};
        Object.keys(myValues.hdr).forEach((key) => {
          if (myValues.hdr[key] !== getHDRDefaults()[key]) {
            hd[key] = myValues.hdr[key];
          }
        });

        state.hd = hd;
      }
      if (myValues.bloom.enabled) {
        const blm = {};
        Object.keys(myValues.bloom).forEach((key) => {
          if (myValues.bloom[key] !== getBloomDefaults()[key]) {
            blm[key] = myValues.bloom[key];
          }
        });

        state.blm = blm;
      }
      if (myValues.depthOfField.enabled) {
        const dof = {};
        Object.keys(myValues.depthOfField).forEach((key) => {
          if (myValues.depthOfField[key] !== getDepthOfFieldDefaults()[key]) {
            dof[key] = myValues.depthOfField[key];
          }
        });

        state.dof = dof;
      }
      if (myValues.brightness.enabled) {
        const brt = {};
        Object.keys(myValues.brightness).forEach((key) => {
          if (myValues.brightness[key] !== getBrightnessDefaults()[key]) {
            brt[key] = myValues.brightness[key];
          }
        });

        state.brt = brt;
      }
      if (myValues.blur.enabled) {
        const blr = {};
        Object.keys(myValues.blur).forEach((key) => {
          if (myValues.blur[key] !== getBlurDefaults()[key]) {
            blr[key] = myValues.blur[key];
          }
        });

        state.blr = blr;
      }
      if (myValues.nightVision.enabled) {
        const nv = {};
        Object.keys(myValues.nightVision).forEach((key) => {
          if (myValues.nightVision[key] !== getNightVisionDefaults()[key]) {
            nv[key] = myValues.nightVision[key];
          }
        });
        state.nv = nv;
      }
      if (myValues.silhouette.enabled) {
        const sil = {};
        Object.keys(myValues.silhouette).forEach((key) => {
          if (myValues.silhouette[key] !== getSilhouetteDefaults()[key]) {
            sil[key] = myValues.silhouette[key];
          }
        });

        state.sil = sil;
      }
      if (myValues.lighting) {
        const lig = {};
        Object.keys(myValues.lighting).forEach((key) => {
          if (myValues.lighting[key] !== getLightingDefaults()[key]) {
            lig[key] = myValues.lighting[key];
          }
        });

        state.lig = lig;
      }
      if (Object.keys(state).length > 0) {
        return state;
      } else {
        return undefined;
      }
    },
    getDefaultOptions,

    toJSON() {
      return {};
    },
    i18n: {
      de,
      en,
    },
    destroy() {
      if (this._app) {
        if (this._app.navbarManager.has(name)) {
          this._app.navbarManager.remove(name);
        }
        if (this._app.windowManager.has(windowId)) {
          this._app.windowManager.remove(windowId);
        }
      }

      if (this._destroyAction) {
        this._destroyAction();
      }
      watcher.forEach((cb) => cb());
      watcher.splice(0);
      if (this._mapChangedListener) {
        this._mapChangedListener();
      }
    },
  };
}
