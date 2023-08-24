<template>
    <n-form ref="formRef" :model="model" :rules="rules">
        <n-form-item path="name" label="用户名">
            <n-input v-model:value="model.name" @keydown.enter.prevent />
        </n-form-item>
        <n-form-item path="password" label="密码">
            <n-input v-model:value="model.password" type="password" @keydown.enter.prevent />
        </n-form-item>

        <div style="display: flex; justify-content: flex-end">
            <n-button round type="primary" @click="login">
                登录
            </n-button>
        </div>

    </n-form>
</template>
  
<script lang="ts">
import { defineComponent, ref } from 'vue'
import {
    FormInst,
    FormItemInst,
    useMessage,
    FormRules
} from 'naive-ui'

interface ModelType {
    name: string | null
    password: string | null
}

export default defineComponent({
    setup() {
        const formRef = ref<FormInst | null>(null)
        const rPasswordFormItemRef = ref<FormItemInst | null>(null)
        const message = useMessage()
        const modelRef = ref<ModelType>({
            name: null,
            password: null,
        })
        const rules: FormRules = {
            name: [
                {
                    required: true,
                    message: '请输入用户名'
                }
            ],
            password: [
                {
                    required: true,
                    message: '请输入密码'
                }
            ],
        }
        return {
            formRef,
            rPasswordFormItemRef,
            model: modelRef,
            rules,
            login(e: MouseEvent) {
                e.preventDefault()
                formRef.value?.validate((errors) => {
                    if (!errors) {
                        message.success('验证成功')
                    } else {
                        
                    }
                })
            }
        }
    }
})
</script>