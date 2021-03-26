import graphql from "graphql";
import axios from 'axios';

const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema } = graphql;

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: GraphQLString},
        firstName: { type: GraphQLString},
        age: { type: GraphQLInt}
    }
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            // The root query has an expectation to receive an ID as an argument
            args: { id: { type: GraphQLString }},
            resolve (parentValue, args) {
                return axios.get(`http://localhost:3000/users/${args.id}`).then(response => response.data);
            }
        }
    }
});

// GraphQLSchema takes in an object containing a query property
// and returns a GraphQLSchema Instance
export const schema = new GraphQLSchema({
    query: RootQuery,
});

// We're exporting this schema to make it available to the rest
// of the application