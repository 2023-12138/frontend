<script lang="ts">
import { NInput} from "naive-ui";
import { Ref, computed, h, nextTick, ref } from "vue";
import { ProjectRowData, Column } from '@/interfaces/Project/ProjectTable.interface'

const projectNameInputRef = ref()
const projectDescriptionInputRef = ref()
export const columns: Column[] = [
    {
        title: '项目名称',
        key: 'projectname',
        width: 150,
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
]

// page

const page: Ref<number> = ref(1)
export const handlePageChange = (curPage: number): void => {
    page.value = curPage
}
export const paginationRef: Ref<{ pageSize: number; page: number }> = computed(() => ({
    pageSize: 6,
    page: page.value
}))
</script>

<style scoped></style>