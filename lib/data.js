"use client";

export function mkDepts(){return [
  {id:"r1",nm:"Capital Region",ch:[{id:"d1",nm:"Lyngby",tp:"Op"},{id:"d2",nm:"Norreprt",tp:"Op"},{id:"d3",nm:"Amager Strand",tp:"Op"},{id:"d9",nm:"Frederiksberg",tp:"Op"},{id:"d10",nm:"Helsingor",tp:"Op"}]},
  {id:"r2",nm:"Southern Denmark",ch:[{id:"d4",nm:"Odense City",tp:"Op"},{id:"d11",nm:"Esbjerg",tp:"Op"}]},
  {id:"r3",nm:"Central Jutland",ch:[{id:"d5",nm:"Aarhus Central",tp:"Op"}]},
  {id:"r4",nm:"North Jutland",ch:[{id:"d6",nm:"Aalborg Storcenter",tp:"Op"}]},
  {id:"r5",nm:"Zealand",ch:[{id:"d7",nm:"Roskilde",tp:"Op"}]},
  {id:"r6",nm:"Corporate",ch:[{id:"d8",nm:"HQ Ballerup",tp:"Admin"}]}
];}
export function mkCircles(){return [{id:"c1",nm:"Store Manager"},{id:"c2",nm:"Shift Manager"},{id:"c3",nm:"Crew Trainer"},{id:"c4",nm:"Crew Member"},{id:"c5",nm:"Kitchen Crew"},{id:"c6",nm:"Drive-Thru Specialist"},{id:"c7",nm:"Maintenance Tech"},{id:"c8",nm:"Area Manager"}];}
export function mkJobProfiles(){return [{id:"jp1",nm:"Restaurant Manager"},{id:"jp2",nm:"Assistant Manager"},{id:"jp3",nm:"Team Leader"},{id:"jp4",nm:"Service Crew"},{id:"jp5",nm:"Kitchen Staff"},{id:"jp6",nm:"Drive-Thru Operator"},{id:"jp7",nm:"Facilities Coordinator"},{id:"jp8",nm:"Regional Manager"},{id:"jp9",nm:"Barista"},{id:"jp10",nm:"Cashier"}];}

export var LIBRARY=[
  {id:"l1",nm:"Food Safety Fundamentals",tp:"Path",sk:"Food Prep Basics",skLvl:3,ct:"Food Safety Level 1",dur:"2h",cap:30},
  {id:"l2",nm:"Shift Leadership Excellence",tp:"Path",sk:"Team Leadership",skLvl:4,ct:null,dur:"4h",cap:20},
  {id:"l3",nm:"Advanced Food Hygiene",tp:"Event",sk:"Health & Safety",skLvl:4,ct:"Food Safety Level 2",dur:"1 day",cap:15},
  {id:"l4",nm:"Crew Trainer Bootcamp",tp:"Event",sk:"Training Delivery",skLvl:4,ct:"Crew Trainer Certification",dur:"2 days",cap:12},
  {id:"l5",nm:"Customer Experience Mastery",tp:"Path",sk:"Customer Service",skLvl:5,ct:null,dur:"3h",cap:50},
  {id:"l6",nm:"Drive-Thru Speed & Accuracy",tp:"Path",sk:"Drive-Thru Operations",skLvl:4,ct:null,dur:"1.5h",cap:25},
  {id:"l7",nm:"Cash Handling & POS",tp:"Path",sk:"Cash Handling",skLvl:3,ct:null,dur:"1h",cap:40},
  {id:"l8",nm:"Kitchen Operations Advanced",tp:"Event",sk:"Grill Operations",skLvl:5,ct:"Food Safety Level 3",dur:"1 day",cap:10}
];

