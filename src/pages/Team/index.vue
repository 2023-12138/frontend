<template>
    <div class="layout">
        <TeamHeader />
        <div class="bottom">
            <div class="leftSideNav">
                <div class="leftSideNavHeader">
                    <span class="leftSideNavHeaderTop">
                        当前团队
                    </span>
                    <span>
                        {{ teamName }}
                    </span>
                </div>
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
import { storeToRefs } from 'pinia';
import { useTeamStore } from '@/store/teamStore'
import { useProjectStore } from '@/store/projectStore'
import { h, Component, watch, ref, Ref, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import TeamHeader from '@/components/TeamHeader.vue'
import axios from '@/axios/axios';
import { GlobePerson20Regular, PeopleTeam16Filled } from '@vicons/fluent';
import Box from '@vicons/tabler/es/Box';
import { MdSettings } from '@vicons/ionicons4';


//侧边栏部分
function renderIcon(icon: Component) {
    return () => h(NIcon, null, { default: () => h(icon) })
}
const route = useRoute()


const teamStore = useTeamStore();
const teamstore = storeToRefs(teamStore);
const teamName = ref('个人空间')
const projectStore = useProjectStore();
const projectstore = storeToRefs(projectStore);
const tid = ref<String>(route.params.tid.toString())
const isPrivate = ref(tid.value.startsWith('private'))
const message = useMessage()

const refreshMenu = () => {
    tid.value = tid.value.toString()
    isPrivate.value = tid.value.toString().startsWith('private')
    menuOptions.value = isPrivate.value ? 
    [
        {
            label: '个人空间',
            key: 'team_setting',
            href: '/team/' + tid.value + '/setting',
            icon: renderIcon(GlobePerson20Regular),
        },
        {
            label: '项目空间',
            key: 'project_space',
            href: '/team/' + tid.value + '/projectmanage',
            icon: renderIcon(Box),
        },
    ] : 
    [
        {
            label: '成员管理',
            key: 'member_management',
            href: '/team/' + tid.value + '/member',
            icon: renderIcon(PeopleTeam16Filled),
        },
        {
            label: '团队设置',
            key: 'team_setting',
            href: '/team/' + tid.value + '/setting',
            icon: renderIcon(MdSettings),
        },
        {
            key: 'header-divider',
            type: 'divider'
        },
        {
            label: '项目空间',
            key: 'project_space',
            href: '/team/' + tid.value + '/projectmanage',
            icon: renderIcon(Box),
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
                        icon: renderIcon(null as any),
                    })
                })
            } else {
                message.warning(res.data.message)
            }
        }
    })
}

onMounted(() => {
    console.log('onMounted hook executed');
    tid.value = route.params.tid.toString()
    refreshMenu()
})

watch(projectstore.projectChanged, () => {
    refreshMenu()
})

watch(teamstore.teamChanged, (_newTeamstore, _oldTeamstore) => {
    tid.value = teamstore.curTeam.value
    console.log(tid.value)
    teamName.value = teamstore.curTeamName.value
    console.log(teamName.value)
    refreshMenu()
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
    background-color: #ebf7ffee;
}
.leftSideNavHeader {
    height: 13%;
    padding: 10px;
    margin: 10px;
    /* background-color: rgba(139, 223, 251, 0.867); */
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    /* border-bottom: var(--primary-color) solid;
    border-bottom-width: 3px; */
    &:hover{
        background-color: #eeee;
        transition: 0.2s background-color linear;
    }

    > span:first-child {
        height: 60%;
        font-size: large;
        font-family: "Microsoft Yahei";
    }
    span {
        margin: 10px;
    }
}
.leftSideNavMenu {
    padding: 10px; 

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