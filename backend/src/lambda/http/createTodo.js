import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { createData } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'
import { getUserId } from '../utils.mjs'

const logger = createLogger('createData')

export const handler = middy().use(httpErrorHandler())
  .use(cors({ credentials: true }))
  .handler(async (e) => {
    logger.info('Creating: ', e)
    const createdTodo  = await createData(
                                            JSON.parse(e.body),
                                            getUserId(e)
                                          )
    logger.info('Finish creating todos')
    return {
      statusCode: 200,
      body: JSON.stringify({
        item: createdTodo 
      })
    }
  })
