import * as openpgp from 'openpgp';

export const encrypt = (password: string) => async (text: string)
  : Promise<string> => {
  const encrypted = await openpgp.encrypt({
    message: await openpgp.createMessage({ text, format: 'utf8' }),
    passwords: [password],
    format: 'binary',
  }) as Uint8Array; // the typedef is wrong

  return Buffer.from(encrypted).toString('base64');
};

export const decrypt = (password: string) => async (encryptedText: string)
  : Promise<string> => {
  const encryptedMessage = await openpgp.readMessage({
    binaryMessage: Buffer.from(encryptedText, 'base64'),
  });

  const { data: decrypted } = await openpgp.decrypt({
    message: encryptedMessage,
    passwords: [password],
    format: 'utf8',
  });

  return decrypted as string;
};
