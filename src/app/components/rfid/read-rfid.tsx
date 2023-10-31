"use client";

import React from "react";
import IconNfc from "../icon/nfc";

import "./rfid.scss";

export class RfidSerial {
  decoder = new TextDecoder();
  port?: SerialPort;
  rfidPattern = /^[0-9a-f]{40}$/m;
  readTimeoutSeconds = 5;

  constructor() {}
  async init(): Promise<void> {
    if ("serial" in navigator) {
      try {
        const ports = await navigator.serial.getPorts();
        if (ports.length == 0) {
          this.port = await navigator.serial.requestPort();
        } else {
          this.port = ports[0];
        }
        if (!this.port.readable) {
          await this.port.open({ baudRate: 9600 });
        }
      } catch (err) {
        console.error("There was an error opening the serial port:", err);
      }
    } else {
      console.error(
        "The Web serial API doesn't seem to be enabled in your browser."
      );
    }
  }

  async read(): Promise<string> {
    if (!this.port || !this.port.readable) {
      throw new Error("Reader not initialised");
    }
    if (this.port.readable.locked) {
      throw new Error("Reader locked");
    }
    let stringBuffer = "";
    const reader = this.port.readable.getReader();
    const timer = setTimeout(() => {
      reader.releaseLock();
    }, this.readTimeoutSeconds * 1000);

    while (this.port.readable) {
      try {
        const { value, done } = await reader.read();
        if (done) {
          throw new Error("No more data");
        }

        const decoded = this.decoder.decode(value);
        stringBuffer += decoded;
        const matches = stringBuffer.match(this.rfidPattern);

        if (matches) {
          reader.releaseLock();
          clearTimeout(timer);
          return matches[0].substring(0, 40);
        }
      } catch (error) {
        reader.releaseLock();
        clearTimeout(timer);
        throw error;
      }
    }
    throw new Error("No data");
  }
}

const RfidReader = ({ onChange }: { onChange: (value: string) => void }) => {
  const serial = new RfidSerial();
  const [rfid, setRfid] = React.useState("");
  async function scan(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    try {
      await serial.init();
      const rfid = await serial.read();
      setRfid(rfid);
      onChange(rfid);
    } catch (e) {
      console.log("caught error");
      console.log(e);
    }
  }

  return (
    <div className="d-flex">
      <button className="btn btn-outline-primary scan-button" onClick={scan}>
        <span>
          <IconNfc />
        </span>
        <span className="h3">Scan</span>
      </button>
      <input type="hidden" name="rfid" value={rfid} />
    </div>
  );
};

export default RfidReader;