export function mkIni(){return [
  {id:"i1",nm:"Lyngby + Helsingor Expansion",ds:"Combined initiative: Lyngby serves as training ground (over-capacity) while Helsingor builds up for new opening. Staff will relocate once Helsingor is ready.",tp:"Operational",st:"active",
    depts:[
      {did:"d1",dn:"Lyngby",roles:[{cid:"c1",cn:"Store Manager",cr:"Essential",rq:1,ql:2,gp:0},{cid:"c2",cn:"Shift Manager",cr:"Essential",rq:3,ql:5,gp:0},{cid:"c3",cn:"Crew Trainer",cr:"Important",rq:4,ql:6,gp:0},{cid:"c4",cn:"Crew Member",cr:"Essential",rq:18,ql:24,gp:0},{cid:"c5",cn:"Kitchen Crew",cr:"Essential",rq:12,ql:16,gp:0},{cid:"c6",cn:"Drive-Thru",cr:"Important",rq:6,ql:8,gp:0}]},
      {did:"d10",dn:"Helsingor",roles:[{cid:"c1",cn:"Store Manager",cr:"Essential",rq:1,ql:0,gp:1},{cid:"c2",cn:"Shift Manager",cr:"Essential",rq:3,ql:0,gp:3},{cid:"c4",cn:"Crew Member",cr:"Essential",rq:15,ql:0,gp:15},{cid:"c5",cn:"Kitchen Crew",cr:"Essential",rq:10,ql:0,gp:10}]}
    ],
    rev:34500000,sd:"Q1 2025",td:"Q1 2026",_skillRd:52,_certRd:45,
    sg:[{s:"Training Delivery",n:4,i:"High"},{s:"Customer Service",n:8,i:"Critical"},{s:"Drive-Thru Operations",n:3,i:"High"},{s:"Team Leadership",n:3,i:"Critical"},{s:"Grill Operations",n:5,i:"High"}],
    cg:[{c:"Crew Trainer Certification",n:4,i:"High",exp:"2025-04-15"},{c:"Food Safety Level 1",n:12,i:"Critical",exp:"2025-06-01"},{c:"Food Safety Level 2",n:3,i:"High",exp:"2025-07-01"}],
    certs:[{c:"Food Safety L1",total:50,valid:42,exp30:4,exp60:2,expired:2},{c:"Crew Trainer Cert",total:6,valid:5,exp30:0,exp60:1,expired:0},{c:"Food Safety L2",total:8,valid:5,exp30:1,exp60:1,expired:1}],
    hist:[{q:"Q1 2025",rd:42,staff:48,skill:38,cert:32},{q:"Q2 2025",rd:55,staff:62,skill:50,cert:42},{q:"Q3 2025",rd:64,staff:72,skill:58,cert:48}]
  },
  {id:"i2",nm:"Norreport Restaurant",ds:"High-traffic city center location. Critical focus on speed of service and customer satisfaction.",tp:"Operational",st:"active",
    depts:[{did:"d2",dn:"Norreport",roles:[{cid:"c1",cn:"Store Manager",cr:"Essential",rq:1,ql:1,gp:0},{cid:"c2",cn:"Shift Manager",cr:"Essential",rq:4,ql:3,gp:1},{cid:"c4",cn:"Crew Member",cr:"Essential",rq:22,ql:18,gp:4},{cid:"c5",cn:"Kitchen Crew",cr:"Essential",rq:14,ql:11,gp:3}]}],
    rev:24000000,sd:"Q1 2025",td:"Q3 2025",_skillRd:68,_certRd:62,
    sg:[{s:"Team Leadership",n:1,i:"Critical"},{s:"Customer Service",n:4,i:"Critical"},{s:"Grill Operations",n:3,i:"High"}],
    cg:[{c:"Food Safety L2",n:3,i:"High",exp:"2025-05-01"},{c:"Food Safety L1",n:4,i:"Critical",exp:"2025-03-10"}],
    certs:[{c:"Food Safety L1",total:36,valid:28,exp30:4,exp60:2,expired:2},{c:"Food Safety L2",total:5,valid:2,exp30:1,exp60:1,expired:1}],
    hist:[{q:"Q1 2025",rd:55,staff:62,skill:52,cert:48},{q:"Q2 2025",rd:64,staff:70,skill:60,cert:55},{q:"Q3 2025",rd:72,staff:78,skill:68,cert:62}]
  },
  {id:"i3",nm:"Amager Strand",ds:"Seasonal beach location. Summer staffing plan with focus on drive-thru and outdoor service.",tp:"Operational",st:"active",
    depts:[{did:"d3",dn:"Amager Strand",roles:[{cid:"c1",cn:"Store Manager",cr:"Essential",rq:1,ql:1,gp:0},{cid:"c4",cn:"Crew Member",cr:"Essential",rq:16,ql:15,gp:1}]}],
    rev:15000000,sd:"Q1 2025",td:"Q4 2025",_skillRd:92,_certRd:88,
    sg:[{s:"Customer Service",n:1,i:"Medium"}],cg:[],
    certs:[{c:"Food Safety L1",total:16,valid:15,exp30:1,exp60:0,expired:0}],
    hist:[{q:"Q1 2025",rd:82,staff:88,skill:85,cert:78},{q:"Q2 2025",rd:90,staff:94,skill:90,cert:85},{q:"Q3 2025",rd:95,staff:97,skill:92,cert:88}]
  },
  {id:"i6",nm:"Esbjerg - New Opening",ds:"Projected expansion into Esbjerg. Early recruitment phase.",tp:"Operational",st:"projection",
    depts:[{did:"d11",dn:"Esbjerg",roles:[{cid:"c1",cn:"Store Manager",cr:"Essential",rq:1,ql:0,gp:1},{cid:"c2",cn:"Shift Manager",cr:"Essential",rq:3,ql:1,gp:2},{cid:"c4",cn:"Crew Member",cr:"Essential",rq:14,ql:3,gp:11}]}],
    rev:13500000,sd:"Q4 2025",td:"Q2 2026",_skillRd:10,_certRd:5,
    sg:[{s:"Leadership",n:1,i:"Critical"},{s:"Customer Service",n:11,i:"Critical"}],cg:[{c:"Food Safety L3",n:1,i:"Critical"}],
    certs:[{c:"Food Safety L1",total:4,valid:2,exp30:0,exp60:1,expired:1}],hist:[]
  },
  {id:"i7",nm:"POWER Regional Rollout",ds:"Four POWER electronics stores across Denmark. Roskilde flagship, Odense high-performer, Aalborg ramping up, and Aarhus newly opened. Each store divided into specialist areas.",tp:"Operational",st:"active",
    depts:[
      {did:"d7",dn:"Roskilde",layout:"lt1",areas:[
        {aid:"a1",anm:"Radio & TV",skillReqs:[{s:"AV Systems",lvl:4},{s:"Product Knowledge",lvl:3}],certReqs:["AV Technician"],roles:[
          {cid:"c3",cn:"Team Leader",cr:"Essential",rq:1,ql:1,gp:0},
          {cid:"c4",cn:"Sales Assistant",cr:"Important",rq:4,ql:3,gp:1},
          {cid:"c7",cn:"Warehouse Handler",cr:"Nice to have",rq:2,ql:2,gp:0}
        ]},
        {aid:"a2",anm:"Computers & Tablets",skillReqs:[{s:"Computer Setup",lvl:4},{s:"Network Basics",lvl:3}],certReqs:["Electronics Safety"],roles:[
          {cid:"c3",cn:"Team Leader",cr:"Essential",rq:1,ql:1,gp:0},
          {cid:"c4",cn:"Sales Assistant",cr:"Important",rq:5,ql:4,gp:1},
          {cid:"c8",cn:"Tech Support",cr:"Important",rq:2,ql:2,gp:0}
        ]},
        {aid:"a3",anm:"Kitchen Appliances",skillReqs:[{s:"Kitchen Appliance Demo",lvl:3},{s:"Product Knowledge",lvl:3}],certReqs:["Electronics Safety"],roles:[
          {cid:"c3",cn:"Team Leader",cr:"Essential",rq:1,ql:1,gp:0},
          {cid:"c4",cn:"Sales Assistant",cr:"Important",rq:3,ql:2,gp:1}
        ]},
        {aid:"a4",anm:"Gaming & Accessories",skillReqs:[{s:"Console Setup",lvl:3},{s:"Technical Sales",lvl:4}],certReqs:[],roles:[
          {cid:"c3",cn:"Team Leader",cr:"Essential",rq:1,ql:0,gp:1},
          {cid:"c4",cn:"Sales Assistant",cr:"Important",rq:3,ql:3,gp:0}
        ]},
        {aid:"a5",anm:"Personal Care & Beauty",skillReqs:[{s:"Beauty Advisory",lvl:2}],certReqs:["Product Specialist"],roles:[
          {cid:"c4",cn:"Sales Assistant",cr:"Nice to have",rq:2,ql:2,gp:0}
        ]}
      ]},
      {did:"d4",dn:"Odense City",layout:"lt1",areas:[
        {aid:"a1",anm:"Radio & TV",skillReqs:[{s:"AV Systems",lvl:4},{s:"Product Knowledge",lvl:3}],certReqs:["AV Technician"],roles:[
          {cid:"c3",cn:"Team Leader",cr:"Essential",rq:1,ql:1,gp:0},
          {cid:"c4",cn:"Sales Assistant",cr:"Important",rq:6,ql:6,gp:0},
          {cid:"c7",cn:"Warehouse Handler",cr:"Nice to have",rq:1,ql:1,gp:0}
        ]},
        {aid:"a2",anm:"Computers & Tablets",skillReqs:[{s:"Computer Setup",lvl:4},{s:"Network Basics",lvl:3}],certReqs:["Electronics Safety"],roles:[
          {cid:"c3",cn:"Team Leader",cr:"Essential",rq:1,ql:1,gp:0},
          {cid:"c4",cn:"Sales Assistant",cr:"Important",rq:7,ql:7,gp:0},
          {cid:"c8",cn:"Tech Support",cr:"Important",rq:3,ql:3,gp:0}
        ]},
        {aid:"a3",anm:"Kitchen Appliances",skillReqs:[{s:"Kitchen Appliance Demo",lvl:3},{s:"Product Knowledge",lvl:3}],certReqs:["Electronics Safety"],roles:[
          {cid:"c3",cn:"Team Leader",cr:"Essential",rq:1,ql:1,gp:0},
          {cid:"c4",cn:"Sales Assistant",cr:"Important",rq:4,ql:4,gp:0}
        ]},
        {aid:"a4",anm:"Gaming & Accessories",skillReqs:[{s:"Console Setup",lvl:3},{s:"Technical Sales",lvl:4}],certReqs:[],roles:[
          {cid:"c3",cn:"Team Leader",cr:"Essential",rq:1,ql:1,gp:0},
          {cid:"c4",cn:"Sales Assistant",cr:"Important",rq:4,ql:4,gp:0}
        ]},
        {aid:"a5",anm:"Personal Care & Beauty",skillReqs:[{s:"Beauty Advisory",lvl:2}],certReqs:["Product Specialist"],roles:[
          {cid:"c3",cn:"Team Leader",cr:"Essential",rq:1,ql:1,gp:0},
          {cid:"c4",cn:"Sales Assistant",cr:"Nice to have",rq:3,ql:3,gp:0}
        ]}
      ]},
      {did:"d6",dn:"Aalborg Storcenter",layout:"lt1",areas:[
        {aid:"a1",anm:"Radio & TV",skillReqs:[{s:"AV Systems",lvl:4},{s:"Product Knowledge",lvl:3}],certReqs:["AV Technician"],roles:[
          {cid:"c3",cn:"Team Leader",cr:"Essential",rq:1,ql:1,gp:0},
          {cid:"c4",cn:"Sales Assistant",cr:"Important",rq:3,ql:1,gp:2}
        ]},
        {aid:"a2",anm:"Computers & Tablets",skillReqs:[{s:"Computer Setup",lvl:4},{s:"Network Basics",lvl:3}],certReqs:["Electronics Safety"],roles:[
          {cid:"c3",cn:"Team Leader",cr:"Essential",rq:1,ql:0,gp:1},
          {cid:"c4",cn:"Sales Assistant",cr:"Important",rq:4,ql:2,gp:2},
          {cid:"c8",cn:"Tech Support",cr:"Important",rq:1,ql:0,gp:1}
        ]},
        {aid:"a3",anm:"Kitchen Appliances",skillReqs:[{s:"Kitchen Appliance Demo",lvl:3},{s:"Product Knowledge",lvl:3}],certReqs:["Electronics Safety"],roles:[
          {cid:"c4",cn:"Sales Assistant",cr:"Important",rq:2,ql:1,gp:1}
        ]},
        {aid:"a4",anm:"Gaming & Accessories",skillReqs:[{s:"Console Setup",lvl:3},{s:"Technical Sales",lvl:4}],certReqs:[],roles:[
          {cid:"c4",cn:"Sales Assistant",cr:"Important",rq:2,ql:1,gp:1}
        ]}
      ]},
      {did:"d5",dn:"Aarhus Central",layout:"lt1",areas:[
        {aid:"a1",anm:"Radio & TV",skillReqs:[{s:"AV Systems",lvl:4},{s:"Product Knowledge",lvl:3}],certReqs:["AV Technician"],roles:[
          {cid:"c3",cn:"Team Leader",cr:"Essential",rq:1,ql:0,gp:1},
          {cid:"c4",cn:"Sales Assistant",cr:"Important",rq:3,ql:0,gp:3}
        ]},
        {aid:"a2",anm:"Computers & Tablets",skillReqs:[{s:"Computer Setup",lvl:4},{s:"Network Basics",lvl:3}],certReqs:["Electronics Safety"],roles:[
          {cid:"c3",cn:"Team Leader",cr:"Essential",rq:1,ql:0,gp:1},
          {cid:"c4",cn:"Sales Assistant",cr:"Important",rq:4,ql:1,gp:3}
        ]},
        {aid:"a3",anm:"Kitchen Appliances",skillReqs:[{s:"Kitchen Appliance Demo",lvl:3},{s:"Product Knowledge",lvl:3}],certReqs:["Electronics Safety"],roles:[
          {cid:"c4",cn:"Sales Assistant",cr:"Important",rq:2,ql:0,gp:2}
        ]},
        {aid:"a4",anm:"Gaming & Accessories",skillReqs:[{s:"Console Setup",lvl:3},{s:"Technical Sales",lvl:4}],certReqs:[],roles:[
          {cid:"c4",cn:"Sales Assistant",cr:"Important",rq:2,ql:0,gp:2}
        ]},
        {aid:"a5",anm:"Personal Care & Beauty",skillReqs:[{s:"Beauty Advisory",lvl:2}],certReqs:["Product Specialist"],roles:[
          {cid:"c4",cn:"Sales Assistant",cr:"Nice to have",rq:1,ql:0,gp:1}
        ]}
      ]},
      {did:"d9",dn:"Frederiksberg",roles:[
        {cid:"c1",cn:"Store Manager",cr:"Essential",rq:1,ql:1,gp:0},
        {cid:"c3",cn:"Team Leader",cr:"Essential",rq:2,ql:2,gp:0},
        {cid:"c4",cn:"Sales Assistant",cr:"Important",rq:8,ql:6,gp:2}
      ]}
    ],
    rev:58000000,sd:"Q1 2025",td:"Q4 2025",_skillRd:62,_certRd:55,
    sg:[{s:"Product Knowledge",n:12,i:"High"},{s:"Customer Service",n:8,i:"Critical"},{s:"Technical Sales",n:9,i:"High"},{s:"AV Systems",n:6,i:"High"},{s:"Computer Setup",n:5,i:"Critical"}],
    cg:[{c:"Electronics Safety",n:6,i:"High",exp:"2025-08-01"},{c:"AV Technician",n:4,i:"Critical",exp:"2025-09-15"},{c:"Product Specialist",n:3,i:"High",exp:"2025-10-01"}],
    certs:[{c:"Electronics Safety",total:48,valid:38,exp30:4,exp60:3,expired:3},{c:"AV Technician",total:18,valid:14,exp30:2,exp60:1,expired:1},{c:"Product Specialist",total:12,valid:9,exp30:1,exp60:1,expired:1}],
    hist:[{q:"Q1 2025",rd:45,staff:52,skill:42,cert:38},{q:"Q2 2025",rd:58,staff:64,skill:55,cert:48},{q:"Q3 2025",rd:68,staff:74,skill:65,cert:58}]
  }
];}

