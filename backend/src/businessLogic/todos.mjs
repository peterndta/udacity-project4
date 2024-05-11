import * as uuid from 'uuid'

import { TodosAccess } from '../dataLayer/todosAccess.mjs'

const todoAccess = new TodosAccess()

export const createData = async (newTodoData, userId) => {
  const env = process.env.TODOS_S3_BUCKET;
  const todoId = uuid.v4()
  const { name, dueDate } = newTodoData
  return await todoAccess.createData({
    todoId,
    name: name,
    userId,
    dueDate: dueDate,
    createdAt: new Date().toISOString(),
    done: false,
    attachmentUrl: `https://${env}.s3.amazonaws.com/${todoId}`
  })
}

export const updateData = async (updateTodoData, todoId, userId) => {
  const { name, dueDate, done } = updateTodoData
  return await todoAccess.updateData({
    todoId,
    name: name,
    dueDate: dueDate,
    done: done,
    userId
  })
}

export const deleteData = async (todoId, userId) => await todoAccess.deleteData(todoId, userId)

export const getTodosData = async (userId) => await todoAccess.getListOfTodo(userId)
