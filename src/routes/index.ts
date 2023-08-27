import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: () => import('../pages/Home.vue')
    },
    {
        path: '/test',
        component: () => import('../components/HelloWorld.vue')
    },
    {
        path: '/team/:tid',
        component: () => import('../pages/Team/index.vue'),
        children: [
            {
                path: 'setting',
                component: () => import('../pages/Team/Setting.vue')
            },
            {
                path: 'member',
                component: () => import('../pages/Team/Member.vue')
            },
            {
                path: 'projectmanage',
                component: () => import('../pages/Team/ProjectManage.vue')
            },
            {
                path: 'project/:pid',
                component: () => import('../pages/Team/Project.vue'),
                children: [
                    {
                        path:'doc/:did',
                        component: () => import('../pages/Team/Doc.vue')
                    }
                ]
            }
        ]
    },
    {
        path: '/login',
        component: () => import('../pages/Login.vue')
    },
    {
        path: '/document',
        component: () => import('../pages/Document.vue')
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router