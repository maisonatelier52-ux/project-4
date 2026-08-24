import Header from "@/components/header";
import Footer from "@/components/footer";
import "./globals.css";

export const metadata = {
  title: "NewsDesk",
  description: "Breaking news, analysis, and opinion.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}