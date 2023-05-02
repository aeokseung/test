import { atom } from 'recoil';
import {recoilPersist} from "recoil-persist";

const { persistAtom } = recoilPersist();

export const locationState = atom({
    key: 'locationState',
    default: null,
    effects_UNSTABLE: [persistAtom]
});