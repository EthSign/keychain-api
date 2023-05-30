import React, { useState } from "react";
import { SNAP_ID } from "./config";

type EthSignKeychainBase = {
  address?: string;
  timestamp: number;
};

type EthSignKeychainEntry = {
  url: string;
  username: string;
  password: string;
  controlled: string | null;
} & EthSignKeychainBase;

type EthSignKeychainPasswordState = {
  timestamp: number;
  neverSave: boolean;
  logins: EthSignKeychainEntry[];
};

type Response<T> = {
  success: boolean;
  data?: T;
  message?: any;
};

function useKeychain() {
  const [initialSync, handleInitialSync] = useState(false);

  const getEthereum = () => {
    // @ts-ignore
    return window?.ethereum ?? undefined;
  };

  /**
   * Connect a snap to MetaMask.
   *
   * @param snapId - The ID of the snap.
   * @param params - The params to pass with the snap to connect.
   */
  const connectSnap = async (
    snapId: string = SNAP_ID,
    params: Record<"version" | string, unknown> = {}
  ): Promise<Response<any>> => {
    const ethereum = getEthereum();
    if (ethereum) {
      return new Promise((resolve) => {
        ethereum
          .request({
            method: "wallet_requestSnaps",
            params: {
              [snapId]: params
            }
          })
          .then((res: any) => resolve({ success: true, data: res }))
          .catch((err: any) => resolve({ success: false, message: err.message ? err.message : err }));
      });
    } else {
      return { success: false, message: "MetaMask not detected." };
    }
  };

  /**
   * Get the installed snaps in MetaMask.
   *
   * @returns The snaps installed in MetaMask.
   */
  const getSnaps: any = async (): Promise<Response<any>> => {
    const ethereum = getEthereum();
    if (ethereum) {
      return new Promise((resolve) => {
        ethereum
          .request({
            method: "wallet_getSnaps"
          })
          .then((res: any) => resolve({ success: true, data: res }))
          .catch((err: any) => resolve({ success: false, message: err.message ? err.message : err }));
      });
    } else {
      return { success: false, message: "MetaMask not detected." };
    }
  };

  /**
   * Get the snap from MetaMask.
   *
   * @param version - The version of the snap to install (optional).
   * @returns The snap object returned by the extension.
   */
  const getSnap = async (version: string) => {
    try {
      const snaps = await getSnaps();
      if (!snaps.success) {
        return undefined;
      }

      return Object.values(snaps.data).find(
        (snap: any) => snap.id === SNAP_ID && (!version || snap.version === version)
      );
    } catch (e) {
      console.log("Failed to obtain installed snap", e);
      return undefined;
    }
  };

  /**
   * Detect if the wallet injecting the ethereum object is Flask.
   *
   * @returns True if the MetaMask version is Flask, false otherwise.
   */
  const isFlask = async (): Promise<boolean> => {
    const ethereum = getEthereum();
    try {
      const clientVersion = await ethereum?.request({
        method: "web3_clientVersion"
      });

      // @ts-ignore
      const isFlaskDetected = clientVersion?.includes("flask");

      return Boolean(ethereum && isFlaskDetected);
    } catch {
      return false;
    }
  };

  /**
   * Gets the password state for a given URL.
   * @param {*} url The URL to get the password state for.
   * @returns
   */
  const getPassword = async (url: string = getUrl()): Promise<Response<EthSignKeychainPasswordState>> => {
    const ethereum = getEthereum();
    if (ethereum) {
      if (!initialSync) {
        const success = await sync();
        if (success) {
          handleInitialSync(true);
        }
      }
      return new Promise((resolve) => {
        ethereum
          .request({
            method: "wallet_invokeSnap",
            params: {
              snapId: SNAP_ID,
              request: { method: "get_password", params: { website: url } }
            }
          })
          .then((res: any) => resolve({ success: true, data: res }))
          .catch((err: any) => resolve({ success: false, message: err.message ? err.message : err }));
      });
    } else {
      return { success: false, message: "MetaMask not detected." };
    }
  };

  /**
   * Update the password state for a given URL, username, and password combination.
   * @param {*} username The username to set a password for.
   * @param {*} password The password to set.
   * @param {*} url The URL to set a password for.
   * @param {*} controlled Marks that this credential is controlled by an API and not created by a user.
   * @returns
   */
  const setPassword = async (
    username: string,
    password: string,
    url: string = getUrl(),
    controlled: boolean = true
  ): Promise<Response<any>> => {
    const ethereum = getEthereum();
    if (ethereum) {
      return new Promise((resolve) => {
        ethereum
          .request({
            method: "wallet_invokeSnap",
            params: {
              snapId: SNAP_ID,
              request: {
                method: "set_password",
                params: { website: url, username: username, password: password, controlled: controlled }
              }
            }
          })
          .then((res: any) => resolve({ success: true, data: res }))
          .catch((err: any) => resolve({ success: false, message: err.message ? err.message : err }));
      });
    } else {
      return { success: false, message: "MetaMask not detected." };
    }
  };

  /**
   * Remove a password entry from a URL's state given its corresponding username.
   * @param {*} url The URL to remove a password from.
   * @param {*} username The username to remove a password for.
   * @returns
   */
  const removePassword = async (url: string = getUrl(), username: string): Promise<Response<any>> => {
    const ethereum = getEthereum();
    if (ethereum) {
      return new Promise((resolve) => {
        ethereum
          .request({
            method: "wallet_invokeSnap",
            params: {
              snapId: SNAP_ID,
              request: {
                method: "remove_password",
                params: { website: url, username: username }
              }
            }
          })
          .then((res: any) => resolve({ success: true, data: res }))
          .catch((err: any) => resolve({ success: false, message: err.message ? err.message : err }));
      });
    } else {
      return { success: false, message: "MetaMask not detected." };
    }
  };

  /**
   * Sync local password state with remote Arweave state.
   * @returns
   */
  const sync = async (): Promise<Response<any>> => {
    const ethereum = getEthereum();
    if (ethereum) {
      return new Promise((resolve) => {
        ethereum
          .request({
            method: "wallet_invokeSnap",
            params: {
              snapId: SNAP_ID,
              request: {
                method: "sync"
              }
            }
          })
          .then((res: any) => resolve({ success: true, data: res }))
          .catch((err: any) => resolve({ success: false, message: err.message ? err.message : err }));
      });
    } else {
      return { success: false, message: "MetaMask not detected." };
    }
  };

  /**
   * Set whether or not we should save passwords for a given url.
   * @param {*} url URL for state we are trying to update.
   * @param {*} neverSave Boolean value for whether or not we should save the password state.
   * @returns
   */
  const setNeverSave = async (url: string = getUrl(), neverSave: string): Promise<Response<any>> => {
    const ethereum = getEthereum();
    if (ethereum) {
      return new Promise((resolve) => {
        ethereum
          .request({
            method: "wallet_invokeSnap",
            params: {
              snapId: SNAP_ID,
              request: {
                method: "set_neversave",
                params: { website: url, neverSave: neverSave }
              }
            }
          })
          .then((res: any) => resolve({ success: true, data: res }))
          .catch((err: any) => resolve({ success: false, message: err.message ? err.message : err }));
      });
    } else {
      return { success: false, message: "MetaMask not detected." };
    }
  };

  function getBaseUrl(url: string = getUrl()) {
    let baseUrl = url.toString().slice(0, url.toString().indexOf("?") ?? url.toString().length);
    // Remove trailing slash in url
    if (baseUrl.at(url.length - 1) === "/") {
      baseUrl = baseUrl.substring(0, baseUrl.length - 1);
    }

    return baseUrl;
  }

  /**
   * Get the current window's base URL for storing passwords.
   * @returns
   */
  function getUrl() {
    return getBaseUrl(window?.location?.href ?? "");
  }

  return { connectSnap, getSnap, isFlask, getPassword, setPassword, removePassword, sync, setNeverSave, getUrl };
}

export default useKeychain;
