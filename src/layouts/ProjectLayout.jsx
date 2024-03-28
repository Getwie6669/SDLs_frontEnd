import React from 'react'
import TopBar from '../components/TopBar';
import SideBar from '../components/SideBar';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import SubStageComponent from '../components/SubStageBar';

export default function ProjectLayout() {
    const location = useLocation();
    const { projectId } = useParams();
    return (
        <div className='min-w-full min-h-screen h-screen overflow-hidden overflow-x-scroll'>
            {
                location.pathname === `/project/${projectId}/kanban` ? (
                    <>
                        <SubStageComponent />
                        <SideBar />
                        <TopBar />
                    </>
                ) : (
                    <>
                        {/* <SubStageComponent /> */}
                        <SideBar />
                        <TopBar />

                    </>
                )
            }
            <Outlet />
        </div>
    )
}
