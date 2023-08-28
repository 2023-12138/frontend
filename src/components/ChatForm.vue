<template>
    <div class="parentContainer">
        <div class="leftChatRoomMenu">
            <n-tabs style="width: 180px;" :value="selectedTab" placement="bottom" type="bar" animated
                pane-wrapper-class="paneWrapper" pane-class="pane" justify-content="space-around">
                <n-tab-pane name="currentmessages" tab="消息">
                    <n-list hoverable clickable>
                        <n-list-item style="padding: 15px;width: 180px;" horizontal v-for="item in recentChatList"
                            @click="startChat(item.id, item.isuser, item.userOrTeamName)">
                            <div style="display: flex;justify-content: space-around;">
                                <n-avatar :size="16" src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" />
                                <n-ellipsis style="max-width: 120px; width: 120px;">{{ item.userOrTeamName }}</n-ellipsis>
                            </div>
                        </n-list-item>
                    </n-list>
                </n-tab-pane>
                <n-tab-pane name="teams" tab="团队">
                    <n-list hoverable clickable>
                        <n-list-item v-for="team in allTeams" @click="onTeamClicked(team.teamID, team.teamName);">
                            <div class="teamNameContainer">
                                <n-avatar :size="16" src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" />
                                <n-ellipsis style="max-width: 80px;width: 100%;">{{ team.teamName }}</n-ellipsis>
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
                        <ChatMessage v-for="msg in msgList" :title="msg.userName" :content="msg.msg" :time="msg.time"
                            :rid="msg.rid" :io="io" ref="SetItemRef" />
                        <!-- <n-card size="medium" style="margin-top: 10px;" v-for="msg in msgList">
                            <n-space vertical>
                                <div style="display: flex; justify-content: space-between;">
                                    <n-h6>{{ msg.userName }}</n-h6>
                                    <span>{{ msg.time }}</span>
                                </div>
                                <span>{{ msg.msg }}</span>
                            </n-space>
                        </n-card> -->
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
import { ref, onMounted, nextTick, onBeforeUpdate } from 'vue'
import { ImageOutline } from '@vicons/ionicons5'
import { RecentListModel, TeamModel, useChatContainer } from '@/store/store'
import { storeToRefs } from 'pinia';
import { NMention, NTabs, useMessage } from 'naive-ui';
import { mypost } from '@/axios/axios';
import ChatMessage from '@/components/ChatMessage.vue';
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
function onMsgboxSubmitted(e: SubmitEvent) {
    e.preventDefault();
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
            message: inputMessage.value,
            to_uid: currentChatID.value.isuser ? currentChatID.value.id : '',
            tid: currentChatID.value.isuser ? '' : currentChatID.value.id, from_uid: myuid.value,
            aite: atlist
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
    const data = JSON.parse(e.data);
    //message,senderId,teamId,time
    let message: string = data.message;
    let senderId: number = data.senderId;
    let currentTime: string = data.time;
    let msgtype: string = data.type;
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
        // :todo
        if (isuser) {
            mypost(message, 'chat/getHistory', { senderId: id, tid: '' });
        } else {
            //请求team的历史数据
            // :todo
            mypost(message, 'chat/getHistory', { tid: id, senderId: '' });
        }

        //添加到最近聊天中
        recentChatList.value.push({
            userOrTeamName: targetUName,
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
onMounted(async () => {
    onOpenMsgFromNotice.value = (teamID: number, rid: number) => {

        onTeamClicked(teamID, allTeams.value.find(ele => ele.teamID == teamID)?.teamName || 'O_o :(');
        //开始滚动然后高亮
        setTimeout(() => {
            container.msgElements.find(ele => ele.rid == rid)?.element.scrollIntoView({
                block: 'nearest',
                inline: 'nearest',
                behavior: 'smooth'
            });
        }, 1000);
    };
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
    const li: {
        teamlist: {
            tid: number;
            teamname: string;
            teaminform: string;
            is_active: boolean;
        }[]
    } = res;
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

/* .leftContainer {
    height: 100%;
    width: 25%;
    background-color: #ccc;
} */

.leftChatRoomMenu {
    width: 180px;
    height: 100%;
    background-color: #ccc;
    display: flex;
    justify-content: flex-end;

}

.recentMsgContainer {
    height: 100%;
    width: 150px;
    overflow-y: hidden;
}

.n-tabs {
    height: 100% !important;
    justify-content: space-between !important;
}

.pane {
    height: 100%;
    overflow-y: scroll;
}


.n-tabs.n-tabs--bottom .n-tab-pane {
    padding: 0 !important;
}

.n-list-item {
    padding-right: 10px !important;
    padding-left: 10px !important;
}

.rightChatRoomContainer {
    width: 80%;
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
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
}
</style>