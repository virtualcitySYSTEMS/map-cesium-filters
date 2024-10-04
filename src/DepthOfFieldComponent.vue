<template>
  <ModifiedSectionComponent
    :expandable="true"
    :action-button-list-overflow-count="5"
    :header-actions="actions"
    heading="cesium-filters.depthOF.dof"
  >
    <v-container>
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
      modelValue: {
        type: Object,
        default: getDepthOfFieldDefaults,
        validator: (value) => {
          return is(value, depthOfFieldPattern);
        },
      },
    },
    setup(props, { emit }) {
      const depthOfField = useProxiedComplexModel(props, 'modelValue', emit);
      const depthOfFieldDefaults = getDepthOfFieldDefaults();

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
        icon: '$vcsCheckbox',
        active: depthOfField.value.enabled,
        setTitleAndIcon() {
          enableAction.icon = enableAction.active
            ? '$vcsCheckboxChecked'
            : '$vcsCheckbox';
          enableAction.title = enableAction.active
            ? 'cesium-filters.tooltip.deactivate'
            : 'cesium-filters.tooltip.activate';
        },
        callback() {
          depthOfField.value.enabled = !depthOfField.value.enabled;
          enableAction.active = depthOfField.value.enabled;
          enableAction.setTitleAndIcon();
        },
      });
      enableAction.setTitleAndIcon();

      const resetAction = reactive({
        name: 'resetDofAction',
        title: 'cesium-filters.tooltip.reset',
        icon: '$vcsReturn',
        callback() {
          depthOfField.value = { ...depthOfFieldDefaults };
          enableAction.active = depthOfField.value.enabled;
          enableAction.setTitleAndIcon();
        },
      });

      const actions = computed(() => {
        if (
          Object.keys(depthOfField.value)
            .filter((key) => key !== 'enabled')
            .some(
              (key) => depthOfField.value[key] !== depthOfFieldDefaults[key],
            )
        ) {
          return [enableAction, resetAction];
        }
        return [enableAction];
      });

      return {
        rules,
        actions,
        depthOfField,
      };
    },
  };
</script>
<style lang="scss" scoped></style>
