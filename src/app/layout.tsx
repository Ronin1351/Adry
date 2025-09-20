'use client';

import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from '../store';
import { adryTheme } from '../theme/adryTheme';
import { NotificationProvider } from '../components/NotificationProvider';
import { AuthProvider } from '../components/AuthProvider';
import { AdryHeader } from '../components/Layout/AdryHeader';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Adry - Find Trusted Housekeepers in the Philippines</title>
        <meta name="description" content="Connect with verified housekeepers in the Philippines. Browse profiles, schedule interviews, and find the perfect household help." />
        <meta name="keywords" content="housekeeper, maid, domestic helper, Philippines, household help, cleaning, cooking, childcare" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Provider store={store}>
          <ThemeProvider theme={adryTheme}>
            <CssBaseline />
            <AuthProvider>
              <NotificationProvider>
                <AdryHeader />
                {children}
              </NotificationProvider>
            </AuthProvider>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}