import { h } from "vue";

export interface ProjectRowData {
    key: string;    // pid
    projectname: string;
    description: string;
    creator: string;
    creatTime: string;
    isEditing: boolean;
    onClick: (key : string) => {};
}

export interface Column {
    title: string;
    key: string;
    width?: number;
    sortOrder?: boolean,
    sorter?: string,
    render: (row: ProjectRowData) => ReturnType<typeof h>;
}