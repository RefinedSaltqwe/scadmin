import { chatThreadsState, defaultThreadRef, ThreadMessage, ThreadRef } from '@/atoms/chatAtoms';
import { chatNavToggleState } from '@/atoms/chatNavToggleAtom';
import { messageDataState } from '@/atoms/messageData';
import { threadMessageState } from '@/atoms/threadMessageAtom';
import { usersAtomState, UsersInfo } from '@/atoms/usersAtom';
import ChatNavigation from '@/components/Chat/ChatNavigation';
import FlexBetween from '@/components/ScapComponents/FlexBetween';
import PageContentLayout from '@/components/ScapComponents/PageContent';
import { auth, firestore } from '@/firebase/clientApp';
import useNavigation from '@/hooks/useNavigation';
import useRgbConverter from '@/hooks/useRgbConverter';
import { tokens } from '@/mui/theme';
import { Typography, useTheme } from '@mui/material';
import { collection, doc, getDoc, getDocs, limit, onSnapshot, orderBy, query, serverTimestamp, Timestamp, updateDoc, where, writeBatch } from 'firebase/firestore';
import { GetServerSidePropsContext } from 'next';
import dynamic from 'next/dynamic';
import React, { useEffect, useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useSetRecoilState } from 'recoil';
import safeJsonStringify from 'safe-json-stringify';

const ChatMessages = dynamic(() => import("@/components/Chat/ChatMessages"),{ssr: false});

const AddPeople = dynamic(() => import("@/components/Modal/Chat/AddPeople"),{ssr: false});

const Links = dynamic(() => import("@/components/Modal/Chat/Links"),{ssr: false});

type ChatProps = {
    currentThread: string;
    myUID: string;
    sortedThreads: ThreadRef[];
    allUsers: {
        uid: string;
        firstName: any;
        lastName: any;
        email: any;
        userType: any;
    }[];
    currentThreadObject: ThreadRef;
};

