import graphql from "graphql";
import axios from 'axios';

const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema } = graphql;

// The order of definitions/types is important
const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString }
  }
})

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString},
    firstName: { type: GraphQLString},
    age: { type: GraphQLInt},
    // We'll go ahead and add the relation between our user and company type
    company: {
      type: CompanyType,
      // The parentValue that we're referencing here is the User that we just fetched.
      // This means we can search for a company based off of parentValue.companyId
      resolve (parentValue, args) {
       return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`).then(response => response.data);
      }
    }
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
    },
    // Adding this company field will allow us to search directly for company nodes
    // instead of traversing through a User node first, to get to a company
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString }},
      resolve (parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${args.companyId}`).then(response => response.data);
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