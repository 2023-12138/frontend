<template>
    <router-view v-if="$route.params.did"></router-view>
    <div v-else class="project-container">
        <div class="project-top">
            <n-h2>{{ projectName }}</n-h2>
            <div class="project-top-bottom">
                <span>
                    TID: {{ $route.params.tid }}
                    PID: {{ $route.params.pid }}
                </span>
                <n-popover trigger="click" placement="bottom-end">
                    <template #trigger>
                        <n-button type="primary"
                            @click="$route.params.fid ? isInFolder = true : isInFolder = false">新建文件</n-button>
                    </template>
                    <div class="createFileContainer">
                        <div class="createFileTop">
                            <n-radio-group v-model:value="createFileValue" name="radiobuttongroup1"
                                class="createFileRightButtons">
                                <n-radio-button type="info" secondary v-for="option in createFileOptions"
                                    :key="option.value" :value="option.value"
                                    :disabled="(option.label === '文件夹' && isInFolder)" :label="option.label"
                                    class="createFileRightButton" />
                            </n-radio-group>
                        </div>
                        <div class="createFileButtom">
                            <span>给你的{{ createFileValue }}起个名字吧&nbsp;(。・∀・)ノ</span>
                            <n-input v-model:value="fileName" placeholder="请输入文件名" />
                            <n-button secondary type="info" @click="createFile">确定</n-button>
                        </div>
                    </div>
                </n-popover>
            </div>
        </div>
        <div class="project-bottom">
            <div class="content">
                <n-tabs type="line" animated tabs-padding="20">
                    <n-tab-pane name="file" tab="文档">
                        <div class="project-card-pane">
                            <div class="project-card"
                                @click="$router.push('/team/' + $route.params.tid + '/project/' + $route.params.pid + '/folder/' + folder.fileID)"
                                v-for="folder in folderAndDocList"
                                v-show="folder.depth == 1 && folder.type == 0 && !$route.params.fid">
                                <div class="project-card-top">
                                    <img src="@/assets/profile.svg" />
                                </div>
                                <div class="project-card-bottom">
                                    {{ folder.filename }}
                                </div>
                            </div>
                            <div class="project-card"
                                @click="$router.push('/team/' + $route.params.tid + '/project/' + $route.params.pid + '/doc/' + doc.docID)"
                                v-for="doc in folderAndDocList"
                                v-show="doc.type == 1 && ($route.params.fid ? doc.father == $route.params.fid : doc.father == projectFolderID)">
                                <div class="project-card-top">
                                    <img src="@/assets/file.svg" />
                                </div>
                                <div class="project-card-bottom">
                                    {{ doc.filename }}
                                </div>
                            </div>
                        </div>
                    </n-tab-pane>

                    <n-tab-pane name="design" tab="原型设计">
                        <div class="project-card-pane">
                            <div class="project-card"
                                @click="$router.push('/team/' + $route.params.tid + '/project/' + $route.params.pid + '/design/1')"
                                v-for="design in designList">
                                <div class="project-card-top">
                                    <img src="@/assets/design.svg" />
                                </div>
                                <div class="project-card-bottom">
                                    {{ design.protoname }}
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
import { ref, onMounted, watch } from 'vue';
import { mypost } from '@/axios/axios';
import { useMessage } from 'naive-ui';
import { useRoute } from 'vue-router';

const message = useMessage();
const route = useRoute();

//获取项目下文档、原型、回收站内容
const folderAndDocList = ref([]);
const designList = ref([]);
// const rubbishBinList = ref([]);
const allFileList = ref([]);
const projectFolderID = ref(0);//当前项目作为一个最大的文件夹，其文件夹编号
const getFiles = async () => {
    const folderRes = await mypost(message, '/file/getprojectfiles', { pid: route.params.pid });
    const designRes = await mypost(message, '/project/getProto', { pid: route.params.pid });
    const allFileRes = await mypost(message, '/file/getallfiles', { pid: route.params.pid });
    // const rubbishBinRes = await mypost(message,'',);
    if (!folderRes || !designRes || !allFileRes) {
        return;
    }
    allFileList.value = allFileRes.filelist;
    for (const file of allFileRes.filelist) {
        if (file.father == -1) {
            projectFolderID.value = file.fileID;
            break;
        }
    }
    designList.value = designRes.protolist;
    folderAndDocList.value = allFileRes.filelist;
}

// 项目名称
const projectName = ref('')

const getProject = async () => {
    if (route.params.pid) {
        const curProject = await mypost(message, '/project/getProject', { pid: route.params.pid });
        if (!curProject) {
            return;
        }
        projectName.value = curProject.project.project_name
    }
}

onMounted(() => {
    getFiles();
    getProject();
})
watch(
    () => route.params,
    () => {
        getFiles();
        getProject();
    },
    { immediate: true }
)

//新建文件
const fileName = ref('');
const createFileValue = ref('原型设计');
const isInFolder = ref(false);
const createFileOptions = [
    {
        value: "原型设计",
        label: "原型设计"
    },
    {
        value: '共享文档',
        label: '共享文档'
    },
    {
        value: '文件夹',
        label: '文件夹'
    }
]
const createFile = async () => {
    let url = '/project/createProto';
    let data: {
        pid: string,
        dirname?: string,
        docname?: string,
        protoname?: string,
        father?: number,
        depth?: number
    } = { pid: route.params.pid.toString() };
    if (createFileValue.value === '共享文档') {
        url = '/doc/createdoc';
        data.docname = fileName.value;
        if (route.params.fid) {
            data.father = parseInt(route.params.fid.toString());
            data.depth = 2;
        } else {
            data.father = projectFolderID.value;
            data.depth = 1;
        }
    } else if (createFileValue.value === '文件夹') {
        url = '/file/createdir';
        data.dirname = fileName.value;
    } else {
        data.protoname = fileName.value;
    }
    const res = await mypost(message, url, data);
    if (!res) {
        return;
    }
    getFiles();
    message.success('创建成功！');
}
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
    flex-wrap: wrap;
}

.project-card {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
    width: 7vmax;
    height: 6vmax;
    margin: 10px;
    padding: 10px;
}

.project-card:hover {
    cursor: pointer;
    background-color: #D3D3D3;
    border-radius: 5%;
}

.project-card-top {
    display: flex;

    >img {
        width: 50px;
    }
}

.project-card-bottom {
    display: flex;
    flex-direction: column;
    margin: 8px;
}

/* 创建文件 */
.createFileContainer {
    width: 300px;
    height: 170px;
    display: flex;
    flex-direction: column;

    .createFileTop {
        width: 100%;
        height: 20%;

        .createFileRightButtons {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;

            .createFileRightButton {
                width: 100%;
                text-align: center;
            }
        }
    }

    .createFileButtom {
        width: 100%;
        height: 80%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;
    }
}
</style>