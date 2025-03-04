require('dotenv').config();
const express = require("express")
const cors = require("cors")
const connectDB = require('./utils/db');
connectDB()
const passport = require("passport");
const session = require("express-session");
require("./utils/passportConfig");
const Todo = require("./models/todo")
const app = express()

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.locals.user = req.user; // Make user available in templates
  next();
});

//auth
// Google Auth Routes
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account" })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: process.env.FRONTEND_URL,
  })
);

// Logout Route
app.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.session.destroy(() => {
      res.json({ message: "Logged out successfully" });
    });
  });
});


// Protected Route Example
app.get("/profile", (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });
  res.json({ user: req.user });
});

// get todos
app.get("/todos", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
        const todos = (await Todo.find({ userId: req.user._id })).reverse(); // Await the database query
        
        if (todos.length > 0) {
            res.json({ todos });
        } else {
            res.json({ message: "No Todos Added" });
        }
    } catch (error) {
        console.error("Error fetching todos:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// create todo
app.post("/create-todo", async (req,res)=>{
    try{
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
        const {title} = req.body
        const newTodo = new Todo({
          title,
          userId: req.user._id,
        })
        await newTodo.save()
        res.json({ message: "Todo added", todo: newTodo });
    }
    catch(e){
        console.error("Error creating todos:", error);
        res.status(500).json({ error: "Error adding todo" });
    }
})

// update todo
app.patch("/update-todo/:id", async (req, res) => {
    try {
      const { title } = req.body;
      
      const updatedTodo = await Todo.findByIdAndUpdate(
        req.params.id, 
        { title },  
        { new: true } 
      );
  
      if (!updatedTodo) {
        return res.status(404).json({ message: "Todo not found" });
      }
  
      res.json({ message: "Todo updated successfully!", updatedTodo });
    } catch (error) {
      console.error("Error updating todo:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });  
  
  // update todo Progress
app.patch("/update-todo-completion/:id", async (req, res) => {
      try {
        const { isCompleted } = req.body;
        const updatedTodo = await Todo.findByIdAndUpdate(
          req.params.id, 
          { completed:!isCompleted },  
          { new: true } 
        );
    
        if (!updatedTodo) {
          return res.status(404).json({ message: "Todo not found" });
        }
    
        res.json({ message: "Todo Progress updated successfully!", updatedTodo });
      } catch (error) {
        console.error("Error updating todo Progress:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }); 

//delete todo
app.delete("/delete-todo/:id", async (req, res) => {
    try {
      const result = await Todo.findByIdAndDelete(req.params.id);
      if (result) {
        res.json({ message: "Todo deleted successfully!" });
      } else {
        res.status(404).json({ message: "Todo not found" });
      }
    } catch (e) {
      console.error("Error deleting todo:", e);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });  

//delete all todos
app.delete("/delete-todos", async (req, res) => {
    try {
        const result = await Todo.deleteMany({}); 
        if (result.deletedCount > 0) {
            res.json({ message: "All todos deleted successfully!" });
        } else {
            res.json({ message: "No todos to delete." });
        }
    } catch (e) {
        console.error("Error deleting todos:", e);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/",(req,res)=>{
    console.log("get request" + req.body)
    res.json({message:"get request"})
})

const PORT = process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log("server running on http://localhost:"+PORT)
})