import React, { useState, useEffect, useRef } from 'react'
import { GrFormClose, GrSend } from "react-icons/gr";
import { useParams } from 'react-router-dom';
import { socket } from '../utils/Socket';
import { TbSend } from "react-icons/tb";
import { useLocation } from 'react-router-dom';
import { getChatroomHistory } from '../api/chatroom';  // 引入API函数

export default function ChatRoom({ chatRoomOpen, setChatRoomOpen }) {
    const [currentMessage, setCurrentMessage] = useState("");
    const { projectId } = useParams();
    const [messageList, setMessageList] = useState([]);
    const bottomRef = useRef(null);
    function formatTime(date) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
    const sendMessage = async () => {
        // 使用trim()方法确保去除了前后空格
        if(currentMessage.trim() !== ""){
            const messageData = {
                room: projectId,
                author: localStorage.getItem("username"),
                creator: localStorage.getItem("id"),
                message: currentMessage.trim(),  // 也可以在这里直接发送去除空格后的消息
                createdAt:  formatTime(new Date())  // 使用格式化函数
            };
            socket.emit("send_message", messageData);
            setMessageList(prev => [...prev, messageData]);
            setCurrentMessage("");  // 清空输入框
        }
    }

    useEffect(() => {
        // 当聊天室打开且projectId有效时，加载历史消息
        if (chatRoomOpen && projectId) {
            const loadHistory = async () => {
                try {
                    const history = await getChatroomHistory(projectId);
                    const formattedHistory = history.map(message => ({
                        ...message,
                        createdAt: formatTime(new Date(message.createdAt)) // 使用UTC时间转换
                    }));
    
                    setMessageList(formattedHistory);
                } catch (error) {
                    console.error('Failed to fetch chatroom history:', error);
                }
            };
            loadHistory();
        }
    }, [projectId, chatRoomOpen]);  // 依赖projectId和chatRoomOpen

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messageList]);

    useEffect(() => {
        function receive_message(data) {
            setMessageList(prev => [...prev, data])
            console.log(data);
        }

        if (chatRoomOpen === true) {
            socket.emit("join_room", projectId);
            console.log("join_room");
        }
        socket.on("receive_message", receive_message)
        return () => {
            socket.off('receive_message', receive_message);
        };
    }, [socket, chatRoomOpen, projectId]);

    return (
        <div className={`z-50 w-[350px] h-[460px] fixed left-0 bottom-0 border-2 p-0 rounded-lg shadow-xl bg-slate-100 transform transition-all duration-500 ${chatRoomOpen ? "translate-x-0 translate-y-0 visible" : "-translate-x-full translate-y-full invisible"}`}>
            <div className='h-[31px] w-full flex justify-between text-base font-semibold p-1 rounded-t-lg bg-slate-300 text-slate-600'>
                <span className='pl-2 '>小組討論區</span>
                <button onClick={() => { setChatRoomOpen(false) }} className='cursor-pointer rounded-lg hover:bg-gray-200 '>
                    <GrFormClose size={20} />
                </button>
            </div>
            <div className='h-[390px] w-full py-3 relative overflow-x-hidden overflow-y-scroll scrollbar-thin scrollbar-thumb-slate-400/70 scrollbar-track-slate-200 scrollbar-thumb-rounded-full scrollbar-track-rounded-full'>
                {
                    messageList.map((messages, index) => {
                        return (
                            <div key={index} className={`flex h-auto p-1 ${messages.author === localStorage.getItem("username") ? "justify-end" : "justify-start"}`}>
                                <div>
                                    <div className={`w-fit max-w-[120px] rounded text-white flex items-center break-all px-[5px] mx-[5px] ${messages.author === localStorage.getItem("username") ? "bg-[#5BA491] m-auto" : "bg-sky-700"}`}>
                                        {messages.message}
                                    </div>
                                    <div className='flex justify-end text-xs mx-[5px]'>
                                        <p className='pr-2'>{messages.createdAt}</p>
                                        <p>{messages.author}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                }
                <div ref={bottomRef} />
            </div>
            <div className=' h-[35px] w-full flex justify-between text-base p-0 border-t-2 bg-slate-50'>
                <input
                    type="text"
                    value={currentMessage} // 确保绑定了currentMessage状态
                    className='w-10/12 outline-none p-1'
                    onChange={e => setCurrentMessage(e.target.value)}
                    onKeyDown={e => { e.key === "Enter" && sendMessage() }}
                />
                <button
                    className='mx-auto'
                    onClick={sendMessage}
                >
                    <TbSend size={20} />
                </button>
            </div>
        </div>
    )
}
