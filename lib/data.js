"use client";

export function mkDepts(){return [
  {id:"r1",nm:"Capital Region",ch:[{id:"d1",nm:"Lyngby",tp:"Op"},{id:"d2",nm:"Norreport",tp:"Op"},{id:"d9",nm:"Frederiksberg",tp:"Op"},{id:"d10",nm:"Helsingor",tp:"Op"}]},
  {id:"r2",nm:"Southern Denmark",ch:[{id:"d4",nm:"Odense City",tp:"Op"},{id:"d11",nm:"Esbjerg Storcenter",tp:"Op"}]},
  {id:"r3",nm:"Central Jutland",ch:[{id:"d5",nm:"Aarhus Bruuns",tp:"Op"},{id:"d12",nm:"Herning",tp:"Op"}]},
  {id:"r4",nm:"North Jutland",ch:[{id:"d6",nm:"Aalborg Storcenter",tp:"Op"}]},
  {id:"r5",nm:"Zealand",ch:[{id:"d7",nm:"Roskilde",tp:"Op"},{id:"d13",nm:"Naestved",tp:"Op"}]},
  {id:"r6",nm:"Corporate",ch:[{id:"d8",nm:"HQ Ballerup",tp:"Admin"}]}
];}
export function mkCircles(){return [{id:"c1",nm:"Store Manager"},{id:"c2",nm:"Asst. Store Manager"},{id:"c3",nm:"Department Lead"},{id:"c4",nm:"Sales Advisor"},{id:"c5",nm:"Tech Support"},{id:"c6",nm:"Cashier"},{id:"c7",nm:"Warehouse Staff"},{id:"c8",nm:"Service Desk"}];}
export function mkJobProfiles(){return [{id:"jp1",nm:"Store Manager"},{id:"jp2",nm:"Assistant Store Manager"},{id:"jp3",nm:"Department Lead"},{id:"jp4",nm:"Sales Advisor"},{id:"jp5",nm:"Tech Support Specialist"},{id:"jp6",nm:"Cashier"},{id:"jp7",nm:"Warehouse Operative"},{id:"jp8",nm:"Regional Manager"},{id:"jp9",nm:"Service Desk Agent"},{id:"jp10",nm:"Visual Merchandiser"}];}

export var LIBRARY=[
  {id:"l1",nm:"Product Knowledge Essentials",tp:"Path",sk:"Product Knowledge",skLvl:3,ct:null,dur:"3h",cap:50},
  {id:"l2",nm:"Retail Leadership Programme",tp:"Path",sk:"Team Leadership",skLvl:4,ct:null,dur:"6h",cap:20},
  {id:"l3",nm:"Electrical Safety Certification",tp:"Event",sk:"Electrical Safety",skLvl:4,ct:"Electrical Safety Cert",dur:"1 day",cap:15},
  {id:"l4",nm:"AV & Home Cinema Specialist",tp:"Event",sk:"AV Systems",skLvl:5,ct:"AV Specialist Cert",dur:"2 days",cap:12},
  {id:"l5",nm:"Customer Experience Mastery",tp:"Path",sk:"Customer Service",skLvl:5,ct:null,dur:"3h",cap:50},
  {id:"l6",nm:"POS & Returns Training",tp:"Path",sk:"POS Operations",skLvl:3,ct:null,dur:"1.5h",cap:40},
  {id:"l7",nm:"Smart Home & IoT Workshop",tp:"Event",sk:"Smart Home Setup",skLvl:4,ct:null,dur:"4h",cap:18},
  {id:"l8",nm:"Advanced Computer Configuration",tp:"Event",sk:"Computer Setup",skLvl:5,ct:"IT Support Cert",dur:"1 day",cap:10},
  {id:"l9",nm:"Warehouse & Logistics Basics",tp:"Path",sk:"Inventory Management",skLvl:3,ct:null,dur:"2h",cap:30},
  {id:"l10",nm:"Large Appliance Delivery & Install",tp:"Event",sk:"Appliance Installation",skLvl:4,ct:"Installer Cert",dur:"1 day",cap:12}
];

