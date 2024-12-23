import React, { useState } from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useMutation,
  gql,
} from "@apollo/client";

const client = new ApolloClient({
  uri: process.env.REACT_APP_API_URL, // API endpoint for GraphQL
  cache: new InMemoryCache(),
});

const ADD_CONTACT = gql`
  mutation AddContact($name: String!, $email: String!, $message: String!) {
    addContact(name: $name, email: $email, message: $message) {
      id
      name
      email
      message
    }
  }
`;

const ContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [addContact] = useMutation(ADD_CONTACT);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addContact({ variables: { name, email, message } });
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

const App = () => (
  <ApolloProvider client={client}>
    <div>
      <h1>Contact Form</h1>
      <ContactForm />
    </div>
  </ApolloProvider>
);

export default App;
