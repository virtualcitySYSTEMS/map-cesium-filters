<template>
  <ModifiedSectionComponent
    :expandable="true"
    heading="cesium-filters.ambientOc.ambientOcclusion"
    :action-button-list-overflow-count="5"
    :header-actions="actions"
  >
    <v-container style="padding-top: 0px; padding-left: 24px">
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="AOintensity_id">
            {{ $t('cesium-filters.ambientOc.AOitensity') }}
          </VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="AOintensity_id"
            type="number"
            min="0"
            max="100"
            :step="0.1"
            :rules="rules.intensity"
            :disabled="!ambientOcclusion.enabled"
            show-spin-buttons
            v-model.number="ambientOcclusion.intensity"
            @input="onInput"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="AObias_id">
            {{ $t('cesium-filters.ambientOc.AObias') }}
          </VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="AObias_id"
            type="number"
            min="0"
            max="1"
            :step="0.1"
            :rules="rules.bias"
            show-spin-buttons
            v-model.number="ambientOcclusion.bias"
            :disabled="!ambientOcclusion.enabled"
            @input="onInput"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="AOlengthCap_id">
            {{ $t('cesium-filters.ambientOc.AOlengthCap') }}
          </VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="AOlengthCap_id"
            type="number"
            :step="1"
            min="0"
            max="1000"
            :rules="rules.lengthCap"
            show-spin-buttons
            v-model.number="ambientOcclusion.lengthCap"
            :disabled="!ambientOcclusion.enabled"
            @input="onInput"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="AOstepSize_id">
            {{ $t('cesium-filters.ambientOc.AOstepSize') }}
          </VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="AOstepSize_id"
            type="number"
            min="0"
            max="10"
            :step="0.01"
            :rules="rules.stepSize"
            show-spin-buttons
            v-model.number="ambientOcclusion.stepSize"
            :disabled="!ambientOcclusion.enabled"
            @input="onInput"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="AOfrustumLength_id">
            {{ $t('cesium-filters.ambientOc.AOfrustumLength') }}
          </VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="AOfrustumLength_id"
            type="number"
            min="0"
            max="10000"
            :step="1"
            :rules="rules.frustumLength"
            show-spin-buttons
            v-model.number="ambientOcclusion.frustumLength"
            :disabled="!ambientOcclusion.enabled"
            @input="onInput"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="AOblurStepSize_id">
            {{ $t('cesium-filters.ambientOc.AOblurStepSize') }}
          </VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="AOblurStepSize_id"
            type="number"
            min="0"
            max="10"
            :step="0.01"
            :rules="rules.blurStepSize"
            show-spin-buttons
            v-model.number="ambientOcclusion.blurStepSize"
            :disabled="!ambientOcclusion.enabled"
            @input="onInput"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="1" class="align-center d-flex">
          <VcsCheckbox
            id="ambOexcl_check"
            v-model="ambientOcclusion.ambientOcclusionOnly"
            :true-value="true"
            :false-value="false"
            :disabled="!ambientOcclusion.enabled"
            @change="onInput"
          />
        </v-col>
        <v-col>
          <VcsLabel html-for="ambOexcl_check">
            {{ $t('cesium-filters.ambientOc.AOambOexcl') }}
          </VcsLabel>
        </v-col>
      </v-row>
    </v-container>
  </ModifiedSectionComponent>
</template>
<script>
  import { is } from '@vcsuite/check';
  import { reactive, computed, watch, inject } from 'vue';
  import { VcsCheckbox, VcsLabel, VcsTextField } from '@vcmap/ui';
  import { VRow, VCol, VContainer } from 'vuetify/lib';
  import ModifiedSectionComponent from './ModifiedSectionComponent.vue';
  import { getAmbientOcclusionDefaults } from './defaultValues.js';
  import { ambientOcclusionPattern } from './validators.js';

  export default {
    name: 'AmbientOcclusionComponent',
    components: {
      VCol,
      VRow,
      VContainer,
      VcsLabel,
      VcsTextField,
      VcsCheckbox,
      ModifiedSectionComponent,
    },
    props: {
      value: {
        type: Object,
        default: getAmbientOcclusionDefaults,
        validator: (value) => {
          return is(value, ambientOcclusionPattern);
        },
      },
    },
    setup(props, { emit }) {
      const ambientOcclusion = { ...props.value };
      const ambientOcclusionDefaults = getAmbientOcclusionDefaults();
      watch(
        () => props.value,
        () => {
          Object.assign(ambientOcclusion, props.value);
        },
      );

      const app = inject('vcsApp');
      const rules = {
        intensity: [
          (v) =>
            is(v, ambientOcclusionPattern.intensity) ||
            app.vueI18n.t('cesium-filters.errormessage.intensity'),
        ],
        bias: [
          (v) =>
            is(v, ambientOcclusionPattern.bias) ||
            app.vueI18n.t('cesium-filters.errormessage.bias'),
        ],
        lengthCap: [
          (v) =>
            is(v, ambientOcclusionPattern.lengthCap) ||
            app.vueI18n.t('cesium-filters.errormessage.lengthCap'),
        ],
        stepSize: [
          (v) =>
            is(v, ambientOcclusionPattern.stepSize) ||
            app.vueI18n.t('cesium-filters.errormessage.stepSize'),
        ],
        frustumLength: [
          (v) =>
            is(v, ambientOcclusionPattern.frustumLength) ||
            app.vueI18n.t('cesium-filters.errormessage.frustumLength'),
        ],
        blurStepSize: [
          (v) =>
            is(v, ambientOcclusionPattern.blurStepSize) ||
            app.vueI18n.t('cesium-filters.errormessage.blurStepSize'),
        ],
      };

      const enableAction = reactive({
        name: 'enableBriAction',
        title: 'cesium-filters.tooltip.activate',
        icon: 'mdi-checkbox-blank-outline',
        active: ambientOcclusion.enabled,
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
            enabled: !ambientOcclusion.enabled,
          });
          this.active = !ambientOcclusion.enabled;
          this.setTitleAndIcon();
        },
      });
      enableAction.setTitleAndIcon();
      const resetAction = reactive({
        name: 'resetBriAction',
        title: 'cesium-filters.tooltip.reset',
        icon: '$vcsReturn',
        callback() {
          emit('input', {
            ...ambientOcclusionDefaults,
            enabled: ambientOcclusion.enabled,
          });
        },
      });

      const actions = computed(() => {
        if (
          Object.keys(props.value)
            .filter((key) => key !== 'enabled')
            .some((key) => props.value[key] !== ambientOcclusionDefaults[key])
        ) {
          return [enableAction, resetAction];
        }
        return [enableAction];
      });

      const onInput = () => {
        if (is(ambientOcclusion, ambientOcclusionPattern)) {
          emit('input', { ...ambientOcclusion });
        }
      };
      return {
        rules,
        actions,
        ambientOcclusion,
        onInput,
      };
    },
  };
</script>
