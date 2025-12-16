CREATE TABLE `authors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(100) NOT NULL,
	`name` varchar(100) NOT NULL,
	`title` varchar(100) NOT NULL,
	`bio` text,
	`avatar` varchar(500),
	`linkedIn` varchar(255),
	`twitter` varchar(255),
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `authors_id` PRIMARY KEY(`id`),
	CONSTRAINT `authors_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `blogPosts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(200) NOT NULL,
	`title` varchar(255) NOT NULL,
	`excerpt` text NOT NULL,
	`content` text NOT NULL,
	`featuredImage` varchar(500),
	`authorId` int NOT NULL,
	`category` enum('thought-leadership','product-capabilities','customer-success','regulatory-compliance','industry-news') NOT NULL,
	`tags` json,
	`readTime` int NOT NULL DEFAULT 5,
	`isFeatured` boolean NOT NULL DEFAULT false,
	`isPublished` boolean NOT NULL DEFAULT false,
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `blogPosts_id` PRIMARY KEY(`id`),
	CONSTRAINT `blogPosts_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `caseStudies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(100) NOT NULL,
	`title` varchar(255) NOT NULL,
	`clientName` varchar(100) NOT NULL,
	`clientLogo` varchar(500),
	`industry` varchar(100) NOT NULL,
	`challenge` text NOT NULL,
	`solution` text NOT NULL,
	`results` text NOT NULL,
	`testimonial` text,
	`testimonialAuthor` varchar(100),
	`testimonialRole` varchar(100),
	`metrics` json NOT NULL,
	`productsUsed` json NOT NULL,
	`implementationTime` varchar(50),
	`featuredImage` varchar(500),
	`isFeatured` boolean NOT NULL DEFAULT false,
	`isPublished` boolean NOT NULL DEFAULT true,
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `caseStudies_id` PRIMARY KEY(`id`),
	CONSTRAINT `caseStudies_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `downloadableAssets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(100) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`category` enum('annual-report','quarterly-report','media-kit','pitch-deck','whitepaper','press-release','fact-sheet') NOT NULL,
	`fileUrl` varchar(500) NOT NULL,
	`fileSize` varchar(50),
	`fileType` varchar(20) NOT NULL,
	`thumbnailUrl` varchar(500),
	`downloadCount` int NOT NULL DEFAULT 0,
	`isPublished` boolean NOT NULL DEFAULT true,
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `downloadableAssets_id` PRIMARY KEY(`id`),
	CONSTRAINT `downloadableAssets_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`firstName` varchar(100) NOT NULL,
	`lastName` varchar(100) NOT NULL,
	`email` varchar(320) NOT NULL,
	`company` varchar(200) NOT NULL,
	`jobTitle` varchar(100),
	`phone` varchar(50),
	`country` varchar(100),
	`companySize` varchar(50),
	`industry` varchar(100),
	`message` text,
	`leadType` enum('demo-request','contact','newsletter','whitepaper') NOT NULL,
	`source` varchar(100),
	`productsInterested` json,
	`status` enum('new','contacted','qualified','converted','closed') NOT NULL DEFAULT 'new',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pressReleases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(200) NOT NULL,
	`title` varchar(255) NOT NULL,
	`excerpt` text NOT NULL,
	`content` text NOT NULL,
	`category` enum('press-release','news','award','partnership') NOT NULL,
	`featuredImage` varchar(500),
	`externalUrl` varchar(500),
	`isPublished` boolean NOT NULL DEFAULT true,
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pressReleases_id` PRIMARY KEY(`id`),
	CONSTRAINT `pressReleases_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(100) NOT NULL,
	`name` varchar(100) NOT NULL,
	`tagline` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`icon` varchar(50) NOT NULL,
	`color` varchar(50) NOT NULL,
	`features` json NOT NULL,
	`useCases` json NOT NULL,
	`financialImpact` json NOT NULL,
	`differentiators` json NOT NULL,
	`order` int NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`quote` text NOT NULL,
	`authorName` varchar(100) NOT NULL,
	`authorTitle` varchar(100) NOT NULL,
	`companyName` varchar(100) NOT NULL,
	`companyLogo` varchar(500),
	`rating` int DEFAULT 5,
	`isFeatured` boolean NOT NULL DEFAULT false,
	`isPublished` boolean NOT NULL DEFAULT true,
	`order` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `testimonials_id` PRIMARY KEY(`id`)
);
