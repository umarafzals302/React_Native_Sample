import { useRef, useState } from "react";
import NfcManager, { NfcEvents } from "react-native-nfc-manager";

export const useNDEF = () => {
  const hasActiveSessionRef = useRef(false); // <-- [CHECK HERE] to track whether we have active NFC session
  const [initializedNFC, setInitializedNFC] = useState(false);
  const cleanUp = () => {
    console.log("cleanedup");
    NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
    NfcManager.setEventListener(NfcEvents.SessionClosed, null);
  };
  const readNFC = async () => {
    if (hasActiveSessionRef.current) {
      NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
      NfcManager.setEventListener(NfcEvents.SessionClosed, null);
      // <-- [CHECK HERE] check whether there's any existing session
      return;
    }

    NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag) => {
      console.log(tag);
      NfcManager.setAlertMessageIOS("NDEF tag found");
      NfcManager.unregisterTagEvent().catch(() => 0);
      //   const decode = Ndef.uri.decodePayload(tag.ndefMessage[0].payload);
    });
    NfcManager.setEventListener(NfcEvents.SessionClosed, () => {
      hasActiveSessionRef.current = false; // <-- [CHECK HERE] set active NFC session to false
      cleanUp();
    });
    await NfcManager.registerTagEvent();
    hasActiveSessionRef.current = true; // <-- [CHECK HERE] set active NFC session to true
  };
  const initNFC = async () => {
    try {
      await NfcManager.start();
    } catch (e) {
      console.log("ERROR", e);
    } finally {
      setInitializedNFC(true);
    }
  };
  return { initNFC, readNFC, initializedNFC };
};

export default useNDEF;
