import express from 'express';
import expressgraphql from 'express-graphql';
import { schema } from './schema/schema.js';

const { graphqlHTTP } = expressgraphql;

const app = express();

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}))

app.listen(4000, () => {
    console.log('Listening...');
});