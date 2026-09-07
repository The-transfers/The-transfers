# ABC Tutoring prototype

Home, subject-filtered tutor directory, tutor profiles, and simple two-step bookings. Fictional sample profiles and stock photography; USD rates and one-hour sessions are prototype assumptions. Grades and subjects are validated on the server. D1 has a unique tutor/slot index, atomic reservation insertion, and idempotent request IDs.

## PostHog

Events are forwarded from `/api/telemetry` to PostHog US ingestion. `booking_completed` is emitted only after server persistence, not on button clicks. Only allowed event names/properties are forwarded; parent/student names, email, and form contents are never included. No autocapture, session replay, or identified person profiles. Anonymous visitor identity is session-scoped. Project ingestion token is not a personal API key.

Events: page_viewed, subject_filtered, tutor_profile_viewed, booking_started, booking_slot_selected, booking_details_started, booking_abandoned, booking_failed, booking_completed.

In PostHog create a funnel: page_viewed → tutor_profile_viewed → booking_started → booking_completed. Break down subject_filtered by subject and tutor_profile_viewed by tutor_id. Filter `simulation = false` for human visits; use `simulation = true` to inspect demo traffic. Abandonment events are best effort; use the funnel for reliable missing-conversion analysis. All events use environment=prototype and app=abc_tutoring.

Docs: https://posthog.com/docs/api/capture

## Demo and verification

`pnpm dev`; generate migrations with `pnpm db:generate`. Apply the generated migration to the local D1 binding before exercising booking. `node scripts/simulate.mjs` uses localhost only and reserves local sample slots while forwarding clearly marked synthetic events to PostHog. It verifies availability, retries, validation, duplicate bookings, and a concurrent reservation race. Synthetic conversions are demonstration data, not business results.

Email/SMS delivery is a visible preview only. No payment processing. Replace sample tutors, rates, schedule, and images before customer launch; connect an email/SMS provider and real session logistics. Site is privately published. A minimal filter_tutors WebMCP tool shares the directory's filter action; no supported browser validation context was available, so its registration and execution have not been verified.

## Image credits

Maya: nappy, https://www.pexels.com/photo/portrait-photo-of-woman-smiling-2362887/
Emily: Mikhail Nilov, https://www.pexels.com/photo/portrait-of-a-smiling-woman-7780946/
Daniel: Olawale Munna, https://unsplash.com/photos/a-man-in-a-suit-and-glasses-posing-for-a-picture-qpyR0WKV_Cs
Study: Thirdman, https://www.pexels.com/photo/a-teacher-tutoring-her-student-6503157/
