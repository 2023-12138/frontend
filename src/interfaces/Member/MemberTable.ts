import { NInput, NSelect } from "naive-ui";
import { Ref, computed, h, nextTick, ref } from "vue";

export interface RowData {
    key: number;    // uid
    name: string;
    phone: string;
    email: string;
    username: string;
    option: string;
    rank: string;
    isEditing: boolean;
}

export interface Column {
    title: string;
    key: string;
    width?: number;
    render: (row: RowData) => ReturnType<typeof h>;
}

const userNameInputRef = ref()

const options = [{
    label: '管理员',
    value: '管理员'
  },
  {
    label: '普通成员',
    value: '普通成员'
  }]
export const columns: Column[] = [
    {
        title: '姓名',
        key: 'name',
        width: 150,
        render(row: RowData) {
            return h('div', {
                    style: 'min-height: 22px',
                }, row.name)
        }
    },
    {
        title: '手机',
        key: 'phone',
        width: 100,
        render(row: RowData) {
            return h('div', {
                    style: 'min-height: 22px',
                }, row.phone)
        }
    },
    {
        title: '邮箱',
        key: 'email',
        render(row: RowData) {
            return h('div', {
                    style: 'min-height: 22px',
                }, row.email)
        }
    },
    {
        title: '昵称',
        key: 'username',
        width: 100,
        render(row: RowData) {
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
        title: '企业身份',
        key: 'rank',
        width: 150,
        render(row: RowData) {
            return row.rank !== '创建者' ? h(NSelect as any, {
                options: options,
                value: row.rank,
                onUpdateValue: (v : string) => {
                    row.rank = v
                }
            }) : h(NSelect as any, {
                disabled : true,
                value: row.rank
            })
        }
    },
    {
        title: '',
        key: 'option',
        render(row: RowData) {
            return h('div', {
                    style: 'min-height: 22px',
                }, row.email)
        }
    }
]

// page

const page: Ref<number> = ref(1)
export const handlePageChange = (curPage: number): void => {
    page.value = curPage
}
export const paginationRef: Ref<{ pageSize: number; page: number }> = computed(() => ({
    pageSize: 10,
    page: page.value
}))