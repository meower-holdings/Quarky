import Message from "../../../dialogs/Message.jsx";
import ProfilePicture from "../../../ProfilePicture.jsx";
import {useContext} from "react";
import {AppContext} from "../../../../contexts/AppContext.js";
import LightquarkAttachments from "./LightquarkAttachments.jsx";

export default function LightquarkMessage({message, channel, isContinuation}) {
    const botMetadata = message.specialAttributes?.find(attr => attr.type === "botMessage");
    const clientAttributes = message.specialAttributes?.find(attr => attr.type === "clientAttributes");

    const {userCache, messageCache} = useContext(AppContext);
    const replyId = message.specialAttributes?.find(attr => attr.type === "reply")?.replyTo;
    const replyTo = replyId ? messageCache[channel]?.find(m => m._id === replyId) : null;
    const noBotAuthor = userCache[message.author._id] || message.author;
    const author = botMetadata || noBotAuthor;

    return <Message username={author.username} timestamp={message.timestamp} edited={message.edited} attachments={<LightquarkAttachments attachments={message.attachments}/>}
                    avatar={<ProfilePicture src={author.avatarUri} isMessage={true}/>} content={message.content} isBot={noBotAuthor.isBot} botName={botMetadata ? noBotAuthor.username : null}
                    isDiscord={clientAttributes?.quarkcord} replyTo={replyTo} isContinuation={isContinuation} />
}