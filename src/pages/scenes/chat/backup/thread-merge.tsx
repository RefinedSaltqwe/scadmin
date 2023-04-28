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
    currentThread: string;
};

const Chat:React.FC<ChatProps> = ({ currentThread }) => {

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

    // GET user data
    useEffect(() => {
        
        getAllUsers();
        getUserThreads();
        //eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    useEffect(() => {
        console.log("Current Thread: ", chatThreadsValue.threads); //NEW
        //eslint-disable-next-line react-hooks/exhaustive-deps
    },[currentThread])
    
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
export async function getServerSideProps(context: GetServerSidePropsContext){
    // console.log(context.query.threads as string)
    //  ↓  GET community data and pass it to client
    try {
        //GET threads
        const url = context.query.threads as string;
        const urlArr = url.split("=");
        const userId=urlArr[1];
        const threadId=urlArr[3];

        //Get selected thread thread
        const currentThreadRef = doc(firestore, `threads`, threadId);
        const queryThreadSnapshot = await getDoc(currentThreadRef);
        const data = queryThreadSnapshot.data();
        const currThread = {
            id: threadId,
            type: data?.type,
            connections: data?.connections,
            createdBy: data?.createdBy,
            status: data?.status,
        }
        return {
            props: {
                currentThread: JSON.parse(safeJsonStringify(currThread)),
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