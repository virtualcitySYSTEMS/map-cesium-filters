<template>
  <ModifiedSectionComponent
    :expandable="false"
    :header-actions="[action]"
    heading="cesium-filters.nightvision"
  />
</template>
<script>
  import { is } from '@vcsuite/check';
  import { reactive } from 'vue';
  import { useProxiedComplexModel } from '@vcmap/ui';
  import { getNightVisionDefaults } from './defaultValues.js';
  import ModifiedSectionComponent from './ModifiedSectionComponent.vue';
  import { nightVisionPattern } from './validators.js';

  export default {
    name: 'NightVisionComponent',
    components: {
      ModifiedSectionComponent,
    },
    props: {
      modelValue: {
        type: Object,
        default: getNightVisionDefaults,
        validator: (value) => {
          return is(value, nightVisionPattern);
        },
      },
    },
    setup(props, { emit }) {
      const nightVision = useProxiedComplexModel(props, 'modelValue', emit);

      const action = reactive({
        name: 'enableNigAction',
        icon: '$vcsCheckbox',
        active: nightVision.value.enabled,
        setTitleAndIcon() {
          action.icon = action.active ? '$vcsCheckboxChecked' : '$vcsCheckbox';
          action.title = action.active
            ? 'cesium-filters.tooltip.deactivate'
            : 'cesium-filters.tooltip.activate';
        },
        callback() {
          nightVision.value.enabled = !nightVision.value.enabled;
          action.active = nightVision.value.enabled;
          action.setTitleAndIcon();
        },
      });

      action.setTitleAndIcon();

      return {
        action,
        nightVision,
      };
    },
  };
</script>

<style lang="scss" scoped>
  :deep(.vcs-form-section-header) {
    padding-left: calc(
      (var(--v-vcs-font-size) * (1.2 + 0.1 / 3)) + 2px
    ) !important;
  }
</style>
