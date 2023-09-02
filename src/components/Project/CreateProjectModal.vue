<template>
    <n-modal :mask-closable="false" preset="dialog" @positive-click="createProject"
        positive-text="创建" negative-text="取消">
        <template #header>
            <span class="create-project-header">创建项目</span>
        </template>
        <div class="content">
            <n-form ref="createProjectFormRef" :model="createProjectModel" :rules="createProjectRules">
                <n-form-item path="projectname" label="项目名称">
                    <n-input v-model:value="createProjectModel.projectname" @keydown.enter.prevent placeholder="请输入项目名称" />
                </n-form-item>
                <n-form-item path="projectdescription" label="项目描述">
                    <n-input v-model:value="createProjectModel.projectdescription" @keydown.enter.prevent
                        placeholder="请输入项目描述" />
                </n-form-item>
            </n-form>
        </div>
        <template #action>
        </template>
    </n-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FormInst, useMessage, FormRules } from 'naive-ui'
import axios from '@/axios/axios'
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia'; 
import { useProjectStore } from '@/store/projectStore'
import { useTeamStore } from '@/store/teamStore';

interface createProjectModelType {
    projectname: string | null
    projectdescription: string | null
}

const createProjectFormRef = ref<FormInst | null>(null)
const message = useMessage()
const route = useRoute()
const tid = ref(route.params.tid.toString())

const createProjectModel = ref<createProjectModelType>({
    projectname: null,
    projectdescription: '这是一个项目描述',
})

const createProjectRules: FormRules = {
    projectname: [
        {
            required: true,
            message: '请输入项目名称',
        },
    ],
    projectdescription: [
        {
            required: true,
            message: '请输入项目描述',
        },
    ],
}


const projectStore = useProjectStore();
const projectstore = storeToRefs(projectStore);
const teamStore = useTeamStore();
const teamstore = storeToRefs(teamStore);
const createProject = () => {
    createProjectFormRef.value?.validate((errors) => {
        if (!errors) {
            if (teamstore.curTeam.value.toString() !== '-1'){
                tid.value = teamstore.curTeam.value.toString()
            }
            
            axios.post('project/createProject', {
                "project_name": createProjectModel.value.projectname,
                "project_inform": createProjectModel.value.projectdescription,
                "tid": tid.value.replace('private', '')
            }
            ).then(res => {
                if (res.status === 200) {
                    if (res.data.code === 200) {
                        message.success('创建成功')
                        projectstore.projectChanged.value = !(projectstore.projectChanged.value)
                        // TODO:跳转
                        // router.push('/team/' + tid + '/project/' + res.data.data.pid + '/')
                    } else {
                        message.warning(res.data.message)
                    }
                } else {
                    message.error("服务器错误")
                }
            })
        } else {
            message.warning("请完善信息")
        }
    })
}
</script>

<style scoped>
.create-project-header {
    display: flex;
    justify-content: center;
}

.content {
    margin: 50px;
}
</style>