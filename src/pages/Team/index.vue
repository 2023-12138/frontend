<template>
    <div class="layout">
        <TeamHeader />
        <div class="bottom">
            <div class="leftSideNav">
                <div class="leftSideNavMenu">
                    <n-menu :options="menuOptions" :render-label="renderMenuLabel"/>
                </div>
            </div>
            <div class="main">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { NIcon } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import {
    BookOutline as BookIcon,
    FlashOutline as FlashOutline,
} from '@vicons/ionicons5'


import { h, Component } from 'vue'
import {RouterLink} from 'vue-router'

import TeamHeader from '@/components/TeamHeader.vue'

//侧边栏部分
function renderIcon(icon: Component) {
    return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions: MenuOption[] = [
    {
        label: '成员管理',
        key: 'member_management',
        href:'/team/member',
        icon: renderIcon(BookIcon),
    },
    {
        label: '团队设置',
        key: 'team——settings',
        href:'/test',
        icon: renderIcon(BookIcon),
    },
    {
        key: 'header-divider',
        type: 'divider'
    },
    {
        label: '项目空间',
        key: 'project_space',
        href:'/test',
        icon: renderIcon(FlashOutline),
    },
    
]

function renderMenuLabel (option: MenuOption) {
    if ('href' in option) {
    return h(
        RouterLink as any,
        { to: option.href },
        option.label as string
    )
    }
    return option.label as string
}

</script>

<style scoped>



/* 侧边栏导航 */
.bottom {
    height: calc(100vh - 100px);
    display: flex;
    /* background-color: #aaa; */
}

.leftSideNav {
    width: 15%;
    height: 100%;
    /* background-color: black; */
}

.leftSideNavMenu {
    ::v-deep(.n-menu-item) {
        margin-top: 6px;
    }
    ::v-deep(.n-menu-divider){
        /* --n-divider-color: rgb(216 229 215); */
        --n-divider-color:var(--primary-color);
        height:2px;
        margin:6px 5px;
    }
}

/* 主窗口 */
.main {
    width: 85%;
    height: 100%;
}

</style>