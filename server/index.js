// Backend code (Node.js / Express)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TodoModel = require('./model'); // Import the Todo model

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/todos');

app.post('/add', (req, res) => {
    const { task } = req.body;
    TodoModel.create({
        task: task,
    }).then(result => res.json(result))
      .catch(err => res.json(err));
});

app.get('/get', (req, res) => {
    TodoModel.find()
        .then(result => res.json(result))
        .catch(err => res.json(err));
});

// Update the task's completion status
app.put('/update/:id', (req, res) => {
    const { id } = req.params;
    
    // Find the task by ID and toggle the 'done' field
    TodoModel.findById(id)
        .then(todo => {
            if (todo) {
                todo.done = !todo.done; // Toggle the completion status
                todo.save()
                    .then(updatedTodo => res.json(updatedTodo)) // Return the updated task
                    .catch(err => res.status(500).json({ message: 'Error updating task' }));
            } else {
                res.status(404).json({ message: 'Todo not found' });
            }
        })
        .catch(err => res.status(500).json(err));
});

app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    TodoModel.findByIdAndDelete(id)
        .then(() => res.status(200).send('Task deleted'))
        .catch(err => res.status(500).json(err));
});

app.listen(3001, () => {
    console.log("Server is running on http://localhost:3001/");
});
