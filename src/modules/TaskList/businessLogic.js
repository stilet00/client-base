import { useCallback, useState } from "react";
import { useQuery } from "react-query";
import { useAlert } from "../../sharedComponents/AlertMessage/hooks";
import {
	addTask,
	changeTodoStatus,
	getTasks,
	removeTask,
} from "../../services/taskListServices/services";
import { getMomentUTC } from "sharedFunctions/sharedFunctions";

export const useTaskList = (user) => {
	const [tasks, setTasks] = useState([]);
	const [alertInfo, setAlertInfo] = useState({
		mainTitle: "no message had been put",
		status: true,
	});
	const { alertOpen, closeAlert, openAlert } = useAlert();

	const fetchTasks = async () => {
		const response = await getTasks();
		if (response.status !== 200) {
			throw new Error("Something went wrong with tasks");
		}
		return response.body;
	};

	const { isLoading: tasksAreLoading } = useQuery(
		"tasksForTasklist",
		fetchTasks,
		{
			enabled: !!user,
			onSuccess: (data) => {
				setTasks(data);
			},
			onError: () => console.error("Something went wrong with tasks"),
		},
	);

	const newTask = useCallback(
		(text) => {
			if (text) {
				const task = {
					taskName: text,
					completed: false,
					created: getMomentUTC().format("MMMM Do YYYY, h:mm:ss"),
				};

				addTask(task)
					.then((res) => {
						if (res.status === 200) {
							setTasks((prevTasks) => {
								const newTask = { ...task, _id: res.body };
								return [...prevTasks, newTask];
							});
						}
					})
					.catch((err) => {
						const message = err?.response?.body?.error || "An error occurred";
						setAlertInfo({
							...alertInfo,
							mainTitle: message,
							status: false,
						});
						openAlert();
					});
			} else {
				openAlert();
			}
		},
		[openAlert],
	);

	const deleteTask = useCallback((_id) => {
		removeTask(_id)
			.then((res) => {
				if (res.status === 200) {
					setTasks((prevTasks) => prevTasks.filter((item) => item._id !== _id));
				}
			})
			.catch((err) => {
				const message = err?.response?.body?.error || "An error occurred";
				setAlertInfo({
					...alertInfo,
					mainTitle: message,
					status: false,
				});
				openAlert();
			});
	}, []);

	const toggleTodo = useCallback((task) => {
		changeTodoStatus(task)
			.then((res) => {
				if (res.status === 200) {
					setTasks((prevTasks) =>
						prevTasks.map((item) => (item._id === task._id ? task : item)),
					);
				}
			})
			.catch((err) => {
				const message = err?.response?.body?.error || "An error occurred";
				setAlertInfo({
					...alertInfo,
					mainTitle: message,
					status: false,
				});
				openAlert();
			});
	}, []);

	return {
		tasks,
		deleteTask,
		toggleTodo,
		newTask,
		alertOpen,
		openAlert,
		closeAlert,
		loading: tasksAreLoading,
	};
};
