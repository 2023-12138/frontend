<template>
    <div style="height: 100vh;">
        <HomeHeader></HomeHeader>
        <div class="content">
            <div class="description">
                <n-gradient-text style="font-size: 42px;font-weight: 600;" type="info">
                    Project Manager
                </n-gradient-text>
                <n-h2>一个综合管理平台</n-h2>
                <n-h3>包含人员管理、项目管理，助力团队项目开发</n-h3>
                <div style="height: 90px;" />
                <n-button type="primary" class="loginbutton">开始</n-button>
                <n-button class="loginbutton">阅读文档</n-button>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import HomeHeader from '../components/HomeHeader.vue';
</script>

<style scoped>
.description {
    height: auto;
    width: 500px;
    background-color: #ddd;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 5px 5px #ccc;
}

.content {
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100% - 70px);
    width: 100%;
    background-color: whitesmoke;
}

.loginbutton {
    font-size: medium;
    width: 130px;
    padding-top: 25px;
    padding-bottom: 25px;
    padding-right: 50px;
    border-radius: 10px;
    margin-right: 20px;
}
</style>