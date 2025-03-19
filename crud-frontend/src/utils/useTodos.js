import { useEffect, useState } from "react";
import api from "./api";

const isUserLoggedIn = () => localStorage.getItem("token") !== null;

const useTodos = () => {
  const [todolist, settodolist] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [deadlineToggle, setdeadlineToggle] = useState(false)
  const [deadline, setdeadline] = useState(null)
  const [msg, setMsg] = useState("");
  const [updateId, setUpdateId] = useState(null);

  const resetForm =()=>{
    setInput("");
    setdeadline(null)
    setdeadlineToggle(false)
    setUpdateId(null)
  }
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
        .catch((error) => {
          console.error("Error fetching Todos:", error);
          setMsg("Error fetching Todos");
        })
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
      const newTodo = {
        title:input,
        deadline
      }
      api
        .post("/create-todo", newTodo)
        .then((res) => {
          setMsg(res.data.message);
          getTodos();
        })
        .catch(() => setMsg("Failed to add todo"))
        .finally(() => {
          setLoading(false);
          resetForm()
        });
    } else {
      const newTodo = {
        _id: Date.now().toString(),
        title: input,
        completed: false,
        time: new Date(),
        deadline
      };
      const updatedTodos = [...todolist, newTodo];
      saveLocalTodos(updatedTodos);
      setMsg("Todo added locally");
      setLoading(false);
      resetForm()
    }
  };
  const formatDateTimeLocal = (isoString) => {
    if (!isoString) return "";
  
    const date = new Date(isoString); // Convert ISO string to Date object
    const localISOString = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16); // Format correctly for <input type="datetime-local">
  
    return localISOString;
  };
  
  // When setting the state initially
  // Set todo for editing
  const editTodo = (id) => {
    setUpdateId(id);
    const todoNow = todolist.find((item) => item._id === id);
    if (todoNow){
      setInput(todoNow.title);
      if(todoNow.deadline){
        setdeadlineToggle(true)
        setdeadline(formatDateTimeLocal(todoNow.deadline));
        }else{
          setdeadline(null)
          setdeadlineToggle(false)
        }
      }
  };

  // Handle update (edit) submission
  const handleEdit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (isUserLoggedIn()) {
      const newTodo = {
        title:input,
        deadline
      }
      api
        .patch(`/update-todo/${updateId}`,newTodo)
        .then((res) => {
          setMsg(res.data.message);
          settodolist((items) =>
            items.map((item) =>
              item._id === updateId ? { ...item, title: input, deadline } : item
            )
          );
        })
        .catch(() => setMsg("Failed to update todo"))
        .finally(() => {
          setLoading(false);
          setUpdateId(null);
          resetForm()
        });
    } else {
      const updatedTodos = todolist.map((todo) =>
        todo._id === updateId ? { ...todo, title: input, deadline } : todo
      );
      saveLocalTodos(updatedTodos);
      setMsg("Todo updated locally");
      setLoading(false);
      setUpdateId(null);
      resetForm()
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
  // const copyAllTodos = () => {
  //   const toCopy = filteredTodos.map((todo, index) => 
  //     `${index + 1}). ${todo.completed ? '(done)   ' : '(pending)'} ${todo.title}`
  //   ).join("\n"); // Join array elements into a string with new lines
  
  //   alert(toCopy);
  // };
  // optimized
  const copyAllTodos = () => {
    if (!filteredTodos.length) {
      alert("No todos to copy!");
      return;
    }
  
    // Define column widths
    const indexWidth = 5; // Space for index numbers
    const statusWidth = 10; // Space for status (done/pending)
    const titleWidth = 30; // Space for title (adjust as needed)
  
    // Header row (optional)
    const header = "No.  | Status     | Title\n" + "-".repeat(indexWidth + statusWidth + titleWidth);
  
    // Format each todo into aligned columns
    const toCopy = filteredTodos
      .map((todo, index) =>
        `${(index + 1).toString().padEnd(indexWidth)}| ` +
        `${(todo.completed ? "✅ Done" : "⏳ Pending").padEnd(statusWidth)}| ` +
        `${todo.title.padEnd(titleWidth)}`
      )
      .join("\n");
  
    // Copy to clipboard
    const formattedText = `${header}\n${toCopy}`;
    navigator.clipboard.writeText(formattedText)
      .then(() => setMsg("Todos copied to clipboard!"))
      .catch((err) => alert("Failed to copy: " + err));
  };
  
  

  return {
    isUserLoggedIn,
    todolist,
    filteredTodos,
    search,
    setSearch,
    loading,
    input,
    setInput,
    deadlineToggle,
    setdeadlineToggle,
    deadline,
    setdeadline,
    msg,
    updateId,
    setUpdateId,
    addTodo,
    handleEdit,
    editTodo,
    deleteTodo,
    deleteAllTodos,
    toggleCompletion,
    copyAllTodos,
    resetForm
  };
};

export default useTodos;
