import { cookies } from "next/headers";

export const encrypt = (data: any) => {
  // Your encryption logic here
  // Used md5 to encrypt the input and return encrypted value back.
  const crypto = require("crypto");
  const hash = crypto.createHash("md5");
  const encryptedData = hash.update(data).digest("hex");
  return encryptedData;
};

export const decrypt = (data: any) => {
  // Your decryption logic here
  // Used md5 to decrypt the input and return decrypted value back.
  const crypto = require("crypto");
  const hash = crypto.createHash("md5");
  const decryptedData = hash.update(data).digest("hex");
  return decryptedData;
};
  
