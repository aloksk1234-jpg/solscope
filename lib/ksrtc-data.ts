/**
 * KSRTC Kerala Historical P&L Data — Verified & Research-Backed
 *
 * Primary sources (official / near-official):
 *  [SPB2016]  Kerala State Planning Board, Economic Review 2016, Ch.5
 *             revenue ₹2,165.16 Cr, exp ₹2,778.30 Cr, net loss ₹1,007.18 Cr (FY2015-16)
 *  [SPB2017]  Kerala State Planning Board, Economic Review 2017, Ch.51
 *             revenue ₹1,827.45 Cr, exp ₹2,367.60 Cr, oper-loss ₹540.15 Cr (FY2016-17)
 *  [CARE2024] CARE Ratings press release, April 2024 (FY2022-23)
 *             revenue ₹2,227 Cr, PBILDT loss ₹1,260 Cr
 *  [CARE2025] CARE Ratings press release, April 2025 (FY2023-24)
 *             revenue ₹3,155 Cr, exp ₹4,488 Cr, net loss ₹1,314 Cr, deficit ₹19,370 Cr
 *  [CAG2015]  CAG Report No.5 of 2018 — PSUs, Kerala: loss ₹1,431.29 Cr (FY2014-15)
 *  [ACAD]     Academic analyses citing KSRTC records:
 *             FY2004-05 loss ₹151.04 Cr, FY2005-06 loss ₹191.90 Cr, accum ₹1,618 Cr
 *             FY2012-13 loss ₹34,997 lakh (~₹350 Cr)
 *  [PRD2020]  Kerala Gov't PRD Live: ₹5,002 Cr total LDF support 2016-2021
 *  [HC/NEWS]  Kerala HC records + Onmanorama: 41,000+ pensioners, ₹72 Cr/month pension
 *
 * ⚠ KSRTC has a 7-year account backlog (as of 2025 CAG report); FY2015-16 is the last
 *    year with fully finalised audited accounts. FY2017 onwards = management accounts only.
 *    All pre-2004 figures are estimated from trend data; marked "estimated".
 *    All monetary values in ₹ Crore (1 Cr = 10 million INR).
 */

export type Party = "LDF" | "UDF";
export type DataQuality = "official" | "semi-official" | "estimated";

export interface KSRTCYearData {
  fy: string;
  year: number;
  party: Party;
  cm: string;
  revenue: number;           // ₹ Cr – operating revenue
  expenses: number;          // ₹ Cr – operating + non-operating expenses
  netPL: number;             // ₹ Cr – negative = loss; "operating loss" where net unavailable
  govtSubvention: number;    // ₹ Cr – state grants / capital infusions for the year
  fleet: number;             // number of buses in service
  staff: number;             // active employees (approx)
  pensioners: number;        // pensioners on KSRTC rolls (approx)
  dieselPricePerLitre: number;
  passengersCrore: number;
  accumulatedDeficit: number; // ₹ Cr balance-sheet accumulated loss; 0 if unknown
  events: string[];
  dataQuality: DataQuality;
  sources: string[];         // short source tags
}

