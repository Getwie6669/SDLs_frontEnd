import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiPlus } from "react-icons/fi";
import { v4 as uuidv4 } from 'uuid';
import Carditem from './components/Carditem';
import TaskHint from './components/TaskHint';
import Loader from '../../components/Loader';
import { FaPlus } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import { StrictModeDroppable as Droppable } from '../../utils/StrictModeDroppable';
import SubStageComponent from '../../components/SubStageBar';

import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getKanbanColumns, getKanbanTasks, addCardItem } from '../../api/kanban';
import { getSubStage } from '../../api/stage';
import { socket } from '../../utils/Socket';

export default function Kanban() {
  const [kanbanData, setKanbanData] = useState([]);
  const [newCard, setNewCard] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedcolumn, setSelectedcolumn] = useState(0);
  const { projectId } = useParams();
  const [stageInfo, setStageInfo] = useState({ name: "", description: "" });
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [showAddGroupInput, setShowAddGroupInput] = useState(false); // 新增狀態
  const [newGroupName, setNewGroupName] = useState('');
  const currentStage = localStorage.getItem("currentStage");
  const currentSubStage = localStorage.getItem("currentSubStage");
  // const [isLoading, setIsLoading] = useState(false);
  // const [isError, setIsError] = useState(false);
  // const [error, setError] = useState(null);

  const {
    isLoading: kanbanIsLoading,
    isError: kanbansIsError,
    error: KanbansError,
    data: KanbansData,
  } = useQuery(
    ['kanbanDatas', projectId],
    () => getKanbanColumns(projectId),
    {
      onSuccess: setKanbanData
    }
  );

  //   useEffect(() => {
  //     const fetchKanbanData = async () => {
  //       setIsLoading(true); // 开始加载数据
  //       setIsError(false); // 重置错误状态
  //       setError(null); // 清除之前的错误信息
  //       try {
  //         const updatedKanbanData = await getKanbanColumns(projectId);
  //         setKanbanData(updatedKanbanData);
  //         setIsLoading(false); // 加载完成
  //       } catch (error) {
  //         console.error("获取看板列数据失败:", error);
  //         setError(error); // 设置错误信息
  //         setIsError(true); // 标记错误状态
  //         setIsLoading(false); // 加载完成
  //       }
  //     };
  //     fetchKanbanData();
  // }, [projectId]);

  const getSubStageQuery = useQuery("getSubStage", () => getSubStage({
    projectId: projectId,
    currentStage: localStorage.getItem("currentStage"),
    currentSubStage: localStorage.getItem("currentSubStage")
  }),
    {
      onSuccess: (data) => {
        setStageInfo(prev => ({
          ...prev,
          ...data,
          currentStage: localStorage.getItem("currentStage"),
          currentSubStage: localStorage.getItem("currentSubStage")
        }));
      },
      enabled: !!localStorage.getItem("currentStage")
    }
  );

  useEffect(() => {
    function KanbanUpdateEvent(data) {
      if (data) {
        console.log(data);
        queryClient.invalidateQueries(['kanbanDatas', projectId]);
      }
    }
    function kanbanDragEvent(data) {
      if (data) {
        console.log(data);
        setKanbanData(data)
      }
    }
    socket.connect();
    socket.on("taskItems", KanbanUpdateEvent);
    socket.on("taskItem", KanbanUpdateEvent);
    socket.on("dragtaskItem", kanbanDragEvent);

    return () => {
      socket.off('taskItems', KanbanUpdateEvent);
      socket.off('taskItem', KanbanUpdateEvent);
      socket.off("dragtaskItem", kanbanDragEvent);

      // socket.disconnect();
      // socket.off('taskItem', KanbanUpdateEvent);
    };
  }, [socket]);

  useEffect(() => {
    if (!currentStage || !currentSubStage) {
      navigate(0);
    }
  }, [currentStage, currentSubStage, navigate])

  // const onDragEnd = (result) => {
  //   const { destination, source, type } = result;
  //   // 拖放被取消（例如，拖放到了非法区域）
  //   if (!destination) {
  //     return;
  //   }

  //   // 拖放结束位置与开始位置相同
  //   if (
  //     destination.droppableId === source.droppableId &&
  //     destination.index === source.index
  //   ) {
  //     return;
  //   }
  //   // 处理列的拖放逻辑
  //   if (type === 'COLUMN') {
  //     const newKanbanData = Array.from(kanbanData);
  //     const [reorderedColumn] = newKanbanData.splice(source.index, 1);
  //     newKanbanData.splice(destination.index, 0, reorderedColumn);

  //     setKanbanData(newKanbanData);
  //   } else if (type === 'CARD') {
  //     socket.emit('cardItemDragged', {
  //       destination,
  //       source,
  //       kanbanData
  //     })
  //   }
  // }


  const onDragEnd = useCallback((result) => {
    const { destination, source, type } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    if (type === 'COLUMN') {
      const newKanbanData = Array.from(kanbanData);
      const [reorderedColumn] = newKanbanData.splice(source.index, 1);
      newKanbanData.splice(destination.index, 0, reorderedColumn);

      setKanbanData(newKanbanData);
      // socket.emit('cardItemDragged', {
      //   destination,
      //   source,
      //   newKanbanData
      // })
    } else if (type === 'CARD') {
      socket.emit('cardItemDragged', {
        destination,
        source,
        kanbanData
      })
      // setKanbanData(newKanbanData);

    }
  }, [kanbanData]);

  const handleChange = (e) => {
    setNewCard(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newCard.length === 0) {
      setShowForm(false);
    }
    else {
      const item = {
        title: newCard,
        content: "",
        labels: [],
        assignees: []
      }
      // addKanbanMutation.mutate({item})
      socket.emit("taskItemCreated", {
        selectedcolumn,
        item,
        kanbanData
      });
      setShowForm(false);
      setNewCard("");
    }

  }

  const toggleAddGroupInput = () => {
    setShowAddGroupInput(!showAddGroupInput); // 切換輸入框的顯示狀態
  };

  // 新增列表
  const handleAddGroup = () => {
    if (newGroupName.trim() !== '') {
      socket.emit("ColumnCreated", {
        projectId,
        newGroupName
      });
      socket.on("ColumnCreatedSuccess", async () => {
        // 使与看板数据相关的查询失效，以触发重新获取
        // queryClient.invalidateQueries(['kanbanDatas', projectId])

        try {
          const updatedKanbanData = await getKanbanColumns(projectId);
          console.log("updatedKanbanData:", updatedKanbanData)
          setKanbanData(updatedKanbanData); // 使用最新数据更新状态
        } catch (error) {
          console.error("获取看板列数据失败:", error);
        }
        // 清空输入框并隐藏添加组的输入框
        setNewGroupName('');
        setShowAddGroupInput(false);
      });

      console.log(kanbanData)
    }
  };

  return (
    <div style={{ display: 'inline-flex' }} className="layout__wrapper min-w-full h-full bg-white" >
      <div className="card p-8 w-full px-20">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="header mb-4">
            <h1 className="text-2xl text-gray">Kanban</h1>
          </div>

          <Droppable droppableId="all-droppables" type='COLUMN' direction="horizontal">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex space-x-4 overflow-x-auto " // 添加 overflow-x-auto 以启用水平滚动
                style={{ display: 'inline-flex', flexDirection: 'row', paddingBottom: '1rem' }} // 确保列是水平排列的，并且底部有足够空间
              >
                {!showAddGroupInput && (
                  <button className="bg-[#5BA491] hover:bg-[#5BA491]/90 w-60 h-24 flex flex-row items-center rounded-lg border-none p-7" onClick={toggleAddGroupInput}>
                    <FaPlus className="text-white m-3" />
                    <b className="text-base text-white">
                      新增列表
                    </b>
                  </button>


                )}
                {showAddGroupInput && (
                  <div className="group-container">
                    <div className="flex flex-col store-container  w-60 h-24 bg-slate-100 px-4 py-3 rounded-lg mb-2">
                      <input
                        type="text"
                        placeholder="輸入列表標題..."
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        className="text-sm border border-gray-300 p-2 w-52 rounded-md mb-2"
                      />
                      <div className='flex justify-start items-center'>
                        <button
                          onClick={handleAddGroup}
                          className="bg-[#5BA491] hover:bg-[#5BA491]/80 p-2 text-sm text-white font-bold py-1 px-4 rounded transition ease-in-out duration-300"
                        >
                          新增列表
                        </button>
                        <button

                          onClick={toggleAddGroupInput}
                          className="flex-center p-2 py-1"
                        >
                          <RxCross2 />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {
                  kanbanIsLoading ? <Loader /> :
                    kanbansIsError ? <p className=' font-bold text-2xl'>{kanbansIsError.message}</p> :
                      kanbanData.map((column, columnIndex) => (
                        <Draggable draggableId={`column-${column.id}`}
                          index={columnIndex}
                          key={column.id}>
                          {(provided) => (
                            <div
                              {...provided.draggableProps}
                              ref={provided.innerRef}
                              className="group-container w-60 bg-slate-50 rounded-lg shadow-lg"
                            >
                              <div
                                {...provided.dragHandleProps}
                                className="store-container  p-3 rounded-lg cursor-move "
                              >
                                <h3 style={{ color: "#5BA491" }} className="text-lg font-semibold">
                                  {column.name}
                                </h3>
                              </div>
                              {
                                <Droppable droppableId={columnIndex.toString()} type='CARD'>
                                  {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef}>
                                      <div className="flex flex-col px-4 pb-1">
                                        <div className="items-container">
                                          {column.task.length > 0 &&
                                            column.task.map((item, index) => (


                                              // <Draggable draggableId={item.id.toString()} index={index} key={item.id}>
                                              //   {(provided) => (
                                              //     <div
                                              //       // className="item-container bg-white p-2 rounded-lg mb-2 w-full shadow-lg "
                                              //       // {...provided.dragHandleProps}
                                              //       {...provided.draggableProps}
                                              //       ref={provided.innerRef}
                                              //     >
                                              <Carditem
                                                key={item.id}
                                                index={index}
                                                data={item}
                                                columnIndex={columnIndex}
                                              />
                                              //   </div>
                                              // )}
                                              // </Draggable>


                                            ))}
                                          {provided.placeholder}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </Droppable>
                              }
                              {
                                showForm && selectedcolumn === columnIndex ? (
                                  <div className='flex flex-col store-container rounded-lg mb-2 px-4'>
                                    <input
                                      // className="border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-customgreen w-full p-1"
                                      className='text-sm border border-gray-300 p-2 w-52 rounded-md mb-2'
                                      rows={3}
                                      placeholder="輸入卡片標題..."
                                      onChange={handleChange}
                                    />
                                    <div className='flex justify-start items-center'>
                                      <button
                                        style={{ backgroundColor: "#5BA491" }}
                                        // className="flex justify-center items-center w-1/2 my-1 mr-1 p-1 bg-white rounded-md font-bold text-sm"
                                        className='p-2 text-sm text-white font-bold py-1 px-4 rounded transition ease-in-out duration-300'
                                        onClick={handleSubmit}
                                      >
                                        新增
                                      </button>
                                      <button
                                        className="flex-center p-2 py-1"
                                        onClick={() => { setShowForm(false); }}
                                      >
                                        <RxCross2 />
                                      </button>
                                    </div>
                                  </div>

                                ) : (
                                  <div className="flex justify-start px-4">
                                    <button
                                      onClick={() => { setSelectedcolumn(columnIndex); setShowForm(true); }}
                                      className="bg-[#5BA491] hover:bg-[#5BA491]/80 text-sm p-2 mb-2 text-white font-bold py-1 px-4 rounded transition ease-in-out duration-300"
                                    >
                                      新增卡片
                                    </button>
                                  </div>

                                )
                              }

                            </div>
                          )}
                        </Draggable>
                      ))}
                {provided.placeholder}
              </div>
            )
            }
          </Droppable>
        </DragDropContext >
      </div>
      {/* <div className="stage-info-container flex justify-center my-4">
        <div className="flex flex-col items-center justify-center bg-gray-200 rounded-lg p-4 m-2">
          <p className="text-lg font-semibold">{stageInfo.name}</p>
        </div>
      </div> */}

      {/* <SubStageComponent /> */}
    </div >
  )
}

