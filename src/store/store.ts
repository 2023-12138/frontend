import { defineStore } from 'pinia'
import { ref } from 'vue'
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
};
export const useChatContainer = defineStore('chatroom', () => {
    //团队列表，如果消息列表中有，则展示即可；如果没有，向服务器请求
    const allTeams = ref<TeamModel[]>(
        [
            {
                teamName: "ATeam", teamID: 123, teamMembers: [{ userName: "Freeman1", userID: 2 }, { userName: "TestUser1", userID: 3 }]
            },
            {
                teamName: "FK", teamID: 256, teamMembers: [{ userName: "Freeman2", userID: 4 }, { userName: "TestUser2", userID: 5 }]
            }
        ]
    );
    //显示在消息中，最近列表
    const recentChatList = ref<RecentListModel[]>([]);
    //消息列表，会随着点击消息变化
    const msgList = ref<MessageModel[]>([]);
    //聊天对象的id，tid or uid
    const currentChatID = ref({
        id: -1, isuser: true
    });
    const currentChatName = ref("User");
    const webSocket = ref<WebSocket | null>(null);
    return { recentChatList, msgList, webSocket, allTeams, currentChatID, currentChatName }
})