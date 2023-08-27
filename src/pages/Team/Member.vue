<template>
    <div class="member-container">
        <div class="member-top">
            <n-h2>成员管理</n-h2>
            <div class="member-top-bottom">
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
import { onMounted, ref, Ref } from 'vue'
import { useMessage } from 'naive-ui';
import { useRoute } from 'vue-router';

import { MemberRowData } from '@/interfaces/Member/MemberTable.interface'
import { columns, paginationRef, handlePageChange } from '@/components/Member/MemberTable.vue'
import { menuOptions } from '@/components/Member/MemberMenu.vue';
import AddMemberModal from '@/components/Member/AddMemberModal.vue'
import axios from '@/axios/axios';

const showModal = ref(false)
const route = useRoute()
const tid = route.params.tid

// 用于筛选数据
const data: Ref<MemberRowData[]> = ref([])
const preData: Ref<MemberRowData[]> = ref([])


// 前后端逻辑
onMounted(() => {
    console.log("member table mounted");
    axios.post('team/viewUser', {
        tid: tid
    }).then(res => {
        if (res.status === 200) {
            if (res.data.code === 200) {
                console.log(res.data);
                
                data.value = res.data.data.userlist.map((item : any) => {
                    return {
                        key: item.uid,    // uid
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