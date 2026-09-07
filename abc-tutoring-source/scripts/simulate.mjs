import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
const base=process.env.BASE_URL||'http://localhost:3000';
if(!/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(base))throw Error('This demonstration only runs against a local test database.');
const counts={};let accepted=0;const run=crypto.randomUUID();
async function post(path,body){return fetch(base+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});}
async function event(name,id,props={}){const r=await post('/api/telemetry',{event:name,distinctId:id,properties:{...props,simulation:true}});assert.equal(r.status,200,'PostHog event accepted: '+name);counts[name]=(counts[name]||0)+1;accepted++;}
for(const route of ['/','/tutors','/book?tutor=maya'])assert.equal((await fetch(base+route)).status,200);
for(let i=0;i<12;i++){
 const id='simulation-'+run+'-'+i;const tutor=['maya','daniel','emily'][i%3];const subject=tutor==='emily'?'Elementary reading':i%2?'Math':'Science';const props={tutor_id:tutor,subject};
 await event('page_viewed',id,{page:'/'});await event('subject_filtered',id,{subject});
 if(i>=8)continue;await event('tutor_profile_viewed',id,props);
 if(i>=6)continue;const attempt=crypto.randomUUID();props.attempt_id=attempt;await event('booking_started',id,props);
 const availability=await (await fetch(base+'/api/availability?tutor='+tutor)).json();assert.ok(availability.slots.length);const slot=availability.slots[0];await event('booking_slot_selected',id,props);await event('booking_details_started',id,props);
 if(i>=4){await event('booking_abandoned',id,{...props,step:'details'});continue;}
 const b={tutorId:tutor,subject,slot,attemptId:attempt,distinctId:id,simulation:true,parentName:'Demo Parent',email:'demo@example.com',studentName:'Demo Learner',grade:tutor==='emily'?3:7};
 const r=await post('/api/bookings',b);assert.equal(r.status,201);const saved=await r.json();assert.equal(saved.telemetry,'accepted');counts.booking_completed=(counts.booking_completed||0)+1;accepted++;
 const repeat=await post('/api/bookings',b);assert.equal(repeat.status,200,'Idempotent retry');
 const conflict=await post('/api/bookings',{...b,attemptId:crypto.randomUUID()});assert.equal(conflict.status,409,'Duplicate reservation blocked');
 const after=await (await fetch(base+'/api/availability?tutor='+tutor)).json();assert.ok(!after.slots.includes(slot),'Booked slot removed');
 const invalid=await post('/api/bookings',{...b,slot:after.slots[0],attemptId:crypto.randomUUID(),grade:99});assert.equal(invalid.status,400,'Invalid grade rejected');
}
const available=await (await fetch(base+'/api/availability?tutor=maya')).json();
const race={tutorId:'maya',slot:available.slots[0],subject:'Math',parentName:'Demo Parent',email:'demo@example.com',studentName:'Demo',grade:7,simulation:true,distinctId:'simulation-'+run+'-race'};
const results=await Promise.all([post('/api/bookings',{...race,attemptId:crypto.randomUUID()}),post('/api/bookings',{...race,attemptId:crypto.randomUUID()})]);assert.deepEqual(results.map(r=>r.status).sort(),[201,409]);const win=await results.find(r=>r.status===201).json();assert.equal(win.telemetry,'accepted');accepted++;
const bad=await post('/api/telemetry',{event:'arbitrary_event',distinctId:'demo'});assert.equal(bad.status,400);
const report={run,at:new Date().toISOString(),type:'HTTP journey simulation; not browser interaction testing',visitors:12,journeyEvents:counts,posthogAccepted:accepted,journeyConversion:'4 of 12 (33.3%); synthetic only',additionalConcurrencyTest:'1 extra booking_completed event',checks:['All three pages return HTTP 200','Confirmed booking removed from shared availability','Idempotent retry does not create a second booking','Duplicate slot rejected with HTTP 409','Invalid grade rejected with HTTP 400','Concurrent requests: exactly one accepted','Unknown telemetry event rejected','All tracked events accepted by PostHog ingestion'],limitations:['Ingestion acceptance is verified; dashboard visibility was not inspected','Local test reservations are not deployed','WebMCP browser context unavailable; tool not runtime-verified','Email and SMS previews only']};
console.log(JSON.stringify(report,null,2));if(process.env.REPORT_PATH)await writeFile(process.env.REPORT_PATH,JSON.stringify(report,null,2));
