<template>
    <div class="layout">
        <TeamHeader />
        <div class="bottom">
            <div class="leftSideNav">
                <div class="leftSideNavMenu">
                    <n-menu v-model:options="menuOptions" :render-label="renderMenuLabel" />
                </div>
            </div>
            <div class="main">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { NIcon, useMessage } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import {
    BookOutline as BookIcon,
    FlashOutline as FlashOutline,
    Document
} from '@vicons/ionicons5'
import { storeToRefs } from 'pinia';
import { useTeamStore } from '@/store/teamStore'
import { useProjectStore } from '@/store/projectStore'
import { h, Component, watch, ref, Ref, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import TeamHeader from '@/components/TeamHeader.vue'
import axios from '@/axios/axios';


//侧边栏部分
function renderIcon(icon: Component) {
    return () => h(NIcon, null, { default: () => h(icon) })
}
const route = useRoute()


const teamStore = useTeamStore();
const teamstore = storeToRefs(teamStore);
const projectStore = useProjectStore();
const projectstore = storeToRefs(projectStore);
const tid = ref(route.params.tid.toString())
const message = useMessage()

onMounted(() => {
    menuOptions.value = [
        {
            label: '成员管理',
            key: 'member_management',
            href: '/team/' + tid.value + '/member',
            icon: renderIcon(BookIcon),
        },
        {
            label: '团队设置',
            key: 'team_setting',
            href: '/team/' + tid.value + '/setting',
            icon: renderIcon(BookIcon),
        },
        {
            key: 'header-divider',
            type: 'divider'
        },
        {
            label: '项目空间',
            key: 'project_space',
            href: '/team/' + tid.value + '/projectmanage',
            icon: renderIcon(FlashOutline),
        },
    ]
    axios.post('project/viewProject', {
        tid: tid.value
    }).then(res => {
        if (res.status === 200) {
            if (res.data.code === 200) {
                res.data.data.projectlist?.map((item: any) => {
                    menuOptions.value.push({
                        label: item.project_name,
                        key: item.pid,
                        href: '/team/' + tid.value + '/project/' + item.pid,
                        icon: renderIcon(Document),
                    })
                })
            } else {
                message.warning(res.data.message)
            }
        }
    })
})

watch(projectstore.projectChanged, () => {
    menuOptions.value = [
        {
            label: '成员管理',
            key: 'member_management',
            href: '/team/' + tid.value + '/member',
            icon: renderIcon(BookIcon),
        },
        {
            label: '团队设置',
            key: 'team_setting',
            href: '/team/' + tid.value + '/setting',
            icon: renderIcon(BookIcon),
        },
        {
            key: 'header-divider',
            type: 'divider'
        },
        {
            label: '项目空间',
            key: 'project_space',
            href: '/team/' + tid.value + '/projectmanage',
            icon: renderIcon(FlashOutline),
        },
    ]
    axios.post('project/viewProject', {
        tid: tid.value.replace('private', '')
    }).then(res => {
        if (res.status === 200) {
            if (res.data.code === 200) {
                res.data.data.projectlist?.map((item: any) => {
                    menuOptions.value.push({
                        label: item.project_name,
                        key: item.pid,
                        href: '/team/' + tid.value + '/project/' + item.pid,
                        icon: renderIcon(Document),
                    })
                })
            } else {
                message.warning(res.data.message)
            }
        }
    })
})

watch(teamstore.teamChanged, (_newTeamstore, _oldTeamstore) => {
    tid.value = teamstore.curTeam.value
    menuOptions.value = [
        {
            label: '成员管理',
            key: 'member_management',
            href: '/team/' + tid.value + '/member',
            icon: renderIcon(BookIcon),
        },
        {
            label: '团队设置',
            key: 'team_setting',
            href: '/team/' + tid.value + '/setting',
            icon: renderIcon(BookIcon),
        },
        {
            key: 'header-divider',
            type: 'divider'
        },
        {
            label: '项目空间',
            key: 'project_space',
            href: '/team/' + tid.value + '/projectmanage',
            icon: renderIcon(FlashOutline),
        },
    ]
    axios.post('project/viewProject', {
        tid: tid.value.replace('private', '')
    }).then(res => {
        if (res.status === 200) {
            if (res.data.code === 200) {
                res.data.data.projectlist?.map((item: any) => {
                    menuOptions.value.push({
                        label: item.project_name,
                        key: item.pid,
                        href: '/team/' + tid.value + '/project/' + item.pid,
                        icon: renderIcon(Document),
                    })
                })
            } else {
                message.warning(res.data.message)
            }
        }
    })
})

const menuOptions: Ref<any[]> = ref([
])

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