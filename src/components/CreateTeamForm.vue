<template>
    <div class="create-team-form-container">
        <n-form ref="createTeamFormRef" :model="createTeamModel" :rules="createTeamRules">
            <n-form-item path="teamname" label="团队名称">
                <n-input v-model:value="createTeamModel.teamname" @keydown.enter.prevent placeholder="请输入团队名称" />
            </n-form-item>
            <n-form-item path="teamdescription" label="团队描述">
                <n-input v-model:value="createTeamModel.teamdescription" @keydown.enter.prevent placeholder="请输入团队描述" />
            </n-form-item>

            <div class="form-bottom">
                <n-button round type="primary" @click="createTeam" style="width: 100%;">
                    创建
                </n-button>
            </div>
        </n-form>
    </div>
</template>
  
<style>
.login-form-container {
    width: 100%;
    display: flex;
    justify-content: center;
}

.login-form-container form {
    width: 80%;
}

.form-bottom {
    display: flex;
    justify-content: flex-end;
    flex-direction: column;
    margin-top: 5%;
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import { FormInst, useMessage, FormRules } from 'naive-ui'
import axios from '@/axios/axios'
import router from '@/routes';

interface createTeamModelType {
    teamname: string | null
    teamdescription: string | null
}


let props = defineProps<{
    avatarOptions: any[],
}>()

const emit = defineEmits();

const emitUpdateModal = (status : boolean) => {
    emit('updateModalStatus', status);
};
const createTeamFormRef = ref<FormInst | null>(null)
const message = useMessage()

const createTeamModel = ref<createTeamModelType>({
    teamname: null,
    teamdescription: '这是一个团队描述',
})

const createTeamRules: FormRules = {
    teamname: [
        {
            required: true,
            message: '请输入团队名称',
        },
    ],
    teamdescription: [
        {
            required: true,
            message: '请输入团队描述',
        },
    ],
}

const createTeam = (e: MouseEvent) => {
    e.preventDefault()
    createTeamFormRef.value?.validate((errors) => {
        if (!errors) {
            axios.post('team/createTeam', {
                "teamname": createTeamModel.value.teamname,
                "teaminform": createTeamModel.value.teamdescription
            }).then(res => {
                if (res.status === 200) {
                    if (res.data.code === 200) {
                        props.avatarOptions[3].children!.splice(-1, 0, {
                            label: createTeamModel.value.teamname!,
                            key: 'team' + res.data.data.tid
                        })
                        emitUpdateModal(false)
                        router.push('/team/' + res.data.data.tid + '/projectmanage')
                        message.success('创建成功')
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


  