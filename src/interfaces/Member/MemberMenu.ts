import { h, Component } from 'vue'
import { NIcon } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import {
    PersonOutline as PersonIcon,
    HomeOutline as HomeIcon
} from '@vicons/ionicons5'

const renderIcon = (icon: Component) => {
    return () => h(NIcon, null, { default: () => h(icon) })
}

export const menuOptions: MenuOption[] = [
    {
        label: '全部成员',
        key: 'all-member',
        icon: renderIcon(HomeIcon)
    },
    {
        key: 'divider-1',
        type: 'divider'
    },
    {
        label: '管理者',
        key: 'manager',
        icon: renderIcon(PersonIcon)
    },
    {
        label: '普通成员',
        key: 'normal-member',
        icon: renderIcon(PersonIcon)
    }
]