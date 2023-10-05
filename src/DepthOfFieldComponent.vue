<template>
  <ModifiedSectionComponent
    :expandable="true"
    :action-button-list-overflow-count="5"
    :header-actions="actions"
    heading="cesium-filters.depthOF.dof"
    ><v-container style="padding-top: 0px; padding-left: 24px">
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="dofFocalDistance_id">
            {{ $t('cesium-filters.depthOF.dofFocalDistance') }}
          </VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="dofFocalDistance_id"
            type="number"
            :step="1"
            min="0"
            max="1000"
            show-spin-buttons
            v-model.number="depthOfField.focalDistance"
            :rules="rules.focalDistance"
            :disabled="!depthOfField.enabled"
            @input="onInput"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="dofdelta_id">
            {{ $t('cesium-filters.depthOF.dofdelta') }}
          </VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="dofdelta_id"
            type="number"
            :step="0.1"
            min="0"
            max="10"
            show-spin-buttons
            v-model.number="depthOfField.delta"
            :rules="rules.delta"
            :disabled="!depthOfField.enabled"
            @input="onInput"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="dofsigma_id">
            {{ $t('cesium-filters.depthOF.dofsigma') }}
          </VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="dofsigma_id"
            type="number"
            :step="0.1"
            min="0"
            max="10"
            show-spin-buttons
            v-model.number="depthOfField.sigma"
            :rules="rules.sigma"
            :disabled="!depthOfField.enabled"
            @input="onInput"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="dofstepSize_id">
            {{ $t('cesium-filters.depthOF.dofstepSize') }}
          </VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="dofstepSize_id"
            type="number"
            :step="1"
            min="0"
            max="100"
            show-spin-buttons
            v-model.number="depthOfField.stepSize"
            :rules="rules.stepSize"
            :disabled="!depthOfField.enabled"
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
  import { getDepthOfFieldDefaults } from './defaultValues.js';
  import { depthOfFieldPattern } from './validators.js';

  export default {
    name: 'DepthOfFieldComponent',
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
        default: getDepthOfFieldDefaults,
        validator: (value) => {
          return is(value, depthOfFieldPattern);
        },
      },
    },
    setup(props, { emit }) {
      const depthOfField = { ...props.value };
      const depthOfFieldDefaults = getDepthOfFieldDefaults();

      watch(
        () => props.value,
        () => {
          Object.assign(depthOfField, props.value);
        },
      );
      const app = inject('vcsApp');
      const rules = {
        focalDistance: [
          (v) =>
            is(v, depthOfFieldPattern.focalDistance) ||
            app.vueI18n.t('cesium-filters.errormessage.focalDistance'),
        ],
        delta: [
          (v) =>
            is(v, depthOfFieldPattern.delta) ||
            app.vueI18n.t('cesium-filters.errormessage.deltaDoF'),
        ],
        sigma: [
          (v) =>
            is(v, depthOfFieldPattern.sigma) ||
            app.vueI18n.t('cesium-filters.errormessage.sigmaDof'),
        ],
        stepSize: [
          (v) =>
            is(v, depthOfFieldPattern.stepSize) ||
            app.vueI18n.t('cesium-filters.errormessage.stepSizeDoF'),
        ],
      };

      const enableAction = reactive({
        name: 'enableDofAction',
        title: 'cesium-filters.tooltip.activate',
        icon: 'mdi-checkbox-blank-outline',
        active: depthOfField.enabled,
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
            enabled: !depthOfField.enabled,
          });
          this.active = !depthOfField.enabled;
          this.setTitleAndIcon();
        },
      });
      enableAction.setTitleAndIcon();

      const resetAction = reactive({
        name: 'resetDofAction',
        title: 'cesium-filters.tooltip.reset',
        icon: '$vcsReturn',
        callback() {
          emit('input', {
            ...depthOfFieldDefaults,
            enabled: depthOfField.enabled,
          });
        },
      });

      const actions = computed(() => {
        if (
          Object.keys(props.value)
            .filter((key) => key !== 'enabled')
            .some((key) => props.value[key] !== depthOfFieldDefaults[key])
        ) {
          return [enableAction, resetAction];
        }
        return [enableAction];
      });

      const onInput = () => {
        if (is(depthOfField, depthOfFieldPattern)) {
          emit('input', { ...depthOfField });
        }
      };
      return {
        rules,
        actions,
        depthOfField,
        onInput,
      };
    },
  };
</script>
