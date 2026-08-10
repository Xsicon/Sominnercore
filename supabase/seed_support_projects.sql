-- Seed Support Hub projects into sominnercore.softwares
-- softwares.id is uuid (DB-generated). Support tenant id is recorded in full_description.
-- Safe to re-run: skips rows that already exist by name.

insert into sominnercore.softwares (
  id, name, short_description, full_description, version, status, category,
  icon_color, active_users, total_downloads, visibility, created_at, updated_at
)
select
  gen_random_uuid(),
  v.name,
  v.short_description,
  v.full_description,
  v.version,
  v.status,
  v.category,
  v.icon_color,
  0,
  0,
  v.visibility,
  now(),
  now()
from (
  values
    (
      'MuuqWear',
      'Fashion ecommerce storefront with live chat, tickets, and help center.',
      'MuuqWear customer-facing shop. Support desk tenant id: muuqwear.',
      '1.0.0',
      'active',
      'Support Project',
      '#14b8a6',
      'public'
    ),
    (
      'Salguri',
      'Salguri storefront — Support Hub project desk.',
      'Salguri customer support desk. Support desk tenant id: salguri.',
      '1.0.0',
      'active',
      'Support Project',
      '#f97316',
      'public'
    ),
    (
      'GaarX',
      'GaarX storefront — Support Hub project desk.',
      'GaarX customer support desk. Support desk tenant id: gaarx.',
      '1.0.0',
      'active',
      'Support Project',
      '#a855f7',
      'public'
    )
) as v(name, short_description, full_description, version, status, category, icon_color, visibility)
where not exists (
  select 1
  from sominnercore.softwares s
  where lower(s.name) = lower(v.name)
);
