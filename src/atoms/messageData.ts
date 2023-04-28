import { atom } from 'recoil';
import { ThreadRef, defaultThreadRef } from './chatAtoms';

export interface ThreadsValue {
    messageData: ThreadRef;
}

export const defaultMessageDataState = {
    messageData: defaultThreadRef 
};

export const messageDataState = atom<ThreadsValue>({
  key: 'messageDataState',
  default: defaultMessageDataState
})