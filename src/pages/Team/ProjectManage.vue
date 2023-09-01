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
                        <div class="active-project">
                            <n-input 
                            class="active-search" 
                            placeholder="输入搜索项目" 
                            clearable
                            @input="filtProject"
                            >
                                <template #prefix>
                                    <n-icon :component="BoxSearch20Filled" />
                                </template>
                            </n-input>
                            <n-data-table :key="(row: any) => row.key" :columns="columns" :data="preData"
                                :pagination="paginationRef" @update:page="handlePageChange" />
                        </div>
                    </n-tab-pane>
                    <n-tab-pane name="rubbish bin" tab="回收站">
                        <div class="delete-project">
                            <n-input 
                            class="delete-search" 
                            placeholder="输入搜索项目" 
                            clearable
                            @input="filtProject"
                            >
                                <template #prefix>
                                    <n-icon :component="BoxSearch20Filled" />
                                </template>
                            </n-input>
                            <n-data-table :key="(row: any) => row.key" :columns="deleteColumns" :data="preDeleteData"
                                :pagination="deletePaginationRef" @update:deletePage="handleDeletePageChange" />
                        </div>
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
import { BoxSearch20Filled } from '@vicons/fluent'
const showModal = ref(false)

const route = useRoute()
const tid = ref(route.params.tid.toString())
const data: Ref<ProjectRowData[]> = ref([])
const preData: Ref<ProjectRowData[]> = ref([])
const deleteData: Ref<ProjectRowData[]> = ref([])
const preDeleteData: Ref<ProjectRowData[]> = ref([])

// 前后端逻辑
const projectStore = useProjectStore();
const projectstore = storeToRefs(projectStore);
const teamStore = useTeamStore();
const teamstore = storeToRefs(teamStore);
const message = useMessage()

import { NButton, NInput } from "naive-ui";
import { computed, h, nextTick } from "vue";
import DeleteConfirm from '@/components/Project/DeleteConfirm.vue'
import router from '@/routes';
const projectNameInputRef = ref()
const projectDescriptionInputRef = ref()

const columns = [
    {
        title: '项目名称',
        key: 'projectname',
        width: 180,
        sorter(rowA: ProjectRowData, rowB: ProjectRowData) {
            return rowA.projectname.localeCompare(rowB.projectname)
        },
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
                        axios.post('project/renameProject', {
                            "pid": row.key.split('.')[1],
                            "project_name": row.projectname
                        }).then(res => {
                            if (res.status === 200) {
                                if (res.data.code === 200) {
                                    message.success('修改成功')
                                } else {
                                    message.warning(res.data.msg)
                                }
                            } else {
                                message.error('服务器错误')
                            }
                        })
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
        width: 250,
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
                        axios.post('project/renameProjectInform', {
                            "pid": row.key.split('.')[1],
                            "project_inform": row.description
                        }).then(res => {
                            if (res.status === 200) {
                                if (res.data.code === 200) {
                                    message.success('修改成功')
                                } else {
                                    message.warning(res.data.msg)
                                }
                            } else {
                                message.error('服务器错误')
                            }
                        })
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
        width: 130,
        render(row: ProjectRowData) {
            return h('div', {
                style: 'min-height: 22px',
            }, row.creator)
        }
    },
    {
        title: '创建时间',
        key: 'creatTime',
        width: 230,
        sorter(rowA: ProjectRowData, rowB: ProjectRowData) {
            const dateA = new Date(rowA.creatTime.replace(' ', 'T'));
            const dateB = new Date(rowB.creatTime.replace(' ', 'T'));
            return dateA.getTime() - dateB.getTime()
        },
        render(row: ProjectRowData) {
            return h('div', {
                style: 'min-height: 22px',
            }, row.creatTime.substring(0, 16))
        }
    },
    {
        title: '',
        key: 'option',
        render(row: ProjectRowData) {
            return h('div', {
                style: "display:flex"
            }, [
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
                }, "进入"),
                h(NButton, {
                    style: "margin-left: 10px",
                    onclick: () => {
                        const pid = row.key.split('.')[1]
                        axios.post('project/copyProject', {
                            pid : pid
                        }).then(res => {
                            if (res.data.code === 200) {
                                message.success('复制成功')
                                projectstore.projectChanged.value = !(projectstore.projectChanged.value)
                                refreshData()
                            } else {
                                message.warning(res.data.message)
                            }
                        })
                    }
                }, "复制")
            ]);
        }
    }
]

