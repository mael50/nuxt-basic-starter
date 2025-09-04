ALTER TABLE `users` MODIFY COLUMN `password_hash` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `google_id` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `name` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `avatar` varchar(500);--> statement-breakpoint
ALTER TABLE `users` ADD `provider` varchar(50) DEFAULT 'local' NOT NULL;