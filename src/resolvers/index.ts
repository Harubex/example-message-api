import MessageResolver from "./Message.resolver";

// Export as const to ensure that the array is readonly when imported.
export const resolvers = [
    MessageResolver
] as const;
