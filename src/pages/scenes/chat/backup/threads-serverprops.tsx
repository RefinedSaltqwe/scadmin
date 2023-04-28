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
import { GetServerSidePropsContext } from 'next';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState } from 'recoil';
import safeJsonStringify from 'safe-json-stringify';


type ChatProps = {
    threads: ThreadRef[];
    allUsers: UsersInfo[];
};

const Chat:React.FC<ChatProps> = ({threads, allUsers}) => {

    const theme = useTheme();
    const [usersAtomValue, setUsersAtomValue] = useRecoilState(usersAtomState);
    const [chatThreadsValue, setChatThreadsValue] = useRecoilState(chatThreadsState);
    const [user] = useAuthState(auth);
    const colors = tokens(theme.palette.mode);
    const [navToggle, setNavToggle] = useState(true);
    const { hex2rgb } = useRgbConverter();

    //GET user data
    useEffect(() => {
        setChatThreadsValue((prev) => ({
            ...prev,
            threads: threads as ThreadRef[]
        }));
        //SET USERS to Atom
        setUsersAtomValue((prev) => ({
            ...prev,
            users: allUsers as UsersInfo[],
        }));//eslint-disable-next-line react-hooks/exhaustive-deps
    },[threads, allUsers])
    
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

//GetServerSidePropsContext - access the page router to grab the URL and;

export async function getServerSideProps(context: GetServerSidePropsContext){
    console.log(context.query.threads as string)
    //  ↓  GET community data and pass it to client
    try {
        //GET threads
        const url = context.query.threads as string;
        const urlArr = url.split("=");
        const userId=urlArr[1];
        const threadId=urlArr[3] && urlArr[3];

        const myThreadSnippitsRef = query(collection(firestore, `users/${userId}/threadSnippits`));
        const queryThreadsSnapshot = await getDocs(myThreadSnippitsRef);
        const myThreads = queryThreadsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));
        const itemsDocs = await Promise.all(myThreads.map(item => getDoc(doc(firestore, 'threads', item.id))));
        const allThreads = itemsDocs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));
        //GET all users
        const userRef = query(collection(firestore, "users"));
        const queryUserSnapshot = await getDocs(userRef);
        const allUsers = queryUserSnapshot.docs.map((doc) => ({
            uid: doc.id,
            firstName: doc.data().firstName,
            lastName: doc.data().lastName,
            email: doc.data().email
        })); 
        
        return {
            props: {
                threads: JSON.parse(safeJsonStringify(allThreads)),
                allUsers: JSON.parse(safeJsonStringify(allUsers)),
            },
        };
      } catch (error) {
        // Could create error page here
        console.log("getServerSideProps error - [threads]", error);
        return { 
            props: {
                ok: false, 
                reason: "some error description for your own consumption, not for client side"
            },
        }
    }
}
export default Chat;
