import { Injectable } from "@nestjs/common";

export interface BranchLocation {
  id: string;
  city: string;
  state: string;
  address: string;
  pinCode: string;
  isHeadOffice?: boolean;
  status: "VERIFIED" | "PENDING_CONFIRMATION" | "PENDING_VERIFICATION";
  tier: "HEAD_OFFICE" | "REGIONAL_DESK" | "PARTNER_NETWORK";
  phone?: string;
  email?: string;
  openingHours?: string;
  notes?: string;
}

@Injectable()
export class BranchesService {
  private readonly branches: BranchLocation[] = [
    {
      id: "branch_gwalior_ho",
      city: "Gwalior",
      state: "Madhya Pradesh",
      address: "Patel Nagar City Centre, Gwalior, Madhya Pradesh - 474001",
      pinCode: "474001",
      isHeadOffice: true,
      status: "VERIFIED",
      tier: "HEAD_OFFICE",
      phone: "1800 890 0818",
      email: "info@niventracapitaladvisory.com",
      openingHours: "Mon–Fri: 9:30 AM – 6:30 PM IST",
      notes: "Corporate Head Office registered under the Companies Act, 2013.",
    },
    {
      id: "branch_delhi_desk",
      city: "Delhi",
      state: "Delhi",
      address: "The Nukleus Center, Connaught Place, New Delhi – 110001",
      pinCode: "110001",
      isHeadOffice: false,
      status: "PENDING_CONFIRMATION",
      tier: "REGIONAL_DESK",
      phone: "+91 011 4051 5660",
      email: "info@niventracapitaladvisory.com",
      openingHours: "Mon–Fri: 10:00 AM – 5:00 PM IST (By Prior Appointment)",
      notes: "Northern India Advisory Desk. Physical consultations scheduled via central desk.",
    },
    // Partner Network (23 Regional Locations)
    { id: "branch_bhopal", city: "Bhopal", state: "Madhya Pradesh", address: "Arera Colony, Bhopal, MP - 462016", pinCode: "462016", status: "PENDING_VERIFICATION", tier: "PARTNER_NETWORK", notes: "Historical directory entry; unit number pending verification." },
    { id: "branch_indore", city: "Indore", state: "Madhya Pradesh", address: "Vijay Nagar, Indore, MP - 452010", pinCode: "452010", status: "PENDING_VERIFICATION", tier: "PARTNER_NETWORK", notes: "Historical directory entry; commercial suite pending verification." },
    { id: "branch_ujjain", city: "Ujjain", state: "Madhya Pradesh", address: "Freeganj, Ujjain, MP - 456010", pinCode: "456010", status: "PENDING_VERIFICATION", tier: "PARTNER_NETWORK", notes: "Historical directory entry; suite pending verification." },
    { id: "branch_dewas", city: "Dewas", state: "Madhya Pradesh", address: "A.B. Road, Dewas, MP - 455001", pinCode: "455001", status: "PENDING_VERIFICATION", tier: "PARTNER_NETWORK", notes: "Historical directory entry; premise pending verification." },
    { id: "branch_khandwa", city: "Khandwa", state: "Madhya Pradesh", address: "Station Road, Khandwa, MP - 450001", pinCode: "450001", status: "PENDING_VERIFICATION", tier: "PARTNER_NETWORK", notes: "Historical directory entry; suite pending verification." },
    { id: "branch_jabalpur", city: "Jabalpur", state: "Madhya Pradesh", address: "Civil Lines, Jabalpur, MP - 482001", pinCode: "482001", status: "PENDING_VERIFICATION", tier: "PARTNER_NETWORK", notes: "Historical directory entry; floor pending verification." },
    { id: "branch_satna", city: "Satna", state: "Madhya Pradesh", address: "Rewa Road, Satna, MP - 485001", pinCode: "485001", status: "PENDING_VERIFICATION", tier: "PARTNER_NETWORK", notes: "Historical directory entry; complex pending verification." },
    { id: "branch_rewa", city: "Rewa", state: "Madhya Pradesh", address: "Civil Lines, Rewa, MP - 486001", pinCode: "486001", status: "PENDING_VERIFICATION", tier: "PARTNER_NETWORK", notes: "Historical directory entry; unit pending verification." },
    { id: "branch_sagar", city: "Sagar", state: "Madhya Pradesh", address: "Civil Lines, Sagar, MP - 470001", pinCode: "470001", status: "PENDING_VERIFICATION", tier: "PARTNER_NETWORK", notes: "Historical directory entry; premise pending verification." },
    { id: "branch_mandsaur", city: "Mandsaur", state: "Madhya Pradesh", address: "Station Road, Mandsaur, MP - 458001", pinCode: "458001", status: "PENDING_VERIFICATION", tier: "PARTNER_NETWORK", notes: "Historical directory entry; suite pending verification." },
    { id: "branch_ratlam", city: "Ratlam", state: "Madhya Pradesh", address: "Do Batti, Ratlam, MP - 457001", pinCode: "457001", status: "PENDING_VERIFICATION", tier: "PARTNER_NETWORK", notes: "Historical directory entry; suite pending verification." },
    { id: "branch_chhindwara", city: "Chhindwara", state: "Madhya Pradesh", address: "Parasia Road, Chhindwara, MP - 480001", pinCode: "480001", status: "PENDING_VERIFICATION", tier: "PARTNER_NETWORK", notes: "Historical directory entry; premise pending verification." },
    { id: "branch_guna", city: "Guna", state: "Madhya Pradesh", address: "A.B. Road, Guna, MP - 473001", pinCode: "473001", status: "PENDING_VERIFICATION", tier: "PARTNER_NETWORK", notes: "Historical directory entry; unit pending verification." },
    { id: "branch_shivpuri", city: "Shivpuri", state: "Madhya Pradesh", address: "Court Road, Shivpuri, MP - 473551", pinCode: "473551", status: "PENDING_VERIFICATION", tier: "PARTNER_NETWORK", notes: "Historical directory entry; suite pending verification." },
    { id: "branch_morena", city: "Morena", state: "Madhya Pradesh", address: "Station Road, Morena, MP - 476001", pinCode: "476001", status: "PENDING_VERIFICATION", tier: "PARTNER_NETWORK", notes: "Historical directory entry; complex pending verification." },
    { id: "branch_vidisha", city: "Vidisha", state: "Madhya Pradesh", address: "Station Road, Vidisha, MP - 464001", pinCode: "464001", status: "PENDING_VERIFICATION", tier: "PARTNER_NETWORK", notes: "Historical directory entry; suite pending verification." },
    { id: "branch_katni", city: "Katni", state: "Madhya Pradesh", address: "Station Road, Katni, MP - 483501", pinCode: "483501", status: "PENDING_VERIFICATION", tier: "PARTNER_NETWORK", notes: "Historical directory entry; unit pending verification." },
    { id: "branch_damoh", city: "Damoh", state: "Madhya Pradesh", address: "Station Road, Damoh, MP - 470661", pinCode: "470661", status: "PENDING_VERIFICATION", tier: "PARTNER_NETWORK", notes: "Historical directory entry; unit pending verification." },
    { id: "branch_singrauli", city: "Singrauli", state: "Madhya Pradesh", address: "Waidhan, Singrauli, MP - 486886", pinCode: "486886", status: "PENDING_VERIFICATION", tier: "PARTNER_NETWORK", notes: "Historical directory entry; premise pending verification." },
    { id: "branch_hoshangabad", city: "Hoshangabad", state: "Madhya Pradesh", address: "Narmadapuram, MP - 461001", pinCode: "461001", status: "PENDING_VERIFICATION", tier: "PARTNER_NETWORK", notes: "Historical directory entry; unit pending verification." },
    { id: "branch_sehore", city: "Sehore", state: "Madhya Pradesh", address: "Bhopal Road, Sehore, MP - 466001", pinCode: "466001", status: "PENDING_VERIFICATION", tier: "PARTNER_NETWORK", notes: "Historical directory entry; complex pending verification." },
    { id: "branch_betul", city: "Betul", state: "Madhya Pradesh", address: "Ganj, Betul, MP - 460001", pinCode: "460001", status: "PENDING_VERIFICATION", tier: "PARTNER_NETWORK", notes: "Historical directory entry; premise pending verification." },
    { id: "branch_raipur", city: "Raipur", state: "Chhattisgarh", address: "Pandri, Raipur, Chhattisgarh - 492004", pinCode: "492004", status: "PENDING_VERIFICATION", tier: "PARTNER_NETWORK", notes: "Regional business hub; address pending physical verification." },
  ];

  getAllBranches(search?: string, tier?: string) {
    let result = this.branches;
    if (tier && tier !== "ALL") {
      result = result.filter((b) => b.tier === tier);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.city.toLowerCase().includes(q) ||
          b.state.toLowerCase().includes(q) ||
          b.pinCode.includes(q) ||
          (b.notes && b.notes.toLowerCase().includes(q))
      );
    }
    return {
      total: result.length,
      branches: result,
    };
  }
}
