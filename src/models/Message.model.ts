import { Field, Int, ObjectType } from "type-graphql";

@ObjectType({ description: "A text-only message, sent from one user to another." })
/**
 * The Message schema type. If we were using a real database, this would also include typeorm annotations as well.
 */
export class Message {
    @Field(() => Int, { nullable: false, description: "The internal id for this message." })
    public id!: number;

    @Field(() => String, { nullable: false, description: "The content sent with this message." })
    public content!: string;

    @Field(() => String, { nullable: false, description: "The name of the user sending this message." })
    public sender!: string;

    @Field(() => String, { nullable: false, description: "The name of the user receiving this message." })
    public recipient!: string;

    @Field(() => Date, { nullable: false, description: "The date this message was first sent." })
    public sentDate!: Date;
}

export default Message;
