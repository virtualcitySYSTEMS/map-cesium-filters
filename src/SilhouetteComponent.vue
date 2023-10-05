<template>
  <ModifiedSectionComponent
    :expandable="true"
    :action-button-list-overflow-count="5"
    :header-actions="actions"
    heading="cesium-filters.silhouette"
  >
    <v-container style="padding-top: 0px">
      <v-row no-gutters>
        <v-col>
          <div class="d-flex flex-column">
            <v-color-picker
              v-model="silhouette.color"
              :disabled="!silhouette.enabled"
              @input="onInput"
              :modes="['hex', 'rgb']"
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
  import { inject, watch, reactive, computed } from 'vue';
  import { VRow, VCol, VContainer, VColorPicker } from 'vuetify/lib';
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
      value: {
        type: Object,
        default: getSilhouetteDefaults,
        validator: (value) => {
          return is(value, silhouettePattern);
        },
      },
    },
    setup(props, { emit }) {
      const silhouette = { ...props.value };
      const silhouetteDefaults = getSilhouetteDefaults();

      watch(
        () => props.value,
        () => {
          Object.assign(silhouette, props.value);
        },
      );

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
        icon: 'mdi-checkbox-blank-outline',
        active: silhouette.enabled,
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
            enabled: !silhouette.enabled,
          });
          this.active = !silhouette.enabled;
          this.setTitleAndIcon();
        },
      });

      enableAction.setTitleAndIcon();

      const resetAction = reactive({
        name: 'resetSilAction',
        title: 'cesium-filters.tooltip.reset',
        icon: '$vcsReturn',
        callback() {
          emit('input', {
            ...silhouetteDefaults,
            enabled: silhouette.enabled,
          });
        },
      });

      const actions = computed(() => {
        if (
          Object.keys(props.value)
            .filter((key) => key !== 'enabled')
            .some((key) => props.value[key] !== silhouetteDefaults[key])
        ) {
          return [enableAction, resetAction];
        }
        return [enableAction];
      });

      const onInput = () => {
        if (is(silhouette, silhouettePattern)) {
          emit('input', { ...silhouette });
        }
      };

      return {
        rules,
        actions,
        silhouette,
        onInput,
      };
    },
  };
</script>
