'use client';
import {useEffect} from 'react';import {usePathname} from 'next/navigation';import {track} from '../lib/analytics';
export default function PageTracking(){const path=usePathname();useEffect(()=>{track('page_viewed',{page:path});},[path]);return null;}
