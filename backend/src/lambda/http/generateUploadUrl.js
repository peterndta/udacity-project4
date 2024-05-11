import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { generateImageUrl } from '../../fileStorage/attachmentUtils.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('generateImageUrl')

export const handler = middy().use(httpErrorHandler())
  .use(cors({ credentials: true }))
  .handler(async (e) => {
    logger.info('Generate imageUrl: ', e)
    const url = await generateImageUrl(e.pathParameters.todoId)
    logger.info('Finish Generating imageUrl')
    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl: url
      })
    }
  })
