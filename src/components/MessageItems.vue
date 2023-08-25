<template>
    <div 
        class="message" 
        :class="{read:message.read}"
        v-for="(message,index) in messages" 
        :key="message.id" 
        v-show="read>=message.read" 
        @click="readMessage(index)"
    >
        <div class="messageAvatar">
            <n-avatar round :size="40" :src="message.avatar" />
        </div>
        <div class="dividerVertical"></div>
        <div class="messageContent">
            <div class="messageTitle">
                {{ message.from }}<span v-show="message.teamChat">在群聊中</span>提到了你
            </div>
            <div class="messageText">
                {{ message.text }}
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>

let props = defineProps<{
    messages:any[],
    read:number
}>();

const readMessage = (index:number) => {
    props.messages[index].read=true
}

</script>

<style scoped>

.message {
    height: 4.5rem;
    width: 100%;
    /* border: 1px black solid; */
    border-radius: 7px;
    display: flex;
    align-items: center;
}

.read {
    opacity: 0.45;
}

.message:not(:first-child){
    margin-top: 5px;
}

.message:hover {
    cursor: pointer;
    background-color: #eee;
}

.messageAvatar{
    margin-left: 10px;
    font-size: 0;
}

.dividerVertical {
    height: 90%;
    width: 1px;
    background-color: var(--primary-color);
    margin: 0 8px;
}

.messageContent {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
}

.messageTitle {
    font-size: 16px;
    font-weight: 666;
}

</style>
