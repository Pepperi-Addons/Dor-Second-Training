import TodosService from './todo.service'
import { Client, Request } from '@pepperi-addons/debug-server'

// this function will run on the 'api/todos' endpoint
export async function todos(client: Client, request: Request) {

    const todosService = new TodosService(client)
    console.log(request)

    if (request.method === 'POST') {
        if (!request.body.Key) {
            return todosService.createTodo(request.body);
        } else {
            return todosService.createTodo(request.body);
        }
    } else if (request.method === 'GET') {
        return todosService.getTodos(request.query);
    } else {
        throw new Error(`Method ${request.method} not supported`)
    }
};

export async function delete_todos(client: Client, request: Request) {

    const todosService = new TodosService(client)

    if (request.method === 'POST') {
        console.log(request.body.length)
        if (request.body.length < 1) {
            throw new Error("Please provide an array of keys");
        } else {
            return todosService.deleteTodos(request.body);
        }
    } else {
        throw new Error(`Method ${request.method} not supported`);
    }
};

export async function complete_todos(client: Client, request: Request) {

    const todosService = new TodosService(client)

    if (request.method === 'POST') {
        console.log(request.body.length)
        if (request.body.length < 1) {
            throw new Error("Please provide an array of keys");
        } else {
            return todosService.completeTodos(request.body);
        }
    } else {
        throw new Error(`Method ${request.method} not supported`);
    }
};