export var LAYOUT_TEMPLATES=[
  {id:"lt1",nm:"POWER Standard",areas:[
    {aid:"a1",anm:"Radio & TV",skillReqs:[{s:"AV Systems",lvl:4},{s:"Product Knowledge",lvl:3}],certReqs:["AV Technician"]},
    {aid:"a2",anm:"Computers & Tablets",skillReqs:[{s:"Computer Setup",lvl:4},{s:"Network Basics",lvl:3}],certReqs:["Electronics Safety"]},
    {aid:"a3",anm:"Kitchen Appliances",skillReqs:[{s:"Kitchen Appliance Demo",lvl:3},{s:"Product Knowledge",lvl:3}],certReqs:["Electronics Safety"]},
    {aid:"a4",anm:"Gaming & Accessories",skillReqs:[{s:"Console Setup",lvl:3},{s:"Technical Sales",lvl:4}],certReqs:[]},
    {aid:"a5",anm:"Personal Care & Beauty",skillReqs:[{s:"Beauty Advisory",lvl:2}],certReqs:["Product Specialist"]}
  ]}
];

export var ALL_SKILLS=["Food Prep Basics","Team Leadership","Health & Safety","Training Delivery","Customer Service","Drive-Thru Operations","Cash Handling","Grill Operations","Product Knowledge","Technical Sales","AV Systems","Computer Setup","Network Basics","Kitchen Appliance Demo","Console Setup","Beauty Advisory","Inventory Management"];
export var ALL_CERTS=["Food Safety Level 1","Food Safety Level 2","Food Safety Level 3","Crew Trainer Certification","Electronics Safety","Product Specialist","AV Technician"];

