<template>
    <div class="layout">
        <div class="leftSideNav">
            <div class="leftSideNavTop">
                <Logo></Logo>
                <span class="leftSideNavTopTitie">融创云开发</span>
            </div>
            <div class="leftSideNavMenu">
                <n-menu 
                :options="menuOptions" 
                :default-expanded-keys="defaultExpandedKeys" 
                collapsed-width=100
                />
            </div>
        </div>
        <div class="rightPart">
            <div class="topNav">
                <n-input 
                placeholder="搜索" 
                class="search" 
                size="large"
                round
                >
                    <template #prefix>
                        <n-icon :component="FlashOutline" />
                    </template>
                </n-input>

                <div class="avatar">
                    <n-dropdown
                        trigger="click" 
                        :options="avatarOptions" 
                        :show-arrow="true"
                        size="huge"
                        @select="avatarHandleSelect"
                    >
                        <n-avatar 
                            round
                            :size="55"
                            src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
                        />
                    </n-dropdown>
                </div>
            </div>
            <div class="main">

            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { NIcon, useMessage, NAvatar, NText } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import { h, Component } from 'vue'
import {
    BookOutline as BookIcon,
    FlashOutline as FlashOutline,
} from '@vicons/ionicons5'

import Logo from '@/components/Logo.vue';

//侧边栏部分
function renderIcon(icon: Component) {
    return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions: MenuOption[] = [
    {
        label: '成员管理',
        key: 'member_management',
        icon: renderIcon(BookIcon),
    },
    {
        label: '我的消息',
        key: 'my_chats',
        icon: renderIcon(BookIcon),
    },
    {
        label: '项目空间',
        key: 'project_space',
        icon: renderIcon(BookIcon),
        children: [
            {
                label: '人物',
                key: 'people',
            }
        ]
    }
]

const defaultExpandedKeys = 'project_space'

//顶部头像下拉框功能
function renderCustomHeader () {
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
</script>

<style scoped>
.layout {
    display: flex;
}

.leftSideNav {
    width: 15%;
    height: 100vh;
    /* background-color: black; */
}

.leftSideNavTop {
    background-color: red;
    width: 100%;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.leftSideNavTopTitie {
    margin-left: 15px;
    letter-spacing: 3px;
    font-family: '宋体', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    font-weight: bolder;
    font-size: 20px;
}

.leftSideNavMenu {
    ::v-deep(.n-menu-item){
        margin-top: 6px;
    }
}

.rightPart {
    width: 85%;
    display: flex;
    flex-direction: column;
}

.topNav {
    width: 100%;
    height: 100px;
    background-color: blue;
    display: flex;
    justify-content: space-between;
    align-items: center;

    ::v-deep(.n-input-wrapper){
        width: 500px;
    }
}

.search {
    margin-left: 3%;
    width: 50%;
}

.avatar {
    margin-right: 1.5%;
}


.main {
    width: 100%;
    height: 100%;
    background-color: green;
}
</style>