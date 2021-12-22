# Messaging API Example App

This project is a simple example for how I'd go about implementing the provided messaging API spec. The code itself took about 3 hours to write, and this documentation took about another hour to put together.

#### Contents
[Usage](#usage)  
[API Documentation](#api-documentation)  
[Structure Overview](#structure-overview)  
[Future Changes](#future-changes)  

## Usage
To use this API locally, clone the repo and run `npm run install` to install packages. once done you can use the following commands listed below. For both the `dev` and `start` commands, the GraphQL sandbox is left enabled to allow you to explore the schema and make calls without using any external tools. You can access this sandbox by going to the url provided after the server starts (`http://localhost:[port]`).

### `npm run dev`
This command is for development. It uses the included `.env` file for environment variables rather than relying on them to be provided elsewhere. It starts the application through [nodemon](https://github.com/remy/nodemon/) to allow for easy development. If you're using VSCode, you can attach your debugger to this process by going to the Run and Debug tab, and running the Attach configuration to list the node processes you can attach to. In this case, it'll be the same command that's listed under `dev` in `package.json`.

### `npm run start`
This command is the "production" option; it calls [ts-node](https://github.com/TypeStrong/ts-node) directly rather than using it through nodemon, and uses a separate tsconfig file to eschew typechecking for the sake of performance. No environment variables are provided in this project, as the expectation would be that they're provided elsewhere. For the sake of simplicity a default port (`1312`) is provided within the code to avoid the port used changing on every invocation.

### `npm run test`
This command runs the test suite provided within this repo, which currently consists of a single test for each GraphQL operation. It uses [jest](https://github.com/facebook/jest) for running the tests, and uses the [executeOperation](https://www.apollographql.com/docs/apollo-server/testing/testing/) method that Apollo offers to run the operations inside each test.

## API Documentation
This API uses GraphQL, and exposes two operations: one mutation for sending messages, and one query that retrieves messages for a given recipient.

### `sendMessage`
This mutation lets you specify a recipient, sender, and text content for your message. Calling it will persist the message data provided and return it, along with additional metadata for that message.

#### Example call:
```gql
mutation sendMessage($sender: String!, $recipient: String!, $content: String!) {
    sendMessage(sender: $sender, recipient: $recipient, content: $content) {
        id, content, sender, recipient, sentDate
    }
}
```

#### Variables provided:
```json
{
    "sender": "caroline",
    "recipient": "hannah",
    "content": "idk, what do you want?"
}
```

#### Call response:
```json
{
    "data": {
        "sendMessage": {
            "id": 1,
            "content": "idk, what do you want?",
            "sender": "caroline",
            "recipient": "hannah",
            "sentDate": "2021-12-22T22:06:52.193Z"
        }
    }
}
```

### `getMessages`
This query lets you request an array of messages by recipient, optionally filtered further by providing a sender for those messages.

The messages returned will be no more than 30 days old, and this request will only return the most recent 100 messages if more than 100 are present.

#### Example call:
```gql
query getMessages($recipient: String!, $sender: String) {
    getMessages(recipient: $recipient, sender: $sender) {
        id, content, recipient, sender, sentDate
    }
}
```
#### Variables provided:
```json
{
    "recipient": "hannah"
}
```

#### Call response:
```json
{
    "data": {
        "getMessages": [
            {
                "id": 1,
                "content": "idk, what do you want?",
                "recipient": "hannah",
                "sender": "caroline",
                "sentDate": "2021-12-22T22:06:52.193Z"
            }
        ]
    }
}
```

## Structure Overview
The project uses Apollo for it's server, and uses the amazing [TypeGraphQL](https://github.com/MichalLytek/type-graphql) library for creating the GraphQL schema and resolvers. This library generates the schema by using type information provided through typescript classes and decorators.

The project is laid out such that future resolvers and models could easily be added simply by creating new files in the approriate folders and ensuring that the new resolver(s) are being imported through the `buildGraphSchema` function.

## Future Changes
As I went through this project, I kept track of changes I'd consider making if I had the time. The (slightly messy) list is presented below:
```
add di/service layer
add linting
auth through typegraphql
add typeorm to models/persistent data store setup
env typing
add gql input types?
structure data better (sender table w/ ids instead of string names)
validate data inputs given
pare out descriptions into a separate file for orgianizational/localization purposes
convert persisted dates to utc? (most data stores would provide this automatically)
add data faking library for testing
add more thorough testing for the api calls implemented
add separate tsconfig for tests
add paging options for getMessages
define env variables for "prod" env
```
