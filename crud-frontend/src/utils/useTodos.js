import { useEffect, useState } from "react";
import api from "../utils/api";

const useTodos = () => {
  const [todolist, settodolist] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [msg, setMsg] = useState("");
  const [updateId, setUpdateId] = useState(null);

  useEffect(() => {
    getTodos();
  }, []);

  useEffect(() => {
    setFilteredTodos(todolist);
  }, [todolist]);

  useEffect(() => {
    updateId && setUpdateId(null);
    search && setInput("");

    const delay = setTimeout(() => {
      if (search.trim() !== "") {
        setFilteredTodos(
          todolist.filter((todo) =>
            todo.title.toLowerCase().includes(search.toLowerCase())
          )
        );
      } else {
        setFilteredTodos(todolist);
      }
    }, 500); // Debounce search

    return () => clearTimeout(delay);
  }, [search, todolist]);

  useEffect(() => {
    if (!msg) return;
    const timeout = setTimeout(() => setMsg(""), 5000);
    return () => clearTimeout(timeout);
  }, [msg]);

  const getTodos = () => {
    setLoading(true);
    api
      .get("/todos")
      .then((res) => settodolist(res.data.todos))
      .catch(() => setMsg("Error fetching Todos"))
      .finally(() => setLoading(false));
  };

  const addTodo = (e) => {
    e.preventDefault();
    setLoading(true);
    api
      .post("/create-todo", { title: input })
      .then((res) => {
        setMsg(res.data.message);
        getTodos();
      })
      .catch(() => setMsg("Failed to add todo"))
      .finally(() => {
        setLoading(false);
        setInput("");
      });
  };

  const editTodo = (id) => {
    setUpdateId(id);
    const todoNow = todolist.find((item) => item._id === id);
    setInput(todoNow.title);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    setLoading(true);
    api
      .patch(`/update-todo/${updateId}`, { title: input })
      .then((res) => {
        setMsg(res.data.message);
        settodolist((items) =>
          items.map((item) =>
            item._id === updateId ? { ...item, title: input } : item
          )
        );
      })
      .catch(() => setMsg("Failed to update todo"))
      .finally(() => {
        setLoading(false);
        setUpdateId(null);
        setInput("");
      });
  };

  const deleteTodo = (id) => {
    setLoading(true);
    api
      .delete(`/delete-todo/${id}`)
      .then((res) => {
        setMsg(res.data.message);
        settodolist((items) => items.filter((item) => item._id !== id));
      })
      .catch(() => setMsg("Failed to delete todo"))
      .finally(() => setLoading(false));
  };

  const deleteAllTodos = () => {
    api
      .delete("/delete-todos")
      .then((res) => {
        setMsg(res.data.message);
        settodolist([]);
      })
      .catch(() => setMsg("Failed to delete all todos"));
  };

  const toggleCompletion = (id, isCompleted) => {
    setMsg("Updating Todo Progress...");
    api
      .patch(`/update-todo-completion/${id}`, { isCompleted })
      .then((res) => {
        setMsg(res.data.message);
        settodolist((prev) =>
          prev.map((todo) =>
            todo._id === id ? { ...todo, completed: !todo.completed } : todo
          )
        );
      })
      .catch(() => setMsg("Failed to update todo Progress."));
  };

  return {
    todolist,
    filteredTodos,
    search,
    setSearch,
    loading,
    input,
    setInput,
    msg,
    updateId,
    addTodo,
    handleEdit,
    editTodo,
    deleteTodo,
    deleteAllTodos,
    toggleCompletion,
  };
};

export default useTodos;
