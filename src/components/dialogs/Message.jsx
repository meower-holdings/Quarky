import styles from "./Message.module.css";
import * as linkify from "linkifyjs";
import RichEmbed, {badLinks} from "./RichEmbed.jsx";
import BotTag from "./BotTag.jsx";
import TimeAgo from "react-timeago"
import {useContext, useState} from "react";
import classnames from "classnames";
import {AppContext} from "../../contexts/AppContext.js";
import ProfilePicture from "./ProfilePicture.jsx";
import dedupe from "../../util/dedupe.js";
import Button from "../nav/Button.jsx";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeExternalLinks from "rehype-external-links";

export default function Message({children, avatarUri, username, content, isBot, botName, isDiscord, timestamp, edited, attachments, replyTo, isContinuation, game, editFunction, deleteFunction}) {
    const {settings} = useContext(AppContext)
    const [isEditing, setEditing] = useState(false);
    const [isSaving, setSaving] = useState(false);
    const [isDeleting, setDeleting] = useState(false);
    const [editText, setEditText] = useState(content);

    async function checkEditKey(e) {
        if(e.key === "Enter" && !e.shiftKey) {
            setSaving(true);
            await editFunction(editText);
            setSaving(false); setEditing(false);
        } else if (e.key === "Escape") {
            setEditing(false);
            setEditText(content);
        }
    }

    return (<div className={classnames(styles.messagewrapper, {[styles.messagefollowup]: isContinuation, [styles.messagediting]: isEditing})}>
        {isContinuation ? null : <ProfilePicture src={avatarUri} isMessage={!isEditing}/>}
        <span className={styles.message}>
            <span className={styles.usernameArea}>
                {isContinuation ? null : <><b>{username}</b>
                {isBot ? <BotTag name={botName} isDiscord={isDiscord} /> : ""}
                <TimeAgo className={styles.timestamp} date={timestamp} /></>}

                <span className={styles.interactions}>
                    {editFunction ? <Button disabled={isDeleting} onClick={() => setEditing(!isEditing)}>{isEditing ? "cancel" : "edit"}</Button> : null}
                    {editFunction && isEditing ? <Button onClick={() => checkEditKey({key: "Enter"})}>save</Button> : null}
                    {deleteFunction && !isEditing ? <Button disabled={isDeleting} onClick={() => {
                        setDeleting(true);
                        deleteFunction();
                    }}>delete</Button> : null}
                </span>
            </span>

            <span className={styles.messagecontent}>
                {isEditing ? <textarea autoFocus={true} value={editText} disabled={isSaving} onKeyDown={(e) => checkEditKey(e)} onChange={(e ) => setEditText(e.target.value)}/> : <>
                    {edited ? <div className={styles.edited}>edited</div> : null}

                    <Markdown components={{p: "span"}} remarkPlugins={[remarkGfm]} rehypePlugins={[[rehypeExternalLinks, {"target": "_blank", "rel": ["noreferrer", "noopener", "nofollow"]}]]}>
                        {settings["RICH_EMBEDS"] ? content.replaceAll(badLinks, "") : content}
                    </Markdown>

                    {settings["RICH_EMBEDS"] ? dedupe(linkify.find(content), "href").map(link => <RichEmbed key={link.href} url={link.href}/>) : null}
                    {attachments}
                    {game}
                </>}
            </span>
        </span>
    </div>)
}