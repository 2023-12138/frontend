<template>
    <div class="parentContainer">
        <div style="height: 100%;">
            <n-tabs :value="selectedTab" class="leftContainer" type="line" animated placement="left">
                <n-tab-pane name="currentmessages" tab="消息">
                    <div class="recentMsgContainer">
                        <n-list hoverable clickable>
                            <n-list-item horizontal v-for="item in recentChatList" @click="startChat(item.id, item.isuser)">
                                <n-space>
                                    <n-avatar :size="16" src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" />
                                    <n-ellipsis style="max-width: 62px;">{{ item.userOrTeamName }}</n-ellipsis>
                                </n-space>
                            </n-list-item>
                        </n-list>
                    </div>
                </n-tab-pane>
                <n-tab-pane name="teams" tab="团队">
                    <div class="recentMsgContainer">
                        <n-list hoverable clickable>
                            <n-list-item v-for="team in allTeams" @click="onTeamClicked(team.teamID);">
                                <div class="teamNameContainer">
                                    <n-avatar :size="16" src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" />
                                    <n-ellipsis style="max-width: 62px;">{{ team.teamName }}</n-ellipsis>

                                    <n-dropdown trigger="hover" :options="team2Options(team)">
                                        <n-popover trigger="hover">
                                            <template #trigger>
                                                <n-button strong secondary circle type="primary">
                                                    <template #icon>
                                                        <n-icon>
                                                            <ImageOutline />
                                                        </n-icon>
                                                    </template>
                                                </n-button>
                                            </template>

                                            <span>选择团队成员私聊</span>
                                        </n-popover>
                                    </n-dropdown>

                                </div>

                                <!-- </n-space> -->
                            </n-list-item>
                        </n-list>
                    </div>
                </n-tab-pane>
            </n-tabs>
        </div>
        <n-h3 style="width: 100%; background-color: aliceblue; text-align: center;"
            v-show="currentChatID.id == -1">选择一个团队或联系人开始聊天</n-h3>
        <div class="rightChatRoomContainer" v-show="currentChatID.id != -1">
            <div class="targetUserContainer">
                <n-h3 class="targetUser">{{ currentChatName }}</n-h3>
            </div>
            <div class="rightChatContentContainer">
                <n-layout class="chatContentLayout">
                    <n-layout-content class="chatContent" content-style="padding: 24px;">
                        <n-card style="margin-top: 10px;" v-for="msg in msgList">
                            <n-space vertical>
                                <div style="display: flex; justify-content: space-between;">
                                    <n-h6>{{ msg.userName }}</n-h6>
                                    <span>{{ msg.time }}</span>
                                </div>
                                <span>{{ msg.msg }}</span>
                            </n-space>
                        </n-card>
                    </n-layout-content>
                    <n-layout-footer class="chatToolFooter">
                        <div class="chatToolContainer">
                            <n-button strong secondary circle type="primary" class="msg_tool_button">
                                <template #icon>
                                    <n-icon>
                                        <ImageOutline />
                                    </n-icon>
                                </template>
                            </n-button>
                            <n-button strong secondary circle type="primary" class="msg_tool_button">
                                <template #icon>
                                    <n-icon>
                                        <ImageOutline />
                                    </n-icon>
                                </template>
                            </n-button>
                            <n-form @submit="onMsgboxSubmitted" class="msgBoxForm">
                                <n-mention v-model:value="inputMessage" placeholder="Message" :options="options"
                                    class="msgBox" />
                            </n-form>
                        </div>
                    </n-layout-footer>
                </n-layout>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { ImageOutline } from '@vicons/ionicons5'
