# Niventra Capital Advisory — Branch & Office Verification Checklist
**Document Owner:** Chief Technology Officer & Compliance Secretariat  
**Classification:** Internal Management & Corporate Governance Protocol  
**Repository Path:** `docs/BRANCH_VERIFICATION_CHECKLIST.md`  
**Last Updated:** October 2026

---

## 1. Executive Policy & Fiduciary Principle

Niventra Capital Advisory maintains an absolute standard of regulatory and factual accuracy:
1. **Zero Unverified Locations Published:** Under Section 12 of the Companies Act, 2013, and SEBI advisory regulations, corporate entities must not represent unverified regional partner localities as registered branch offices.
2. **Current Published State:**
   - **Corporate Head Office (Gwalior):** Fully verified against MCA incorporation records (`Patel Nagar City Centre, Gwalior, Madhya Pradesh - 474001`).
   - **Northern India Advisory Desk (Delhi):** Designated as `PENDING_CONFIRMATION` at *The Nukleus Center, Shivaji Stadium Metro Station, Connaught Place, New Delhi – 110001* (in-person physical consultation by central appointment only).
3. **Internal Registry Isolation:** All 24 historical locality references from legacy files are preserved strictly in `src/lib/branches/legacy-unverified.ts` for management reconciliation and must NOT be published without physical lease verification.

---

## 2. Complete 24-Location Audit & Reconciliation Register

