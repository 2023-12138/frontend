<template>
    <div class="layout">
        <TeamHeader />
        <div class="bottom">
            <div class="leftSideNav" v-if="showMenu">
                <div class="leftSideNavHeader">
                    <span class="leftSideNavHeaderTop">
                        {{ teamName }}
                    </span>
                    <span v-if="showMenu">
                        {{ teamDescription }}
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

import { h, Component, watch, ref, Ref, onMounted, nextTick } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import TeamHeader from '@/components/TeamHeader.vue'
import axios from '@/axios/axios';
import { GlobePerson20Regular, PeopleTeam16Filled } from '@vicons/fluent';
import Box from '@vicons/tabler/es/Box';
import { MdSettings } from '@vicons/ionicons4';

import intro from "@/intro/introConfig";
import { useUserStore } from '@/store/userStore';

const userStore = useUserStore();
const { isNew } = storeToRefs(userStore);
//新手引导
const startIntro = () => {
    nextTick(() => {
        intro.setOptions({
            steps: [
                {
                    title: "欢迎来到.......!",
                    intro: '让我们开始吧！O(∩_∩)O'
                },
                {
                    element: document.querySelector('#intostep1') as HTMLElement, // 定位到相应的元素位置，如果不设置element，则默认展示在屏幕中央
                    title: '这里可以看到自己当前所在的团队', // 标题
                    intro: '当然现在是自己的个人空间啦',
                    position: 'right'
                },
                {
                    element: document.querySelector('#intostep2') as HTMLElement,
                    intro: '在这里可以和你加入的所有团队及其成员聊天',
                    position: 'left'
                },
                {
                    element: document.querySelector('#intostep3') as HTMLElement,
                    intro: '这里会有你的消息通知',
                    position: 'left'
                },
                {
                    element: document.querySelector('#intostep4') as HTMLElement,
                    intro: '在这里可以看到当前团队的所有项目'
                },
                {
                    element: document.querySelector('#intostep5') as HTMLElement,
                    intro: '点击即可创建你的新项目',
                    position: 'left'
                },
                {
                    title: "立即开始体验吧！",
                    intro: '(☆▽☆)'
                },
            ]
        });
        nextTick(() => {
            intro.start();
        })
    })
}
onMounted(() => {
    if (isNew.value) {
        startIntro();
    }
})


//侧边栏部分
function renderIcon(icon: Component) {
    return () => h(NIcon, null, { default: () => h(icon) })
}
const route = useRoute()


const teamStore = useTeamStore();
const teamstore = storeToRefs(teamStore);
const teamName = ref('个人空间')
const teamDescription = ref('个人空间')
const projectStore = useProjectStore();
const projectstore = storeToRefs(projectStore);
const tid = ref<String>(route.params.tid.toString())
const isPrivate = ref(tid.value.startsWith('private'))
const message = useMessage()
const showMenu = ref(!(location.pathname.includes('protopreview') || location.pathname.includes('design')))
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
                if (!isPrivate.value) {
                    teamName.value = res.data.data.teamname
                    teamDescription.value = res.data.data.teaminform
                } else {
                    teamName.value = '个人空间'
                    teamDescription.value = '个人空间'
                }
            } else {
                message.warning(res.data.message)
            }
        }
    })
}

onMounted(() => {
    showMenu.value = (!(location.pathname.includes('protopreview') || location.pathname.includes('design')))
    tid.value = route.params.tid.toString()
    refreshMenu()
})

watch(projectstore.projectChanged, () => {
    refreshMenu()
})

watch(teamstore.teamChanged, (_newTeamstore, _oldTeamstore) => {
    tid.value = teamstore.curTeam.value
    teamName.value = teamstore.curTeamName.value
    refreshMenu()
})

watch(() => route.params, () => {
    showMenu.value = (!(location.pathname.includes('protopreview') || location.pathname.includes('design')))
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
    margin: 10px 10px 0 10px;
    /* background-color: rgba(139, 223, 251, 0.867); */
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    /* border-bottom: var(--primary-color) solid;
    border-bottom-width: 3px; */

    &:hover {
        background-color: #eeee;
        transition: 0.2s background-color linear;
        cursor: pointer;
    }

    >span:first-child {
        height: 60%;
        font-size: large;
        font-family: "Microsoft Yahei";
    }

    span {
        margin: 10px;
    }
}

.leftSideNavMenu {
    padding: 0 10px 0 10px;

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
    width: 100%;
    height: 100%;
}</style>