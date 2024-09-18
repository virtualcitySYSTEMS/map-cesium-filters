<template>
  <ModifiedSectionComponent
    :expandable="true"
    :action-button-list-overflow-count="5"
    :header-actions="actions"
    heading="cesium-filters.baw"
  >
    <v-container>
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="bwgrad_id">
            {{ $t('cesium-filters.bwgrad') }}
          </VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="bwgrad_id"
            type="number"
            :step="1"
            min="0"
            max="1000"
            :rules="rules.gradations"
            show-spin-buttons
            v-model.number="blackAndWhite.gradations"
            :disabled="!blackAndWhite.enabled"
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
  import { getBlackAndWhiteDefaults } from './defaultValues.js';
  import { blackAndWhitePattern } from './validators.js';

  export default {
    name: 'BlackAndWhiteComponent',
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
        default: getBlackAndWhiteDefaults,
        validator: (value) => {
          return is(value, blackAndWhitePattern);
        },
      },
    },
    setup(props, { emit }) {
      const blackAndWhite = useProxiedComplexModel(props, 'modelValue', emit);
      const blackAndWhiteDefaults = getBlackAndWhiteDefaults();

      const app = inject('vcsApp');
      const rules = {
        gradations: [
          (v) =>
            is(v, blackAndWhitePattern.gradations) ||
            app.vueI18n.t('cesium-filters.errormessage.gradations '),
        ],
      };

      const enableAction = reactive({
        name: 'enableBaWAction',
        title: 'cesium-filters.tooltip.activate',
        icon: 'mdi-checkbox-blank-outline',
        active: blackAndWhite.value.enabled,
        setTitleAndIcon() {
          enableAction.icon = enableAction.active
            ? 'mdi-checkbox-marked'
            : 'mdi-checkbox-blank-outline';
          enableAction.title = enableAction.active
            ? 'cesium-filters.tooltip.deactivate'
            : 'cesium-filters.tooltip.activate';
        },
        callback() {
          blackAndWhite.value.enabled = !blackAndWhite.value.enabled;
          enableAction.active = blackAndWhite.value.enabled;
          enableAction.setTitleAndIcon();
        },
      });
      enableAction.setTitleAndIcon();
      const resetAction = reactive({
        name: 'resetBaWAction',
        title: 'cesium-filters.tooltip.reset',
        icon: '$vcsReturn',
        callback() {
          blackAndWhite.value = { ...blackAndWhiteDefaults };
          enableAction.active = blackAndWhite.value.enabled;
          enableAction.setTitleAndIcon();
        },
      });

      const actions = computed(() => {
        if (
          Object.keys(blackAndWhite.value)
            .filter((key) => key !== 'enabled')
            .some(
              (key) => blackAndWhite.value[key] !== blackAndWhiteDefaults[key],
            )
        ) {
          return [enableAction, resetAction];
        }
        return [enableAction];
      });

      return {
        rules,
        actions,
        blackAndWhite,
      };
    },
  };
</script>
<style lang="scss" scoped></style>
