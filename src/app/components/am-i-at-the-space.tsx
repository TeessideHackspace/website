"use client";

import { PropsWithChildren, useEffect, useState } from "react";

export default function AmIAtTheSpace({ children }: PropsWithChildren<{}>) {
  const [atTheSpace, setAtTheSpace] = useState(false);

  async function check() {
    const result = await fetch("https://amiat.teessidehackspace.org.uk/");
    setAtTheSpace(result.ok);
  }
  useEffect(() => {
    check();
  }, []);
  return <div style={atTheSpace ? {} : { display: "none" }}>{children}</div>;
}
