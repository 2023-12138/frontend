<template>
    <div class="member-container">
        <div class="member-top">
            <n-h2>成员管理</n-h2>
            <div class="member-top-bottom">
                <span>当前团队共{{ data.length }}人</span>
                <n-button type="primary">添加成员</n-button>
            </div>
        </div>
        <div class="member-bottom">
            <div class="sider">
                <n-menu :options="menuOptions" @update:value="handleUpdateValue" />
            </div>
            <div class="content">
                <n-data-table :key="(row: any) => row.key" :columns="columns" :data="data" :pagination="paginationRef"
                    @update:page="handlePageChange" />
            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { ref, Ref } from 'vue'
import { RowData } from '@/interfaces/Member/MemberTable.interface'
import { columns, paginationRef, handlePageChange } from '@/components/Member/MemberTable.vue'
import { menuOptions }  from '@/components/Member/MemberMenu.vue';
import { useMessage } from 'naive-ui';
// 测试用
const createData = (): RowData[] =>
    Array.from({ length: 100 }).map((_, index) => ({
        key: index,
        name: `John Brown ${index}`,
        phone: ((Math.random() * 40) | 0).toString(),
        email: `New York No. ${index} Lake Park`,
        username: '嘻嘻',
        option: 'option',
        rank: index === 0 ? '创建者' : '管理员',
        isEditing: false
    }))

const data: Ref<RowData[]> = ref(createData())
// 用于筛选数据
// const preData = data

// 前后端逻辑
// const getDataIndex = (key: number): number => {
//     return data.value.findIndex((item) => item.key === key)
// }

const message = useMessage()
const handleUpdateValue = (key: string) => {
    message.info('[onUpdate:value]: ' + JSON.stringify(key))
}
</script>
  
<style scoped>
.member-container {
    display: flex;
    flex-direction: column;
    padding: 50px;
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
  @/interfaces/Member/MemberMenu.interface@/interfaces/Member/MemberTable.interface