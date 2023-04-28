import { atom } from 'recoil'
import { ThreadMessage, defaultThreadMessage } from './chatAtoms';

export interface ThreadsValue {
    threadMessage: ThreadMessage | undefined;
}

export const defaultThreadMessageState = {
    threadMessage: defaultThreadMessage 
};

export const threadMessageState = atom<ThreadsValue>({
  key: 'threadMessageState',
  default: defaultThreadMessageState
})