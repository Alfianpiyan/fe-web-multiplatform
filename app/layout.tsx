import "./globals.css";
import { AuthProvider } from "@/src/context/AuthContext";

import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}