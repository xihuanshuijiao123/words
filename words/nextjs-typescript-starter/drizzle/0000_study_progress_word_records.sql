CREATE TABLE "study_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"book_id" text NOT NULL,
	"word_id" text NOT NULL,
	"last_rank" integer DEFAULT 0 NOT NULL,
	"done_count" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'in_progress' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "study_progress_user_book_unique" UNIQUE("user_id","book_id")
);
--> statement-breakpoint
CREATE INDEX "study_progress_user_updated_idx" ON "study_progress" USING btree ("user_id","updated_at" DESC);--> statement-breakpoint
ALTER TABLE "study_progress" ADD CONSTRAINT "study_progress_user_id_admin-users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."admin-users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE TABLE "word_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"book_id" text NOT NULL,
	"word_id" text NOT NULL,
	"rank" integer NOT NULL,
	"mastery" text DEFAULT 'new' NOT NULL,
	"review_count" integer DEFAULT 0 NOT NULL,
	"last_review_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "word_records_user_word_unique" UNIQUE("user_id","word_id")
);
--> statement-breakpoint
CREATE INDEX "word_records_user_book_idx" ON "word_records" USING btree ("user_id","book_id");--> statement-breakpoint
ALTER TABLE "word_records" ADD CONSTRAINT "word_records_user_id_admin-users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."admin-users"("id") ON DELETE cascade ON UPDATE no action;
