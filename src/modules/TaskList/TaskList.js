import React, { useCallback, useEffect, useState } from "react";
import {
  addTask,
  changeTodoStatus,
  getTasks,
  removeTask,
} from "../../services/taskListServices/services";
import "./TaskList.css";
import SingleTask from "./SingleTask/SingleTask";
import moment from "moment";
import Form from "./Form/Form";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Header from "../../sharedComponents/Header/Header";
import Loader from "../../sharedComponents/Loader/Loader";
import Unauthorized from "../../sharedComponents/Unauthorized/Unauthorized";
import { FirebaseAuthConsumer } from "@react-firebase/auth";
import AlertMessage from "../../sharedComponents/AlertMessage/AlertMessage";
import { useAlert } from "../../sharedComponents/AlertMessage/hooks";
function TaskList() {
  const [tasks, setTasks] = useState([]);
  const { alertOpen, closeAlert, openAlert } = useAlert();
  useEffect(() => {
    getTasks().then((res) => setTasks(res.data));
  }, []);
  const newTask = useCallback(
    (text) => {
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
      } else {
        openAlert();
        setTimeout(closeAlert, 1500);
      }
    },
    [tasks]
  );
  const deleteTask = useCallback(
    (_id) => {
      removeTask(_id).then((res) => {
        if (res.status === 200) {
          setTasks(tasks.filter((item) => item._id !== _id));
        } else {
          console.log("something went wrong");
        }
      });
    },
    [tasks]
  );
  const toggleTodo = useCallback(
    (task) => {
      changeTodoStatus(task).then((res) => {
        if (res.status === 200) {
          setTasks(tasks.map((item) => (item._id === task._id ? task : item)));
        }
      });
    },
    [tasks]
  );
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
    <FirebaseAuthConsumer>
      {({ isSignedIn, user, providerId }) => {
        return isSignedIn ? (
          <>
            <div className="control-container">
              <Header />
            </div>
            <div className={"inner-container"}>{page}</div>
            <div className="socials button-add-container">
              <Form addTask={newTask} />
            </div>
            <AlertMessage
              mainText={"Empty task"}
              open={alertOpen}
              handleOpen={openAlert}
              handleClose={closeAlert}
              status={false}
            />
          </>
        ) : (
          <Unauthorized />
        );
      }}
    </FirebaseAuthConsumer>
  );
}

export default TaskList;
