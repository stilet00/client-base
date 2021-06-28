import React, { useEffect, useState } from "react";
import {
  addTask,
  changeTodoStatus,
  getTasks,
  removeTask,
} from "../../services/taskListServices/services";
import "./TaskList.css";
import SingleTask from "./SingleTask/SingleTask";
import moment from "moment";
import Form from "../Form/Form";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Header from "../../shared/Header/Header";
import Loader from "../../shared/Loader/Loader";
function TaskList(props) {
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    getTasks().then((res) => setTasks(res.data));
  }, []);
  function newTask(text) {
    if (text) {
      let task = {
        taskName: text,
        completed: false,
        created: moment().format("MMMM Do YYYY, h:mm:ss"),
      };
      addTask(task).then((res) => {
        let newTask = { ...task, _id: res.data };
        if (res.status === 200) {
          setTasks([...tasks, newTask]);
        } else {
          console.log("something went wrong");
        }
      });
    }
  }
  function deleteTask(_id) {
    removeTask(_id).then((res) => {
      if (res.status === 200) {
        setTasks(tasks.filter((item) => item._id !== _id));
      } else {
        console.log("something went wrong");
      }
    });
  }
  function toggleTodo(task) {
    changeTodoStatus(task).then((res) => {
      if (res.status === 200) {
        setTasks(tasks.map((item) => (item._id === task._id ? task : item)));
      }
    });
  }
  const page = !tasks.length ? (
    <Loader />
  ) : (
    <TransitionGroup className="todo-list" component={"ul"}>
      {tasks.map((item) => (
        <CSSTransition key={item._id} timeout={500} classNames="item">
          <SingleTask {...item} onDelete={deleteTask} onToggle={toggleTodo} />
        </CSSTransition>
      ))}
    </TransitionGroup>
  );
  return (
    <>
      <Header />
      <div className={"taskList-container"}>{page}</div>
      <div className="socials button-add-container">
        <Form addTask={newTask} />
      </div>
    </>
  );
}

export default TaskList;
