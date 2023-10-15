"use client";

import { FacebookProvider, Page } from "react-facebook";

export default function FacebookFeed() {
  return (
    <FacebookProvider appId="340962463161455">
      <Page
        href="https://www.facebook.com/teessidehackspace/"
        tabs="timeline"
      />
    </FacebookProvider>
  );
}
