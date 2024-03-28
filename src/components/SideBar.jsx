import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { IoBulbOutline } from 'react-icons/io5';
import { AiOutlineProject } from "react-icons/ai";
import { BsBezier2, BsChatText, BsJournalText, BsFolder } from "react-icons/bs";
import { GrCompliance } from "react-icons/gr";
import ChatRoom from './ChatRoom';
import { useQuery, useMutation, useQueryClient } from 'react-query';

export default function SideBar() {
    const [open, setOpen] = useState(false);
    const [chatRoomOpen, setChatRoomOpen] = useState(false);
    const { projectId } = useParams();
    const menus = [
        { name: "專案", link: `/project/${projectId}/kanban`, icon: AiOutlineProject, margin: "true" },
        { name: "想法牆", link: `/project/${projectId}/ideaWall`, icon: IoBulbOutline },
        { name: "管理階段", link: `/project/${projectId}/managePhase`, icon: BsBezier2 },
        { name: "繳交任務", link: `/project/${projectId}/submitTask`, icon: GrCompliance },
        { name: "撰寫日誌", link: `/project/${projectId}/reflection`, icon: BsJournalText },
        { name: "學習歷程", link: `/project/${projectId}/protfolio`, icon: BsFolder }
    ]
    const [stageInfo, setStageInfo] = useState({ name: "", description: "" });
    const currentStage = localStorage.getItem("currentStage");
    const currentSubStage = localStorage.getItem("currentSubStage");
    // 定義階段名稱和它們對應的索引
    const stages = [
        { name: "定標", index: 1 },
        { name: "擇策", index: 2 },
        { name: "監評", index: 3 },
        { name: "調節", index: 4 },
        { name: "歷程", index: 5 }
    ];
    // const getStageColor = (stageIndex) => parseInt(currentStage) === stageIndex ? '#5BA491' : '#BEBEBE';
    const getStageColor = (stageIndex) => {
        if (parseInt(currentStage) === stageIndex) {
            return '#5BA491'; // 当前阶段
        } else if (stageIndex < parseInt(currentStage)) {
            return '#7C968F'; // 小于当前阶段的阶段
        } else {
            return '#BEBEBE'; // 其他阶段
        }
    };
    // const getTextColor = (stageIndex) => parseInt(currentStage) === stageIndex ? 'text-white' : 'text-slate-700';
    const getTextColor = (stageIndex) => {
        if (parseInt(currentStage) === stageIndex) {
            return 'text-white'; // 当前阶段
        } else if (stageIndex < parseInt(currentStage)) {
            return 'text-slate-200'; // 小于当前阶段的阶段
        } else {
            return 'text-slate-700'; // 其他阶段
        }
    };


    // const getSubStageQuery = useQuery("getSubStage", () => getSubStage({
    //     projectId: projectId,
    //     currentStage: currentStage,
    //     currentSubStage: currentSubStage
    // }),
    //     {
    //         onSuccess: (data) => {
    //             setStageInfo(prev => ({
    //                 ...prev,
    //                 ...data,
    //                 currentStage: currentStage,
    //                 currentSubStage: currentSubStage
    //             }));
    //         },
    //         enabled: !!currentStage
    //     }
    // );

    return (
        <>
            <div className={` bg-[#FFF] absolute inset-y-0 pt-16 left-0 min-h-screen duration-500 border-r-2 ${open ? "w-40" : "w-16"}`}>
                <div className='flex flex-col justify-between h-full'>
                    <div>
                    <div className='mt-2 pt-3 pl-3 flex justify-start'>
                        <FaBars size={26} className='cursor-pointer ml-1' onClick={() => setOpen(!open)} />
                    </div>
                    {/* <div className=' flex flex-col gap-4 relative'> */}
                    <div className=' flex flex-col  relative'>

                        {
                            projectId === undefined ? <></> :
                                menus?.map((menu, i) => (
                                    <Link to={menu?.link} key={i} className={`${menu?.margin && "mt-2"} group flex items-center text-sm gap-3.5 font-medium p-3 hover:bg-slate-100 rounded-sm ml-1`}>
                                        <div>{React.createElement(menu?.icon, { size: "26" })}</div>
                                        <h2 style={{ transitionDelay: `${i + 1}00ms`, }} className={`whitespace-pre duration-500 ${!open && "opacity-0 translate-x-28 overflow-hidden"}`}>
                                            {menu?.name}
                                        </h2>
                                        <h2 className={`${open && 'hidden'} absolute left-14 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg p-0 w-0  overflow-hidden group-hover:p-1  group-hover:w-fit`}>
                                            {menu?.name}
                                        </h2>
                                    </Link>
                                ))
                        }

                        {
                            projectId && (
                                <div className={`mt-auto mb-4 transition-all duration-500 w-full overflow-hidden pt-4`}>
                                    {/* 方塊區塊 */}
                                    <div className={`flex flex-col space-y-2`}>
                                        {stages.map((stage) => (
                                            <div key={stage.index} style={{ backgroundColor: `${getStageColor(stage.index)}` }} className={`h-8 w-full flex items-center justify-center ${getTextColor(stage.index)}`}>
                                                {<span className='text-sm font-bold'>{stage.name}</span>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        }
                    </div>
                    </div>
                    {
                        projectId === undefined ? <></> :
                            <span onClick={() => setChatRoomOpen(true)} className="group flex items-center text-base gap-3.5 font-medium p-3  rounded-xl cursor-pointer bg-zinc-800 ">
                                <div className='ml-1'>
                                    <BsChatText size={"26"} className={"text-white"} />
                                </div>
                                <h2 style={{ transitionDelay: "700ms", }} className={`whitespace-pre text-sm duration-500 ${!open && "opacity-0 translate-x-28 overflow-hidden"} text-white `}>
                                    聊天室
                                </h2>
                                <h2 className={`${open && 'hidden'} absolute left-14 bg-white font-semibold text-sm whitespace-pre rounded-md drop-shadow-lg p-0 w-0  overflow-hidden `}>
                                    聊天室
                                </h2>
                            </span>
                    }

                </div>
            </div>
            <ChatRoom chatRoomOpen={chatRoomOpen} setChatRoomOpen={setChatRoomOpen} />
        </>
    )
}
