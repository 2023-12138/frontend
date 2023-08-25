import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useChatContainer = defineStore('chatroom', () => {
    //团队列表
    const allTeams = ref<{ teamName: string; teamID: number; teamMembers: Array<{ userName: string, userID: number }> }[]>(
        [
            {
                teamName: "ATeam", teamID: 123, teamMembers: [{ userName: "Freeman", userID: 23 }, { userName: "TestUser", userID: 42 }]
            },
            {
                teamName: "FK", teamID: 123, teamMembers: [{ userName: "Freeman", userID: 23 }, { userName: "TestUser", userID: 42 }]
            }
        ]
    );
    //显示在消息中，最近列表
    const recentChatList = ref<{
        userName: string;
        uid: number | null;
        tid: number | null;
        lastMsg: string | null;
    }[]>([{ userName: 'Freeman', uid: null, tid: null, lastMsg: 'Hello' }]);
    //消息列表，会随着点击消息变化
    const msgList = ref<{
        userName: string;   //发送者的name
        msg: string;
        userID: number      //发送者的id
        time: Date;         //消息发送的时间
        imgstr: string | null;
    }[]>([]);
    const currentChatID = ref(3);
    const webSocket = ref<WebSocket | null>(null);
    return { recentChatList, msgList, webSocket, allTeams, currentChatID }
})