export var JOB_PROFILE_SKILLS={
  jp1:{hc:50,skills:[{s:"Team Leadership",have:48,lvl:4},{s:"Health & Safety",have:50,lvl:3},{s:"Customer Service",have:45,lvl:4},{s:"Cash Handling",have:30,lvl:3},{s:"Food Prep Basics",have:12,lvl:2},{s:"Training Delivery",have:8,lvl:3}],certs:[{c:"Food Safety Level 2",have:47},{c:"Food Safety Level 1",have:50},{c:"Crew Trainer Certification",have:10}]},
  jp2:{hc:80,skills:[{s:"Team Leadership",have:72,lvl:3},{s:"Customer Service",have:75,lvl:3},{s:"Cash Handling",have:68,lvl:3},{s:"Health & Safety",have:60,lvl:2},{s:"Food Prep Basics",have:20,lvl:2}],certs:[{c:"Food Safety Level 1",have:78},{c:"Food Safety Level 2",have:35}]},
  jp3:{hc:120,skills:[{s:"Team Leadership",have:100,lvl:3},{s:"Customer Service",have:110,lvl:3},{s:"Cash Handling",have:90,lvl:2},{s:"Training Delivery",have:25,lvl:2},{s:"Health & Safety",have:40,lvl:2}],certs:[{c:"Food Safety Level 1",have:115},{c:"Crew Trainer Certification",have:20}]},
  jp4:{hc:400,skills:[{s:"Customer Service",have:380,lvl:2},{s:"Cash Handling",have:350,lvl:2},{s:"Food Prep Basics",have:200,lvl:2},{s:"Drive-Thru Operations",have:150,lvl:2}],certs:[{c:"Food Safety Level 1",have:360}]},
  jp5:{hc:300,skills:[{s:"Food Prep Basics",have:290,lvl:3},{s:"Health & Safety",have:280,lvl:3},{s:"Grill Operations",have:180,lvl:3},{s:"Customer Service",have:60,lvl:2}],certs:[{c:"Food Safety Level 1",have:295},{c:"Food Safety Level 2",have:120},{c:"Food Safety Level 3",have:15}]},
  jp6:{hc:200,skills:[{s:"Drive-Thru Operations",have:195,lvl:3},{s:"Customer Service",have:180,lvl:2},{s:"Cash Handling",have:170,lvl:2},{s:"Food Prep Basics",have:40,lvl:2}],certs:[{c:"Food Safety Level 1",have:190}]},
  jp7:{hc:30,skills:[{s:"Health & Safety",have:30,lvl:4},{s:"Team Leadership",have:12,lvl:2}],certs:[{c:"Food Safety Level 1",have:28},{c:"Food Safety Level 2",have:20}]},
  jp8:{hc:10,skills:[{s:"Team Leadership",have:10,lvl:5},{s:"Training Delivery",have:8,lvl:4},{s:"Customer Service",have:10,lvl:4},{s:"Health & Safety",have:10,lvl:4},{s:"Cash Handling",have:5,lvl:3}],certs:[{c:"Food Safety Level 2",have:10},{c:"Food Safety Level 3",have:8},{c:"Crew Trainer Certification",have:6}]},
  jp9:{hc:150,skills:[{s:"Customer Service",have:145,lvl:3},{s:"Cash Handling",have:130,lvl:2},{s:"Food Prep Basics",have:80,lvl:2}],certs:[{c:"Food Safety Level 1",have:140}]},
  jp10:{hc:250,skills:[{s:"Cash Handling",have:245,lvl:3},{s:"Customer Service",have:230,lvl:2},{s:"Drive-Thru Operations",have:60,lvl:2}],certs:[{c:"Food Safety Level 1",have:240}]}
};

