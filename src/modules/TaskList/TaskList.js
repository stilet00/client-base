import React from "react";
import "../../styles/modules/TaskList.css";
import SingleTask from "./SingleTask/SingleTask";
import Form from "./Form/Form";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Menu from "../../sharedComponents/Navigation/Navigation";
import Loader from "../../sharedComponents/Loader/Loader";
import Unauthorized from "../AuthorizationPage/Unauthorized/Unauthorized";
import AlertMessage from "../../sharedComponents/AlertMessage/AlertMessage";
import { useTaskList } from "./businessLogic";

function TaskList({ user }) {
  const {
    tasks,
    alertOpen,
    closeAlert,
    openAlert,
    deleteTask,
    newTask,
    toggleTodo,
  } = useTaskList(user);

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
  return user ? (
    <>
      <Menu />
      <div className={"taskList-container animated-box"}>{page}</div>
      <div className="socials button-add-container bottom-button">
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
}

export default TaskList;
