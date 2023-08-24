<template>
    <div style="height: 100vh;">
        <HomeHeader></HomeHeader>
        <div class="content">
            <div class="description">
                <n-gradient-text style="font-size: 42px;font-weight: 600;" type="info">
                    Project Manager
                </n-gradient-text>
                <n-h2>一个综合管理平台</n-h2>
                <n-h3>提供项目管理，人员管理和交流平台</n-h3>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import HomeHeader from '../components/HomeHeader.vue';
</script>

<style scoped>
.description {
    height: 500px;
    width: 500px;
    background-color: #ddd;
    padding: 20px;
    border-radius: 50px;
    box-shadow:
        7px 7px 12px rgba(0, 0, 0, .4),
        -7px -7px 12px rgba(255, 255, 255, .9);
}

.content {
    display:flex;
    justify-content: center;
    align-items: center;
    height: calc(100% - 70px);
    width: 100%;
    background-color: whitesmoke;
}
</style>