import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export async function generateImageUrl(id) {
  const signedExp = process.env.SIGNED_URL_EXPIRATION;
  const bucket = process.env.TODOS_S3_BUCKET;

  return await getSignedUrl(new S3Client(), new PutObjectCommand({
    Bucket: bucket,
    Key: id
  }), {
    expiresIn: signedExp
  })
}
