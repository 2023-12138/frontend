<template>
    <div ref="d" style="display: flex;justify-content:space-around; padding: 10px">
        <div>
            <n-avatar :size="27" style="padding-top: 10px; background-color: white;"
                src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" />
        </div>
        <div style="display: flex;flex-direction: column; width: 100%;padding-left: 10px;">
            <div style="display: flex; justify-content: space-between;">
                <span style="width:20%">{{ title }}</span>
                <span>{{ time }}</span>
            </div>
            <n-card style="border-radius: 5px;background-color: white;" content-style="padding:5px">
                <span style="font-size: 15px;">
                    {{ content }}
                </span>
            </n-card>
        </div>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';

const props = defineProps<{
    title: string,
    content: string,
    rid: number,
    time: string,
    io: IntersectionObserver
}>();
const d = ref();
onMounted(() => {
    d.value.scrollIntoView({
        block: 'nearest',
        inline: 'nearest',
        behavior: 'smooth'
    });
    console.log(`rid:${props.rid} msg:${props.content} recved `);
    console.log(d.value);
    let rid = -1;
    if (Number.isNaN(props.rid)) return;
    rid = props.rid;
    if (d.value != undefined) {
        d.value['rid'] = rid;
        props.io.observe(d.value);
    }
});
</script>
<style scoped></style>