import React, { useEffect, useState } from 'react'
import api from "../utils/api"
import Loading from './Loading'
const Todos = () => {
    const [todolist, settodolist] = useState([])
    const [filteredTodos, setFilteredTodos] = useState(todolist);
    const [search, setsearch] = useState("")
    const [loading, setloading] = useState(false)
    const [input,setinput] = useState("")
    const [msg, setMsg] = useState("");
    const [updateId, setupdateId] = useState(null)
    useEffect(() => {
      getTodos()
    }, []);
    useEffect(()=>{
      setFilteredTodos(todolist)
    },[todolist])
    useEffect(() => {
      updateId&&setupdateId(null)
      search&&setinput("")
      const delay = setTimeout(() => {
        if (search.trim() !== "") {
          setFilteredTodos(
            todolist.filter((todo) =>
              todo.title.toLowerCase().includes(search.toLowerCase()) // Case-insensitive search
            )
          );
        } else {
          setFilteredTodos(todolist); 
        }
      }, 500); // Debounce time 500ms
  
      return () => clearTimeout(delay); // Cleanup previous timeout
    }, [search, todolist]);
    useEffect(() => {
      if (!msg) return; 
      const timeout = setTimeout(() => {
        setMsg("");
      }, 5000);
      return () => clearTimeout(timeout); 
    }, [msg]); 
    function getTodos (){
      setloading(true)
      api.get('/todos')
          .then((response) => settodolist(response.data.todos))
          .catch((error) => setMsg('Error fetching Todos:', error))
          .finally(()=>setloading(false))
    }
    function editTodo(id){
      setupdateId(id)
      const todonow = todolist.find((item)=>item._id===id)
      setinput(todonow.title)
    }
    function handleEdit(e) {
      e.preventDefault(); // Pass 'e' as an argument to prevent form submission
      setloading(true);
    
      api.patch(`/update-todo/${updateId}`, { title: input })
        .then((res) => {
          setMsg(res.data.message);
          settodolist((items) => items.map((item) =>
            item._id === updateId ? { ...item, title: input } : item
          )); 
          setinput(""); 
        })
        .catch((e) => {
          console.error("Error updating todo:", e);
          setMsg("Failed to update todo.");
        })
        .finally(() =>{ 
          setloading(false);
          setupdateId(null)
        });
    }    
    function deleteTodo(id) {
      setloading(true); 
      api.delete(`/delete-todo/${id}`)
        .then((res) => {
          setMsg(res.data.message);
          settodolist((items) => items.filter((item) => item._id !== id));
        })
        .catch((e) => {
          console.error("Error deleting todo:", e);
          setMsg("Failed to delete todo.");
        })
        .finally(() => setloading(false)); 
    }    
    function deleteAllTodos(){
      api.delete("/delete-todos")
      .then((res)=>{
        setMsg(res.data.message);
        settodolist([])
      })
      .catch((e)=>console.error(e))
    }
    function handleAdd(e){
      e.preventDefault()
      setloading(true)
      api.post("/create-todo",{title:input})
      .then((res)=>{
        setMsg(res.data.message)
      })
      .catch(e=>{
        console.log(e)
      })
      .finally(()=>{
        setloading(false)
        setinput("")
        getTodos()
      })

    }
    function handleChange(id,isCompleted) {
      setMsg('Updating Todo Progress...')
      api.patch(`/update-todo-completion/${id}`,{isCompleted})
      .then((res) => {
        setMsg(res.data.message);
        settodolist((prev) =>
          prev.map((todo) =>
            todo._id === id ? { ...todo, completed: !todo.completed } : todo
          )
        );
      })
      .catch((e) => {
        console.error("Error updating todo Completion:", e);
        setMsg("Failed to update todo Progress.");
      })
      // .finally(() =>{ 
      //   setloading(false);
      // });
      
    }
    

    
  return (
    <div className='todos'>
      <h1>Todolist</h1>
      <form onSubmit={(e)=>{
        if(updateId)
          handleEdit(e)
        else
          handleAdd(e)
      }} >
        <input autoComplete='true' placeholder='Title' type="text" value={input} onChange={e=>setinput(e.target.value)} required/>
        <input type="submit" value={updateId?"Update":"Add"} />
        <button type='button' onClick={()=>{setinput("");setupdateId(null)}}>{updateId?"Cancel":"Clear"}</button>
        <button type='button' onClick={deleteAllTodos}>DeleteAll</button>
      </form>
      <div className="search">
        <h5>Search: </h5>
        <input type="text" placeholder='Find Todo...'
          value={search}
          onChange={e=>setsearch(e.target.value)}
        />
        {search.trim().length>0&&<button className='clearSearch' onClick={()=>setsearch("")} style={{padding:"3px 5px"}}>X</button>}
      </div>
      <div className="message">{msg}</div>
      <div  className="todolist-container">
          {
            loading
          ?<Loading />
          :
        <table  >
          <tbody>
            {filteredTodos?.length
              ?filteredTodos.map((todo,key)=>(
              <tr key={key} className='todo' >
                <td className='relative'>
                <label class="check">
                  <input type="checkbox"
                    checked={todo.completed}
                    onChange={()=>handleChange(todo._id,todo.completed)}
                  />
                  <div class="box"></div>
                </label>
                 
                </td>
                <td  >{todo.title}</td>
                <td >
                  <span>
                    {new Date(todo.time).toLocaleString()}
                  </span>
                  <p className='todo-options'>
                    <button onClick={()=>{editTodo(todo._id)}}>Edit</button>
                    <button onClick={()=>{deleteTodo(todo._id)}} >Delete</button>
                  </p>
                </td>
              </tr>
              ))
              :<tr><td style={{textAlign:'center'}}>{"No Todo Added..."}</td></tr> 
            }
          </tbody>
          
        </table>
          }
      </div>
      
    </div>
  )
}

export default Todos