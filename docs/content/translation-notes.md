# Translation notes — «Цифровая Беларусь»

Status: complete (first full pass)
Owner: content
Related: [i18n spec](../specs/i18n.md) | [ADR 0002](../decisions/0002-next-intl-three-locales.md) | [ADR 0003](../decisions/0003-message-catalogs-as-content.md)

This document is the content policy and reference for the three message catalogues.
It covers the locale model, the structural contract, brand names, voice, glossary,
typography, number/date formatting, known decisions and the quality gates that keep
the catalogues in sync. All site copy lives in [`messages`](../../messages).

## 1. Locale policy

| Locale | File                                         | Role                                                | Brand name          |
| ------ | -------------------------------------------- | --------------------------------------------------- | ------------------- |
| `ru`   | [`messages/ru.json`](../../messages/ru.json) | Primary source of truth, authored first             | «Цифровая Беларусь» |
| `be`   | [`messages/be.json`](../../messages/be.json) | Full native translation/adaptation                  | «Цыфровая Беларусь» |
| `en`   | [`messages/en.json`](../../messages/en.json) | Full English adaptation (not a literal translation) | "Digital Belarus"   |

Rules:

1. **Russian is the source catalogue.** Every key is authored in `ru.json` first; `be` and `en`
   are complete translations — no partial locales, no runtime fallback, no untranslated strings.
2. **Every locale is first-class.** A visitor must be able to read the entire site (landing page,
   case dialogs, calculator, form errors, privacy page, 404) in their language without losing meaning.
3. **Translations are adaptations.** Belarusian and English copy must read as if written natively for
   the studio: same facts, same promises, same level of detail, but natural syntax and rhythm.
   Do not shorten away meaningful detail; do not add claims that are not in `ru.json`.
4. **User-facing copy never moves into components.** New strings and content arrays go into all three
   catalogues in the same change. See ADR 0003.
