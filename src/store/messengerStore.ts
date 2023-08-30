import { defineStore } from 'pinia';
import { Ref, ref } from 'vue';
export const useMessengerStore = defineStore('messenger', () => {
    const allMessage: Ref<{ msgName: string, func: any }[]> = ref([]);
    const registerMessage = <Tin, Tout>(msgName: string, func: (args: Tin) => Tout) => {
        allMessage.value.push({ msgName, func });
    };
    const unRegisterMessage = (msgName: string) => {
        allMessage.value.splice(allMessage.value.findIndex(ele => ele.msgName == msgName), 1);
    };
    const callMessage = <Tin, Tout>(msgName: string, args: Tin) => {
        return allMessage.value.find(ele => ele.msgName == msgName)?.func(args) as Tout;
    };
    return { registerMessage, unRegisterMessage, callMessage };
});