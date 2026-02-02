import React, { useEffect, useState } from "react";
import { z, ZodError } from "zod";
import { getZodError } from "../helper/getzodError";
import { showToast } from "../helper/showToast";
import { useParams } from "react-router-dom";

const ShowTask = () => {
  const { taskid } = useParams();

  const [loading, setLoading] = useState(true);
  const [apiData, setApiData] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Pending",
  });
  const [err, setError] = useState({});

  const taskSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long."),
    description: z
      .string()
      .min(3, "Description must be at least 3 characters long.")
      .max(500, "Length exceeded."),
    status: z.enum(["Pending", "Running", "Completed", "Failed"]),
  });

  const handleInput = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    const getTask = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/task/show-task/${taskid}`
        );

        if (!response.ok) {
          throw new Error("Task not found");
        }

        const data = await response.json();

        setApiData(data);
        setFormData(data.taskData);
      } catch (error) {
        showToast("error", error.message);
      } finally {
        setLoading(false);
      }
    };

    getTask();
  }, [taskid]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({});

    try {
      const validatedData = taskSchema.parse(formData);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/task/update-task/${taskid}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(validatedData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      showToast("success", data.message);
    } catch (error) {
      if (error instanceof ZodError) {
        setError(getZodError(error.errors));
        return;
      }
      showToast("error", error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!apiData?.status) return <p>Data not found</p>;

  return (
    <div className="pt-5">
      <h1 className="text-2xl font-bold mb-5">Task Details</h1>

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Title
          </label>
          <input
            value={formData.title}
            onChange={handleInput}
            name="title"
            type="text"
            className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
          />
          {err.title && <span className="text-red-500 text-sm">{err.title}</span>}
        </div>

        {/* Description */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={handleInput}
            name="description"
            rows="4"
            className="block p-2.5 w-full text-sm bg-gray-50 rounded-lg border"
          />
          {err.description && (
            <span className="text-red-500 text-sm">{err.description}</span>
          )}
        </div>

        {/* Status */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInput}
            className="block p-2.5 w-full text-sm bg-gray-50 rounded-lg border"
          >
            <option value="Pending">Pending</option>
            <option value="Running">Running</option>
            <option value="Completed">Completed</option>
            <option value="Failed">Failed</option>
          </select>
          {err.status && (
            <span className="text-red-500 text-sm">{err.status}</span>
          )}
        </div>

        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 rounded-lg text-sm px-5 py-2.5"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ShowTask;

