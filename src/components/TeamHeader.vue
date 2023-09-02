<template>
    <div class="topNav">
        <div class="topNavLeft">
            <img src="@/assets/FUSIONCUDE-LONG1.png" height="90" width="220">
        </div>
        <div class="topNavRight" v-if="showMenu">
            <!-- 聊天 -->
            <div class="topNavRightIcon" @click="chatShowModal = true" id="intostep2">
                <n-icon size="25" :component="MessageCircle" />
            </div>
            <n-modal v-model:show="chatShowModal" class="custom-card" preset="card" style="width: 70vw;height: 95vh;"
                title="聊天室" size="huge" :bordered="false" header-style="padding:20px"
                content-style="height:70%;padding : 0 10px 10px;">
                <ChatForm />
            </n-modal>

            <!-- 消息通知 -->

            <MessageCenter />

            <!-- 头像 -->
            <div class="avatar">
                <n-config-provider :theme-overrides="avatarDropdownThemeOverrides">
                    <n-dropdown trigger="click" :options="avatarOptions" :show-arrow="true" size="huge"
                        @select="avatarHandleSelect" style="border-radius: 9px;width: 200px;">
                        <n-avatar round :size="40" :src="currentAvatar" />
                    </n-dropdown>
                </n-config-provider>
            </div>

            <!-- 创建团队Modal -->
            <n-modal v-model:show="createTeamModal" class="custom-card" preset="card" style="width: 60vw;height: 50vh;"
                title="创建团队" size="huge" :bordered="false" header-style="padding:20px" content-style="height:70%">
                <CreateTeamForm v-model:avatarOptions="avatarOptions" @updateModalStatus="updateModalStatus">
                </CreateTeamForm>
            </n-modal>

            <!-- 个人信息modal -->
            <n-modal v-model:show="userInfoModal" class="custom-card" preset="card" style="width: 25vw;height: 80vh;"
                title="个人信息" size="huge" :bordered="false" header-style="padding:20px" content-style="height:70%;">
                <div class="info">
                    <div class="infoContentFirst">
                        <div class="infoAvatar">
                            <n-upload ref="avatarUpload" abstract :custom-request="chooseAvatar"
                                :default-file-list="fileList">
                                <n-upload-trigger #="{ handleClick }" abstract>
                                    <div class="infoAvatarContainer" @click="handleClick">
                                        <n-avatar round :size="45" :src="currentAvatar" />
                                        <div class="changeAvatar">
                                            <n-icon color="white" :size="30" :component="IosReverseCamera" />
                                        </div>
                                    </div>
                                </n-upload-trigger>
                            </n-upload>
                        </div>
                        <div class="infoContent">
                            <span>昵称</span>
                            <span v-if="!showChangeInput[0]">{{ userName }}</span>
                            <n-input v-else v-model:value="changeForm[0]" type="text"></n-input>
                        </div>
                    </div>
                    <div class="operations">
                        <n-button v-if="!showChangeInput[0]" text type="primary"
                            @click="showChangeInput[0] = !showChangeInput[0]">
                            修改
                        </n-button>
                        <template v-else>
                            <n-button text type="primary" @click="changeInfo(0)" style="margin-right: 10%;">
                                保存
                            </n-button>
                            <n-button text type="default" @click="showChangeInput[0] = !showChangeInput[0]">
                                取消
                            </n-button>
                        </template>
                    </div>
                </div>
                <div class="info">
                    <div class="infoContent">
                        <span>手机号</span>
                        <span v-if="!showChangeInput[1]">{{ phone }}</span>
                        <n-input v-else v-model:value="changeForm[1]" type="text"></n-input>
                    </div>
                    <div class="operations">
                        <n-button v-if="!showChangeInput[1]" text type="primary"
                            @click="showChangeInput[1] = !showChangeInput[1]">
                            修改
                        </n-button>
                        <template v-else>
                            <n-button text type="primary" @click="changeInfo(1)" style="margin-right: 10%;">
                                保存
                            </n-button>
                            <n-button text type="default" @click="showChangeInput[1] = !showChangeInput[1]">
                                取消
                            </n-button>
                        </template>
                    </div>
                </div>
                <div class="info">
                    <div class="infoContent">
                        <span>真实姓名</span>
                        <span>{{ realName }}</span>
                    </div>
                </div>
                <div class="info">
                    <div class="infoContent">
                        <span>邮箱</span>
                        <span>{{ email }}</span>
                    </div>
                </div>
                <div class="changePassword">
                    <n-button text type="primary" style="margin-right: 10%;"
                        @click="changePasswordModal = !changePasswordModal">
                        修改密码
                    </n-button>
                </div>
            </n-modal>
            <!-- 修改头像 -->
            <n-modal v-model:show="changeAvatarModal" preset="card" style="width: 30vw;height: 70vh;">
                <div style="width: 100%; height: 90%;">
                    <vueCropper ref="cropper" :img="imgbase" centerBox="true" autoCrop="true" outputSize="1"
                        outputType="png" fixedNumber="1" fixedBox="true" autoCropWidth="200" autoCropHeight="200"
                        limitMinSize="50">
                    </vueCropper>
                </div>
                <div class="changeAvatarButtons">
                    <n-button strong secondary type="primary" style="margin-top: 20px;width: 20%;" @click="changeAvatar">
                        确定
                    </n-button>
                    <n-button strong secondary type="default" style="margin-top: 20px;width: 20%;"
                        @click="changeAvatarModal = !changeAvatarModal;">
                        取消
                    </n-button>
                </div>
            </n-modal>
            <!-- 修改密码 -->
            <n-modal title="修改密码" v-model:show="changePasswordModal" preset="card" style="width: 30vw;height: 40vh;">
                <n-form ref="changePasswordForm" :model="changePasswordModel" :rules="changePasswordRules">
                    <n-form-item path="oldPassword" label="旧密码">
                        <n-input v-model:value="changePasswordModel.oldPassword" @keydown.enter.prevent
                            placeholder="请输入旧密码" />
                    </n-form-item>
                    <n-form-item path="newPassword" label="新密码">
                        <n-input v-model:value="changePasswordModel.newPassword" @keydown.enter.prevent
                            placeholder="请输入新密码" />
                    </n-form-item>
                </n-form>
                <div class="submitButtons">
                    <n-button type="info" class="submitButton" @click="changePassword">
                        确定
                    </n-button>
                    <n-button type="default" class="submitButton" @click="changePasswordModal = !changePasswordModal">
                        取消
                    </n-button>
                </div>
            </n-modal>
        </div>
    </div>
