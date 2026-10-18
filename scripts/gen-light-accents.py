#!/usr/bin/env python3
"""Regenerate app/light-accents.css: in the light theme, pale accent text classes
(text-<hue>-100..400, plus hover:/group-hover:) switch to the -700/-800 shade so they
stay readable on white. Run from the repo root: python3 scripts/gen-light-accents.py"""
import re, glob
P700 = {'red':'#b91c1c','orange':'#c2410c','amber':'#b45309','yellow':'#a16207','lime':'#4d7c0f','green':'#15803d','emerald':'#047857','teal':'#0f766e','cyan':'#0e7490','sky':'#0369a1','blue':'#1d4ed8','indigo':'#4338ca','violet':'#6d28d9','purple':'#7e22ce','fuchsia':'#a21caf','pink':'#be185d','rose':'#be123c'}
P800 = {'red':'#991b1b','orange':'#9a3412','amber':'#92400e','yellow':'#854d0e','lime':'#3f6212','green':'#166534','emerald':'#065f46','teal':'#115e59','cyan':'#155e75','sky':'#075985','blue':'#1e40af','indigo':'#3730a3','violet':'#5b21b6','purple':'#6b21a8','fuchsia':'#86198f','pink':'#9d174d','rose':'#9f1239'}
pat = re.compile(r'(?<![\w:-])((?:hover:|group-hover:)?)text-(%s)-(100|200|300|400)(/\[?[0-9.]+\]?)?(?![\w-])' % '|'.join(P700))
found = set()
for f in glob.glob('app/**/*.tsx', recursive=True) + glob.glob('components/**/*.tsx', recursive=True):
    for m in pat.finditer(open(f, encoding='utf-8').read()):
        found.add(m.groups())
esc = lambda c: re.sub(r'([:/\[\].])', r'\\\1', c)
rules = []
for pre, hue, sh, suf in sorted(found, key=lambda x: (x[0], x[1], x[2], x[3] or '')):
    cls = f'{pre}text-{hue}-{sh}{suf or ""}'
    color = P800[hue] if sh in ('100', '200') else P700[hue]
    if suf:
        a = float(suf[1:].strip('[]')); a = a if a <= 1 else a / 100
        r, g, b = (int(color[i:i+2], 16) for i in (1, 3, 5))
        val = f'rgb({r} {g} {b} / {max(a, 0.75)})'
    else:
        val = color
    sel = '.' + esc(cls)
    if pre == 'hover:': sel += ':hover'
    if pre == 'group-hover:': sel = '.group:hover ' + sel
    rules.append(f'html.light {sel} {{ color: {val}; }}')
head = open('app/light-accents.css', encoding='utf-8').read().split('*/', 1)[0] + '*/\n'
open('app/light-accents.css', 'w', encoding='utf-8').write(head + '\n'.join(rules) + '\n')
print(f'{len(rules)} rules written')
