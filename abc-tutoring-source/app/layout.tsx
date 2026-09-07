import type { Metadata } from 'next';
import './globals.css';
import PageTracking from '../components/page-tracking';
export const metadata:Metadata={title:'ABC Tutoring | A little support. A lot of possibility.',description:'Find a friendly K–12 tutor for math, science, or elementary reading. Choose your tutor and book an available session.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><PageTracking/>{children}</body></html>}
