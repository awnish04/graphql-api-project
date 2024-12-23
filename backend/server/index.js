// const express = require("express");
// const { ApolloServer, gql } = require("apollo-server-express");
// const mongoose = require("mongoose");

// const app = express();
// const port = process.env.PORT || 4000;

// // MongoDB Connection
// mongoose
//   .connect("mongodb://localhost:27017/contactForm", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.log("Error connecting to MongoDB:", err));

// // Define schema
// const typeDefs = gql`
//   type Contact {
//     id: ID!
//     name: String!
//     email: String!
//     message: String!
//   }

//   type Query {
//     getContacts: [Contact]
//   }

//   type Mutation {
//     addContact(name: String!, email: String!, message: String!): Contact
//   }
// `;

// // Define resolvers
// const resolvers = {
//   Query: {
//     getContacts: async () => {
//       return await Contact.find();
//     },
//   },
//   Mutation: {
//     addContact: async (_, { name, email, message }) => {
//       const newContact = new Contact({ name, email, message });
//       await newContact.save();
//       return newContact;
//     },
//   },
// };

// // MongoDB model
// const Contact = mongoose.model(
//   "Contact",
//   new mongoose.Schema({
//     name: String,
//     email: String,
//     message: String,
//   })
// );

// // Set up Apollo Server
// const server = new ApolloServer({ typeDefs, resolvers });
// server.applyMiddleware({ app });

// // Start the server
// app.listen(port, () => {
//   console.log(
//     `Server running on http://localhost:${port}${server.graphqlPath}`
//   );
// });

const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");

require("dotenv").config();
// Log the MongoDB URI to check if it's loaded correctly
console.log("MongoDB URI:", process.env.MONGO_URI);

// Connect to MongoDB (for storing contact form data)
const mongoose = require("mongoose");
const mongoURI = process.env.MONGO_URI;
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true, // Ensure the connection is using the latest parser
    useUnifiedTopology: true, // Use the new connection management engine
    serverSelectionTimeoutMS: 5000, // Increase the timeout to 5 seconds
    socketTimeoutMS: 45000, // Increase socket timeout to 45 seconds
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit the application if the database connection fails
  });

// Contact Form Schema
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
});

const Contact = mongoose.model("Contact", contactSchema);

// GraphQL Schema Definition
const typeDefs = gql`
  type Contact {
    id: ID!
    name: String!
    email: String!
    message: String!
  }

  type Query {
    contacts: [Contact]
  }

  type Mutation {
    addContact(name: String!, email: String!, message: String!): Contact
  }
`;

// Resolvers for GraphQL
const resolvers = {
  Query: {
    contacts: async () => {
      return await Contact.find();
    },
  },
  Mutation: {
    addContact: async (_, { name, email, message }) => {
      const contact = new Contact({ name, email, message });
      await contact.save();
      return contact;
    },
  },
};

// Apollo Server Setup
const startServer = async () => {
  const server = new ApolloServer({ typeDefs, resolvers });

  await server.start(); // Wait for Apollo Server to start

  const app = express();
  server.applyMiddleware({ app, path: "/graphql" });

  app.listen(4000, () => {
    console.log("Server is running on http://localhost:4000/graphql");
  });
};

startServer(); // Start the server
