<template>
    <div>
        <router-link to="/test">测试</router-link>
        <router-view></router-view>
    </div>
</template>

<script setup lang='ts'>

</script>

<style scoped>
div {
    background-color: red;
    width: 200px;
    height: 200px;
}
</style>