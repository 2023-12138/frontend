<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-message-provider>
      <router-view></router-view>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang='ts'>
import { NConfigProvider } from 'naive-ui'

/**
 * js 文件下使用这个做类型提示
 * @type import('naive-ui').GlobalThemeOverrides
 */
const themeOverrides = {
  common: {
    primaryColor: '#18a058'
  },
  Button: {
  },
  Select: {
    peers: {
      InternalSelection: {
      }
    }
  }
  // ...
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}

li {
  list-style-type: none;
}
</style>