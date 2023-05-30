import React, { useState } from "react";
import { SNAP_ID } from "./config";

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
  const connectSnap = async (snapId: string = SNAP_ID, params: Record<"version" | string, unknown> = {}) => {
    const ethereum = getEthereum();
    if (ethereum) {
      return await ethereum.request({
        method: "wallet_requestSnaps",
        params: {
          [snapId]: params
        }
      });
    }
  };

  /**
   * Get the installed snaps in MetaMask.
   *
   * @returns The snaps installed in MetaMask.
   */
  const getSnaps: any = async () => {
    const ethereum = getEthereum();
    if (ethereum) {
      return await ethereum.request({
        method: "wallet_getSnaps"
      });
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

      return Object.values(snaps).find((snap: any) => snap.id === SNAP_ID && (!version || snap.version === version));
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
  const isFlask = async () => {
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

  return { connectSnap, getSnap, isFlask };
}

export default useKeychain;
