import React from "react";
import useTodos from "../utils/useTodos";
import Loading from "./Loading";
import { SquarePen, Trash2, X } from "lucide-react";

const Todos = () => {
  const {
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

  return (
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
                  {todo.deadline&&
                    <div className="todoDeadline">
                      Deadline: {new Date(todo.deadline).toLocaleString()}
                    </div>
                  }
                  <span className="todoDate">
                    Created: {new Date(todo.time).toLocaleString()}
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
  );
};

export default Todos;
