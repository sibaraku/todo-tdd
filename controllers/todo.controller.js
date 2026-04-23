const TodoModel = require('../models/todo.model');

const createTodo = async (req, res, next) => {
    try {
        const createModel = await TodoModel.create(req.body);
        res.status(201).json(createModel);
    } catch (error) {
        next(error);
    }
};

const getTodos = async (req, res, next) => {
    try {
        const allTodos = await TodoModel.find({});
        res.status(200).json(allTodos);
    } catch (error) {
        next(error);
    }
};

const getTodoById = async (req, res, next) => {
    try {
        const todoModel = await TodoModel.findById(req.params.id);
        if (todoModel) {
            res.status(200).json(todoModel);
        } else {
            res.status(404).send();
        }
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(404).send();
        }
        next(error);
    }
};


module.exports = { createTodo, getTodos, getTodoById }