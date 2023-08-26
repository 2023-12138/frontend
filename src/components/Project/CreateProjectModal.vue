<template>
    <n-modal :mask-closable="false" preset="dialog">
        <template #header>
            <span class="header">创建项目</span>
        </template>
        <div class="content">
            <n-form ref="createProjectFormRef" :model="createProjectModel" :rules="createProjectRules">
                <n-form-item path="projectname" label="项目名称">
                    <n-input v-model:value="createProjectModel.projectname" @keydown.enter.prevent placeholder="请输入项目名称" />
                </n-form-item>
                <n-form-item path="projectdescription" label="项目描述">
                    <n-input v-model:value="createProjectModel.projectdescription" @keydown.enter.prevent placeholder="请输入项目描述" />
                </n-form-item>

                <div class="form-bottom">
                    <n-button round type="primary" @click="createProject" style="width: 100%;">
                        创建
                    </n-button>
                </div>
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
import router from '@/routes';

interface createProjectModelType {
    projectname: string | null
    projectdescription: string | null
}

const createProjectFormRef = ref<FormInst | null>(null)
const message = useMessage()

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

const createProject = (e: MouseEvent) => {
    e.preventDefault()
    createProjectFormRef.value?.validate((errors) => {
        if (!errors) {
            console.log(createProjectModel.value)
        } else {
            message.warning("请完善信息")
        }
    })
}
</script>

<style scoped>
.header {
    display: flex;
    justify-content: center;
}

.content {
    margin: 50px;
}
</style>