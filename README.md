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
    isFlask,
    getPassword,
    setPassword,
    removePassword,
    sync,
    setNeverSave,
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

### `isFlask(): Promise<boolean>`
Returns true if the current MetaMask installation is the Flask build. False otherwise.
  
```jsx
...
await isFlask();
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
