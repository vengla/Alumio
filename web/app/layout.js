import './globals.css';
import { Providers } from './providers';
import ChatBot from './components/ChatBot';

export const metadata = {
    title: 'ALUMIO — SRM Valliammai Alumni Platform',
    description: 'The official futuristic alumni platform of SRM Valliammai Engineering College. Connecting Alumni, Students, and Institute.',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
            </head>
            <body>
                <Providers>
                    {children}
                    <ChatBot />
                </Providers>
            </body>
        </html>
    );
}
