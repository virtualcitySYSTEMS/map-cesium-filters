<template>
  <ModifiedSectionComponent
    :expandable="true"
    :action-button-list-overflow-count="5"
    :header-actions="actions"
    heading="cesium-filters.title3"
  >
    <v-container>
      <v-row no-gutters>
        <v-col>
          <VcsSelect
            id="lightingSelect"
            :placeholder="$t('cesium-filters.lighting.sun')"
            :items="lightingItems"
            v-model="lighting.selected"
            :item-text="(item) => item.text"
            :item-value="(item) => item.modelValue"
          ></VcsSelect>
        </v-col>
      </v-row>
      <v-row v-if="lighting.selected === 1" class="containerPadding">
        <v-col>
          <p style="border: 1px solid red; border-radius: 5px; padding: 5px">
            {{ $t('cesium-filters.MessageMoon') }}
          </p>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="lightIntensity_id">
            {{ $t('cesium-filters.lightIntensity') }}
          </VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="lightIntensity_id"
            type="number"
            v-model.number="lighting.lightIntensity"
            :rules="rules.lightIntensity"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <div class="d-flex justify-center" style="margin: 0 2px 0 2px">
            <v-color-picker
              v-model="lighting.color"
              :modes="['hex', 'rgb']"
              style="width: 100%"
            ></v-color-picker>
          </div>
        </v-col>
      </v-row>
      <v-row v-if="lighting.showButton">
        <v-col>
          <VcsFormButton @click="updateDirectLPosition()">
            {{ $t('cesium-filters.currentPOS') }}
          </VcsFormButton>
        </v-col>
      </v-row>
    </v-container>
  </ModifiedSectionComponent>
</template>
<script>
  import { is } from '@vcsuite/check';
  import { inject, reactive, computed } from 'vue';
  import { CesiumMap } from '@vcmap/core';
  import {
    VcsLabel,
    VcsSelect,
    VcsTextField,
    VcsFormButton,
    useProxiedComplexModel,
  } from '@vcmap/ui';
  import { VRow, VCol, VContainer, VColorPicker } from 'vuetify/components';
  import ModifiedSectionComponent from './ModifiedSectionComponent.vue';
  import { getLightingDefaults } from './defaultValues.js';
  import { lightingPattern } from './validators.js';

  export default {
    name: 'LightingComponent',
    components: {
      VCol,
      VRow,
      VContainer,
      ModifiedSectionComponent,
      VcsLabel,
      VcsTextField,
      VcsSelect,
      VColorPicker,
      VcsFormButton,
    },

    props: {
      modelValue: {
        type: Object,
        default: getLightingDefaults,
        validator: (value) => {
          return is(value, lightingPattern);
        },
      },
    },
    setup(props, { emit }) {
      const lighting = useProxiedComplexModel(props, 'modelValue', emit);
      const lightingDefaults = getLightingDefaults(lighting.value.selected);
      const app = inject('vcsApp');
      const map = app.maps.activeMap;
      if (map instanceof CesiumMap) {
        lightingDefaults.lightIntensity = map.lightIntensity;
        lighting.value.lightIntensity = map.lightIntensity;
      }

      const rules = {
        selected: [
          (v) =>
            is(v, lightingPattern.selected) ||
            app.vueI18n.t('cesium-filters.errormessage.selected'),
        ],
        lightIntensity: [
          (v) =>
            is(v, lightingPattern.lightIntensity) ||
            app.vueI18n.t('cesium-filters.errormessage.lightIntensity'),
        ],
        color: [
          (v) =>
            is(v, lightingPattern.color) ||
            app.vueI18n.t('cesium-filters.errormessage.color'),
        ],
        x: [
          (v) =>
            is(v, lightingPattern.x) ||
            app.vueI18n.t('cesium-filters.errormessage.x'),
        ],
        y: [
          (v) =>
            is(v, lightingPattern.y) ||
            app.vueI18n.t('cesium-filters.errormessage.y'),
        ],
        z: [
          (v) =>
            is(v, lightingPattern.z) ||
            app.vueI18n.t('cesium-filters.errormessage.z'),
        ],
      };

      const resetAction = reactive({
        name: 'resetLigAction',
        title: 'cesium-filters.tooltip.reset',
        icon: '$vcsReturn',
        callback() {
          lighting.value = { ...lightingDefaults };
        },
      });

      const actions = computed(() => {
        if (
          Object.keys(lighting.value)
            .filter((key) => key !== 'enabled')
            .some((key) => lighting.value[key] !== lightingDefaults[key])
        ) {
          return [resetAction];
        }
        return [];
      });

      const lightingItems = [
        { modelValue: 0, text: 'cesium-filters.lighting.sun' },
        { modelValue: 1, text: 'cesium-filters.lighting.moon' },
        { modelValue: 2, text: 'cesium-filters.lighting.flash' },
        { modelValue: 3, text: 'cesium-filters.lighting.fixed' },
      ];

      function updateDirectLPosition() {
        // const map = app.maps.activeMap;
        if (map instanceof CesiumMap) {
          lighting.value.x = map.getScene().camera.direction.x;
          lighting.value.y = map.getScene().camera.direction.y;
          lighting.value.z = map.getScene().camera.direction.z;
        }
      }
      function changeSelect() {
        const newVals = getLightingDefaults(lighting.value.selected);
        lighting.value.lightIntensity = newVals.lightIntensity;
        lighting.value.color = newVals.color;
        lighting.value.showButton = newVals.showButton;
      }

      return {
        lightingItems,
        updateDirectLPosition,
        actions,
        rules,
        lighting,
        changeSelect,
      };
    },
  };
</script>
<style scoped lang="scss">
  .v-color-picker.v-sheet {
    box-shadow: none;
  }
</style>