export function mkIni(){return [
  /* ——————— i1: Lyngby Flagship — area-based, mature, high readiness ——————— */
  {id:"i1",nm:"Lyngby Flagship",ds:"Flagship POWER store in Lyngby shopping centre. Largest store in the Capital Region with full department coverage and dedicated service desk. Benchmark location for new concepts.",tp:"Operational",st:"active",
    depts:[
      {did:"d1",dn:"Lyngby",layout:"lt1",areas:[
        {aid:"a1",anm:"TV & Hi-Fi",skillReqs:[{s:"AV Systems",lvl:4},{s:"Product Knowledge",lvl:4}],certReqs:[{c:"AV Specialist Cert"}],roles:[
          {cid:"c3",cn:"Department Lead",cr:"Essential",rq:1,ql:1,gp:0},
          {cid:"c4",cn:"Sales Advisor",cr:"Important",rq:5,ql:5,gp:0},
          {cid:"c7",cn:"Warehouse Staff",cr:"Nice to have",rq:2,ql:2,gp:0}
        ]},
        {aid:"a2",anm:"Computers & Tablets",skillReqs:[{s:"Computer Setup",lvl:4},{s:"Network Basics",lvl:3}],certReqs:[{c:"IT Support Cert"}],roles:[
          {cid:"c3",cn:"Department Lead",cr:"Essential",rq:1,ql:1,gp:0},
          {cid:"c4",cn:"Sales Advisor",cr:"Important",rq:6,ql:6,gp:0},
          {cid:"c5",cn:"Tech Support",cr:"Important",rq:2,ql:2,gp:0}
        ]},
        {aid:"a3",anm:"Phones & Wearables",skillReqs:[{s:"Mobile Setup",lvl:3},{s:"Product Knowledge",lvl:3}],certReqs:[],roles:[
          {cid:"c3",cn:"Department Lead",cr:"Essential",rq:1,ql:1,gp:0},
          {cid:"c4",cn:"Sales Advisor",cr:"Important",rq:4,ql:4,gp:0}
        ]},
        {aid:"a4",anm:"Kitchen & Household",skillReqs:[{s:"Appliance Installation",lvl:3},{s:"Product Knowledge",lvl:3}],certReqs:[{c:"Electrical Safety Cert"}],roles:[
          {cid:"c3",cn:"Department Lead",cr:"Essential",rq:1,ql:1,gp:0},
          {cid:"c4",cn:"Sales Advisor",cr:"Important",rq:4,ql:4,gp:0}
        ]},
        {aid:"a5",anm:"Gaming",skillReqs:[{s:"Console Setup",lvl:3},{s:"Technical Sales",lvl:4}],certReqs:[],roles:[
          {cid:"c3",cn:"Department Lead",cr:"Essential",rq:1,ql:1,gp:0},
          {cid:"c4",cn:"Sales Advisor",cr:"Important",rq:3,ql:3,gp:0}
        ]},
        {aid:"a6",anm:"Checkout & Service",skillReqs:[{s:"POS Operations",lvl:3},{s:"Customer Service",lvl:4}],certReqs:[],roles:[
          {cid:"c6",cn:"Cashier",cr:"Essential",rq:4,ql:4,gp:0},
          {cid:"c8",cn:"Service Desk",cr:"Important",rq:2,ql:2,gp:0}
        ]}
      ]}
    ],
    rev:42000000,inv:1200000,sd:"Q1 2025",td:"Q4 2025",
    sg:[],
    cg:[],
    certs:[{c:"Electrical Safety Cert",total:22,valid:22,exp30:0,exp60:0,expired:0},{c:"AV Specialist Cert",total:8,valid:8,exp30:0,exp60:0,expired:0},{c:"IT Support Cert",total:6,valid:6,exp30:0,exp60:0,expired:0}],
    hist:[{q:"Q1 2025",rd:78,staff:85,skill:74,cert:72},{q:"Q2 2025",rd:83,staff:90,skill:80,cert:76},{q:"Q3 2025",rd:88,staff:93,skill:85,cert:82},{q:"Q4 2025",rd:100,staff:100,skill:100,cert:100}]
  },

  /* ——————— i2: Norreport City — small, flat (no areas), very high readiness ——————— */
  {id:"i2",nm:"Norreport City Store",ds:"Compact city-centre POWER express store at Norreport Station. High foot traffic, limited floor space, focused product selection. No separate departments — all staff rotate across the floor.",tp:"Operational",st:"active",
    depts:[{did:"d2",dn:"Norreport",roles:[
      {cid:"c1",cn:"Store Manager",cr:"Essential",rq:1,ql:1,gp:0},
      {cid:"c2",cn:"Asst. Store Manager",cr:"Important",rq:1,ql:1,gp:0},
      {cid:"c4",cn:"Sales Advisor",cr:"Essential",rq:8,ql:8,gp:0},
      {cid:"c6",cn:"Cashier",cr:"Essential",rq:3,ql:3,gp:0},
      {cid:"c7",cn:"Warehouse Staff",cr:"Nice to have",rq:2,ql:1,gp:1}
    ]}],
    rev:18000000,inv:400000,sd:"Q2 2025",td:"Q4 2025",
    sg:[{s:"Inventory Management",n:1}],cg:[],
    certs:[{c:"Electrical Safety Cert",total:10,valid:10,exp30:0,exp60:0,expired:0}],
    hist:[{q:"Q1 2025",rd:88,staff:92,skill:86,cert:84},{q:"Q2 2025",rd:91,staff:94,skill:89,cert:87},{q:"Q3 2025",rd:94,staff:96,skill:92,cert:90}]
  },

  /* ——————— i3: Aalborg + Esbjerg Expansion — 2 locations, area-based, medium readiness ——————— */
  {id:"i3",nm:"West Coast Expansion",ds:"Two-store expansion into Aalborg Storcenter (ramping up, partially staffed) and Esbjerg Storcenter (newly opened, critical gaps). Shared training resources and cross-location staff rotation planned.",tp:"Operational",st:"active",
    depts:[
      {did:"d6",dn:"Aalborg Storcenter",layout:"lt1",areas:[
        {aid:"a1",anm:"TV & Hi-Fi",skillReqs:[{s:"AV Systems",lvl:4},{s:"Product Knowledge",lvl:3}],certReqs:[{c:"AV Specialist Cert"}],roles:[
          {cid:"c3",cn:"Department Lead",cr:"Essential",rq:1,ql:1,gp:0},
          {cid:"c4",cn:"Sales Advisor",cr:"Important",rq:3,ql:2,gp:1}
        ]},
        {aid:"a2",anm:"Computers & Tablets",skillReqs:[{s:"Computer Setup",lvl:4},{s:"Network Basics",lvl:3}],certReqs:[{c:"IT Support Cert"}],roles:[
          {cid:"c3",cn:"Department Lead",cr:"Essential",rq:1,ql:1,gp:0},
          {cid:"c4",cn:"Sales Advisor",cr:"Important",rq:4,ql:2,gp:2},
          {cid:"c5",cn:"Tech Support",cr:"Important",rq:1,ql:1,gp:0}
        ]},
        {aid:"a3",anm:"Phones & Wearables",skillReqs:[{s:"Mobile Setup",lvl:3},{s:"Product Knowledge",lvl:3}],certReqs:[],roles:[
          {cid:"c4",cn:"Sales Advisor",cr:"Important",rq:3,ql:2,gp:1}
        ]},
        {aid:"a4",anm:"Kitchen & Household",skillReqs:[{s:"Appliance Installation",lvl:3},{s:"Product Knowledge",lvl:3}],certReqs:[{c:"Electrical Safety Cert"}],roles:[
          {cid:"c4",cn:"Sales Advisor",cr:"Important",rq:2,ql:1,gp:1}
        ]},
        {aid:"a6",anm:"Checkout & Service",skillReqs:[{s:"POS Operations",lvl:3},{s:"Customer Service",lvl:3}],certReqs:[],roles:[
          {cid:"c6",cn:"Cashier",cr:"Essential",rq:3,ql:2,gp:1},
          {cid:"c8",cn:"Service Desk",cr:"Important",rq:1,ql:0,gp:1}
        ]}
      ]},
      {did:"d11",dn:"Esbjerg Storcenter",layout:"lt1",areas:[
        {aid:"a1",anm:"TV & Hi-Fi",skillReqs:[{s:"AV Systems",lvl:4},{s:"Product Knowledge",lvl:3}],certReqs:[{c:"AV Specialist Cert"}],roles:[
          {cid:"c3",cn:"Department Lead",cr:"Essential",rq:1,ql:0,gp:1},
          {cid:"c4",cn:"Sales Advisor",cr:"Important",rq:3,ql:1,gp:2}
        ]},
        {aid:"a2",anm:"Computers & Tablets",skillReqs:[{s:"Computer Setup",lvl:4},{s:"Network Basics",lvl:3}],certReqs:[{c:"IT Support Cert"}],roles:[
          {cid:"c3",cn:"Department Lead",cr:"Essential",rq:1,ql:0,gp:1},
          {cid:"c4",cn:"Sales Advisor",cr:"Important",rq:4,ql:1,gp:3},
          {cid:"c5",cn:"Tech Support",cr:"Important",rq:1,ql:0,gp:1}
        ]},
        {aid:"a3",anm:"Phones & Wearables",skillReqs:[{s:"Mobile Setup",lvl:3},{s:"Product Knowledge",lvl:3}],certReqs:[],roles:[
          {cid:"c4",cn:"Sales Advisor",cr:"Important",rq:2,ql:0,gp:2}
        ]},
        {aid:"a4",anm:"Kitchen & Household",skillReqs:[{s:"Appliance Installation",lvl:3},{s:"Product Knowledge",lvl:3}],certReqs:[{c:"Electrical Safety Cert"}],roles:[
          {cid:"c4",cn:"Sales Advisor",cr:"Important",rq:2,ql:0,gp:2}
        ]},
        {aid:"a6",anm:"Checkout & Service",skillReqs:[{s:"POS Operations",lvl:3},{s:"Customer Service",lvl:3}],certReqs:[],roles:[
          {cid:"c6",cn:"Cashier",cr:"Essential",rq:2,ql:1,gp:1},
          {cid:"c8",cn:"Service Desk",cr:"Important",rq:1,ql:0,gp:1}
        ]}
      ]}
    ],
    rev:31000000,inv:3200000,sd:"Q1 2025",td:"Q2 2026",
    sg:[{s:"AV Systems",n:6},{s:"Computer Setup",n:5},{s:"Product Knowledge",n:14},{s:"Mobile Setup",n:4},{s:"Customer Service",n:8},{s:"POS Operations",n:3}],
    cg:[{c:"AV Specialist Cert",n:4,exp:"2025-09-01"},{c:"IT Support Cert",n:3,exp:"2025-10-15"},{c:"Electrical Safety Cert",n:5,exp:"2025-08-01"}],
    certs:[{c:"Electrical Safety Cert",total:16,valid:10,exp30:2,exp60:2,expired:2},{c:"AV Specialist Cert",total:6,valid:3,exp30:1,exp60:1,expired:1},{c:"IT Support Cert",total:4,valid:2,exp30:0,exp60:1,expired:1}],
    hist:[{q:"Q1 2025",rd:28,staff:32,skill:26,cert:20},{q:"Q2 2025",rd:42,staff:50,skill:38,cert:32},{q:"Q3 2025",rd:55,staff:62,skill:50,cert:42}]
  },

  /* ——————— i4: Odense Relocation — projection, area-based, very low readiness ——————— */
  {id:"i4",nm:"Odense POWERHOUSE",ds:"Projected relocation of Odense City store to a new 3,200m\u00B2 POWERHOUSE concept. Triple the floor space with new departments including Smart Home experience zone and photo studio. Opening Q3 2026.",tp:"Operational",st:"projection",
    depts:[
      {did:"d4",dn:"Odense City",layout:"lt2",areas:[
        {aid:"a1",anm:"TV & Hi-Fi",skillReqs:[{s:"AV Systems",lvl:5},{s:"Product Knowledge",lvl:4}],certReqs:[{c:"AV Specialist Cert"}],roles:[
          {cid:"c3",cn:"Department Lead",cr:"Essential",rq:2,ql:0,gp:2},
          {cid:"c4",cn:"Sales Advisor",cr:"Essential",rq:8,ql:0,gp:8}
        ]},
        {aid:"a2",anm:"Computers & Tablets",skillReqs:[{s:"Computer Setup",lvl:5},{s:"Network Basics",lvl:4}],certReqs:[{c:"IT Support Cert"}],roles:[
          {cid:"c3",cn:"Department Lead",cr:"Essential",rq:2,ql:0,gp:2},
          {cid:"c4",cn:"Sales Advisor",cr:"Essential",rq:6,ql:0,gp:6},
          {cid:"c5",cn:"Tech Support",cr:"Important",rq:3,ql:0,gp:3}
        ]},
        {aid:"a3",anm:"Phones & Wearables",skillReqs:[{s:"Mobile Setup",lvl:4},{s:"Product Knowledge",lvl:3}],certReqs:[],roles:[
          {cid:"c3",cn:"Department Lead",cr:"Essential",rq:1,ql:0,gp:1},
          {cid:"c4",cn:"Sales Advisor",cr:"Important",rq:5,ql:0,gp:5}
        ]},
        {aid:"a7",anm:"Smart Home & IoT",skillReqs:[{s:"Smart Home Setup",lvl:4},{s:"Network Basics",lvl:4}],certReqs:[{c:"Electrical Safety Cert"}],roles:[
          {cid:"c3",cn:"Department Lead",cr:"Essential",rq:1,ql:0,gp:1},
          {cid:"c4",cn:"Sales Advisor",cr:"Important",rq:4,ql:0,gp:4},
          {cid:"c5",cn:"Tech Support",cr:"Important",rq:1,ql:0,gp:1}
        ]},
        {aid:"a8",anm:"Photo & Video",skillReqs:[{s:"Camera Systems",lvl:4},{s:"Product Knowledge",lvl:3}],certReqs:[],roles:[
          {cid:"c3",cn:"Department Lead",cr:"Important",rq:1,ql:0,gp:1},
          {cid:"c4",cn:"Sales Advisor",cr:"Nice to have",rq:2,ql:0,gp:2}
        ]},
        {aid:"a4",anm:"Kitchen & Household",skillReqs:[{s:"Appliance Installation",lvl:4},{s:"Product Knowledge",lvl:3}],certReqs:[{c:"Electrical Safety Cert"},{c:"Installer Cert"}],roles:[
          {cid:"c3",cn:"Department Lead",cr:"Essential",rq:1,ql:0,gp:1},
          {cid:"c4",cn:"Sales Advisor",cr:"Important",rq:5,ql:0,gp:5}
        ]},
        {aid:"a6",anm:"Checkout & Service",skillReqs:[{s:"POS Operations",lvl:3},{s:"Customer Service",lvl:4}],certReqs:[],roles:[
          {cid:"c6",cn:"Cashier",cr:"Essential",rq:6,ql:0,gp:6},
          {cid:"c8",cn:"Service Desk",cr:"Essential",rq:3,ql:0,gp:3}
        ]}
      ]}
    ],
    rev:68000000,inv:8500000,sd:"Q1 2026",td:"Q3 2026",
    sg:[{s:"AV Systems",n:10},{s:"Computer Setup",n:8},{s:"Smart Home Setup",n:5},{s:"Product Knowledge",n:24},{s:"Customer Service",n:15},{s:"POS Operations",n:6},{s:"Camera Systems",n:3}],
    cg:[{c:"AV Specialist Cert",n:8},{c:"IT Support Cert",n:6},{c:"Electrical Safety Cert",n:10},{c:"Installer Cert",n:5}],
    certs:[],hist:[]
  },

  /* ——————— i5: HQ Digital Transformation — administrative, flat, single location ——————— */
  {id:"i5",nm:"HQ Digital Transformation",ds:"Back-office transformation at POWER HQ Ballerup. Upskilling the marketing, e-commerce, and support teams to handle the new omnichannel platform and AI-powered customer tools.",tp:"Administrative",st:"active",
    depts:[{did:"d8",dn:"HQ Ballerup",roles:[
      {cid:"c1",cn:"Project Lead",cr:"Essential",rq:2,ql:2,gp:0},
      {cid:"c2",cn:"Team Lead",cr:"Essential",rq:4,ql:3,gp:1},
      {cid:"c4",cn:"E-Commerce Specialist",cr:"Essential",rq:8,ql:6,gp:2},
      {cid:"c5",cn:"Data Analyst",cr:"Important",rq:3,ql:2,gp:1},
      {cid:"c8",cn:"Support Agent",cr:"Important",rq:6,ql:5,gp:1}
    ]}],
    rev:0,inv:2100000,sd:"Q2 2025",td:"Q1 2026",
    sg:[{s:"Data Analytics",n:4},{s:"Omnichannel Strategy",n:6},{s:"AI Tools",n:5},{s:"Team Leadership",n:2}],
    cg:[{c:"Google Analytics Cert",n:3,exp:"2025-12-01"},{c:"Project Management Cert",n:2,exp:"2026-01-15"}],
    certs:[{c:"Google Analytics Cert",total:8,valid:5,exp30:1,exp60:1,expired:1},{c:"Project Management Cert",total:6,valid:4,exp30:0,exp60:1,expired:1}],
    hist:[{q:"Q2 2025",rd:52,staff:60,skill:48,cert:44},{q:"Q3 2025",rd:68,staff:78,skill:62,cert:58}]
  },

  /* ——————— i7: POWER Regional Rollout — multi-location, area-based, varied readiness ——————— */
  {id:"i7",nm:"POWER Regional Rollout",ds:"Four POWER stores across Denmark. Roskilde and Frederiksberg are established top-performers. Aarhus Bruuns is being scaled up with a new Gaming department. Herning is a compact rural store without area divisions.",tp:"Operational",st:"active",
    depts:[
      {did:"d7",dn:"Roskilde",layout:"lt1",areas:[
        {aid:"a1",anm:"TV & Hi-Fi",skillReqs:[{s:"AV Systems",lvl:4},{s:"Product Knowledge",lvl:3}],certReqs:[{c:"AV Specialist Cert"}],roles:[
          {cid:"c3",cn:"Department Lead",cr:"Essential",rq:1,ql:1,gp:0},
          {cid:"c4",cn:"Sales Advisor",cr:"Important",rq:4,ql:4,gp:0},
          {cid:"c7",cn:"Warehouse Staff",cr:"Nice to have",rq:2,ql:2,gp:0}
        ]},
        {aid:"a2",anm:"Computers & Tablets",skillReqs:[{s:"Computer Setup",lvl:4},{s:"Network Basics",lvl:3}],certReqs:[{c:"IT Support Cert"}],roles:[
          {cid:"c3",cn:"Department Lead",cr:"Essential",rq:1,ql:1,gp:0},
          {cid:"c4",cn:"Sales Advisor",cr:"Important",rq:5,ql:5,gp:0},
          {cid:"c5",cn:"Tech Support",cr:"Important",rq:2,ql:2,gp:0}
        ]},
        {aid:"a3",anm:"Phones & Wearables",skillReqs:[{s:"Mobile Setup",lvl:3},{s:"Product Knowledge",lvl:3}],certReqs:[],roles:[
          {cid:"c3",cn:"Department Lead",cr:"Essential",rq:1,ql:1,gp:0},
          {cid:"c4",cn:"Sales Advisor",cr:"Important",rq:3,ql:3,gp:0}
        ]},
        {aid:"a4",anm:"Kitchen & Household",skillReqs:[{s:"Appliance Installation",lvl:3},{s:"Product Knowledge",lvl:3}],certReqs:[{c:"Electrical Safety Cert"}],roles:[
          {cid:"c3",cn:"Department Lead",cr:"Essential",rq:1,ql:1,gp:0},
          {cid:"c4",cn:"Sales Advisor",cr:"Important",rq:3,ql:3,gp:0}
        ]},
        {aid:"a5",anm:"Gaming",skillReqs:[{s:"Console Setup",lvl:3},{s:"Technical Sales",lvl:4}],certReqs:[],roles:[
          {cid:"c3",cn:"Department Lead",cr:"Essential",rq:1,ql:1,gp:0},
          {cid:"c4",cn:"Sales Advisor",cr:"Important",rq:3,ql:2,gp:1}
        ]},
        {aid:"a6",anm:"Checkout & Service",skillReqs:[{s:"POS Operations",lvl:3},{s:"Customer Service",lvl:4}],certReqs:[],roles:[
          {cid:"c6",cn:"Cashier",cr:"Essential",rq:3,ql:3,gp:0},
          {cid:"c8",cn:"Service Desk",cr:"Important",rq:1,ql:1,gp:0}
        ]}
      ]},
      {did:"d9",dn:"Frederiksberg",layout:"lt1",areas:[
        {aid:"a1",anm:"TV & Hi-Fi",skillReqs:[{s:"AV Systems",lvl:4},{s:"Product Knowledge",lvl:3}],certReqs:[{c:"AV Specialist Cert"}],roles:[
          {cid:"c3",cn:"Department Lead",cr:"Essential",rq:1,ql:1,gp:0},
          {cid:"c4",cn:"Sales Advisor",cr:"Important",rq:5,ql:5,gp:0}
        ]},
        {aid:"a2",anm:"Computers & Tablets",skillReqs:[{s:"Computer Setup",lvl:4},{s:"Network Basics",lvl:3}],certReqs:[{c:"IT Support Cert"}],roles:[
          {cid:"c3",cn:"Department Lead",cr:"Essential",rq:1,ql:1,gp:0},
          {cid:"c4",cn:"Sales Advisor",cr:"Important",rq:6,ql:6,gp:0},
          {cid:"c5",cn:"Tech Support",cr:"Important",rq:2,ql:2,gp:0}
        ]},
        {aid:"a3",anm:"Phones & Wearables",skillReqs:[{s:"Mobile Setup",lvl:3},{s:"Product Knowledge",lvl:3}],certReqs:[],roles:[
          {cid:"c3",cn:"Department Lead",cr:"Essential",rq:1,ql:1,gp:0},
          {cid:"c4",cn:"Sales Advisor",cr:"Important",rq:4,ql:4,gp:0}
        ]},
        {aid:"a4",anm:"Kitchen & Household",skillReqs:[{s:"Appliance Installation",lvl:3},{s:"Product Knowledge",lvl:3}],certReqs:[{c:"Electrical Safety Cert"}],roles:[
          {cid:"c3",cn:"Department Lead",cr:"Essential",rq:1,ql:1,gp:0},
          {cid:"c4",cn:"Sales Advisor",cr:"Important",rq:4,ql:4,gp:0}
        ]},
        {aid:"a6",anm:"Checkout & Service",skillReqs:[{s:"POS Operations",lvl:3},{s:"Customer Service",lvl:4}],certReqs:[],roles:[
          {cid:"c6",cn:"Cashier",cr:"Essential",rq:3,ql:3,gp:0},
          {cid:"c8",cn:"Service Desk",cr:"Important",rq:1,ql:1,gp:0}
        ]}
      ]},
      {did:"d5",dn:"Aarhus Bruuns",layout:"lt1",areas:[
        {aid:"a1",anm:"TV & Hi-Fi",skillReqs:[{s:"AV Systems",lvl:4},{s:"Product Knowledge",lvl:3}],certReqs:[{c:"AV Specialist Cert"}],roles:[
          {cid:"c3",cn:"Department Lead",cr:"Essential",rq:1,ql:0,gp:1},
          {cid:"c4",cn:"Sales Advisor",cr:"Important",rq:4,ql:2,gp:2}
        ]},
        {aid:"a2",anm:"Computers & Tablets",skillReqs:[{s:"Computer Setup",lvl:4},{s:"Network Basics",lvl:3}],certReqs:[{c:"IT Support Cert"}],roles:[
          {cid:"c3",cn:"Department Lead",cr:"Essential",rq:1,ql:1,gp:0},
          {cid:"c4",cn:"Sales Advisor",cr:"Important",rq:5,ql:3,gp:2},
          {cid:"c5",cn:"Tech Support",cr:"Important",rq:1,ql:0,gp:1}
        ]},
        {aid:"a3",anm:"Phones & Wearables",skillReqs:[{s:"Mobile Setup",lvl:3},{s:"Product Knowledge",lvl:3}],certReqs:[],roles:[
          {cid:"c4",cn:"Sales Advisor",cr:"Important",rq:3,ql:1,gp:2}
        ]},
        {aid:"a5",anm:"Gaming",skillReqs:[{s:"Console Setup",lvl:3},{s:"Technical Sales",lvl:4}],certReqs:[],roles:[
          {cid:"c3",cn:"Department Lead",cr:"Essential",rq:1,ql:0,gp:1},
          {cid:"c4",cn:"Sales Advisor",cr:"Important",rq:3,ql:1,gp:2}
        ]},
        {aid:"a6",anm:"Checkout & Service",skillReqs:[{s:"POS Operations",lvl:3},{s:"Customer Service",lvl:3}],certReqs:[],roles:[
          {cid:"c6",cn:"Cashier",cr:"Essential",rq:2,ql:1,gp:1}
        ]}
      ]},
      {did:"d12",dn:"Herning",roles:[
        {cid:"c1",cn:"Store Manager",cr:"Essential",rq:1,ql:1,gp:0},
        {cid:"c3",cn:"Department Lead",cr:"Important",rq:2,ql:2,gp:0},
        {cid:"c4",cn:"Sales Advisor",cr:"Essential",rq:6,ql:5,gp:1},
        {cid:"c6",cn:"Cashier",cr:"Essential",rq:2,ql:2,gp:0},
        {cid:"c7",cn:"Warehouse Staff",cr:"Nice to have",rq:1,ql:1,gp:0}
      ]}
    ],
    rev:54000000,inv:2800000,sd:"Q1 2025",td:"Q4 2025",
    sg:[{s:"Product Knowledge",n:14},{s:"Customer Service",n:10},{s:"Technical Sales",n:8},{s:"AV Systems",n:6},{s:"Computer Setup",n:5},{s:"Console Setup",n:4},{s:"Mobile Setup",n:3}],
    cg:[{c:"AV Specialist Cert",n:5,exp:"2025-09-01"},{c:"IT Support Cert",n:3,exp:"2025-10-15"},{c:"Electrical Safety Cert",n:4,exp:"2025-11-01"}],
    certs:[{c:"Electrical Safety Cert",total:38,valid:30,exp30:3,exp60:2,expired:3},{c:"AV Specialist Cert",total:14,valid:10,exp30:2,exp60:1,expired:1},{c:"IT Support Cert",total:10,valid:7,exp30:1,exp60:1,expired:1}],
    hist:[{q:"Q1 2025",rd:45,staff:52,skill:42,cert:38},{q:"Q2 2025",rd:58,staff:66,skill:54,cert:48},{q:"Q3 2025",rd:66,staff:74,skill:62,cert:55}]
  }
];}