</template>

<script setup lang='ts'>

import { ref, h, onMounted, watch } from 'vue';
import { RecentListModel, useChatContainer } from '@/store/store'
import { NIcon, NButton, NAvatar, NText, NConfigProvider, useMessage, useNotification, UploadCustomRequestOptions } from 'naive-ui'
import { useTeamStore } from '@/store/teamStore'
import { MessageCircle } from '@vicons/tabler'
import { IosReverseCamera } from '@vicons/ionicons4'

import ChatForm from '@/components/ChatForm.vue'
import MessageCenter from './MessageCenter.vue';
import CreateTeamForm from '@/components/CreateTeamForm.vue'
import router from '@/routes';
import { storeToRefs } from 'pinia';
import { mypost } from '@/axios/axios';
const container = useChatContainer();
const myuid = ref(parseInt(localStorage.getItem('uid') || '-1'));
const wsURL = `ws://101.43.202.84:7002/ws/chat/${myuid.value}/`;
const { webSocket, recvHandler, allTeams, recentChatList, myname, chatShowModal, userAvatars } = storeToRefs(container);
import axios from '@/axios/axios';
import { useMessengerStore } from '@/store/messengerStore';
import 'vue-cropper/dist/index.css';
import { VueCropper } from 'vue-cropper';
import { useRoute } from 'vue-router';

