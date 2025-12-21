ALTER TABLE `leadEmailLog` ADD `abTestVariant` enum('control','variant');--> statement-breakpoint
ALTER TABLE `sequenceEmails` ADD `variantSubject` varchar(500);--> statement-breakpoint
ALTER TABLE `sequenceEmails` ADD `variantBody` text;--> statement-breakpoint
ALTER TABLE `sequenceEmails` ADD `abTestEnabled` boolean DEFAULT false NOT NULL;