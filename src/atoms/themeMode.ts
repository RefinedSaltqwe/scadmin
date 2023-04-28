import { atom } from 'recoil'
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist();

export interface Mode {
    mode: string
}

export const defaultMode = {
    mode: "dark"
}

export const themeModeState = atom ({
    key: 'themeModeState',
    default: defaultMode,
    effects_UNSTABLE: [persistAtom]
})