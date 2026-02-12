const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { ApolloServer } = require("apollo-server-express");
const { loadSchemaSync } = require("@graphql-tools/load");
const { GraphQLFileLoader } = require("@graphql-tools/graphql-file-loader");
const path = require("path");
require("dotenv").config();
const resolvers = require("./resolvers");
const authenticate = require("./auth/authMiddleware");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors());

// Load schema from .graphql file
const typeDefs = loadSchemaSync(
  path.join(__dirname, "./graphql/schema.graphql"),
  {
    loaders: [new GraphQLFileLoader()],
  },
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");
    await createDefaultAdmin();
  })
  .catch((err) => console.log(err));

async function createDefaultAdmin() {
  try {
    const existingAdmin = await User.findOne({ role: "ADMIN" });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin@123", 10);

      await User.create({
        name: "System Admin",
        email: "admin@evoting.com",
        password: hashedPassword,
        role: "ADMIN",
      });

      console.log("✅ Default Admin Created");
    } else {
      console.log("ℹ️ Admin already exists");
    }
  } catch (error) {
    console.log("Error creating default admin:", error);
  }
}

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const user = authenticate(req);
      return { user };
    },
  });

  await server.start();

  server.applyMiddleware({ app, path: "/api/v1/evoting" });

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(
      `GraphQL endpoint ready at http://localhost:${PORT}/api/v1/evoting`,
    );
  });
}

startServer();
