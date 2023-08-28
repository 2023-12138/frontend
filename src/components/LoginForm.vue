<template>
    <div class="login-form-container">
        <n-scrollbar>
            <n-form v-if="formType === 'login'" ref="loginFormRef" :model="loginModel" :rules="loginRules">
                <n-form-item path="name" label="用户名">
                    <n-input v-model:value="loginModel.name" @keydown.enter.prevent placeholder="请输入用户名" />
                </n-form-item>
                <n-form-item path="password" label="密码">
                    <n-input v-model:value="loginModel.password" type="password" @keydown.enter.prevent
                        placeholder="请输入密码" />
                </n-form-item>

                <div class="form-bottom">
                    <n-button round type="primary" @click="login" style="width: 100%;">
                        登录
                    </n-button>

                    <div class="links">
                        <span @click="formType = 'register'">注册</span>
                        <span @click="formType = 'forget'">找回密码</span>
                    </div>
                </div>
            </n-form>

            <n-form v-if="formType === 'register'" ref="registerFormRef" :model="registerModel" :rules="registerRules">
                <n-form-item path="username" label="用户名">
                    <n-input v-model:value="registerModel.username" @keydown.enter.prevent placeholder="请输入用户名" />
                </n-form-item>
                <n-form-item path="email" label="邮箱">
                    <n-input v-model:value="registerModel.email" @keydown.enter.prevent placeholder="请输入邮箱" />
                </n-form-item>
                <n-form-item path="name" label="真实姓名">
                    <n-input v-model:value="registerModel.name" @keydown.enter.prevent placeholder="请输入姓名" />
                </n-form-item>
                <n-form-item path="phone" label="联系电话">
                    <n-input v-model:value="registerModel.phone" @keydown.enter.prevent placeholder="请输入电话" />
                </n-form-item>
                <n-form-item path="password" label="密码">
                    <n-input v-model:value="registerModel.password" type="password" @keydown.enter.prevent
                        placeholder="请输入密码" />
                </n-form-item>
                <n-form-item path="repeatPassword" label="确认密码">
                    <n-input v-model:value="registerModel.repeatPassword" type="password" @keydown.enter.prevent
                        placeholder="请输入密码" />
                </n-form-item>
                <n-form-item path="captcha" label="验证码">
                    <div class="input-with-button">
                        <n-input v-model:value="registerModel.captcha" @keydown.enter.prevent placeholder="请输入验证码" />
                        <n-button type="primary" :disabled="isRegisterButtonDisabled" @click="submitRegisterCaptcha"
                            style="width: 130px;">
                            {{ registerButtonText }}
                        </n-button>
                    </div>
                </n-form-item>

                <div class="form-bottom">
                    <n-button round type="primary" @click="register" style="width: 100%;">
                        注册
                    </n-button>

                    <div class="links">
                        <span @click="formType = 'login'">去登录</span>
                    </div>
                </div>
            </n-form>

            <n-form v-if="formType === 'forget'" ref="frogetFormRef" :model="forgetModel" :rules="forgetRules">
                <n-form-item path="email" label="邮箱">
                    <n-input v-model:value="forgetModel.email" @keydown.enter.prevent placeholder="请输入邮箱" />
                </n-form-item>
                <n-form-item path="password" label="密码">
                    <n-input v-model:value="forgetModel.password" type="password" @keydown.enter.prevent
                        placeholder="请输入密码" />
                </n-form-item>
                <n-form-item path="repeatPassword" label="确认密码">
                    <n-input v-model:value="forgetModel.repeatPassword" type="password" @keydown.enter.prevent
                        placeholder="请输入密码" />
                </n-form-item>
                <n-form-item path="captcha" label="验证码">
                    <div class="input-with-button">
                        <n-input v-model:value="forgetModel.captcha" @keydown.enter.prevent placeholder="请输入验证码" />
                        <n-button type="primary" :disabled="isForgetButtonDisabled" @click="submitForgetCaptcha"
                            style="width: 130px;">
                            {{ forgetButtonText }}
                        </n-button>
                    </div>
                </n-form-item>

                <div class="form-bottom">
                    <n-button round type="primary" @click="forget" style="width: 100%;">
                        找回
                    </n-button>

                    <div class="links">
                        <span @click="formType = 'login'">去登录</span>
                    </div>
                </div>
            </n-form>
        </n-scrollbar>
    </div>
</template>
  
<style>
.login-form-container {
    width: 100%;
    display: flex;
    justify-content: center;
    overflow-y: scroll;
}

.login-form-container form {
    width: 80%;
}

::-webkit-scrollbar {
    display: none;
}

.form-bottom {
    display: flex;
    justify-content: flex-end;
    flex-direction: column;
    margin-top: 5%;
}

.input-with-button {
    display: flex;
    align-items: center;
    width: 100%;
}

.links {
    display: flex;
    margin: 5px;
    margin-top: 5%;
    justify-content: space-around;

}