export var FITS=[
  /* Non-area initiatives — location-level mobility */
  {nm:"Mikkel Jensen",cur:"Crew Member - Lyngby",mp:78,tgt:"Shift Manager",loc:"Helsingor",area:null,ms:["Team Leadership"],mc:["Food Safety Level 2"],hp:true,from:"i1",fLift:6,fCost:4},
  {nm:"Sara Nielsen",cur:"Crew Member - Norreport",mp:82,tgt:"Crew Trainer",loc:"Norreport",area:null,ms:["Training Delivery"],mc:["Crew Trainer Certification"],hp:false,from:"i2",fLift:5,fCost:3},
  {nm:"Thomas Andersen",cur:"Kitchen Crew - Amager",mp:71,tgt:"Shift Manager",loc:"Amager Strand",area:null,ms:["Team Leadership","Cash Handling"],mc:["Food Safety Level 2"],hp:false,from:"i3",fLift:8,fCost:2},
  {nm:"Line Christensen",cur:"Crew Member - Lyngby",mp:75,tgt:"Kitchen Crew",loc:"Lyngby",area:null,ms:["Grill Operations"],mc:["Food Safety Level 2"],hp:false,from:"i1",fLift:4,fCost:2},
  {nm:"Anders Moller",cur:"Shift Manager - Amager",mp:88,tgt:"Store Manager",loc:"Amager Strand",area:null,ms:[],mc:["Food Safety Level 3"],hp:true,from:"i3",fLift:12,fCost:8},
  /* Area-aware — POWER Regional Rollout (i7) */
  {nm:"Frederik Holm",cur:"Sales Assistant - Odense, Radio & TV",mp:85,tgt:"Team Leader",loc:"Aalborg Storcenter",area:"Radio & TV",ms:["Team Leadership"],mc:["AV Technician"],hp:true,from:"i7",fLift:9,fCost:3},
  {nm:"Maja Larsen",cur:"Sales Assistant - Roskilde, Computers",mp:74,tgt:"Tech Support",loc:"Aarhus Central",area:"Computers & Tablets",ms:["Network Basics"],mc:["Electronics Safety"],hp:false,from:"i7",fLift:7,fCost:5},
  {nm:"Kasper Dahl",cur:"Sales Assistant - Odense, Gaming",mp:91,tgt:"Team Leader",loc:"Aalborg Storcenter",area:"Gaming & Accessories",ms:[],mc:[],hp:true,from:"i7",fLift:11,fCost:4},
  {nm:"Sofie Berg",cur:"Team Leader - Roskilde, Kitchen",mp:68,tgt:"Team Leader",loc:"Aarhus Central",area:"Kitchen Appliances",ms:["Kitchen Appliance Demo"],mc:["Electronics Safety"],hp:false,from:"i7",fLift:8,fCost:6},
  {nm:"Emil Nygaard",cur:"Warehouse Handler - Roskilde, Radio & TV",mp:62,tgt:"Sales Assistant",loc:"Aalborg Storcenter",area:"Radio & TV",ms:["AV Systems","Product Knowledge"],mc:["AV Technician"],hp:false,from:"i7",fLift:5,fCost:2},
  {nm:"Laura Friis",cur:"Sales Assistant - Odense, Personal Care",mp:80,tgt:"Team Leader",loc:"Aarhus Central",area:"Personal Care & Beauty",ms:["Beauty Advisory"],mc:["Product Specialist"],hp:false,from:"i7",fLift:6,fCost:3},
  {nm:"Nikolaj Krogh",cur:"Tech Support - Odense, Computers",mp:77,tgt:"Tech Support",loc:"Aalborg Storcenter",area:"Computers & Tablets",ms:["Computer Setup"],mc:[],hp:true,from:"i7",fLift:10,fCost:5}
];
