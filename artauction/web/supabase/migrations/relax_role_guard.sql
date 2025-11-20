-- Relax role-change guard so admins can update via SQL Editor
create or replace function public.is_service_role()
returns boolean
language plpgsql
stable
as $$
begin
  return coalesce(current_setting('request.jwt.claim.role', true), '') = 'service_role'
      or current_user in ('postgres', 'supabase_admin');
end;
$$;
create or replace function public.protect_role_update()
returns trigger language plpgsql as $$
begin
  if new.role is distinct from old.role
     and auth.uid() is not null
     and not public.is_service_role() then
    raise exception 'Changing role is not allowed' using errcode = '42501';
  end if;
  return new;
end $$;

