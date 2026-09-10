-- ABH only. Apply to project xyuxxunpmzlyqocberia.
-- No public API access: only the trusted server's service_role may use these objects.
begin;
create table if not exists public.abh_scans (
  checked_at timestamptz primary key,
  summary jsonb not null
);
create table if not exists public.abh_opportunities (
  opportunity_id text primary key,
  first_seen timestamptz not null,
  last_checked timestamptz not null,
  current_state jsonb not null,
  current_snapshot jsonb not null
);
create table if not exists public.abh_history (
  opportunity_id text not null references public.abh_opportunities(opportunity_id),
  checked_at timestamptz not null,
  state jsonb not null,
  snapshot jsonb not null,
  primary key (opportunity_id, checked_at)
);
alter table public.abh_scans enable row level security;
alter table public.abh_opportunities enable row level security;
alter table public.abh_history enable row level security;
revoke all on public.abh_scans, public.abh_opportunities, public.abh_history from public, anon, authenticated;
grant select, insert, update on public.abh_scans, public.abh_opportunities, public.abh_history to service_role;

create or replace function public.abh_record_scan(p_checked_at timestamptz, p_summary jsonb, p_items jsonb)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare
  item jsonb;
  old_row public.abh_opportunities%rowtype;
  item_id text;
  changed_count integer := 0;
begin
  if p_checked_at is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) > 500 then
    raise exception 'Invalid ABH scan';
  end if;
  -- Serialize writers so overlapping serverless scans cannot lose history.
  perform pg_advisory_xact_lock(72418201);
  if exists (select 1 from public.abh_scans where checked_at = p_checked_at) then
    return jsonb_build_object('persisted', true, 'duplicate', true, 'changes', 0);
  end if;
  for item in select value from jsonb_array_elements(p_items) loop
    item_id := item->'opportunity'->>'opportunityId';
    if item_id is null or item_id !~ '^ABH-GH-' or jsonb_typeof(item->'state') <> 'object' then
      raise exception 'Invalid ABH opportunity';
    end if;
    select * into old_row from public.abh_opportunities where opportunity_id = item_id;
    if not found then
      insert into public.abh_opportunities values (item_id, p_checked_at, p_checked_at, item->'state', item->'opportunity');
      insert into public.abh_history values (item_id, p_checked_at, item->'state', item->'opportunity');
      changed_count := changed_count + 1;
    elsif p_checked_at > old_row.last_checked then
      if old_row.current_state is distinct from item->'state' then
        insert into public.abh_history values (item_id, p_checked_at, item->'state', item->'opportunity');
        changed_count := changed_count + 1;
      end if;
      update public.abh_opportunities set last_checked = p_checked_at,
        current_state = item->'state', current_snapshot = item->'opportunity'
      where opportunity_id = item_id;
    else
      -- An older scan must never roll current availability or scores backward.
      update public.abh_opportunities set first_seen = least(first_seen, p_checked_at) where opportunity_id = item_id;
    end if;
  end loop;
  insert into public.abh_scans values (p_checked_at, p_summary);
  return jsonb_build_object('persisted', true, 'duplicate', false, 'changes', changed_count);
end;
$$;
revoke all on function public.abh_record_scan(timestamptz, jsonb, jsonb) from public, anon, authenticated;
grant execute on function public.abh_record_scan(timestamptz, jsonb, jsonb) to service_role;
commit;
