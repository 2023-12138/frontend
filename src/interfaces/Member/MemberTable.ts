import { NInput } from "naive-ui";
import { Ref, computed, h, nextTick, ref } from "vue";

export interface RowData {
    key: number;    // uid
    name: string;
    phone: string;
    email: string;
    option: string;
    isEditing: boolean;
}

export interface Column {
    title: string;
    key: string;
    width?: number;
    render: (row: RowData) => ReturnType<typeof h>;
}

const nameInputRef = ref()
const emailInputRef = ref()
const phoneInputRef = ref()

export const columns: Column[] = [
    {
        title: '姓名',
        key: 'name',
        width: 150,
        render(row: RowData) {
            return row.isEditing
                ? h(NInput as any, {
                    ref: nameInputRef,
                    value: row.name,
                    onUpdateValue: (v: string) => {
                        row.name = v
                    },
                    onBlur: () => {
                        row.isEditing = false
                    },
                })
                : h('div', {
                    style: 'min-height: 22px',
                    onClick: () => {
                        row.isEditing = true
                        nextTick(() => {
                            nameInputRef.value.focus()
                        })
                    }
                }, row.name)
        }
    },
    {
        title: '手机',
        key: 'phone',
        width: 100,
        render(row: RowData) {
            return row.isEditing
                ? h(NInput as any, {
                    ref: emailInputRef,
                    value: row.phone,
                    onUpdateValue: (v: string) => {
                        row.phone = v
                    },
                    onBlur: () => {
                        row.isEditing = false
                    },
                })
                : h('div', {
                    style: 'min-height: 22px',
                    onClick: () => {
                        row.isEditing = true
                        nextTick(() => {
                            emailInputRef.value.focus()
                        })
                    }
                }, row.phone)
        }
    },
    {
        title: '邮箱',
        key: 'email',
        render(row: RowData) {
            return row.isEditing
                ? h(NInput as any, {
                    ref: phoneInputRef,
                    value: row.email,
                    onUpdateValue: (v: string) => {
                        row.email = v
                    },
                    onBlur: () => {
                        row.isEditing = false
                    },
                    onEnter: () => {
                        row.isEditing = false
                    }
                })
                : h('div', {
                    style: 'min-height: 22px',
                    onClick: () => {
                        row.isEditing = true
                        nextTick(() => {
                            phoneInputRef.value.focus()
                        })
                    }
                }, row.email)
        }
    },
    {
        title: '操作',
        key: 'option',
        render(row: RowData) {
            return h('div', {
                    style: 'min-height: 22px',
                    onClick: () => {
                        row.isEditing = true
                        nextTick(() => {
                            phoneInputRef.value.focus()
                        })
                    }
                }, [])
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