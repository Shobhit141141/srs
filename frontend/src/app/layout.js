import CustomNavbar from "@/components/navbar";
import "./globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { Toaster } from "react-hot-toast";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    // <ApolloProvider>
    <html lang="en">
      <body className={`dark text-foreground bg-background`}>
        <AuthProvider>
          <Toaster position="bottom-right" />
          <CustomNavbar />

          {/* <ApolloProvider client={client}> */}
          <Theme appearance="dark">
            <NextUIProvider>{children}</NextUIProvider>
          </Theme>
          {/* </ApolloProvider> */}
        </AuthProvider>
      </body>
    </html>
    // </ApolloProvider>
  );
}
