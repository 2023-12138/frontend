<template>
    <div ref="d" class="messageContainer" :class="{myself:isMyself}">
        <div class="avatar" :class="{myself:isMyself}">
            <n-avatar round :size="35" src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" />
        </div>
        <div class="messageMain">
            <div class="userName" :class="{myself:isMyself}">
                {{ title }}
            </div>
            <div class="massageText" :style="{backgroundColor:(isMyself ? '#82cefd' : '#ccc')}">
                <div class="triangle" :style="{backgroundColor:(isMyself ? '#82cefd' : '#ccc')}"></div>
                <div :class="{myself:isMyself}">{{ content }}</div>
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
    isMyself:boolean                                       //TODO:记得调整
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
</script>
<style scoped>

.messageContainer {
    display: flex;
    justify-content:space-around;
    padding: 10px;
    transform-style:preserve-3d;

    .avatar {
        font-size:0;
        padding-top: 10px;
        margin-right: 5px;
    }

    .messageMain {
        width: 100%;
        padding-left: 10px;

        .userName {
            width: fit-content;
        }

        .massageText {
            border-radius: 5px;
            font-size: 15px;
            display: inline-block;
            padding: 5px 10px;
            max-width: 50%;
            position: relative;

            .triangle {
                height: 0.7em;
                width: 0.5em;
                clip-path:polygon(0 50%,100% 0,100% 100%);
                position: absolute;
                left: -0.5em;
                top: 0.5em;
            }
        }
    }
}

.myself {
    transform: rotateY(180deg);
}
</style>