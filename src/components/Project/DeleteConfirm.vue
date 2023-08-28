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
import { storeToRefs } from 'pinia'; 
import { useProjectStore } from '@/store/projectStore'
import axios from '@/axios/axios';


export default defineComponent({
    props: {
        buttonText: String,
        id: String
    },
    setup(props) {
        const message = useMessage();

        const handleNegativeClick = () => {
        }
        const projectStore = useProjectStore();
        const projectstore = storeToRefs(projectStore);

        const handlePositiveClick = () => {
            axios.post('project/deleteProject', {
                tid : props.id!.split('.')[0],
                pid : props.id!.split('.')[1],
            }).then(res => {
                if (res.status === 200) {
                    if (res.data.code === 200) {
                        projectstore.projectChanged.value = !(projectstore.projectChanged.value)
                        message.success("删除成功")
                    } else {
                        message.warning(res.data.message)
                    }
                } else {
                    message.error('服务器错误')
                }
            })
        }

        return {
            handlePositiveClick,
            handleNegativeClick
        };
    }
});
</script>
