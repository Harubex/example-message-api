import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { buildGraphSchema } from "../../src/middleware";

export default async () => {
    const schema = await buildGraphSchema();
    return new ApolloServer({ schema });
};
