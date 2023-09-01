<template>
    <div ref="d" class="messageContainer" :class="{ myself: isMyself }">
        <div class="avatar" :class="{ myself: isMyself }">
            <n-avatar round :size="35" :src="container.userAvatars.get(props.uid)" />
        </div>
        <div class="messageMain">
            <div class="userName" :class="{ myself: isMyself }">
                {{ title }}
            </div>
            <div v-if="type === 'text'" class="messageText" :style="{ backgroundColor: (isMyself ? '#82cefd' : '#ccc') }">
                <div class="triangle" :style="{ backgroundColor: (isMyself ? '#82cefd' : '#ccc') }"></div>
                <div :class="{ myself: isMyself }">{{ content }}</div>
            </div>
            <div v-else-if="type === 'img'" class="messageImg" :class="{ myself: isMyself }">
                <img class="img" :src="content" @click="showImgModal = !showImgModal">
                <n-modal v-model:show="showImgModal" preset="card" style="width: 70vw;height: 95vh;"
                    content-style="height:100%;padding: 0;" header-style="height:0;">
                    <div class="modalImgContainner">
                        <img class="modalImg" :src="content">
                    </div>
                </n-modal>
            </div>
            <div v-else-if="type === 'file'" class="messageFile" :class="{ myself: isMyself }" @click="download">
                <div class="fileName">
                    <span>{{ content.split('/')[3].split('_')[0] }}</span>
                </div>
                <div class="icon">
                    <n-icon color="blue" :size="40" :component="FilePresentRound" />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useChatContainer } from '@/store/store';
import { onMounted, ref } from 'vue';
import { FilePresentRound } from '@vicons/material'
const container = useChatContainer();
const props = defineProps<{
    uid: number,
    title: string,
    content: string,
    rid: number,
    time: string,
    io: IntersectionObserver,
    isMyself: boolean,
    type: "text" | "img" | "file"
}>();

const d = ref();

onMounted(() => {
    container.msgElements.push({ rid: props.rid, element: d.value });
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

//下载文件
const download = () => {
    const link = document.createElement('a'); // 创建一个 a 标签用来模拟点击事件	
    link.style.display = 'none';
    link.href = props.content;
    link.setAttribute('download', props.content.split('/')[3].split('_')[0]);
    console.log(props.content.split('/')[3].split('_')[0]);
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

</script>
<style scoped>
.messageContainer {
    display: flex;
    justify-content: space-around;
    padding: 10px;
    transform-style: preserve-3d;
    background-color: rgb(245, 245, 245);

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
            display: flex;
            border-radius: 5px;
            background-color: white;
            cursor: pointer;

            .fileName {
                width: 70%;
                height: 100%;
                display: flex;
                justify-content: flex-start;
                align-items: center;

                >span {
                    margin: 10px 10px 10px 17px;
                    font-size: 16px;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                    overflow: hidden;
                }
            }

            .icon {
                width: 30%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
            }
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

.remind {
    animation: dark 1s 1s;
}

@keyframes drak {
    0% {}

    50% {
        background-color: black;
        transform: rotateZ(30deg);
    }

    100% {
        background-color: red;
    }

}
</style>