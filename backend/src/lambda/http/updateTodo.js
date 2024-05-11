import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { updateData } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'
import { getUserId } from '../utils.mjs'

const logger = createLogger('updateData')

export const handler = middy().use(httpErrorHandler())
  .use(cors({ credentials: true }))
  .handler(async (e) => {
    logger.info('Updating: ', e)
    const updatedTodo = await updateData(
                                          JSON.parse(e.body),
                                          e.pathParameters.todoId,
                                          getUserId(e)
                                        )
    logger.info('Finish updating todos: ', updatedTodo)
    return {
      statusCode: 200
    }
  })
