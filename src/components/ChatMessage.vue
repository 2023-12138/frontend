<template>
    <div ref="d" class="messageContainer" :class="{ myself: isMyself }">
        <div class="avatar" :class="{ myself: isMyself }">
            <n-avatar round :size="35" src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" />
        </div>
        <div class="messageMain">
            <div class="userName" :class="{ myself: isMyself }">
                {{ title }}
            </div>
            <div v-if="type === 'text'" class="messageText" :style="{ backgroundColor: (isMyself ? '#82cefd' : '#ccc') }">
                <div class="triangle" :style="{ backgroundColor: (isMyself ? '#82cefd' : '#ccc') }"></div>
                <div :class="{ myself: isMyself }">{{ content }}</div>
            </div>
            <div v-else-if="type === 'img'" class="messageImg">
                <img class="img" :src="content" @click="showImgModal = !showImgModal">
                <n-modal v-model:show="showImgModal" preset="card" style="width: 70vw;height: 95vh;"
                    content-style="height:100%;padding: 0;" header-style="height:0;">
                    <div class="modalImgContainner">
                        <img class="modalImg" :src="content">
                    </div>
                </n-modal>
            </div>
            <div v-else-if="type === 'file'" class="messageFile">
                
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useChatContainer } from '@/store/store';
import { onMounted, ref } from 'vue';
const container = useChatContainer();
const props = defineProps<{
    title: string,
    content: string,
    rid: number,
    time: string,
    io: IntersectionObserver,
    isMyself: boolean,
    type: "text" | "img" | "file"
}>();

const d = ref();
let ele = d.value as HTMLDivElement;

onMounted(() => {
    container.msgElements.push({ rid: props.rid, element: ele });
    d.value.scrollIntoView({
        block: 'nearest',
        inline: 'nearest',
        behavior: 'smooth'
    });
    console.log(`rid:${props.rid} msg:${props.content} recved `);
    console.log(d.value);
    if (Number.isNaN(props.rid)) return;
    if (d.value != undefined) {
        d.value['rid'] = props.rid;
        props.io.observe(d.value);
    }
});

//图片模态框
const showImgModal = ref(false);

</script>
<style scoped>
.messageContainer {
    display: flex;
    justify-content: space-around;
    padding: 10px;
    transform-style: preserve-3d;

    .avatar {
        font-size: 0;
        padding-top: 10px;
        margin-right: 5px;
    }

    .messageMain {
        width: 100%;
        padding-left: 10px;

        .userName {
            width: fit-content;
        }

        .messageText {
            border-radius: 5px;
            font-size: 15px;
            display: inline-block;
            padding: 5px 10px;
            max-width: 50%;
            position: relative;

            .triangle {
                height: 0.7em;
                width: 0.5em;
                clip-path: polygon(0 50%, 100% 0, 100% 100%);
                position: absolute;
                left: -0.5em;
                top: 0.5em;
            }
        }

        .messageImg {
            font-size: 0;
            display: inline-block;
            max-width: 50%;
            max-height: 500px;

            .img {
                max-width: 100%;
                max-height: 100%;
                width: auto;
                height: auto;
            }
        }

        .messageFile {
            width: 220px;
            height: 80px;
            background-color: #ccc;
        }
    }
}

.modalImgContainner {
    width: 100%;
    height: 100%;
    font-size: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    .modalImg {
        max-width: 100%;
        max-height: 100%;
        width: auto;
        height: auto;
    }
}



.myself {
    transform: rotateY(180deg);
}
</style>