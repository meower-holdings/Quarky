import SettingsSidebar from "../components/nav/SettingsSidebar.jsx";
import SettingsArea from "../components/nav/SettingsArea.jsx";
import styles from "./SettingsView.module.css"
import NiceModal, {useModal} from "@ebay/nice-modal-react";
import {useContext, useEffect, useRef, useState} from "react";
import classnames from "classnames";
import {AppContext} from "../contexts/AppContext.js";
import Modal from "react-modal";

export default NiceModal.create(() => {
    const modal = useModal();
    const [area, setArea] = useState("profile")
    const firstUpdate = useRef(true);
    let appContext = useContext(AppContext);

    useEffect(() => {
        if (firstUpdate.current) { firstUpdate.current = false; return; }

        new Audio(appContext.nyafile.getCachedData(`sfx/info-modal-pop-${modal.visible ? "in" : "out"}`)).play();
        if(!modal.visible) setTimeout(modal.remove, 200)
    }, [modal.visible]);

    return <Modal className={"lalalala"} style={{
        overlay: {
            backgroundColor: "unset"
        }
    }} appElement={document.querySelector("#root")} isOpen={modal.visible} closeTimeoutMS={200} shouldCloseOnOverlayClick={false} onRequestClose={() => modal.hide()}>
        <div className={classnames(styles.settingsPopout, {[styles.fadeIn]: modal.visible, [styles.fadeOut]: !modal.visible})}>
            <div className={styles.settingsSidebar}>
                <SettingsSidebar area={area} setArea={setArea}/>
            </div>
            <div className={styles.settingsAreaWrap}>
                <div className={styles.settingsArea}>
                    <SettingsArea area={area}/>
                </div>
                <button onClick={() => {modal.hide()}}>Close</button>
            </div>
        </div>
    </Modal>
})