const Chat:React.FC<ChatProps> = ({ currentThread , myUID, sortedThreads, allUsers, currentThreadObject }) => {

    const [user] = useAuthState(auth);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { hex2rgb } = useRgbConverter();
    const { navigatePage } = useNavigation();
    const setUsersAtomValue = useSetRecoilState(usersAtomState);
    const setChatNavToggleValue = useSetRecoilState(chatNavToggleState);
    const setChatThreadsValue = useSetRecoilState(chatThreadsState);
    const setThreadMessageValue = useSetRecoilState(threadMessageState);
    const setMessageDataValue = useSetRecoilState(messageDataState);
    const dataFetchedRef = useRef(false);
    const dataFetchedOnSnapShotRef = useRef(false);

    //LISTEN to thread changes
    const listenToNewThread = async () => {
        const controller = new AbortController();
        try{
            const q = query(collection(firestore, "threads"), where("connections", 'array-contains', user?.uid), orderBy("latestMessageCreatedAt", "desc"), limit(1));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                let thread: any[] = [];
                const source = querySnapshot.metadata.hasPendingWrites ? "Local" : "Server";
                //START listening  to the query
                querySnapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        thread.push({id: change.doc.id, ...change.doc.data()});
                    }
                    if (change.type === "modified") {
                        thread.push({id: change.doc.id, ...change.doc.data()});
                    }
                });
                
                // PREVENTS the listener from executing twice when the createdAt changes from null to Timestamp
                // Server when timestamp is changed
                thread.forEach(threadItem => {
                    if(source == "Server" &&  thread.length > 0 && dataFetchedOnSnapShotRef.current){
                        if(threadItem.changeType === "added"){
                            if(threadItem.createdBy === user?.uid){
                                setChatThreadsValue((prev) => ({
                                    ...prev,
                                    threads: [threadItem, ...prev.threads.filter(item => item.id !== threadItem.id)],
                                    currentThreadId: threadItem.id,
                                    currentSelectedThread: threadItem as ThreadRef,
                                    selectedThreadsArray: [...prev.selectedThreadsArray.filter(item => item !== threadItem.id), threadItem.id] as string[]
                                }));
                            }
                            else {
                                setChatThreadsValue((prev) => ({
                                    ...prev,
                                    threads: [threadItem, ...prev.threads],
                                }));
                            }
                        }
                        else if(threadItem.changeType === "modified"){
                            const messageId = threadItem.lastMessageId.split("=");

                            getNewMessage(threadItem.lastMessageId ? threadItem.lastMessageId : "_dummy", threadItem.id);

                            if(threadItem.lastMessageId.includes("addPeople")){
                                setMessageDataValue({messageData: threadItem});
                            }

                            if(threadItem.lastMessageId.includes(`removeUser`)){
                                const removedUID = messageId[3];
                                const removedBy = messageId[0];
                                removeUserConnectionToThread(removedBy, removedUID, threadItem.id, threadItem.connections);
                                if(removedUID === user?.uid){
                                    setChatThreadsValue((prev) => ({
                                        ...prev,
                                        threads: [...prev.threads.filter(item => item.id !== threadItem.id)],
                                    }));
                                    return
                                }
                            }
                            //DELETE the modified thread. Then, add it at the top
                            setChatThreadsValue((prev) => ({
                                ...prev,
                                threads: [threadItem, ...prev.threads.filter(item => item.id !== threadItem.id)],
                            }));
                        }
                    } 
                    else if(source == "Local" && threadItem.latestMessageCreatedAt !== null){
                        if(threadItem.changeType === "modified" ){
                            setChatThreadsValue((prev) => ({
                                ...prev,
                                threads: [threadItem, ...prev.threads.filter(item => item.id !== threadItem.id)],
                            }));
                        }
                    }
                })
            });
            return () => {
                unsubscribe();
                controller.abort();
            }
        } catch(error){
            console.log("Error listenToNewTHread: ", error);
        }
    }
    // LISTENS to seen messages
    const listenToUnseenMessages = async() => {
        const controller = new AbortController();
        try{
            const q = query(collection(firestore, "threads"), where("connections", 'array-contains', user?.uid), orderBy("lastSeen", "desc"), limit(1));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                let thread: any[] = [];
                const source = querySnapshot.metadata.hasPendingWrites ? "Local" : "Server";
                //START listening  to the query
                querySnapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        thread.push({id: change.doc.id, ...change.doc.data()});
                    }
                    if (change.type === "modified") {
                        thread.push({id: change.doc.id, ...change.doc.data()});
                    }
                });
                thread.forEach(threadItem => {
                    // console.log(source, thread.length, dataFetchedOnSnapShotRef.current)
                    if(source == "Server" &&  thread.length > 0 && dataFetchedOnSnapShotRef.current){
                        let threadSeen: string[] = [];
                        threadSeen = [...threadItem.threadSeen];
                    
                        if(threadSeen.includes(myUID)){
                            // const indexOfSeenThread = chatThreadsValue.threads.findIndex(thread => {
                            //     if(thread.id === seenMessage.id){
                            //         return true
                            //     }
                            // })
                            // ? UPDATING State with multiple Objects without deleting
                            setChatThreadsValue((prev) => ({
                                ...prev,
                                threads: prev.threads.map((thread1, index) => 
                                    // index === indexOfSeenThread ? seenMessage : obj
                                    thread1.id === threadItem.id ? threadItem : thread1
                                ),
                            }));
                        }
                    }
                });
            });

            return () => {
                unsubscribe();
                controller.abort();
            }
        } catch(error){
            console.log("Error listenToUnseenMessages: ", error);
        }
    }
    // LISTENS to new users
    const listenToNewUsers = async() => {
        const controller = new AbortController();
        try{
            const q = query(collection(firestore, "users"), orderBy("createdAt", "desc"), limit(1));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                let user: any[] = [];
                const source = querySnapshot.metadata.hasPendingWrites ? "Local" : "Server";
                //START listening  to the query
                querySnapshot.docChanges().forEach((change) => {
                    user.push({id: change.doc.id, ...change.doc.data()});
                });
                user.forEach(userItem => {
                    if(source == "Server" &&  user.length > 0 && dataFetchedOnSnapShotRef.current){
                        const newUser: UsersInfo = {
                            uid: userItem.id,
                            firstName: userItem.firstName,
                            lastName: userItem.lastName,
                            email: userItem.email,
                            userType: userItem.userType,
                        };
                        setUsersAtomValue((prev) => ({
                            ...prev,
                            users: [newUser, ...prev.users.filter(item => item.uid !== userItem.uid)]
                        }));
                    }
                });
            });

            return () => {
                unsubscribe();
                controller.abort();
            }
        } catch(error){
            console.log("Error listenToUnseenMessages: ", error);
        }
    }

    const getUpdatedThread = async(threadId: string) => {
        try{
            const docRef = doc(firestore, "threads", threadId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const thread: ThreadRef =  {
                    id: docSnap.id,
                    type: docSnap.data().type,
                    groupName: docSnap.data().groupName,
                    groupPhotoURL: docSnap.data().groupPhotoURL,
                    createdAt: docSnap.data().createdAt,
                    latestMessageCreatedAt: docSnap.data().latestMessageCreatedAt,
                    connections: docSnap.data().connections,
                    threadSeen: docSnap.data().threadSeen,
                    lastSeen: docSnap.data().lastSeen,
                    lastMessage: docSnap.data().lastMessage,
                    lastMessageUID: docSnap.data().lastMessageUID,
                    lastMessageId: docSnap.data().lastMessageId,
                    changeType:docSnap.data().changeType,
                    createdBy: docSnap.data().createdBy,
                    status: docSnap.data().status,
                }
            setMessageDataValue({messageData: thread});
            } else {
                // console.log("getUpdatedThread: No such document!");
            }
        } catch(error){
            console.log("Error listenToUnseenMessages: ", error);
        }
    }

    const removeUserConnectionToThread = async(removedBy: string, uid: string, threadId: string, currentConnections: string []) => {
        try{
            const batch = writeBatch(firestore);

            if(currentConnections.length >= 2){
                //UPDATE new connections in thread
                batch.update(doc(firestore, `threads/${threadId}`), {
                    connections: currentConnections.filter(prevUid => prevUid !== uid) as [] // DELETE connection
                });
            }

            //DELETE user threadSnippets
            batch.delete(doc(firestore, `users/${uid}/threadSnippits`, threadId));

            if(currentConnections.length < 2){
                //DELETE thread when no user exist
                batch.delete(doc(firestore, `threads`, threadId));
            }

            await batch.commit();

            //GET user info from database
            const docRef = doc(firestore, "users", myUID);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                if(docSnap.data().currentThread === threadId){
                    if(removedBy !== uid){
                        getUpdatedThread(threadId);
                    }
                    if(uid === user?.uid){
                        setChatNavToggleValue(true);
                        setChatThreadsValue((prev) => ({
                            ...prev,
                            currentSelectedThread: undefined,
                            currentThreadId: ""
                        }));
                        navigatePage(`/scenes/chat/u=${user?.uid}=threadKey=`);
                    }
                }
            } else {
            // doc.data() will be undefined in this case
                // console.log("removeUserConnectionToThread: No such document! Users");
            }
        } catch(error) {
            console.log("Error Removing user: ", error)
        }
    }

    const setSeenEntry = async(threadId: string) => {
        try{
            let newThreadSeen: string [] = [];
            const docRef = doc(firestore, "threads", threadId);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                const threadSean = docSnap.data().threadSeen;
                threadSean.map((item: any) => newThreadSeen.push(item));
                if(!newThreadSeen.includes(user!.uid!)){
                    newThreadSeen.push(user!.uid!);
                    setChatThreadsValue((prev) => ({
                        ...prev,
                        threadSeen: newThreadSeen as []
                    }));

                    await updateDoc(docRef, {
                        threadSeen: newThreadSeen as [],
                        lastSeen:  serverTimestamp() as Timestamp,
                    });
                }
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        } catch(error){
            console.log("Error setSeenEntry: ", error);
        }
    }
    
    const getNewMessage = async (messageId: string, threadId: string) => {
        try{
            const docRef = doc(firestore, `threads/${threadId}/messages`, messageId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const newMessage: ThreadMessage = {
                    id: docSnap.id,
                    threadId: docSnap.data().threadId,
                    uid: docSnap.data().uid,
                    text: docSnap.data().text,
                    photoURL: docSnap.data().photoURL,
                    file: docSnap.data().file,
                    createdAt: docSnap.data().createdAt,
                }; 
                setThreadMessageValue({threadMessage: newMessage});
            } else {
                console.log("No such document!");
            } 
        } catch(error){
            console.log("Error getNewMessage: ", error);
        }
    }

    const setSelectedThreads = () => {
        if(currentThreadObject){
            setChatThreadsValue((prev) => ({
                ...prev,
                currentSelectedThread: currentThreadObject as ThreadRef,
            }));
        }
        // const currentThreadObjectz = sortedThreads.filter(item => item.id === currentThread);
        // setChatThreadsValue((prev) => ({
        //     ...prev,
        //     currentSelectedThread: currentThreadObjectz[0] as ThreadRef,
        // }));
    }

    // GET user data
    useEffect(() => {
        //RESTRICTS useEffect to run only once
        const controller = new AbortController();
        if (dataFetchedRef.current){
            return; 
        } else {
            //SET all Users
            const myInfo = allUsers.filter(users => users.uid === user?.uid);
            //SET USERS to Atom
            setUsersAtomValue((prev) => ({
                ...prev,
                users: allUsers as UsersInfo[],
                myInfo: myInfo[0] as UsersInfo
            }))
            //SET all THREADS
            setChatThreadsValue((prev) => ({
                ...prev,
                threads: sortedThreads as ThreadRef[],
                currentThreadId: currentThread,
                currentSelectedThread: currentThreadObject as ThreadRef,
            }));        
            listenToNewThread();
            listenToUnseenMessages();
            listenToNewUsers();
            dataFetchedRef.current = true;
        } 
        if(currentThreadObject === undefined){
            setTimeout(()=>{
                dataFetchedOnSnapShotRef.current = true;
            }, 3500);
        }
        
        return () => {
            controller.abort();
        }
    //eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    return (
        <>
            <Links/>
            <AddPeople/>
            <PageContentLayout leftWidth="30%" pageType="chat" isCollapsable={true}>
                <ChatNavigation hex2rgb={hex2rgb} theme={theme} colors={colors} />
                {currentThread ? (
                    <ChatMessages setSelectedThreads={setSelectedThreads} setSeenEntry={setSeenEntry} dataFetchedOnSnapShotRef={dataFetchedOnSnapShotRef} currentThread={currentThread} hex2rgb={hex2rgb} theme={theme} colors={colors}/>
                ):(
                    <FlexBetween sx={{width: "100%", height: "100%", aligntItems: "center"}}>
                        <Typography variant='h4' sx={{fontWeight: 600, width: "100%", textAlign: "center", color: hex2rgb(theme.palette.text.secondary, "35").rgb}}>Select a chat or start a new conversation</Typography>
                    </FlexBetween>
                )}
            </PageContentLayout>
        </>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext){
    const { res } = context;
    res.setHeader(
        'Cache-Control',
        'public, s-maxage=10, stale-while-revalidate=59'
    );
    try {
        //GET threads
        const url = context.query.threads as string;
        const urlArray = url.split("=");
        const uid = urlArray[1];
        let threadId = urlArray[3];

        //GET USER THREADS
        const myThreadSnippitsRef = query(collection(firestore, `users/${uid}/threadSnippits`));
        const threadsQuerySnapshot = await getDocs(myThreadSnippitsRef);
        const myThreadsSnippits = threadsQuerySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));
        const itemsDocs = await Promise.all(myThreadsSnippits.map(item => getDoc(doc(firestore, 'threads', item.id))));
        const threads = itemsDocs.map((item) => ({
            id: item.id,
            ...item.data()
        } as ThreadRef ));
        const spreadThreadsForSorting = [...threads];
        const sortedThreads = spreadThreadsForSorting.sort((a,b) =>  b.latestMessageCreatedAt!.seconds - a.latestMessageCreatedAt!.seconds);
        //GET ALL USERS
        const userRef = query(collection(firestore, "users"));
        const userQuerySnapshot = await getDocs(userRef);
        const allUsers = userQuerySnapshot.docs.map((doc) => ({
            uid: doc.id,
            firstName: doc.data().firstName,
            lastName: doc.data().lastName,
            email: doc.data().email,
            userType: doc.data().userType
        })); 
        // SET CURRENT SELECTED THREAD
        const currentThreadObject = sortedThreads.filter(item => item.id === threadId);

        if(threadId){
            const docRef = doc(firestore, "threads", threadId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const checkIfUserIsMemberRef = doc(firestore, `users/${uid}/threadSnippits`, threadId);
                const checkIfUserIsMemberSnap = await getDoc(checkIfUserIsMemberRef);
                if (checkIfUserIsMemberSnap.exists()) {
                    //UPDATE current THREAD
                    const updateUserRef = doc(firestore, "users", uid);
                    await updateDoc(updateUserRef, {
                        currentThread: threadId,
                    });
                    return {
                        props: {
                            currentThread: threadId,
                            myUID: uid,
                            sortedThreads: JSON.parse(safeJsonStringify(sortedThreads)),
                            allUsers: JSON.parse(safeJsonStringify(allUsers)),
                            currentThreadObject: JSON.parse(safeJsonStringify(currentThreadObject[0])),
                        },
                    };
                } 
                else {
                    return {
                        redirect: {
                            destination: `/scenes/error/406`,
                            permanent: false,
                        },
                    };
                }
            } 
            else {
                if(threadId != undefined || threadId != ""){
                    return {
                        redirect: {
                            destination: '/scenes/error/404',
                            permanent: false,
                        },
                    };
                }
            }
        }  else {
            return {
                props: {
                    currentThread: threadId,
                    myUID: uid,
                    sortedThreads: JSON.parse(safeJsonStringify(sortedThreads)),
                    allUsers: JSON.parse(safeJsonStringify(allUsers)),
                },
            };
        }
    } catch (error) {
        console.log("getServerSideProps error - [threads.tsx]", error);
        return {
            redirect: {
                destination: '/scenes/error/405',
                permanent: false,
            },
        };
    }
}
export default Chat;