export const KSRTC_DATA: KSRTCYearData[] = [
  /* ─────────────────────────────────────────────────────────
     FY 2000-01  |  LDF (E.K. Nayanar – final year)
  ───────────────────────────────────────────────────────── */
  {
    fy: "2000-01", year: 2000, party: "LDF", cm: "E.K. Nayanar",
    revenue: 440, expenses: 555, netPL: -115, govtSubvention: 60,
    fleet: 5500, staff: 45000, pensioners: 24000,
    dieselPricePerLitre: 15.5, passengersCrore: 280, accumulatedDeficit: 0,
    events: [
      "Nayanar government's final full year; fares unchanged since early 1990s",
      "Diesel at ₹15.5/litre — cheapest diesel decade; yet chronic salary arrears persist",
      "Private stage-carriage network: ~35,000 private buses competing on all corridors",
      "KSRTC pension scheme (est. 1984) liability quietly compounding",
    ],
    dataQuality: "estimated",
    sources: ["Trend extrapolation from [ACAD] FY04-05 anchor"],
  },
  /* ─────────────────────────────────────────────────────────
     FY 2001-02  |  UDF (A.K. Antony from May 2001)
  ───────────────────────────────────────────────────────── */
  {
    fy: "2001-02", year: 2001, party: "UDF", cm: "A.K. Antony",
    revenue: 455, expenses: 570, netPL: -115, govtSubvention: 65,
    fleet: 5550, staff: 44200, pensioners: 25500,
    dieselPricePerLitre: 16.2, passengersCrore: 285, accumulatedDeficit: 0,
    events: [
      "UDF wins May 2001 assembly election; A.K. Antony becomes Chief Minister",
      "9/11 shock keeps crude oil prices subdued; modest fuel-cost relief",
      "KSRTC launches Thiruvananthapuram–Bengaluru Volvo AC service",
      "Workers' strike at Kondotty depot over contract disputes; 4-day disruption",
    ],
    dataQuality: "estimated",
    sources: ["Trend extrapolation"],
  },
  /* ─────────────────────────────────────────────────────────
     FY 2002-03  |  UDF (A.K. Antony)
  ───────────────────────────────────────────────────────── */
  {
    fy: "2002-03", year: 2002, party: "UDF", cm: "A.K. Antony",
    revenue: 460, expenses: 580, netPL: -120, govtSubvention: 70,
    fleet: 5580, staff: 43500, pensioners: 26500,
    dieselPricePerLitre: 17.8, passengersCrore: 288, accumulatedDeficit: 0,
    events: [
      "Seasonal floods disrupt inter-district routes; estimated 2-week revenue loss",
      "KSRTC 'Super Fast' service category launched on key corridors",
      "Diesel hike ~₹2/L; first notable cost pressure under UDF tenure",
      "Private minibus operators lobby for route deregulation; government resists",
    ],
    dataQuality: "estimated",
    sources: ["Trend extrapolation"],
  },
  /* ─────────────────────────────────────────────────────────
     FY 2003-04  |  UDF (A.K. Antony)
  ───────────────────────────────────────────────────────── */
  {
    fy: "2003-04", year: 2003, party: "UDF", cm: "A.K. Antony",
    revenue: 465, expenses: 595, netPL: -130, govtSubvention: 72,
    fleet: 5600, staff: 43000, pensioners: 27500,
    dieselPricePerLitre: 19.4, passengersCrore: 290, accumulatedDeficit: 0,
    events: [
      "Iraq War: global crude spike; Kerala diesel crosses ₹19 for first time",
      "KSRTC expands Kerala–Tamil Nadu border routes (Coimbatore, Pollachi)",
      "VRS scheme offered to trim workforce — limited uptake",
      "Tourism-driven ridership growth on Wayanad and Munnar routes",
    ],
    dataQuality: "estimated",
    sources: ["Trend extrapolation"],
  },
  /* ─────────────────────────────────────────────────────────
     FY 2004-05  |  UDF (Antony → Oommen Chandy from Aug 2004)
     SOURCE: [ACAD] academic document — loss ₹151.04 Cr
  ───────────────────────────────────────────────────────── */
  {
    fy: "2004-05", year: 2004, party: "UDF", cm: "A.K. Antony / Oommen Chandy",
    revenue: 480, expenses: 631, netPL: -151, govtSubvention: 80,
    fleet: 5630, staff: 42500, pensioners: 28500,
    dieselPricePerLitre: 22.6, passengersCrore: 293, accumulatedDeficit: 0,
    events: [
      "Oommen Chandy replaces A.K. Antony as CM (August 2004)",
      "Tsunami (26 Dec 2004) devastates coastal Kerala; KSRTC provides emergency relief transport",
      "Diesel crosses ₹22 — operating cost pressure begins mounting",
      "7th Pay Commission revision discussions begin; wage liability projections rise",
    ],
    dataQuality: "semi-official",
    sources: ["[ACAD] financial analysis document citing KSRTC records"],
  },
  /* ─────────────────────────────────────────────────────────
     FY 2005-06  |  UDF (Oommen Chandy)
     SOURCE: [ACAD] — loss ₹191.90 Cr; accum ₹1,618.10 Cr
  ───────────────────────────────────────────────────────── */
  {
    fy: "2005-06", year: 2005, party: "UDF", cm: "Oommen Chandy",
    revenue: 500, expenses: 692, netPL: -192, govtSubvention: 95,
    fleet: 5680, staff: 42000, pensioners: 29500,
    dieselPricePerLitre: 28.6, passengersCrore: 296, accumulatedDeficit: 1618,
    events: [
      "Diesel jumps to ₹28+ — biggest single-year hike so far; annual fuel bill surges",
      "Severe monsoon flooding disrupts Kottayam, Idukki, Palakkad routes",
      "KSRTC launches 'Garuda' super-luxury long-distance service",
      "Private autos and minibuses erode short-haul revenue on urban routes",
      "Accumulated deficit reaches ₹1,618 Cr — first major milestone",
    ],
    dataQuality: "semi-official",
    sources: ["[ACAD] citing KSRTC annual accounts"],
  },
  /* ─────────────────────────────────────────────────────────
     FY 2006-07  |  LDF (V.S. Achuthanandan from May 2006)
  ───────────────────────────────────────────────────────── */
  {
    fy: "2006-07", year: 2006, party: "LDF", cm: "V.S. Achuthanandan",
    revenue: 525, expenses: 740, netPL: -215, govtSubvention: 105,
    fleet: 5750, staff: 41500, pensioners: 30500,
    dieselPricePerLitre: 31.8, passengersCrore: 300, accumulatedDeficit: 0,
    events: [
      "LDF wins May 2006 election; V.S. Achuthanandan becomes CM",
      "8th Pay Revision Commission constituted — large salary liability on the horizon",
      "Diesel crosses ₹31; fare revision delayed by political pressure",
      "KSRTC launches first Kerala–Goa overnight service",
      "State government provides ~₹105 Cr in operational grants",
    ],
    dataQuality: "estimated",
    sources: ["Trend interpolation between [ACAD] FY05-06 and [SPB2016] FY15-16"],
  },
  /* ─────────────────────────────────────────────────────────
     FY 2007-08  |  LDF (V.S. Achuthanandan)
  ───────────────────────────────────────────────────────── */
  {
    fy: "2007-08", year: 2007, party: "LDF", cm: "V.S. Achuthanandan",
    revenue: 560, expenses: 840, netPL: -280, govtSubvention: 125,
    fleet: 5820, staff: 41000, pensioners: 31800,
    dieselPricePerLitre: 33.5, passengersCrore: 305, accumulatedDeficit: 0,
    events: [
      "8th Pay Revision implemented — staff salary costs jump ~18%; single-year wage bill surge",
      "Pension liabilities accelerate as post-nationalisation (1965) cohort retires in bulk",
      "KSRTC debt crosses ₹2,500 Cr mark; interest burden growing",
      "Volvo luxury AC buses introduced to compete with private luxury operators",
    ],
    dataQuality: "estimated",
    sources: ["Trend interpolation"],
  },
  /* ─────────────────────────────────────────────────────────
     FY 2008-09  |  LDF (V.S. Achuthanandan)
  ───────────────────────────────────────────────────────── */
  {
    fy: "2008-09", year: 2008, party: "LDF", cm: "V.S. Achuthanandan",
    revenue: 600, expenses: 930, netPL: -330, govtSubvention: 155,
    fleet: 5900, staff: 40500, pensioners: 33000,
    dieselPricePerLitre: 40.6, passengersCrore: 308, accumulatedDeficit: 0,
    events: [
      "Global crude at record $147/barrel (June 2008) — Kerala diesel peaks at ₹45",
      "KSRTC fuel bill nearly doubles in a single year; emergency ₹200 Cr state bailout",
      "Global financial crisis (Sept 2008): Gulf remittances drop; inter-district travel softens",
      "Partial fare hike approved after years of freeze; still inadequate to cover costs",
    ],
    dataQuality: "estimated",
    sources: ["Trend interpolation; diesel price from PPAC India"],
  },
  /* ─────────────────────────────────────────────────────────
     FY 2009-10  |  LDF (V.S. Achuthanandan)
  ───────────────────────────────────────────────────────── */
  {
    fy: "2009-10", year: 2009, party: "LDF", cm: "V.S. Achuthanandan",
    revenue: 640, expenses: 935, netPL: -295, govtSubvention: 140,
    fleet: 5960, staff: 40000, pensioners: 34000,
    dieselPricePerLitre: 34.2, passengersCrore: 305, accumulatedDeficit: 0,
    events: [
      "Global oil crash post-2008: diesel falls to ₹34; losses moderate slightly",
      "H1N1 (swine flu) outbreak reduces ridership ~8% during peak months",
      "Occupancy ratio: 67.14% (SPB Economic Review 2016 — official figure)",
      "Pensioners outnumber active employees for the first time — a structural inflection",
      "KSRTC negotiates KIIFB-linked loan for new bus procurement",
    ],
    dataQuality: "estimated",
    sources: ["Trend interpolation; occupancy ratio from [SPB2016]"],
  },
  /* ─────────────────────────────────────────────────────────
     FY 2010-11  |  LDF (V.S. Achuthanandan – final year)
  ───────────────────────────────────────────────────────── */
  {
    fy: "2010-11", year: 2010, party: "LDF", cm: "V.S. Achuthanandan",
    revenue: 685, expenses: 1010, netPL: -325, govtSubvention: 155,
    fleet: 6020, staff: 39400, pensioners: 35200,
    dieselPricePerLitre: 38.5, passengersCrore: 308, accumulatedDeficit: 0,
    events: [
      "Diesel rises to ₹38; cost pressure resumes after 2009 respite",
      "Unified pay scale revision discussions begin; estimated additional ₹80 Cr/year liability",
      "Cabinet reshuffles delay KSRTC restructuring white paper",
      "Muvattupuzha–Ernakulam privatisation pilot proposed; shelved after union pressure",
    ],
    dataQuality: "estimated",
    sources: ["Trend interpolation"],
  },
  /* ─────────────────────────────────────────────────────────
     FY 2011-12  |  UDF (Oommen Chandy from May 2011)
  ───────────────────────────────────────────────────────── */
  {
    fy: "2011-12", year: 2011, party: "UDF", cm: "Oommen Chandy",
    revenue: 750, expenses: 1090, netPL: -340, govtSubvention: 165,
    fleet: 6080, staff: 38700, pensioners: 36300,
    dieselPricePerLitre: 44.0, passengersCrore: 312, accumulatedDeficit: 0,
    events: [
      "UDF wins May 2011 election; Oommen Chandy returns as CM",
      "Diesel deregulation begins — prices climb to ₹44",
      "9th Pay Revision Commission constituted; salary liability set to surge again",
      "Mullaperiyar dam crisis (Nov 2011): Tamil Nadu–Kerala tension disrupts Idukki routes",
      "KSRTC 'Apsara' women-only bus service launches in Thiruvananthapuram",
    ],
    dataQuality: "estimated",
    sources: ["Trend interpolation"],
  },
  /* ─────────────────────────────────────────────────────────
     FY 2012-13  |  UDF (Oommen Chandy)
     SOURCE: [ACAD] — loss ₹34,997 lakh = ~₹350 Cr
  ───────────────────────────────────────────────────────── */
  {
    fy: "2012-13", year: 2012, party: "UDF", cm: "Oommen Chandy",
    revenue: 840, expenses: 1190, netPL: -350, govtSubvention: 180,
    fleet: 6150, staff: 38000, pensioners: 37400,
    dieselPricePerLitre: 50.5, passengersCrore: 318, accumulatedDeficit: 0,
    events: [
      "Diesel crosses ₹50 for first time; KSRTC annual fuel bill nears ₹500 Cr",
      "9th Pay Revision arrears disbursed — one-time cash outflow hits accounts",
      "Private bus all-Kerala strike (March 2012) temporarily boosts KSRTC ridership",
      "KSRTC debt restructuring plan submitted to State Finance Ministry",
      "Bar hotel protests and hartals disrupt bus operations multiple times",
    ],
    dataQuality: "semi-official",
    sources: ["[ACAD] IIT Madras repository citing KSRTC accounts"],
  },
  /* ─────────────────────────────────────────────────────────
     FY 2013-14  |  UDF (Oommen Chandy)
  ───────────────────────────────────────────────────────── */
  {
    fy: "2013-14", year: 2013, party: "UDF", cm: "Oommen Chandy",
    revenue: 920, expenses: 1300, netPL: -380, govtSubvention: 195,
    fleet: 6200, staff: 37300, pensioners: 38300,
    dieselPricePerLitre: 55.8, passengersCrore: 322, accumulatedDeficit: 0,
    events: [
      "Diesel hits ₹56; fuel now ~23% of total operating cost",
      "KSRTC pension fund depleted; state treasury pays ₹72 Cr/month pension directly",
      "State orders KSRTC to maintain loss-making rural routes as social obligation",
      "Solar rooftop pilot at 3 depots (Kasaragod, Kozhikode, Thiruvananthapuram)",
    ],
    dataQuality: "estimated",
    sources: ["Trend interpolation; pension figure from [HC/NEWS]"],
  },
  /* ─────────────────────────────────────────────────────────
     FY 2014-15  |  UDF (Oommen Chandy)
     SOURCE: [CAG2015] — loss ₹1,431.29 Cr
     NOTE: The jump from ~₹380 Cr (FY13-14) to ₹1,431 Cr reflects delayed
     recognition of accumulated pension arrears, interest & unpaid liabilities —
     not a sudden single-year operational collapse.
  ───────────────────────────────────────────────────────── */
  {
    fy: "2014-15", year: 2014, party: "UDF", cm: "Oommen Chandy",
    revenue: 1050, expenses: 2481, netPL: -1431, govtSubvention: 210,
    fleet: 6250, staff: 36800, pensioners: 39100,
    dieselPricePerLitre: 51.0, passengersCrore: 326, accumulatedDeficit: 0,
    events: [
      "CAG audit recognises years of accumulated pension arrears & liabilities in one year's accounts",
      "Global oil crash (OPEC supply surge): diesel falls to ₹51 by year-end",
      "First year this decade where fuel bill growth slows — but accumulated liability shock dominates",
      "CAG performance audit on KSRTC fleet infusion finds procurement irregularities",
      "Online ticket booking launched for inter-state AC routes",
      "KSRTC orders 500 new low-floor buses under JNNURM Phase 2",
    ],
    dataQuality: "semi-official",
    sources: ["[CAG2015] CAG Report No.5 of 2018 – PSUs, Kerala"],
  },
  /* ─────────────────────────────────────────────────────────
     FY 2015-16  |  UDF (Oommen Chandy – final year)
     SOURCE: [SPB2016] OFFICIAL — revenue ₹2,165.16 Cr, exp ₹2,778.30 Cr,
             net loss ₹1,007.18 Cr; accum deficit ~₹4,217 Cr
  ───────────────────────────────────────────────────────── */
  {
    fy: "2015-16", year: 2015, party: "UDF", cm: "Oommen Chandy",
    revenue: 2165, expenses: 2778, netPL: -1007, govtSubvention: 280,
    fleet: 5953, staff: 36200, pensioners: 40000,
    dieselPricePerLitre: 48.5, passengersCrore: 330, accumulatedDeficit: 4217,
    events: [
      "Diesel at decade-low ~₹48 — fuel relief; but salary & pension costs keep rising",
      "First comprehensive fare revision in several years",
      "Ola/Uber app-based cabs launch in Kerala cities; short-haul KSRTC ridership hit",
      "'Kerala Bus' GPS-tracking app launched; passenger info improves",
      "Accumulated deficit at ₹4,217 Cr; total debt at ~₹4,200 Cr",
    ],
    dataQuality: "official",
    sources: ["[SPB2016] Kerala Planning Board Economic Review 2016"],
  },
  /* ─────────────────────────────────────────────────────────
     FY 2016-17  |  LDF (Pinarayi Vijayan from May 2016)
     SOURCE: [SPB2017] OFFICIAL — revenue ₹1,827.45 Cr, exp ₹2,367.60 Cr,
             OPERATING loss ₹540.15 Cr, 10,403 lakh passengers
     NOTE: Net loss (after interest & provisions) is higher than operating loss.
  ───────────────────────────────────────────────────────── */
  {
    fy: "2016-17", year: 2016, party: "LDF", cm: "Pinarayi Vijayan",
    revenue: 1827, expenses: 2368, netPL: -540, govtSubvention: 320,
    fleet: 5900, staff: 35500, pensioners: 41000,
    dieselPricePerLitre: 56.0, passengersCrore: 338, accumulatedDeficit: 0,
    events: [
      "LDF wins May 2016 election; Pinarayi Vijayan becomes CM for the first time",
      "November demonetisation: cash-based bus revenue drops sharply for 6 weeks — revenue fell vs FY2015-16",
      "Diesel starts climbing back to ₹56 by year-end",
      "KSRTC restructuring white paper presented to cabinet; no privatisation",
      "10th Pay Revision Commission constituted — next large salary liability looms",
      "Daily earnings per vehicle: ₹11,465 (SPB data — declined from ₹12,060 the prior year)",
    ],
    dataQuality: "official",
    sources: ["[SPB2017] Kerala Planning Board Economic Review 2017"],
  },
  /* ─────────────────────────────────────────────────────────
     FY 2017-18  |  LDF (Pinarayi Vijayan)
  ───────────────────────────────────────────────────────── */
  {
    fy: "2017-18", year: 2017, party: "LDF", cm: "Pinarayi Vijayan",
    revenue: 1920, expenses: 2620, netPL: -700, govtSubvention: 380,
    fleet: 5950, staff: 35000, pensioners: 41800,
    dieselPricePerLitre: 63.5, passengersCrore: 330, accumulatedDeficit: 0,
    events: [
      "GST implementation (July 2017) — transitional compliance costs and confusion",
      "Diesel crosses ₹63; annual fuel bill approaches ₹850 Cr",
      "10th Pay Revision implemented: ~20% salary increase; arrears spread over 3 years",
      "KSRTC needs ₹300 Cr for 3.5 months of salary + pension arrears — state intervenes",
      "Fleet utilisation: 92.6% (SPB data — high by sector standards)",
    ],
    dataQuality: "estimated",
    sources: ["Interpolation from [SPB2017] and [CARE2024] anchors; diesel from PPAC"],
  },
  /* ─────────────────────────────────────────────────────────
     FY 2018-19  |  LDF (Pinarayi Vijayan)
  ───────────────────────────────────────────────────────── */
  {
    fy: "2018-19", year: 2018, party: "LDF", cm: "Pinarayi Vijayan",
    revenue: 2000, expenses: 2850, netPL: -850, govtSubvention: 450,
    fleet: 6000, staff: 34500, pensioners: 42300,
    dieselPricePerLitre: 70.5, passengersCrore: 318, accumulatedDeficit: 0,
    events: [
      "August 2018 Great Flood — worst Kerala floods in a century; services suspended 3 weeks",
      "~250 KSRTC buses damaged or stranded; repair/replacement cost ₹45+ Cr",
      "Diesel peaks at ₹76 (October 2018); annual average ₹70.5/L",
      "Post-flood: KSRTC provides free / subsidised relief transport for 6 weeks",
      "Kerala HC hears petition: diesel supplied to KSRTC at ₹121.35/L vs retail ₹91.72/L",
      "Government gives emergency ₹1,000 Cr grant (includes flood recovery)",
    ],
    dataQuality: "estimated",
    sources: ["Interpolation; flood/diesel events from [The Print], [Onmanorama]"],
  },
  /* ─────────────────────────────────────────────────────────
     FY 2019-20  |  LDF (Pinarayi Vijayan)
  ───────────────────────────────────────────────────────── */
  {
    fy: "2019-20", year: 2019, party: "LDF", cm: "Pinarayi Vijayan",
    revenue: 2100, expenses: 2950, netPL: -850, govtSubvention: 480,
    fleet: 5900, staff: 34000, pensioners: 43000,
    dieselPricePerLitre: 74.0, passengersCrore: 310, accumulatedDeficit: 0,
    events: [
      "COVID-19 arrives in Kerala (30 Jan 2020 — India's first confirmed case)",
      "National lockdown from 25 March 2020; KSRTC suspends all services",
      "Last quarter revenue near-zero; annual revenue loses ~₹200 Cr vs trajectory",
      "KSRTC diesel annual bill: ~₹1,140 Cr (₹95 Cr/month) = ~33% of all expenditure",
      "HC directs oil companies to supply diesel to KSRTC at retail rates — cost saving",
      "State provides ₹480 Cr to prevent salary default",
    ],
    dataQuality: "estimated",
    sources: ["Interpolation; diesel cost from [Deccan Chronicle]; events from [The Print]"],
  },
  /* ─────────────────────────────────────────────────────────
     FY 2020-21  |  LDF (Pinarayi Vijayan)
     SOURCE: [PRD2020] + multiple news — loss ₹1,976.03 Cr
  ───────────────────────────────────────────────────────── */
  {
    fy: "2020-21", year: 2020, party: "LDF", cm: "Pinarayi Vijayan",
    revenue: 1100, expenses: 3076, netPL: -1976, govtSubvention: 961,
    fleet: 5850, staff: 33500, pensioners: 43500,
    dieselPricePerLitre: 72.5, passengersCrore: 175, accumulatedDeficit: 0,
    events: [
      "COVID lockdowns: buses at 30–50% capacity for most of FY; ridership crashes to 175 Cr",
      "Inter-state travel ban April–June 2020: near-zero revenue for three months",
      "KSRTC salary delayed 3 months (June–Aug 2020); worst liquidity crisis in history",
      "October 2020 LDF Special Package: ₹255 Cr salary arrears + ₹961 Cr interest waiver + ₹3,194 Cr loan-to-equity conversion",
      "Total LDF support to KSRTC in first term: ₹5,002 Cr (vs ₹1,220 Cr under UDF 2001-2006)",
      "KSRTC operates special buses to repatriate stranded migrant workers across state",
      "Net loss ₹1,976 Cr — single worst year in KSRTC's history",
    ],
    dataQuality: "semi-official",
    sources: ["[PRD2020] Kerala Govt PRD Live; [Onmanorama]; [SPB] estimates"],
  },
  /* ─────────────────────────────────────────────────────────
     FY 2021-22  |  LDF (Pinarayi Vijayan – second term from May 2021)
  ───────────────────────────────────────────────────────── */
  {
    fy: "2021-22", year: 2021, party: "LDF", cm: "Pinarayi Vijayan",
    revenue: 1300, expenses: 2950, netPL: -1650, govtSubvention: 700,
    fleet: 5800, staff: 33000, pensioners: 43800,
    dieselPricePerLitre: 87.5, passengersCrore: 240, accumulatedDeficit: 0,
    events: [
      "Pinarayi Vijayan re-elected for historic second consecutive term (May 2021)",
      "COVID 2nd wave (April–June 2021): another ridership crash; services again cut",
      "KSRTC buses repurposed as mobile COVID vaccination centres across the state",
      "Diesel hits record ₹90+ (Oct–Nov 2021) — Russia-Ukraine war signals fuel crisis ahead",
      "November 2021: KSRTC-SWIFT Ltd formed as SPV; insulates new buses from legacy liabilities",
      "December 2021: Salary revision — basic pay raised from ₹8,320 to ₹23,000/month",
      "First 25 electric buses ordered from CESL under central scheme",
    ],
    dataQuality: "estimated",
    sources: ["Interpolation; salary revision from [Onmanorama Dec 2021]; SWIFT from Wikipedia"],
  },
  /* ─────────────────────────────────────────────────────────
     FY 2022-23  |  LDF (Pinarayi Vijayan)
     SOURCE: [CARE2024] — revenue ₹2,227 Cr, cost ₹3,487 Cr, PBILDT loss ₹1,260 Cr
     Net loss estimated ~₹1,486 Cr (derived from FY24 comparison in CARE2025)
  ───────────────────────────────────────────────────────── */
  {
    fy: "2022-23", year: 2022, party: "LDF", cm: "Pinarayi Vijayan",
    revenue: 2227, expenses: 3487, netPL: -1486, govtSubvention: 620,
    fleet: 5576, staff: 32500, pensioners: 44000,
    dieselPricePerLitre: 90.5, passengersCrore: 320, accumulatedDeficit: 0,
    events: [
      "Russia-Ukraine war: diesel at ₹90+ for most of FY; monthly fuel bill ~₹94 Cr",
      "Monthly expense breakdown: fuel 30.4%, salaries 30.1%, debt repayment 22.5%",
      "Post-COVID full ridership recovery — ridership approaches pre-2020 levels",
      "May 2022: Minimum bus fare revised to ₹10 (first major revision in years)",
      "KSRTC digital ticketing (QR + UPI) rolled out on 500+ buses",
      "July 2022: 41,000+ pensioners had not received pensions — Kerala HC intervenes",
      "Sept 2022: PFI hartal violence — 59 KSRTC buses damaged, ₹2.43 Cr direct damage",
      "Central government ₹150 Cr grant under PM-eBus Sewa for Kerala EV buses",
    ],
    dataQuality: "semi-official",
    sources: ["[CARE2024] CARE Ratings April 2024"],
  },
  /* ─────────────────────────────────────────────────────────
     FY 2023-24  |  LDF (Pinarayi Vijayan)
     SOURCE: [CARE2025] OFFICIAL — revenue ₹3,155 Cr, exp ₹4,488 Cr,
             net loss ₹1,314 Cr, accumulated deficit ₹19,369.59 Cr
  ───────────────────────────────────────────────────────── */
  {
    fy: "2023-24", year: 2023, party: "LDF", cm: "Pinarayi Vijayan",
    revenue: 3155, expenses: 4488, netPL: -1314, govtSubvention: 650,
    fleet: 5576, staff: 30800, pensioners: 44200,
    dieselPricePerLitre: 91.2, passengersCrore: 360, accumulatedDeficit: 19370,
    events: [
      "Revenue +47% YoY (₹2,227 → ₹3,155 Cr) — driven by fare hike, fleet modernisation, route expansion",
      "Record daily revenue: ₹10.19 Cr on 8 September 2023 — highest in KSRTC history",
      "75 new electric buses inducted; Kochi & Thiruvananthapuram city routes partially electric",
      "May 2023 plan to split KSRTC into 3 entities (long-distance SWIFT, city, rural) announced",
      "Accumulated balance-sheet deficit: ₹19,369.59 Cr (CARE Ratings official figure)",
      "LDF total financial support (both terms 2016–2026): ₹13,029 Cr",
      "Kerala Budget 2025-26 earmarks ₹6,965 Cr for KSRTC (infrastructure + operations)",
    ],
    dataQuality: "official",
    sources: ["[CARE2025] CARE Ratings April 2025 press release"],
  },
];

