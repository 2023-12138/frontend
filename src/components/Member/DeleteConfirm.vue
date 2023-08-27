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
import { useTeamStore } from '@/store/teamStore'
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
        const teamStore = useTeamStore();
        const teamstore = storeToRefs(teamStore);

        const handlePositiveClick = () => {
            message.success(props.id!);
            const tid = props.id?.split('.')[0]
            const uid = props.id?.split('.')[1]
            axios.post('team/deleteUser', {
                tid : tid,
                uid : uid,
            }).then(res => {
                if (res.status === 200) {
                    if (res.data.code === 200) {
                        teamstore.teamChanged.value = !(teamstore.teamChanged.value)
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
