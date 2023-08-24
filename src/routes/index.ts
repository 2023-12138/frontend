import { createRouter,createWebHistory,RouteRecordRaw } from 'vue-router'

const routes:Array<RouteRecordRaw> = [
    {
        path:'/',
        component:() => import('../pages/Home.vue')
    },
    {
        path:'/test',
        component:() => import('../components/HelloWorld.vue')
    },
    {
        path:'/team',
        component:() => import('../pages/Team/index.vue')
    }
]

const router = createRouter({
    history:createWebHistory(),
    routes
})

export default router