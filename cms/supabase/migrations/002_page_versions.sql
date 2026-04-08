-- ============================================================
-- Page version history
-- A snapshot is saved on every explicit save/publish action.
-- Editors and admins can browse and restore any previous version.
-- ============================================================

create table page_versions (
  id       uuid primary key default gen_random_uuid(),
  page_id  uuid not null references pages(id) on delete cascade,
  title    text not null,
  content  jsonb,
  saved_by uuid references profiles(id) on delete set null,
  saved_at timestamptz not null default now()
);

-- Fast lookup: all versions for a page, newest first
create index page_versions_page_id_idx on page_versions(page_id, saved_at desc);

alter table page_versions enable row level security;

create policy "editors and admins can read page versions"
  on page_versions for select
  using (current_user_role() in ('admin', 'editor'));

create policy "editors and admins can insert page versions"
  on page_versions for insert
  with check (current_user_role() in ('admin', 'editor'));
