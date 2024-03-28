import React from 'react';

const stageInfo = [
    ["提出研究主題", "提出研究目的", "提出研究問題"],
    ["訂定研究構想表", "設計研究記錄表格", "規劃研究排程"],
    ["進行嘗試性研究", "分析資列與繪圖", "撰寫研究結果"],
    ["檢視研究進度", "進行研究討論", "撰寫研究結論"]
];
const currentStageIndex = parseInt(localStorage.getItem("currentStage"), 10)|| 1;
const currentSubStageIndex = parseInt(localStorage.getItem("currentSubStage"), 10)|| 1;

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
        return 'text-white'; // 当前阶段
    } else if (stageIndex < currentSubStageIndex) {
        return 'text-slate-200'; // 小于当前阶段的阶段
    } else {
        return 'text-slate-700'; // 其他阶段
    }
};
export default function SubStageComponent() {
    // 检查currentStageIndex是否在stageInfo的有效索引范围内
    const isValidStageIndex = currentStageIndex > 0 && currentStageIndex <= stageInfo.length;
    const stages = isValidStageIndex ? stageInfo[currentStageIndex - 1] : [];

    return (
        <div style={{ width: 'calc(100% - 4rem)' }} className="w-full max-w-screen bg-[#F5F5F5] absolute bottom-0 right-0 h-16 duration-500 border-r-2 pb-20 ">
            <div className="flex justify-evenly items-center p-4">
                {stages.map((subStage, index) => (
                    <div key={index} style={{ backgroundColor: getStageColor(index + 1) }} className={`px-4 py-3 ${getTextColor(index + 1)} font-semibold rounded-lg`}>
                        {subStage}
                    </div>
                ))}
            </div>
        </div>
    );
};