<template>
    <div style="height: 100vh;">
        <HomeHeader header_title="主页"></HomeHeader>
        <div class="content">
            <div class="description">
                <n-gradient-text :gradient="{
                    from: '#45b8ff', to: 'rgb(200,200,200)'
                }" @mouseover="title = 'FusïonCode :)'" @mouseleave="title = 'FusionCode'"
                    style="font-size: 48px;font-weight: 600;" type="info">
                    {{ title }}
                </n-gradient-text>
                <n-h2>一个综合管理平台</n-h2>
                <n-h3>包含人员管理、项目管理，助力团队项目开发</n-h3>
                <div style="height: 90px;">
                    <n-button @click="router.push('/login')" type="primary" class="loginbutton">开始</n-button>
                    <n-button @click="router.push('/document')" class="loginbutton">阅读文档</n-button>
                </div>
            </div>
        </div>
    </div>
    <div style="height: 100vh;">
        <div class="intro">
            <div class="intro-left-container">
                <div class="intro-left">
                    <div class="intro-left-top">
                        <n-gradient-text :gradient="{
                            from: '#000', to: 'rgb(0,0,0)'
                        }" style="font-size: 48px;font-weight: 600;" type="info">
                            原型设计
                        </n-gradient-text>
                        <n-gradient-text :gradient="{
                            from: '#000', to: 'rgb(0,0,0)'
                        }" style="font-size: 18px;" type="info">
                            产品需求,协同设计
                        </n-gradient-text>
                    </div>
                    <div class="intro-left-bottom">
                        <div class="intro-left-bottom-text">
                            · 创造高保真交互原型,还原实际产品体验
                        </div>
                        <div class="intro-left-bottom-text">
                            · 整合页面原型,需求逻辑清晰可见
                        </div>
                        <!-- <div>
                            · 一键导入Axure文件，快速迁移至墨刀
                        </div> -->
                    </div>
                </div>
            </div>
            <div class="intro-right">
                <img src="@/assets/proto.png" width="700">
            </div>
        </div>
    </div>
    <div style="height: 100vh;">
        <div class="intro">
            <div class="intro-right">
                <img src="@/assets/doc.png" width="700">
            </div>
            <div class="intro-left-container">
                <div class="intro-left">
                    <div class="intro-left-top">
                        <n-gradient-text :gradient="{
                            from: '#000', to: 'rgb(0,0,0)'
                        }" style="font-size: 48px;font-weight: 600;" type="info">
                            共享文档
                        </n-gradient-text>
                        <n-gradient-text :gradient="{
                            from: '#000', to: 'rgb(0,0,0)'
                        }" style="font-size: 18px;" type="info">
                            开发文件,协同编辑
                        </n-gradient-text>
                    </div>
                    <div class="intro-left-bottom">
                        <div class="intro-left-bottom-text">
                            · 支持Markdown语法,单栏渲染
                        </div>
                        <div class="intro-left-bottom-text">
                            · 实时协同编辑,合作无障碍
                        </div>
                        <!-- <div>
                            · 一键导入Axure文件，快速迁移至墨刀
                        </div> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div style="height: 100vh;">
        <div class="intro">
            <div class="intro-left-container">
                <div class="intro-left">
                    <div class="intro-left-top">
                        <n-gradient-text :gradient="{
                            from: '#000', to: 'rgb(0,0,0)'
                        }" style="font-size: 48px;font-weight: 600;" type="info">
                            团队聊天
                        </n-gradient-text>
                        <n-gradient-text :gradient="{
                            from: '#000', to: 'rgb(0,0,0)'
                        }" style="font-size: 18px;" type="info">
                            开发细节,自由交流
                        </n-gradient-text>
                    </div>
                    <div class="intro-left-bottom">
                        <div class="intro-left-bottom-text">
                            · 实时聊天，可进行团队及私聊
                        </div>
                        <div class="intro-left-bottom-text">
                            · 支持文件、图片格式交流
                        </div>
                        <!-- <div>
                            · 一键导入Axure文件，快速迁移至墨刀
                        </div> -->
                    </div>
                </div>
            </div>
            <div class="intro-right">
                <img src="@/assets/chat.png" width="700">
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import HomeHeader from '../components/HomeHeader.vue';
import router from '@/routes';
const title = ref("FusionCode");
</script>

<style scoped>
.description {
    height: auto;
    width: 500px;
    /* background-color: red; */
    padding: 50px;
    border-radius: 10px;
    box-shadow: 0 0 5px 5px #ccc;
    backdrop-filter: blur(15px);
}

.content {
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100% - 70px);
    width: 100%;
    background-image: url('@/assets/background.png');
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

.intro {
    display: flex;
    height: 100%;
    width: 100%;
    background-image: url('@/assets/background.png');

    .intro-left-container {
        width: 35%;
        display: flex;
        justify-content: flex-end;
        align-items: center;

        .intro-left {
            width: 100%;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            flex-direction: column;

            .intro-left-top {
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
                align-items: center;
            }

            .intro-left-bottom {
                width: 100%;
                margin-top: 30px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;

                .intro-left-bottom-text {
                    font-size: 18px;
                }
            }

        }
    }

    .intro-right {
        width: 70%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

}
</style>