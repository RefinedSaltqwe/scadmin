import { atom } from "recoil";
import { UsersInfo } from "./usersAtom";


export interface LinksValue {
    values: UsersInfo[],
    currentValue: string | null,
    currentUID: string;
    textFieldValue: string
}

export const defaultUserInfo = {
    values: [],
    currentValue: null,
    currentUID:"",
    textFieldValue:""
};

export const linksAtomState = atom<LinksValue>({
  key: "linksAtomState",
  default: defaultUserInfo,
});