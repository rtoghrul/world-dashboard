// Localized labels for the alternative.me Fear & Greed classification (API returns English).
const LABELS: Record<string, Record<string, string>> = {
  'Extreme Fear': { az: 'Həddən artıq qorxu', ru: 'Крайний страх', de: 'Extreme Angst', tr: 'Aşırı Korku', fr: 'Peur extrême', es: 'Miedo extremo', zh: '极度恐惧', ar: 'خوف شديد', ja: '極度の恐怖', it: 'Paura estrema', pt: 'Medo extremo' },
  Fear: { az: 'Qorxu', ru: 'Страх', de: 'Angst', tr: 'Korku', fr: 'Peur', es: 'Miedo', zh: '恐惧', ar: 'خوف', ja: '恐怖', it: 'Paura', pt: 'Medo' },
  Neutral: { az: 'Neytral', ru: 'Нейтрально', de: 'Neutral', tr: 'Nötr', fr: 'Neutre', es: 'Neutral', zh: '中性', ar: 'محايد', ja: '中立', it: 'Neutrale', pt: 'Neutro' },
  Greed: { az: 'Tamah', ru: 'Жадность', de: 'Gier', tr: 'Açgözlülük', fr: 'Avidité', es: 'Codicia', zh: '贪婪', ar: 'طمع', ja: '強欲', it: 'Avidità', pt: 'Ganância' },
  'Extreme Greed': { az: 'Həddən artıq tamah', ru: 'Крайняя жадность', de: 'Extreme Gier', tr: 'Aşırı Açgözlülük', fr: 'Avidité extrême', es: 'Codicia extrema', zh: '极度贪婪', ar: 'طمع شديد', ja: '極度の強欲', it: 'Avidità estrema', pt: 'Ganância extrema' },
}

export function fearGreedLabel(label: string | null | undefined, lang: string): string {
  if (!label) return ''
  return LABELS[label]?.[lang] || label
}