const deleteColumns = [
    {
        title: '项目名称',
        key: 'projectname',
        width: 180,
        sorter(rowA: ProjectRowData, rowB: ProjectRowData) {
            return rowA.projectname.localeCompare(rowB.projectname)
        },
        render(row: ProjectRowData) {
            return h('div', {
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
        width: 250,
        render(row: ProjectRowData) {
            return h('div', {
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
        width: 130,
        render(row: ProjectRowData) {
            return h('div', {
                style: 'min-height: 22px',
            }, row.creator)
        }
    },
    {
        title: '创建时间',
        key: 'creatTime',
        width: 230,
        sorter(rowA: ProjectRowData, rowB: ProjectRowData) {
            const dateA = new Date(rowA.creatTime.replace(' ', 'T'));
            const dateB = new Date(rowB.creatTime.replace(' ', 'T'));
            return dateA.getTime() - dateB.getTime()
        },
        render(row: ProjectRowData) {
            return h('div', {
                style: 'min-height: 22px',
            }, row.creatTime.substring(0, 16))
        }
    },
    {
        title: '',
        key: 'option',
        render(row: ProjectRowData) {
            return h('div', {
                style: "display:flex"
            }, [
                h(DeleteConfirm, {
                    buttonText: '删除',
                    id: row.key,
                }),
                h(NButton, {
                    style: "margin-left: 10px",
                    onclick: () => {
                        const tid = row.key.split('.')[0]
                        const pid = row.key.split('.')[1]
                        axios.post('project/recoverProject', {
                            pid : pid,
                            tid : tid
                        }).then(res => {
                            if (res.status === 200) {
                                if (res.data.code === 200) {
                                    message.success('恢复成功')
                                    projectstore.projectChanged.value = !projectstore.projectChanged.value
                                } else {
                                    message.warning(res.data.message)
                                }
                            }
                        })
                    }
                }, "恢复")
            ]);
        }
    }
]

// filter
function filtProject(v: string) {
    if (!v) {
        preData.value = data.value
    } else {
        preData.value = data.value.filter((item) => item.projectname.includes(v))
    }
}

// page
const page: Ref<number> = ref(1)
const handlePageChange = (curPage: number): void => {
    page.value = curPage
}
const paginationRef: Ref<{ pageSize: number; page: number }> = computed(() => ({
    pageSize: 6,
    page: page.value
}))

const deletePage: Ref<number> = ref(1)
const handleDeletePageChange = (curPage: number): void => {
    deletePage.value = curPage
}
const deletePaginationRef: Ref<{ pageSize: number; page: number }> = computed(() => ({
    pageSize: 6,
    page: page.value
}))



const refreshData = () => {
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
                        creator: item.username,
                        creatTime: item.create_time.split('.')[0].replace('T', ' '),
                        isEditing: false,
                    }
                })
                preData.value = data.value
                page.value = 1
            } else {
                message.warning(res.data.message)
            }
        } else {
            message.error('服务器错误')
        }
    })
    axios.post('project/viewDelProject', {
        tid: tid.value.replace('private', '')
    }).then(res => {
        if (res.status === 200) {
            if (res.data.code === 200) {
                deleteData.value = res.data.data.projectlist?.map((item: any) => {
                    return {
                        key: tid.value.replace('private', '') + '.' + item.pid,   // pid
                        projectname: item.project_name,
                        description: item.project_inform,
                        creator: item.username,
                        creatTime: item.create_time.split('.')[0].replace('T', ' '),
                        isEditing: false,
                    }
                })
                preDeleteData.value = deleteData.value
                deletePage.value = 1
            } else {
                message.warning(res.data.message)
            }
        } else {
            message.error('服务器错误')
        }
    })
}

watch(projectstore.projectChanged, () => {
    if (teamstore.curTeam.value.toString() !== '-1'){
        tid.value = teamstore.curTeam.value.toString()
    }
    refreshData()
})

watch(teamstore.teamChanged, () => {
    if (teamstore.curTeam.value.toString() !== '-1'){
        tid.value = teamstore.curTeam.value.toString()
    }
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

.active-project {
    margin: 10px;

    .active-search {
        margin-bottom: 10px;
    }
}

.delete-project {
    margin: 10px;

    .delete-search {
        margin-bottom: 10px;
    }
}
</style>