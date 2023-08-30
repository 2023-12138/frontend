<template>
    <div class="parentContainer">
        <div class="leftChatRoomMenu">
            <n-tabs 
                :value="selectedTab" 
                placement="bottom" 
                type="bar" 
                animated 
                size="large"
                pane-wrapper-style="width:100%;height:100%;" 
                pane-class="pane" 
                justify-content="space-evenly" 
                tab-style="height:50px;width:4rem;justify-content:center;"
            >
                <n-tab-pane name="currentmessages" tab="消息">
                    <n-layout :native-scrollbar="false" style="height: 100%;">
                        <n-list hoverable clickable>
                            <n-list-item class="chatListItemContainer" v-for="item in recentChatList"
                                @click="startChat(item.id, item.isuser, item.userOrTeamName)">
                                <div class="chatListItem">
                                    <n-avatar round :size="40"
                                        src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" />
                                    <div class="chatListItemRight">
                                        <div class="chatName">{{ item.userOrTeamName }}</div>
                                        <div class="chatText">最近消息</div>
                                    </div>
                                </div>
                            </n-list-item>
                        </n-list>
                    </n-layout>
                </n-tab-pane>
                <n-tab-pane name="teams" tab="团队">
                    <n-layout :native-scrollbar="false" style="height: 100%;">
                        <n-list hoverable clickable>
                            <n-list-item class="chatListItemContainer" v-for="team in allTeams"
                                @click="onTeamClicked(team.teamID, team.teamName);">
                                <div class="chatListItem">
                                    <n-avatar round :size="40"
                                        src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" />
                                    <div class="chatListItemRight chatTeam">
                                        <div class="chatName">{{ team.teamName }}</div>
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
                                </div>
                            </n-list-item>
                        </n-list>
                    </n-layout>
                </n-tab-pane>
            </n-tabs>
        </div>
        <div class="rightChatRoomContainer">
            <n-h3 class="empty" v-show="currentChatID.id == -1">选择一个团队或联系人开始聊天</n-h3>
            <div class="rightChatRoom" v-show="currentChatID.id != -1">
                <div class="targetUserContainer">
                    <span class="targetUser">{{ currentChatName }}</span>
                </div>
                <div class="rightChatContentContainer">
                    <div class="chatContent" content-style="padding: 24px;">
                        <n-layout style="height: 100%;" :native-scrollbar="false">
                            <ChatMessage v-for="msg in msgList" :title="msg.userName" :content="msg.msg" :time="msg.time"
                                :rid="msg.rid" :io="io" :is-myself="msg.userName == myname" ref="SetItemRef" />
                        </n-layout>
                    </div>
                    <div class="chatToolFooter">
                        <div class="chatTools">
                            <n-button strong quaternary circle type="primary" class="msg_tool_button">
                                <template #icon>
                                    <n-icon>
                                        <ImageOutline />
                                    </n-icon>
                                </template>
                            </n-button>
                            <n-button strong quaternary circle type="primary" class="msg_tool_button">
                                <template #icon>
                                    <n-icon>
                                        <ImageOutline />
                                    </n-icon>
                                </template>
                            </n-button>
                        </div>
                        <div class="msgBoxForm">
                            <n-mention type="textarea" v-model:value="inputMessage" placeholder="Message" :options="options"
                                class="msgBox" :autosize="{ minRows: 3, maxRows: 3 }" @keydown="onMsgboxSubmitted" />
                            <div class="submitButton">
                                <n-button strong secondary type="primary" @click="sendMessage">发送</n-button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, onBeforeUpdate } from 'vue'
