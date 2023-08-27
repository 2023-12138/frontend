<script lang="ts">
import { NInput, NSelect } from "naive-ui";
import { Ref, computed, h, nextTick, ref } from "vue";
import { MemberRowData, Column } from '@/interfaces/Member/MemberTable.interface'
import DeleteConfirm from './DeleteConfirm.vue'

const userNameInputRef = ref()

export const options = [{
    label: '管理员',
    value: '管理员'
},
{
    label: '协作成员',
    value: '协作成员'
}]

export const columns: Column[] = [
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
        width: 250,
        render(row: MemberRowData) {
            return h('div', {
                style: 'min-height: 22px',
            }, row.phone)
        }
    },
    {
        title: '邮箱',
        key: 'email',
        width: 300,
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
                    row.rank = v
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
            return h(
                DeleteConfirm as any,
                {
                    buttonText: '删除',
                    uid: row.key,
                    //TODO: tid
                },
            );
        }
    }
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