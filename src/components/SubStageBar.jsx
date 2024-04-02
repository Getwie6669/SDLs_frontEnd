import React, { useState, useEffect } from 'react';

const DialogBox = ({ isOpen, onClose, onOptionSelect }) => {
    const [animationClass, setAnimationClass] = useState('');
    const [dialogContent, setDialogContent] = useState('嗨!有什麼能夠幫助你的嗎?');
    const [showOptions, setShowOptions] = useState(true);

    const stageGoal = [
        ["這個階段的目標是為了確定研究的主題範圍，並確保主題具有研究價值和實務意義哦!",
            "這個階段的目標是為了明確研究旨在解決的問題或達到的效果，闡述研究的重要性哦~",
            "這個階段的目標是為了定義清晰、具體的研究問題，指導研究的方向與範圍哦!"],
        ["這個階段的目標是為了建立研究架構和方法論基礎，明確研究的理論背景和假設哦~",
            "這個階段的目標是為了為收集資料和記錄研究過程提供標準化工具哦!",
            "這個階段的目標是為了合理安排研究活動的時間表，確保研究工作有秩序地進行哦~"],
        ["這個階段的目標是為了透過初步的研究活動，驗證研究方法的可行性和有效性哦!",
            "這個階段的目標是為了對收集到的資料進行系統性分析，透過圖表形式展示研究結果哦~",
            "這個階段的目標是為了詳細記錄研究過程和發現，包括資料分析、討論和結論哦!"],
        ["這個階段的目標是為了定期回顧研究工作的進展，確保研究按計畫進行哦~",
            "這個階段的目標是為了與導師、同儕或研究小組討論研究發現和問題，以獲得回饋和建議哦!",
            "這個階段的目標是為了總結研究的主要發現，討論研究的意義、限制和未來研究的方向哦~"]
    ];
    const stageProcess = [
        ["在這個階段你可以先進行文獻回顧，識別研究領域中的空白或爭議點，再透過討論和思考縮小研究範圍，最後再和小組成員一起確定出一個具體的研究主題!",
            "在這個階段你可以基於研究主題去細化研究的目標與期望成果，其中也包括了理論與實務層面的貢獻哦~",
            "在這個階段你可以根據研究目的，提出可操作的研究問題，同時確保問題具有明確性和可研究性!"],
        ["在這個階段你可以一步步地發展出研究概念框架，其中包括了研究假設、變數定義和預期的研究模型!",
            "在這個階段你可以根據研究問題和方法，設計資料收集表格和記錄表，包括但不限於問卷、訪談記錄和實驗資料表~",
            "在這個階段你可以制定詳細的研究計畫和時間線，包括各階段的開始和結束日期，以及關鍵活動和里程碑!"],
        ["在這個階段你可以在小範圍內實施研究設計，收集和分析數據，評估研究方法和工具的適用性~",
            "在這個階段你可以使用統計軟體或手動方法對資料進行分析，包括描述性統計、相關性分析等，並製作圖表來直觀展示分析結果!",
            "在這個階段你可以整理分析數據，撰寫研究報告的各個部分，包括引言、方法、結果、討論和結論等~"],
        ["在這個階段你可以定期檢視研究行程和成果，評估是否需要調整研究方向或方法!",
            "在這個階段你可以組織研究討論會，呈現研究結果，收集與整合回饋意見，對研究進行深入分析與完善!",
            "在這個階段你可以基於研究結果和討論，撰寫結論部分，明確指出研究的貢獻和後續研究的建議~"]
    ];

    const [displayedContent, setDisplayedContent] = useState('');


    useEffect(() => {
        setDisplayedContent(''); // 在开始打字前清空内容
        let charIndex = 0;
        const typeWriter = setInterval(() => {
            if (charIndex < dialogContent.length) {
                setDisplayedContent((prev) => prev + dialogContent[charIndex - 1]);
                charIndex++;
            } else {
                clearInterval(typeWriter);
            }
        }, 50); // 每50毫秒添加一个字符

        return () => clearInterval(typeWriter); // 清除定时器
    }, [dialogContent]); // 依赖于dialogContent的变化


    useEffect(() => {
        if (isOpen) {
            setAnimationClass('-translate-y-0 opacity-100');
        } else {
            setAnimationClass('translate-y-full opacity-0');
        }
        const style = document.createElement('style');
        style.innerHTML = `
            .dialog-box::after {
                content: '';
                position: absolute;
                bottom: -30px; 
                right: 28px; 
                border-left: 13px solid transparent;
                border-right: 13px solid transparent;
                border-top: 30px solid #f1f5f9; 
            }
        `;
        document.head.appendChild(style);

        // 组件卸载时移除样式
        return () => {
            document.head.removeChild(style);
        };
    }, [isOpen]);

    const handleOptionSelect = (option) => {
        const currentStageIndex = parseInt(localStorage.getItem("currentStage"), 10) || 1;
        const currentSubStageIndex = parseInt(localStorage.getItem('currentSubStage'), 10) || 1;
        if (option === 'option1') {
            setDialogContent(stageGoal[currentStageIndex - 1][currentSubStageIndex - 1] || '目前沒有設定子階段目標。');
        }
        if (option === 'option2') {
            setDialogContent(stageProcess[currentStageIndex - 1][currentSubStageIndex - 1] || '目前沒有設定子階段流程。');
        }
        setShowOptions(false);
    };

    const resetDialog = () => {
        setDialogContent('嗨!有什麼能夠幫助你的嗎?');
        setShowOptions(true);
        onClose();
    };

    if (!isOpen && animationClass.includes('opacity-0')) return null;

    return (
        <div className={`absolute right-0 bottom-0 mb-28 rounded-lg mr-40 transform transition-all duration-500 ease-in-out ${animationClass} shadow-2xl dialog-box`}>
            <div className="bg-slate-100 p-4 rounded-lg font-bold">
                <p>{displayedContent}</p>
                {showOptions && (
                    <>
                        <button onClick={() => handleOptionSelect('option1')} className="bg-[#5BA491] text-white w-full rounded-lg my-3">階段目標說明</button>
                        <button onClick={() => handleOptionSelect('option2')} className="bg-[#5BA491] text-white w-full rounded-lg">階段如何進行</button>
                    </>
                )}
                {!showOptions && (
                    <button onClick={resetDialog} className="bg-[#5BA491] text-white w-full rounded-lg my-3">我了解了!</button>
                )}
            </div>
        </div>
    );
};