import { ImageOutline } from '@vicons/ionicons5'
import { RecentListModel, TeamModel, useChatContainer } from '@/store/store'
import { storeToRefs } from 'pinia';
import { NMention, NTabs, UploadCustomRequestOptions, useMessage } from 'naive-ui';
import { mypost } from '@/axios/axios';
import ChatMessage from '@/components/ChatMessage.vue';
import axios from 'axios';
import { useMessengerStore } from '@/store/messengerStore';
const messengerStore = useMessengerStore();
const container = useChatContainer();
const { recentChatList, msgList, webSocket, allTeams, currentChatID, currentChatName, onOpenMsgFromNotice, recvHandler, myname } = storeToRefs(container);
const myuid = ref(parseInt(localStorage.getItem('uid') || '-1'));
const options = ref<{
    label: string,
    value: string
}[]>([]);
let MessageComponents: any[] = [];
const inputMessage = ref('');
const message = useMessage();
const SetItemRef = (el: any) => {
    MessageComponents.push(el);
}
onBeforeUpdate(() => {
    MessageComponents = [];
});

const selectedTab = ref<string | undefined>(undefined);
const io = new IntersectionObserver(eles => {
    eles.forEach(ioe => {
        const element = ioe.target;
        const ratio = ioe.intersectionRatio;
        if (ratio > 0 && ratio <= 1) {
            //todo:发送已读请求
            io.unobserve(element);
            console.log(`${element} 可视`);
            let div: any = element;
            console.log("riddddd" + div['rid']);
            mypost(message, '/notice/haveread', { rid: div['rid'] });
        }
    });
});
function onMsgboxSubmitted(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
}
function sendMessage() {
    if (inputMessage.value.trim() === '') {
        inputMessage.value = '';
        message.warning('不能发送空白内容')
        return;
    }
    if (webSocket.value?.readyState != WebSocket.OPEN) {
        message.error('webSocket Disconnected');
    }
    try { //判断@了哪些人
        let atlist: Array<number> = [];

        if (!currentChatID.value.isuser) {

            options.value.forEach(option => {
                if (inputMessage.value.includes(`@${option.value}`)) {
                    if (option.value == "全体成员") {
                        atlist.push(-1);
                    } else {
                        const team = allTeams.value.find((ele) => ele.teamID == currentChatID.value.id);
                        atlist.push(team?.teamMembers.find(ele => ele.userName == option.value)?.userID || NaN);
                    }
                }
            });
        }
        const newLocal = JSON.stringify({
            type: 'chat',
            data: {
                message: inputMessage.value,
                to_uid: currentChatID.value.isuser ? currentChatID.value.id : '',
                tid: currentChatID.value.isuser ? '' : currentChatID.value.id, from_uid: myuid.value,
                aite: atlist
            }
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
                    onUserClicked(member.userID, member.userName);
                }
            }
        })
    });
    return options;
}

async function onMessage(e: MessageEvent<any>, recent: RecentListModel, senderName: string) {
    let data = JSON.parse(e.data);
    let msgtype: string = data.type;
    data = data.data;
    //message,senderId,teamId,time
    let message: string = data.message;
    let senderId: number = data.senderId;
    let currentTime: string = data.time;
    let rid: number = parseInt(data.rid);
    if (msgtype != 'chat_aite') rid = NaN;
    //判断是否正在展示
    if (currentChatID.value.id == recent.id) {
        msgList.value.push({
            userName: senderName,
            msg: message,
            userID: senderId,
            time: currentTime,
            imgstr: null,
            rid: rid
        });
    }
}

recvHandler.value = onMessage;

