import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useTeamStore = defineStore('team', () => {
    const curTeam = ref(-1)
    const teamChanged = ref(false)
    return { curTeam, teamChanged }
})