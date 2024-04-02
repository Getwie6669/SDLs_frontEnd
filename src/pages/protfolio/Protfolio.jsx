import React, { useState, useEffect } from 'react';
import { AiTwotoneFolderAdd } from "react-icons/ai";
import { GrFormClose } from "react-icons/gr";
import { useQuery, useQueryClient } from 'react-query';
import { getAllSubmit } from '../../api/submit';
import { useParams } from 'react-router-dom';
import Loader from '../../components/Loader';
import FolderModal from './components/folderModal';

import { AiOutlineCloudDownload } from "react-icons/ai";
import FileDownload from 'js-file-download';

export default function Protfolio() {
    const [stageProtfolio, setStageProtfolio] = useState([]);
    const [folderModalOpen, setFolderModalOpen] = useState(false);
    const [modalData, setModalData] = useState({});
    const { projectId } = useParams();

    const {
        isLoading,
        isError,
    } = useQuery("protfolioDatas", () => getAllSubmit(
        { params: { projectId: projectId } }),
        { onSuccess: setStageProtfolio }
    );

    return (
        <div className='min-w-full min-h-screen h-screen'>
            <div className='flex-grow'>
                <div className='flex flex-col my-5 pl-20 pr-5 sm:px-20 py-16 w-full h-screen justify-start items-start'>
                    <h3 className='text-lg font-bold mb-4'>歷程檔案</h3>
                    <div className=' flex flex-wrap justify-start items-center w-full mb-5 pr-80'>
                        {
                            isLoading ? <Loader /> :
                                isError ? <p className=' font-bold text-2xl'>{isError.message}</p> :
                                    stageProtfolio.map(item => {
                                        const { id, stage } = item;
                                        return (
                                            <div className='flex mx-3 mb-3' key={id} style={{ minWidth: 'calc(33.333% - 2rem)', maxWidth: 'calc(33.333% - 2rem)' }}>
                                                <button
                                                    className="inline-flex items-center justify-center w-full h-28 bg-[#5BA491] text-white border-2 font-semibold rounded-lg p-2 text-base"
                                                    onClick={() => {
                                                        setFolderModalOpen(true);
                                                        setModalData(item);
                                                    }}
                                                >
                                                    <AiTwotoneFolderAdd size={24} className="mr-2" /> <span>{stage}</span>
                                                </button>
                                            </div>
                                        )
                                    })
                        }
                    </div>
                    {/* <FolderModal folderModalOpen={folderModalOpen} setFolderModalOpen={setFolderModalOpen} modalData={modalData} /> */}
                </div>
            </div>

            <div className={`w-[400px] h-full fixed right-0 top-16 bg-white shadow-lg transform ease-in-out duration-300 ${folderModalOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <button onClick={() => setFolderModalOpen(false)} className=' absolute top-1 right-1 rounded-lg bg-white hover:bg-slate-200'>
                    <GrFormClose className=' w-6 h-6' />
                </button>
                <div className='flex flex-col justify-start items-center w-full p-4'>
                    {modalData.content ?
                        Object.entries(JSON.parse(modalData.content)).map((element, index) => {
                            const name = element[0];
                            const content = element[1];
                            return (
                                <div className='mt-3' key={index}>
                                    <span className='font-bold text-base'>{name}:</span>
                                    <span className='font-bold text-base'>{content}</span>
                                </div>
                            )
                        })
                        : <p>沒有可顯示的內容</p>}
                    {modalData.filename && (
                        <button
                            className="inline-flex items-center bg-white hover:bg-slate-200/80 text-slate-400 border-2 border-slate-400 font-semibold rounded-md p-1 mt-3 sm:px-4 text-base  min-w-[100px]"
                            onClick={() => {
                                setQueryFetch(prev => !prev);
                            }}
                        >
                            <AiOutlineCloudDownload size={32} className="text-black mr-1" />
                            <span>下載附件</span>
                        </button>
                    )}
                    {isLoading && <Loader />}
                    {isError && <p>載入錯誤</p>}
                </div>
            </div>
        </div>
    )
}
