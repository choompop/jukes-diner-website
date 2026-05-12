#!/usr/bin/env python3
"""Collect compact context for the autonomous Juke's dashboard build loop.

This script is read-only. It intentionally summarizes secrets/API keys by presence only.
Its stdout is injected into the scheduled Hermes build prompt.
"""
from __future__ import annotations

import json
import os
import re
import subprocess
from collections import Counter
from datetime import datetime
from pathlib import Path

REPO = Path('/Users/lexi/projects/jukes-diner-website')
OPENCLAW = Path('/Users/lexi/.hermes/imports/openclaw-memory')
MAX_FILE_CHARS = 1400

KEY_TERMS = [
    'franchise', 'financial', 'finance', 'cash', 'debt', 'stripe', 'content',
    'dashboard', 'operations', 'operator', 'sop', 'document', 'media', 'flo',
    'slack', 'supabase', 'notion', 'google drive', 'toast', 'metricool',
]

GUIDING_PRINCIPLES = [
    'Reduce John from day-to-day operations; do not create workflows that depend on him being the bottleneck.',
    'Protect/generate cash flow: financial visibility, obligations, deposits, royalties, debt service, unit profitability.',
    'Build useful working software over documents; every iteration should improve a real dashboard/API/test path.',
    'Avoid overbuilding or adding disconnected tools; consolidate into the Juke\'s operator/franchise command center.',
    'No external communication, live payments, production deploys, or public posting without explicit approval.',
    'Treat Stripe keys and all credentials as secrets: check presence only, never print values.',
]


def run(cmd: list[str], cwd: Path = REPO, timeout: int = 45) -> str:
    try:
        proc = subprocess.run(cmd, cwd=str(cwd), text=True, capture_output=True, timeout=timeout)
        out = (proc.stdout + proc.stderr).strip()
        return out[-3000:] if out else f'exit={proc.returncode}'
    except Exception as exc:  # noqa: BLE001
        return f'ERROR running {cmd}: {exc}'


def read_text(path: Path, limit: int = MAX_FILE_CHARS) -> str:
    try:
        text = path.read_text(errors='ignore')
    except Exception as exc:  # noqa: BLE001
        return f'[unreadable: {exc}]'
    text = re.sub(r'(sk-[A-Za-z0-9_\-]{8,})', '[REDACTED_OPENAI_KEY]', text)
    text = re.sub(r'(rk_[A-Za-z0-9_\-]{8,}|sk_live_[A-Za-z0-9_\-]{8,}|sk_test_[A-Za-z0-9_\-]{8,})', '[REDACTED_STRIPE_KEY]', text)
    return text[:limit]


def summarize_openclaw() -> dict:
    if not OPENCLAW.exists():
        return {'available': False, 'path': str(OPENCLAW)}

    files = sorted(OPENCLAW.glob('*.md'))
    term_hits: Counter[str] = Counter()
    excerpts: list[dict] = []
    for path in files:
        text = read_text(path, limit=25000).lower()
        for term in KEY_TERMS:
            if term in text:
                term_hits[term] += text.count(term)
        # Keep compact excerpts from the highest-signal memory docs.
        if path.name in {'USER.md', 'MEMORY.md', 'onboarding.md', '2026-05-06.md'}:
            excerpts.append({'file': path.name, 'excerpt': read_text(path, limit=1200)})

    return {
        'available': True,
        'path': str(OPENCLAW),
        'files': len(files),
        'top_term_hits': term_hits.most_common(12),
        'excerpts': excerpts,
    }


def stripe_status() -> dict:
    env_paths = [REPO / '.env', REPO / '.env.local', Path.home() / '.hermes' / '.env']
    keys = ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY']
    found = {key: False for key in keys}
    for env_path in env_paths:
        if not env_path.exists():
            continue
        raw = read_text(env_path, limit=20000)
        for key in keys:
            found[key] = found[key] or bool(re.search(rf'^{re.escape(key)}\s*=\s*.+', raw, flags=re.MULTILINE))
    return {
        'env_checked': [str(p) for p in env_paths if p.exists()],
        'keys_present': found,
        'safe_next_steps': [
            'Create Stripe Connect/account-linking architecture behind tests and feature flags.',
            'Support account connection/status display before pulling balances/transactions.',
            'Never create live charges/transfers or print API keys from automation.',
        ],
    }


def main() -> None:
    package_json = REPO / 'package.json'
    data_files = sorted((REPO / 'data').glob('*.json')) if (REPO / 'data').exists() else []
    output = {
        'generated_at': datetime.now().isoformat(timespec='seconds'),
        'repo': str(REPO),
        'guiding_principles': GUIDING_PRINCIPLES,
        'git_status_short': run(['git', 'status', '--short'], timeout=20),
        'package_scripts': json.loads(package_json.read_text()).get('scripts', {}) if package_json.exists() else {},
        'stripe': stripe_status(),
        'openclaw_memory': summarize_openclaw(),
        'data_files': [{'path': str(p.relative_to(REPO)), 'bytes': p.stat().st_size} for p in data_files],
        'priority_backlog': [
            'Canonical brain card edit/status/archive controls after signal conversion.',
            'Stripe Connect financial account linking/status surface; no live money movement.',
            'Financial period/unit selector, document upload/readiness, obligations paid/done workflow.',
            'Full document/media storage index across SOPs, finance docs, brand/media, Drive links.',
            'Flo retrieval/Q&A against SOPs and dashboard records with approval gates.',
            'Operator/franchisee QA subagent each cycle; fix testable bugs before adding shiny features.',
            'Migrate JSON storage to SQLite/Supabase when workflows stabilize.',
        ],
        'important_files': {
            'franchise_brain_lib': read_text(REPO / 'lib' / 'franchise-brain.mjs'),
            'financials_lib': read_text(REPO / 'lib' / 'franchise-financials.mjs'),
            'financials_page': read_text(REPO / 'app' / 'dashboard' / 'financials' / 'page.tsx'),
        },
    }
    print(json.dumps(output, indent=2))


if __name__ == '__main__':
    main()
