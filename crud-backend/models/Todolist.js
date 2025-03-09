const mongoose = require("mongoose");

const TodoListSchema = new mongoose.Schema({
    title: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const TodoList = mongoose.model("TodoList", TodoListSchema);
module.exports = TodoList;
