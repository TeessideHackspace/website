import "./globals.scss";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "./components/auth/session-provider";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Teesside Hackspace",
  description:
    "Teesside Hackspace is a non-profit group running a community-operated workshop in Middlesbrough where members can come together to share tools and knowledge.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <SessionProvider>
        <body className={inter.className}>
          <div className="container">{children}</div>
          <div className="footer text-center text-white bg-primary mt-5">
            <p>
              {`Found a bug? `}
              <Link
                className="link-light"
                href="https://github.com/teessidehackspace/website"
              >
                Raise an issue on GitHub!
              </Link>
            </p>
          </div>
        </body>
      </SessionProvider>
    </html>
  );
}
