<script lang="ts" setup>
</script>

<template>
  <div :class="$style.page">
    <div :class="$style.header">
      <slot name="header" />
    </div>
    <div :class="$style.content">
      <slot />
    </div>
    <div :class="$style.footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style lang="scss" module>
.page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
}

.header {
  text-align: center;
  width: 100%;
}

.content {
  flex-grow: 1;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
</style>
