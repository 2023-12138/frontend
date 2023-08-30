import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useTeamStore = defineStore('team', () => {
    const curTeam = ref<String>('-1')
    const curTeamName = ref('个人空间')
    const teamChanged = ref(false)
    return { curTeam, teamChanged, curTeamName }
})