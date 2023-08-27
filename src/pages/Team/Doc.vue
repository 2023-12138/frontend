<template>
<div id="main">

</div>
</template>

<script setup lang='ts'>
import { onMounted } from "vue";
import { Editor, withUndoRedo } from "web-editor-markdown";

onMounted(() => {
    let editor = new Editor(document.getElementById('main') as HTMLElement);
    editor = withUndoRedo(editor); // UndoRedo Plugin
    editor.insertTextAtCursor('**This is a bold text**\n> tips：You can switch source mode with `cmd+/`');
    console.log(editor);
    console.log(editor.getContent());
})
</script>

<style scoped>

#main {
    height: 100%;
    display: flex;
    justify-content: center;
}

.web-editor-pre {
    min-height: 200px !important;
}
</style>