import { RecentListModel, TeamModel, useChatContainer } from '@/store/store'
import { storeToRefs } from 'pinia';
import { NTabs, useMessage } from 'naive-ui';
import axios, { mypost } from '@/axios/axios'
import { useUserStore } from '@/store/userStore';
const container = useChatContainer();
const userStore = useUserStore();
const { recentChatList, msgList, webSocket, allTeams, currentChatID, currentChatName } = storeToRefs(container);
const { curUser } = storeToRefs(userStore);
const options = ref([{ label: 'Feeman', value: 'Freeman' }, { label: 'TestUser', value: 'testuser' }]);
const wsURL = `ws://localhost:8000/ws/chat/${curUser.value}/`;
const inputMessage = ref('');
const message = useMessage();
const selectedTab = ref<string | undefined>(undefined);
function onMsgboxSubmitted(e: SubmitEvent) {
    e.preventDefault();
    if (webSocket.value?.readyState != WebSocket.OPEN) {
        message.error('webSocket Disconnected');
    }
    try {
        const newLocal = JSON.stringify({
            message: inputMessage.value,
            to_uid: currentChatID.value.isuser ? currentChatID.value.id : '',
            tid: currentChatID.value.isuser ? '' : currentChatID.value.id, from_uid: curUser.value
        });
        console.log(newLocal);
        webSocket.value?.send(newLocal);
        inputMessage.value = '';
        message.success('msg send success');
    } catch (error) {
        message.error('send err');
    }

}
function team2Options(team: TeamModel) {
    let options: { label: string; key: number; disabled: boolean; props: { onClick: () => void; }; }[] = [];
    team.teamMembers.forEach(member => {
        options.push({
            label: member.userName,
            key: member.userID,
            disabled: false,
            props: {
                onClick: () => {
                    onUserClicked(member.userID);
                }
            }
        })
    });
    return options;
}
let reconnectCount = 0;
function initWebSocket() {
    if (webSocket.value == null) return;
    webSocket.value.onmessage = (e) => {
        console.log('recv a msg:');
        console.log(e.data);
        const data = JSON.parse(e.data);
        //message,senderId,teamId,time
        let message: string = data.message;
        let senderId: number = data.senderId;
        let receiverId: number | string = data.receiverId;
        let teamId: number | string = data.teamId;
        let currentTime: string = data.time;

        //判断是否在recent中
        let isuser = (teamId == "");
        let recent: RecentListModel | undefined;
        if (isuser) {
            //首先判断是否是自己发出去的
            if (senderId == curUser.value) {
                recent = recentChatList.value.find((ele) => ele.id == receiverId && ele.isuser == isuser);
            } else {
                recent = recentChatList.value.find((ele) => ele.id == senderId && ele.isuser == isuser);
            }
        }
        else {
            //首先判断是否是自己发出去的
            recent = recentChatList.value.find((ele) => ele.id == teamId && ele.isuser == isuser);
        }
        if (recent == undefined) return;
        recent.Messages.push({
            userName: `${senderId}`,
            msg: message,
            userID: senderId,
            time: currentTime,
            imgstr: null
        });
        //判断是否正在展示
        if (currentChatID.value.id == recent.id) {
            msgList.value.push({
                userName: `${senderId}`,
                msg: message,
                userID: senderId,
                time: currentTime,
                imgstr: null
            });
        }
    };
    webSocket.value.onclose = (_) => {
        if (reconnectCount > 10) {
            reconnectCount = 0;
            message.error('重连超过次数限制 不再重连');
            return;
        }
        try {
            reconnectCount++;
            message.error(`WebSocket断开 正在重连 ${reconnectCount}/10`);
            webSocket.value = new WebSocket(wsURL);
            initWebSocket();
        } catch {
            message.error('重连失败？');
        }
    }
    webSocket.value.onerror = (_) => {
        message.error('unknown error');
    }
}
function onTeamClicked(id: number) {
    selectedTab.value = 'currentmessages';
    nextTick(() => {
        selectedTab.value = undefined;
    })
    currentChatID.value = { id: id, isuser: false };
    startChat(id, false);
}
function onUserClicked(id: number) {
    selectedTab.value = 'currentmessages';
    nextTick(() => {
        selectedTab.value = undefined;
    })
    currentChatID.value = { id: id, isuser: true };
    startChat(id, true);
}
function startChat(id: number, isuser: boolean) {
    if (recentChatList.value.find((ele) => ele.id == id && ele.isuser == isuser) == undefined) {
        //没找到,问服务器请求历史数据
        if (isuser) {

        } else {
            //请求team的历史数据
        }
        //添加到历史数据Messages中
        recentChatList.value.push({
            userOrTeamName: `${id}`,
            id: id,
            isuser: isuser,
            lastMsg: null,
            Messages: []
        });
    }

    changeChatContent(id, isuser);

}
function changeChatContent(id: number, isuser: boolean) {
    msgList.value = [];
    const chat = recentChatList.value.find((ele) => ele.id == id && ele.isuser == isuser);
    if (chat == undefined) {
        message.error('chat is undefined');
        return;
    }
    currentChatName.value = chat.userOrTeamName;
    chat.Messages.forEach(message => {
        msgList.value.push({
            userName: message.userName,
            msg: message.msg,
            userID: message.userID,
            time: message.time,
            imgstr: null
        });
    });
    if (!isuser) {
        let team = allTeams.value.find((ele) => {
            ele.teamID == id
        });
        if (team == undefined) return;
        team.teamMembers.forEach(member => {
            options.value = [];
            options.value.push({
                label: member.userName,
                value: member.userID.toString()
            });
        });
    }
}
onMounted(async () => {
    if (webSocket.value == null) {
        //重新加载socket的所有事件
        try {
            webSocket.value = new WebSocket(wsURL);
            initWebSocket();
        } catch (error) {
            message.error('webSocket cannot connect to server');
        }
    }
    //问服务器要一些东西
    let res = await mypost(message, '/team/viewTeam', {});
    if (!res) {
        return;
    }
    console.log(res);


});
</script>
<style scoped>
.msg_tool_button {
    height: 40px;
    width: 40px;
    margin-top: 13px;
    margin-left: 10px;
}

.parentContainer {
    display: flex;
    background-color: antiquewhite;
    height: 100%;
}

.leftContainer {
    height: 100%;
    background-color: #ccc;
}

.recentMsgContainer {
    width: 150px;
}

.rightChatRoomContainer {
    width: 100%;
    height: 100%;
    background-color: blue;
    display: flex;
    flex-flow: column;
}

.targetUserContainer {
    height: 50px;
    background-color: #ccc;
    display: flex;
}

.targetUser {
    width: fit-content;
    margin: 10px;
}

.rightChatContentContainer {
    background-color: blue;
    height: calc(100% - 50px);
    width: 100%;
}

.chatContentLayout {
    background-color: beige;
    height: 100%;
}

.chatContent {
    height: calc(100% - 70px);
}

.chatToolFooter {
    height: 70px;
}

.chatToolContainer {
    display: flex;
    line-height: 70px;
    background-color: #ccc;
    width: 100%;
    height: 70px;
}

.msgBoxForm {
    width: 100%;
}

.msgBox {
    font-size: 20px;
    margin-left: 20px;
    text-align: left;
    width: calc(100% - 30px)
}

.teamNameContainer {
    height: 100%;
    width: 120px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>