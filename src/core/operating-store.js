import { readFileSync } from 'node:fs';
import { createOperation, transitionOperation, summarizeOperations } from './operations.js';

export function committedOperations() {
  return JSON.parse(readFileSync(new URL('../../docs/operations/state.json', import.meta.url), 'utf8'));
}
export function discoveryOperations(scan) {
  return (scan?.candidates ?? []).map(candidate => {
    const at = scan.fetchedAt;
    let row = createOperation({ opportunityId: candidate.opportunityId, title: candidate.title,
      source: 'GitHub', sourceUrl: candidate.canonicalIssueUrl || candidate.originalIssueUrl,
      reward: candidate.currentlyAvailableReward || candidate.canonicalIssueReward || null,
      provider: candidate.paymentProvider || candidate.paymentTrust?.provider || 'GitHub',
      competition: candidate.activeCompetitors ?? 'UNKNOWN', effort: candidate.effortEstimate || 'UNKNOWN',
      latestActivity: candidate.reason, admission: candidate.candidatePhase3Status
    }, { at, actor: 'scout' });
    const advance = (to, evidence = {}) => { row = transitionOperation(row, to, { at, actor:'qualifier', reason:candidate.reason || 'Practical evidence checked', evidence, expectedVersion:row.version }); };
    advance('INVESTIGATING');
    if (candidate.candidatePhase3Status === 'PHASE3_ELIGIBLE') advance('PHASE3_ELIGIBLE', { eligibility: {
      issueOpen:true, repositoryAccessible:true, credibleReward:true, scopeUnderstandable:true, competitionNotHopeless:true, noHardBlocker:true
    }, source: row.sourceUrl });
    // Only explicit hard reasons become terminal. Ambiguous legacy SKIP/REJECT stays investigate.
    const reasons = (candidate.rejectionReasons || []).join('; ');
    const code = /closed|completed|merged solution/i.test(reasons) ? 'CLOSED_COMPLETED' : /fake|scam/i.test(reasons) ? 'FAKE_SCAM' : /no (?:real )?(?:bounty|reward|task)/i.test(reasons) ? 'NO_REAL_TASK_OR_BOUNTY' : null;
    if (candidate.candidatePhase3Status !== 'PHASE3_ELIGIBLE' && code) advance('REJECTED', {rejection:{code,reference:row.sourceUrl}});
    return row;
  });
}
export function operatingView(scan, committed = committedOperations(), previousOperations = []) {
  const rows = new Map((scan?.operations || previousOperations).map(row => [row.opportunityId,row]));
  for (const discovered of discoveryOperations(scan)) {
    const existing = rows.get(discovered.opportunityId);
    if (!existing) { rows.set(discovered.opportunityId,discovered); continue; }
    // Discovery can refresh metadata or advance investigation, never reset execution.
    if (existing.status === 'PHASE3_ELIGIBLE' && discovered.status === 'REJECTED') {
      const event = discovered.transitions.at(-1);
      rows.set(existing.opportunityId,transitionOperation(existing,'REJECTED',{at:scan.fetchedAt,actor:'qualifier',reason:event.reason,evidence:event.evidence,expectedVersion:existing.version}));
    } else if (['DISCOVERED','INVESTIGATING'].includes(existing.status)) {
      let current = {...existing,latestActivity:discovered.latestActivity,competition:discovered.competition,effort:discovered.effort};
      for (const event of discovered.transitions.slice(1)) {
        if (current.status === event.to) continue;
        if (current.status === 'INVESTIGATING' && event.to === 'INVESTIGATING') continue;
        current = transitionOperation(current,event.to,{at:scan.fetchedAt,actor:event.actor,reason:event.reason,evidence:event.evidence,expectedVersion:current.version});
      }
      rows.set(current.opportunityId,current);
    }
  }
  for (const row of committed.operations) {
    const previous = rows.get(row.opportunityId);
    // Trusted committed execution is authoritative; never accept older versions.
    if (!previous || row.version >= previous.version) rows.set(row.opportunityId,row);
  }
  const operations = [...rows.values()];
  const summary = summarizeOperations(operations);
  return {operations,...summary,humanActions:[...summary.humanActions,...(committed.humanActions || [])],
    dailyLogs:committed.dailyLogs || [],workers:committed.workers || {},lastScan:scan?.fetchedAt ?? null,
    deploymentCommit:process.env.VERCEL_GIT_COMMIT_SHA || null};
}
export function dailyCycle(scan, view) {
  return { date:scan.fetchedAt.slice(0,10), checkedAt:scan.fetchedAt,
    newOpportunitiesDiscovered:scan.uniqueCount, candidatesInvestigated:scan.admissionAttempts?.length || 0,
    phase3Proofs:view.operations.filter(x=>x.evidence?.proof).map(x=>({opportunityId:x.opportunityId,...x.evidence.proof})),
    waitingMaintainer:view.counts.WAITING_FOR_MAINTAINER, activeSolves:view.counts.SOLVING,
    qa:view.counts.QA,readyToSubmit:view.counts.READY_TO_SUBMIT,submitted:view.counts.SUBMITTED,
    changesRequested:view.counts.CHANGES_REQUESTED,merged:view.counts.MERGED,paid:view.counts.PAID,
    humanActions:view.humanActions,lessons:scan.operationalMemory?.lessons || [],
    execution:'Scheduled agent workflow; no always-on solver process',
    sourceCommit:process.env.VERCEL_GIT_COMMIT_SHA || null };
}
