<template>
    <div class="project-container">
        <div class="project-top">
            <n-h2>项目内容</n-h2>
            <div class="project-top-bottom">
                <span>共{{ data.length }}个项目&nbsp; ID: {{ $route.params.tid }}</span>
                <n-button type="primary" @click="showModal = true">添加项目</n-button>
                <CreateProjectModal v-model:show="showModal" />
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
import { onMounted, ref, Ref, watch } from 'vue'
import { useMessage } from 'naive-ui';
import { ProjectRowData } from '@/interfaces/Project/ProjectTable.interface'
import { columns, paginationRef, handlePageChange } from '@/components/Project/ProjectTable.vue'
import CreateProjectModal from '@/components/Project/CreateProjectModal.vue';
import { storeToRefs } from 'pinia';
import { useProjectStore } from '@/store/projectStore'
import { useTeamStore } from '@/store/teamStore'
import axios from '@/axios/axios';
import { useRoute } from 'vue-router';
const showModal = ref(false)

const route = useRoute()
const tid = ref(route.params.tid.toString())
const data: Ref<ProjectRowData[]> = ref([])
// 用于筛选数据

// 前后端逻辑
// const getDataIndex = (key: number): number => {
//     return data.value.findIndex((item) => item.key === key)
// }
const projectStore = useProjectStore();
const projectstore = storeToRefs(projectStore);
const teamStore = useTeamStore();
const teamstore = storeToRefs(teamStore);
const message = useMessage()

watch(projectstore.projectChanged, () => {
    axios.post('project/viewProject', {
        tid: tid.value.replace('private', '')
    }).then(res => {
        if (res.status === 200) {
            if (res.data.code === 200) {
                data.value = res.data.data.projectlist?.map((item: any) => {
                    return {
                        key: tid.value.replace('private', '') + '.' + item.pid,   // pid
                        projectname: item.project_name,
                        description: item.project_inform,
                        creator: item.uid,
                        isEditing: false,
                    }
                })
            } else {
                message.warning(res.data.message)
            }
        } else {
            message.error('服务器错误')
        }
    })
})

watch(teamstore.teamChanged, () => {
    axios.post('project/viewProject', {
        tid: teamstore.curTeam.value.replace('private', '')
    }).then(res => {
        if (res.status === 200) {
            if (res.data.code === 200) {
                data.value = res.data.data.projectlist?.map((item: any) => {
                    return {
                        key: teamstore.curTeam.value.replace('private', '') + '.' + item.pid,   // pid
                        projectname: item.project_name,
                        description: item.project_inform,
                        creator: item.uid,
                        isEditing: false,
                    }
                })
            } else {
                message.warning(res.data.message)
            }
        } else {
            message.error('服务器错误')
        }
    })
})


onMounted(() => {
    axios.post('project/viewProject', {
        tid: tid.value.replace('private', '')
    }).then(res => {
        if (res.status === 200) {
            if (res.data.code === 200) {
                data.value = res.data.data.projectlist?.map((item: any) => {
                    return {
                        key: tid.value.replace('private', '') + '.' + item.pid,   // pid
                        projectname: item.project_name,
                        description: item.project_inform,
                        creator: item.uid,
                        isEditing: false,
                    }
                })
            } else {
                message.warning(res.data.message)
            }
        } else {
            message.error('服务器错误')
        }
    })
})
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