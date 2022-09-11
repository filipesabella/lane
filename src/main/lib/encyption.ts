import * as openpgp from 'openpgp';

export async function encrypt(password: string, text: string): Promise<string> {
  const message = await openpgp.createMessage({ text });

  const encrypted = await openpgp.encrypt({
    message,
    passwords: [password],
    format: 'binary',
  }) as Uint8Array; // the typedef is wrong

  return encrypted.toString();
}

export async function decrypt(password: string, encyptedText: string)
  : Promise<string> {
  const deserializedBuffer = encyptedText.split(',');

  const newBuffer =
    Uint8Array.from(deserializedBuffer as any); // the typedef is wrong

  const encryptedMessage = await openpgp.readMessage({
    binaryMessage: newBuffer,
  });

  const { data: decrypted } = await openpgp.decrypt({
    message: encryptedMessage,
    passwords: [password],
    format: 'binary',
  });

  return String.fromCharCode.apply(null, decrypted);
}
