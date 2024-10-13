"use client";
import React, { useRef } from "react";
import html2canvas from "html2canvas";
import IconPrint from "../icon/print";

import "./label-printer.scss";

export default function LabelPrinter(props: { children: React.ReactNode }) {
  const printerBaseUrl = "http://labelprinter.local:5000";
  const ref = useRef<HTMLDivElement>(null);

  async function print() {
    if (ref.current === null) return;
    const canvas = await html2canvas(ref.current, {
      backgroundColor: null,
      useCORS: true, // in case you have images stored in your application
    });
    canvas.toBlob((blob) => {
      const formData = new FormData();
      formData.append("file", blob!, "label.png");
      fetch(`${printerBaseUrl}/print`, {
        method: "POST",
        body: formData,
      });
    });
  }

  return (
    <div className="d-flex">
      <div ref={ref}>
        <div
          style={{
            position: "relative",
            width: 890,
            height: 410,
            border: "10px solid black",
          }}
          className="d-flex flex-column"
        >
          {props.children}
        </div>
      </div>

      <button
        className="btn btn-outline-primary print-button m-4 px-4"
        onClick={print}
      >
        <span>
          <IconPrint />
        </span>
        <span className="h3">Print</span>
      </button>
    </div>
  );
}
