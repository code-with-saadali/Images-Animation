import "./globals.css";

export const metadata = {
  title: "Image Animation Component",
  description: "Aesthetic image cards animation",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
