import CryptoJS from "crypto-js";


const decryptMessage = (encryptedMessage: any)=>{

    const key = CryptoJS.enc.Utf8.parse(process.env.CRYPTO_KEY!);
    const iv = CryptoJS.enc.Utf8.parse(process.env.CRYPTO_IV!);

    const decryptedBytes  = CryptoJS.AES.decrypt(encryptedMessage.content, key, {
        iv: iv,
        mode: CryptoJS.mode.CFB,
        padding: CryptoJS.pad.Pkcs7,
    });

    const decryptedMessage = decryptedBytes.toString(CryptoJS.enc.Utf8);

    const decryptedMessageObject = {
        _id: encryptedMessage._id,
        sender: encryptedMessage.sender,
        content: decryptedMessage,
        chat: encryptedMessage.chat,
    }
    
    return decryptedMessageObject;
}

export default decryptMessage;