function onTeamClicked(id: number, targetUserName: string) {
    selectedTab.value = 'currentmessages';
    nextTick(() => {
        selectedTab.value = undefined;
    })
    currentChatID.value = { id: id, isuser: false };
    startChat(id, false, targetUserName);
}
function onUserClicked(id: number, targetUserName: string) {
    selectedTab.value = 'currentmessages';
    nextTick(() => {
        selectedTab.value = undefined;
    })
    currentChatID.value = { id: id, isuser: true };
    startChat(id, true, targetUserName);
}
function startChat(id: number, isuser: boolean, targetUName: string) {
    if (recentChatList.value.find((ele) => ele.id == id && ele.isuser == isuser) == undefined) {
        //没找到,问服务器请求历史数据 
        recentChatList.value.push({
            userOrTeamName: targetUName,
            id: id,
            isuser: isuser,
            lastMsg: null,
            Messages: []
        });
        // :todo
        if (isuser) {
            mypost(message, 'chat/getHistory', { senderId: id, tid: '' });
        } else {
            //请求team的历史数据
            // :todo
            mypost(message, 'chat/getHistory', { tid: id, senderId: '' });
        }

        //添加到最近聊天中

    }

    changeChatContent(id, isuser);
}
messengerStore.registerMessage('chatform_startchat', (arg: { id: number, isuser: boolean, targetUName: string }) => {
    //startChat(arg.id, arg.isuser, arg.targetUName);
    const id = arg.id;
    const isuser = arg.isuser;
    const targetUName = arg.targetUName;
    if (recentChatList.value.find((ele) => ele.id == id && ele.isuser == isuser) == undefined) {
        //没找到,问服务器请求历史数据 
        // :todo
        recentChatList.value.push({
            userOrTeamName: targetUName,
            id: id,
            isuser: isuser,
            lastMsg: null,
            Messages: []
        });
        if (isuser) {
            mypost(message, 'chat/getHistory', { senderId: id, tid: '' });
        } else {
            //请求team的历史数据
            // :todo
            mypost(message, 'chat/getHistory', { tid: id, senderId: '' });
        }

        //添加到最近聊天中

    }
})
function changeChatContent(id: number, isuser: boolean) {
    msgList.value = [];
    container.msgElements = [];
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
            imgstr: null,
            rid: message.rid
        });
    });
    if (!isuser) {
        let team = allTeams.value.find((ele) => ele.teamID == id);
        if (team == undefined) return;
        options.value = [];
        options.value.push({
            label: '全体成员',
            value: '全体成员'
        });
        team.teamMembers.forEach(member => {
            options.value.push({
                label: member.userName,
                value: member.userName,
            });
        });
    }
}
onOpenMsgFromNotice.value = (teamID: number, rid: number) => {

    onTeamClicked(teamID, allTeams.value.find(ele => ele.teamID == teamID)?.teamName || 'O_o :(');
    //开始滚动然后高亮
    setTimeout(() => {
        container.msgElements.find(ele => ele.rid == rid)?.element.scrollIntoView({
            block: 'nearest',
            inline: 'nearest',
            behavior: 'smooth'
        });
    }, 2000);
};
onMounted(async () => {

    if (webSocket.value == null) {
        // //重新加载socket的所有事件
        // try {
        //     webSocket.value = new WebSocket(wsURL);
        //     initWebSocket();
        // } catch (error) {
        //     message.error('webSocket cannot connect to server');
        // }
        message.error('ws dis connect');
        return;
    }
    //问服务器要一些东西
    if (myname.value == "") {
        let res = await mypost(message, '/user/showInfo', {});
        if (!res) return;
        myname.value = res.info.username;
    }
    let res = await mypost(message, '/team/viewTeam', {});
    if (!res) {
        return;
    }
    // const li: {
    //     teamlist: {
    //         tid: number;
    //         teamname: string;
    //         teaminform: string;
    //         is_active: boolean;
    //     }[]
    // } = res;
    // allTeams.value = [];
    // for (const ateam of li.teamlist) {
    //     const teammembers: {
    //         userName: string;
    //         userID: number;
    //     }[] = [];
    //     let mres = await mypost(message, '/team/viewUser', { tid: ateam.tid });
    //     if (!mres) return;
    //     for (const member of mres.userlist) {
    //         teammembers.push({
    //             userName: member.username,
    //             userID: member.uid
    //         });
    //     }
    //     allTeams.value.push({
    //         teamName: ateam.teamname,
    //         teamID: ateam.tid,
    //         teamMembers: teammembers
    //     });
    // }


});
const picCustomRequest = ({
    file
}: UploadCustomRequestOptions) => {
    const formData = new FormData();
    formData.append('key', file.name);
    formData.append('file', file.file as File);
    axios.post('http://101.43.202.84:7002/chat/savefile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }).then((res) => {
        console.log(res);
        webSocket.value?.send(JSON.stringify({
            type: 'chat_pic', data: {
                message: res.data.data.url,
                to_uid: currentChatID.value.isuser ? currentChatID.value.id : '',
                tid: currentChatID.value.isuser ? '' : currentChatID.value.id, from_uid: myuid.value,
            }
        }));
    }).catch((_) => message.error('文件上传失败'));
}
const fileCustomRequest = ({
    file
}: UploadCustomRequestOptions) => {
    const formData = new FormData();
    formData.append('key', file.name);
    formData.append('file', file.file as File);
    axios.post('http://101.43.202.84:7002/chat/savefile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }).then((res) => {
        console.log(res);
        webSocket.value?.send(JSON.stringify({
            type: 'chat_file', data: {
                message: res.data.data.url,
                to_uid: currentChatID.value.isuser ? currentChatID.value.id : '',
                tid: currentChatID.value.isuser ? '' : currentChatID.value.id, from_uid: myuid.value,
            }
        }));
    }).catch((_) => message.error('文件上传失败'));
}
</script>
<style scoped>
.parentContainer {
    display: flex;
    height: 100%;
    width: 100%;

    .leftChatRoomMenu {
        width: 25%;
        height: 100%;
        display: flex;

        .n-tabs {
            width: 100%;
            height: 100%;
            justify-content: space-between !important;
        }

        .chatListItemContainer {
            min-height: 65px;
            height: 65px;
            width: 100%;

            .chatListItem {
                height: 65px;
                display: flex;
                justify-content: space-evenly;
                align-items: center;

                .chatListItemRight {
                    width: 70%;
                    height: 80%;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;

                    .chatName {
                        min-width: 50px;
                        max-width: 125px;
                        font-size: 16px;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                    }

                    .chatText {
                        font-size: 13px;
                        color: #777;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                }

                .chatTeam {
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-between;
                }
            }
        }
    }

    .rightChatRoomContainer {
        width: 75%;
        height: 100%;

        .empty {
            width: 100%;
            height: 100%;
            background-color: aliceblue;
            text-align: center;
        }

        .rightChatRoom {
            width: 100%;
            height: 100%;
            display: flex;
            flex-flow: column;

            .targetUserContainer {
                height: 65px;
                background-color: #ccc;
                display: flex;
                align-items: center;
                padding-left: 4%;

                .targetUser {
                    font-size: 18px;
                }
            }

            .rightChatContentContainer {
                height: calc(100% - 65px);
                width: 100%;
                /* display: flex;
                flex-direction: column; */

                .chatContent {
                    height: 70%;
                }

                .chatToolFooter {
                    min-height: 70px;
                    height: 30%;
                    display: flex;
                    flex-direction: column;

                    .chatTools {
                        height: 25%;
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;

                        .msg_tool_button {
                            max-height: 30px;
                            max-width: 30px;
                            margin-left: 5px;

                            &:first-child {
                                margin-left: 2.7%;
                            }
                        }
                    }

                    .msgBoxForm {
                        width: 100%;
                        height: 75%;

                        .msgBox {
                            height: calc(100% - 30px);
                            font-size: 20px;
                            margin-left: 20px;
                            text-align: left;
                            width: calc(100% - 30px);


                        }

                        .submitButton {
                            height: 30px;
                            width: 100%;
                            display: flex;
                            justify-content: flex-end;

                            .n-button {
                                width: 100px;
                                height: 100%;
                                margin-right: 1.3%;
                            }
                        }
                    }
                }
            }
        }
    }
}

.n-input-wrapper {
    height: 500px !important;
    resize: none !important;
}

textarea {
    resize: none !important;
}

.pane {
    width: 100%;
    height: 100% !important;
}

.recentMsgContainer {
    height: 100%;
    width: 150px;
    overflow-y: hidden;
}



.n-tabs.n-tabs--bottom .n-tab-pane {
    padding: 0 !important;
}

.n-list-item {
    padding-right: 10px !important;
    padding-left: 10px !important;
}

.chatToolContainer {
    display: flex;
    line-height: 70px;
    background-color: #ccc;
    width: 100%;
    height: 70px;
}

.teamNameContainer {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
}
</style>