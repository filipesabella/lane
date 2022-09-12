import * as openpgp from 'openpgp';

export const encrypt = (password: string) => async (text: string)
  : Promise<string> => {
  const encrypted = await openpgp.encrypt({
    message: await openpgp.createMessage({ text }),
    passwords: [password],
    format: 'binary',
  }) as Uint8Array; // the typedef is wrong

  return encrypted.toString();
};

export const decrypt = (password: string) => async (encyptedText: string)
  : Promise<string> => {
  const deserializedBuffer = encyptedText.split(',');

  const encryptedMessage = await openpgp.readMessage({
    binaryMessage: Uint8Array.from(deserializedBuffer as any),
  });

  const { data: decrypted } = await openpgp.decrypt({
    message: encryptedMessage,
    passwords: [password],
    format: 'binary',
  });

  return String.fromCharCode.apply(null, decrypted);
};
