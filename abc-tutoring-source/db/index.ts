import {env} from 'cloudflare:workers';
export function getDb(){if(!env.DB)throw new Error('Booking database unavailable');return env.DB;}
