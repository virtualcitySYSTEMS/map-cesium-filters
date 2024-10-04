<template>
  <ModifiedSectionComponent
    :expandable="true"
    :action-button-list-overflow-count="5"
    :header-actions="actions"
    heading="cesium-filters.hdr"
  >
    <v-container>
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
      modelValue: {
        type: Object,
        default: getHDRDefaults,
        validator: (value) => {
          return is(value, hdrPattern);
        },
      },
    },
    setup(props, { emit }) {
      const hdr = useProxiedComplexModel(props, 'modelValue', emit);
      const hdrDefaults = getHDRDefaults();

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
        icon: '$vcsCheckbox',
        active: hdr.value.enabled,
        setTitleAndIcon() {
          enableAction.icon = enableAction.active
            ? '$vcsCheckboxChecked'
            : '$vcsCheckbox';
          enableAction.title = enableAction.active
            ? 'cesium-filters.tooltip.deactivate'
            : 'cesium-filters.tooltip.activate';
        },
        callback() {
          hdr.value.enabled = !hdr.value.enabled;
          enableAction.active = hdr.value.enabled;
          enableAction.setTitleAndIcon();
        },
      });
      enableAction.setTitleAndIcon();

      const resetAction = reactive({
        name: 'resetHdrAction',
        title: 'cesium-filters.tooltip.reset',
        icon: '$vcsReturn',
        callback() {
          hdr.value = { ...hdrDefaults };
          enableAction.active = hdr.value.enabled;
          enableAction.setTitleAndIcon();
        },
      });

      const actions = computed(() => {
        if (
          Object.keys(hdr.value)
            .filter((key) => key !== 'enabled')
            .some((key) => hdr.value[key] !== hdrDefaults[key])
        ) {
          return [enableAction, resetAction];
        }
        return [enableAction];
      });

      return {
        rules,
        actions,
        hdr,
      };
    },
  };
</script>
<style lang="scss" scoped></style>
