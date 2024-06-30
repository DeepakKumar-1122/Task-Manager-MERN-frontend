import TaskForm from "./TaskForm";
import axios from "axios";
import { URL } from "../App";
import Task from "./Task";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import loadingImg from "../assets/loader.gif";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [taskID, setTaskID] = useState("");
  const [completedTasks, setCompletedTasks] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    completed: false,
  });
  const { name } = formData;

  useEffect(() => {
    getTasks();
  }, []);

  useEffect(() => {
    const comTasks = tasks.filter((task) => {
      return task.completed === true;
    });
    setCompletedTasks(comTasks);
  }, [tasks]);

  const getTasks = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${URL}/api/tasks`);
      setTasks(data);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.log(e.message);
      toast.error(e.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const createTask = async (e) => {
    e.preventDefault();
    if (name === "") {
      return toast.error("Input field cannot be empty.");
    }
    try {
      await axios.post(`${URL}/api/tasks`, formData);
      setFormData({ ...formData, name: "" });
      getTasks();
    } catch (error) {
      toast(error.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${URL}/api/tasks/${id}`);
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getSingleTask = async (task) => {
    setFormData({ name: task.name, completed: false });
    setTaskID(task._id);
    setIsEditing(true);
  };

  const updateTask = async (e) => {
    e.preventDefault();
    if (name === "") {
      return toast.error("Input field cannot be empty.");
    }
    try {
      await axios.put(`${URL}/api/tasks/${taskID}`, formData);
      setFormData({ ...formData, name: "" });
      setIsEditing(false);
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const setToComplete = async (task) => {
    const newFormData = {
      name: task.name,
      completed: true,
    };
    try {
      await axios.put(`${URL}/api/tasks/${task._id}`, newFormData);
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <h2>Task Manager</h2>
      <TaskForm
        createTask={createTask}
        name={name}
        handleInputChange={handleInputChange}
        isEditing={isEditing}
        updateTask={updateTask}
      />
      {tasks.length > 0 && (
        <>
          <div className="--flex-between --pb">
            <p>
              <b>Total Tasks:</b> {tasks.length}
            </p>
            <p>
              <b>Completed Tasks:</b> {completedTasks.length}
            </p>
          </div>
          <hr />
        </>
      )}
      {isLoading && (
        <div className="--flex-center">
          <img className="loader-gif" src={loadingImg} alt="Loading" />
        </div>
      )}
      {!isLoading && tasks.length === 0 ? (
        <p className="--py">No task added yet.</p>
      ) : (
        <>
          {tasks.map((task, index) => {
            return (
              <Task
                key={task._id}
                task={task}
                index={index}
                deleteTask={deleteTask}
                getSingleTask={getSingleTask}
                setToComplete={setToComplete}
              />
            );
          })}
        </>
      )}
    </div>
  );
};

export default TaskList;