const messengerStore = useMessengerStore();

//加载头像以及用户名和当前团队
const currentAvatar = ref('');
const showMenu = ref(!location.hash.includes('protopreview'))
const route = useRoute()
watch(() => route.params, () => {
    showMenu.value = (!location.hash.includes('protopreview'))
})


//顶部头像下拉框功能
function renderCustomHeader() {
    return h(
        'div',
        {
            style: 'display: flex; align-items: center; padding: 8px 12px;'
        },
        [
            h(NAvatar, {
                round: true,
                style: 'margin-right: 12px;',
                src: currentAvatar.value
            }),
            h('div', null, [
                h('div', null, [h(NText, { depth: 2 }, { default: () => userName.value })]),
                h('div', { style: 'font-size: 12px;' }, [
                    h(
                        NText,
                        { depth: 3 },
                        { default: () => teamstore.curTeamName.value }
                    )
                ])
            ])
        ]
    )
}

const teamStore = useTeamStore();
const teamstore = storeToRefs(teamStore);



const avatarOptions = ref([
    {
        key: 'header',
        type: 'render',
        render: renderCustomHeader
    },
    {
        key: 'header-divider',
        type: 'divider'
    },
    {
        label: '个人信息',
        key: 'self-info'
    },
    {
        label: '切换团队',
        key: 'switch-team',
        children: [
        ]
    },
    {
        key: 'bottom-divider',
        type: 'divider'
    },
    {
        label: '退出登录',
        key: 'logout'
    },
])

const message = useMessage()

async function avatarHandleSelect(key: string) {
    if (key === 'create-team') {
        createTeamModal.value = true
    } else if (key === 'logout') {
        localStorage.removeItem('token')
        localStorage.removeItem('uid')
        router.push("/")
    } else if (key === 'self-info') {
        const res = await mypost(message, '/user/showInfo', {});
        if (!res) {
            return;
        }
        userName.value = res.info.username;
        phone.value = res.info.phone;
        email.value = res.info.email;
        realName.value = res.info.name;
        changeForm.value = [res.info.username, res.info.phone, res.info.email];
        userInfoModal.value = true;
    } else {
        const tid = key!.split('.')[1]
        const teamname = key!.split('.')[2]
        message.info("切换至团队" + teamname)
        teamstore.curTeam.value = tid
        teamstore.curTeamName.value = teamname
        teamstore.teamChanged.value = !(teamstore.teamChanged.value)
        router.push("/team/" + tid + "/projectmanage")
    }
}

const avatarDropdownThemeOverrides = {
    "Dropdown": {
        "borderRadius": "9px"
    }
}

let createTeamModal = ref(false)
const updateModalStatus = (status: boolean) => {
    createTeamModal.value = status;
};

//新通知实时提示
const notification = useNotification();
const newMessage = (teamId: number, teamName: string, rid: number) => {
    const n = notification.create({
        title: `你在${teamName}团队群聊被@了`,
        avatar: () =>
            h(NAvatar, {
                size: 'small',
                round: true,
                src: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg'
            }),
        meta: ' ',
        action: () =>
            h(
                NButton,
                {
                    text: true,
                    type: 'primary',
                    onClick: () => {
                        chatShowModal.value = true;
                        setTimeout(() => {
                            if (chatContainer.onOpenMsgFromNotice != null) chatContainer.onOpenMsgFromNotice(teamId, rid);
                        }, 500);
                        n.destroy()
                    }
                },
                {
                    default: () => '去查看'
                }
            ),
    })
}
const newDocMessage = (pid: number, tid: number, docid: number) => {
    const n = notification.create({
        title: `你在文档中被@了`,
        avatar: () =>
            h(NAvatar, {
                size: 'small',
                round: true,
                src: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg'
            }),
        meta: ' ',
        action: () =>
            h(
                NButton,
                {
                    text: true,
                    type: 'primary',
                    onClick: () => {
                        // chatShowModal.value = true;
                        // setTimeout(() => {
                        //     if (chatContainer.onOpenMsgFromNotice != null) chatContainer.onOpenMsgFromNotice(teamId, rid);
                        // }, 500);
                        router.push(`/team/${tid}/project/${pid}/doc/${docid}`);
                        n.destroy()
                    }
                },
                {
                    default: () => '去查看'
                }
            ),
    })
}
const chatContainer = useChatContainer();

