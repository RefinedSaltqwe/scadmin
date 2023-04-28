import { atom } from "recoil";
import { UsersInfo } from "./usersAtom";

export interface AddPeopleValue {
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

export const addPeopleAtomState = atom<AddPeopleValue>({
  key: "addPeopleAtomState",
  default: defaultUserInfo,
});