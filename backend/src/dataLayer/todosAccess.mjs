import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'

export class TodosAccess {
  constructor() {
    this.database = DynamoDBDocument.from(
      AWSXRay.captureAWSv3Client(new DynamoDB())
    )
    this.tableTodos = process.env.TODOS_TABLE
    this.index = process.env.TODOS_CREATED_AT_INDEX
  }

  async createData(newItem) {
    await this.database.put({
      TableName: this.tableTodos,
      Item: newItem
    })

    // Return the newItem once it has been successfully stored.
    return newItem
  }

  async updateData(updatedItem) {
    return await this.database.update({
      TableName: this.tableTodos,
      Key: {
        todoId: updatedItem.todoId,
        userId: updatedItem.userId
      },
      UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
      ExpressionAttributeValues: {
        ':name': updatedItem.name,
        ':dueDate': updatedItem.dueDate,
        ':done': updatedItem.done
      },
      ExpressionAttributeNames: {
        '#name': 'name'
      }
    })
  }

  async deleteData(todoId, userId) {
    return await this.database.delete({
      TableName: this.tableTodos,
      Key: { todoId, userId }
    })
  }

  async getListOfTodo(userId) {
    const tableTodos = await this.database.query({
      TableName: this.tableTodos,
      IndexName: this.index,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    })
    return tableTodos.Items
  }
}