export var LAYOUT_TEMPLATES=[
  {id:"lt1",nm:"POWER Standard",areas:[
    {aid:"a1",anm:"TV & Hi-Fi",skillReqs:[{s:"AV Systems",lvl:4},{s:"Product Knowledge",lvl:3}],certReqs:[{c:"AV Specialist Cert"}]},
    {aid:"a2",anm:"Computers & Tablets",skillReqs:[{s:"Computer Setup",lvl:4},{s:"Network Basics",lvl:3}],certReqs:[{c:"IT Support Cert"}]},
    {aid:"a3",anm:"Phones & Wearables",skillReqs:[{s:"Mobile Setup",lvl:3},{s:"Product Knowledge",lvl:3}],certReqs:[]},
    {aid:"a4",anm:"Kitchen & Household",skillReqs:[{s:"Appliance Installation",lvl:3},{s:"Product Knowledge",lvl:3}],certReqs:[{c:"Electrical Safety Cert"}]},
    {aid:"a5",anm:"Gaming",skillReqs:[{s:"Console Setup",lvl:3},{s:"Technical Sales",lvl:4}],certReqs:[]},
    {aid:"a6",anm:"Checkout & Service",skillReqs:[{s:"POS Operations",lvl:3},{s:"Customer Service",lvl:4}],certReqs:[]}
  ]},
  {id:"lt2",nm:"POWERHOUSE XL",areas:[
    {aid:"a1",anm:"TV & Hi-Fi",skillReqs:[{s:"AV Systems",lvl:5},{s:"Product Knowledge",lvl:4}],certReqs:[{c:"AV Specialist Cert"}]},
    {aid:"a2",anm:"Computers & Tablets",skillReqs:[{s:"Computer Setup",lvl:5},{s:"Network Basics",lvl:4}],certReqs:[{c:"IT Support Cert"}]},
    {aid:"a3",anm:"Phones & Wearables",skillReqs:[{s:"Mobile Setup",lvl:4},{s:"Product Knowledge",lvl:3}],certReqs:[]},
    {aid:"a4",anm:"Kitchen & Household",skillReqs:[{s:"Appliance Installation",lvl:4},{s:"Product Knowledge",lvl:3}],certReqs:[{c:"Electrical Safety Cert"},{c:"Installer Cert"}]},
    {aid:"a5",anm:"Gaming",skillReqs:[{s:"Console Setup",lvl:4},{s:"Technical Sales",lvl:4}],certReqs:[]},
    {aid:"a6",anm:"Checkout & Service",skillReqs:[{s:"POS Operations",lvl:3},{s:"Customer Service",lvl:4}],certReqs:[]},
    {aid:"a7",anm:"Smart Home & IoT",skillReqs:[{s:"Smart Home Setup",lvl:4},{s:"Network Basics",lvl:4}],certReqs:[{c:"Electrical Safety Cert"}]},
    {aid:"a8",anm:"Photo & Video",skillReqs:[{s:"Camera Systems",lvl:4},{s:"Product Knowledge",lvl:3}],certReqs:[]}
  ]}
];

