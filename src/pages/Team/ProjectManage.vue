<template>
    <div class="project-container">
        <div class="project-top">
            <n-h2>项目内容</n-h2>
            <div class="project-top-bottom">
                <span>共{{ data.length }}个项目&nbsp; ID: {{ $route.params.tid }}</span>
                <n-button type="primary" @click="showModal=true">添加项目</n-button>
                <CreateProjectModal v-model:show="showModal"/>
            </div>
        </div>
        <div class="project-bottom">
            <div class="content">
                <n-data-table :key="(row: any) => row.key" :columns="columns" :data="data" :pagination="paginationRef"
                    @update:page="handlePageChange" />
            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { ref, Ref } from 'vue'
import { useMessage } from 'naive-ui';

import { ProjectRowData } from '@/interfaces/Project/ProjectTable.interface'
import { columns, paginationRef, handlePageChange } from '@/components/Project/ProjectTable.vue'
import CreateProjectModal from '@/components/Project/CreateProjectModal.vue';

const showModal = ref(false)

// 测试用

const data: Ref<ProjectRowData[]> = ref([])
// 用于筛选数据

// 前后端逻辑
// const getDataIndex = (key: number): number => {
//     return data.value.findIndex((item) => item.key === key)
// }

const message = useMessage()
</script>
  
<style scoped>
.project-container {
    display: flex;
    flex-direction: column;
    padding: 20px;
}

.project-top .project-top-bottom {
    display: flex;
    justify-content: space-between;
    margin: 10px;
}
.project-bottom {

    display: inline-flex;
    flex-direction: row;
}

.content {
    width: 100%;
}
</style>