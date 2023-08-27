<template>
    <div class="container">
        <div class="header">
            <div class="headerContainer">
                <div class="headerLeft">
                    <div class="back">
                        <n-icon size="29" :component="ArrowBackSharp" />
                    </div>
                    <div class="title">
                        文档名
                    </div>
                    <div class="editTitle">
                        <n-icon size="17" :component="Edit16Filled" />
                    </div>
                </div>
                <div class="headerRight">
                    <n-button>导出</n-button>
                    <n-button >保存</n-button>
                </div>
            </div>
        </div>
        <div id="main"></div>
    </div>
</template>

<script setup lang='ts'>
import { onMounted } from "vue";
import { Editor, withUndoRedo } from "@/editor/index";

import { ArrowBackSharp } from '@vicons/ionicons5';
import { Edit16Filled } from '@vicons/fluent'

onMounted(() => {
    let editor = new Editor(document.getElementById('main') as HTMLElement);
    editor = withUndoRedo(editor); // UndoRedo Plugin
    editor.insertTextAtCursor('**This is a bold text**\n> tips：You can switch source mode with `cmd+/`');
    console.log(editor);
    console.log(editor.getContent());
})
</script>

<style scoped>

.container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.header {
    width: 100%;
    height: 50px;
    background-color: #ddd;
    display:flex;
    justify-content: center;
}

.headerContainer {
    width:70%;
    height: 100%;
    display:flex;
}

.headerLeft {
    height: 100%;
    width: 50%;
    display: flex;
    align-items: center;
}

.back{
    font-size: 0;
    margin-left: 10px;
}
.back:hover{
    cursor: pointer;
}

.title {
    font-size: 20px;
    font-weight: 666;
    margin-left: 10px;
}

.editTitle {
    font-size: 0;
    margin-left: 4px;
    opacity: 0.5;
}

.editTitle:hover{
    cursor: pointer;
    opacity: 1;
    transition: 0.1s opacity linear
}

.headerRight {
    height: 100%;
    width: 50%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

.headerRight > * {
    margin-right:10px;
}

#main {
    width: 70%;
    height: calc(100% - 50px);
    display: flex;
    justify-content: center;
    margin-top: 10px;
    margin-bottom: 5px;
}
</style>
