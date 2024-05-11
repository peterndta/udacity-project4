# Serverless TODO

To implement this project you need to implement a simple TODO application using AWS Lambda and Serverless framework. Search for all the `TODO:` comments in the code to find the placeholders that you need to implement.

# Functionality of the application

This appliation will allow to create/remove/update/get TODO items. Each TODO item can optionally have an attachment image. Each user only has access to TODO items that he/she has created. 

# Functions to be implemented

To implement this project you need to implement the following functions and configure them in the `serverless.yml` file:

* `Auth` - this function should implement a custom authorizer for API Gateway that should be added to all other functions.
* `GetTodos` - should return all TODOs for a current user. 
* `CreateTodo` - should create a new TODO for a current user. A shape of data send by a client application to this function can be found in the `CreateTodoRequest.ts` file
* `UpdateTodo` - should update a TODO item created by a current user. A shape of data send by a client application to this function can be found in the `UpdateTodoRequest.ts` file
* `DeleteTodo` - should delete a TODO item created by a current user. Expects an id of a TODO item to remove.
* `GenerateUploadUrl` - returns a presigned url that can be used to upload an attachment file for a TODO item. 

All functions are already connected to appriate events from API gateway

An id of a user can be extracted from a JWT token passed by a client

You also need to add any necessary resources to the `resources` section of the `serverless.yml` file such as DynamoDB table and and S3 bucket.

# Frontend

The `client` folder contains a web application that can use the API that should be developed in the project.

To use it please edit the `config.ts` file in the `client` folder:

```ts
const apiId = '...' API Gateway id
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: '...',    // Domain from Auth0
  clientId: '...',  // Client id from an Auth0 application
  callbackUrl: 'http://localhost:3000/callback'
}
```


# Suggestions

To store TODO items you might want to use a DynamoDB table with local secondary index(es). A create a local secondary index you need to a create a DynamoDB resource like this:

```yml

TodosTable:
  Type: AWS::DynamoDB::Table
  Properties:
    AttributeDefinitions:
      - AttributeName: partitionKey
        AttributeType: S
      - AttributeName: sortKey
        AttributeType: S
      - AttributeName: indexKey
        AttributeType: S
    KeySchema:
      - AttributeName: partitionKey
        KeyType: HASH
      - AttributeName: sortKey
        KeyType: RANGE
    BillingMode: PAY_PER_REQUEST
    TableName: ${self:provider.environment.TODOS_TABLE}
    LocalSecondaryIndexes:
      - IndexName: ${self:provider.environment.INDEX_NAME}
        KeySchema:
          - AttributeName: partitionKey
            KeyType: HASH
          - AttributeName: indexKey
            KeyType: RANGE
        Projection:
          ProjectionType: ALL # What attributes will be copied to an index

```

To query an index you need to use the `query()` method like:

```ts
await this.dynamoDBClient
  .query({
    TableName: 'table-name',
    IndexName: 'index-name',
    KeyConditionExpression: 'paritionKey = :paritionKey',
    ExpressionAttributeValues: {
      ':paritionKey': partitionKeyValue
    }
  })
  .promise()
```

# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless TODO application.

# "curl" commands

An alternative way to test your API you can use the following curl commands. For all examples below you would need to replace:

* {API-ID} - with you API's ID that is returned by the Serverless framework
* {JWT-token} - a JWT token from the web application

## Get all TODOs

To fetch all TODOs you would need to send the following GET request:

```sh
curl --location --request GET 'https://{API-ID}.execute-api.us-east-1.amazonaws.com/dev/todos' \
--header 'Authorization: Bearer {JWT-token}'
```

## Create a new TODO

To create a new TODO you would need to send a POST request and provide a JSON with two mandatory fields: `name` and `dueDate`.

```sh
curl --location --request POST 'https://{API-ID}.execute-api.us-east-1.amazonaws.com/dev/todos' \
--header 'Authorization: Bearer {JWT-token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Buy bread",
    "dueDate": "2022-12-12"
}'
```

## Update a TODO

To update a TODO you would need to send a PATCH request and provide one of the following fields: `name`, `dueDate`, and boolean `done`.

You would also need to provide an ID of an existing TODO in the URL.

```sh
curl --location --request PATCH 'https://{API-ID}.execute-api.us-east-1.amazonaws.com/dev/todos/{TODO-ID}' \
--header 'Authorization: Bearer {JWT-token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Buy bread",
    "dueDate": "2022-12-12",
    "done": true
}'
```

## Remove TODO

To remove a TODO you would need to send a `DELETE` request, and provide an ID of an existing TODO, as well as other parameters.

```sh
curl --location --request DELETE 'https://{API-ID}.execute-api.us-east-1.amazonaws.com/dev/todos/{TODO-ID}' \
--header 'Authorization: Bearer {JWT-token}'
```


## Upload image attachment

To upload an image attachment you would first need to send a POST request to the following URL:

```sh
curl --location --request POST 'https://{API-ID}.execute-api.us-east-1.amazonaws.com/dev/todos/{TODO-ID}/attachment' \
--header 'Authorization: Bearer {JWT-token}'
```

It should return a response like this that would provide a pre-signed URL:

```json
{
    "uploadUrl": "https://serverless-c4-todo-images.s3.us-east-1.amazonaws.com/...&x-id=PutObject"
}
```

We can then use curl command to upload an image (`image.jpg` in this example) to S3 using this pre-signed URL:

```sh
curl -X PUT -T image.jpg -L "https://serverless-c4-todo-images.s3.us-east-1.amazonaws.com/...&x-id=PutObject"
```

