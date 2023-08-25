import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useChatContainer = defineStore('chatroom', () => {
    const userList = ref([{ userName: 'Freeman', id: 0 }]);
    const recentChatList = ref([{ userName: 'Freeman', id: 0 }]);
    const msgList = ref([{
        userName: 'Freeman',
        msg: 'Hello'
    }, {
        userName: 'Freeman',
        msg: 'Hello'
    }, {
        userName: 'Freeman',
        msg: 'Hello'
    }, {
        userName: 'Freeman',
        msg: 'Hello'
    }]);
    const webSocket = ref<WebSocket>();
    return { userList, recentChatList, msgList, webSocket }
})