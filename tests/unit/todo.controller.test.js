const TodoController = require('../../controllers/todo.controller');
const TodoModel = require('../../models/todo.model');
const httpMocks = require('node-mocks-http');
const newTodo = require('../../mock-data/new-todo.json');
const allTodos = require('../../tests/mock-data/all-todos.json');

TodoModel.create = jest.fn();
TodoModel.find = jest.fn();
TodoModel.findById = jest.fn();
TodoModel.findByIdAndUpdate = jest.fn();
TodoModel.findByIdAndDelete = jest.fn();

const todoId = "69e60266b08d7dc78b5b9d19";

let req, res, next
beforeEach(() => {
    req = httpMocks.createRequest()
    res = httpMocks.createResponse()
    next = jest.fn();
})

describe('TodoController.createTodo', () => {
    beforeEach(() => {
        req.body = newTodo;
    });
    it('should have a createTodo function', () => {
        expect(typeof TodoController.createTodo).toBe('function');
    });
    it('should call TodoModel.create', () => {
        req.body = newTodo;
        TodoController.createTodo(req, res, next);
        expect(TodoModel.create).toHaveBeenCalledWith(newTodo);
    });
    it('should return 201 response code', async () => {
        req.body = newTodo;
        await TodoController.createTodo(req, res, next);
        expect(res.statusCode).toBe(201);
        expect(res._isEndCalled()).toBeTruthy();
    });
    it('should return json body in response', async () => {
        await TodoModel.create.mockReturnValue(newTodo);
        await TodoController.createTodo(req, res, next);
        expect(res._getJSONData()).toStrictEqual(newTodo);
    });
    it('should handle errors', async () => {
        const errorMessage = { message: 'Done property missing' };
        TodoModel.create.mockRejectedValue(errorMessage);
        await TodoController.createTodo(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    });
});

describe('TodoController.getTodos', () => {
    it('should have a getTodos function', () => {
        expect(typeof TodoController.getTodos).toBe('function');
    });
    it('should call TodoModel.find({})', async () => {
        await TodoController.getTodos(req, res, next);
        expect(TodoModel.find).toHaveBeenCalledWith({});
    });
    it('should return 200 response code and json body in response', async () => {
        TodoModel.find.mockReturnValue(newTodo);
        await TodoController.getTodos(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(newTodo);
    });
    it('should handle errors in getTodos', async () => {
        const errorMessage = { message: 'Error occurred while fetching todos' };
        TodoModel.find.mockRejectedValue(errorMessage);
        await TodoController.getTodos(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    });
});

describe('TodoController.getTodoById', () => {
    it('should have a getTodoById function', () => {
        expect(typeof TodoController.getTodoById).toBe('function');
    });
    it('should call TodoModel.findById with route parameters', async () => {
        const testReq = httpMocks.createRequest({ params: { id: '69e60266b08d7dc78b5b9d19' } });
        await TodoController.getTodoById(testReq, res, next);
        expect(TodoModel.findById).toHaveBeenCalledWith('69e60266b08d7dc78b5b9d19');
    });
    it('should return json body and response code 200', async () => {
        TodoModel.findById.mockReturnValue(newTodo);
        await TodoController.getTodoById(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(newTodo);
    }) 
    it('should handle errors in getTodoById', async () => {
        const errorMessage = { message: 'error finding todoModel' };
        const rejectPromise = Promise.reject(errorMessage);
        TodoModel.findById.mockReturnValue(rejectPromise);
        await TodoController.getTodoById(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    });
    it('should return 404 when item is not found', async () => {
        TodoModel.findById.mockReturnValue(null);
        await TodoController.getTodoById(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    });
});

describe('TodoController.updateTodo', () => {
    it('should have an updateTodo function', () => {
        expect(typeof TodoController.updateTodo).toBe('function');
    });
    it('should update with TodoModel.findByIdAndUpdate', async () => {
        req.params.id = todoId;
        req.body =newTodo;
        await TodoController.updateTodo(req, res, next);
        expect(TodoModel.findByIdAndUpdate).toHaveBeenCalledWith(todoId, newTodo, { 
            new: true,
            useFindAndModify: false
        });
    });
    it('should return json body and response code 200', async () => {
        req.params.id = todoId;
        req.body = newTodo;
        TodoModel.findByIdAndUpdate.mockReturnValue(newTodo);
        await TodoController.updateTodo(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(newTodo);
    });
    it('should handle errors in updateTodo', async () => {
        const errorMessage = { message: 'error' };
        const rejectPromise = Promise.reject(errorMessage);
        TodoModel.findByIdAndUpdate.mockReturnValue(rejectPromise);
        await TodoController.updateTodo(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    });
    it('should handle 404', async () => {
        TodoModel.findByIdAndUpdate.mockReturnValue(null);
        await TodoController.updateTodo(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    });
});

describe('TodoController.deleteTodo', () => {
    it('should have a deleteTodo function', () => {
        expect(typeof TodoController.deleteTodo).toBe('function');
    });
    it('should delete with TodoModel.findByIdAndDelete', async () => {
        req.params.id = todoId;
        await TodoController.deleteTodo(req, res, next);
        expect(TodoModel.findByIdAndDelete).toHaveBeenCalledWith(todoId);
    });
    it('should return 200 response code and json body in response', async () => {
        TodoModel.findByIdAndDelete.mockReturnValue(newTodo);
        await TodoController.deleteTodo(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(newTodo);
    });
    it('should handle errors in deleteTodo', async () => {
        const errorMessage = { message: 'error' };
        const rejectPromise = Promise.reject(errorMessage);
        TodoModel.findByIdAndDelete.mockReturnValue(rejectPromise);
        await TodoController.deleteTodo(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    });
    it('should handle 404 when item not found', async () => {
        TodoModel.findByIdAndDelete.mockReturnValue(null);
        await TodoController.deleteTodo(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    });
});