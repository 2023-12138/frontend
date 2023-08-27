<template>
    <div class="header">
        <div style="display: flex;">
            <Logo />
            <n-divider vertical style="height:40px ;margin-left: 20px;" />
            <label style="font-size: x-large; text-align: center;margin-left: 20px;color: white;">{{ header_title }}</label>
        </div>
        <ul class="router">
            <li>
                <n-button class="route" strong tertiary @click="routeGo('/test')">
                    测试
                </n-button>
            </li>
            <li>
                <n-button class="route" strong tertiary @click="routeGo('/team/1/member')">
                    team
                </n-button>
            </li>
            <li>
                <n-button class="route" strong tertiary @click="routeGo('/login')">
                    登录
                </n-button>
            </li>
        </ul>
    </div>
</template>

<script setup lang='ts'>
import { useRouter } from 'vue-router';
import Logo from '@/components/Logo.vue'

const router = useRouter()
defineProps<{ header_title: string }>()

const routeGo = (path: string) => {
    router.push(path)
}

</script>

<style scoped>
.header {
    background-color: #45b8ff;
    width: 100%;
    height: 70px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.router {
    display: flex
}

.route {
    margin-right: 30px;
    height: 50px;
    width: 100px;
    border-radius: 10px;
    color: rgb(238, 234, 234);
}

#logo {
    margin-left: 30px;
}
</style>