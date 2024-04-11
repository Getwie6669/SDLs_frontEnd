import React, {useState, useContext} from 'react';
import { TypeAnimation } from 'react-type-animation';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { userRegister } from '../../api/users';
import { AuthContext } from '../../utils/AuthContext';
import Swal from 'sweetalert2';
import Login_icon from "../../assets/Animation-login.json";
import Lottie from "lottie-react";

export default function Register() {
    const [userData, setUserData] = useState({role:"student"});
    const [userContext, setUserContext] = useContext(AuthContext);
    const [ error, setError ] = useState("");
    const navigate = useNavigate();
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);

    const handleChange = e =>{
        const { name, value } = e.target
        setUserData( prev => ({
            ...prev,
            [name]:value
        }));
    }

    const validateInput = () => {
        if (isFormSubmitted && !userData.confirmPassword) {
            setError("請確認密碼");
        } else if (userData.confirmPassword !== userData.password) {
            setError("密碼不相符");
        } else {
            setError("");
        }
    };

    const userRegisterMutation = useMutation(userRegister, {
        onSuccess: (res) => {
            console.log(res);
            localStorage.setItem("accessToken", res.data.accessToken);
            localStorage.setItem("account", res.data.account);
            localStorage.setItem("id", res.data.id);
            setUserContext(prev => ({
                ...prev,
                account: res.data.account,
                id: res.data.id,
                accessToken: res.data.accessToken,
            }));
            navigate("/");
            // 成功註冊時彈出 SweetAlert 提示
            Swal.fire({
                icon: 'success',
                title: '註冊成功！',
                text: '您已成功註冊！',
                confirmButtonText: '確定',
                timer: 2000,
                timerProgressBar: true,
                confirmButtonColor: '#5BA491'
            });
        },
        onError: (err) => {
            console.log(err);
            if (err.response && err.response.status === 400 && err.response.data && err.response.data.message === '該用戶已存在，請嘗試其他用戶名稱。') {
                // 如果用戶已存在，顯示相應的 SweetAlert 提示
                Swal.fire({
                    icon: 'error',
                    title: '註冊失敗',
                    text: '該用戶已存在，請嘗試其他用戶名稱。',
                    confirmButtonText: '確定',
                    timer: 2000,
                    timerProgressBar: true,
                    confirmButtonColor: '#5BA491'
                });
            } else {
                setError("帳號或密碼錯誤");
                // 其他錯誤情況下，顯示一般的錯誤提示
                Swal.fire({
                    icon: 'error',
                    title: '註冊失敗',
                    text: '請檢查您的帳號或密碼！',
                    confirmButtonText: '確定',
                    timer: 2000,
                    timerProgressBar: true,
                    confirmButtonColor: '#5BA491'
                });
            }
        }
    });

    const handleSubmit = (e) =>{
        e.preventDefault()
        setIsFormSubmitted(true);
        validateInput();
        if (!error) {
            userRegisterMutation.mutate(userData);
        }
    };
    
    return (
        <section className="flex flex-col md:flex-row h-screen items-center">
            <div className="hidden bg-white w-full md:w-1/2 xl:w-1/2 h-screen md:flex md:items-center md:justify-center">
            <div className='flex flex-col items-center justify-center h-full'>
                {/* <h1 className='mx-auto  text-7xl mb-2'>自主學習</h1> */}
                <TypeAnimation
                  sequence={[
                    "自主學習 Self-directed Learning",
                    3000,
                    "學習歷程 Learning Portfolio",
                    3000,
                  ]}
                  speed={50}
                  wrapper="span"
                  cursor={true}
                  repeat={Infinity}
                  className="mx-auto font-press-start font-semibold text-4xl  mb-20"
                />
                {/* <img src='images/login.png' width={'600px'} alt='I am B' /> */}
                <Lottie className="w-96" animationData={Login_icon} />

                </div>
            </div>
        <div className="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 xl:w-1/2 h-screen px-6 lg:px-16 xl:pr-80 flex items-center justify-center">
            <div className="bg-white w-full h-100 rounded-lg p-8 shadow-2xl">
                <h1 className="text-4xl font-bold mb-6 flex items-center justify-center">Sign up</h1>
                <form className="mt-6">
                <div>
                    <label className="block text-gray-700 text-base">名稱</label>
                    <input type="text" name="username" placeholder="請輸入名稱" onChange={handleChange} className=" text-base w-full px-4 py-3 rounded-lg bg-white mt-2 border focus:border-green-700 focus:bg-white focus:outline-none" autoFocus required />
                </div>
                <div>
                    <label className="block text-gray-700 text-base">帳號</label>
                    <input type="text" name="account" placeholder="請輸入帳號" onChange={handleChange} className=" text-base w-full px-4 py-3 rounded-lg bg-white mt-2 border focus:border-green-700 focus:bg-white focus:outline-none" autoFocus required />
                </div>
                <div>
                    <label className="block text-gray-700 text-base">密碼</label>
                    <input type="password" name="password" placeholder="請輸入密碼" minLength="6" onChange={handleChange} className=" text-base w-full px-4 py-3 rounded-lg bg-white mt-2 border focus:border-green-700 focus:bg-white focus:outline-none" autoFocus required />
                </div>
                <div>
                    <label className="block text-gray-700 text-base">確認密碼</label>
                    <input type="password" name="confirmPassword" placeholder="請輸入確認密碼" minLength="6" onChange={handleChange} onBlur={validateInput} className=" text-base w-full px-4 py-3 rounded-lg bg-white mt-2 border focus:border-green-700 focus:bg-white focus:outline-none" autoFocus required />
                    {error && <span className=' text-xs text-red-600'>{error}</span>}
                </div>
                <div className="mt-4">
                    <label className="block text-gray-700 text-base">職位</label>
                    <select name="role" onChange={handleChange} className=" text-base w-full px-4 py-3 rounded-lg bg-white mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none" required>
                        <option value="student">學生</option>
                        <option value="teacher">教師</option>
                    </select>
                </div>
                <button type="submit" onClick={handleSubmit} style= { {backgroundColor:"#5BA491" } }  className="w-full block hover:bg-violet-400 focus:bg-violet-400 text-white font-semibold rounded-lg px-4 py-3 mt-6 text-base">註冊</button>
                </form>
                <p className="mt-8">
                已經有帳號了? 
                <span style= { {color:"#5BA491" } } className="text-blue-500 hover:text-blue-700 font-semibold ml-2">
                    <Link to="/">Sign in</Link> 
                </span>
                </p>
            </div>
        </div>
    </section>
    )
}