const stageInfo = [
    ["提出研究主題", "提出研究目的", "提出研究問題"],
    ["訂定研究構想表", "設計研究記錄表格", "規劃研究排程"],
    ["進行嘗試性研究", "分析資列與繪圖", "撰寫研究結果"],
    ["檢視研究進度", "進行研究討論", "撰寫研究結論"]
];
const currentStageIndex = parseInt(localStorage.getItem("currentStage"), 10) || 1;
const currentSubStageIndex = parseInt(localStorage.getItem("currentSubStage"), 10) || 1;

const getStageColor = (stageIndex) => {
    if (currentSubStageIndex === stageIndex) {
        return '#5BA491'; // 当前阶段
    } else if (stageIndex < currentSubStageIndex) {
        return '#7C968F'; // 小于当前阶段的阶段
    } else {
        return '#BEBEBE'; // 其他阶段
    }
};
const getTextColor = (stageIndex) => {
    if (currentSubStageIndex === stageIndex) {
        return 'text-white animate-pulse '; // 当前阶段
    } else if (stageIndex < currentSubStageIndex) {
        return 'text-slate-200'; // 小于当前阶段的阶段
    } else {
        return 'text-slate-700'; // 其他阶段
    }
};
export default function SubStageComponent() {
    const isValidStageIndex = currentStageIndex > 0 && currentStageIndex <= stageInfo.length;
    const stages = isValidStageIndex ? stageInfo[currentStageIndex - 1] : [];
    const [isDialogOpen, setDialogOpen] = useState(false);

    const handleRobotClick = () => {
        document.body.style.overflow = 'hidden'; // 開啟DialogBox時禁止滾動
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        document.body.style.overflow = ''; // 關閉DialogBox時恢復滾動
        setDialogOpen(false);
    };

    const handleOptionSelect = (option) => {
        console.log(option);
        setDialogOpen(false);
        // 这里可以根据选项做更多的逻辑处理
    };
    // 使用状态来管理图片源
    const [imageSrc, setImageSrc] = useState('/robot.png');
    const [isHovered, setIsHovered] = useState(false);

    // 鼠标悬停时更改图片
    const handleMouseEnter = () => {
        setImageSrc('/robot2.png')
        setIsHovered(true)
    }

    // 鼠标离开时恢复原图片
    const handleMouseLeave = () => {
        setImageSrc('/robot.png')
        setIsHovered(false)
    }


    return (
        <div style={{ width: 'calc(100% - 4rem)' }} className="w-full max-w-screen bg-[#F5F5F5] absolute bottom-0 right-0 h-16 duration-500 border-r-2 pb-20 px-40">
            <div className="flex justify-evenly items-center p-4">
                {stages.map((subStage, index) => (
                    <React.Fragment key={index}>
                        <div style={{ backgroundColor: getStageColor(index + 1) }} className={`px-4 py-3 ${getTextColor(index + 1)} font-semibold rounded-lg shadow-inner`}>
                            {subStage}
                        </div>
                        {index < stages.length - 1 && (
                            // 添加水平虚线分隔符，但不在最后一个元素之后添加
                            <div className="border-b border-dashed border-gray-400 h-0.5 flex-grow mx-2"></div>
                        )}
                    </React.Fragment>
                ))}
                <span onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onClick={handleRobotClick} 
                    className=" ml-36 cursor-pointer "
                    style={{ width: '48px', height: '48px' }}>
                    <img src={imageSrc} alt="Robot" className={`transition-all duration-300 ease-in-out ${isHovered ? 'scale-110 ' : 'scale-100'}`} />
                </span>
                <DialogBox
                    isOpen={isDialogOpen}
                    onClose={handleCloseDialog}
                    onOptionSelect={handleOptionSelect}
                />

            </div>
        </div>
    );
}