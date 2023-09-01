<template>
    <div class="container">
        <div class="header">
            <div class="headerContainer">
                <div class="headerLeft">
                    <div class="back" @click="$router.go(-1)">
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
                    <n-button @click="save">保存</n-button>
                </div>
            </div>
        </div>
        <div id="main" class="docContainer">
            <iframe name="embed_readwrite" class="docFrame" :src="src" width="100%" height="600" frameborder="0"></iframe>
        </div>
    </div>
    <n-popselect v-model:value="ATValue" size="medium" scrollable :options="ATOptions" :show="ATshow" :x="ATleft"
        :y="ATtop + ATheight / 2 + 2" trigger="manual">
    </n-popselect>
</template>

<script setup lang='ts'>
import { onMounted, ref, watch } from "vue";
import { Editor } from "@/editor/index";
import { usedocEditStore } from '@/store/docEditStore.ts'

import { ArrowBackSharp } from '@vicons/ionicons5';
import { Edit16Filled } from '@vicons/fluent'
import { mypost } from "@/axios/axios";
import { useMessage } from "naive-ui";
import { useRoute } from "vue-router";

const message = useMessage();
const docEditStore = usedocEditStore();
const route = useRoute();

let editor: Editor;
let src = ref<string | undefined>(undefined);
onMounted(async () => {
    debugger;
    const res = await mypost(message, '/doc/openDoc', { docid: route.params.did })
    if (!res) {
        return;
    }
    debugger;
    src.value = `/pad/p/auth_session?sessionID=${res.sessionid}&padID=${res.padid}`;


    //设置cookies

    //editor = new Editor(document.getElementById('main') as HTMLElement);
    //editor = withUndoRedo(editor); // UndoRedo Plugin
    //'**This is a bold text**\n> tips：You can switch source mode with `cmd+/`\n'
    //editor.insertTextAtCursor(res.content);
    //console.log(editor);
    //console.log(editor.getContent());

})

//AT事件
const ATleft = ref(0);
const ATtop = ref(0);
const ATheight = ref(0);
const ATValue = ref('');
const ATshow = ref(false);
const ATOptions = ref([
    {
        label: '全体成员',
        value: 'allUser'
    }
])

docEditStore.onAT = async () => {
    //申请成员列表
    const res = await mypost(message, '/team/viewUser', { tid: route.params.tid })
    if (!res) {
        return;
    }
    ATValue.value = '';
    ATOptions.value.splice(1);
    for (const member of res.userlist) {
        ATOptions.value.push({ label: member.username, value: member.username + '&' + member.uid });
    }
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
        ATshow.value = true;
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        ATleft.value = rect.left;
        ATtop.value = rect.top;
        ATheight.value = rect.height;
        console.log(range);
    }
}

watch(ATValue, async (newValue) => {
    if (newValue != '') {
        const res = await mypost(message, '/doc/docaite', { "aite": parseInt(newValue.split('&')[1]), "docid": route.params.did })
        if (!res) {
            return;
        }
        editor.insertTextAtCursor(newValue.split('&')[0]);
        ATshow.value = false;
    }
})


//保存事件
const save = async () => {
    const content = editor.getContent();
    const res = await mypost(message, '/doc/savedoc', { "docid": route.params.did, "text": content })
    if (!res) {
        return;
    }
    message.success('保存成功！')
}
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
    display: flex;
    justify-content: center;
}

.headerContainer {
    width: 100%;
    height: 100%;
    display: flex;
}

.headerLeft {
    height: 100%;
    width: 50%;
    display: flex;
    align-items: center;
}

.back {
    font-size: 0;
    margin-left: 10px;
}

.back:hover {
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

.editTitle:hover {
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

.headerRight>* {
    margin-right: 10px;
}

#main {
    width: 100%;
    height: calc(100% - 50px);
    display: flex;
    justify-content: center;
    margin-top: 10px;
    margin-bottom: 5px;
}

.mask {
    height: 100%;
    width: 100%;
    position: absolute;
    background-color: red;
    opacity: 0.5;
    left: 0;
    top: 0;
}

.docContainer {
    height: 100%;
    width: 100%;
}

.docFrame {
    height: 100%;
    width: 100%;
}
</style>
