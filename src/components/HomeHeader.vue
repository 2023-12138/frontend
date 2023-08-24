<template>
    <div class="header">
        <Logo/>
        <ul class="router">
            <li>
                <n-button class="route" strong secondary type="info" @click="routeGo('/test')">
                    测试
                </n-button>
            </li>
            <li>
                <n-button class="route" strong secondary type="info" @click="routeGo('/team')">
                    team
                </n-button>
            </li>
            <!-- <li>
                <n-button class="route" strong secondary type="info" @click="routeGo('/test')">
                    测试
                </n-button>
            </li>
            <li>
                <n-button class="route" strong secondary type="info" @click="routeGo('/test')">
                    测试
                </n-button>
            </li> -->
        </ul>
    </div>
</template>

<script setup lang='ts'>
import { useRouter } from 'vue-router';
import Logo from '@/components/Logo.vue'

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
    border-radius: 10px;
}
#logo {
    margin-left: 30px;
}
</style>