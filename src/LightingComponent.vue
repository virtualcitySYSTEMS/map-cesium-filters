<template>
  <ModifiedSectionComponent
    :expandable="true"
    :action-button-list-overflow-count="5"
    :header-actions="actions"
    heading="cesium-filters.title3"
  >
    <v-container style="padding-top: 0px">
      <v-row no-gutters>
        <v-col>
          <VcsSelect
            id="lightingSelect"
            dense
            :placeholder="$t('cesium-filters.lighting.sun')"
            v-model="lighting.selected"
            :items="items"
            @change="changeSelect"
          ></VcsSelect>
        </v-col>
      </v-row>
      <v-row v-if="lighting.selected === 1">
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
            @input="onInput"
            :rules="rules.lightIntensity"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <div class="d-flex flex-column">
            <v-color-picker
              v-model="lighting.color"
              :modes="['hex', 'rgb']"
              @input="onInput"
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
  import { inject, watch, reactive, computed } from 'vue';
  import { CesiumMap } from '@vcmap/core';
  import { VcsLabel, VcsSelect, VcsTextField, VcsFormButton } from '@vcmap/ui';
  import { VRow, VCol, VContainer, VColorPicker } from 'vuetify/lib';
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
      value: {
        type: Object,
        default: getLightingDefaults,
        validator: (value) => {
          return is(value, lightingPattern);
        },
      },
    },
    setup(props, { emit }) {
      const lighting = { ...props.value };
      const lightingDefaults = getLightingDefaults(lighting.selected);
      const app = inject('vcsApp');
      const map = app.maps.activeMap;
      if (map instanceof CesiumMap) {
        lightingDefaults.lightIntensity = map.lightIntensity;
        lighting.lightIntensity = map.lightIntensity;
      }

      watch(
        () => props.value,
        () => {
          Object.assign(lighting, props.value);
        },
      );

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
          emit('input', {
            ...lightingDefaults,
            lightIntensity: map.lightIntensity,
          });
        },
      });

      const actions = computed(() => {
        if (
          Object.keys(props.value)
            .filter((key) => key !== 'enabled')
            .some((key) => props.value[key] !== lightingDefaults[key])
        ) {
          return [resetAction];
        }
        return [];
      });

      const onInput = () => {
        if (is(lighting, lightingPattern)) {
          emit('input', { ...lighting });
        }
      };

      const items = [
        { value: 0, text: 'cesium-filters.lighting.sun' },
        { value: 1, text: 'cesium-filters.lighting.moon' },
        { value: 2, text: 'cesium-filters.lighting.flash' },
        { value: 3, text: 'cesium-filters.lighting.fixed' },
      ];

      function updateDirectLPosition() {
        // const map = app.maps.activeMap;
        if (map instanceof CesiumMap) {
          lighting.x = map.getScene().camera.direction.x;
          lighting.y = map.getScene().camera.direction.y;
          lighting.z = map.getScene().camera.direction.z;
          onInput();
        }
      }
      function changeSelect() {
        const newVals = getLightingDefaults(lighting.selected);
        lighting.lightIntensity = newVals.lightIntensity;
        lighting.color = newVals.color;
        lighting.showButton = newVals.showButton;

        onInput();
      }

      return {
        items,
        updateDirectLPosition,
        actions,
        onInput,
        rules,
        lighting,
        changeSelect,
      };
    },
  };
</script>
