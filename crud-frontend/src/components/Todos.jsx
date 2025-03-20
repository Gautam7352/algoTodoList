import React, { useEffect, useState } from "react";
import useTodos from "../utils/useTodos";
import Loading from "./Loading";
import { SquarePen, Trash2, X, ArrowRightFromLine, TextCursor, Trash, CirclePlus } from "lucide-react";
import { formatDistanceToNow } from 'date-fns'
import '../navbar.css';

const Todos = () => {
  const {
    isUserLoggedIn,
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
  } = useTodos();

  const [toggleMenu, settoggleMenu] = useState(true);
  const [todolists, settodolists] = useState(() => {
    const savedTodolists = localStorage.getItem("todolists");
    return savedTodolists ? JSON.parse(savedTodolists) : [];
  });

  useEffect(() => {
    settoggleTodolistRename(todolists.map(() => false));
    localStorage.setItem("todolists", JSON.stringify(todolists));
    console.log(todolists);
  }, [todolists]);

  useEffect(() => {
    const savedTodolists = localStorage.getItem("todolists");
    if (savedTodolists) {
      settodolists(JSON.parse(savedTodolists));
    }
  }, []);

  const [toggleCreateNewTodolist, settoggleCreateNewTodolist] = useState(true);
  const [toggleTodolistRename, settoggleTodolistRename] = useState(todolists.map(() => false));
  const [todolistTitle, settodolistTitle] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])
  
  const renameTodolist = (e, id) => {
    e.preventDefault();
    settodolists(prev => prev.map(todolist => id === todolist._id ? { ...todolist, title: todolistTitle } : todolist));
    settoggleTodolistRename(prev => prev.map((t, index) => todolists[index]._id === id ? false : t));
    settodolistTitle("");
  };

  const deleteTodolist = (id) => {
    settodolists(prev => prev.filter(item => item._id !== id));
  };

  const createTodolist = (e) => {
    e.preventDefault();
    if (isUserLoggedIn) {
      const newTodolist = {
        _id: todolists.length + 1,
        title: todolistTitle
      };
      settodolists(prev => [...prev, newTodolist]);
      settodolistTitle("");
      settoggleCreateNewTodolist(false);
    } else {
      alert("not logged in");
    }
  };

  //calculate remaining time
  const getTimeRemaining = (deadline) => {
    const timeLeft = deadline - currentTime.getTime()
    if (timeLeft <= 0) return 'Time is up!'
    return formatDistanceToNow(deadline, { addSuffix: true })
  }

  return (
    <>
      <div className={`navMenu ${toggleMenu ? 'navMenuToggleBtnOn' : 'navMenuToggleBtnOff'}`}>
        <div className="navMenuToggleBtn" onClick={() => settoggleMenu(prev => !prev)}>
          <ArrowRightFromLine size={30} className={`${toggleMenu && "rotate-180"}`} />
        </div>
        <div className="theading">
          <h1>Todolists</h1>
          {!toggleCreateNewTodolist && <button className="addTodolistBtn" onClick={() => settoggleCreateNewTodolist(true)}><CirclePlus /></button>}
        </div>
        {toggleCreateNewTodolist &&
          <form onSubmit={createTodolist}>
            <input required type="text"
              value={todolistTitle}
              onChange={(e) => settodolistTitle(e.target.value)}
              className="todolistTitleInput"
              name="todolistTitleInput" />
            <X onClick={() => settoggleCreateNewTodolist(false)} />
          </form>
        }
        <div className="todolists">
          {todolists?.map((item) => (
            <div className="todolist-item" key={item._id}>
              {toggleTodolistRename[todolists.indexOf(item)]
                ? (<form onSubmit={e => renameTodolist(e, item._id)}>
                  <input required type="text"
                    value={todolistTitle}
                    onChange={(e) => settodolistTitle(e.target.value)}
                    className="todolistTitleInput"
                    name="todolistTitleInput" />
                  <X onClick={() => settoggleTodolistRename(prev => prev.map(() => false))} />
                </form>)
                : (<>
                  <h2>{item.title}</h2>
                  <div className="todolistOptions">
                    <p>:</p>
                    <div className="todolistOptionBtns">
                      <button title="Rename" onClick={() => { settoggleTodolistRename(prev => prev.map((t, tkey) => item._id === todolists[tkey]._id ? true : false)); settodolistTitle(item.title); settoggleCreateNewTodolist(false) }}><TextCursor size={15} /></button>
                      <button title="Delete" onClick={() => deleteTodolist(item._id)}><Trash size={15} /></button>
                    </div>
                  </div>
                </>)}
            </div>
          ))}
        </div>
      </div>
      <div className="todos">
        {msg && <div className="message">{msg}</div>}
        {loading && <div className="progressBar"></div>}
        <h1>Todolist</h1>
        <form
          onSubmit={(e) => {
            if (updateId) handleEdit(e);
            else addTodo(e);
          }}
        >
          <div className="todoinput">
            <input
              id="todoInput"
              autoComplete="true"
              placeholder="Title"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              required
            />
            <input
              id="addBtn"
              type="submit" value={updateId ? "Update" : "Add"} />
          </div>
          <div className="moreOptions">
            <div className="deadline">
              <label id="deadlineLabel" htmlFor="deadlineToggle">
                DeadLine?
                <input type="checkbox" checked={deadlineToggle}
                  onChange={() => setdeadlineToggle(prev => !prev)}
                  name="deadline" id="deadlineToggle" />
              </label>
              {deadlineToggle && (
                <input type="datetime-local" value={deadline}
                  onChange={e => setdeadline(e.target.value)}
                  name="deadline" id="deadline" />
              )}
            </div>
            <div className="otherOptions">
              <button id="copyAll" type="button" onClick={copyAllTodos} title="Copy whole todolist with formatting.">Copy All</button>
              <button id="deleteAll" type="button" onClick={deleteAllTodos}>
                Delete All
              </button>
              <button id="clearBtn" type="button" onClick={() => resetForm()}>
                {updateId ? "Cancel" : "Clear"}
              </button>
            </div>
          </div>
        </form>
        <div className="search-container">
          <div className="search">
            <h5>Search:</h5>
            <input
              type="text"
              placeholder="Find Todo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search.trim().length > 0 && (
              <button className="clearSearch" onClick={() => setSearch("")}>
                <X color="black" size={20} />
              </button>
            )}
          </div>
          <div className="todoCount">Showing {filteredTodos.length} Todos</div>
        </div>
        <div className="todolist-container">
          {loading ? (
            <Loading />
          ) : filteredTodos?.length ? (
            filteredTodos.map((todo) => (
              <div key={todo._id} className="todo-item">
                <div className="todo-header">
                  <label className="check">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleCompletion(todo._id, todo.completed)}
                    />
                    <div className="box"></div>
                  </label>
                  <div className="todo-title">{todo.title}</div>
                </div>
                <div className="todo-footer">
                  <div className="todoDates">
                    {todo.deadline &&
                      <div className="todoDeadline">
                        Deadline: {new Date(todo.deadline).toLocaleString()}
                      </div>
                    }
                    <span className="deadline-text">
                    {getTimeRemaining(todo.deadline)}
                  </span>
                  </div>
                  <div className="todo-options">
                    <button onClick={() => editTodo(todo._id)}>
                      <SquarePen color="black" />
                    </button>
                    <button onClick={() => deleteTodo(todo._id)}>
                      <Trash2 color="red" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-todos">No Todo Added...</div>
          )}
        </div>
      </div>
    </>
  );
};

export default Todos;