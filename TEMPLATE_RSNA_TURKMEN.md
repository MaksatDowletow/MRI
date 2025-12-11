# Beýni MRI RSNA Template (docxtemplater)

This document describes the modern, machine-readable RSNA-style DOCX template for the Turkmen-language brain MRI report `Beýni_kada_.docx`. It lists sections, placeholders, styling suggestions, and a sample JSON payload for docxtemplater.

## Bölümler (Sections)

1. **Umumy maglumatlar**
2. **Barlag akymy**
3. **Gurluşlar we simmetriýa**
4. **Likwor saklaýan giňişlikler**
5. **Ojaklaýyn üýtgemeler**
6. **Netije**
7. **Maslahat**

## Placeholder Table

| Bölüm | Turkmençe meýdan | Placeholder (snake_case) | Type |
| --- | --- | --- | --- |
| Umumy maglumatlar | Barlagyň senesi | `{{exam_date}}` | date |
| Umumy maglumatlar | Familiyasy, ady | `{{patient_name}}` | string |
| Umumy maglumatlar | Bölüm | `{{department}}` | string |
| Umumy maglumatlar | Jynsy | `{{sex}}` | enum |
| Umumy maglumatlar | Doglan ýyly | `{{birth_year}}` | number |
| Umumy maglumatlar | Näsagyň kody | `{{patient_id}}` | string |
| Barlag akymy | Barlag usuly (Umumy, T1, T2, T2_tirm, Diffuz, MRT angiografiýa, FLAIR) | `{{exam_methods}}` | enum[] |
| Barlag akymy | Barlag (Ilkinji gezek / gaýtadan) | `{{exam_type}}` | enum |
| Barlag akymy | Artefaktlar | `{{artefacts}}` | multiline_text |
| Barlag akymy | Kesim ugry | `{{slice_orientation}}` | string |
| Gurluşlar we simmetriýa | Kelle çanak | `{{skull}}` | multiline_text |
| Gurluşlar we simmetriýa | Tikinleri | `{{sutures}}` | multiline_text |
| Gurluşlar we simmetriýa | Simmetriýa | `{{symmetry}}` | multiline_text |
| Gurluşlar we simmetriýa | Kelleçanagyň çukurjuklary | `{{cranial_fossae}}` | multiline_text |
| Gurluşlar we simmetriýa | Operasiýadan soňky üýtgemeler | `{{postsurgical_changes}}` | multiline_text |
| Gurluşlar we simmetriýa | Ak we çal maddanyň differensasiýasy | `{{white_gray_diff}}` | multiline_text |
| Gurluşlar we simmetriýa | Geterotopiýa | `{{heterotopia}}` | multiline_text |
| Gurluşlar we simmetriýa | Gippokamp simmetriýasy | `{{hippocampal_symmetry}}` | multiline_text |
| Gurluşlar we simmetriýa | Gippokampdaky ojaklar | `{{hippocampal_lesions}}` | multiline_text |
| Gurluşlar we simmetriýa | Beýni parenhimasynyň ojaklaýyn üýtgemeleri | `{{parenchymal_lesions}}` | multiline_text |
| Likwor saklaýan giňişlikler | Garynjyklar | `{{ventricles}}` | multiline_text |
| Likwor saklaýan giňişlikler | Bazal sisternalar | `{{basal_cisterns}}` | multiline_text |
| Likwor saklaýan giňişlikler | Konweksital subarahnoidal giňişlikler | `{{subarachnoid_spaces}}` | multiline_text |
| Ojaklaýyn üýtgemeler | Ojaklaýyn üýtgemeler (diskirkulýator, ganakma, gemosideroz, gipergidratasiýa we ş.m.) | `{{focal_changes}}` | multiline_text |
| Netije | Netije | `{{netije}}` | multiline_text |
| Maslahat | Maslahat | `{{maslahat}}` | multiline_text |
| Skalalar/Skoring | Fazekas skory | `{{fazekas_score}}` | enum |
| Skalalar/Skoring | MTA (hippokamp atrofiýasy) | `{{mta_score}}` | enum |
| Skalalar/Skoring | GCA (global cortical atrophy) | `{{gca_score}}` | enum |
| Skalalar/Skoring | Evans index | `{{evans_index}}` | number |
| Skalalar/Skoring | Diskirkulýator ensefalopatiýa derejesi | `{{dyscirculatory_stage}}` | enum |

## Skoring Placement

- **Gurluşlar we simmetriýa**: Include Fazekas skory (`{{fazekas_score}}`), MTA (`{{mta_score}}`), GCA (`{{gca_score}}`), and Evans index (`{{evans_index}}`) after parenchymal and hippocampal observations.
- **Netije**: Summarize "Diskirkulýator ensefalopatiýa derejesi" using `{{dyscirculatory_stage}}` to pair the numeric Fazekas/MTA findings with clinical staging.

