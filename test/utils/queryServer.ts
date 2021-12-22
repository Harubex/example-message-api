import "reflect-metadata";

import type { DocumentNode } from "graphql";
import type { ApolloServer } from "apollo-server";

interface Request {
    query: string | DocumentNode;
    variables?: { [key: string]: string };
}

export default async (server: ApolloServer, request: Request) => {
    const resp = await server.executeOperation(request);

    // Tests that no errors are present before returning response.
    expect(resp.errors).toBeUndefined();

    return resp.data;
};
