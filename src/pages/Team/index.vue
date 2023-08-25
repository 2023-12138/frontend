<template>
    <div class="layout">
        <div class="topNav">
            <div class="topNavLeft">
                <Logo></Logo>
                <span class="leftSideNavTopTitie">融创云开发</span>
            </div>
            <div class="topNavRight">
                <!-- <n-input 
                placeholder="搜索" 
                class="search" 
                size="large"
                round
                >
                    <template #prefix>
                        <n-icon :component="FlashOutline" />
                    </template>
                </n-input> -->
                <div class="topNavRightIcon">
                    <n-icon size="25" :component="MessageCircle" />
                </div>

                <n-dropdown trigger="click" :options="avatarOptions" :show-arrow="true" size="huge"
                    @select="avatarHandleSelect" style="border-radius: 9px;width: 200px;">
                    <div class="topNavRightIcon">
                        <n-icon size="25" :component="BellRegular" />
                    </div>
                </n-dropdown>
                
                <div class="avatar">
                    <n-config-provider :theme-overrides="avatarDropdownThemeOverrides">
                        <n-dropdown trigger="click" :options="avatarOptions" :show-arrow="true" size="huge"
                            @select="avatarHandleSelect" style="border-radius: 9px;width: 200px;">
                            <n-avatar round :size="40" src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" />
                        </n-dropdown>
                    </n-config-provider>
                </div>
            </div>
        </div>
        <div class="bottom">
            <div class="leftSideNav">

                <div class="leftSideNavMenu">
                    <n-menu 
                    :options="menuOptions" 
                    :default-expanded-keys="defaultExpandedKeys" 
                    />
                </div>
            </div>
            <div class="main">

            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { NIcon, useMessage, NAvatar, NText, NConfigProvider } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import {
    BookOutline as BookIcon,
    // FlashOutline as FlashOutline,
} from '@vicons/ionicons5'
import { BellRegular } from '@vicons/fa'

import { h, Component } from 'vue'
import { RouterLink } from 'vue-router'

import Logo from '@/components/Logo.vue';
import { MessageCircle } from '@vicons/tabler'

//侧边栏部分
function renderIcon(icon: Component) {
    return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions: MenuOption[] = [
    {
        label: () => h(
            RouterLink,
            {
                to:{path:'/test'}
            },
            {
                default: () => '人员管理'
            }
        ),
        key: 'member_management',
        icon: renderIcon(BookIcon),
    },
    {
        label: () => h(
            RouterLink,
            {
                to:{path:'/test'}
            },
            {
                default: () => '团队设置'
            }
        ),
        key: 'team——settings',
        icon: renderIcon(BookIcon),
    },
    {
        key: 'header-divider',
        type: 'divider'
    },
    {
        label: () => h(
            RouterLink,
            {
                to:{path:'/test'}
            },
            {
                default: () => '项目空间'
            }
        ),
        key: 'project_space',
        icon: renderIcon(BookIcon),
    },
    
]

const defaultExpandedKeys = 'project_space'


//顶部头像下拉框功能
function renderCustomHeader() {
    return h(
        'div',
        {
            style: 'display: flex; align-items: center; padding: 8px 12px;'
        },
        [
            h(NAvatar, {
                round: true,
                style: 'margin-right: 12px;',
                src: 'https://07akioni.oss-cn-beijing.aliyuncs.com/demo1.JPG'
            }),
            h('div', null, [
                h('div', null, [h(NText, { depth: 2 }, { default: () => '用户名' })]),
                h('div', { style: 'font-size: 12px;' }, [
                    h(
                        NText,
                        { depth: 3 },
                        { default: () => '当前所在团队' }
                    )
                ])
            ])
        ]
    )
}

const avatarOptions = [
    {
        key: 'header',
        type: 'render',
        render: renderCustomHeader
    },
    {
        key: 'header-divider',
        type: 'divider'
    },
    {
        label: '处理群消息 342 条',
        key: 'stmt1'
    },
    {
        label: '被 @ 58 次',
        key: 'stmt2'
    },
    {
        label: '加入群 17 个',
        key: 'stmt3'
    }
]

const message = useMessage()

function avatarHandleSelect(key: string | number) {
    message.info(String(key))
}

const avatarDropdownThemeOverrides = {
    "Dropdown": {
        "borderRadius": "9px"
    }
}

//顶部消息通知功能

</script>

<style scoped>

/* 顶部导航 */
.topNav {
    /* width: 100%; */
    height: 100px;
    background-color: #ccc;
    display: flex;
    justify-content: space-between;
    align-items: center;

    ::v-deep(.n-input-wrapper) {
        width: 500px;
    }
}

.topNavLeft {
    /* background-color: red; */
    width: 15%;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.topNavRight {
    width: 85%;
    height: 100%;
    /* background-color: blue; */
    display: flex;
    justify-content: end;
    align-items: center;
}

.topNavRightIcon {
    height: 40px;
    width: 40px;
    display: flex;
    justify-content:center;
    align-items:center ;
    margin-right: 20px;
}

.search {
    margin-left: 3%;
    width: 50%;
}

.avatar {
    margin-right: 1.5%;
}

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



.leftSideNavTopTitie {
    margin-left: 15px;
    letter-spacing: 3px;
    font-family: '宋体', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    font-weight: bolder;
    font-size: 20px;
}

.leftSideNavMenu {
    ::v-deep(.n-menu-item) {
        margin-top: 6px;
    }
    ::v-deep(.n-menu-divider){
        --n-divider-color: rgb(216 229 215);
        height:2px;
        margin:6px 5px;
    }
}

/* 主窗口 */
.main {
    width: 85%;
    height: 100%;
    background-color: green;
}
</style>