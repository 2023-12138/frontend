import { defineStore } from 'pinia';
import { Ref,ref } from 'vue'

export const usedocEditStore = defineStore('usedocEdit', () => {
    const onAT:Ref<(() => void) | null> = ref(null);
    return { onAT };
})