export var ALL_SKILLS=["Product Knowledge","Team Leadership","Customer Service","Technical Sales","AV Systems","Computer Setup","Network Basics","Mobile Setup","Console Setup","POS Operations","Appliance Installation","Smart Home Setup","Camera Systems","Inventory Management","Electrical Safety","Beauty Advisory","Data Analytics","Omnichannel Strategy","AI Tools"];
export var ALL_CERTS=["AV Specialist Cert","IT Support Cert","Electrical Safety Cert","Installer Cert","Product Specialist","Google Analytics Cert","Project Management Cert"];

export var JOB_PROFILE_SKILLS={
  jp1:{hc:12,skills:[{s:"Team Leadership",have:12,lvl:5},{s:"Customer Service",have:12,lvl:4},{s:"Product Knowledge",have:10,lvl:4},{s:"POS Operations",have:8,lvl:3},{s:"Inventory Management",have:6,lvl:3}],certs:[{c:"Electrical Safety Cert",have:12},{c:"AV Specialist Cert",have:4}]},
  jp2:{hc:25,skills:[{s:"Team Leadership",have:22,lvl:4},{s:"Customer Service",have:24,lvl:4},{s:"Product Knowledge",have:20,lvl:3},{s:"POS Operations",have:18,lvl:3},{s:"Inventory Management",have:12,lvl:2}],certs:[{c:"Electrical Safety Cert",have:23},{c:"IT Support Cert",have:8}]},
  jp3:{hc:60,skills:[{s:"Team Leadership",have:55,lvl:3},{s:"Product Knowledge",have:58,lvl:3},{s:"Customer Service",have:56,lvl:3},{s:"Technical Sales",have:42,lvl:3},{s:"Inventory Management",have:30,lvl:2}],certs:[{c:"Electrical Safety Cert",have:52},{c:"AV Specialist Cert",have:18}]},
  jp4:{hc:400,skills:[{s:"Customer Service",have:380,lvl:3},{s:"Product Knowledge",have:360,lvl:3},{s:"Technical Sales",have:280,lvl:2},{s:"POS Operations",have:200,lvl:2}],certs:[{c:"Electrical Safety Cert",have:320}]},
  jp5:{hc:45,skills:[{s:"Computer Setup",have:44,lvl:4},{s:"Network Basics",have:40,lvl:4},{s:"Smart Home Setup",have:20,lvl:3},{s:"Customer Service",have:38,lvl:3},{s:"AV Systems",have:15,lvl:3}],certs:[{c:"IT Support Cert",have:42},{c:"Electrical Safety Cert",have:40}]},
  jp6:{hc:80,skills:[{s:"POS Operations",have:78,lvl:3},{s:"Customer Service",have:75,lvl:3},{s:"Product Knowledge",have:40,lvl:2}],certs:[{c:"Electrical Safety Cert",have:60}]},
  jp7:{hc:50,skills:[{s:"Inventory Management",have:48,lvl:4},{s:"Appliance Installation",have:30,lvl:3},{s:"Electrical Safety",have:45,lvl:3}],certs:[{c:"Electrical Safety Cert",have:48},{c:"Installer Cert",have:22}]},
  jp8:{hc:6,skills:[{s:"Team Leadership",have:6,lvl:5},{s:"Customer Service",have:6,lvl:5},{s:"Product Knowledge",have:6,lvl:4},{s:"Data Analytics",have:4,lvl:3},{s:"Omnichannel Strategy",have:3,lvl:3}],certs:[{c:"Electrical Safety Cert",have:6},{c:"Project Management Cert",have:5}]},
  jp9:{hc:30,skills:[{s:"Customer Service",have:28,lvl:4},{s:"POS Operations",have:26,lvl:3},{s:"Product Knowledge",have:22,lvl:3},{s:"Technical Sales",have:14,lvl:2}],certs:[{c:"Electrical Safety Cert",have:25}]},
  jp10:{hc:20,skills:[{s:"Product Knowledge",have:18,lvl:4},{s:"Customer Service",have:16,lvl:3},{s:"Inventory Management",have:10,lvl:3}],certs:[{c:"Electrical Safety Cert",have:18}]}
};

