import { atom } from "recoil";

export interface UsersInfo {
    uid:string;
    firstName: string;
    lastName: string;
    email: string;
    userType: string;
}

export interface LinksValue {
    users: UsersInfo[],
    myInfo: UsersInfo,
}

export const defaultUserInfo = {
    users: [],
    myInfo: {
        uid: "",
        firstName: "",
        lastName: "",
        email: "",
        userType: "",
    }
};

export const usersAtomState = atom<LinksValue>({
  key: "usersAtomState",
  default: defaultUserInfo,
});