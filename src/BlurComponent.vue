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
            @input="onInput"
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
            @input="onInput"
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
            @input="onInput"
          />
        </v-col>
      </v-row>
    </v-container>
  </ModifiedSectionComponent>
</template>
<script>
  import { is } from '@vcsuite/check';
  import { inject, computed, watch, reactive } from 'vue';
  import { VcsLabel, VcsTextField } from '@vcmap/ui';
  import { VRow, VCol, VContainer } from 'vuetify/lib';
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
      value: {
        type: Object,
        default: getBlurDefaults,
        validator: (value) => {
          return is(value, blurPattern);
        },
      },
    },
    setup(props, { emit }) {
      const blur = { ...props.value };
      const blurDefaults = getBlurDefaults();
      watch(
        () => props.value,
        () => {
          Object.assign(blur, props.value);
        },
      );

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
        active: blur.enabled,
        setTitleAndIcon() {
          this.icon = this.active
            ? 'mdi-checkbox-marked'
            : 'mdi-checkbox-blank-outline';
          this.title = this.active
            ? 'cesium-filters.tooltip.deactivate'
            : 'cesium-filters.tooltip.activate';
        },
        callback() {
          emit('input', {
            ...props.value,
            enabled: !blur.enabled,
          });
          this.active = !blur.enabled;
          this.setTitleAndIcon();
        },
      });

      enableAction.setTitleAndIcon();

      const resetAction = reactive({
        name: 'resetBluAction',
        title: 'cesium-filters.tooltip.reset',
        icon: '$vcsReturn',
        callback() {
          emit('input', {
            ...blurDefaults,
            enabled: blur.enabled,
          });
        },
      });

      const actions = computed(() => {
        if (
          Object.keys(props.value)
            .filter((key) => key !== 'enabled')
            .some((key) => props.value[key] !== blurDefaults[key])
        ) {
          return [enableAction, resetAction];
        }
        return [enableAction];
      });

      const onInput = () => {
        if (is(blur, blurPattern)) {
          emit('input', { ...blur });
        }
      };

      return {
        rules,
        actions,
        blur,
        onInput,
      };
    },
  };
</script>
