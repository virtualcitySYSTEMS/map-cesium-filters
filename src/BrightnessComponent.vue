<template>
  <ModifiedSectionComponent
    :expandable="true"
    :action-button-list-overflow-count="5"
    :header-actions="actions"
    heading="cesium-filters.brightness"
  >
    <v-container>
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="bright_id">
            {{ $t('cesium-filters.brightness') }}
          </VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="bright_id"
            type="number"
            :step="0.1"
            min="0"
            max="10"
            show-spin-buttons
            v-model.number="brightness.brightness"
            :rules="rules.brightness"
            :disabled="!brightness.enabled"
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
  import { getBrightnessDefaults } from './defaultValues.js';
  import { brightnessPattern } from './validators.js';

  export default {
    name: 'BrightnessComponent',
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
        default: getBrightnessDefaults,
        validator: (value) => {
          return is(value, brightnessPattern);
        },
      },
    },
    setup(props, { emit }) {
      const brightness = useProxiedComplexModel(props, 'modelValue', emit);
      const brightnessDefaults = getBrightnessDefaults();

      const app = inject('vcsApp');
      const rules = {
        brightness: [
          (v) =>
            is(v, brightnessPattern.brightness) ||
            app.vueI18n.t('cesium-filters.errormessage.brightnessB'),
        ],
      };

      const enableAction = reactive({
        name: 'enableBriAction',
        title: 'cesium-filters.tooltip.activate',
        icon: '$vcsCheckbox',
        active: brightness.value.enabled,
        setTitleAndIcon() {
          enableAction.icon = enableAction.active
            ? '$vcsCheckboxChecked'
            : '$vcsCheckbox';
          enableAction.title = enableAction.active
            ? 'cesium-filters.tooltip.deactivate'
            : 'cesium-filters.tooltip.activate';
        },
        callback() {
          brightness.value.enabled = !brightness.value.enabled;
          enableAction.active = brightness.value.enabled;
          enableAction.setTitleAndIcon();
        },
      });
      enableAction.setTitleAndIcon();
      const resetAction = reactive({
        name: 'resetBriAction',
        title: 'cesium-filters.tooltip.reset',
        icon: '$vcsReturn',
        callback() {
          brightness.value = { ...brightnessDefaults };
          enableAction.active = brightness.value.enabled;
          enableAction.setTitleAndIcon();
        },
      });

      const actions = computed(() => {
        if (
          Object.keys(brightness.value)
            .filter((key) => key !== 'enabled')
            .some((key) => brightness.value[key] !== brightnessDefaults[key])
        ) {
          return [enableAction, resetAction];
        }
        return [enableAction];
      });

      return {
        rules,
        actions,
        brightness,
      };
    },
  };
</script>
<style lang="scss" scoped></style>