## DOCX Markup Guidance

- Use section headers styled with **Heading 2** (e.g., “Barlag akymy”). Maintain RSNA-like bold, small-caps if desired, but consistent heading styles across all sections.
- Use **Normal** style for content lines.
- Insert placeholders inline within Turkmen text. Examples:
  - `Barlagyň senesi: {{exam_date}}`
  - `Familiyasy, ady: {{patient_name}}`
  - `Bölüm: {{department}}`
  - `Jynsy: {{sex}}`
  - `Doglan ýyly: {{birth_year}}`
  - `Näsagyň kody: {{patient_id}}`
  - `Barlag usuly: {{#exam_methods}}{{.}}{{#unless @last}}, {{/unless}}{{/exam_methods}}`
  - `Barlag: {{exam_type}}`
  - `Artefaktlar: {{artefacts}}`
  - `Kesim ugry: {{slice_orientation}}`
  - `Kelle çanak: {{skull}}`
  - `Tikinleri: {{sutures}}`
  - `Simmetriýa: {{symmetry}}`
  - `Kelleçanagyň çukurjuklary: {{cranial_fossae}}`
  - `Operasiýadan soňky üýtgemeler: {{postsurgical_changes}}`
  - `Ak we çal maddanyň differensasiýasy: {{white_gray_diff}}`
  - `Geterotopiýa: {{heterotopia}}`
  - `Gippokamp simmetriýasy: {{hippocampal_symmetry}}`
  - `Gippokampdaky ojaklar: {{hippocampal_lesions}}`
  - `Beýni parenhimasynyň ojaklaýyn üýtgemeleri: {{parenchymal_lesions}}`
  - `Garynjyklar: {{ventricles}}`
  - `Bazal sisternalar: {{basal_cisterns}}`
  - `Konweksital subarahnoidal giňişlikler: {{subarachnoid_spaces}}`
  - `Ojaklaýyn üýtgemeler: {{focal_changes}}`
  - `Fazekas skory: {{fazekas_score}}`
  - `MTA: {{mta_score}}`
  - `GCA: {{gca_score}}`
  - `Evans index: {{evans_index}}`
  - `Diskirkulýator ensefalopatiýa derejesi: {{dyscirculatory_stage}}`
  - `Netije: {{netije}}`
  - `Maslahat: {{maslahat}}`
- For repeatable lesion lists, wrap block-level placeholders with Mustache loops, e.g., `{{#lesions}}- {{location}}: {{description}}{{/lesions}}`. If no repeats are needed, keep single multiline fields as above.
- Keep placeholders in the same line as Turkmen labels to minimize formatting drift when rendered by docxtemplater. Avoid splitting placeholders across runs.
- Style placeholders identically to surrounding text; do not color or italicize them to keep clinical look consistent.

## Sample JSON `reportData`

```json
{
  "patient_name": "Orazow Akmyrat",
  "exam_date": "2024-05-18",
  "department": "Nevrologiýa",
  "sex": "Erkek",
  "birth_year": 1975,
  "patient_id": "BRN-2024-0518",
  "exam_methods": ["T1", "T2", "Diffuz", "FLAIR"],
  "exam_type": "Ilkinji gezek",
  "artefacts": "Artefaktlar ýok.",
  "slice_orientation": "Ak, sagittal we koronal kesimler.",
  "skull": "Kelle çanagynda ysnyşykly defekt ýok.",
  "sutures": "Tikinleri ýapylandyr, patalogik açylyş ýok.",
  "symmetry": "Orta çyzyk saklanýar, taraplaýyn süýşme ýok.",
  "cranial_fossae": "Öňki, orta we yzky çukurjuklarda patologiýa ýok.",
  "postsurgical_changes": "Ýok",
  "white_gray_diff": "Ak we çal maddanyň differensasiýasy saklanýar.",
  "heterotopia": "Ýok",
  "hippocampal_symmetry": "Gippokamplar simmetrikdir.",
  "hippocampal_lesions": "Ojak tapylmady.",
  "parenchymal_lesions": "Dermanlandyryjy däl ojaklar ýüze çykmady.",
  "ventricles": "Garynjyklar giňemändir, simmetrikdir.",
  "basal_cisterns": "Bazal sisternalar açyk, gysylma ýok.",
  "subarachnoid_spaces": "Konveksital subarahnoidal giňişlikler kadaly.",
  "focal_changes": "Patologik süýşme we ojaklar hasaba alynmady.",
  "fazekas_score": 1,
  "mta_score": 0,
  "gca_score": 0,
  "evans_index": 0.26,
  "dyscirculatory_stage": "I",
  "netije": "Beýni MRI-da anyk patologik üýtgeşiklik tapylmady.",
  "maslahat": "Dinamiki gözegçilik 12 aýdan gaýtalamak maslahat berilýär."
}
```

