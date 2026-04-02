-- ============================================================
-- Burgt CMS — initial schema
-- Run via: npm run setup
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ============================================================
-- ENUMS
-- ============================================================
create type user_role as enum ('admin', 'editor', 'viewer');
create type account_status as enum ('active', 'inactive', 'suspended');
create type page_status as enum ('published', 'draft', 'archived');
create type post_status as enum ('published', 'draft', 'scheduled', 'archived');
create type media_type as enum ('image', 'video', 'document', 'other');

-- ============================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================
create table profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  display_name  text not null default '',
  role          user_role not null default 'viewer',
  status        account_status not null default 'active',
  avatar_url    text,
  created_at    timestamptz not null default now(),
  last_active   timestamptz
);

-- Auto-create profile when a user signs up
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', new.email));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ============================================================
-- PAGES
-- ============================================================
create table pages (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  slug        text not null unique,
  status      page_status not null default 'draft',
  content     jsonb,                    -- flexible content blocks
  meta_title  text,
  meta_desc   text,
  author_id   uuid references profiles(id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  published_at timestamptz
);

-- ============================================================
-- BLOG POSTS
-- ============================================================
create table blog_posts (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  slug         text not null unique,
  excerpt      text,
  content      jsonb,
  status       post_status not null default 'draft',
  featured_image text,
  tags         text[] default '{}',
  meta_title   text,
  meta_desc    text,
  author_id    uuid references profiles(id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  published_at timestamptz,
  scheduled_at timestamptz
);

-- ============================================================
-- MEDIA
-- ============================================================
create table media (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  file_path   text not null,            -- Supabase Storage path
  public_url  text not null,
  mime_type   text not null,
  size_bytes  bigint not null default 0,
  media_type  media_type not null default 'other',
  alt_text    text,
  uploaded_by uuid references profiles(id) on delete set null,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- FORM SUBMISSIONS
-- ============================================================
create table form_submissions (
  id          uuid primary key default gen_random_uuid(),
  form_name   text not null,
  data        jsonb not null default '{}',
  is_read     boolean not null default false,
  ip_address  text,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- ACTIVITY LOG
-- ============================================================
create table activity_log (
  id          uuid primary key default gen_random_uuid(),
  actor_id    uuid references profiles(id) on delete set null,
  actor_name  text,                     -- denormalized for display after deletion
  action      text not null,            -- e.g. 'page.published', 'user.created'
  target_type text,                     -- e.g. 'page', 'blog_post', 'user'
  target_id   uuid,
  target_label text,                    -- human-readable label at time of action
  metadata    jsonb default '{}',
  created_at  timestamptz not null default now()
);

-- ============================================================
-- SEO SETTINGS (one row, upserted)
-- ============================================================
create table seo_settings (
  id                  uuid primary key default gen_random_uuid(),
  site_title          text,
  site_description    text,
  og_image            text,
  robots_txt          text,
  google_analytics_id text,
  updated_at          timestamptz not null default now()
);

-- Insert default row
insert into seo_settings (site_title) values ('My Website');

-- ============================================================
-- UPDATED_AT triggers
-- ============================================================
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger pages_updated_at
  before update on pages
  for each row execute procedure set_updated_at();

create trigger blog_posts_updated_at
  before update on blog_posts
  for each row execute procedure set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Helper: get current user's role
create or replace function current_user_role()
returns user_role language sql security definer stable as $$
  select role from profiles where id = auth.uid()
$$;

-- PROFILES
alter table profiles enable row level security;
create policy "users can read all profiles"
  on profiles for select using (auth.role() = 'authenticated');
create policy "users can update own profile"
  on profiles for update using (id = auth.uid());
create policy "admins can update any profile"
  on profiles for update using (current_user_role() = 'admin');

-- PAGES
alter table pages enable row level security;
create policy "authenticated users can read pages"
  on pages for select using (auth.role() = 'authenticated');
create policy "editors and admins can insert pages"
  on pages for insert with check (current_user_role() in ('admin', 'editor'));
create policy "editors and admins can update pages"
  on pages for update using (current_user_role() in ('admin', 'editor'));
create policy "admins can delete pages"
  on pages for delete using (current_user_role() = 'admin');

-- BLOG POSTS
alter table blog_posts enable row level security;
create policy "authenticated users can read posts"
  on blog_posts for select using (auth.role() = 'authenticated');
create policy "editors and admins can insert posts"
  on blog_posts for insert with check (current_user_role() in ('admin', 'editor'));
create policy "editors and admins can update posts"
  on blog_posts for update using (current_user_role() in ('admin', 'editor'));
create policy "admins can delete posts"
  on blog_posts for delete using (current_user_role() = 'admin');

-- MEDIA
alter table media enable row level security;
create policy "authenticated users can read media"
  on media for select using (auth.role() = 'authenticated');
create policy "editors and admins can upload media"
  on media for insert with check (current_user_role() in ('admin', 'editor'));
create policy "admins can delete media"
  on media for delete using (current_user_role() = 'admin');

-- FORM SUBMISSIONS
alter table form_submissions enable row level security;
create policy "admins and editors can read submissions"
  on form_submissions for select using (current_user_role() in ('admin', 'editor'));
create policy "public can insert form submissions"
  on form_submissions for insert with check (true);

-- ACTIVITY LOG
alter table activity_log enable row level security;
create policy "authenticated users can read activity"
  on activity_log for select using (auth.role() = 'authenticated');
create policy "authenticated users can insert activity"
  on activity_log for insert with check (auth.role() = 'authenticated');

-- SEO SETTINGS
alter table seo_settings enable row level security;
create policy "authenticated users can read seo"
  on seo_settings for select using (auth.role() = 'authenticated');
create policy "admins can update seo"
  on seo_settings for update using (current_user_role() = 'admin');
