import React, { useState, useEffect } from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql", // API endpoint for GraphQL
  cache: new InMemoryCache(),
});

const GET_CONTACTS = gql`
  query GetContacts {
    contacts {
      id
      name
      email
      message
    }
  }
`;

const ContactList = () => {
  const { loading, error, data } = useQuery(GET_CONTACTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Message</th>
        </tr>
      </thead>
      <tbody>
        {data.contacts.map((contact) => (
          <tr key={contact.id}>
            <td>{contact.name}</td>
            <td>{contact.email}</td>
            <td>{contact.message}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const App = () => (
  <ApolloProvider client={client}>
    <div>
      <h1>Admin Dashboard</h1>
      <ContactList />
    </div>
  </ApolloProvider>
);

export default App;
