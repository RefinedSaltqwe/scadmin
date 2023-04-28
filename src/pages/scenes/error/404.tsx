import { chatThreadsState } from '@/atoms/chatAtoms';
import Error404 from '@/components/errors/Error404';
import React from 'react';
import { useResetRecoilState } from 'recoil';

type Custom404Props = {
  
};

const Custom404:React.FC<Custom404Props> = () => {

  const resetList = useResetRecoilState(chatThreadsState);

  resetList();
  return (<Error404/>)
}
export default Custom404;