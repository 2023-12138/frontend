<template>
    <router-view v-if="$route.params.did"></router-view>
    <div v-else class="project-container">
        <div class="project-top">
            <n-h2>项目1</n-h2>
            <div class="project-top-bottom">
                <span>
                    TID: {{ $route.params.tid }}
                    PID: {{ $route.params.pid }}
                </span>
                <n-button type="primary">新建文件</n-button>
            </div>
        </div>
        <div class="project-bottom">
            <div class="content">
                <n-tabs type="line" animated>
                    <n-tab-pane name="file" tab="文件">
                        <n-button @click="$router.push('/team/1/project/2/doc/1')">
                            文档1
                        </n-button>
                    </n-tab-pane>
                    <n-tab-pane name="setting" tab="设置">
                        项目设置
                    </n-tab-pane>
                    <n-tab-pane name="rubbish bin" tab="回收站">
                        文件回收站
                    </n-tab-pane>
                </n-tabs>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.project-container {
    display: flex;
    flex-direction: column;
    padding: 20px;
}

.project-top .project-top-bottom {
    display: flex;
    justify-content: space-between;
    margin: 10px;
}

.project-bottom {

    display: inline-flex;
    flex-direction: row;
}

.content {
    width: 100%;
}
</style>