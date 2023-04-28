import { Timestamp } from "firebase/firestore";
import { atom } from "recoil";
import { UsersInfo } from "./usersAtom";

export interface ThreadMessage {
    id?: string;
    threadId?: string;
    uid?: string;
    text: string;
    photoURL: {
        url: string;
        isLoading: boolean;
    };
    file: {
        filename: string, 
        data: string,
        isLoading: boolean
    };
    createdAt?: Timestamp;
}

export interface ThreadRef {
    id?: string;
    type: "private" | "group" | "customer";
    groupName:string;
    groupPhotoURL:string;
    createdAt?: Timestamp;
    connections: [];
    changeType: string,
    threadSeen: [];
    lastSeen?: Timestamp;
    lastMessageId: string;
    lastMessageUID: string;
    lastMessage: string;
    latestMessageCreatedAt?: Timestamp;
    createdBy?: string;
    status: "active" | "inactive" | "blocked" | "muted" | "archived";
}

export interface nextThreadRef {
    threadId: string | undefined, 
    document: 'more' | 'max';
}

export const defaultThreadMessage: ThreadMessage = {
    text: "",
    photoURL: {
        url: "",
        isLoading: false
    },
    file: {
        filename: "", 
        data: "", 
        isLoading: true
    }
}

export const defaultThreadRef: ThreadRef = {
    type: "private",
    groupName:"",
    groupPhotoURL:"",
    connections: [],
    threadSeen: [],
    lastMessageId:"",
    lastMessage: "",
    lastMessageUID:"",
    changeType:"added",
    status: "active",
}

export interface ThreadsValue {
    threads: ThreadRef[];
    currentSelectedThread?: ThreadRef;
    myThreadsUserInfo: UsersInfo[];
    currentThreadId: string;
    threadMessages:ThreadMessage[];
    selectedThreadsArray: string[];
    chatMessage: string;
    nextThread: nextThreadRef[];
}

export const defaultThreadsValue = {
    threads: [],
    myThreadsUserInfo: [],
    currentThreadId: "",
    threadMessages:[],
    selectedThreadsArray: [],
    chatMessage: "",
    nextThread:[]
};

export const chatThreadsState = atom<ThreadsValue>({
  key: "chatThreadsState",
  default: defaultThreadsValue,
});