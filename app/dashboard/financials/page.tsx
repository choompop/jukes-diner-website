export const dynamic = 'force-dynamic';

import {
  AlertTriangle,
  ArrowUpRight,
  Banknote,
  ClipboardCheck,
  Download,
  FileArchive,
  Gauge,
  ReceiptText,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

import {
  readFinancialManagement,
  getFinancialManagementStats,
  getFinancialScorecard,
  getFinancialVisibilitySections,
  getFinancialObligationSummary,
  getFinancialDocumentReadiness,
  getFinancialActionQueue,
  getFinancialUnits,
  getConsolidatedWeeklyCashflow,
  getStripeAccountReadiness,
} from '@/lib/franchise-financials.mjs';
import { createDefaultStripeConnectModel } from '@/lib/stripe-connect.mjs';
import { cn } from '@/lib/utils';

function money(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

function metricValue(metric) {
  if (metric.format === 'currency') return money(metric.value);
  if (metric.format === 'percent') return `${metric.value}%`;
  return metric.value;
}

const iconMap = {
  'sales-and-cash': Banknote,
  'prime-costs': Gauge,
  'unit-economics': TrendingUp,
  'compliance-and-royalties': ReceiptText,
};

export default async function Financials() {
  const financials = await readFinancialManagement();
  const stats = getFinancialManagementStats(financials);
  const scorecard = getFinancialScorecard(financials);
  const sections = getFinancialVisibilitySections(financials);
  const obligations = getFinancialObligationSummary(financials);
  const documentReadiness = getFinancialDocumentReadiness(financials);
  const actionQueue = getFinancialActionQueue(financials);
  const units = getFinancialUnits(financials);
  const consolidatedCashflow = getConsolidatedWeeklyCashflow(financials);
  const stripeReadiness = getStripeAccountReadiness(financials);
  const stripeConnect = createDefaultStripeConnectModel();

  const statCards = [
    { label: 'Weekly Sales', value: money(stats.weeklySales), note: `${stats.transactions} transactions`, tone: 'text-emerald-600' },
    { label: 'Cash On Hand', value: money(stats.cashOnHand), note: 'owner/CFO visibility', tone: 'text-diner-teal' },
    { label: 'Prime Cost', value: `${stats.primeCostPercent}%`, note: 'food + labor', tone: stats.primeCostPercent <= 55 ? 'text-emerald-600' : 'text-diner-red' },
    { label: 'Operating Profit', value: `${stats.estimatedOperatingProfitPercent}%`, note: 'estimated four-wall', tone: stats.estimatedOperatingProfitPercent >= 25 ? 'text-emerald-600' : 'text-diner-red' },
  ];

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] bg-diner-black text-white shadow-xl">
        <div className="grid gap-8 p-8 lg:grid-cols-[1.15fr_0.85fr] lg:p-10">
          <div>
            <p className="text-xs font-display uppercase tracking-[0.32em] text-diner-red">Financial Command Center</p>
            <h1 className="mt-4 max-w-3xl text-4xl leading-tight text-white md:text-5xl">
              Full financial visibility without making operators become accountants.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-diner-cream/80">
              Tracks the numbers successful franchise systems keep boring and visible: cash, prime cost, unit economics, royalties, document readiness, and exception-based action items.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-diner-cream">{financials.period.label}</span>
              <span className="rounded-full bg-amber-400 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-diner-black">WATCH</span>
            </div>
          </div>
          <div className="rounded-[1.5rem] bg-white/10 p-6">
            <p className="text-[10px] font-display uppercase tracking-[0.28em] text-white/50">Flo Finance Guardrails</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-diner-cream/80">
              <li>• Flo can answer from SOPs, KPI dictionary, and attached financial docs.</li>
              <li>• Flo flags exceptions and missing docs instead of inventing numbers.</li>
              <li>• Operators see their unit; ownership sees cash and franchise-wide variance.</li>
            </ul>
            <button className="mt-6 inline-flex cursor-not-allowed items-center gap-2 rounded-full bg-white/70 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-diner-black" disabled>
              <Download className="h-4 w-4" /> Export Pack Coming Soon
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="rounded-[1.5rem] border border-gray-100 bg-white p-6 shadow-sm">
            <p className="text-[10px] font-display uppercase tracking-[0.24em] text-gray-400">{stat.label}</p>
            <p className={cn('mt-3 text-3xl font-bold', stat.tone)}>{stat.value}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-gray-400">{stat.note}</p>
          </div>
        ))}
      </section>


      <section className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-display uppercase tracking-[0.24em] text-gray-400">Four-account weekly view</p>
            <h2 className="mt-1 text-2xl text-diner-black">Unit cashflow by Stripe account</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Separates Event Truck, Trailer Park, East Nashville, and Corporate so ownership can see which accounts are cashflow positive before drilling into COGS, labor, fixed operations, royalties, taxes, and other outflows.
            </p>
          </div>
          <div className={cn('rounded-2xl px-5 py-4 text-right', consolidatedCashflow.cashflowStatus === 'positive' ? 'bg-emerald-50 text-emerald-700' : 'bg-diner-red/10 text-diner-red')}>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em]">Consolidated Net</p>
            <p className="mt-1 text-3xl font-bold">{money(consolidatedCashflow.netCashflow)}</p>
            <p className="text-xs uppercase tracking-[0.16em]">{consolidatedCashflow.cashflowStatus}</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 xl:grid-cols-4">
          {units.map((unit) => {
            const cash = unit.weeklyCashflow;
            return (
              <article key={unit.id} className="rounded-[1.5rem] border border-gray-100 bg-diner-cream p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">{unit.type}</p>
                    <h3 className="mt-1 text-lg font-bold text-diner-black">{unit.name}</h3>
                    <p className="mt-1 text-xs text-gray-500">{unit.owner}</p>
                  </div>
                  <span className={cn('rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em]', cash.cashflowStatus === 'positive' ? 'bg-emerald-100 text-emerald-700' : 'bg-diner-red/10 text-diner-red')}>
                    {cash.cashflowStatus}
                  </span>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-2 text-sm">
                  <div><p className="text-[10px] uppercase tracking-[0.16em] text-gray-400">Sales</p><p className="font-bold text-diner-black">{money(cash.sales)}</p></div>
                  <div><p className="text-[10px] uppercase tracking-[0.16em] text-gray-400">Net</p><p className={cn('font-bold', cash.netCashflow >= 0 ? 'text-emerald-700' : 'text-diner-red')}>{money(cash.netCashflow)}</p></div>
                  <div><p className="text-[10px] uppercase tracking-[0.16em] text-gray-400">COGS</p><p className="font-bold text-diner-black">{money(cash.cogs)}</p></div>
                  <div><p className="text-[10px] uppercase tracking-[0.16em] text-gray-400">Labor</p><p className="font-bold text-diner-black">{money(cash.labor)}</p></div>
                  <div><p className="text-[10px] uppercase tracking-[0.16em] text-gray-400">Fixed Ops</p><p className="font-bold text-diner-black">{money(cash.fixedOperations)}</p></div>
                  <div><p className="text-[10px] uppercase tracking-[0.16em] text-gray-400">Tax Reserve</p><p className="font-bold text-diner-black">{money(cash.taxesReserve)}</p></div>
                </div>
                <div className="mt-4 rounded-2xl bg-white/70 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">Stripe Env</p>
                  <p className="mt-1 break-all text-xs font-bold text-diner-teal">{unit.stripe.accountKey}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-gray-400">
                    {stripeReadiness.accounts.find((account) => account.id === unit.id)?.accountIdPresent ? 'account id present' : 'account id missing'}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <div className="space-y-6">
          {financials.layers.map((layer) => {
            const Icon = iconMap[layer.id] || Gauge;
            return (
              <article key={layer.id} className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-diner-red/10 p-3 text-diner-red"><Icon className="h-5 w-5" /></div>
                  <div>
                    <p className="text-[10px] font-display uppercase tracking-[0.24em] text-gray-400">Financial Layer</p>
                    <h2 className="mt-1 text-2xl text-diner-black">{layer.name}</h2>
                    <p className="mt-2 text-sm leading-6 text-gray-500">{layer.summary}</p>
                  </div>
                </div>
                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  {layer.metrics.map((metric) => {
                    const onTarget = metric.direction === 'lower'
                      ? metric.value <= metric.target
                      : metric.direction === 'fixed'
                        ? metric.value === metric.target
                        : metric.value >= metric.target;
                    return (
                      <div key={metric.id} className="rounded-2xl bg-gray-50 p-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">{metric.label}</p>
                        <p className="mt-2 text-xl font-bold text-diner-black">{metricValue(metric)}</p>
                        <p className={cn('mt-1 text-[10px] font-bold uppercase tracking-[0.18em]', onTarget ? 'text-emerald-600' : 'text-diner-red')}>
                          Target {metricValue({ ...metric, value: metric.target })} · {metric.owner}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-diner-red" />
              <h2 className="text-xl text-diner-black">Exception Review</h2>
            </div>
            <div className="mt-5 space-y-3">
              {scorecard.alerts.map((alert) => (
                <div key={alert.title} className="rounded-2xl border border-diner-red/10 bg-diner-red/5 p-4">
                  <p className="text-sm font-bold text-diner-black">{alert.title}</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-diner-red">{alert.severity} · {alert.owner}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 border-t border-gray-100 pt-5">
              <p className="text-[10px] font-display uppercase tracking-[0.24em] text-gray-400">Next Actions</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-600">
                {scorecard.nextActions.map((action) => <li key={action}>• {action}</li>)}
              </ul>
            </div>
          </div>


          <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <ReceiptText className="h-5 w-5 text-diner-red" />
              <h2 className="text-xl text-diner-black">Obligations Due</h2>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-diner-cream p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">Total Due</p>
                <p className="mt-2 text-2xl font-bold text-diner-black">{money(obligations.totalDue)}</p>
              </div>
              <div className="rounded-2xl bg-diner-cream p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">Due Soon</p>
                <p className="mt-2 text-2xl font-bold text-diner-red">{obligations.dueSoon}</p>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {obligations.items.slice(0, 4).map((item) => (
                <div key={item.id} className="rounded-2xl border border-gray-100 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-diner-black">{item.title}</p>
                      <p className="mt-1 text-xs text-gray-500">Due {item.dueDate} · {item.owner}</p>
                    </div>
                    <p className="text-sm font-bold text-diner-red">{money(item.amount)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-diner-teal" />
              <h2 className="text-xl text-diner-black">Stripe Connect Readiness</h2>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-diner-cream p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">Mode</p>
                <p className="mt-2 text-xl font-bold text-diner-black">{stripeConnect.mode}</p>
              </div>
              <div className="rounded-2xl bg-diner-cream p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">Account</p>
                <p className="mt-2 text-xl font-bold text-diner-red">{stripeConnect.account.status}</p>
              </div>
            </div>
            <p className="mt-4 rounded-2xl border border-diner-red/10 bg-diner-red/5 p-4 text-sm leading-6 text-gray-600">
              {stripeConnect.config.warning} Live account links and all money movement stay disabled until explicit approval.
            </p>
            <div className="mt-4 space-y-2">
              {Object.entries(stripeConnect.config.keysPresent).map(([key, present]) => (
                <div key={key} className="flex items-center justify-between rounded-2xl border border-gray-100 px-4 py-3">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500">{key}</span>
                  <span className={cn('rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em]', present ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700')}>
                    {present ? 'present' : 'missing'}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2">
              {stripeConnect.safeActions.slice(0, 2).map((action) => (
                <div key={action.id} className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-sm font-bold text-diner-black">{action.label}</p>
                  <p className="mt-1 text-xs leading-5 text-gray-500">{action.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <FileArchive className="h-5 w-5 text-diner-teal" />
              <h2 className="text-xl text-diner-black">Document Readiness</h2>
            </div>
            <div className="mt-4 rounded-2xl bg-diner-cream p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">Weekly Close Docs</p>
              <p className="mt-2 text-3xl font-bold text-diner-black">{documentReadiness.percentComplete}%</p>
              <p className="mt-1 text-xs text-gray-500">{documentReadiness.complete} of {documentReadiness.required} required docs attached</p>
            </div>
            <div className="mt-4 space-y-2">
              {documentReadiness.missing.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between rounded-2xl border border-diner-red/10 bg-diner-red/5 px-4 py-3">
                  <span className="text-sm font-bold text-diner-black">{doc.title}</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-diner-red">{doc.owner}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <ClipboardCheck className="h-5 w-5 text-diner-red" />
              <h2 className="text-xl text-diner-black">Finance Action Queue</h2>
            </div>
            <div className="mt-5 space-y-3">
              {actionQueue.slice(0, 6).map((item) => (
                <div key={item.id} className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-sm font-bold text-diner-black">{item.title}</p>
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">{item.priority} · {item.owner} · {item.source}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <ClipboardCheck className="h-5 w-5 text-diner-teal" />
              <h2 className="text-xl text-diner-black">Visibility Views</h2>
            </div>
            <div className="mt-5 space-y-4">
              {sections.map((section) => (
                <div key={section.id} className="rounded-2xl bg-diner-cream p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-diner-red">{section.owner}</p>
                  <h3 className="mt-1 font-bold text-diner-black">{section.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{section.summary}</p>
                  <ul className="mt-3 space-y-1 text-xs text-gray-500">
                    {section.questions.slice(0, 2).map((question) => <li key={question}>→ {question}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <FileArchive className="h-5 w-5 text-diner-red" />
              <h2 className="text-xl text-diner-black">Finance Source Docs</h2>
            </div>
            <div className="mt-5 space-y-3">
              {financials.referenceFiles.map((file) => (
                <div key={file.id} className="rounded-2xl border border-gray-100 p-4">
                  <p className="text-sm font-bold text-diner-black">{file.title}</p>
                  <p className="mt-1 text-xs leading-5 text-gray-500">{file.summary}</p>
                  <p className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.18em] text-diner-teal">
                    {file.path} <ArrowUpRight className="h-3 w-3" />
                  </p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
