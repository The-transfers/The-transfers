'use client';
export function visitorId(){let id=sessionStorage.getItem('abc-visitor');if(!id){id=crypto.randomUUID();sessionStorage.setItem('abc-visitor',id);}return id;}
export function track(event:string,properties:Record<string,unknown>={}){try{const body=JSON.stringify({event,distinctId:visitorId(),properties});if(navigator.sendBeacon)navigator.sendBeacon('/api/telemetry',new Blob([body],{type:'application/json'}));else void fetch('/api/telemetry',{method:'POST',headers:{'Content-Type':'application/json'},body,keepalive:true}).catch(()=>{});}catch{}}
