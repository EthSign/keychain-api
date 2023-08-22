# ethsign-keychain-api

`ethsign-keychain-api` is a library for interacting with the EthSign Keychain MetaMask Snap.

## Installation
Run `npm i ethsign-keychain-api` or `yarn add ethsign-keychain-api`.

## Usage
```jsx
import useKeychain from "ethsign-keychain-api";

function ReactApp() {
  const {
    connectSnap,
    getSnap,
    getPassword,
    setPassword,
    removePassword,
    sync,
    setNeverSave,
    encrypt,
    decrypt,
    exportState,
    importState,
    getUrl,
    getUserRegistry
  } = useKeychain();
  ...
  return <>...</>;
}
```
`useKeychain()` will automatically call `connectSnap()` once. If the MetaMask popup is rejected, you will need to call `connectSnap()` again to use other EthSign Keychain functionality.

## Methods
### `connectSnap(params: Record<"version" | string, unknown> = {}): Promise<Response<any>>`
Prompts MetaMask to install the EthSign Keychain snap. Version can be a string corresponding to a version of the EthSign Keychain Snap. Left blank, it will install the latest version.

```jsx
...
const SNAP_VERSION: "0.2.6";
await connectSnap({ version: SNAP_VERSION });
...
```

### `getSnap(version: string): Promise<any>`
Looks for the EthSign Keychain snap in the installed list of snaps on the user's MetaMask installation. Returns undefined if it cannot be found, or it returns the snap information if it is installed.

```jsx
...
const SNAP_VERSION: "0.2.6";
await getSnap(SNAP_VERSION);
...
```

### `getPassword(url: string = getUrl()): Promise<Response<EthSignKeychainPasswordState>>`
Gets the password state for a given URL. `url` defaults to the current URL.
  
```jsx
...
const url = "https://ethsign.xyz";
await getPassword(url);
...
```

### `setPassword(username: string, password: string, url: string = getUrl(), controlled: boolean = true): Promise<Response<any>>`
Set/update the password state for a given URL, username, and password combination. Controlled marks that this credential is controlled by an API and not created by a user - this will help the user realize that some credential entries should not be manually touched.

```jsx
...
const url = "https://ethsign.xyz";
const username = "uname";
const password = "Password123";
const controlled = true;
await setPassword(username, password, url, controlled);
...
```

### `removePassword(url: string = getUrl(), username: string): Promise<Response<any>>`
Remove a password entry from a URL's state given its corresponding username. `url` defaults to the current URL.

```jsx
...
const url = "https://ethsign.xyz";
const username = "uname";
await removePassword(url, username);
...
```

### `sync(): Promise<Response<any>>`
Sync the local Snap's password state with remote Arweave state.

```jsx
...
await sync();
...
```

### `setNeverSave(url: string = getUrl(), neverSave: string): Promise<Response<any>>`
Set whether or not we should save passwords for a given url. `url` defaults to the current URL.

```jsx
...
const url = "https://ethsign.xyz";
const neverSave = false;
await setNeverSave(url, neverSave);
...
```

### `encrypt(data: string): Promise<Response<string>>`
Encrypt a string using a receiver's public key. Fails if receiver's public key cannot be located.

```jsx
...
const address = "0x985Eb8f653Ab087d4122F0C1dBc7972dF6B1642B";
const str = "Secret message.";
await encrypt(address, str);
...
```

### `decrypt(address: string, data: string): Promise<Response<string>>`
Decrypts a hex string using the current user's private key.

```jsx
...
const data = "04a487f5222b8423863b79424f28ddb324d825bd9d75cd7d5411ab925a53ba391e9512030a9168333bbade7038fa9411f2ac2b5e4f3b6d2109c1be5ef4a4175f4daad3c1556cb97bd2c7b62f77fd5bc0b628eb3d82ca68337520038bfba4ac7fe72dcf1497fea656757a58d0c2856d";
await decrypt(data);
...
```

### `exportState(): Promise<Response<string>>`
Export the password state from the current user's EthSignKeychainState stored locally. Requires user to enter a password for encryption.

```jsx
...
await exportState();
...
```

### `importState(data: string): Promise<Response<string>>`
Import a user's password state, which was encrypted and exported into a JSON object containing nonce and data strings.

```jsx
...
const state = {
  "success": true,
  "data": "{\"nonce\":\"M0Z4ILxRGNgdXqttekhThAvVXAYtQcRk\",\"data\":\"UyECrNKhnvzl6rBfrrgtkY8K+baBtSUqTT3kzTybxs6UHlgi8nYS3LArJAg+ZfFqEW/7dP+iEmL/TOiAEcNOkKlTBgdAquTg1F9cUaf6IWvZDLCq030j0OOBHIfQiolYDhm57fGgzxqpFXCRqAEMwvR+p4MnDdFAJE1ccXpbvxznofMqsAz0+n40sDz6SFZ6ro1kv5ZzEhkgUWyKblkHXo5fELPjNWXVxY2aBNAMVqqWoy2fFhNJHO60vHkZ18Ac3Y9hxIDLqX4NrSadRKlpwDE4wrve0D3any++vaxHf5froXZvut42V+Y0zX42n0FJPbNlY5/kuPgBM01Z5c/APzkcwjqzeHsQTk8ZOtWYL3+j6xMkFLOCZtjZX4psNFbIUwjwBjlE3MZCmCi1FXZkDaMFzFkk52XVYkz4o1KtoKa13CXA594oFS2i5OTBPrDspE3LHXwVkRdECBW7Q9QeInH6eJ+sIVgbc7ho8BZ3prPxq8Ub4K3XiC/XB7hWxaRe1uBuSiXtVOyX9PH1PJFbnKFhEL3t+eYCNS1W87qVRZvYyfFxQIf6TKN3a/jY9/OM6f8CYVfr7AvIvGxg1520hV5UVJwFwimrcJnEmJAqBRJAxZN/AI++0XqXFbo8lwueISqBy38deOiitX6Zi6cSY+5gDU2ONetOduX5O/8wo/Teu6dFyx9kQ2jDW1F/ceC19Chy0GnEIHdZTMGz3AiPRx5ltnPLNxBOjn+5Mnevo+/DmZqJOwIIqCoKTaUKatdaAE6QFKWvGbfcQvdUZyqfeEQpzsqmbl03rrH3RpSmCqJfMDSg7YmO6fq4sVFGjjQIPEhhplBTrzVWVvPHfDWIAdlrOETMFWS2zch/OD7uZJ9P2pZ0DAA0r2caqXz43cD7BOY=\"}"
};
await importState(JSON.stringify(state));
...
```

### `getUrl(): string`
Get the current window's base URL for storing passwords.

```jsx
...
getUrl();
...
```

### `getUserRegistry(address: string): Promise<Response<{publicAddress: string, publicKey: string}>>`
Get the public key of a user given the user's public address.

```jsx
...
const address = "0x985Eb8f653Ab087d4122F0C1dBc7972dF6B1642B";
await getUserRegistry(address);
...
```

### `getSyncTo(): Promise<string>`
Get the remote sync location from the keychain snap.

```jsx
...
await getSyncTo();
...
```

### `setSyncTo(): Promise<string>`
Set the remote sync location for the snap. Returns the newly set remote sync location, or the existing location if an exception occurs.

```jsx
...
const location = "arweave";
await setSyncTo(location);
...
```
