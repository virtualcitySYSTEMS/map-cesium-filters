<template>
  <ModifiedSectionComponent
    :expandable="true"
    :action-button-list-overflow-count="5"
    :header-actions="actions"
    heading="cesium-filters.hdr"
  >
    <v-container style="padding-top: 0px; padding-left: 24px">
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="hdrgamma_id">
            {{ $t('cesium-filters.hdrgamma') }}
          </VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="hdrgamma_id"
            type="number"
            :step="0.1"
            min="0"
            max="1000"
            :rules="rules.gamma"
            show-spin-buttons
            v-model.number="hdr.gamma"
            :disabled="!hdr.enabled"
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
  import { getHDRDefaults } from './defaultValues.js';
  import ModifiedSectionComponent from './ModifiedSectionComponent.vue';
  import { hdrPattern } from './validators.js';

  export default {
    name: 'HdrComponent',
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
        default: getHDRDefaults,
        validator: (value) => {
          return is(value, hdrPattern);
        },
      },
    },
    setup(props, { emit }) {
      const hdr = { ...props.value };
      const hdrDefaults = getHDRDefaults();

      watch(
        () => props.value,
        () => {
          Object.assign(hdr, props.value);
        },
      );

      const app = inject('vcsApp');
      const rules = {
        gamma: [
          (v) =>
            is(v, hdrPattern.gamma) ||
            app.vueI18n.t('cesium-filters.errormessage.gamma'),
        ],
      };

      const enableAction = reactive({
        name: 'enableHdrAction',
        title: 'cesium-filters.tooltip.activate',
        icon: 'mdi-checkbox-blank-outline',
        active: hdr.enabled,
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
            enabled: !hdr.enabled,
          });
          this.active = !hdr.enabled;
          this.setTitleAndIcon();
        },
      });
      enableAction.setTitleAndIcon();

      const resetAction = reactive({
        name: 'resetHdrAction',
        title: 'cesium-filters.tooltip.reset',
        icon: '$vcsReturn',
        callback() {
          emit('input', {
            ...hdrDefaults,
            enabled: hdr.enabled,
          });
        },
      });

      const actions = computed(() => {
        if (
          Object.keys(props.value)
            .filter((key) => key !== 'enabled')
            .some((key) => props.value[key] !== hdrDefaults[key])
        ) {
          return [enableAction, resetAction];
        }
        return [enableAction];
      });

      const onInput = () => {
        if (is(hdr, hdrPattern)) {
          emit('input', { ...hdr });
        }
      };

      return {
        rules,
        actions,
        hdr,
        onInput,
      };
    },
  };
</script>
