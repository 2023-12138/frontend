<template>
    <div class="parentContainer">
        <div class="leftChatRoomMenu">
            <n-tabs :value="selectedTab" placement="bottom" type="bar" animated size="large"
                pane-wrapper-style="width:100%;height:100%;" pane-class="pane" justify-content="space-evenly"
                tab-style="height:50px;width:4rem;justify-content:center;">
                <n-tab-pane name="currentmessages" tab="消息">
                    <n-layout :native-scrollbar="false" style="height: 100%;">
                        <n-list hoverable clickable>
                            <n-list-item class="chatListItemContainer" v-for="item in  recentChatList "
                                @click="startChat(item.id, item.isuser, item.userOrTeamName)">
                                <div class="chatListItem">
                                    <n-avatar v-if="item.isuser" round :size="40" color="#82cefd"
                                        :src="userAvatars.get(item.id)">
                                    </n-avatar>
                                    <n-avatar v-else round :size="40" color="#82cefd">
                                        <n-icon>
                                            <PeopleSharp />
                                        </n-icon>
                                    </n-avatar>
                                    <div class="chatListItemRight">
                                        <div class="chatName">{{ item.userOrTeamName }}</div>
                                        <div class="chatText">{{ item.lastMsg }}</div>
                                    </div>
                                </div>
                            </n-list-item>
                        </n-list>
                    </n-layout>
                </n-tab-pane>
                <n-tab-pane name="teams" tab="团队">
                    <n-layout :native-scrollbar="false" style="height: 100%;">
                        <n-list hoverable clickable>
                            <n-list-item class="chatListItemContainer" v-for=" team  in  allTeams "
                                @click="onTeamClicked(team.teamID, team.teamName);">
                                <div class="chatListItem">
                                    <n-avatar round :size="40" color="#82cefd">
                                        <n-icon>
                                            <PeopleSharp />
                                        </n-icon>
                                    </n-avatar>
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
            <div class="empty" v-show="currentChatID.id == -1">
                <n-icon :size="70" :component="Empty" color="write" />
                <div>
                    选择一个团队或联系人开始聊天吧
                </div>
                <span>（〃｀ 3′〃）</span>
            </div>
            <div class="rightChatRoom" v-show="currentChatID.id != -1">
                <div class="targetUserContainer">
                    <span class="targetUser">{{ currentChatName }}</span>
                    <n-button class="searchButton" quaternary circle type="info" @click="showSearchModal = true">
                        <template #icon>
                            <n-icon>
                                <Search />
                            </n-icon>
                        </template>
                    </n-button>
                    <n-modal v-model:show="showSearchModal" transform-origin="center" preset="card"
                        content-style="padding:0;border-radius:10px;" header-style="padding: 0px;display: none;"
                        style="width: 40vw; min-width: 30vw; margin-top: 80px; border-radius: 20px;" size="huge">
                        <div class="searchContainer">
                            <n-icon size="30" color="#82cefd"
                                style="position: absolute; z-index:4; top: 50%; transform: translate(0,-50%);">
                                <Search />
                            </n-icon>
                            <n-auto-complete class="autocmp" clear-after-select @select="searchSelected"
                                v-model:value="searchValue" :options="searchOptions" placeholder="搜索聊天历史记录"
                                :render-label="renderSearchLabel" size="large" />
                        </div>
                    </n-modal>
                </div>
                <div class="rightChatContentContainer">
                    <div class="chatContent" content-style="padding: 24px;">
                        <n-layout style="height: 100%;    background-color: rgb(245, 245, 245);" :native-scrollbar="false">
                            <ChatMessage v-for=" msg  in  msgList " :title="msg.userName" :content="msg.msg"
                                :time="msg.time" :rid="msg.rid" :io="io" :is-myself="msg.userName == myname"
                                :type="msg.type" ref="SetItemRef" :uid="msg.userID" :isAite="msg.isAite" />
                        </n-layout>
                    </div>
                    <div class="chatToolFooter">
                        <div class="chatTools">
                            <n-upload ref="picupload" abstract :custom-request="picCustomRequest" show-file-list>
                                <n-upload-trigger #="{ handleClick }" abstract>
                                    <n-button @click="handleClick" strong quaternary circle type="primary"
                                        class="msg_tool_button">
                                        <template #icon>
                                            <n-icon>
                                                <ImageOutline />
                                            </n-icon>
                                        </template>
                                    </n-button>
                                </n-upload-trigger>
                            </n-upload>
                            <n-upload ref="fileupload" abstract :custom-request="fileCustomRequest"
                                :default-file-list="fileList">
                                <n-upload-trigger #="{ handleClick }" abstract>
                                    <n-button @click="handleClick" strong quaternary circle type="primary"
                                        class="msg_tool_button">
                                        <template #icon>
                                            <n-icon>
                                                <FilePicture />
                                            </n-icon>
                                        </template>
                                    </n-button>
                                </n-upload-trigger>
                            </n-upload>
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
import { ref, onMounted, nextTick, onBeforeUpdate, computed, h, VNodeChild } from 'vue'
import { ImageOutline, PeopleSharp, Search } from '@vicons/ionicons5'
import { ChatBubblesQuestion20Regular as Empty, DocumentArrowUp16Regular as FilePicture } from '@vicons/fluent'
import { RecentListModel, TeamModel, useChatContainer } from '@/store/store'
import { storeToRefs } from 'pinia';
import { NAvatar, NEllipsis, NMention, NTabs, SelectOption, UploadCustomRequestOptions, useMessage } from 'naive-ui';
import { mypost } from '@/axios/axios';
import ChatMessage from '@/components/ChatMessage.vue';
import axios from 'axios';
import { useMessengerStore } from '@/store/messengerStore';
const messengerStore = useMessengerStore();
const container = useChatContainer();
const { recentChatList, msgList, webSocket, allTeams, currentChatID, currentChatName, onOpenMsgFromNotice, recvHandler, myname, options, userAvatars } = storeToRefs(container);
const myuid = ref(parseInt(localStorage.getItem('uid') || '-1'));

