import { chatThreadsState, ThreadRef } from '@/atoms/chatAtoms';
import { linksAtomState } from '@/atoms/linksAtom';
import { usersAtomState, UsersInfo } from '@/atoms/usersAtom';
import ChatMessages from '@/components/Chat/ChatMessages';
import ChatNavigation from '@/components/Chat/ChatNavigation';
import Links from '@/components/Modal/Chat/Links';
import PageContentLayout from '@/components/ScapComponents/PageContent';
import { auth, firestore } from '@/firebase/clientApp';
import useRgbConverter from '@/hooks/useRgbConverter';
import { tokens } from '@/mui/theme';
import { useTheme } from '@mui/material';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState } from 'recoil';


type ChatProps = {
    
};

const Chat:React.FC<ChatProps> = () => {

    const theme = useTheme();
    const [usersAtomValue, setUsersAtomValue] = useRecoilState(usersAtomState);
    const [chatThreadsValue, setChatThreadsValue] = useRecoilState(chatThreadsState);
    const [user] = useAuthState(auth);
    const colors = tokens(theme.palette.mode);
    const [navToggle, setNavToggle] = useState(true);
    const { hex2rgb } = useRgbConverter();

    const getAllUsers = async () => {
        const userRef = query(collection(firestore, "users"));

        const querySnapshot = await getDocs(userRef);
        const allUsers = querySnapshot.docs.map((doc) => ({
            uid: doc.id,
            firstName: doc.data().firstName,
            lastName: doc.data().lastName,
            email: doc.data().email
        })); 
        //SET USERS to Atom
        setUsersAtomValue((prev) => ({
            ...prev,
            users: allUsers as UsersInfo[],
        }))
    }

    const getUserThreads = async () => {

        const myThreadSnippitsRef = query(collection(firestore, `users/${user?.uid}/threadSnippits`));
        const querySnapshot = await getDocs(myThreadSnippitsRef);
        
        const myThreads = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }))
        const itemsDocs = await Promise.all(myThreads.map(item => getDoc(doc(firestore, 'threads', item.id))));
        const threads = itemsDocs.map((item) => ({
            id: item.id,
            ...item.data()
        }));
        setChatThreadsValue((prev) => ({
            ...prev,
            threads: threads as ThreadRef[]
        }))
        // console.log(threads)

    }
    //GET user data
    useEffect(() => {
        getAllUsers();
        getUserThreads();//eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    
    return (
        <>
            {/* <Links/>
            <PageContentLayout leftWidth="30%" pageType="scene" isCollapsable={true} isNotCollapsed={navToggle}>
                <ChatNavigation hex2rgb={hex2rgb} theme={theme} colors={colors} setNavToggle={setNavToggle} navToggle={navToggle}/>
                <ChatMessages hex2rgb={hex2rgb} theme={theme} colors={colors} setNavToggle={setNavToggle} navToggle={navToggle}/>
            </PageContentLayout> */}
            
        </>
    )
}
export default Chat;