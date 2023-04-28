import { chatThreadsState } from "@/atoms/chatAtoms";
import { myMenuState } from "@/atoms/layoutAtoms";
import { linksAtomState } from "@/atoms/linksAtom";
import { loadingNavigateMessageState } from "@/atoms/loadingNavigateMessage";
import { modalLinksOpen } from "@/atoms/modalLinksAtom";
import { usersAtomState } from "@/atoms/usersAtom";
import { useResetRecoilState } from "recoil";

const useResetAllRecoilStates= () => {

  const resetChatThreadsState = useResetRecoilState(chatThreadsState);
  const resetMyMenuState = useResetRecoilState(myMenuState);
  const resetLinksAtomState = useResetRecoilState(linksAtomState);
  const resetLoadingNavigateMessageState = useResetRecoilState(loadingNavigateMessageState);
  const resetModalLinksOpen = useResetRecoilState(modalLinksOpen);
  const resetUsersAtomState = useResetRecoilState(usersAtomState);
  
  return {resetChatThreadsState, resetMyMenuState, resetLinksAtomState, resetLoadingNavigateMessageState, resetModalLinksOpen, resetUsersAtomState }
}
export default useResetAllRecoilStates;