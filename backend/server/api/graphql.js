// server/api/graphql.js
import { ApolloServer, gql } from "apollo-server-micro";
import mongoose from "mongoose";

require("dotenv").config(); // Ensure .env is loaded

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const typeDefs = gql`
  type Contact {
    name: String
    email: String
    message: String
  }

  type Query {
    contacts: [Contact]
  }

  type Mutation {
    addContact(name: String, email: String, message: String): Contact
  }
`;

const resolvers = {
  Query: {
    contacts: async () => {
      const Contact = mongoose.model(
        "Contact",
        new mongoose.Schema({
          name: String,
          email: String,
          message: String,
        })
      );
      return await Contact.find({});
    },
  },
  Mutation: {
    addContact: async (_, { name, email, message }) => {
      const Contact = mongoose.model(
        "Contact",
        new mongoose.Schema({
          name: String,
          email: String,
          message: String,
        })
      );
      const newContact = new Contact({ name, email, message });
      await newContact.save();
      return newContact;
    },
  },
};

// Apollo Server instance
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true, // Enable GraphQL playground in dev
  playground: true,
});

export const config = {
  api: {
    bodyParser: false, // Disable body parsing to handle incoming requests properly
  },
};

export default apolloServer.createHandler({ path: "/api/graphql" });
