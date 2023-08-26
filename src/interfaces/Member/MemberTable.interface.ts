import { h } from "vue";

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