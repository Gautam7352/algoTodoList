import { useEffect, useState } from "react";
import api from "./api";

const isUserLoggedIn = () => localStorage.getItem("token") !== null;

const useTodos = () => {
  const [todolist, settodolist] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [msg, setMsg] = useState("");
  const [updateId, setUpdateId] = useState(null);

  // Fetch todos when component mounts
  useEffect(() => {
    getTodos();
  }, []);

  useEffect(() => {
    setFilteredTodos(todolist);
  }, [todolist]);

  // Debounce search filtering
  useEffect(() => {
    if (updateId) setUpdateId(null);
    if (search) setInput("");
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
    }, 500);
    return () => clearTimeout(delay);
  }, [search, todolist]);

  // Clear message after 5 seconds
  useEffect(() => {
    if (!msg) return;
    const timeout = setTimeout(() => setMsg(""), 5000);
    return () => clearTimeout(timeout);
  }, [msg]);

  // Get todos either from API (if logged in) or from localStorage (if guest)
  const getTodos = () => {
    setLoading(true);
    if (isUserLoggedIn()) {
      api
        .get("/todos")
        .then((res) => settodolist(res.data.todos))
        .catch(() => setMsg("Error fetching Todos"))
        .finally(() => setLoading(false));
    } else {
      const localTodos = JSON.parse(localStorage.getItem("todos")) || [];
      settodolist(localTodos);
      setLoading(false);
    }
  };

  // Helper to save todos to localStorage for guest users
  const saveLocalTodos = (todos) => {
    localStorage.setItem("todos", JSON.stringify(todos));
    settodolist(todos);
  };

  // Add a new todo
  const addTodo = (e) => {
    e.preventDefault();
    setLoading(true);
    if (isUserLoggedIn()) {
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
    } else {
      const newTodo = {
        _id: Date.now().toString(),
        title: input,
        completed: false,
        time: new Date(),
      };
      const updatedTodos = [...todolist, newTodo];
      saveLocalTodos(updatedTodos);
      setMsg("Todo added locally");
      setLoading(false);
      setInput("");
    }
  };

  // Set todo for editing
  const editTodo = (id) => {
    setUpdateId(id);
    const todoNow = todolist.find((item) => item._id === id);
    if (todoNow) setInput(todoNow.title);
  };

  // Handle update (edit) submission
  const handleEdit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (isUserLoggedIn()) {
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
    } else {
      const updatedTodos = todolist.map((todo) =>
        todo._id === updateId ? { ...todo, title: input } : todo
      );
      saveLocalTodos(updatedTodos);
      setMsg("Todo updated locally");
      setLoading(false);
      setUpdateId(null);
      setInput("");
    }
  };

  // Delete a specific todo
  const deleteTodo = (id) => {
    setLoading(true);
    if (isUserLoggedIn()) {
      api
        .delete(`/delete-todo/${id}`)
        .then((res) => {
          setMsg(res.data.message);
          settodolist((items) => items.filter((item) => item._id !== id));
        })
        .catch(() => setMsg("Failed to delete todo"))
        .finally(() => setLoading(false));
    } else {
      const updatedTodos = todolist.filter((todo) => todo._id !== id);
      saveLocalTodos(updatedTodos);
      setMsg("Todo deleted locally");
      setLoading(false);
    }
  };

  // Delete all todos
  const deleteAllTodos = () => {
    if (isUserLoggedIn()) {
      api
        .delete("/delete-todos")
        .then((res) => {
          setMsg(res.data.message);
          settodolist([]);
        })
        .catch(() => setMsg("Failed to delete all todos"));
    } else {
      saveLocalTodos([]);
      setMsg("All todos deleted locally");
    }
  };

  // Toggle completion of a todo
  const toggleCompletion = (id, isCompleted) => {
    setMsg("Updating Todo Progress...");
    if (isUserLoggedIn()) {
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
    } else {
      const updatedTodos = todolist.map((todo) =>
        todo._id === id ? { ...todo, completed: !todo.completed } : todo
      );
      saveLocalTodos(updatedTodos);
      setMsg("Todo completion updated locally");
    }
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
    setUpdateId,
    addTodo,
    handleEdit,
    editTodo,
    deleteTodo,
    deleteAllTodos,
    toggleCompletion,
  };
};

export default useTodos;
