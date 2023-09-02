<template>
    <router-view v-if="$route.params.did"></router-view>
    <div v-else class="project-container">
        <div class="project-top">
            <n-h2>{{ projectName }}</n-h2>
            <div class="project-top-bottom">
                <span>
                    {{ projectInform }}
                </span>
                <n-popover :show="showCreateFile" trigger="manual" placement="bottom-end">
                    <template #trigger>
                        <n-button type="primary"
                            @click="$route.params.fid ? isInFolder = true : isInFolder = false;showCreateFile = !showCreateFile">新建文件</n-button>
                    </template>
                    <div class="createFileContainer" :style="{'height':createFileValue != '文件夹' ? '210px' : '170px'}">
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
                            <div class="docTemplate" v-show="createFileValue != '文件夹'">
                                <n-button type="primary" @click="createFileValue == '共享文档' ? changeTemplateModal = true : changeProtoTemplateModal = true">选择模板</n-button>
                                <span>{{ createFileValue == '共享文档' ? templateValue : protoTemplateValue }}</span>
                            </div>
                            <span>给你的{{ createFileValue === '原型设计' ? '页面' : createFileValue }}起个名字吧&nbsp;(。・∀・)ノ</span>
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
                        <div class="breadcrumb" v-show="$route.params.fid">
                            <div class="back" @click="$router.go(-1)">
                                <n-icon size="20" :component="ArrowBackSharp" />
                            </div>
                            <n-breadcrumb>
                                <n-breadcrumb-item @click="$router.push(`/team/${$route.params.tid}/project/${$route.params.pid}`)">
                                    <n-icon color="blue" :component="ProjectDiagram" /> {{ projectName }}
                                </n-breadcrumb-item>
                                <n-breadcrumb-item>
                                    <n-icon color="blue" :component="Folder" /> {{ currentFolder }}
                                </n-breadcrumb-item>
                            </n-breadcrumb>
                        </div>
                        <div class="project-card-pane">
                            <div class="project-card"
                                @click="$router.push('/team/' + $route.params.tid + '/project/' + $route.params.pid + '/folder/' + folder.fileID);currentFolder = folder.filename"
                                v-for="folder in folderAndDocList"
                                v-show="folder.depth == 1 && folder.type == 0 && !$route.params.fid">
                                <div class="project-card-top">
                                    <img src="@/assets/profile.svg" />
                                </div>
                                <div class="project-card-bottom">
                                    <n-ellipsis style="max-width: 100%;">{{ folder.filename }}</n-ellipsis>
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
                                    <n-ellipsis style="max-width: 100%;">{{ doc.filename }}</n-ellipsis>
                                </div>
                            </div>
                        </div>
                    </n-tab-pane>
                    <n-tab-pane name="design" tab="原型设计">
                        <div class="project-card-pane">
                            <div class="project-card"
                                @click="$router.push('/team/' + $route.params.tid + '/project/' + $route.params.pid + '/design/' + design.protoid)"
                                v-for="design in designList">
                                <div class="project-card-top">
                                    <img src="@/assets/design.svg" />
                                </div>
                                <div class="project-card-bottom">
                                    <n-ellipsis style="max-width: 100%;">{{ design.protoname }}</n-ellipsis>
                                </div>
                            </div>
                        </div>
                    </n-tab-pane>
                </n-tabs>
            </div>
        </div>
    </div>
    <n-modal title="选择模板" v-model:show="changeTemplateModal" preset="card" style="width: 60vw;height: 90vh;" 
        content-style="height:70%;width:100%" header-style="text-align:center;font-size:24px">
        <n-scrollbar style="max-height: 100%">
            <div class="templateContainer">
                <div class="templateCard" v-for="(template,index) in templates" :key="index" @click="chooseDocTemplate(index)">
                    <div class="templateImgContainer">
                        <img class="templateImg" :src="template.img">
                    </div>
                    <div class="templateName">
                        <span>{{ template.name }}</span>
                    </div>
                </div>
            </div>
        </n-scrollbar>
    </n-modal>
    <n-modal title="选择模板" v-model:show="changeProtoTemplateModal" preset="card" style="width: 60vw;height: 90vh;" 
        content-style="height:70%;width:100%" header-style="text-align:center;font-size:24px">
        <n-scrollbar style="max-height: 100%">
            <div class="templateContainer">
                <div class="templateCard" v-for="(template,index) in protoTemplates" :key="index" @click="chooseProtoTemplate(index)">
                    <div class="templateImgContainer">
                        <img class="templateImg" :src="template.img">
                    </div>
                    <div class="templateName">
                        <span>{{ template.name }}</span>
                    </div>
                </div>
            </div>
        </n-scrollbar>
    </n-modal>
</template>

<script setup lang="ts">
import { ref, onMounted, watch,Ref } from 'vue';
import { mypost } from '@/axios/axios';
import { useMessage } from 'naive-ui';
import { useRoute } from 'vue-router';
import { ArrowBackSharp } from '@vicons/ionicons5';
import { Folder,ProjectDiagram } from '@vicons/fa';
import { Document28Filled } from '@vicons/fluent';

const message = useMessage();
const route = useRoute();

const currentFolder = ref('');
//获取项目下文档、原型、回收站内容
const folderAndDocList:Ref<any[]> = ref([]);
const designList:Ref<any[]> = ref([]);
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
const projectInform = ref('')

