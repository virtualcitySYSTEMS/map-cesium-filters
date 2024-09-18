<template>
  <ModifiedSectionComponent
    :expandable="true"
    :action-button-list-overflow-count="5"
    :header-actions="actions"
    heading="cesium-filters.blurs.blur"
  >
    <v-container>
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="blurDelta_id">
            {{ $t('cesium-filters.blurs.blurDelta') }}
          </VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="blurDelta_id"
            type="number"
            :step="0.1"
            min="0"
            max="10"
            show-spin-buttons
            v-model.number="blur.delta"
            :rules="rules.delta"
            :disabled="!blur.enabled"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="blurSigma_id">
            {{ $t('cesium-filters.blurs.blurSigma') }}
          </VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="blurSigma_id"
            type="number"
            :step="0.1"
            min="0"
            max="10"
            show-spin-buttons
            v-model.number="blur.sigma"
            :rules="rules.sigma"
            :disabled="!blur.enabled"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="blurStepSize_id">
            {{ $t('cesium-filters.blurs.blurStepSize') }}
          </VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="blurStepSize_id"
            type="number"
            :step="0.1"
            min="0"
            max="100"
            show-spin-buttons
            v-model.number="blur.stepSize"
            :rules="rules.stepSize"
            :disabled="!blur.enabled"
          />
        </v-col>
      </v-row>
    </v-container>
  </ModifiedSectionComponent>
</template>
<script>
  import { is } from '@vcsuite/check';
  import { inject, computed, reactive } from 'vue';
  import { useProxiedComplexModel, VcsLabel, VcsTextField } from '@vcmap/ui';
  import { VRow, VCol, VContainer } from 'vuetify/components';
  import ModifiedSectionComponent from './ModifiedSectionComponent.vue';
  import { getBlurDefaults } from './defaultValues.js';
  import { blurPattern } from './validators.js';

  export default {
    name: 'BlurComponent',
    components: {
      VCol,
      VRow,
      VContainer,
      ModifiedSectionComponent,
      VcsLabel,
      VcsTextField,
    },
    props: {
      modelValue: {
        type: Object,
        default: getBlurDefaults,
        validator: (value) => {
          return is(value, blurPattern);
        },
      },
    },
    setup(props, { emit }) {
      const blur = useProxiedComplexModel(props, 'modelValue', emit);

      const blurDefaults = getBlurDefaults();

      const app = inject('vcsApp');
      const rules = {
        delta: [
          (v) =>
            is(v, blurPattern.delta) ||
            app.vueI18n.t('cesium-filters.errormessage.deltaBlur'),
        ],
        sigma: [
          (v) =>
            is(v, blurPattern.sigma) ||
            app.vueI18n.t('cesium-filters.errormessage.sigmaBlur'),
        ],
        stepSize: [
          (v) =>
            is(v, blurPattern.stepSize) ||
            app.vueI18n.t('cesium-filters.errormessage.stepSizeBlur'),
        ],
      };

      const enableAction = reactive({
        name: 'enableBluAction',
        title: 'cesium-filters.tooltip.activate',
        icon: 'mdi-checkbox-blank-outline',
        active: blur.value.enabled,
        setTitleAndIcon() {
          enableAction.icon = enableAction.active
            ? 'mdi-checkbox-marked'
            : 'mdi-checkbox-blank-outline';
          enableAction.title = enableAction.active
            ? 'cesium-filters.tooltip.deactivate'
            : 'cesium-filters.tooltip.activate';
        },
        callback() {
          blur.value.enabled = !blur.value.enabled;
          enableAction.active = blur.value.enabled;
          enableAction.setTitleAndIcon();
        },
      });

      enableAction.setTitleAndIcon();

      const resetAction = reactive({
        name: 'resetBluAction',
        title: 'cesium-filters.tooltip.reset',
        icon: '$vcsReturn',
        callback() {
          blur.value = { ...blurDefaults };
          enableAction.active = blur.value.enabled;
          enableAction.setTitleAndIcon();
        },
      });

      const actions = computed(() => {
        if (
          Object.keys(blur.value)
            .filter((key) => key !== 'enabled')
            .some((key) => blur.value[key] !== blurDefaults[key])
        ) {
          return [enableAction, resetAction];
        }
        return [enableAction];
      });

      return {
        rules,
        actions,
        blur,
      };
    },
  };
</script>
<style lang="scss" scoped></style>
