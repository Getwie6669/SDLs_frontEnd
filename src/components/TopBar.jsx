import React, { useState, useEffect } from 'react'
import { IoIosNotificationsOutline } from "react-icons/io";
import { BsChevronDown, BsPlusCircleDotted } from "react-icons/bs";
import { getProjectUser } from '../api/users';
import { getProject } from '../api/project';
import { useQuery } from 'react-query';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'
import { GrFormClose } from "react-icons/gr";
import Modal from './Modal';
import Swal from 'sweetalert2';

export default function TopBar() {
  const [projectUsers, setProjectUsers] = useState([{ id: "", username: "" }]);
  const [projectInfo, setProjectInfo] = useState({});
  const [referralCodeModalOpen, setReferralCodeModalOpen] = useState(false);
  const { projectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

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
          <h3 className="font-bold cursor-pointer p-1 mr-2 rounded-lg">
            {localStorage.getItem("username")}
          </h3>
          <h3 className="font-bold cursor-pointer p-1 mr-2 hover:bg-slate-100 rounded-lg" onClick={handleLogout}>
            登出
          </h3>
        </div>
      </div>
    );
  }

  return (
    // <div className='fixed  h-16 w-full pl-20 bg-[#FFFFFF] flex items-center justify-between pr-5 border-b-2'>
    <div className='fixed z-40 h-16 w-full bg-[#FFFFFF] flex items-center justify-between pr-5 border-b-2'>
      <Link to="/homepage" onClick={cleanStage} className="flex px-5 items-center font-bold font-Mulish text-2xl">
        {/* <img src="/logo.ico" alt="Logo" className="mr-2" /> */}
        <img src="/SDLS_LOGOO.jpg" alt="Logo" className=" h-14 w-auto" />

      </Link>
      <div className="flex items-center">
        <ul className="flex items-center justify-center space-x-1">
          {
            getProjectUserQuery.isLoading || projectId === undefined ? <></> :
              getProjectUserQuery.isError ? <p className=' font-bold text-2xl'>{kanbansIsError.message}</p> :
                projectUsers.map((projectUser, index) => {
                  return (
                    <li key={index} className={`w-8 h-8 bg-slate-100 border-[1px] border-slate-400 rounded-full flex items-center text-center p-2 shadow-xl text-xs overflow-hidden cursor-default`}>
                      {projectUser.username}
                    </li>
                  )
                })
          }
          <li>
            <button
              className="flex items-center w-9 h-9 justify-center">
              <BsPlusCircleDotted
                size={32}
                className=" text-gray-500"
                onClick={() => setReferralCodeModalOpen(true)}
              />
            </button>
          </li>
        </ul>

        <IoIosNotificationsOutline size={30} className='cursor-pointer mx-3' />
        <h3 className="font-bold cursor-pointer p-1 mr-2 rounded-lg">
          {localStorage.getItem("username")}
        </h3>
        <h3 className="font-bold cursor-pointer p-1 mr-2 hover:bg-slate-100 rounded-lg" onClick={handleLogout}>
          登出
        </h3>
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
