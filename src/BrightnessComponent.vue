<template>
  <ModifiedSectionComponent
    :expandable="true"
    :action-button-list-overflow-count="5"
    :header-actions="actions"
    heading="cesium-filters.brightness"
  >
    <v-container style="padding-top: 0px; padding-left: 24px">
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
      value: {
        type: Object,
        default: getBrightnessDefaults,
        validator: (value) => {
          return is(value, brightnessPattern);
        },
      },
    },
    setup(props, { emit }) {
      const brightness = { ...props.value };
      const brightnessDefaults = getBrightnessDefaults();
      watch(
        () => props.value,
        () => {
          Object.assign(brightness, props.value);
        },
      );

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
        icon: 'mdi-checkbox-blank-outline',
        active: brightness.enabled,
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
            enabled: !brightness.enabled,
          });
          this.active = !brightness.enabled;
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
            ...brightnessDefaults,
            enabled: brightness.enabled,
          });
        },
      });

      const actions = computed(() => {
        if (
          Object.keys(props.value)
            .filter((key) => key !== 'enabled')
            .some((key) => props.value[key] !== brightnessDefaults[key])
        ) {
          return [enableAction, resetAction];
        }
        return [enableAction];
      });

      const onInput = () => {
        if (is(brightness, brightnessPattern)) {
          emit('input', { ...brightness });
        }
      };

      return {
        rules,
        actions,
        brightness,
        onInput,
      };
    },
  };
</script>
