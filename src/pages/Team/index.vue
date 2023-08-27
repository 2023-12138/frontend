<template>
    <div class="layout">
        <TeamHeader />
        <div class="bottom">
            <div class="leftSideNav">
                <div class="leftSideNavMenu">
                    <n-menu :options="menuOptions" :render-label="renderMenuLabel" />
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
    Document
} from '@vicons/ionicons5'
import { storeToRefs } from 'pinia'; 
import { useTeamStore } from '@/store/teamStore'
import { h, Component, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import TeamHeader from '@/components/TeamHeader.vue'


//侧边栏部分
function renderIcon(icon: Component) {
    return () => h(NIcon, null, { default: () => h(icon) })
}
const route = useRoute()
const tid = route.params.tid

const teamStore = useTeamStore();
const teamstore = storeToRefs(teamStore);

watch (teamstore.teamChanged, (_newTeamstore, _oldTeamstore) => {
    location.reload()
})

const menuOptions: MenuOption[] = [
    {
        label: '成员管理',
        key: 'member_management',
        href:'/team/' + tid + '/member',
        icon: renderIcon(BookIcon),
    },
    {
        label: '团队设置',
        key: 'team_setting',
        href:'/team/' + tid + '/setting',
        icon: renderIcon(BookIcon),
    },
    {
        key: 'header-divider',
        type: 'divider'
    },
    {
        label: '项目空间',
        key: 'project_space',
        href:'/team/' + tid + '/projectmanage',
        icon: renderIcon(FlashOutline),
    },
    {
        label: '项目1',
        key: 'project_1',
        href:'/team/' + tid + '/project/2',
        icon: renderIcon(Document),
    },

]

function renderMenuLabel(option: MenuOption) {
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
    height: calc(100vh - 70px);
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

    ::v-deep(.n-menu-divider) {
        /* --n-divider-color: rgb(216 229 215); */
        --n-divider-color: var(--primary-color);
        height: 2px;
        margin: 6px 5px;
    }
}

/* 主窗口 */
.main {
    width: 85%;
    height: 100%;
}
</style>