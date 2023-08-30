import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'
export type TeamModel = { teamName: string; teamID: number; teamMembers: Array<{ userName: string, userID: number }> };
export type RecentListModel = {
    //聊天的名称，用户名或者团队名
    userOrTeamName: string;
    id: number;
    isuser: boolean;
    lastMsg: string | null;
    Messages: MessageModel[];
};
export type MessageModel = {
    userName: string; //发送者的name
    msg: string;
    userID: number; //发送者的id
    time: string; //消息发送的时间
    imgstr: string | null;
    rid: number;
};
export const useChatContainer = defineStore('chatroom', () => {
    //是否展示
    const chatShowModal = ref<boolean>(false)
    //团队列表，如果消息列表中有，则展示即可；如果没有，向服务器请求
    const allTeams = ref<TeamModel[]>([]);
    //显示在消息中，最近列表
    const recentChatList = ref<RecentListModel[]>([]);
    //消息列表，会随着点击消息变化
    const msgList = ref<MessageModel[]>([]);
    //聊天对象的id，tid or uid
    const currentChatID = ref({
        id: -1, isuser: true
    });
    const recvHandler = ref<((e: MessageEvent<any>, recent: RecentListModel, senderName: string) => Promise<void>) | null>(null);
    const myname = ref('');
    const msgElements = ref<{ rid: number, element: Element }[]>([]);
    const currentChatName = ref("User");
    const webSocket = ref<WebSocket | null>(null);
    //const onNewAT: Ref<((teamID: number, teamName: string, rid: number) => void) | null> = ref(null);
    const onOpenMsgFromNotice: Ref<((teamID: number, rid: number) => void) | null> = ref(null);
    return { chatShowModal, recentChatList, msgList, webSocket, allTeams, currentChatID, currentChatName, onOpenMsgFromNotice, msgElements, recvHandler, myname }
})