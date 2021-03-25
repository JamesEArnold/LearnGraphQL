import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema } from 'graphql';
import _ from 'lodash';

// Hard coded list of users to use as data
const users = [
    { 
        id: '23', 
        firstName: 'Bill',
        age: 20,
    },
    {
        id: '47',
        firstName: 'Samantha',
        age: 21,
    }
]

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
                // This go through our users
                // And returns the first user with the matching
                // id of the passed arg ID
                return _.find(users, { id: args.id });
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