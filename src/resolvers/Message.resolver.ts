import moment from "moment";
import { Arg, Query, Mutation, Resolver } from "type-graphql";
import { Message } from "../models";

@Resolver(Message)
export class MessageResolver {

    // Scuzzy way of holding onto message data between calls.
    private static currentMessageId: number = 1;
    private static messageData: Message[] = [];

    @Mutation(() => Message, {
        description: "Sends a message from the given sender to the given recipient."
    })
    public sendMessage(
        @Arg("recipient") recipient: string,
        @Arg("sender") sender: string,
        @Arg("content") content: string
    ) {
        // this is where a call to a message service would be

        // Create a message object and add the provided data to it.
        const message = new Message();
        message.id = MessageResolver.currentMessageId;
        message.sender = sender;
        message.recipient = recipient;
        message.content = content;
        message.sentDate = moment().utc().toDate();

        // "Persist" message and increment current message id now that everything has completed.
        MessageResolver.messageData.push(message);
        MessageResolver.currentMessageId++;
        return message;
    }

    @Query(() => [Message], {
        description: "Fetch a list of the given recipient's messages. If a sender is provided, the messages are only those sent between the two."
    })
    public getMessages(
        @Arg("recipient") recipient: string,
        @Arg("sender", { nullable: true }) sender?: string,
    ): Message[] {
        const filteredMessages = MessageResolver.messageData.filter((msg) => {
            let validSender = true;
            // If sender is provided, filter on it as well.
            if (sender) {
                validSender = msg.sender === sender;
            }

            // Filter out messages more than 30 days old.
            if (moment().utc().diff(msg.sentDate, "days") > 30) {
                return false;
            }

            return msg.recipient === recipient && validSender;
        });

        // Assuming messages are stored oldest to newest, slice off the last 100 messages and return them.
        return filteredMessages.slice(-100);
    }
}

export default MessageResolver;
