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
                        <div class="project-card-pane">
                            <div class="project-card"
                            @click="$router.push('/team/' + $route.params.tid + '/project/' + $route.params.pid + '/doc/1')">
                                <div class="project-card-top">
                                    <img src="@/assets/file.svg"  />
                                </div>
                                <div class="project-card-bottom">
                                    文档名字
                                </div>
                            </div>
                            <div class="project-card"
                            @click="$router.push('/team/' + $route.params.tid + '/project/' + $route.params.pid + '/design/1')">
                                <div class="project-card-top">
                                    <img src="@/assets/design.svg"  />
                                </div>
                                <div class="project-card-bottom">
                                    设计名字
                                </div>
                            </div>
                            <div class="project-card"
                            >
                                <div class="project-card-top">
                                    <img src="@/assets/profile.svg"  />
                                </div>
                                <div class="project-card-bottom">
                                    文件夹
                                </div>
                            </div>
                        </div>
                    </n-tab-pane>
                    <n-tab-pane name="setting" tab="设置">
                        设置
                    </n-tab-pane>
                    <n-tab-pane name="rubbish bin" tab="回收站">
                        回收站
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
.project-card-pane {
    display: flex;
    width: 100%;
    height: 100%;
}
.project-card {
    display: flex;
    align-items: center; 
    flex-direction: column;
    width: 7vmax;
    height: 6vmax;
    margin: 10px;
    padding: 10px;
}
.project-card:hover {
    display: flex;
    align-items: center; 
    flex-direction: column;
    width: 7vmax;
    height: 6vmax;
    margin: 10px;
    padding: 10px;
    
    background-color: #D3D3D3;
    border-radius: 5%;
}
.project-card-top {
    display: flex;
    > img {
        width: 50px;
    }
}

.project-card-bottom {
    display: flex;
    flex-direction: column;
    margin: 8px;
}
</style>