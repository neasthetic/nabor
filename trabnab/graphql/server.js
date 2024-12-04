// graphql/server.js
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');
const app = express();

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));



app.listen(4000, () => {
  console.log('GraphQL API rodando na porta 4000');
});
