<template>
  <ModifiedSectionComponent
    :expandable="true"
    :action-button-list-overflow-count="5"
    :header-actions="actions"
    heading="cesium-filters.silhouette"
  >
    <v-container>
      <v-row no-gutters>
        <v-col>
          <div class="d-flex justify-center" style="margin: 0 2px 0 2px">
            <v-color-picker
              v-model="silhouette.color"
              :disabled="!silhouette.enabled"
              :modes="['hex', 'rgb']"
              style="width: 100%"
            >
            </v-color-picker>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </ModifiedSectionComponent>
</template>
<script>
  import { is } from '@vcsuite/check';
  import { inject, reactive, computed } from 'vue';
  import { VRow, VCol, VContainer, VColorPicker } from 'vuetify/components';
  import { useProxiedComplexModel } from '@vcmap/ui';
  import ModifiedSectionComponent from './ModifiedSectionComponent.vue';
  import { getSilhouetteDefaults } from './defaultValues.js';
  import { silhouettePattern } from './validators.js';

  export default {
    name: 'SilhouetteComponent',
    components: {
      VCol,
      VRow,
      VContainer,
      VColorPicker,
      ModifiedSectionComponent,
    },
    props: {
      modelValue: {
        type: Object,
        default: getSilhouetteDefaults,
        validator: (value) => {
          return is(value, silhouettePattern);
        },
      },
    },
    setup(props, { emit }) {
      const silhouette = useProxiedComplexModel(props, 'modelValue', emit);
      const silhouetteDefaults = getSilhouetteDefaults();

      const app = inject('vcsApp');

      const rules = {
        color: [
          (v) =>
            is(v, silhouettePattern.color) ||
            app.vueI18n.t('cesium-filters.errormessage.color'),
        ],
      };

      const enableAction = reactive({
        name: 'enableSilAction',
        title: 'cesium-filters.tooltip.activate',
        icon: '$vcsCheckbox',
        active: silhouette.value.enabled,
        setTitleAndIcon() {
          enableAction.icon = enableAction.active
            ? '$vcsCheckboxChecked'
            : '$vcsCheckbox';
          enableAction.title = enableAction.active
            ? 'cesium-filters.tooltip.deactivate'
            : 'cesium-filters.tooltip.activate';
        },
        callback() {
          silhouette.value.enabled = !silhouette.value.enabled;
          enableAction.active = silhouette.value.enabled;
          enableAction.setTitleAndIcon();
        },
      });

      enableAction.setTitleAndIcon();

      const resetAction = reactive({
        name: 'resetSilAction',
        title: 'cesium-filters.tooltip.reset',
        icon: '$vcsReturn',
        callback() {
          silhouette.value = { ...silhouetteDefaults };
          enableAction.active = silhouette.value.enabled;
          enableAction.setTitleAndIcon();
        },
      });

      const actions = computed(() => {
        if (
          Object.keys(silhouette.value)
            .filter((key) => key !== 'enabled')
            .some((key) => silhouette.value[key] !== silhouetteDefaults[key])
        ) {
          return [enableAction, resetAction];
        }
        return [enableAction];
      });

      return {
        rules,
        actions,
        silhouette,
      };
    },
  };
</script>
<style scoped lang="scss">
  .v-color-picker.v-sheet {
    box-shadow: none;
  }
</style>
