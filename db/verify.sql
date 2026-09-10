-- Transactional regression checks. No fixture data survives rollback.
begin;
do $$
declare
  items jsonb := '[{"opportunity":{"opportunityId":"ABH-GH-test-fixture-1"},"state":{"decision":"WATCH","claimStatus":"AVAILABLE"}}]'::jsonb;
  result jsonb;
begin
  if (select count(*) from pg_class c join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public' and c.relname in ('abh_scans','abh_opportunities','abh_history') and c.relrowsecurity) <> 3 then
    raise exception 'RLS missing';
  end if;
  if has_table_privilege('anon','public.abh_history','SELECT') or
     has_table_privilege('authenticated','public.abh_history','INSERT') or
     has_function_privilege('anon','public.abh_record_scan(timestamptz,jsonb,jsonb)','EXECUTE') then
    raise exception 'Unexpected public access';
  end if;
  result := public.abh_record_scan('2000-01-01', '{}'::jsonb, items);
  if (result->>'changes')::int <> 1 then raise exception 'Initial snapshot missing'; end if;
  result := public.abh_record_scan('2000-01-01', '{}'::jsonb, items);
  if not (result->>'duplicate')::boolean then raise exception 'Retry not idempotent'; end if;
  perform public.abh_record_scan('2000-01-02', '{}'::jsonb, items);
  if (select count(*) from public.abh_history where opportunity_id = 'ABH-GH-test-fixture-1') <> 1 then
    raise exception 'Unchanged state produced history noise';
  end if;
  items := jsonb_set(items, '{0,state,claimStatus}', '"ASSIGNED"'::jsonb);
  perform public.abh_record_scan('2000-01-03', '{}'::jsonb, items);
  if (select count(*) from public.abh_history where opportunity_id = 'ABH-GH-test-fixture-1') <> 2 then
    raise exception 'Assignment change lost';
  end if;
  items := jsonb_set(items, '{0,state,claimStatus}', '"AVAILABLE"'::jsonb);
  perform public.abh_record_scan('1999-12-31', '{}'::jsonb, items);
  if (select last_checked from public.abh_opportunities where opportunity_id = 'ABH-GH-test-fixture-1') <> '2000-01-03'::timestamptz then
    raise exception 'Older scan rolled state backward';
  end if;
end $$;
set local role service_role;
select public.abh_record_scan('2000-01-04', '{}'::jsonb, '[]'::jsonb);
rollback;
select 'PASS: RLS, access restrictions, retry deduplication, material changes; fixtures rolled back' as verification;
