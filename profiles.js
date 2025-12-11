// profiles.js
// Kliniki profilleri we olaryň deslapky dolduryşlaryna degişli maglumatlar.
// renderForm/app.js bu maglumatlary ulanyp, reportState-iň başlangyç ýagdaýyny üýtgedip biler.

export const CLINICAL_PROFILES = {
  kadaly: {
    id: "kadaly",
    label: "Kadaly MRT (profilaktika)",
    description: "Pes riskli, şikaýatsyz näsaglar üçin doly barlag sekansiýasy.",
    defaults: {
      exam_types: ["Umumy", "T1", "T2", "T2_tirm", "Diffuz", "MRT angiografiýa"],
      artefacts: "Artefaktlar ýok.",
      slice_plane: "tra, sag, cor kesimlerde.",
      skull: "Sütünli gurluş, patologiýa ýok.",
      symmetry: "Orta çyzyk boýunça simmetrik.",
      parenchyma: "Diffuziýa çäklendirilmesi tapylmady.",
      ventricles: "Wentrikullar giňelmedik, orta çyzyk siljemeýär.",
      vascular: "Aýdyň patologiýa ýok.",
      sinuses: "Paranazal sinuslarda patologik sütünlenme ýok.",
    },
  },
  dyscirculatory: {
    id: "dyscirculatory",
    label: "Diskirkulýator",
    description: "Kislorod ýetmezçiligi bilen baglanyşykly üýtgemeleriň standart beýanlamasy.",
    defaults: {
      parenchyma: "Subkortikal we periwentrikulýar ak maddada beýleki kislorod ýetmezçiligi bilen baglanyşykly üýtgemeler.",
      vascular: "Aterosklerotik üýtgemeler boýunça goşmaça angiografiýa maslahat berilýär.",
    },
  },
  postoperative: {
    id: "postoperative",
    label: "Operasiýadan soňky",
    description: "Operasiýadan soňky gözegçilik: kraniotomiýa we operasiýa meýdanyny belläp geçýär.",
    defaults: {
      skull: "Kraniotomiýa yzlary.",
      parenchyma: "Operasiýa meýdanynda glioz/edema gözegçiligi.",
    },
  },
};