| # | City | State | Address in Legacy Record | PIN Code | Audit Finding & Defect Analysis | Required Proof for Publishing | Verification Status |
|:---|:---|:---|:---|:---|:---|:---|:---:|
| 1 | **Gwalior** | Madhya Pradesh | Patel Nagar City Centre, Gwalior | 474001 | Registered Corporate Head Office under MCA records. Verified phone (1800 890 0818). | MCA Incorporation Certificate, utility bill, lease agreement. | **VERIFIED (PUBLISHED)** |
| 2 | **Delhi** | Delhi | The Nukleus Center, Shivaji Stadium Metro Station, Connaught Place | 110001 | Advisory Desk landline (+91 011 4051 5660) corroborated. Encoding mojibake (`â€¢`) repaired. | Signed coworking/membership deed or executive letter. | **PENDING CONFIRMATION** |
| 3 | **Neemuch** | Madhya Pradesh | Shastri Nagar, Neemuch | 458441 | Locality name only. Missing building, floor, suite, and phone number. | Registered commercial lease agreement & electricity bill. | **UNVERIFIED** |
| 4 | **Shivpuri** | Madhya Pradesh | Gandhi Colony, Shivpuri | 473551 | Locality name only. Missing commercial premise identifier. | Registered commercial lease agreement & staff roster. | **UNVERIFIED** |
| 5 | **Vidisha** | Madhya Pradesh | Tilak Ward, Vidisha | 464001 | Municipal ward name only. Lacks commercial unit number. | Commercial lease deed & local municipal registration. | **UNVERIFIED** |
| 6 | **Khandwa** | Madhya Pradesh | Civil Lines, Khandwa | 450001 | Administrative area name only. Missing street number and unit. | Commercial lease agreement. | **UNVERIFIED** |
| 7 | **Rewa** | Madhya Pradesh | Saman Road, Rewa | 486001 | Road name only. Missing building name or shop number. | Commercial lease agreement. | **UNVERIFIED** |
| 8 | **Raisen** | Madhya Pradesh | Nehru Nagar, Raisen | 464551 | Locality name only. Missing premise identifier. | Commercial lease agreement. | **UNVERIFIED** |
| 9 | **Sehore** | Madhya Pradesh | Station Road, Sehore | 466001 | Road name only. Missing building number. | Commercial lease agreement. | **UNVERIFIED** |
| 10 | **Dewas** | Madhya Pradesh | A.B. Road, Dewas | 455001 | Highway name only. Missing building identifier. | Commercial lease agreement. | **UNVERIFIED** |
| 11 | **Bharatpur** | Rajasthan | Kumher Gate, Bharatpur | 321001 | Historical gate/traffic junction landmark only; no office suite. | Commercial lease agreement. | **UNVERIFIED** |
| 12 | **Banswara** | Rajasthan | Dahod Road, Banswara | 327001 | Highway name only. Missing commercial office suite. | Commercial lease agreement. | **UNVERIFIED** |
| 13 | **Bhopal** | Madhya Pradesh | Arera Colony, Bhopal | 462016 | Suburb covers sectors E-1 to E-8; missing sector and unit number. | Registered commercial office lease & telephone line. | **UNVERIFIED** |
| 14 | **Indore** | Madhya Pradesh | Vijay Nagar, Indore | 452010 | Major commercial hub; missing building name (e.g. Brilliant Titanium). | Commercial lease deed & local trade license. | **UNVERIFIED** |
| 15 | **Agra** | Uttar Pradesh | Sikandra, Agra | 282007 | Broad suburb name; lacks premise details. | Commercial lease agreement. | **UNVERIFIED** |
| 16 | **Mathura** | Uttar Pradesh | Krishna Nagar, Mathura | 281001 | Neighborhood name only; lacks building number. | Commercial lease agreement. | **UNVERIFIED** |
| 17 | **Karauli** | Rajasthan | Hindaun Road, Karauli | 322241 | Road name only; lacks premise number. | Commercial lease agreement. | **UNVERIFIED** |
| 18 | **Dholpur** | Rajasthan | Bari Road, Dholpur | 328001 | Road name only; lacks premise number. | Commercial lease agreement. | **UNVERIFIED** |
| 19 | **Gurugram** | Haryana | Udyog Vihar Gurugram | 122001 | **PIN Code Discrepancy:** Udyog Vihar is typically 122016 (122001 is Old Gurgaon GPO). Missing Phase. | Commercial lease agreement & verified PIN code (Phase I-V). | **UNVERIFIED** |
| 20 | **Ujjain** | Madhya Pradesh | Freeganj, Ujjain | 456010 | Commercial area only; lacks building or shop number. | Commercial lease agreement. | **UNVERIFIED** |
| 21 | **Jaipur** | Rajasthan | Mansarovar, Jaipur | 302020 | Large residential/commercial scheme; missing sector, lane, and building number. | Commercial lease deed & office telephone bill. | **UNVERIFIED** |
| 22 | **Sawai Madhopur** | Rajasthan | Ranthambore Road | 322001 | Highway road; lacks commercial premise number. | Commercial lease agreement. | **UNVERIFIED** |
| 23 | **Udaipur** | Rajasthan | Hiran Magri, Udaipur | 313001 | Suburb covers multiple sectors (Sec 1-14); missing sector and plot number. | Commercial lease agreement. | **UNVERIFIED** |
| 24 | **Mumbai** | Maharashtra | Nariman Point, Opp Air India Building | 400021 | Landmark only ('Opposite Air India Building'); lacks commercial tower name or floor suite. | Commercial lease deed / membership agreement. | **UNVERIFIED** |
| 25 | **Nagpur** | Maharashtra | Civil Lines, Nagpur | 440001 | Administrative area name only; lacks building number. | Commercial lease agreement. | **UNVERIFIED** |

---

## 3. Executive Action Items for Branch Confirmation

To publish any branch from the unverified register to the live public website (`src/lib/branches/data.ts`), the Managing Director or Company Secretary must complete the following protocol:

1. **Document Verification:** Provide a copy of the registered lease agreement, coworking membership contract, or owned title deed.
2. **Utility Evidence:** Provide a recent electricity bill or BSNL/Airtel landline bill in the name of *Niventra Capital Advisory* at that premise.
3. **Operational Hours & Desk Contact:** Provide the dedicated branch contact email and landline number.
4. **Form INC-22 Filing:** If established as an official branch office, provide the MCA Form INC-22 acknowledgment copy.
5. **Technical Migration:** Once authorized, change `status: "VERIFIED"` and move from `legacy-unverified.ts` into `data.ts`. The responsive UI component `BranchDirectory` will automatically reflect the newly approved location without requiring code modifications.
