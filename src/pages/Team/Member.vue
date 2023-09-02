<template>
    <div class="member-container">
        <div class="member-top">
            <n-h2>成员管理</n-h2>
            <div v-if="showButton" class="member-top-bottom">
                <span>当前团队共{{ data.length }}人</span>
                <n-button type="primary" @click="showModal = true">添加成员</n-button>
                <AddMemberModal v-model:show="showModal"></AddMemberModal>
            </div>
        </div>
        <div class="member-bottom">
            <div class="member-bottom-top">
                <n-menu :options="menuOptions" mode="horizontal" @update:value="handleUpdateValue" />
            </div>
            <div class="content">
                <n-data-table :key="(row: any) => row.key" :columns="columns" :data="preData" :pagination="paginationRef"
                    @update:page="handlePageChange"
                    size="small" />
            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { onMounted, ref, Ref, watch } from 'vue'
import { MenuOption, useMessage } from 'naive-ui';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useTeamStore } from '@/store/teamStore'

import { MemberRowData } from '@/interfaces/Member/MemberTable.interface'
import AddMemberModal from '@/components/Member/AddMemberModal.vue'
import axios from '@/axios/axios';

const teamStore = useTeamStore();
const teamstore = storeToRefs(teamStore);

watch(teamstore.teamChanged, (_newTeamstore, _oldTeamstore) => {
    if (teamstore.curTeam.value.toString() !== '-1') {
        tid.value = teamstore.curTeam.value.toString()
    }

    axios.post('team/viewUser', {
        tid: tid.value.replace('private', '')
    }).then(res => {
        if (res.status === 200) {
            if (res.data.code === 200) {
                data.value = res.data.data.userlist.map((item: any) => {
                    return {
                        key: tid.value + '.' + item.uid,    // tid + uid
                        name: item.name,
                        phone: item.phone,
                        email: item.email,
                        username: item.username,
                        option: '',
                        rank: item.status === '2' ? '协作成员' : (item.status === '1' ? '管理员' : '创建者'),
                        isEditing: false,
                    }
                })
                preData.value = data.value
            } else {
                message.warning(res.data.message)
            }
        } else {
            message.error('服务器错误')
        }
    })
})

const showModal = ref(false)
const route = useRoute()
const tid = ref<string>(route.params.tid.toString())
const showButton = ref<boolean>(!(tid.value.toString().startsWith('private')))
// 用于筛选数据
const data: Ref<MemberRowData[]> = ref([])
const preData: Ref<MemberRowData[]> = ref([])


// 前后端逻辑
onMounted(() => {
    console.log("member table mounted");
    const routePid = route.params.tid.toString()
    teamstore.curTeam.value = routePid
    axios.post('team/viewUser', {
        tid: teamstore.curTeam.value.toString()
    }).then(res => {
        if (res.status === 200) {
            if (res.data.code === 200) {
                data.value = res.data.data.userlist.map((item: any) => {
                    return {
                        key: teamstore.curTeam.value.toString() + '.' + item.uid,    // tid + uid
                        name: item.name,
                        phone: item.phone,
                        email: item.email,
                        username: item.username,
                        option: '',
                        rank: item.status === '2' ? '协作成员' : (item.status === '1' ? '管理员' : '创建者'),
                        isEditing: false,
                    }
                })
                preData.value = data.value
            } else {
                message.warning(res.data.message)
            }
        } else {
            message.error('服务器错误')
        }
    })
})

const message = useMessage()
const handleUpdateValue = (key: string) => {
    if (key === 'all-member') {
        preData.value = data.value
    } else if (key === 'manager') {
        preData.value = data.value.filter(item => item.rank !== '协作成员')
    } else if (key === 'normal-member') {
        preData.value = data.value.filter(item => item.rank === '协作成员')
    }
}


