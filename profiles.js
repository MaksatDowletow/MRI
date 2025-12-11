// profiles.js
// Kliniki profilleri we olaryň deslapky dolduryşlaryna degişli maglumatlar.
// renderForm/app.js bu maglumatlary ulanyp, reportState-iň başlangyç ýagdaýyny üýtgedip biler.

export const CLINICAL_PROFILES = {
  kadaly: {
    id: "kadaly",
    label: "Kadaly MRT (profilaktika)",
    defaults: {
      exam_types: ["Umumy", "T1", "T2", "T2_tirm", "Diffuz", "MRT angiografiýa"],
      artefacts: "Artefaktlar ýok.",
      slice_plane: "tra, sag, cor kesimlerde.",
      skull: "Sütünli gurluş, patologiýa ýok.",
      symmetry: "Orta çyzyk boýunça simmetrik.",
      parenchyma: "Diffuziýa çäklendirilmesi tapylmady.",
    },
  },
  dyscirculatory: {
    id: "dyscirculatory",
    label: "Diskirkulýator",
    defaults: {
      parenchyma: "Subkortikal we periwentrikulýar ak maddada beýleki kislorod ýetmezçiligi bilen baglanyşykly üýtgemeler.",
    },
  },
  postoperative: {
    id: "postoperative",
    label: "Operasiýadan soňky",
    defaults: {
      skull: "Kraniotomiýa yzlary.",
      parenchyma: "Operasiýa meýdanynda glioz/edema gözegçiligi.",
    },
  },
};
