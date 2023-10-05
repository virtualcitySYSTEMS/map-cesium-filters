<template>
  <v-sheet>
    <LightingComponent v-model="myvalues.lighting"></LightingComponent>
    <HdrComponent v-model="myvalues.hdr"></HdrComponent>
    <AmbientOcclusionComponent
      v-model="myvalues.ambientOcclusion"
    ></AmbientOcclusionComponent>
    <BloomComponent v-model="myvalues.bloom"></BloomComponent>
    <DepthOfFieldComponent
      v-model="myvalues.depthOfField"
    ></DepthOfFieldComponent>
    <BlackAndWhiteComponent
      v-model="myvalues.blackAndWhite"
    ></BlackAndWhiteComponent>
    <BrightnessComponent v-model="myvalues.brightness"></BrightnessComponent>
    <SilhouetteComponent v-model="myvalues.silhouette"></SilhouetteComponent>
    <BlurComponent v-model="myvalues.blur"></BlurComponent>
    <NightVisionComponent v-model="myvalues.nightVision"></NightVisionComponent>
  </v-sheet>
</template>

<style scoped lang="scss">
  .col {
    padding-top: 0px;
  }
</style>
<script>
  import { inject } from 'vue';
  import { VSheet } from 'vuetify/lib';
  import { CesiumMap } from '@vcmap/core';
  import AmbientOcclusionComponent from './AmbientOcclusionComponent.vue';
  import BloomComponent from './BloomComponent.vue';
  import DepthOfFieldComponent from './DepthOfFieldComponent.vue';
  import BlackAndWhiteComponent from './BlackAndWhiteComponent.vue';
  import BrightnessComponent from './BrightnessComponent.vue';
  import SilhouetteComponent from './SilhouetteComponent.vue';
  import BlurComponent from './BlurComponent.vue';
  import NightVisionComponent from './NightVisionComponent.vue';
  import HdrComponent from './HdrComponent.vue';
  import LightingComponent from './LightingComponent.vue';
  import { name } from '../package.json';

  export const windowId = 'filter_effects_window_id';

  export default {
    name: 'FilterEffects',
    components: {
      VSheet,
      AmbientOcclusionComponent,
      BloomComponent,
      DepthOfFieldComponent,
      BlackAndWhiteComponent,
      BrightnessComponent,
      SilhouetteComponent,
      BlurComponent,
      NightVisionComponent,
      HdrComponent,
      LightingComponent,
    },
    setup() {
      const app = inject('vcsApp');
      const map = app.maps.activeMap;
      const myvalues = app.plugins.getByKey(name).values;
      if (map instanceof CesiumMap) {
        myvalues.lighting.lightIntensity = map.lightIntensity;
      }

      return {
        myvalues,
        closeSelf() {
          app.windowManager.remove(windowId);
        },
      };
    },
  };
</script>
