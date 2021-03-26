{
  user(id: "23") {
    id,
    firstName,
    age
  }
}

// We can name our queries as well and then reuse them in our codebase
query findCompany {
  company(id: "1") {
    id,
    name,
    description
  }
}

// We can query the same field multiple times, but we'll need to assign
// the response to a key like so:
{
  apple: company(id: "1") {
    id,
    name,
    description
  },
  google: company(id: "2") {
    id,
    name,
    description
  },
}

// To save ourselves the reptition of writing out those properties every time
// We can create a query fragement like so:
fragement companyDetails on Company {
  id,
  name,
  description
}

// Now we can use the spread operator on the fragment within the query like so:
{
  apple: company(id: "1") {
    ...companyDetails
  },
  google: company(id: "2") {
    ...companyDetails
  },
}