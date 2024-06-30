import React from "react";
import { MdDeleteForever, MdModeEditOutline } from "react-icons/md";
import { IoCheckmarkDoneSharp } from "react-icons/io5";

const Task = ({ task, index, deleteTask, getSingleTask, setToComplete }) => {
  return (
    <div className={task.completed ? "task completed": "task"}>
      <p>
        <b>{index + 1}.</b> {task.name}
      </p>
      <div className="task-icons">
        <IoCheckmarkDoneSharp color="green" onClick={() => setToComplete(task)} />
        <MdModeEditOutline color="purple" onClick={() => getSingleTask(task)} />
        <MdDeleteForever color="#8b0000" onClick={() => deleteTask(task._id)} />
      </div>
    </div>
  );
};

export default Task;
