<template>
  <ModifiedSectionComponent
    :expandable="false"
    :header-actions="[action]"
    heading="cesium-filters.nightvision"
  >
  </ModifiedSectionComponent>
</template>
<script>
  import { is } from '@vcsuite/check';
  import { watch, reactive } from 'vue';
  import { getNightVisionDefaults } from './defaultValues.js';
  import ModifiedSectionComponent from './ModifiedSectionComponent.vue';
  import { nightVisionPattern } from './validators.js';

  export default {
    name: 'NightVisionComponent',
    components: {
      ModifiedSectionComponent,
    },
    props: {
      value: {
        type: Object,
        default: getNightVisionDefaults,
        validator: (value) => {
          return is(value, nightVisionPattern);
        },
      },
    },
    setup(props, { emit }) {
      const nightVision = { ...props.value };

      watch(
        () => props.value,
        () => {
          Object.assign(nightVision, props.value);
        },
      );
      const action = reactive({
        name: 'enableNigAction',
        icon: 'mdi-checkbox-blank-outline',
        active: nightVision.enabled,
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
            enabled: !nightVision.enabled,
          });
          this.active = !nightVision.enabled;
          this.setTitleAndIcon();
        },
      });

      action.setTitleAndIcon();

      const onInput = () => {
        if (is(nightVision, nightVisionPattern)) {
          emit('input', { ...nightVision });
        }
      };
      return {
        action,
        nightVision,
        onInput,
      };
    },
  };
</script>
