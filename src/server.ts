import "reflect-metadata";
import { ApolloServer, gql } from "apollo-server";
import { buildGraphSchema } from "./middleware";

(async () => {
    const schema = await buildGraphSchema();
    const server = new ApolloServer({ schema });
    const { url } = await server.listen(process.env.API_PORT || 1312);
    console.log(`Server is running on ${url}`);
})();
