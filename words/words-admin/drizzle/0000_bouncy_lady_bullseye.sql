CREATE TYPE "public"."user_role" AS ENUM('system', 'admin');--> statement-breakpoint
CREATE TABLE "admin-session" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin-session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "admin-users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" "user_role" DEFAULT 'admin' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin-users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "admin-session" ADD CONSTRAINT "admin-session_user_id_admin-users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."admin-users"("id") ON DELETE cascade ON UPDATE no action;