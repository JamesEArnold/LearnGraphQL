mutation {
  addUser(firstName: "Ian", age: 26) {
    // Whenever we call a mutation we must ask for some properties to 
    // come back off of it.  Or what was resolved off of the resolve
    // function
    id,
    firstName,
    age
  }
}

mutation {
  deleteUser(id: "23") {
    // The resolved ID will be null, which is what we expect
    // This is because we HAVE to assert that there is some Type that
    // is expected to be returned
    id
  }
}