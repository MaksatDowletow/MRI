// rsnaSnippets.js
// RSNA.txt faýlyndaky patologiýa beýanlamalarynyň türkmençe taýýar wariantlary.
// Ulanyjylar bu wariantlary saýlap, formadaky açyk meýdanlara gönüden goşup bilerler.

export const RSNA_SNIPPETS = [
  {
    id: "artefacts",
    title: "Artefaktlar",
    options: [
      "Artefaktlar tapylmady.",
      "Barlag wagtynda näsagyň hereketi sebäpli hereket artefaktlary bellidir.",
      "Metall klipsiniň proýeksiýasyna gabat gelýän ýerli distorsiýa artefaktlary bar.",
      "Sinus ýa-da protez sebiti bilen bagly demirden galýan artefaktlar ýüze çykýar.",
    ],
  },
  {
    id: "examContext",
    title: "Barlag konteksti",
    options: [
      "Ilkinji gezek geçirilýän MRT barlagy.",
      "Gaýtadan MRT: öňki barlag bilen deňeşdirilende dinamika kesgitlenýär.",
      "Epilepsiýa boýunça: Silwiý aryklygy boýunça paralel we perpendikulýar kosý kesimler ýerine ýetirildi.",
      "Epizod boýunça ýüze çykan tutgaý ýagdaýlary sebäpli MRT barlagy tekrarlanyldy, öňki netijeler bilen deňeşdirilýär.",
    ],
  },
  {
    id: "skullShape",
    title: "Kelle çanagy we operasiýa yzlary",
    options: [
      "Kelle çanagynyň görnüşi mezo-/dolihosefalik, patologiýa ýok.",
      "Kraniostenoza gabat gelýän tikinleriň öňünden ýapylmagy bellidir.",
      "Çep/ sag ýüzde kraniotomiýa yzlary, plastinka bir tekizlikde, beýni boşlygyna prolaps ýok.",
      "Kelle çanagynyň defekti (***) mm ölçegde, rubtsow-skleroz üýtgemeleri bilen.",
      "Subaponerwrotik suwuklyk gatlagy çenli (***) mm çenli galyňlykda ýerleşýär.",
      "Kranial çukurlaryň konfigurasiýasy kadaly, simmetriýa saklanýar, massa-effekt ýok.",
      "Operasiýadan soňky sagalma: defekt (***) mm, plastinka beýni boşlygyna (***) mm çenli prolaps edýär.",
    ],
  },
  {
    id: "parenchyma",
    title: "Ak we çal maddanyň differensasiýasy",
    options: [
      "Ak we çal maddanyň differensasiýasy aýdyň, ojak görnüşli üýtgäge ýol berilmeýär.",
      "Geterotopiýa alamatlary ýüze çykmady.",
      "Gippokamplar simmetrik, patologik signal üýtgemesi ýok.",
      "Gippokamplaryň bir taraplaýyn atrofik üýtgemeleri bar, mediál ýüzde siňek ýok.",
      "Beýni parenhimasynyň gyralarynda siňekli, ölçegi (***) mm çenli disembriogene tikmileri bar.",
    ],
  },
  {
    id: "dyscirculatory",
    title: "Diskirkulýator ojaklar",
    options: [
      "Subkortikal ak maddada azyndan birnäçe kiçi gipersistens ojaklar (Fazekas 1).",
      "Periwentrikulýar ak maddada birleşýän gipersistens ojaklar (Fazekas 2).",
      "Giň ýaýran gipersistens sahalar, diskirkulýator ensefalopatiýa derejesi 3 (Fazekas 3).",
      "Ojaklaryň ölçegi (***) x (***) x (***) mm, simmetriýa saklanýar.",
      "Ak maddanyň ön/arka bölümlerinde ýaşaýyş derejesi boýunça Fazekas 0-1, täze diffuz üýtgän sahalar ýok.",
    ],
  },
  {
    id: "hemosiderosis",
    title: "Hemosideroz ojaklary",
    options: [
      "Beýni parenhimasynyň gyralarynda ýeke-täk hemosiderin çökündileri bar.",
      "Köp sanly mikrogemorragik ojaklar, ölçegi (***) mm çenli.",
      "Diffuz siderofag ojaklary, öňki ganakma bilen baglanyşykly görnüşde.",
      "Dural ýanynda siňekli, T2-gipo intensiw halkalar görnüşinde siňekli hemosideroz gatlaklary bar.",
    ],
  },
  {
    id: "hemorrhage",
    title: "Gemorragiýa",
    options: [
      "Parenhimal ganakma ojaklary: anatomiki taýdan (***) sebitinde ýerleşýär, ölçegi (***) x (***) x (***) mm.",
      "Ganakma ojaklarynda perifokal ödem bar, metgemoglobin tapgyry.",
      "Subdural gematoma (***) mm galyňlykda, massa-effekt ujypsyz.",
      "Ventrikulýar gematoma: ganyň ýüzmegi (***) garynjykda bellidir.",
      "Serebellýar gematoma (***) mm, dördünji garynjak siňek bilen, bulbars simptomlary mümkin.",
    ],
  },
  {
    id: "hyperhydration",
    title: "Gipergidratasiýa / demýelinizasiýa",
    options: [
      "Pontin demýelinizasiýa görnüşinde T2/FLAIR gipersistens sahalar, kontrast toplamaýar.",
      "Simmetrik ýerleşýän B37/B38 derejeli siňekli sahalar, massa-effektsiz.",
      "Beýni ödemi ýok, sulkular aýratynlygy saklanýar, diffuz gipergidratasiýa alamaty ýok.",
    ],
  },
  {
    id: "acuteDwi",
    title: "DWI boýunça täze ojaklar",
    options: [
      "DWI/ADC kartasynda täze, kiçi gipersistens ojaklar ýok.",
      "DWI-da ýokary signal, ADC-da pes: akut ishemiki ojak (***) mm, lokalizasiýasy (***) sebitinde.",
      "Birnäçe akut ojaklar, arteriýanyň üpjünçilik zolaklaryna laýyklykda ýerleşýär.",
    ],
  },
  {
    id: "cysts",
    title: "Kistler",
    options: [
      "Arahnoidal kista: (***) sebitinde, ölçegi (***) x (***) x (***) mm, massa-effekt bermeýär.",
      "Retrotserebellýar suwuklyk boşlugy, obodkada hemosideroz ýok, suwuklygy dury.",
      "Postgemorragik kista: içindäki septalar ýok, diwary inçe, kontrast toplamaýar.",
      "Köplük kista: ýokardaky boşluklar bilen gatnaşyk saklanýar, gysyş alamaty ýok.",
    ],
  },
  {
    id: "massEffect",
    title: "Massa-effekt we dinamika",
    options: [
      "Massa-effekt we orta çyzyk süýşmesi ýok, üçünji garynjak simmetrik.",
      "Orta çyzyk (***) mm çep/ sag tarapa süýşen, unkus herniýasy şübheli.",
      "Öňki barlag bilen deňeşdirilende täze ojaklar ýüze çykýar, ölçegi (***) mm çenli.",
      "Dinamika boýunça öňki gemorragiýa sahalarynyň rezorpsiýasy, perifokal ödem azalan.",
    ],
  },
  {
    id: "csf",
    title: "Likwor saklaýan giňişlikler",
    options: [
      "Garynjyklar simmetrik, giňelmeýär, orta çyzyk saklanýar.",
      "Ventrikulomegaliýa: lateral garynjyklar giňelýär, Evans görkezijisi ***, üçünji garynjak giňelmegi bilen.",
      "Bazal sisternalar we konweksital subarahnoidal giňişlikler giňämändir.",
      "Subaraknoidal giňişliklerde siňek ýok, liquor dinamikasy bozulmaýar.",
      "Serebral atrofiýa fonunda sulkular giňelipdir, subaraknoidal giňişlikleriň gatnaşygy saklanýar.",
    ],
  },
  {
    id: "vascular",
    title: "Damar gurluşlary",
    options: [
      "Angiografik görnüşde aneurizma ýa-da arteriowenoz malformasiýa ýüze çykmady.",
      "ASPECTS boýunça bahalandyrma: *** bal.",
      "Damar diwaryndaky aterosklerotik üýtgemeler sebäpli daralma şübheli, goşmaça angiografiýa maslahat berilýär.",
    ],
  },
  {
    id: "extra",
    title: "Paranazal sinuslar we beýleki ýokarky gurluşlar",
    options: [
      "Paranazal sinuslar we mastoid öýjükler howaly, eksudasiýa ýok.",
      "Mastoid prosesde ortaça derejeli süýşme we suwuklyk derejesi bar.",
      "Alnynyň we garylgy sinuslarynda mukozanyň galyňlaşmagy (***) mm çenli bellidir.",
    ],
  },
];
