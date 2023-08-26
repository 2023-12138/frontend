<template>
    <n-popconfirm @positive-click="handlePositiveClick()" @negative-click="handleNegativeClick()">
        <template #trigger>
            <n-button>{{ buttonText }}</n-button>
        </template>
        <slot>确认删除？</slot>
    </n-popconfirm>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';
import { useMessage } from 'naive-ui';

export default defineComponent({
    props: {
        buttonText: String,
        uid: String,
    },
    setup(props) {
        const message = useMessage();

        const handleNegativeClick = () => {
        }

        const handlePositiveClick = () => {
            message.success(props.uid!);
        }

        return {
            handlePositiveClick,
            handleNegativeClick
        };
    }
});
</script>
