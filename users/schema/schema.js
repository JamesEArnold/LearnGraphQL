import graphql from "graphql";
import axios from 'axios';

const { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLInt, 
    GraphQLSchema, 
    GraphQLList, 
    GraphQLNonNull 
} = graphql;

// The order of definitions/types is important
const CompanyType = new GraphQLObjectType({
  name: 'Company',
  // We're going to wrap our fields in an arrow function
  // to get around our UserType not being defined until after
  // this function is called
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      // We need to wrap our UserType within a GraphQLList
      // to let GraphQL know that we are expecting multiple users
      // to be associated with this company
      type: new GraphQLList(UserType),
      resolve (parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`).then(response => response.data);
      }
    }
  })
})

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
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
  })
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

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // Our first mutation will be to add to our collection of users
    addUser: {
      // The type refers to the type of data that we will return from the resolve function
      type: UserType,
      // Pass in the arguments needed to create the User type
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        companyId: { type: GraphQLString }
      },
      resolve(parentValue, { firstName, age }) {
        return axios.post(`https://localhost:3000/users`, { firstName, age }).then(response => response.data)
      }
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parentValue, { id }) {
        return axios.delete(`https://localhost:3000/users/${id}`).then(response => response.data);
      }
    },
    editUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        company: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        return axios.patch(`https://localhost:3000/users/${args.id}`, args).then(response => response.data);
      }
    }
  }
})

// GraphQLSchema takes in an object containing a query property
// and returns a GraphQLSchema Instance
export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation,
});

// We're exporting this schema to make it available to the rest
// of the application