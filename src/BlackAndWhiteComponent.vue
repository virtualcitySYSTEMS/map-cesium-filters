<template>
  <ModifiedSectionComponent
    :expandable="true"
    :action-button-list-overflow-count="5"
    :header-actions="actions"
    heading="cesium-filters.baw"
    ><v-container style="padding-top: 0px; padding-left: 24px">
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
      value: {
        type: Object,
        default: getBlackAndWhiteDefaults,
        validator: (value) => {
          return is(value, blackAndWhitePattern);
        },
      },
    },
    setup(props, { emit }) {
      const blackAndWhite = { ...props.value };
      const blackAndWhiteDefaults = getBlackAndWhiteDefaults();
      watch(
        () => props.value,
        () => {
          Object.assign(blackAndWhite, props.value);
        },
      );

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
        active: blackAndWhite.enabled,
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
            enabled: !blackAndWhite.enabled,
          });
          this.active = !blackAndWhite.enabled;
          this.setTitleAndIcon();
        },
      });
      enableAction.setTitleAndIcon();
      const resetAction = reactive({
        name: 'resetBaWAction',
        title: 'cesium-filters.tooltip.reset',
        icon: '$vcsReturn',
        callback() {
          emit('input', {
            ...blackAndWhiteDefaults,
            enabled: blackAndWhite.enabled,
          });
        },
      });

      const actions = computed(() => {
        if (
          Object.keys(props.value)
            .filter((key) => key !== 'enabled')
            .some((key) => props.value[key] !== blackAndWhiteDefaults[key])
        ) {
          return [enableAction, resetAction];
        }
        return [enableAction];
      });

      const onInput = () => {
        if (is(blackAndWhite, blackAndWhitePattern)) {
          emit('input', { ...blackAndWhite });
        }
      };

      return {
        rules,
        actions,
        blackAndWhite,
        onInput,
      };
    },
  };
</script>