5. **Technical and product names are not translated** (see [§6](#6-technical-names-kept-untranslated)).
6. **Dates and numbers are formatted per locale** for display only; underlying numeric values stay identical.

### Workflow when the Russian source changes

1. Edit `messages/ru.json` (and, if a new locale is ever added, the other catalogues).
2. Mirror the change into `messages/be.json` and `messages/en.json` — same key paths, same array
   length and order.
3. Run `pnpm check:i18n` (message parity) and the ICU/plural checks described in [§10](#10-quality-gates).
4. Re-read the changed string in context; a one-word Russian edit can change the grammar of a
   Belarusian or English sentence.

The current catalogues were synchronised after the Lead added the form keys
`contact.form.requestTitle`, `contact.form.successNoteFallback` and `contact.form.sendAnother`
on 26 November 2026. If `ru.json` changes again, repeat the workflow above.

## 2. Structural contract

The three files are **structurally identical** and must stay that way:

- identical key paths, in the same nesting; no extra or missing keys;
- identical array lengths and order (services, cases, tiers, calculator types/options/jurisdictions,
  FAQ items, principles, steps, hero metrics, form option lists, privacy sections);
- identical values for language-independent data:
    - `id`, `icon`, `kind`, `year`, `index`, `num`, `code`;
    - `liveUrl`, `telegram`, `telegramUrl`, `githubUrl`, `personalUrl`, `coordinates`;
    - `brandLatin`, `currency`;
    - numeric `price` and `days` fields in `pricing.calculator`;
    - stack/tag product names (`Next.js`, `TypeScript`, `LLM`, `RAG`, `CRM`, …);
- identical ICU placeholders: `{year}` in `footer.rights` and
  `{days, plural, …}` in `pricing.calculator.term`;
- preserved intentional empty strings: `cases.items[].liveUrl` for concepts and
  `tiers[].pricePrefix` for the Start and Business tiers are empty **by contract**,
  not missing copy.

Explicit, documented exceptions where values differ between locales:

| Key                                                   | ru                     | be                     | en                       | Why                                                 |
| ----------------------------------------------------- | ---------------------- | ---------------------- | ------------------------ | --------------------------------------------------- |
| `common.brand`                                        | Цифровая Беларусь      | Цыфровая Беларусь      | Digital Belarus          | Brand localization                                  |
| `common.brandShort`                                   | `ЦБ`                   | `ЦБ`                   | `DB`                     | Brand abbreviation may be localized (Lead decision) |
| `meta.*`, all prose                                   | RU                     | BE                     | EN                       | Translation                                         |
| `pricing` price strings, `contact.form.budgetOptions` | `2 500`                | `2 500`                | `2,500`                  | Locale number formatting                            |
| `privacy.updated`                                     | 26 ноября 2026         | 26 лістапада 2026      | 26 November 2026         | Date formatting                                     |
| project names                                         | Ясна, Спадчына, ПраБот | Ясна, Спадчына, ПраБот | Yasna, Spadchyna, PraBot | English transliteration of names                    |

> The current parity script (`scripts/check-i18n.mjs`) compares structure, numeric/boolean literals,
> ICU placeholder names and empty-string rules, but not prose values, so `ЦБ` vs `DB` passes as-is.
> If the script ever gains strict string-invariant checks, `common.brandShort` must be whitelisted:
> it is the only string leaf whose translated value is an accepted divergence rather than data.
> Everything else in the "identical data" list above must be compared strictly.

## 3. Brand-name handling

| Context                           | ru                                 | be                                 | en                                       |
| --------------------------------- | ---------------------------------- | ---------------------------------- | ---------------------------------------- |
| Brand / site name                 | Цифровая Беларусь                  | Цыфровая Беларусь                  | Digital Belarus                          |
| Latin brand (`common.brandLatin`) | Digital Belarus                    | Digital Belarus                    | Digital Belarus                          |
| Short mark (`common.brandShort`)  | ЦБ                                 | ЦБ                                 | DB                                       |
| Footer legal line                 | «Цифровая Беларусь»                | «Цыфровая Беларусь»                | Digital Belarus                          |
| Form message title                | Заявка с сайта «Цифровая Беларусь» | Заяўка з сайта «Цыфровая Беларусь» | Enquiry from the Digital Belarus website |

Rules:

- The Belarusian brand is written **«Цыфровая Беларусь»** (the spelling fixed by the Lead), even though
  the regular Belarusian adjective for "digital" is `лічбавы`. Keep the brand spelling untouched —
  do not "correct" it to «Лічбавая Беларусь».
- In running copy translate the _adjective_, not the brand: ru «цифровые продукты» →
  be «лічбавыя прадукты» → en "digital products". The footer tagline is «Лічбавая абсерваторыя
  беларускага бізнесу» / "A digital observatory for Belarusian business".
- `common.brandLatin` is never translated. The header/footer wordmark reads it in every locale by design.
- Keep «ёлочки» (guillemets) around the brand in legal copy in ru/be; in English use plain text.
- Do not translate or alter `@kuzminklk`, URLs, the personal site URL or the GitHub handle.
- "Беларусь" stays «Беларусь» in be; in en "Belarus"; the country adjective is «беларускі» (be) —
  note the single `с`, unlike Russian «белорусский», and "Belarusian" (en).

## 4. Voice and tone

The studio voice, in all locales:

- **Plain-spoken and confident.** Short sentences, concrete promises, zero agency clichés
  (no "cutting-edge", "seamless", "unleash", "digital transformation journey").
- **Specific over decorative.** Numbers, terms and deliverables instead of adjectives:
  a fixed quote, a week, a month of edits, 30% / 70%.
- **Second person, direct address.** We speak to one client ("вы" / "you"), never to "users" or "customers"
  in the abstract.
- **No hype, no exclamation marks, no emoji.** Em dashes and full stops carry the rhythm.
- **Honest about limits.** Concepts are labeled concepts; estimates are labeled estimates.
- Headings are split into `title` + `titleAccent` (rendered as one display line, accent in italic).
  Always translate them **as a single phrase** and check that concatenation stays grammatical
  (for example ru «Прозрачно, без» + «сюрпризов» → en "Transparent, with no" + "surprises").

### Russian (source)

The Lead's copy is the reference: understated, direct, slightly dry. Keep it as the benchmark for
meaning and tone when adapting.

### Belarusian (`be`)

- Natural literary Belarusian, not a word-by-word calque; avoid Russianisms:
  `смета` → **каштарыс**, `поддержка` → **падтрымка**, `договор` → **дагавор**, `вывеска` → **шыльда**,
  `менеджер` → **менеджар**, `админка` → **панэль адміністратара**, `подвал` → **футар**,
  `хостинг` → **хостынг**, `заказ` → **замова**, `отзыв` → **водгук**, `отчёт` → **справаздача**.
- Correct orthography everywhere: `ў`, `і`, `ё`; never Russian `и`, `щ`, `ъ`.
  Typographic apostrophe `’` after prefixes and before `е/ё/ю/я/і` (`аб’ём`, `з’яўляцца`, `прэв’ю`,
  `сузор’е`) — never a straight `'`.
- Direct address uses «вы»; a capital «Вы» appears only at the start of a sentence, exactly as in the
  Russian source.
- Keep sentence length close to the Russian so the display typography and card heights do not break.
- Avoid bureaucratese; prefer verbs to stacked verbal nouns.
- Technical names keep Latin script (see §6); abbreviations: **ШІ** (штучны інтэлект), **БР**-style
  abbreviations are not used for currency — always `BYN`.
- Note: Belarusian has no `и`/`щ`/`ъ`; a spell-check pass for those three characters is a fast smoke test.

### English (`en`)

- **British English throughout**: enquiry (not inquiry), catalogue (not catalog), organisation,
  localise, centre, e-mail. Keep one spelling system; do not mix US forms.
- Understated B2B register: precise, confident, active voice. Contractions are allowed sparingly
  ("we don’t", "you’re") — the Russian source is informal-professional, not corporate-stiff.
- Prefer verbs and concrete nouns: "we fix the quote", not "quotations are fixed".
- "quote" = the fixed price of a project (`смета`); "estimate" = the calculator's preliminary figure.
- "plan" = pricing tier (`тариф`); "tier" is acceptable in technical comments only.
- No American sales words ("awesome", "supercharge", "rockstar"), no rhetorical questions beyond the
  ones in the source.
- Headings are sentence fragments — capitalise only the first word (sentence case), except product
  names and proper nouns.

## 5. Glossary (RU → BE → EN)

Core terms used by the site. Use these translations consistently; if a new string uses a synonym,
check this table first.

| Russian (source)    | Belarusian           | English                     | Notes                                                            |
| ------------------- | -------------------- | --------------------------- | ---------------------------------------------------------------- |
| сайт                | сайт                 | website / site              | "сайт" is the normal Belarusian word                             |
| заявка              | заяўка               | enquiry                     | British "enquiry"; never "inquiry"                               |
| смета               | каштарыс             | quote                       | "смета" is a Russianism in be; calculator output uses "estimate" |
| фиксированная смета | фіксаваны каштарыс   | fixed quote                 | Key selling point, keep the wording stable                       |
| тариф               | тарыф                | plan                        | Pricing tier name                                                |
| бот / Telegram-бот  | бот / Telegram-бот   | bot / Telegram bot          | Product name kept in Latin script                                |
| ИИ                  | ШІ (штучны інтэлект) | AI                          | "ШІ" is the Belarusian abbreviation                              |
| нейросеть           | нейронная сетка      | neural network              | Used in the FAQ answer about AI                                  |
| под ключ            | пад ключ             | turnkey                     | Tier name «Под ключ» → «Пад ключ» → "Turnkey"                    |
| студия              | студыя               | studio                      | «студия» in be is «студыя»                                       |
| запуск              | запуск               | launch                      | "launch" also for going live                                     |
| поддержка           | падтрымка            | support                     | Post-launch support                                              |
| сопровождение       | суправаджэнне        | ongoing support             | Unlike one-off "падтрымка"                                       |
| договор             | дагавор              | contract                    | "by contract" / "under contract"                                 |
| каталог             | каталог              | catalogue                   | British spelling in en                                           |
| воронка             | варонка              | funnel                      | Reserved for future copy; not in current catalogue               |
| вёрстка             | вёрстка              | front-end build / markup    | "build" in case copy, "markup" if precise                        |
| правки              | праўкі               | edits                       | "a month of edits"                                               |
| сдача (проекта)     | здача                | handover                    | "after handover"                                                 |
| доработки           | дапрацоўкі           | refinements                 | "edits and refinements"                                          |
| бриф                | брыф                 | brief                       | Short intake conversation                                        |
| прототип            | прататып             | prototype                   | Structure prototype                                              |
| ориентир            | арыенцір             | indication / starting point | Prices are "starting points"                                     |
| дашборд             | дашборд              | dashboard                   | Kept as-is                                                       |
| интеграция          | інтэграцыя           | integration                 |                                                                  |
| автоматизация       | аўтаматызацыя        | automation                  |                                                                  |
| консультант (ИИ-)   | кансультант (ШІ-)    | assistant (AI)              | "AI assistant"                                                   |
| живой проект        | жывы праект          | live project                | Case label                                                       |
| концепт             | канцэпт              | concept                     | Case label; see §9                                               |
| кейс                | кейс                 | case study                  | "View case study"                                                |
| стек                | стэк                 | stack                       |                                                                  |
| домен               | дамен                | domain                      |                                                                  |
| хостинг             | хостынг              | hosting                     | Attested Belarusian form (hosting providers use it)              |
| доступы             | доступы              | access                      |                                                                  |
| исходники           | зыходнікі            | source code                 |                                                                  |
| оплата              | аплата               | payment                     |                                                                  |
| заказ               | замова               | order                       | "замовіць" = to order; "заказ" avoided                           |
| корзина             | кошык                | cart                        |                                                                  |
| доставка            | дастаўка             | delivery                    |                                                                  |
| отзыв               | водгук               | review                      |                                                                  |
| отчёт               | справаздача          | report                      |                                                                  |
| цель                | мэта                 | goal                        | "analytics and goals"                                            |
| звонок              | званок               | call                        |                                                                  |
| встреча             | сустрэча             | meeting                     |                                                                  |
| менеджер            | менеджар             | manager                     | Also "middleman" in `менеджеры-посредники`                       |
| разработчик         | распрацоўшчык        | developer                   |                                                                  |
| дизайнер            | дызайнер             | designer                    |                                                                  |
| команда             | каманда              | team                        |                                                                  |
| клиент              | кліент               | client                      |                                                                  |
| лендинг             | лендынг              | landing page                |                                                                  |
| интернет-магазин    | інтэрнэт-крама       | online shop                 | "shop" = «крама»                                                 |
| корпоративный сайт  | карпаратыўны сайт    | corporate website           |                                                                  |
| аналитика           | аналітыка            | analytics                   |                                                                  |
| дизайн-система      | дызайн-сістэма       | design system               |                                                                  |
| маркетплейс         | маркетплейс          | marketplace                 |                                                                  |
| ТЗ                  | тэхнічнае заданне    | specification               | "no forty-page specifications"                                   |
| оферта              | аферта               | offer                       | "not an offer"                                                   |
| вилка (цен)         | дыяпазон кошту       | range                       | Literal «відэльца» rejected as a false friend                    |
| вывеска / шильда    | шыльда               | sign                        | "the sign above the door"                                        |
| наценка             | нацэнка              | mark-up                     | "agency mark-up"                                                 |
| чёрный ящик         | чорная скрыня        | black box                   | «скрыня» is feminine in be                                       |
| обсерватория        | абсерваторыя         | observatory                 | Brand metaphor                                                   |
| созвездие           | сузор’е              | constellation               | Apostrophe: «сузор’е»                                            |
| орбита              | арбіта               | orbit                       |                                                                  |
| пиксельная вышивка  | піксельная вышыўка   | pixel embroidery            | Ornament identity                                                |
| страница            | старонка             | page                        |                                                                  |
| фото                | фота                 | photo                       | «фотаздымак» = photograph                                        |
| удалённо            | аддалена             | remote                      |                                                                  |
| подвал (сайта)      | футар                | footer                      | Web jargon is acceptable in be                                   |

## 6. Technical names kept untranslated

The following are written the same way in all three catalogues (Latin script, original spelling):

- Platforms and products: **Telegram**, **Telegram-бот**, **Viber**, **Mini Apps**,
  **Telegram Mini App**, **Instagram**, **GitHub**, **QR-код**.
- Stack and technology: **Next.js**, **TypeScript**, **JavaScript**, **Python**, **HTML**, **CSS**,
  **CRM**, **LLM**, **RAG**, **LLM/RAG** in the AI context, **Webhooks**, **Dashboard**,
  **E-commerce**, **SEO**, **LQIP**.
- Data and identifiers: **BYN**, **RU · BE · EN**, `@kuzminklk`, all URLs, all `id` fields.
- Tag `Метрика` is treated as the Metrica analytics product: «Метрыка» (be), "Metrica" (en);
  it is deliberately not expanded to "Yandex Metrica" so the copy makes no vendor claim.
- "cookies" is a technical term, but Belarusian copy uses the standard localised form **кукі**;
  English keeps "cookies".

## 7. Typography and punctuation

| Rule            | ru / be                                                                                                                            | en                                                  |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| Quotation marks | «ёлочки»                                                                                                                           | “curly double”                                      |
| Apostrophe      | typographic `’` (be only)                                                                                                          | typographic `’` in contractions/possessives         |
| Dash            | spaced em dash —                                                                                                                   | spaced em dash —                                    |
| Ranges          | unit ranges take an en dash: `1–4 тыдні`, `30–40 хвілін`; the budget select keeps the source's spaced em dash: `3 000 — 7 000 BYN` | same style: `1–4 weeks`, `3,000 — 7,000 BYN`        |
| Compound words  | hyphen: `Telegram-бот`, `інтэрнэт-крама`, `E-commerce`                                                                             | hyphen where standard: "front-end build", "mark-up" |
| Ellipsis        | single character `…`                                                                                                               | single character `…`                                |
| Percent         | attached: `30%`, `100%`                                                                                                            | attached: `30%`, `100%`                             |
| Straight quotes | never                                                                                                                              | never                                               |

Additional rules:

- No trailing full stops in labels, buttons, headings, list items or metric captions; full stops in
  sentences, paragraphs and FAQ answers.
- Headings (`title`, `titleAccent`, section labels) are fragments: no final punctuation, sentence case
  in English, normal Belarusian capitalisation.
- Use `ё` everywhere it belongs in ru/be; do not substitute `е`.
- Keep the brand and product capitalisation exactly: Telegram, GitHub, Viber, Next.js, BYN.

## 8. Numbers, currency, dates, times

- **Thousands separator:** a space in ru and be (`1 500`, `7 900`, `15 000`); a comma in en
  (`1,500`, `7,900`, `15,000`). The numeric values themselves never change.
- **Currency:** always the ISO code `BYN` after the amount: `ад 2 500 BYN` / "from 2,500 BYN".
  Never `р.`, `руб.` or `₽`. Tier prices are split across `price` + `pricePrefix` + `currency`
  because the component renders them; do not fold the currency into `price`.
- **Percentages:** `30%`, `70%`, `100%` — no space, no decimal comma differences.
- **Durations:** `1–2 тыдні` / "1–2 weeks"; `ад 6 тыдняў` / "from 6 weeks"; the calculator formats
  day counts through ICU plural (`1 дзень`, `2 дні`, `5 дзён`; "1 day", "2 days").
- **Dates:** day + month + year, no comma. ru `26 ноября 2026`, be `26 лістапада 2026`,
  en `26 November 2026` (British order). Month names are lowercase in ru/be, capitalised in en.
- **Times:** 24-hour clock, en dash between times, no spaces: `9:00–20:00`.
  Weekdays: `пн–пт` (ru/be), `Mon–Fri` (en).
- **Decimal separators:** comma in ru/be, point in en — relevant only if fractional numbers ever
  appear; the current copy has none outside the plural test.

## 9. Known decisions and edge cases

1. **"Concept" cases.** `cases.items[].kind` stays the machine value `concept` in every locale.
   The visible label is «Концепт» / «Канцэпт» / "Concept", and category strings read
   «Концепт · E-commerce» / «Канцэпт · E-commerce» / "Concept · E-commerce".
   The disclaimer note ("not commercial studio projects") is translated in full; never imply a
   concept is a client project.
2. **Case names.** Belarusian keeps the Cyrillic names «Ясна», «Спадчына», «ПраБот»; English
   transliterates them as **Yasna**, **Spadchyna**, **PraBot** so Latin-script readers can search for
   them. "Central Park" is a proper name and stays unchanged in all locales.
3. **Volkovysk / Vawkavysk.** «Волковыск» → be «Ваўкавыск» → en "Vawkavysk" (the Belarusian
   romanisation used on English Wikipedia and road signs). The live deployment URL still uses the older
   spelling `central-park-volkovysk.vercel.app`; this is a domain, not copy, so it is untouched.
4. **«Метрика» tag.** Treated as the analytics product Metrica; not expanded to a vendor name.
5. **cookies.** ru keeps the Latin term, be localises to «кукі», en "cookies"; the privacy section
   heading is «Кукі і аналітыка» / "Cookies and analytics".
6. **ИИ / ШІ / AI.** The Russian abbreviation `ИИ` is never carried into be or en; Belarusian uses
   `ШІ` (штучны інтэлект), English "AI". `ИИ-направление` → «ШІ-кірунак» → "AI capability".
7. **смета vs estimate.** The project price is a "quote" (fixed), the calculator figure is an
   "estimate" (preliminary). Both are «каштарыс» in Belarusian; context makes the distinction clear.
8. **заказ → замова.** E-commerce copy uses «замова» / "order"; never «заказ» in be.
9. **админка → панэль адміністратара.** Avoids the Russianism; in EN "admin panel" / "admin chat".
10. **хостинг → хостынг** in be (attested form on Belarusian hosting sites), "hosting" in en.
11. **ТЗ → тэхнічнае заданне.** The abbreviation is expanded in Belarusian for readability; English
    uses "specifications".
12. **"no black box" idiom.** be «чорная скрыня» (feminine), en "black box"; keep the metaphor.
13. **"sign above the door" idiom.** ru «вывеска» → be «шыльда»; en keeps the image.
14. **"вилка" (price range).** ru colloquialism is rendered as «дыяпазон кошту» / "range" — the literal
    «відэльца» would be a false friend in Belarusian.
15. **"Под ключ" as a tier name.** «Пад ключ» / "Turnkey" — do not change to «Пад ключ» quotes or
    "All-inclusive"; the tier name is a brand-adjacent term.
16. **Empty form-related keys.** `cases[].liveUrl` for concepts and `tiers[].pricePrefix` for the
    Start/Business tiers are empty in all locales; the component uses them conditionally.
17. **Plural categories.** ru and be need `one/few/many/other`; en needs `one/other`.
    Belarusian forms: `# дзень`, `# дні`, `# дзён`, `# дня` (fractions/other).
    Verified with FormatJS/`Intl.PluralRules` for 1, 2, 5, 11, 21, 22, 25 and 1.5.
18. **`{year}`** in `footer.rights` is an ICU placeholder, not a literal; do not replace it with a
    hard-coded year.
19. **Privacy wording.** The form never posts to a server; the copy must keep the explanation
    (text composed in the browser, copied to the clipboard, opened in Telegram). This is a legal and
    product-accuracy statement, not marketing — translate precisely.
20. **Form message title** (`contact.form.requestTitle`) is the first line of the composed Telegram
    message, not visible UI; keep the brand and the phrase "Заявка с сайта / Enquiry from the …
    website".

## 10. Quality gates

Before marking a content change done:

1. `pnpm check:i18n` (`scripts/check-i18n.mjs`) — structure parity across the three catalogues:
   identical key paths, types and array lengths, identical numeric/boolean literals, identical ICU
   placeholder names, no unexpected empty strings, no TODO/lorem leftovers. It does not compare prose
   values, so brand names, prices, dates and project names can differ per locale as documented above.
2. `python3 -c "import json; json.load(open('messages/be.json')); json.load(open('messages/en.json'))"`
   — strict JSON validity (also run for `ru.json`).
3. ICU smoke test with FormatJS (the parser behind next-intl): parse and format every string with
   `{year: 2026, days: 3}`, then verify plural outputs for 1/2/5 days in each locale.
4. `prettier --check messages/be.json messages/en.json` — the two translated catalogues are
   Prettier-clean (tab indent, 100 columns).
5. Human review: read the changed string in all three languages next to each other; check the
   rendering context (heading accent, button width, card height).

First-pass verification results (26 November 2026):

- 491 string leaves in each catalogue; `node scripts/check-i18n.mjs` → “i18n catalogs are in sync
  (ru, be, en; 491 strings)”.
- 0 problems and 0 warnings from the temporary deep-parity check; types, array lengths, IDs, URLs,
  numeric values, tech tags and ICU placeholders match `ru.json`.
- ICU parse/format: 1 473 strings across the three catalogues, 0 errors.
- Plural check: ru `1 день / 2 дня / 5 дней`, be `1 дзень / 2 дні / 5 дзён`, en `1 day / 2 days`.
- No Russian `и/щ/ъ` characters or untranslated Russian words in `be.json`; the only Latin-script
  tokens in `be.json` are the technical names listed in §6.
- No straight quotes or apostrophes in any catalogue.

## 11. Source-copy issues reported to the Lead

These are problems in `messages/ru.json` found during translation. `ru.json` is the Lead's file and
was **not** edited by content; the translations use the corrected forms.

1. FAQ item 9: «Русский, **беларуский** и английский» — should be «белорусский». Fixed in
   be/en as «беларуская» / "Belarusian".
2. FAQ item 2: «**Копирайт** и подбор изображений» — in context this means copywriting, but
   «копирайт» strictly means copyright. Suggested «Копирайтинг». Translated as
   «Капірайтынг» / "Copywriting".
3. Why item 02: «за одну-две недели» — typographically an en dash is preferable
   («одну–две»), as the copy uses en dashes for ranges elsewhere.
4. Minor: `messages/ru.json` is not Prettier-clean (short arrays are expanded); the be/en files are
   Prettier-clean. Run `pnpm format` when convenient so `format:check` passes for all three.

## 12. Open items

- Native-speaker proofread of `be.json` is recommended before launch. The catalogue follows official
  Belarusian orthography (ў/і/ё, apostrophe) and avoids known Russianisms, but a native editor should
  still read it once end-to-end.
- If the Lead fixes the three Russian issues above, no change is needed in be/en (they already use the
  corrected wording); only `ru.json` needs the edit.
- If project names or case URLs change, update all three catalogues' `name`/`summary`/`liveUrl` together
  (URLs must stay identical across locales).
