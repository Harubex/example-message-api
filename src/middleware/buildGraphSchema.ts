import { buildSchema } from "type-graphql"
import { resolvers } from "../resolvers";

/**
 * Reusable function for building the graph schema from the models/resolvers defined in this project.
 */
export default async () => {
    // Auth would be done through this function as well.
    return await buildSchema({
        resolvers
    })
};
