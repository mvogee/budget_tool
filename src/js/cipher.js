const crypto = require("crypto");

const ALGORITHM = {
  BLOCK_CIPHER: 'aes-256-gcm',
  AUTH_TAG_BYTE_LEN: 16,
  IV_BYTE_LEN: 12,
  KEY_BYTE_LEN: 32,
  SALT_BYTE_LEN: 16
}

function getIV() {
  return (crypto.randomBytes(ALGORITHM.IV_BYTE_LEN));
}

module.exports = {


  getRandomKey() {
    return crypto.randomBytes(ALGORITHM.KEY_BYTE_LEN);
  },
  getSalt() {
    return crypto.randomBytes(ALGORITHM.SALT_BYTE_LEN);
  },
  /**
  * 
  * @param {Buffer} password - The password to be used for generating key
  * 
  * Clear the buffer after use to avoid password lingering in memory
  *
  */
  getKeyFromPassword (password, salt) {
    return (crypto.scryptSync(password, salt, ALGORITHM.KEY_BYTE_LEN));
  },

  /**
   * @param {Buffer} text - The text to be encrypted
   * @param {Buffer} key - The key to be used for encryption
   * 
   * Clear the buffer after use so key does not linger in memory
   */
  encrypt(text, key) {
    const iv = getIV();
    const cipher = crypto.createCipheriv(
      ALGORITHM.BLOCK_CIPHER, key, iv,
      { 'authTagLength' : ALGORITHM.AUTH_TAG_BYTE_LEN }
      );
      let encryptedMessage = cipher.update(text);
      encryptedMessage = Buffer.concat([encryptedMessage, cipher.final()]);
      return (Buffer.concat([iv, encryptedMessage, cipher.getAuthTag()]));
  },

  /**
   * 
   * @param {Buffer} ciphertext - Cipher text
   * @param {Buffer} key - The key to be used for decryption
   * clear the buffer after use.
   */
  decrypt(ciphertext, key) {
    const authTag = ciphertext.slice(-16);
    const iv = ciphertext.slice(0, 12);
    const encryptedMessage = ciphertext.slice(12, -16);
    const decipher = crypto.createDecipheriv(ALGORITHM.BLOCK_CIPHER, key, iv, {
       authTagLength: ALGORITHM.AUTH_TAG_BYTE_LEN 
      });
      decipher.setAuthTag(authTag);
      const messageText = decipher.update(encryptedMessage);
      return (Buffer.concat([messageText, decipher.final()]));
  }
};