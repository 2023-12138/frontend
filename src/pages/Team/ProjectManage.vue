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
                <n-tabs type="line" animated>
                    <n-tab-pane name="project" tab="项目">
                        <n-data-table :key="(row: any) => row.key" :columns="columns" :data="data" :pagination="paginationRef"
                    @update:page="handlePageChange" 
                    />
                    </n-tab-pane>
                    <n-tab-pane name="rubbish bin" tab="回收站">
                        回收站
                    </n-tab-pane>
                </n-tabs>
                
            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { onMounted, ref, Ref, watch } from 'vue'
import { useMessage } from 'naive-ui';
import { ProjectRowData } from '@/interfaces/Project/ProjectTable.interface'
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

// 前后端逻辑
const projectStore = useProjectStore();
const projectstore = storeToRefs(projectStore);
const teamStore = useTeamStore();
const teamstore = storeToRefs(teamStore);
const message = useMessage()

import { NButton, NInput } from "naive-ui";
import { computed, h, nextTick } from "vue";
import { Column } from '@/interfaces/Project/ProjectTable.interface'
import DeleteConfirm from '@/components/Project/DeleteConfirm.vue'
import router from '@/routes';
const projectNameInputRef = ref()
const projectDescriptionInputRef = ref()
const columns: Column[] = [
    {
        title: '项目名称',
        key: 'projectname',
        width: 250,
        render(row: ProjectRowData) {
            return row.isEditing ?
                h(NInput as any, {
                    ref: projectNameInputRef,
                    value: row.projectname,
                    onUpdateValue: (v: string) => {
                        row.projectname = v
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
                            projectNameInputRef.value.focus()
                        })
                    }
                }, row.projectname)
        }
    },
    {
        title: '描述',
        key: 'description',
        width: 450,
        render(row: ProjectRowData) {
            return row.isEditing ?
                h(NInput as any, {
                    ref: projectDescriptionInputRef,
                    value: row.description,
                    onUpdateValue: (v: string) => {
                        row.description = v
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
                            projectDescriptionInputRef.value.focus()
                        })
                    }
                }, row.description)
        }
    },
    {
        title: '创建者',
        key: 'creator',
        width: 250,
        render(row: ProjectRowData) {
            return h('div', {
                style: 'min-height: 22px',
            }, row.creator)
        }
    },
    {
        title: '',
        key: 'option',
        render(row: ProjectRowData) {
            return h('div', {
                style: "display:flex"
            },[
                h(DeleteConfirm, {
                    buttonText: '删除',
                    id: row.key,
                }),
                h(NButton, {
                    style: "margin-left: 10px",
                    onclick: () => {
                        const tid = row.key.split('.')[0]
                        const pid = row.key.split('.')[1]
                        router.push('/team/' + tid + '/project/' + pid)
                    }
                }, "进入") 
            ]);
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


const refreshData = () => {
    axios.post('project/viewProject', {
        tid: tid.value.replace('private', '')
    }).then(res => {
        if (res.status === 200) {
            if (res.data.code === 200) {
                console.log(res.data)
                data.value = res.data.data.projectlist?.map((item: any) => {
                    return {
                        key: tid.value.replace('private', '') + '.' + item.pid,   // pid
                        projectname: item.project_name,
                        description: item.project_inform,
                        creator: item.username,
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
}

watch(projectstore.projectChanged, () => {
    refreshData()
})

watch(teamstore.teamChanged, () => {
    refreshData()
})

onMounted(() => {
    refreshData()
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