<template>
    <div vertical style="height: 100vh;">
        <HomeHeader header_title="文档"></HomeHeader>
        <n-layout has-sider style="height: calc(100% - 70px);">
            <n-layout-sider content-style="padding: 24px;">
                <div>
                    <n-anchor :bound="100" :show-background="false" :show-rail="true" listen-to=".document-scroll-container"
                        :trigger-top="100" style="z-index: 1;">
                        <n-anchor-link class="side_title" title="什么是CodeFusion" href="#what">
                            <n-anchor-link class="side_title" title="简介" href="#basic" />
                            <n-anchor-link class="side_title" title="开发框架" href="#frame" />
                        </n-anchor-link>
                        <n-anchor-link class="side_title" title="入门" href="#init">
                            <n-anchor-link class="side_title" title="登录与注册" href="#login_and_register" />
                            <n-anchor-link class="side_title" title="创建团队" href="#create_team" />
                            <n-anchor-link class="side_title" title="创建项目" href="#create_project" />
                            <n-anchor-link class="side_title" title="人员管理" href="#person_manager" />
                        </n-anchor-link>
                        <n-anchor-link class="side_title" title="赞助？" href="#v_me_50" />
                    </n-anchor>
                </div>
            </n-layout-sider>
            <n-layout>
                <n-layout-header></n-layout-header>
                <n-layout-content content-style="padding: 24px;">
                    <n-card class="card" id="what" title="什么是CodeFusion">
                        卡片内容
                    </n-card>
                    <n-card class="card" id="basic" title="简介">
                        卡片内容
                    </n-card>
                    <n-card class="card" id="frame" title="开发框架">
                        卡片内容
                    </n-card>
                    <n-card class="card" id="init" title="入门">
                        卡片内容
                    </n-card>
                    <n-card class="card" id="login_and_register" title="登录与注册">
                        卡片内容
                    </n-card>
                    <n-card class="card" id="create_team" title="创建团队">
                        卡片内容
                    </n-card>
                    <n-card class="card" id="create_project" title="创建项目">
                        卡片内容
                    </n-card>
                    <n-card class="card" id="person_manager" title="人员管理">
                        卡片内容
                    </n-card>
                    <n-card class="card" id="v_me_50" title="赞助">
                        卡片内容
                    </n-card>
                </n-layout-content>
                <n-layout-footer></n-layout-footer>
            </n-layout>
        </n-layout>
    </div>
</template>

<script setup lang='ts'>
import HomeHeader from '../components/HomeHeader.vue';
</script>

<style scoped>
.description {
    height: auto;
    width: 500px;
    background-color: white;
    padding: 50px;
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

.side_title {
    font-size: medium;
}

.card {
    margin-top: 20px;
}
</style>