// import React, { useState } from "react";
// import { z, ZodError } from 'zod'
// import { getZodError } from "../helper/getzodError";
// import { showToast } from "../helper/showToast";
// const HomePage = () => {

//     const [formData, setFormData] = useState()
//     const [err, setError] = useState()

//     const taskSchema = z.object({
//         title: z.string().min(3, { message: "Title must be at least 3 character long." }),
//         description: z.string().min(3, { message: "Description must be at least 3 character long." }).max(500, { message: 'Lenght acceeded.' })
//     })

//     const handleInput = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value })
//     }

//     const handleSubmit = async (e) => {
//         e.preventDefault()
//         try {
//             const validatedData = taskSchema.parse(formData)
//             const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/task/create-task`,
//                 {
//                     method: "POST",
//                     headers: { 'Content-type': 'application/json' },
//                     body: JSON.stringify(validatedData)
//                 })

//             const responseData = await response.json()
//             if (!response.ok) {
//                 throw new Error(responseData.message)
//             }
//             setFormData({})
//             showToast('success', responseData.message)
//         } catch (error) {
//             if (error instanceof ZodError) {
//                 const getError = getZodError(error.errors)
//                 setError(getError)
//             }
//             showToast('error', error.message)
//         }
//     }

//     return (
//         <div className="pt-5">
//             <h1 className="text-2xl font-bold mb-5">Add Task</h1>
//             <form onSubmit={handleSubmit}>
//                 <div className="mb-5">
//                     <label className="block mb-2 text-sm font-medium text-gray-900 ">
//                         Title
//                     </label>
//                     <input value={formData?.title || ''} onChange={handleInput} name="title"
//                         type="text"
//                         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//                         placeholder="Task title"
//                         required
//                     />
//                     {err && err.title && <span className="text-red-500 text-sm">{err.title}</span>}
//                 </div>
//                 <div className="mb-5">
//                     <label className="block mb-2 text-sm font-medium text-gray-900 ">
//                         Description
//                     </label>
//                     <textarea value={formData?.description || ''} onChange={handleInput} name="description"
//                         rows="4"
//                         className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
//                         placeholder="Task description..."
//                     ></textarea>
//                     {err && err.description && <span className="text-red-500 text-sm">{err.description}</span>}
//                 </div>

//                 <button
//                     type="submit"
//                     className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
//                 >
//                     Submit
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default HomePage;

import React, { useState } from "react";
import { z, ZodError } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { getZodError } from "../helper/getzodError";
import { showToast } from "../helper/showToast";

const HomePage = () => {
  const [dark, setDark] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [err, setError] = useState({});

  const taskSchema = z.object({
    title: z.string().min(3, {
      message: "Title must be at least 3 characters long.",
    }),
    description: z
      .string()
      .min(3, {
        message: "Description must be at least 3 characters long.",
      })
      .max(500, { message: "Length exceeded." }),
  });

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const validatedData = taskSchema.parse(formData);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/task/create-task`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(validatedData),
        }
      );

      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.message);

      setFormData({ title: "", description: "" });
      setError({});
      showToast("success", responseData.message);
    } catch (error) {
      if (error instanceof ZodError) {
        setError(getZodError(error.errors));
      } else {
        showToast("error", error.message);
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={dark ? "dark" : "light"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className={`min-h-screen flex items-center justify-center px-4
          ${
            dark
              ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black"
              : "bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100"
          }`}
      >
        {/* Dark mode toggle */}
        <motion.button
          onClick={() => setDark(!dark)}
          whileTap={{ scale: 0.9, rotate: 180 }}
          className="absolute top-6 right-6 text-2xl"
        >
          {dark ? "🌙" : "☀️"}
        </motion.button>

        {/* Card */}
        <motion.div
          initial={{ y: 40, scale: 0.95 }}
          animate={{ y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className={`w-full max-w-lg rounded-2xl shadow-2xl p-8 backdrop-blur-xl
            ${
              dark
                ? "bg-white/10 text-white"
                : "bg-white/80 text-gray-800"
            }`}
        >
          <h1 className="text-3xl font-bold text-center mb-6">
            ✨ Create New Task
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <motion.div
              animate={err.title ? { x: [-6, 6, -6, 6, 0] } : {}}
            >
              <label className="block mb-2 font-medium">Title</label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInput}
                placeholder="Task title"
                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2
                  ${
                    dark
                      ? "bg-gray-800 border-gray-700 focus:ring-indigo-400"
                      : "bg-white border-gray-300 focus:ring-blue-400"
                  }`}
              />
              {err.title && (
                <p className="text-red-400 text-sm mt-1">{err.title}</p>
              )}
            </motion.div>

            {/* Description */}
            <motion.div
              animate={err.description ? { x: [-6, 6, -6, 6, 0] } : {}}
            >
              <label className="block mb-2 font-medium">Description</label>
              <motion.textarea
                whileFocus={{ scale: 1.02 }}
                rows="4"
                name="description"
                value={formData.description}
                onChange={handleInput}
                placeholder="Task description..."
                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2
                  ${
                    dark
                      ? "bg-gray-800 border-gray-700 focus:ring-indigo-400"
                      : "bg-white border-gray-300 focus:ring-blue-400"
                  }`}
              />
              {err.description && (
                <p className="text-red-400 text-sm mt-1">
                  {err.description}
                </p>
              )}
            </motion.div>

            {/* Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full py-3 rounded-xl font-semibold text-white
                bg-gradient-to-r from-indigo-600 to-purple-600
                hover:from-indigo-700 hover:to-purple-700 shadow-lg"
            >
              🚀 Create Task
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default HomePage;
