CREATE TABLE `emailSequences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`description` text,
	`targetScoreMin` int NOT NULL DEFAULT 0,
	`targetScoreMax` int NOT NULL DEFAULT 100,
	`targetStatus` enum('new','contacted','qualified','converted','closed'),
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `emailSequences_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leadEmailLog` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leadId` int NOT NULL,
	`sequenceId` int,
	`sequenceEmailId` int,
	`subject` varchar(500) NOT NULL,
	`body` text NOT NULL,
	`sentAt` timestamp NOT NULL DEFAULT (now()),
	`status` enum('sent','failed','bounced') NOT NULL DEFAULT 'sent',
	`errorMessage` text,
	CONSTRAINT `leadEmailLog_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sequenceEmails` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sequenceId` int NOT NULL,
	`stepNumber` int NOT NULL,
	`delayDays` int NOT NULL,
	`subject` varchar(500) NOT NULL,
	`body` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sequenceEmails_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `leadEmailLog` ADD CONSTRAINT `leadEmailLog_leadId_leads_id_fk` FOREIGN KEY (`leadId`) REFERENCES `leads`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leadEmailLog` ADD CONSTRAINT `leadEmailLog_sequenceId_emailSequences_id_fk` FOREIGN KEY (`sequenceId`) REFERENCES `emailSequences`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leadEmailLog` ADD CONSTRAINT `leadEmailLog_sequenceEmailId_sequenceEmails_id_fk` FOREIGN KEY (`sequenceEmailId`) REFERENCES `sequenceEmails`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sequenceEmails` ADD CONSTRAINT `sequenceEmails_sequenceId_emailSequences_id_fk` FOREIGN KEY (`sequenceId`) REFERENCES `emailSequences`(`id`) ON DELETE cascade ON UPDATE no action;