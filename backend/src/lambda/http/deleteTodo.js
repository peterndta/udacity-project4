import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { deleteData } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'
import { getUserId } from '../utils.mjs'

const logger = createLogger('deleteData')

export const handler = middy().use(httpErrorHandler())
  .use(cors({ credentials: true }))
  .handler(async (e) => {
    logger.info('Deleting: ', e)
    const removedTodo = await deleteData(
                                          e.pathParameters.todoId,
                                          getUserId(e)
                                        )
    logger.info('Finish deleting todos: ', removedTodo)
    return {
      statusCode: 200
    }
  })
