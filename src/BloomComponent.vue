<template>
  <ModifiedSectionComponent
    :expandable="true"
    :action-button-list-overflow-count="5"
    :header-actions="actions"
    heading="cesium-filters.Blooms.Bloom"
  >
    <v-container>
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="BContrast_id">
            {{ $t('cesium-filters.Blooms.BContrast') }}
          </VcsLabel>
        </v-col>
        <v-col>
          <VcsSlider
            id="BContrast_id"
            thumb-label
            :min="-255.0"
            :max="255.0"
            type="number"
            :step="0.1"
            v-model.number="bloom.contrast"
            :rules="rules.contrast"
            :disabled="!bloom.enabled"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="Bbrightness_id">
            {{ $t('cesium-filters.Blooms.Bbrightness') }}
          </VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="Bbrightness_id"
            type="number"
            :step="0.1"
            :min="-1"
            :max="1"
            show-spin-buttons
            v-model.number="bloom.brightness"
            :rules="rules.brightness"
            :disabled="!bloom.enabled"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="Bdelta_id">
            {{ $t('cesium-filters.Blooms.Bdelta') }}
          </VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="Bdelta_id"
            type="number"
            :step="0.1"
            :min="-10"
            :max="10"
            show-spin-buttons
            v-model.number="bloom.delta"
            :rules="rules.delta"
            :disabled="!bloom.enabled"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="Bsigma_id">
            {{ $t('cesium-filters.Blooms.Bsigma') }}
          </VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="Bsigma_id"
            type="number"
            :step="0.1"
            :min="-10"
            :max="100"
            show-spin-buttons
            v-model.number="bloom.sigma"
            :rules="rules.sigma"
            :disabled="!bloom.enabled"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="BstepSize_id">
            {{ $t('cesium-filters.Blooms.BstepSize') }}
          </VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="BstepSize_id"
            type="number"
            :step="1"
            :min="0"
            :max="100"
            show-spin-buttons
            v-model.number="bloom.stepSize"
            :rules="rules.stepSize"
            :disabled="!bloom.enabled"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="1" class="align-center d-flex">
          <VcsCheckbox
            id="Bglowexcl_check"
            v-model="bloom.glowOnly"
            :true-value="true"
            :false-value="false"
            :disabled="!bloom.enabled"
          />
        </v-col>
        <v-col>
          <VcsLabel class="pt-1" html-for="Bglowexcl_check">
            {{ $t('cesium-filters.Blooms.Bglowexcl') }}
          </VcsLabel>
        </v-col>
      </v-row>
    </v-container>
  </ModifiedSectionComponent>
</template>
<script>
  import { is } from '@vcsuite/check';
  import { inject, computed, reactive } from 'vue';
  import {
    VcsLabel,
    VcsTextField,
    VcsCheckbox,
    VcsSlider,
    useProxiedComplexModel,
  } from '@vcmap/ui';
  import { VRow, VCol, VContainer } from 'vuetify/components';
  import ModifiedSectionComponent from './ModifiedSectionComponent.vue';
  import { getBloomDefaults } from './defaultValues.js';
  import { bloomPattern } from './validators.js';

  export default {
    name: 'BloomComponent',
    components: {
      VCol,
      VRow,
      VContainer,
      VcsLabel,
      VcsTextField,
      VcsCheckbox,
      ModifiedSectionComponent,
      VcsSlider,
    },
    props: {
      modelValue: {
        type: Object,
        default: getBloomDefaults,
        validator: (value) => {
          return is(value, bloomPattern);
        },
      },
    },
    setup(props, { emit }) {
      const bloom = useProxiedComplexModel(props, 'modelValue', emit);
      const bloomDefaults = getBloomDefaults();

      const app = inject('vcsApp');
      const rules = {
        contrast: [
          (v) =>
            is(v, bloomPattern.contrast) ||
            app.vueI18n.t('cesium-filters.errormessage.contrast'),
        ],
        brightness: [
          (v) =>
            is(v, bloomPattern.brightness) ||
            app.vueI18n.t('cesium-filters.errormessage.brightness'),
        ],
        delta: [
          (v) =>
            is(v, bloomPattern.delta) ||
            app.vueI18n.t('cesium-filters.errormessage.delta'),
        ],
        sigma: [
          (v) =>
            is(v, bloomPattern.sigma) ||
            app.vueI18n.t('cesium-filters.errormessage.sigma'),
        ],
        stepSize: [
          (v) =>
            is(v, bloomPattern.stepSize) ||
            app.vueI18n.t('cesium-filters.errormessage.stepSizeBloom'),
        ],
      };

      const enableAction = reactive({
        name: 'enableBloAction',
        title: 'cesium-filters.tooltip.activate',
        icon: '$vcsCheckbox',
        active: bloom.value.enabled,
        setTitleAndIcon() {
          enableAction.icon = enableAction.active
            ? '$vcsCheckboxChecked'
            : '$vcsCheckbox';
          enableAction.title = enableAction.active
            ? 'cesium-filters.tooltip.deactivate'
            : 'cesium-filters.tooltip.activate';
        },
        callback() {
          bloom.value.enabled = !bloom.value.enabled;
          enableAction.active = bloom.value.enabled;
          enableAction.setTitleAndIcon();
        },
      });
      enableAction.setTitleAndIcon();
      const resetAction = reactive({
        name: 'resetBloAction',
        title: 'cesium-filters.tooltip.reset',
        icon: '$vcsReturn',
        callback() {
          bloom.value = { ...bloomDefaults };
          enableAction.active = bloom.value.enabled;
          enableAction.setTitleAndIcon();
        },
      });

      const actions = computed(() => {
        if (
          Object.keys(bloom.value)
            .filter((key) => key !== 'enabled')
            .some((key) => bloom.value[key] !== bloomDefaults[key])
        ) {
          return [enableAction, resetAction];
        }
        return [enableAction];
      });

      return {
        rules,
        actions,
        bloom,
      };
    },
  };
</script>
<style scoped lang="scss"></style>
