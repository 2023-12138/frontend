<template>
    <div class="header">
        <n-icon id="logo" size="40" color="#0e7a0d">
            <game-controller />
        </n-icon>
        <ul class="router">
            <li>
                <n-button class="route" strong secondary type="info" @click="routeGo('/test')">
                    测试
                </n-button>
            </li>
            <li>
                <n-button class="route" strong secondary type="info" @click="routeGo('/login')">
                    登录
                </n-button>
            </li>
            <li>
                <n-button class="route" strong secondary type="info" @click="routeGo('/test')">
                    测试
                </n-button>
            </li>
            <li>
                <n-button class="route" strong secondary type="info" @click="routeGo('/test')">
                    测试
                </n-button>
            </li>
        </ul>
    </div>
</template>

<script setup lang='ts'>

import { GameController } from '@vicons/ionicons5'
import { useRouter } from 'vue-router';

const router = useRouter()

const routeGo = (path:string) => {
    router.push(path)
}

</script>

<style scoped>
.header {
    background-color: #ccc;
    width: 100%;
    height: 70px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.router {
    display: flex;

}

.route {
    margin-right: 30px;
    height: 50px;
    width: 100px;
}
#logo {
    margin-left: 30px;
}
</style>