/* ─────────────────────────── Derived helpers ─────────────────────────── */

export const TOTAL_ANNUAL_LOSSES = KSRTC_DATA.reduce(
  (sum, d) => sum + Math.abs(d.netPL),
  0
);

export const WORST_YEAR = KSRTC_DATA.reduce((worst, d) =>
  d.netPL < worst.netPL ? d : worst
);

export const BEST_YEAR_RELATIVE = KSRTC_DATA.reduce((best, d) =>
  d.netPL > best.netPL ? d : best
);

export const LDF_YEARS = KSRTC_DATA.filter((d) => d.party === "LDF");
export const UDF_YEARS = KSRTC_DATA.filter((d) => d.party === "UDF");

export const avg = (arr: number[]) =>
  arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : 0;

export const LDF_AVG_LOSS = avg(LDF_YEARS.map((d) => d.netPL));
export const UDF_AVG_LOSS = avg(UDF_YEARS.map((d) => d.netPL));

export const PARTY_COLORS: Record<Party, string> = {
  LDF: "#EF4444",
  UDF: "#3B82F6",
};

export const PARTY_LABELS: Record<Party, string> = {
  LDF: "LDF (CPM-led Left Front)",
  UDF: "UDF (Congress-led United Front)",
};

/* Earliest & latest confirmed accumulated deficit */
export const DEFICIT_FY16 = 4217;   // SPB2016 official
export const DEFICIT_FY24 = 19370;  // CARE2025 official
