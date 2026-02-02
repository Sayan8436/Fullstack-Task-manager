import React, { useEffect, useState } from "react";
import Task from "../components/Task";
import { showToast } from "../helper/showToast";

const TaskListPage = () => {
  const [refresh, setRefresh] = useState(false);
  const [tasks, setTasks] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getTask = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/task/get-all-task`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const data = await response.json();

        // ✅ safely set tasks
        setTasks(data?.taskData || []);
      } catch (error) {
        showToast("error", error.message);
        setTasks([]);
      } finally {
        setLoading(false);
        setRefresh(false);
      }
    };

    getTask();
  }, [refresh]);

  const deleteTask = async (taskid) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/task/delete-task/${taskid}`,
        { method: "DELETE" }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      showToast("success", data.message);
      setRefresh(true);
    } catch (error) {
      showToast("error", error.message);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="pt-5">
      <h1 className="text-2xl font-bold mb-5">My Tasks</h1>

      {tasks.length > 0 ? (
        tasks.map((task) => (
          <Task key={task._id} props={task} onDelete={deleteTask} />
        ))
      ) : (
        <p>No tasks found.</p>
      )}
    </div>
  );
};

export default TaskListPage;
