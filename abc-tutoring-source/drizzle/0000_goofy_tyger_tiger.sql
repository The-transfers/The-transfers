CREATE TABLE `bookings` (
	`id` text PRIMARY KEY NOT NULL,
	`tutor_id` text NOT NULL,
	`slot` text NOT NULL,
	`parent_name` text NOT NULL,
	`email` text NOT NULL,
	`student_name` text NOT NULL,
	`grade` integer NOT NULL,
	`subject` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_bookings_tutor_slot` ON `bookings` (`tutor_id`,`slot`);