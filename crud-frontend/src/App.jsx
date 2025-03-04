import React from 'react'
import Todos from './components/Todos'
import "./App.css"
import Auth from './components/Auth'
const App = () => {
  return (
    <div className='app'>
      <Auth  />
      <Todos />
    </div>
  )
}

export default App