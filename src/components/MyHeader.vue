<template>
    <div class="header">
        <n-icon size="40" color="#0e7a0d">
            <game-controller />
        </n-icon>
        <ul>
            <li></li>
        </ul>
        <router-link to="/test">测试</router-link>
    </div>
</template>

<script setup lang='ts'>

import { GameController } from '@vicons/ionicons5'

</script>

<style scoped>
.header {
    background-color: red;
    width: 100%;
    height: 70px;
}
</style>