<template>
    <n-modal :mask-closable="false" preset="dialog" positive-text="邀请" negative-text="取消" 
    @positive-click="onPositiveClick"
        @negative-click="onNegativeClick">
        <template #header>
            <span class="header">邀请成员</span>
        </template>
        <div class="content">
            <n-select multiple :options="options" :render-label="renderLabel" :render-tag="renderMultipleSelectTag"
                filterable placeholder="搜索用户" v-model:value="selectedValues" />
        </div>
    </n-modal>
</template>

<script lang="ts">
import { defineComponent, h, ref } from 'vue'
import { NAvatar, NTag, NText, SelectRenderLabel, SelectRenderTag, useMessage } from 'naive-ui';

export default defineComponent({
    setup() {
        const selectedValues = ref<string[]>([]);
        const message = useMessage()
        const onPositiveClick = () => {
            message.success("邀请已发送")
            console.log(selectedValues.value);
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
                                h(NAvatar, {
                                    src: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
                                    round: true,
                                    size: 22,
                                    style: {
                                        marginRight: '4px'
                                    }
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
                    h(NAvatar, {
                        src: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
                        round: true,
                        size: 'small'
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
                            h(
                                NText,
                                { depth: 3, tag: 'div' },
                                {
                                    default: () => 'description'
                                }
                            )
                        ]
                    )
                ]
            )
        }

        return {
            onPositiveClick,
            onNegativeClick,
            selectedValues,
            options: [
                // label放置用户名，value放置用户id
                {
                    label: '07akioni',
                    value: '07akioni'
                },
                {
                    label: '08akioni',
                    value: '08akioni'
                },
                {
                    label: '09akioni',
                    value: '09akioni'
                }
            ],
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