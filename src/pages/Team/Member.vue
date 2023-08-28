<template>
    <div class="member-container">
        <div class="member-top">
            <n-h2>成员管理</n-h2>
            <div v-if="showButton" class="member-top-bottom">
                <span>当前团队共{{ data.length }}人&nbsp; ID: {{ $route.params.tid }}</span>
                <n-button type="primary" @click="showModal = true">添加成员</n-button>
                <AddMemberModal v-model:show="showModal"></AddMemberModal>
            </div>
        </div>
        <div class="member-bottom">
            <div class="sider">
                <n-menu :options="menuOptions" @update:value="handleUpdateValue" />
            </div>
            <div class="content">
                <n-data-table :key="(row: any) => row.key" :columns="columns" :data="preData" :pagination="paginationRef"
                    @update:page="handlePageChange" />
            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { onMounted, ref, Ref, watch } from 'vue'
import { useMessage } from 'naive-ui';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia'; 
import { useTeamStore } from '@/store/teamStore'

import { MemberRowData } from '@/interfaces/Member/MemberTable.interface'
import { menuOptions } from '@/components/Member/MemberMenu.vue';
import AddMemberModal from '@/components/Member/AddMemberModal.vue'
import axios from '@/axios/axios';

const teamStore = useTeamStore();
const teamstore = storeToRefs(teamStore);

watch (teamstore.teamChanged, (_newTeamstore, _oldTeamstore) => {
    tid.value = teamstore.curTeam.value.toString()
    console.log(tid)
    axios.post('team/viewUser', {
        tid: tid.value.replace('private', '')
    }).then(res => {
        if (res.status === 200) {
            if (res.data.code === 200) {                
                data.value = res.data.data.userlist.map((item : any) => {
                    return {
                        key: tid.value + '.' + item.uid ,    // tid + uid
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
    axios.post('team/viewUser', {
        tid: tid.value.replace('private', '')
    }).then(res => {
        if (res.status === 200) {
            if (res.data.code === 200) {                
                data.value = res.data.data.userlist.map((item : any) => {
                    return {
                        key: tid + '.' + item.uid ,    // tid + uid
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


import { NInput, NSelect } from "naive-ui";
import { computed, h, nextTick} from "vue";
import DeleteConfirm from '@/components/Member/DeleteConfirm.vue'
import { Column } from '@/interfaces/Member/MemberTable.interface'

const userNameInputRef = ref()

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
        width: 150,
        render(row: MemberRowData) {
            return row.isEditing ?
                h(NInput as any, {
                    ref: userNameInputRef,
                    value: row.username,
                    onUpdateValue: (v: string) => {
                        row.username = v
                    },
                    onBlur: () => {
                        row.isEditing = false
                        //TODO:前后端
                    },
                }) : h('div', {
                    style: 'min-height: 22px',
                    onClick: () => {
                        row.isEditing = true
                        nextTick(() => {
                            userNameInputRef.value.focus()
                        })
                    }
                }, row.username)
        }
    },
    {
        title: '姓名',
        key: 'name',
        width: 150,
        render(row: MemberRowData) {
            return h('div', {
                style: 'min-height: 22px',
            }, row.name)
        }
    },
    {
        title: '手机',
        key: 'phone',
        width: 150,
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
                    // TODO: row.rank = v
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
    flex-direction: row;
}

.sider {
    width: 20%;
}

.content {
    width: 80%;
}
</style>