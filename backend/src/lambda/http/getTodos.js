import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getTodosData } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'
import { getUserId } from '../utils.mjs'

const logger = createLogger('getTodosData')

export const handler = middy().use(httpErrorHandler())
  .use(cors({ credentials: true }))
  .handler(async (e) => {
    logger.info('Getting: ', e)
    const todoDatas = await getTodosData(getUserId(e))
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        items: todoDatas 
      })
    }
  })