let reconnectCount = 0;
function initWebSocket() {
    if (webSocket.value == null) return;
    webSocket.value.onmessage = async (e) => {
        let data = JSON.parse(e.data);
        let msgtype: string = data.type;
        data = data.data;
        let message: string = data.message;
        let senderId: number = data.senderId;
        let receiverId: number | string = data.receiverId;
        let teamId: number | string = data.teamId;
        let currentTime: string = data.time;
        let rid: number = parseInt(data.rid);
        let senderName: string = data.senderName;
        if (msgtype == 'doc_aite') {
            newDocMessage(data.pid, data.tid, data.docid);
            return;
        }
        if (msgtype == "chat_aite" && senderId != myuid.value) {
            newMessage(parseInt(teamId.toString()), allTeams.value.find((ele) => ele.teamID == teamId)?.teamName || "NoF :(", rid);
        }
        // if (msgtype != 'chat_aite' && msgtype != 'chat_aite_history')
        //     rid = NaN;
        //判断是否在recent中
        let isuser = (teamId == "");
        let recent: RecentListModel | undefined;
        if (isuser) {//私聊信息
            //首先判断是否是自己发出去的
            if (senderId == myuid.value) {//自己发送的消息自己收到
                recent = recentChatList.value.find((ele) => ele.id == receiverId && ele.isuser == isuser);
                if (recent == undefined) {
                    messengerStore.callMessage('chatform_startchat', { id: receiverId, isuser: isuser, targetUName: myname.value });
                    recent = recentChatList.value.find((ele) => ele.id == receiverId && ele.isuser == isuser);
                }

            } else {//别人发的消息自己收到
                recent = recentChatList.value.find((ele) => ele.id == senderId && ele.isuser == isuser);
                if (recent == undefined) {
                    messengerStore.callMessage('chatform_startchat', { id: receiverId, isuser: isuser, targetUName: senderName });
                    recent = recentChatList.value.find((ele) => ele.id == senderId && ele.isuser == isuser);

                }
            }
        }
        //群聊信息
        else { //统一处理
            recent = recentChatList.value.find((ele) => ele.id == teamId && ele.isuser == isuser);
            const team = allTeams.value.find(ele => ele.teamID == teamId);
            const name = team?.teamMembers.find(ele => ele.userID == senderId)?.userName;
            console.log(name);
            senderName = allTeams.value.find(ele => ele.teamID == teamId)?.teamMembers.find(ele1 => ele1.userID == senderId)?.userName || 'NaN :(';
            if (recent == undefined) {
                messengerStore.callMessage('chatform_startchat', { id: teamId, isuser: isuser, targetUName: team?.teamName });
                recent = recentChatList.value.find((ele) => ele.id == teamId && ele.isuser == isuser);
            }
        }


        let messagetype: "text" | "img" | "file" = 'text';
        if (msgtype == 'chat_pic') messagetype = 'img';
        else if (msgtype == 'chat_file') messagetype = 'file';
        let isaite = false;
        if (msgtype == 'chat_aite' || msgtype == 'chat_aite_history') isaite = true;
        recent?.Messages.push({
            userName: senderName,
            msg: message,
            userID: senderId,
            time: currentTime,
            imgstr: null,
            rid: rid,
            type: messagetype,
            isAite: isaite
        });

        if (recvHandler.value != null) {
            await recvHandler.value(e, recent as RecentListModel, senderName);
        }
    };
    webSocket.value.onclose = (_) => {
        if (reconnectCount > 9) {
            reconnectCount = 0;
            message.error('webSocket 重连失败(10/10)，请刷新网页！');
            return;
        }
        try {
            reconnectCount++;
            webSocket.value = new WebSocket(wsURL);
            initWebSocket();
        } catch {
            message.error('重连失败？');
        }
    }
    webSocket.value.onerror = (_) => {
        //message.error('unknown error');
    }
}
onMounted(async () => {
    axios.post('team/viewTeam', {
    }).then(res => {
        console.log(res)
        if (res.status === 200) {
            if (res.data.code === 200) {
                const privateTid = res.data.data.privateTid
                avatarOptions.value[3].children![0] = ({
                    label: '个人空间',
                    key: 'team.private' + privateTid + '.' + '个人空间',
                } as never)
                avatarOptions.value[3].children![1] = (({
                    label: '创建团队',
                    key: 'create-team'
                }) as never)
                avatarOptions.value[3].children![2] = (({
                    key: 'child-divider',
                    type: 'divider'
                }) as never)
                const teamlist = res.data.data.teamlist.filter((item: any) => item.tid !== privateTid)
                if (teamlist) {
                    teamlist.forEach((item: any, index: number) => {
                        avatarOptions.value[3].children![index + 3] = ({
                            label: item.teamname,
                            key: 'team.' + item.tid + '.' + item.teamname
                        } as never)
                    })
                }
            } else {
                message.warning(res.data.message)
            }
        } else {
            message.error('服务器错误')
        }
    })

    const temp = new VueCropper()
    console.log(temp)
    const rres = await mypost(message, '/user/showInfo', {});
    if (!rres) {
        return;
    }
    currentAvatar.value = rres.info.avatar;
    userName.value = rres.info.name;

    if (webSocket.value == null) {
        //重新加载socket的所有事件
        try {
            webSocket.value = new WebSocket(wsURL);
            initWebSocket();
        } catch (error) {
            message.error('webSocket cannot connect to server');
        }
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
    allTeams.value = [];
    for (const ateam of li.teamlist) {
        const teammembers: {
            userName: string;
            userID: number;
            isAdmin: boolean;
        }[] = [];
        let mres = await mypost(message, '/team/viewUser', { tid: ateam.tid });
        if (!mres) return;
        for (const member of mres.userlist) {
            teammembers.push({
                userName: member.username,
                userID: member.uid,
                isAdmin: (member.status == 0 || member.status == 1)
            });
            userAvatars.value.set(member.uid, member.avatar);
        }
        allTeams.value.push({
            teamName: ateam.teamname,
            teamID: ateam.tid,
            teamMembers: teammembers
        });
    }
})

//个人信息
const userInfoModal = ref(false);
const userName = ref('');
const phone = ref('');
const email = ref('');
const realName = ref('');
const changeForm = ref(['', '', '']);
const showChangeInput = ref([false, false, false]);
const changeInfo = async (index: number) => {
    //表单验证
    const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    const phonePattern = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/
    if (!phonePattern.test(changeForm.value[1])) {
        message.warning('请输入正确格式的手机号');
        showChangeInput.value[1] = !showChangeInput.value[1];
        changeForm.value[1] = phone.value;
        return;
    }
    if (!emailPattern.test(changeForm.value[2])) {
        message.warning('请输入正确格式的邮箱');
        showChangeInput.value[2] = !showChangeInput.value[2];
        changeForm.value[2] = email.value;
        return;
    }
    const res = await mypost(message, '/user/changeInfo', {
        "username": changeForm.value[0],
        "phone": changeForm.value[1],
        "email": changeForm.value[2]
    });
    if (!res) {
        return;
    }
    userName.value = changeForm.value[0];
    phone.value = changeForm.value[1];
    email.value = changeForm.value[2];
    showChangeInput.value[index] = !showChangeInput.value[index];
    message.success('修改成功！');
}
//修改头像
const changeAvatarModal = ref(false)
const imgbase = ref('');
const fileList = ref([]);
const avatarUpload = ref();
const cropper = ref();
const chooseAvatar = ({
    file
}: UploadCustomRequestOptions) => {
    const reader = new FileReader()
    reader.readAsDataURL(file.file as File);
    reader.onload = function () {
        //debugger;
        imgbase.value = reader.result as string;
    }
    avatarUpload.value.clear();
    changeAvatarModal.value = !changeAvatarModal.value;
}
const changeAvatar = () => {
    cropper.value.getCropData(async (data: string) => {
        const res = await mypost(message, '/user/changeAva', { avatar: data });
        if (!res) {
            return;
        }
        currentAvatar.value = data;
    })
    changeAvatarModal.value = !changeAvatarModal.value;
}

//修改密码
const changePasswordModal = ref(false);
const changePasswordModel = ref({ oldPassword: '', newPassword: '' });
const changePasswordRules = {
    oldPassword: [
        { required: true, message: '请输入旧密码' }
    ],
    newPassword: [
        { required: true, message: '请输入新密码' }
    ]
}
const changePassword = async () => {
    const res = await mypost(
        message,
        '/user/changePwd',
        {
            "oldPassword": changePasswordModel.value.oldPassword,
            "newPassword": changePasswordModel.value.newPassword,
        });
    if (!res) {
        return;
    }
    message.success('修改成功！')
    changePasswordModal.value = false;
}

</script>

<style scoped>
/* 顶部导航 */
.topNav {
    /* width: 100%; */
    height: 70px;
    background-image: linear-gradient(100deg, rgb(190, 218, 255), rgb(0, 195, 255) 2000px);
    display: flex;
    justify-content: space-between;
    align-items: center;

    ::v-deep(.n-input-wrapper) {
        width: 500px;
    }
}

.topNavLeft {
    /* background-color: red; */
    width: 35%;
    min-width: 200px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.topNavLeft span {
    margin-left: 15px;
    letter-spacing: 3px;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', '宋体', Arial, sans-serif;
    font-weight: bolder;
    font-size: 20px;
}

.topNavRight {
    width: 85%;
    height: 100%;
    /* background-color: blue; */
    display: flex;
    justify-content: end;
    align-items: center;
}

.topNavRightIcon {
    height: 40px;
    width: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 20px;
    cursor: pointer;
}

.avatar {
    margin-right: 1.5%;
    cursor: pointer;
}

.info {
    height: 25%;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.info::before {
    content: '';
    width: 80%;
    height: 2px;
    background-color: #eeee;
    position: absolute;
    left: 10%;
    margin-bottom: 30%;
}

.info:first-child::before {
    width: 100%;
    left: 0;
}

.infoContentFirst {
    height: 100%;
    width: 80%;
    display: flex;
    align-items: center;

    .infoContent {
        padding-left: 10px;
    }
}

.infoAvatar {
    height: 100%;
    width: 20%;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .infoAvatarContainer {
        font-size: 0;
        border-radius: 50%;
        position: relative;

        .changeAvatar {
            height: 45px;
            width: 45px;
            background-color: rgba(0, 0, 0, 0.46);
            font-size: 0;
            border-radius: 50%;
            position: absolute;
            left: 0;
            top: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
        }

        &:hover .changeAvatar {
            cursor: pointer;
            opacity: 1;
            transition: .3s linear;
        }
    }
}

.infoContent {
    height: 60%;
    width: 70%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;

    >span:first-child {
        font-size: 17px;
        color: rgb(96, 90, 131)
    }
}

.operations {
    height: 100%;
    width: 30%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

.changeAvatarButtons {
    height: 10%;
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
}

.changePassword {
    height: 10%;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    position: absolute;
    right: 0;
    bottom: 1%;
}

.submitButtons {
    display: flex;
    justify-content: space-evenly;
    width: 100%;

    .submitButton {
        width: 40%;
    }
}
</style>
