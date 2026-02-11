const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { ApolloServer } = require("apollo-server-express");
const { loadSchemaSync } = require("@graphql-tools/load");
const { GraphQLFileLoader } = require("@graphql-tools/graphql-file-loader");
const path = require("path");
require("dotenv").config();

const resolvers = require("./graphql/resolvers");


const app = express();
app.use(cors());

// Load schema from .graphql file
const typeDefs = loadSchemaSync(
  path.join(__dirname, "./graphql/schema.graphql"),
  {
    loaders: [new GraphQLFileLoader()],
  }
);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  server.applyMiddleware({ app, path: "/api/v1/evoting" });

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`GraphQL endpoint ready at http://localhost:${PORT}/api/v1/evoting`);
  });
}

startServer();