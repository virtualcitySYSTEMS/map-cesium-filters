<script setup>
  import { VcsFormSection } from '@vcmap/ui';
</script>

<template>
  <VcsFormSection v-bind="$attrs" class="modified-form-section">
    <slot />
  </VcsFormSection>
</template>

<style lang="scss" scoped>
  :deep(.vcs-form-section-header) {
    height: calc(var(--v-vcs-font-size) * 2 + 6px) !important;
    background-color: rgb(var(--v-theme-surface)) !important;
  }

  .modified-form-section {
    border-top: 1px solid rgb(var(--v-theme-base-lighten-3)) !important;
  }
</style>
