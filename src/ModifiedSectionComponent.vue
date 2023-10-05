<template>
  <section class="vcs-form-section">
    <slot name="header" :heading="heading" :actions="actions">
      <div class="vcs-form-section-header d-flex">
        <div class="d-flex justify-space-between w-full">
          <div class="d-flex align-center" :class="{ 'px-2': !expandable }">
            <v-btn
              :ripple="false"
              dense
              plain
              icon
              small
              text
              elevation="0"
              @click="open = !open"
              v-if="expandable"
            >
              <v-icon>{{
                open ? 'mdi-chevron-down' : 'mdi-chevron-right'
              }}</v-icon>
            </v-btn>
            <span v-if="expandable">{{ $t(heading) }}</span>
            <span v-else :style="{ marginLeft: '20px' }">{{
              $t(heading)
            }}</span>
          </div>
          <VcsActionButtonList
            :actions="actions"
            :overflow-count="actionButtonListOverflowCount"
            class="pa-2"
          />
        </div>
      </div>
    </slot>
    <article class="section-content" v-if="showContent">
      <slot />
    </article>
  </section>
</template>

<script>
  import { computed, ref } from 'vue';
  import { VBtn, VIcon } from 'vuetify/lib';
  import { VcsActionButtonList } from '@vcmap/ui';

  export default {
    name: 'VcsFormSection',
    components: {
      VBtn,
      VIcon,
      VcsActionButtonList,
    },
    props: {
      heading: {
        type: String,
        default: undefined,
      },
      expandable: {
        type: Boolean,
        default: false,
      },
      startOpen: {
        type: Boolean,
        default: false,
      },
      headerActions: {
        type: Array,
        default: () => [],
      },
      actionButtonListOverflowCount: {
        type: Number,
        required: false,
        default: undefined,
      },
      helpText: {
        type: String,
        default: undefined,
      },
    },
    setup(props, { slots }) {
      const open = ref(props.startOpen);
      const showContent = computed(() => {
        if (props.expandable) {
          return open.value;
        }
        return true;
      });

      const actions = computed(() => {
        if (slots.help && slots.help().length > 0) {
          return [...props.headerActions];
        }
        return props.headerActions;
      });

      return {
        open,
        showContent,
        actions,
      };
    },
  };
</script>

<style lang="scss" scoped>
  .vcs-form-section-header {
    height: 32px;
  }
  .vcs-form-section {
    border-top: 1px solid var(--v-base-lighten3);
  }
  .v-alert--text:before {
    background-color: transparent;
  }
</style>