.links span {
    padding: 5px;
    border-radius: 5px;
}

.links span:hover {
    color: white;
    background-color: rgb(69, 184, 255);
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import { FormInst, useMessage, FormRules } from 'naive-ui'
import axios from '@/axios/axios'
import router from '@/routes';
import { useAxiosStore } from '@/store/axiosStore';
import { useUserStore } from '@/store/userStore'
import { useTeamStore } from '@/store/teamStore'
import { storeToRefs } from 'pinia';

interface LoginModelType {
    name: string | null
    password: string | null
}

interface RegisterModelType {
    username: string | null
    email: string | null
    name: string | null
    phone: string | null
    password: string | null
    repeatPassword: string | null
    captcha: string | null
}

interface ForgetModelType {
    email: string | null
    password: string | null
    repeatPassword: string | null
    captcha: string | null
}

const loginFormRef = ref<FormInst | null>(null)
const registerFormRef = ref<FormInst | null>(null)
const frogetFormRef = ref<FormInst | null>(null)
const message = useMessage()
const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const phonePattern = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/
const formType = ref<string>('login')
const loginModel = ref<LoginModelType>({
    name: null,
    password: null,
})
const registerModel = ref<RegisterModelType>({
    name: null,
    email: null,
    password: null,
    repeatPassword: null,
    captcha: null,
    username: null,
    phone: null
})
const forgetModel = ref<ForgetModelType>({
    email: null,
    password: null,
    repeatPassword: null,
    captcha: null
})
const loginRules: FormRules = {
    name: [
        {
            required: true,
            message: '请输入用户名',
        },
    ],
    password: [
        {
            required: true,
            message: '请输入密码',
        },
    ],
}
const registerRules: FormRules = {
    username: [
        {
            required: true,
            message: '请输入用户名',
        },
    ],
    phone: [
        {
            required: true,
            validator(_rule: any, value: string) {
                if (!value) {
                    return new Error('请输入手机号')
                } else if (!phonePattern.test(value)) {
                    return new Error('请输入正确格式的手机号')
                }
                return true
            },
            trigger: ['input', 'blur', 'delete']
        },
    ],
    name: [
        {
            required: true,
            message: '请输入真实姓名',
        },
    ],
    email: [
        {
            required: true,
            validator(_rule: any, value: string) {
                if (!value) {
                    return new Error('请输入邮箱')
                } else if (!emailPattern.test(value)) {
                    return new Error('请输入正确格式的邮箱')
                }
                return true
            },
            trigger: ['input', 'blur', 'delete']
        },
    ],
    password: [
        {
            required: true,
            message: '请输入密码',
        },
    ],
    repeatPassword: [
        {
            required: true,
            validator(_rule: any, value: string) {
                if (!value) {
                    return new Error('请输入密码')
                } else if (value !== registerModel.value.password) {
                    return new Error('两次密码输入不一致！')
                }
                return true
            },
            trigger: ['input', 'blur', 'delete']
        },
    ],
    captcha: [
        {
            required: true,
            validator(_rule: any, value: string) {
                if (!value) {
                    return new Error('请输入验证码')
                } else if (value.length !== 4) {
                    return new Error('请输入正确格式验证码')
                }
                return true
            },
            trigger: ['input', 'blur', 'delete']
        },
    ],
}
const forgetRules: FormRules = {
    email: [
        {
            required: true,
            validator(_rule: any, value: string) {
                if (!value) {
                    return new Error('请输入邮箱')
                } else if (!emailPattern.test(value)) {
                    return new Error('请输入正确格式的邮箱')
                }
                return true
            },
            trigger: ['input', 'blur', 'delete']
        },
    ],
    password: [
        {
            required: true,
            message: '请输入密码',
        },
    ],
    repeatPassword: [
        {
            required: true,
            validator(_rule: any, value: string) {
                if (!value) {
                    return new Error('请输入密码')
                } else if (value !== forgetModel.value.password) {
                    return new Error('两次密码输入不一致！')
                }
                return true
            },
            trigger: ['input', 'blur', 'delete']
        },
    ],
    captcha: [
        {
            required: true,
            validator(_rule: any, value: string) {
                if (!value) {
                    return new Error('请输入验证码')
                } else if (value.length !== 4) {
                    return new Error('请输入正确格式验证码')
                }
                return true
            },
            trigger: ['input', 'blur', 'delete']
        },
    ],
}
const userStore = useUserStore();
const userstore = storeToRefs(userStore);
const teamStore = useTeamStore();
const teamstore = storeToRefs(teamStore);
const axiosStore = useAxiosStore();
const login = (e: MouseEvent) => {
    e.preventDefault()
    loginFormRef.value?.validate((errors) => {
        if (!errors) {
            let privateTid: string
            let flag: boolean = false
            axios.post("/user/login", {
                "username": loginModel.value.name,
                "password": loginModel.value.password
            }).then(res => {
                console.log(res)
                if (res.status === 200) {
                    if (res.data.code === 200) {
                        message.success('登录成功')
                        localStorage.setItem('token', res.data.data.token)
                        localStorage.setItem('uid', res.data.data.uid)
                        userstore.curUser.value = res.data.data.uid.toString()
                        teamstore.curTeam.value = res.data.data.privateTid.toString()
                        privateTid = res.data.data.privateTid.toString()
                        axiosStore.updateAuthorizationHeader(res.data.data.token) 
                        console.log(axios.defaults)
                        flag = true
                    } else {
                        message.warning(res.data.message)
                    }
                } else {
                    message.error("网络错误")
                }
            }).finally(() => {
                if (flag) {
                    router.push('/team/private' + privateTid + '/projectmanage')
                }
            }
            )
        } else {
            message.warning("请完善信息")
        }
    })
}

const isRegisterButtonDisabled = ref(false);
const registerButtonText = ref('发送验证码');
const registerCountdown = ref(60);

const submitRegisterCaptcha = () => {
    if (emailPattern.test(registerModel.value.email ? registerModel.value.email : '')) {
        if (!isRegisterButtonDisabled.value) {
            isRegisterButtonDisabled.value = true;
            registerCountdown.value = 60;
            registerButtonText.value = `${registerCountdown.value} 秒后可重试`;

            const intervalId = setInterval(() => {
                registerCountdown.value--;
                registerButtonText.value = `${registerCountdown.value} 秒后可重试`;

                if (registerCountdown.value === 0) {
                    clearInterval(intervalId);
                    isRegisterButtonDisabled.value = false;
                    registerButtonText.value = '发送验证码';
                }
            }, 1000);
        }
        axios.post("/user/sendCaptcha", {
            email: registerModel.value.email
        }).then(res => {
            if (res.status === 200) {
                if (res.data.code === 200) {
                    message.success('发送成功')
                } else {
                    message.warning(res.data.message)
                }
            } else {
                message.error("网络错误")
            }
        })
    } else {
        message.warning('请填写邮箱')
    }
};

const register = (e: MouseEvent) => {
    e.preventDefault()
    registerFormRef.value?.validate((errors) => {
        if (!errors) {
            axios.post('/user/register', {
                "username": registerModel.value.username,
                "password": registerModel.value.password,
                "confirmPassword": registerModel.value.repeatPassword,
                "phone": registerModel.value.phone,
                "name": registerModel.value.name,
                "email": registerModel.value.email,
                "captcha": registerModel.value.captcha,
                // "avatar": "schihefuihweoifh"
            }).then(res => {
                console.log(res)
                if (res.status === 200) {
                    if (res.data.code === 200) {
                        message.success('注册成功')
                        location.reload();
                    } else {
                        message.warning(res.data.message)
                    }
                } else {
                    message.error("网络错误")
                }
            }).catch(_err => {

            }).finally()

        }
    })
}

const isForgetButtonDisabled = ref(false);
const forgetButtonText = ref('发送验证码');
const forgetCountdown = ref(60);

const submitForgetCaptcha = () => {
    if (emailPattern.test(forgetModel.value.email ? forgetModel.value.email : '')) {
        if (!isForgetButtonDisabled.value) {
            isForgetButtonDisabled.value = true;
            forgetCountdown.value = 60;
            forgetButtonText.value = `${forgetCountdown.value} 秒后可重试`;

            const intervalId = setInterval(() => {
                forgetCountdown.value--;
                forgetButtonText.value = `${forgetCountdown.value} 秒后可重试`;

                if (forgetCountdown.value === 0) {
                    clearInterval(intervalId);
                    isForgetButtonDisabled.value = false;
                    forgetButtonText.value = '发送验证码';
                }
            }, 1000);
        }
        axios.post("/user/sendCaptcha", {
            email: forgetModel.value.email
        }).then(res => {
            if (res.status === 200) {
                if (res.data.code === 200) {
                    message.success('发送成功')
                } else {
                    message.warning(res.data.message)
                }
            } else {
                message.error("网络错误")
            }
        })
    } else {
        message.error('请先填写邮箱')
    }

};

const forget = (e: MouseEvent) => {
    e.preventDefault()
    frogetFormRef.value?.validate((errors) => {
        console.log(forgetModel.value)
        if (!errors) {
            axios.post("/user/pwdFind", {
                "email": forgetModel.value.email,
                "captcha": forgetModel.value.captcha,
                "newPassword": forgetModel.value.password,
            }).then(res => {
                console.log(res)
                if (res.status === 200) {
                    if (res.data.code === 200) {
                        message.success('找回成功')
                        location.reload();
                    } else {
                        message.warning(res.data.message)
                    }
                } else {
                    message.error("网络错误")
                }
            })
        }
    })
}

</script>


  