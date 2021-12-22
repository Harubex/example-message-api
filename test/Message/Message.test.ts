import { ApolloServer, gql } from "apollo-server";
import buildTestServer from "../utils/buildTestServer";
import queryServer from "../utils/queryServer";

describe("Message", () => {
    let server: ApolloServer;

    beforeAll(async () => {
        server = await buildTestServer();
    });

    test("Send a message", async () => {
        const sendMessageResp = await queryServer(server, {
            query: gql`
                mutation sendMessage($recipient: String!, $sender: String!, $content: String!) {
                    sendMessage(recipient: $recipient, sender: $sender, content: $content) {
                        id, content, recipient, sender, sentDate
                    }
                }
            `,
            variables: {
                "recipient": "hannah",
                "sender": "jimmy",
                "content": "heyyyyy ;)"
            }
        });

        // Tests that the returned message was assigned a valid id.
        expect(sendMessageResp?.sendMessage?.id).toBeGreaterThan(0);
    });

    test("Get recent messages for a recipient", async () => {
        const sendMessageResp = await queryServer(server, {
            query: gql`
               query getMessages($recipient: String!, $sender: String) {
                    getMessages(recipient: $recipient, sender: $sender) {
                        id, content, recipient, sender, sentDate
                    }
                }
            `,
            variables: {
                "recipient": "hannah",
                "sender": "jimmy"
            }
        });

        // Tests that the returned messages exist and are correct for the given recipient.
        // We added a message in the previous test, so there should be a message there for the given recipient.
        expect(sendMessageResp?.getMessages?.length).toBeGreaterThan(0);
        expect(sendMessageResp?.getMessages[0].recipient).toEqual("hannah");
        expect(sendMessageResp?.getMessages?.length).toBeLessThanOrEqual(100);
    });
});