const picupload = ref();
const fileupload = ref();
let MessageComponents: any[] = [];
const inputMessage = ref('');
const message = useMessage();
const SetItemRef = (el: any) => {
    MessageComponents.push(el);
}
function getLastMessage(item: RecentListModel) {
    debugger;
    const lastmes = item.Messages[item.Messages.length - 1];
    if (lastmes.type == 'file') return '[文件]';
    if (lastmes.type == 'img') return '[图片]';
    return lastmes.msg;
}
const showSearchModal = ref(false);
const fileList = ref([]);
onBeforeUpdate(() => {
    MessageComponents = [];
});
const searchValue = ref('');
const searchOptions = computed(() => {
    const toret: {
        label: string;
        value: string;
    }[] = [];
    msgList.value.forEach(msg => {
        if (msg.msg.includes(searchValue.value) && msg.type == "text")
            toret.push({
                label: `${msg.userName} : ${msg.msg}`,
                value: `${msg.userID},${msg.rid}`
            });
    });
    return toret;
});
const renderSearchLabel = (option: SelectOption): VNodeChild => [
    h('div', { style: 'display:flex;align-items:center;margin:3px;padding:3px;' }, [
        h(NAvatar, { round: true, src: userAvatars.value.get(parseInt(option?.value?.toString().split(',')[0] as string)), style: 'margin-right:10px;' }),
        h(NEllipsis as any, { style: 'max-width: 80%' }, option.label as any)
    ])
];
function searchSelected(value: string) {
    console.log(value);
    showSearchModal.value = false;
    setTimeout(() => {
        let element = container.msgElements.reverse().find(ele => ele.rid == parseInt(value.split(',')[1]))?.element;
        element?.scrollIntoView({
            block: 'nearest',
            inline: 'nearest',
            behavior: 'smooth'
        });
        element?.classList.add('remind');
    }, 500);
}
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
            let team = allTeams.value.find(ele => ele.teamID == currentChatID.value.id);
            let isadmin = team?.teamMembers.find(ele => ele.userID == myuid.value)?.isAdmin;
            options.value.forEach(option => {
                if (inputMessage.value.includes(`@${option.value}`)) {
                    if (option.value == "全体成员" && isadmin) {
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
    if (msgtype == 'chat_aite_history') msgtype = 'chat_aite';
    data = data.data;
    //message,senderId,teamId,time
    let message: string = data.message;
    let senderId: number = data.senderId;
    let currentTime: string = data.time;
    let rid: number = parseInt(data.rid);
    let isaite = false;
    if (msgtype == 'chat_aite' || msgtype == 'chat_aite_history') isaite = true;
    let messagetype: "text" | "img" | "file" = 'text';
    if (msgtype == 'chat_pic') messagetype = 'img';
    else if (msgtype == 'chat_file') messagetype = 'file';
    //判断是否正在展示
    //debugger;
    if (currentChatID.value != undefined && currentChatID.value.id == recent.id) {
        msgList.value.push({
            userName: senderName,
            msg: message,
            userID: senderId,
            time: currentTime,
            imgstr: null,
            rid: rid,
            type: messagetype,
            isAite: isaite
        });
    }
}

recvHandler.value = onMessage;

function onTeamClicked(id: number, targetUserName: string) {
    selectedTab.value = 'currentmessages';
    nextTick(() => {
        selectedTab.value = undefined;
    })
    startChat(id, false, targetUserName);
}
function onUserClicked(id: number, targetUserName: string) {
    selectedTab.value = 'currentmessages';
    nextTick(() => {
        selectedTab.value = undefined;
    })
    startChat(id, true, targetUserName);
}
function startChat(id: number, isuser: boolean, targetUName: string) {
    if (currentChatID.value.id == id && currentChatID.value.isuser == isuser) return;
    currentChatID.value = { id: id, isuser: isuser };
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
// messengerStore.registerMessage('chatform_startchat', (arg: { id: number, isuser: boolean, targetUName: string }) => {
//     //startChat(arg.id, arg.isuser, arg.targetUName);
//     const id = arg.id;
//     const isuser = arg.isuser;
//     const targetUName = arg.targetUName;
//     if (recentChatList.value.find((ele) => ele.id == id && ele.isuser == isuser) == undefined) {
//         //没找到,问服务器请求历史数据 
//         // :todo
//         recentChatList.value.push({
//             userOrTeamName: targetUName,
//             id: id,
//             isuser: isuser,
//             lastMsg: null,
//             Messages: []
//         });
//         if (isuser) {
//             mypost(message, 'chat/getHistory', { senderId: id, tid: '' });
//         } else {
//             //请求team的历史数据
//             // :todo
//             mypost(message, 'chat/getHistory', { tid: id, senderId: '' });
//         }

//     }
// })
function changeChatContent(id: number, isuser: boolean) {
    msgList.value = [];
    console.log('content changing');
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
            rid: message.rid,
            type: message.type,
            isAite: message.isAite
        });
    });
    if (!isuser) {
        let team = allTeams.value.find((ele) => ele.teamID == id);
        if (team == undefined) return;
        options.value = [];
        //debugger;
        if (team.teamMembers.find(ele => ele.userID == myuid.value)?.isAdmin)
            options.value.push({
                label: '全体成员',
                value: '全体成员'
            });
        team.teamMembers.forEach(member => {
            if (member.userID == myuid.value) return;
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
        //debugger;
        let element = container.msgElements.reverse().find(ele => ele.rid == rid)?.element;
        element?.scrollIntoView({
            block: 'nearest',
            inline: 'nearest',
            behavior: 'smooth'
        });
        element?.classList.add('remind');
        console.log(element);

    }, 500);
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


});
const picCustomRequest = ({
    file
}: UploadCustomRequestOptions) => {
    console.log('upload start');
    if (file.file.type !== 'image/png' && file.file.type !== 'image/jpeg') {
        message.info('只能发送图片 :(');
        return;
    }
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
        picupload.value.clear();
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
        fileupload.value.clear();
    }).catch((_) => message.error('文件上传失败'));
}
</script>
<style scoped>
.autocmp :deep(.n-input) {
    --n-border: 'none' !important;
    --n-border-hover: 'none' !important;
    --n-border-focus: 'none' !important;
    --n-box-shadow-focus: 'none' !important;
}

.autocmp :deep(.n-input__input) {
    margin-left: 20px;
}


.parentContainer {
    display: flex;
    height: 100%;
    width: 100%;

    .leftChatRoomMenu {
        width: 25%;
        height: 100%;
        display: flex;
        background-color: rgb(220, 221, 222);

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
            background-color: var(--primary-color);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        .rightChatRoom {
            width: 100%;
            height: 100%;
            display: flex;
            flex-flow: column;

            .targetUserContainer {
                height: 65px;
                background-color: #f3f3f3;
                border-bottom: #cccc 3px solid;
                display: flex;
                align-items: center;
                padding-left: 4%;
                justify-content: space-between;

                .targetUser {
                    font-size: 18px;
                }

                .searchButton {
                    margin-right: 20px;

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

.searchContainer {
    /* display: flex; */
    /* justify-content: space-between; */
    /* align-items: center; */

    padding: 10px;
}
</style>