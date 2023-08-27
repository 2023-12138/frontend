<template>
    <n-modal :mask-closable="false" preset="dialog" positive-text="邀请" negative-text="取消" @positive-click="onPositiveClick"
        @negative-click="onNegativeClick">
        <template #header>
            <span class="header">邀请成员</span>
        </template>
        <div class="content">
            <n-select multiple :options="options" :render-label="renderLabel" :render-tag="renderMultipleSelectTag"
                :filterable="true" :filter="customFilter" placeholder="搜索用户" v-model:value="selectedValues" />
        </div>
    </n-modal>
</template>

<script lang="ts">
import { defineComponent, h, ref, watch } from 'vue'
import { NIcon, NTag, SelectRenderLabel, SelectRenderTag, useMessage } from 'naive-ui';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia'; 
import { useTeamStore } from '@/store/teamStore'
import axios from '@/axios/axios';
import { UserAddOutlined } from '@vicons/antd';
import { UserAdmin } from '@vicons/carbon';

export default defineComponent({
    setup() {
        const selectedValues = ref<string[]>([]);
        const inputValue = ref<string>('null');
        const teamStore = useTeamStore();
        const teamstore = storeToRefs(teamStore);
        const route = useRoute()
        const tid = route.params.tid
        let options = ref<{ label: string, value: string, disabled: boolean }[]>([
            // label放置用户名，value放置用户id
            {
                label: '用户名',
                value: '用户id',
                disabled: true
            }
        ]
        )

        const message = useMessage()
        const onPositiveClick = () => {
            if (selectedValues.value) {
                let flag = true
                selectedValues.value.map((item, index) => {
                    axios.post('team/inviteUser', {
                        "uid": item,
                        "tid": tid
                    }).then(res => {
                        if (res.status === 200) {
                            if (res.data.code !== 200) {
                                flag = false
                                message.warning(res.data.message)
                            }

                            if (index === selectedValues.value.length && flag) {
                                teamstore.teamChanged.value = !(teamstore.teamChanged.value)
                                message.success("邀请成功")
                            }
                        } else {
                            message.error("服务器错误")
                        }
                    })
                })
            } else {
                message.warning("请先选择用户")
            }
            selectedValues.value = []
        }
        const onNegativeClick = () => {
        }

        const renderMultipleSelectTag: SelectRenderTag = ({
            option,
            handleClose
        }) => {
            return h(
                NTag,
                {
                    style: {
                        padding: '0 6px 0 4px'
                    },
                    round: true,
                    closable: true,
                    onClose: (e) => {
                        e.stopPropagation()
                        handleClose()
                    }
                },
                {
                    default: () =>
                        h(
                            'div',
                            {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center'
                                }
                            },
                            [
                                h(NIcon, {
                                    component: UserAdmin,
                                    size: 15
                                }),
                                option.label as string
                            ]
                        )
                }
            )
        }
        const renderLabel: SelectRenderLabel = (option) => {
            return h(
                'div',
                {
                    style: {
                        display: 'flex',
                        alignItems: 'center'
                    }
                },
                [
                    h(NIcon, {
                        component: UserAddOutlined,
                        size: 25
                    }),
                    h(
                        'div',
                        {
                            style: {
                                marginLeft: '12px',
                                padding: '4px 0'
                            }
                        },
                        [
                            h('div', null, [option.label as string]),
                        ]
                    )
                ]
            )
        }

        watch(inputValue, (newInputValue, _oldInputValue) => {
            if (newInputValue) {
                axios.post('team/getUsers', {
                    "username": newInputValue
                }).then(res => {
                    if (res.status === 200) {
                        if (res.data.code === 200) {
                            if (res.data.data.userlist.length !== 0) {
                                options.value = res.data.data.userlist.map((item: any) => {
                                    return {
                                        label: item.username,
                                        value: item.uid
                                    }
                                })
                            }
                        } else {
                            message.error(res.data.message)
                        }
                    } else {
                        message.error('服务器错误')
                    }
                })
            }
        });

        const customFilter = (query: string, option: { label: string, value: string }): boolean => {
            console.log(query)
            inputValue.value = query
            return option?.label.indexOf(query) !== -1;
        };

        return {
            customFilter,
            onPositiveClick,
            onNegativeClick,
            selectedValues,
            inputValue,
            options,
            renderMultipleSelectTag,
            renderLabel
        }
    }
})
</script>

<style scoped>
.header {
    display: flex;
    justify-content: center;
}

.content {
    margin: 50px;
    height: 20vh;
}
</style>