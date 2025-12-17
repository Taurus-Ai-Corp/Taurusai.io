CREATE TABLE `consultations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`firstName` varchar(100) NOT NULL,
	`lastName` varchar(100) NOT NULL,
	`email` varchar(320) NOT NULL,
	`company` varchar(200) NOT NULL,
	`consultationType` enum('discovery','demo','technical','enterprise') NOT NULL,
	`date` varchar(50) NOT NULL,
	`time` varchar(50) NOT NULL,
	`message` text,
	`status` enum('scheduled','completed','cancelled','rescheduled') NOT NULL DEFAULT 'scheduled',
	`calendarEventId` varchar(500),
	`meetLink` varchar(500),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `consultations_id` PRIMARY KEY(`id`)
);
