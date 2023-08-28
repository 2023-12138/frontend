import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useProjectStore = defineStore('project', () => {
    const curProject = ref('-1')
    const projectChanged = ref(false)
    return { curProject, projectChanged }
})