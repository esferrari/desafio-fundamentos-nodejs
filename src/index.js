const express = require('express');
const cors = require('cors');

const { v4: uuidv4, v4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const {username} = request.headers;
  const userExist = users.find(user => user.username == username);

  if(!userExist)
    return response.status(404).json({error: 'User not found'})  

  request.user = userExist;

  return next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  const userExist = users.find(user => user.username == username);

  if(userExist)
    return response.status(400).json({error: 'Mensagem do erro'})

  const user = {
    id: v4(),
    name,
    username,
    todos: []
  }
  users.push(user);
  return response.status(201).json(user);

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;

  return response.json(user.todos);

});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { title, deadline} = request.body;

  const todo = { 
    id: v4(),
    title,
    done: false, 
    deadline: new Date(deadline), 
    created_at: new Date()
  }

  user.todos.push(todo);

  return response.status(201).json(todo);

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { title, deadline} = request.body;
  const { id } = request.params;

  const idExist = user.todos.findIndex(todo => todo.id == id);
  

  if(idExist == -1)
    return response.status(404).json({error: 'Todo not found'})  

  user.todos[idExist].title = title
  user.todos[idExist].deadline = deadline

  return response.status(201).json(user.todos[idExist]);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;

  const indexTodo = user.todos.findIndex(todo => todo.id == id);

  if(indexTodo == -1)
    return response.status(404).json({error: 'Todo not found'})  

  user.todos[indexTodo].done = true;

  return response.status(201).json(user.todos[indexTodo]);

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;

  const indexTodoDelete = user.todos.findIndex(todo => todo.id == id);

  if(indexTodoDelete == -1)
    return response.status(404).json({error: 'Todo not found'})

  user.todos.splice(indexTodoDelete,1);

  return response.status(204).json();
  // const { id } = request.headers;
  // var index = 0
  // users.map(x => {
  //   if(x.id == id){
  //     index = users.indexOf(x);
  //   }
  // })

  // users.




});

module.exports = app;