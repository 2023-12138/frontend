import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useTeamStore = defineStore('team', () => {
    const curTeam = ref(-1)
    return { curTeam }
})