import React, { useState, useEffect, useContext } from 'react'
import { IoIosNotificationsOutline } from "react-icons/io";
import { BsChevronDown, BsPlusCircleDotted } from "react-icons/bs";
import { getProjectUser } from '../api/users';
import { getProject } from '../api/project';
import { useQuery } from 'react-query';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'
import { GrFormClose } from "react-icons/gr";
import Modal from './Modal';
import Swal from 'sweetalert2';
import { socket } from '../utils/Socket';
import { Context } from '../context/context'

export default function TopBar() {
  const [projectUsers, setProjectUsers] = useState([{ id: "", username: "" }]);
  const [projectInfo, setProjectInfo] = useState({});
  const [referralCodeModalOpen, setReferralCodeModalOpen] = useState(false);
  const { projectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const personImg = [
    '/public/person/man1.png', '/public/person/man2.png', '/public/person/man3.png',
    '/public/person/man4.png', '/public/person/man5.png', '/public/person/man6.png',
    '/public/person/woman1.png', '/public/person/woman2.png', '/public/person/woman3.png'
  ];
  const [reloadPage, setReloadPage] = useState(false); // 新增狀態

  const { currentStageIndex, setCurrentStageIndex,currentSubStageIndex, setCurrentSubStageIndex} = useContext(Context)

  const getProjectUserQuery = useQuery("getProjectUser", () => getProjectUser(projectId),
    {
      onSuccess: setProjectUsers,
      enabled: !!projectId
    }
  );

  const getProjectQuery = useQuery("getProject", () => getProject(projectId),
    {
      onSuccess: (data) => {
        setProjectInfo(data);
        localStorage.setItem('currentStage', data.currentStage)
        localStorage.setItem('currentSubStage', data.currentSubStage)
        setCurrentStageIndex(data.currentStage)
        setCurrentSubStageIndex(data.currentSubStage)
      },
      enabled: !!projectId
    }
  );



  const cleanStage = () => {
    localStorage.removeItem('currentStage')
    localStorage.removeItem('currentSubStage')
    localStorage.removeItem('stageEnd')
  }

  const handleLogout = () => {
    Swal.fire({
      title: "登出",
      text: "確定要登出嗎?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#5BA491",
      cancelButtonColor: "#d33",
      confirmButtonText: "確定",
      cancelButtonText: "取消"
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        socket.disconnect();
        navigate("/");
      }
    });


  }

  if (location.pathname === "/homepage") {
    return (
      <div className='fixed z-40 h-16 w-full bg-[#FFFFFF] flex items-center justify-between pr-5 border-b-2'>
        <Link to="/homepage" onClick={cleanStage} className="flex px-5 items-center font-bold font-Mulish text-2xl">
          <img src="/SDLS_LOGOO.jpg" alt="Logo" className="h-14 w-auto" />
        </Link>
        <div className="flex items-center">
          <h3 className="font-bold p-1 mr-2 rounded-lg mx-3">
            {localStorage.getItem("username")}
          </h3>
          <button onClick={handleLogout} className='ml-3 bg-gray-100 text-gray-900 hover:bg-gray-200 rounded-md p-2 font-semibold'>
            登出
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='fixed z-40 h-16 w-full bg-[#FFFFFF] flex items-center justify-between pr-5 border-b-2'>
      <Link to="/homepage" onClick={cleanStage} className="flex px-5 items-center font-bold font-Mulish text-2xl">
        <img src="/SDLS_LOGOO.jpg" alt="Logo" className=" h-14 w-auto" />

      </Link>
      <div className="flex items-center">
        <ul className="flex items-center justify-center space-x-1">
          {getProjectUserQuery.isLoading || projectId === undefined ? <></> :
            getProjectUserQuery.isError ? <p className='font-bold text-2xl'>Error</p> :
              projectUsers.map((projectUser, index) => {
                const imgIndex = parseInt(projectUser.id) % 9;
                const userImg = personImg[imgIndex];
                return (
                  <li key={index} className="w-8 h-8 overflow-hidden rounded-full shadow-xl ">
                    <img src={userImg} alt="Person" className="w-full h-full object-cover" title={projectUser.username} />
                  </li>
                )
              })
          }
          <li>
            <button className="p-1 rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <BsPlusCircleDotted size={32} onClick={() => setReferralCodeModalOpen(true)} />
            </button>
          </li>
        </ul>

        <h3 className="font-bold cursor-pointer p-1 mr-2 rounded-lg mx-3">
          {localStorage.getItem("username")}
        </h3>
        <button onClick={handleLogout} className='ml-3 bg-gray-100 text-gray-900 hover:bg-gray-200 rounded-md p-2 font-semibold'>
          登出
        </button>
      </div>
      <Modal open={referralCodeModalOpen} onClose={() => setReferralCodeModalOpen(false)} opacity={true} position={"justify-center items-center"}>
        <button onClick={() => setReferralCodeModalOpen(false)} className=' absolute top-1 right-1 rounded-lg bg-white hover:bg-slate-200'>
          <GrFormClose className=' w-6 h-6' />
        </button>
        <div className='flex flex-col p-3'>
          <h3 className=' font-bold text-base mb-3'>專案邀請碼:</h3>
          <h3 className=' text-center font-bold text-lg py-1 bg-slate-200/70 rounded-md'>
            {projectInfo.referral_code}
          </h3>
        </div>
      </Modal>
    </div>
  )
}
