import "./globals.css";

export const metadata = {
  title: "Learningbank - Initiatives",
  description: "Workforce readiness analytics platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
