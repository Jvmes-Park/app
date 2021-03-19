const express = require('express');
const app = express();
const pool = require('./db')
app.use(express.json())
const cors = require('cors')
app.use(cors())

app.post('/todos', async (req, res) => {
    try {
        const { description } = req.body;
        const newToDo = await pool.query(
            "INSERT INTO todo (description) VALUES ($1) RETURNING *", [description]
        );
        res.json(newToDo.rows[0]);
    } catch (err) {
        console.error(err.message)
    }
});

app.get('/todos', async (req, res) => {
    try {
        const allToDos = await pool.query(
            "SELECT * FROM todo ORDER BY todo_id ASC"
        );
        res.json(allToDos.rows);
    } catch (err) {
        console.error(err.message)
    }
});

app.get('/todos/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const todo = await pool.query(
            "SELECT * FROM todo WHERE todo_id = $1", [id]
        )
        res.json(todo.rows[0])
    } catch (err) {
        console.error(err.message);
    }
})

app.put('/todos/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const {description} = req.body;
        const updateToDo = await pool.query(
            "UPDATE todo SET description = $1 WHERE todo_id = $2", [description, id]
        )
        res.json("Todo was updated");
    } catch (err) {
        console.error(err.message)
    }
})

app.delete('/todos/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const deleteToDo = await pool.query(
            "DELETE FROM todo WHERE todo_id = $1", [id]
        )
        res.json(`Deleted todo number: ${id}`)
    } catch (err) {
        console.error(err.message)
    }
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})