import { NSelect, NIcon } from "naive-ui";
import { computed, h, Component } from "vue";
import DeleteConfirm from '@/components/Member/MemberDeleteConfirm.vue'
import { Column } from '@/interfaces/Member/MemberTable.interface'
import {
    PersonOutline as PersonIcon,
    HomeOutline as HomeIcon
} from '@vicons/ionicons5'

const renderIcon = (icon: Component) => {
    return () => h(NIcon, null, { default: () => h(icon) })
}


const menuOptions: MenuOption[] = [
    {
        label: '全部成员',
        key: 'all-member',
        icon: renderIcon(HomeIcon)
    },
    {
        key: 'divider',
        type: 'divider'
    },
    {
        label: '管理员',
        key: 'manager',
        icon: renderIcon(PersonIcon)
    },
    {
        label: '普通成员',
        key: 'normal-member',
        icon: renderIcon(PersonIcon)
    }
]
const options = [{
    label: '管理员',
    value: '管理员'
},
{
    label: '协作成员',
    value: '协作成员'
}]

const columns: Column[] = [
    {
        title: '昵称',
        key: 'username',
        width: 120,
        render(row: MemberRowData) {
            return h('div', {
                style: 'min-height: 22px',
            }, row.username)
        }
    },
    {
        title: '姓名',
        key: 'name',
        width: 100,
        render(row: MemberRowData) {
            return h('div', {
                style: 'min-height: 22px',
            }, row.name)
        }
    },
    {
        title: '手机',
        key: 'phone',
        width: 130,
        render(row: MemberRowData) {
            return h('div', {
                style: 'min-height: 22px',
            }, row.phone)
        }
    },
    {
        title: '邮箱',
        key: 'email',
        width: 250,
        render(row: MemberRowData) {
            return h('div', {
                style: 'min-height: 22px',
            }, row.email)
        }
    },
    {
        title: '企业身份',
        key: 'rank',
        width: 150,
        render(row: MemberRowData) {
            return row.rank !== '创建者' ? h(NSelect as any, {
                options: options,
                value: row.rank,
                onUpdateValue: (v: string) => {
                    if (v === '管理员') {
                        axios.post("team/addAdmin", {
                            tid: row.key.split('.')[0],
                            uid: row.key.split('.')[1]
                        }).then(res => {
                            if (res.status === 200) {
                                if (res.data.code === 200) {
                                    message.success('修改成功')
                                    row.rank = v
                                } else {
                                    message.warning(res.data.message)
                                }
                            } else {
                                message.error('服务器错误')
                            }
                        })
                    } else {
                        axios.post("team/removeAdmin", {
                            tid: row.key.split('.')[0],
                            uid: row.key.split('.')[1]
                        }).then(res => {
                            if (res.status === 200) {
                                if (res.data.code === 200) {
                                    message.success('修改成功')
                                    row.rank = v
                                } else {
                                    message.warning(res.data.message)
                                }
                            } else {
                                message.error('服务器错误')
                            }
                        })
                    }
                }
            }) : h(NSelect as any, {
                disabled: true,
                value: row.rank
            })
        }
    },
    {
        title: '',
        key: 'option',
        render(row: MemberRowData) {
            if (row.rank !== '创建者') {
                return h(DeleteConfirm, {
                    buttonText: '删除',
                    id: row.key,
                });
            } else {
                return h('span'); // 返回一个空的 <span> 元素作为占位符
            }
        }
    }
]

// page

const page: Ref<number> = ref(1)
const handlePageChange = (curPage: number): void => {
    page.value = curPage
}
const paginationRef: Ref<{ pageSize: number; page: number }> = computed(() => ({
    pageSize: 6,
    page: page.value
}))

</script>
  
<style scoped>
.member-container {
    display: flex;
    flex-direction: column;
    padding: 20px;
}

.member-top .member-top-bottom {
    display: flex;
    justify-content: space-between;
    margin: 10px;
}

.member-bottom {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
}

.member-bottom-top {
    width: 100%;
    border: 1px solid;
    border-radius: 2px;
    border-color: var(--primary-color);
}

.content {
    width: 100%;
}
</style>