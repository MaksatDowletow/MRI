// rsnaSnippets.js
// RSNA.txt we kliniki şablonyň esasy bölümlerini türkmençe taýýar wariant hökmünde hödürleýär.
// Her wariant lukmana birki sekuntda patologik we kadaly ýagdaýlary belläp, netije bölegini awto-döretmäge kömek edýär.

export const RSNA_SNIPPETS = [
  {
    id: "artefacts",
    title: "Artefaktlaryň barlygy",
    options: [
      "Artefaktlar ýok.",
      "Barlag wagtynda näsagyň hereketinden dörän hereket artefaktlary bar.",
      "Metal klips proýeksiýasynyň ýakasynda ýerli distorsiýa artefaktlary bar (mysal: sag SMA-nyň M1 segmenti ugry).",
      "Demir elementli sinus/protez sebäpli signalyň ýerli peselmegi we distorsiýasy bellidir.",
    ],
  },
  {
    id: "examType",
    title: "Barlagyň tipi we deňeşdirmesi",
    options: [
      "Birinji gezek ýerine ýetirilen MRT barlagy.",
      "Gaýtadan geçirilen barlag, öňki MRT bilen deňeşdirme mümkin boldy.",
      "Öňki barlag bilen deňeşdirme: ____ seneden.",
      "Epilepsiýa ýagdaýynda Silwiý aryklygyna paralel we perpendikulýar ýörite kosý kesimler ýerine ýetirildi.",
    ],
  },
  {
    id: "cranialShape",
    title: "Çelek şekili (kraniometriýa)",
    options: [
      "Mezosefalik tip, kraniostenoz alamaty ýok.",
      "Dolihosefalik / brahiosefalik konfigurasiýa, indeks görkezilen.",
      "Çelek simmetrik, deformasiýa ýok, ÇMT täsirli üýtgeme tapylmady.",
      "Çelek çukurçalary adaty, tentorium ýa-da sinuslaryň süýşmesi ýok.",
      "Kraniotomiýadan soňky ýagdaý: süňk plastinkasy bir tekizlikde, prolaps ýok.",
    ],
  },
  {
    id: "boneDefect",
    title: "Operasiýadan soňky süňk defektleri",
    options: [
      "Süňk defekti ýok, aponewroz derejesinde üýtgeme tapylmady.",
      "Bir taraply defekt (** mm), supra- ýa-da sub-aponewrotik suwuklyk (** mm) bilen.",
      "Köp sanly defekt, deri-aponewrotik flap bilen örtülen, rubtsow üýtgemeleri bar.",
      "Süňk plastinkasy beýni boşlygyna ... mm çenli çuň giren.",
    ],
  },
  {
    id: "brainDefect",
    title: "Operasiýadan soň beýni dokumasy",
    options: [
      "Parenhimal rezeksiýa tapylmaýar.",
      "Rezeksiýa edilen beýni böleginiň projektsiýasy görkezilen, suwuklykly boşluk (** mm) bilen.",
      "Deri aşagynda suwuklykly boşluk (** mm), perifokal çişme ýok.",
    ],
  },
  {
    id: "differentiation",
    title: "Ýiti we ak maddanyň differensiýasiýasy",
    options: [
      "Differensiýasiýa aýdyň, ojak görnüşli üýtgeme tapylmady.",
      "Geterotopiýa ojaklary ýok, gippokamplar simmetrik.",
      "Geterotopiýa ojaklary bar, gyralarda (** mm) disembriogene tikmileri.",
      "Gippokamplaryň asimmetrik atrofiýasy ýa-da siňekli üýtgemeleri bellidir.",
    ],
  },
  {
    id: "dyscirculatory",
    title: "Diskirkulýator (işemiýa) ojaklar",
    options: [
      "Ojak görnüşli üýtgeme ýok (Fazekas 0).",
      "Subkortikal ak maddada birnäçe gipersistens ojak (Fazekas 1).",
      "Periwentrikulýar birleşýän ojaklar (Fazekas 2), ölçegi (**/**/** mm).",
      "Giň ýaýran gipersistens sahalar (Fazekas 3), MTA / Koedam boýunça atrofiki baha ýokarlan.",
    ],
  },
  {
    id: "hemosiderosis",
    title: "Hemosideroz ojaklary",
    options: [
      "Hemosiderin çökündileri tapylmady.",
      "Ýeke-täk hemosideroz halkasy (** mm) parenhimal gyrasynda.",
      "Köp mikrogemorragik ojaklar (** mm çenli), diffuz siderofag görnüşi.",
    ],
  },
  {
    id: "hemorrhage",
    title: "Gemorragik üýtgemeler",
    options: [
      "Gan akma alamaty ýok, T2-gipo intensiw sahalar tapylmady.",
      "Parenhimal ganakma (**/**/** mm), metgemoglobin tapgyry, perifokal çişme bar.",
      "Subdural / epidural gan gatlagy (** mm galyňlykda), massa-effekt bahalandyryldy.",
      "Subarahnoidal gan: bazal sisternalarda ýa-da konweksital ýerleşişde gatlakly görnüşde.",
    ],
  },
  {
    id: "hyperhydration",
    title: "Gipergidratasiýa / demýelinizasiýa",
    options: [
      "Gipergidratasiýa alamaty ýok, mass-effekt ýok.",
      "Pontin demýelinizasiýa görnüşinde simmetrik gipersistens sahalar, kontrast toplamaýar.",
      "Diffuz gipergidratasiýa, sulkular ýumşak derejede basylan.",
    ],
  },
  {
    id: "acuteDwi",
    title: "DWI boýunça täze ojaklar",
    options: [
      "DWI/ADC kartasynda täze ojak ýok.",
      "Akut ishemiki ojak (** mm) ýokary signal bilen, ýerleşişi görkezilýär.",
      "Birnäçe akut ojak, arteriýanyň üpjünçilik zolaklaryna gabat gelýär.",
    ],
  },
  {
    id: "cysts",
    title: "Kistalar",
    options: [
      "Kista tapylmady.",
      "Arahnoidal kista (**/**/** mm), massa-effekt bermeýär, kontrast toplamaýar.",
      "Retrotserebellýar suwuklyk boşlugy, hemosideroz halkasy ýok.",
      "Postgemorragik kista, diwary inçe, septalar we kontrast toplama ýok.",
    ],
  },
  {
    id: "mass",
    title: "Goşmaça derejeli döreme (tumor / mass)",
    options: [
      "Obýem görnüşli täsir ýok, mass-effekt gözlenmedi.",
      "Intrapararahnoidal mass (**/**/** mm), konturlary aýdyň, kontrast toplama aýratyn häsiýetlidir.",
      "Ekstraserebral massa, dura bilen giňden aragatnaşykda, perifokal çişme orta derejesinde.",
    ],
  },
  {
    id: "resection",
    title: "Beýni dokumasynyň rezeksiýasyndan soňky ýagdaý",
    options: [
      "Rezeksiýa meýdany görkezilmedi, beýni integral.",
      "Rezeksiýa meýdany (**/**/** mm), içindäki mazmuny suwuklykly, mass-effekt ýok.",
    ],
  },
  {
    id: "perivascular",
    title: "Periwaskulýar boşluklar",
    options: [
      "Kriblýurlar adaty çäkde, giňelme ýok.",
      "Periwaskulýar boşluklar giňän, kognitiw bozulmalar bilen arabaglanyşygy baha bermeli.",
    ],
  },
  {
    id: "csf",
    title: "Likworly giňişlikler",
    options: [
      "Garynjyklar simmetrik, ýaş derejesine laýyk, ballon görnüşli üýtgeme ýok.",
      "Ventrikulomegaliýa: sag/sol merkezi bölüm ... mm; injik indeksi patologiýa derejesinde.",
      "Bazal sisternalar giňän, gyralaryň giňelmegi orta/küşgür derejede.",
      "Subaraknoidal gyralarda ýagtylyk giňişligine çuň girme we asimmetriýa bar.",
    ],
  },
  {
    id: "vascular",
    title: "Damarlaryň patologiýasy",
    options: [
      "Aneurizma, stenoz ýa-da patologik egilme tapylmady, Willizýew halkasy ýapyk.",
      "ASPECTS skala boýunça bahalandyrma: *** bal.",
      "Venoz / kaverneöz angioma (** mm), mass-effekt ýok, kontrast toplama aýratyn häsiýetlidir.",
    ],
  },
  {
    id: "pituitary",
    title: "Gipofiz we selýar oblast",
    options: [
      "Türk sedlesi we gipofiz görnüşi adaty, ölçegi norma degişli.",
      "Gipofizde uzynlygy sagittal __ mm, koronar __ mm, akssial __ mm; adeno-neýrohypofiz differensiýasy saklanýar.",
      "Supra-selýar sisterna ... mm aşak prolabirlenen, woronka süýşmesi ýok/ bar.",
    ],
  },
  {
    id: "orbit",
    title: "Orbitanyň gurluşlary",
    options: [
      "Göz çüýşeleri we süňk diwarlary adaty, simmetrik, stýeklowid doku homogen.",
      "Lens T2-gipo intensiw, myşsalar galyňlaşmady, wenalar giňän däl.",
      "Orbital süýrtmäde çuwly çişme ýa-da düwme ýok, ölçegi (** mm) bolan düwme görkezilýär.",
    ],
  },
  {
    id: "cranialNerves",
    title: "Kranial nerwler / diň geçelgeleri",
    options: [
      "Içki diň geçelgeleri giňän däl, VII-VIII nerwleriň görnüşi adaty.",
      "Kranial nerwler damarlar bilen ýanaşyk, galyňlaşma ýok, kontrast toplama ýok.",
    ],
  },
  {
    id: "sinuses",
    title: "Burun-dürsep boşluklary we wagt süňkleri",
    options: [
      "Paranazal sinuslar howaly, eksudasiýa ýok, mastoid öýjükler arassa.",
      "Mukozanyň galyňlaşmagy (** mm) alnynyň/garylgy sinuslarynda, orta çeýe süýşme bilen.",
      "Wagt süňkleriniň pýramidasy adaty, içki diň kanaly giňän däl.",
    ],
  },
  {
    id: "subcutaneous",
    title: "Deri aşagy gurluşlary",
    options: [
      "Deri aşagy ojaklary ýok.",
      "Deri aşagynda (** mm) ölçegdäki düwme / suwuklykly ojak bar, gidremasiýa derejesi görkezilýär.",
    ],
  },
  {
    id: "result",
    title: "Netije üçin taýýar sözlemler",
    options: [
      "Patologiki täsir tapylmady, MRT maglumatlary norma bilen gabat gelýär.",
      "Diskirkulýator ensefalopatiýanyň magnit-rezonans alamatlary (Fazekas ...).",
      "Gemorragik ojak / kista / massanyň ýerleşişi görkezilen, kliniki korelýasiýa maslahat berilýär.",
    ],
  },
];
