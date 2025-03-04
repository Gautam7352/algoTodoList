import React from "react";
import useTodos from "../utils/useTodos";
import Loading from "./Loading";
import { SquarePen,Trash2,X } from 'lucide-react';
const Todos = () => {
  const {
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
  } = useTodos();

  return (
    <div className="todos">
      {msg&&<div className="message">{msg}</div>}
      {loading&&<div className="progressBar"></div>}
      <h1>Todolist</h1>
      <form
        onSubmit={(e) => {
          if (updateId) handleEdit(e);
          else addTodo(e);
        }}
      >
        <input
          autoComplete="true"
          placeholder="Title"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          required
        />
        <input type="submit" value={updateId ? "Update" : "Add"} />
        <button type="button" onClick={() => {setInput("");setUpdateId(null)}}>
          {updateId ? "Cancel" : "Clear"}
        </button>
        <button type="button" onClick={deleteAllTodos}>
          Delete All
        </button>
      </form>

      <div className="search">
        <h5>Search: </h5>
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


      <div className="todolist-container">
        {loading ? (
          <Loading />
        ) : (
          <table>
            <tbody>
              {filteredTodos?.length ? (
                filteredTodos.map((todo) => (
                  <tr key={todo._id} className="todo">
                    <td>
                      <label className="check">
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() =>
                            toggleCompletion(todo._id, todo.completed)
                          }
                        />
                        <div className="box"></div>
                      </label>
                    </td>
                    <td>{todo.title}</td>
                    <td>
                      <span>{new Date(todo.time).toLocaleString()}</span>
                      <p className="todo-options">
                        <button onClick={() => editTodo(todo._id)}><SquarePen color="black" /></button>
                        <button onClick={() => deleteTodo(todo._id)}><Trash2 color="red" /></button>
                      </p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td style={{ textAlign: "center" }}>
                    {"No Todo Added..."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Todos;
