#!/usr/bin/env python3
"""Static checks for the portfolio: broken local references, per-page metadata, image alt text."""
import re, sys
from pathlib import Path
from urllib.parse import urlparse, unquote

ROOT = Path(__file__).resolve().parent.parent
SITE = 'https://khoalearningcode.github.io'
pages = [p for p in ROOT.rglob('*.html') if '.git' not in p.parts and 'channels' not in p.parts]
errors, seen_desc = [], {}

def local_target(page, ref):
    ref = ref.split('#')[0].split('?')[0]
    if not ref:
        return None
    path = ROOT / unquote(ref.lstrip('/')) if ref.startswith('/') else page.parent / unquote(ref)
    return path

for page in sorted(pages):
    rel = page.relative_to(ROOT)
    html = page.read_text()
    refs = re.findall(r'(?:src|href|data-image)="([^"]+)"', html) + re.findall(r'<meta [^>]*content="(' + re.escape(SITE) + r'[^"]*)"', html)
    for ref in refs:
        if ref.startswith(SITE):
            ref = '/' + ref[len(SITE):].lstrip('/')
        u = urlparse(ref)
        if u.scheme or ref.startswith(('mailto:', '#', 'data:')):
            continue
        target = local_target(page, ref)
        if target is not None and not target.exists():
            errors.append(f'{rel}: missing local file {ref}')
    for img in re.findall(r'<img\b[^>]*>', html):
        if 'alt=' not in img:
            errors.append(f'{rel}: <img> without alt: {img[:70]}')
    if rel.name == '404.html':
        continue
    desc = re.search(r'<meta name="description" content="([^"]*)"', html)
    if not desc:
        errors.append(f'{rel}: no meta description')
    elif desc.group(1) in seen_desc:
        errors.append(f'{rel}: same description as {seen_desc[desc.group(1)]}')
    else:
        seen_desc[desc.group(1)] = rel
    for need in ('og:title', 'og:description', 'og:image', 'og:url'):
        if f'property="{need}"' not in html:
            errors.append(f'{rel}: missing {need}')
    if 'name="twitter:card"' not in html:
        errors.append(f'{rel}: missing twitter:card')
    canon = re.search(r'rel="canonical" href="([^"]*)"', html)
    expected = f'{SITE}/' + ('' if rel.name == 'index.html' and rel.parent == Path('.') else rel.as_posix())
    if not canon or canon.group(1) != expected:
        errors.append(f'{rel}: canonical should be {expected}')

sitemap = (ROOT / 'sitemap.xml').read_text()
for page in pages:
    rel = page.relative_to(ROOT).as_posix()
    if rel in ('404.html',):
        continue
    url = f'{SITE}/' + ('' if rel == 'index.html' else rel)
    if f'<loc>{url}</loc>' not in sitemap:
        errors.append(f'sitemap.xml: missing {url}')

for e in errors:
    print('ERROR', e)
print(f'{len(pages)} pages checked, {len(errors)} problem(s)')
sys.exit(1 if errors else 0)