const getProject = async () => {
    if (route.params.pid) {
        const curProject = await mypost(message, '/project/getProject', { pid: route.params.pid });
        if (!curProject) {
            return;
        }
        projectName.value = curProject.project.project_name;
        projectInform.value = curProject.project.project_inform;
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
const showCreateFile = ref(false);
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
        depth?: number,
        template?: string,
        modelid?:number,
    } = { pid: route.params.pid.toString() };
    if (createFileValue.value === '共享文档') {
        url = '/doc/createdoc';
        data.docname = fileName.value;
        data.template = templateValue.value;
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
        data.modelid = protoTemplateNumber.value;
    }
    const res = await mypost(message, url, data);
    if (!res) {
        return;
    }
    getFiles();
    message.success('创建成功！');
    showCreateFile.value = false;
}

//选择文档以及原型模板
const changeTemplateModal = ref(false);
const changeProtoTemplateModal = ref(false);
const templateValue = ref('空白文档');
const protoTemplateValue = ref('空白页面');
const protoTemplateNumber = ref(1);
const templates = [
    {
        img:'http://rzyi06q9n.hb-bkt.clouddn.com/%E7%A9%BA%E7%99%BD%E6%96%87%E6%A1%A3.png',
        name:'空白文档'
    },
    {
        img:'http://rzyi06q9n.hb-bkt.clouddn.com/%E9%A1%B9%E7%9B%AE%E8%AE%A1%E5%88%92%E4%B9%A6.png',
        name:'项目计划书'
    },
    {
        img:'http://rzyi06q9n.hb-bkt.clouddn.com/%E6%9E%B6%E6%9E%84%E8%AE%BE%E8%AE%A1%E8%AF%B4%E6%98%8E%E4%B9%A6.png',
        name:'架构设计说明书'
    },
    {
        img:'http://rzyi06q9n.hb-bkt.clouddn.com/%E5%B7%A5%E4%BD%9C%E5%91%A8%E6%8A%A5.png',
        name:'工作周报'
    },
    {
        img:'http://rzyi06q9n.hb-bkt.clouddn.com/%E9%A1%B9%E7%9B%AE%E7%AE%A1%E7%90%86%E4%B9%A6.png',
        name:'项目管理书'
    },
    {
        img:'http://rzyi06q9n.hb-bkt.clouddn.com/%E4%BC%9A%E8%AE%AE%E7%BA%AA%E8%A6%81.png',
        name:'会议纪要'
    },
    {
        img:'http://rzyi06q9n.hb-bkt.clouddn.com/%E9%9C%80%E6%B1%82%E8%A7%84%E6%A0%BC%E8%AF%B4%E6%98%8E%E4%B9%A6.png',
        name:'需求规格说明书'
    },
    {
        img:'http://rzyi06q9n.hb-bkt.clouddn.com/%E9%9C%80%E6%B1%82%E8%B0%83%E7%A0%94%E6%8A%A5%E5%91%8A.png',
        name:'需求调研报告'
    }
]
const protoTemplates = [
    {
        img:'http://rzyi06q9n.hb-bkt.clouddn.com/%E7%A9%BA%E7%99%BD%E6%96%87%E6%A1%A3.png',
        name:'空白文档',
        key:1
    },
    {
        img:'http://rzyi06q9n.hb-bkt.clouddn.com/1.png',
        name:'登录模板',
        key:7
    },
    {
        img:'http://rzyi06q9n.hb-bkt.clouddn.com/2.png',
        name:'数据后台模板',
        key:8
    },
    {
        img:'http://rzyi06q9n.hb-bkt.clouddn.com/3.png',
        name:'App个人中心模板',
        key:9
    },
    {
        img:'http://rzyi06q9n.hb-bkt.clouddn.com/4.png',
        name:'注册模板',
        key:10
    }
]
const chooseDocTemplate = (index:number) => {
    templateValue.value = templates[index].name;
    changeTemplateModal.value = false;
}
const chooseProtoTemplate = (index:number) => {
    protoTemplateValue.value = protoTemplates[index].name;
    protoTemplateNumber.value = protoTemplates[index].key;
    changeProtoTemplateModal.value = false;
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

.project-top > h2 {
    margin: 10px 0 0 10px;
}

.project-bottom {
    display: inline-flex;
    flex-direction: column;
}

.breadcrumb {
    height: 20px;
    width: 100%;
    display: flex;
    align-items: center;
}

.back {
    font-size: 0;
    margin: 0 10px;
    cursor: pointer;
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
    width: 9vmax;
    height: 8vmax;
    margin: 10px;
    padding: 10px;
}

.project-card:hover {
    cursor: pointer;
    background-color: #D3D3D3;
    border-radius: 5%;
}

.project-card-top {
    width:100%;
    height: 60%;
    display: flex;

    >img {
        width: 100%;
    }
}

.project-card-bottom {
    width: 80%;
    display: flex;
    justify-content: center;
    margin: 8px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space:nowrap;
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
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;

        .docTemplate {
            width: 100%;
            display: flex;
            justify-content: space-evenly;
            align-items: center;
        }
    }
}

/* 文档模板 */
.templateContainer {
    width: 100%;
    height: 100%;
    padding: 10px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;

    .templateCard {
        width: 24%;
        height: 40%;
        margin: 1.6% 4%;
        border-radius: 20px;
        box-shadow: 5px 5px 10px;
        background-color: white;
        display: flex;
        flex-direction: column;

        &:hover {
            cursor: pointer;
            transform:translateY(-5px);
            transform:scale(1.01,1.01);
            box-shadow: 5px 5px 20px;
            transition: .1s all linear;
        }

        .templateImgContainer {
            height: 80%;
            width: 100%;
            font-size: 0;
            border-radius: 20px 20px 0 0;
            overflow: hidden;

            .templateImg {
                width: 100%;
                height: auto;
            }
        }

        .templateName {
            height: 20%;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 18px;
            font-weight: 666;
        }
    }
}
</style>