export var FITS=[
  /* i1: Lyngby Flagship — internal moves */
  {nm:"Mikkel Thorsen",cur:"Sales Advisor - Lyngby, Computers",mp:96,tgt:"Department Lead",loc:"Lyngby",area:"Computers & Tablets",ms:[],mc:[],hp:true,from:"i1",fLift:5,fCost:2},
  {nm:"Emma Soerensen",cur:"Sales Advisor - Lyngby, Kitchen",mp:92,tgt:"Department Lead",loc:"Lyngby",area:"Kitchen & Household",ms:[],mc:[],hp:true,from:"i1",fLift:4,fCost:3},
  /* i2: Norreport — single move */
  {nm:"Jonas Vester",cur:"Sales Advisor - Norreport",mp:80,tgt:"Asst. Store Manager",loc:"Norreport",area:null,ms:["Team Leadership","Inventory Management"],mc:[],hp:false,from:"i2",fLift:8,fCost:5},
  /* i3: West Coast Expansion — cross-location moves */
  {nm:"Frederik Holm",cur:"Sales Advisor - Aalborg, TV & Hi-Fi",mp:85,tgt:"Department Lead",loc:"Esbjerg Storcenter",area:"TV & Hi-Fi",ms:["Team Leadership"],mc:["AV Specialist Cert"],hp:true,from:"i3",fLift:9,fCost:4},
  {nm:"Maja Larsen",cur:"Cashier - Aalborg, Checkout",mp:74,tgt:"Sales Advisor",loc:"Esbjerg Storcenter",area:"Phones & Wearables",ms:["Mobile Setup","Product Knowledge"],mc:[],hp:false,from:"i3",fLift:6,fCost:3},
  {nm:"Kasper Dahl",cur:"Tech Support - Aalborg, Computers",mp:91,tgt:"Tech Support",loc:"Esbjerg Storcenter",area:"Computers & Tablets",ms:[],mc:["IT Support Cert"],hp:true,from:"i3",fLift:11,fCost:2},
  {nm:"Sofie Berg",cur:"Sales Advisor - Aalborg, Kitchen",mp:68,tgt:"Department Lead",loc:"Esbjerg Storcenter",area:"Kitchen & Household",ms:["Appliance Installation","Team Leadership"],mc:["Electrical Safety Cert"],hp:false,from:"i3",fLift:7,fCost:5},
  /* i5: HQ Digital Transformation */
  {nm:"Lise Moeller",cur:"Support Agent - HQ",mp:76,tgt:"E-Commerce Specialist",loc:"HQ Ballerup",area:null,ms:["Omnichannel Strategy","Data Analytics"],mc:["Google Analytics Cert"],hp:false,from:"i5",fLift:6,fCost:3},
  /* i7: Regional Rollout — cross-location area moves */
  {nm:"Nikolaj Krogh",cur:"Sales Advisor - Roskilde, TV & Hi-Fi",mp:82,tgt:"Department Lead",loc:"Aarhus Bruuns",area:"TV & Hi-Fi",ms:["Team Leadership"],mc:["AV Specialist Cert"],hp:true,from:"i7",fLift:10,fCost:4},
  {nm:"Laura Friis",cur:"Sales Advisor - Frederiksberg, Phones",mp:79,tgt:"Department Lead",loc:"Aarhus Bruuns",area:"Phones & Wearables",ms:["Team Leadership"],mc:[],hp:false,from:"i7",fLift:7,fCost:3},
  {nm:"Emil Nygaard",cur:"Warehouse Staff - Roskilde, TV & Hi-Fi",mp:62,tgt:"Sales Advisor",loc:"Aarhus Bruuns",area:"Gaming",ms:["Console Setup","Technical Sales"],mc:[],hp:false,from:"i7",fLift:4,fCost:2},
  {nm:"Sara Nielsen",cur:"Tech Support - Frederiksberg, Computers",mp:86,tgt:"Tech Support",loc:"Aarhus Bruuns",area:"Computers & Tablets",ms:[],mc:["IT Support Cert"],hp:true,from:"i7",fLift:9,fCost:3},
  {nm:"Anders Petersen",cur:"Sales Advisor - Herning",mp:71,tgt:"Sales Advisor",loc:"Aarhus Bruuns",area:"Phones & Wearables",ms:["Mobile Setup"],mc:[],hp:false,from:"i7",fLift:5,fCost:4}
];
