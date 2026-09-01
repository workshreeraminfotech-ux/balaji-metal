export const CATEGORIES = [
  {
    id: 1,
    name: "Flexible & Rigid Couplings",
    slug: "couplings",
    shortName: "Couplings",
    description: "Heavy-duty shock absorbing, vibration dampening, and torque transmission shaft couplings for all motor drives.",
    icon: "Layers",
    productCount: 3
  },
  {
    id: 2,
    name: "Industrial V-Belt Pulleys",
    slug: "pulleys",
    shortName: "Pulleys",
    description: "CNC precision machined, dynamically balanced V-belt and taper-lock drive pulleys conforming to ISO 1940.",
    icon: "Disc",
    productCount: 2
  },
  {
    id: 3,
    name: "Precision Hand Wheels",
    slug: "hand-wheels",
    shortName: "Hand Wheels",
    description: "Ergonomic cast iron, stainless steel, and mild steel hand wheels with revolving handles for valve and machine control.",
    icon: "CircleDot",
    productCount: 1
  },
  {
    id: 4,
    name: "Transmission Accessories & Bushes",
    slug: "accessories",
    shortName: "Accessories",
    description: "Taper lock bushes, pilot bore adaptors, dynamic balancing hubs, and custom castings.",
    icon: "Cpu",
    productCount: 1
  }
];

export const PRODUCTS = [
  {
    id: 1,
    name: "Pin Bush Flexible Coupling",
    slug: "pin-bush-coupling",
    category_id: 1,
    category_name: "Couplings",
    category_slug: "couplings",
    short_description: "High-performance flexible cushioned coupling engineered for shock load dampening and high torque transmission.",
    description: "Balaji Metal Pin Bush Couplings are premium cushioned flexible shaft couplings specifically engineered to absorb heavy shock loads, dampen torsional vibrations, and compensate for axial, radial, and angular shaft misalignments. Cast with high-grade FG 220/250 Cast Iron and precision CNC machined, they feature specially formulated oil-resistant elastomer rubber/polyurethane bushes with high-tensile alloy steel pins.",
    material: "Cast Iron (Grade FG 220 / FG 250) / EN8 Steel / Mild Steel",
    image: "/images/products/pin-bush-coupling.jpg",
    gallery: [
      "/images/products/pin-bush-coupling.jpg"
    ],
    features: [
      "Heavy-duty torque transmission up to 15,000 Nm",
      "High shock load absorption & vibration dampening",
      "Oil, heat, and moisture resistant elastomer bushes",
      "Fail-safe drive design ensures operation even if bushes wear",
      "Easy installation & maintenance without moving connected shafts",
      "Precision CNC bored and dynamically balanced"
    ],
    available_sizes: [
      "Size FBP-100", "Size FBP-125", "Size FBP-150", 
      "Size FBP-200", "Size FBP-250", "Size FBP-300", 
      "Size FBP-350", "Size FBP-400", "Size FBP-450", "Size FBP-500"
    ],
    specifications: [
      { key: "Bore Range", value: "12 mm – 160 mm" },
      { key: "Torque Rating", value: "100 Nm – 15,000 Nm" },
      { key: "Operating Speed", value: "1,500 – 4,000 RPM" },
      { key: "Bush Material", value: "High-grade Nitrile Rubber (NBR 75 Shore A) / Polyurethane" },
      { key: "Pin Material", value: "High Tensile Alloy Steel Grade 8.8 / EN8" },
      { key: "Misalignment Tolerance", value: "Angular up to 1.5°, Radial up to 0.5 mm" },
      { key: "Standard Finish", value: "Machined Face with Anti-corrosive Industrial Coating" }
    ],
    applications: [
      { application: "Centrifugal Pumps & High-Pressure Compressors", industry: "Chemical & Process" },
      { application: "Conveyor Belt Drives & Bucket Elevators", industry: "Mining, Cement & Bulk Handling" },
      { application: "Industrial Blowers, Fans & Exhausters", industry: "HVAC & Environmental" },
      { application: "Diesel Generator Sets & Hydraulic Power Packs", industry: "Power Generation & Machinery" }
    ],
    is_featured: true,
    is_published: true,
    rating: 4.9,
    reviewsCount: 38
  },
  {
    id: 2,
    name: "Star Bush Spider Coupling (Jaw Coupling)",
    slug: "star-bush-coupling",
    category_id: 1,
    category_name: "Couplings",
    category_slug: "couplings",
    short_description: "Versatile elastomeric jaw spider coupling offering lubrication-free operation, compact footprint, and smooth torque transmission.",
    description: "Star Bush Coupling (Spider / Jaw Coupling) delivers maintenance-free, lubrication-free power transmission. Consisting of two precision CNC turned jaw hubs and a high-grade polyurethane or NBR elastomer star insert, it acts as an electrical insulator and isolates vibrations between driving motors and driven machinery.",
    material: "Alloy Steel SAE 1045 / Cast Iron FG 250 / Sintered Iron / Aluminium",
    image: "/images/products/star-bush-coupling.jpg",
    gallery: [
      "/images/products/star-bush-coupling.jpg"
    ],
    features: [
      "Completely lubrication-free and maintenance-free design",
      "High resilience elastomer spider element absorbs torsional shocks",
      "Electrical insulation barrier prevents eddy current damage",
      "Compact dimensions with high power-to-weight ratio",
      "Quick snap-in spider replacement without removing hubs",
      "Available with pilot bore, finished bore with keyway, or taper lock"
    ],
    available_sizes: [
      "L-050", "L-070", "L-075", "L-090", "L-095", "L-100", 
      "L-110", "L-150", "L-190", "L-225"
    ],
    specifications: [
      { key: "Bore Range", value: "9 mm – 75 mm" },
      { key: "Max Torque Rating", value: "12.5 Nm – 2,400 Nm" },
      { key: "Operating Speed", value: "Up to 6,000 RPM" },
      { key: "Spider Material", value: "Polyurethane (92/98 Shore A) / NBR Rubber / Hytrel" },
      { key: "Working Temperature", value: "-40°C to +100°C" },
      { key: "Balancing Grade", value: "ISO 1940 G6.3 Precision Balancing" }
    ],
    applications: [
      { application: "Electric Motors & Gearbox Inputs", industry: "Manufacturing & Automation" },
      { application: "Centrifugal Pumps & Metering Skids", industry: "Water & Chemical Plants" },
      { application: "Packaging Machines & Printing Presses", industry: "Packaging & Converting" },
      { application: "Air Compressors & Blowers", industry: "Pneumatics & HVAC" }
    ],
    is_featured: true,
    is_published: true,
    rating: 4.8,
    reviewsCount: 42
  },
  {
    id: 3,
    name: "Heavy-Duty Flexible Tyre Coupling",
    slug: "tyre-coupling",
    category_id: 1,
    category_name: "Couplings",
    category_slug: "couplings",
    short_description: "Ultra-flexible tyre coupling designed for high shock-absorbing capability and maximum angular misalignment compensation.",
    description: "Balaji Metal Tyre Couplings incorporate a highly elastic reinforced rubber tyre element clamped securely between steel clamping rings. Engineered for rugged environments where extreme vibration dampening and severe shaft misalignment absorption are critical.",
    material: "Forged / Cast Steel Hubs with Cord-Reinforced Natural/Synthetic Rubber Tyre",
    image: "/images/products/tyre-coupling.jpg",
    gallery: [
      "/images/products/tyre-coupling.jpg"
    ],
    features: [
      "Accommodates angular misalignment up to 4° and axial displacement up to 6mm",
      "High shock load dampening ratio up to 80%",
      "Split tyre design allows fast replacement without dismantling machines",
      "Torsionally soft design protects gearboxes and bearings from stress",
      "No metallic contact between connected shafts"
    ],
    available_sizes: [
      "F-40", "F-50", "F-60", "F-70", "F-80", "F-90", "F-100", "F-120", "F-140", "F-160"
    ],
    specifications: [
      { key: "Bore Range", value: "15 mm – 150 mm" },
      { key: "Torque Range", value: "24 Nm – 14,000 Nm" },
      { key: "Max Speed", value: "Up to 4,500 RPM" },
      { key: "Angular Misalignment", value: "Up to 4°" },
      { key: "Radial Misalignment", value: "Up to 3.2 mm" }
    ],
    applications: [
      { application: "Crushers, Ball Mills & Vibrating Screens", industry: "Mining & Heavy Aggregates" },
      { application: "Rolling Mill Drives & Slitters", industry: "Steel & Metallurgy" },
      { application: "Mud Pumps & Derrick Drives", industry: "Oil & Gas Drilling" }
    ],
    is_featured: true,
    is_published: true,
    rating: 4.9,
    reviewsCount: 26
  },
  {
    id: 4,
    name: "Precision Machined V-Belt Pulley",
    slug: "v-belt-pulley",
    category_id: 2,
    category_name: "Pulleys",
    category_slug: "pulleys",
    short_description: "Dynamically balanced cast iron V-Belt pulleys with precision CNC turned grooves for maximum drive grip and belt lifespan.",
    description: "Manufactured from high-density, fine-grain Grey Cast Iron (Grade FG 200/250) or Ductile Iron, Balaji Metal V-Belt Pulleys feature computer-controlled CNC groove geometries conforming to IS 3142, DIN 2211, and ISO 4183 standards. Statically and dynamically balanced to ISO 1940 Grade G6.3 to prevent vibration, ensure smooth power transmission, and prevent belt wear.",
    material: "Graded Cast Iron (FG 200 / FG 250) / Ductile S.G. Iron",
    image: "/images/products/v-belt-pulley.jpg",
    gallery: [
      "/images/products/v-belt-pulley.jpg"
    ],
    features: [
      "Statically and dynamically balanced up to 30 m/s rim speed (ISO 1940 Grade G6.3)",
      "Mirror-finish CNC turned groove angles ensure zero belt slipping",
      "Available with Taper Lock Bushing or Pilot Bored with Keyway",
      "High grade close-grained iron minimizes groove wear and belt fatigue",
      "Comprehensive standard range from 1 groove to 12 grooves",
      "Black rust-preventive phosphating or anti-corrosion primer coating"
    ],
    available_sizes: [
      "SPZ Series (50mm to 500mm PCD, 1-6 Grooves)",
      "SPA Series (63mm to 630mm PCD, 1-6 Grooves)",
      "SPB Series (100mm to 1000mm PCD, 1-10 Grooves)",
      "SPC Series (200mm to 1250mm PCD, 2-12 Grooves)",
      "Classical A, B, C, D Section Pulleys"
    ],
    specifications: [
      { key: "Groove Profiles", value: "SPA, SPB, SPC, SPZ, A, B, C, D Sections" },
      { key: "Pitch Diameter (PCD)", value: "50 mm to 1,250 mm" },
      { key: "Number of Grooves", value: "1 to 12 Grooves" },
      { key: "Hub Configuration", value: "Taper Lock Bush (1008 to 5050) or Custom Pilot Bore" },
      { key: "Balancing Grade", value: "Dynamic Balancing ISO 1940 Grade G6.3 (G2.5 on request)" },
      { key: "Standards Compliance", value: "IS 3142, DIN 2211, ISO 4183, BS 3790" }
    ],
    applications: [
      { application: "Stone Crushers, Shredders & Ball Mills", industry: "Quarrying & Mining" },
      { application: "Textile Spinning & Ring Frame Drives", industry: "Textile Machinery" },
      { application: "Rice Mills, Flour Mills & Threshers", industry: "Agro Industries" },
      { application: "Rotary Screw Air Compressors & Blowers", industry: "Industrial Machinery" }
    ],
    is_featured: true,
    is_published: true,
    rating: 5.0,
    reviewsCount: 54
  },
  {
    id: 5,
    name: "Heavy Industrial Hand Wheel",
    slug: "hand-wheel",
    category_id: 3,
    category_name: "Hand Wheels",
    category_slug: "hand-wheels",
    short_description: "Ergonomically designed precision-cast hand wheels with polished rim and powder-coated finish for industrial valves and machinery.",
    description: "Balaji Metal Industrial Hand Wheels are designed for effortless manual control, throttling, and actuation in heavy industrial valves, lathes, milling machines, and sluice gates. Made from high-tensile Cast Iron, Stainless Steel (SS 304/316), or Mild Steel, they feature comfortable contoured rims, solid or spoke designs, and revolving phenolic or chrome-plated handles.",
    material: "Cast Iron (FG 200/250) / Stainless Steel (SS 304/SS 316) / Mild Steel",
    image: "/images/products/hand-wheel.jpg",
    gallery: [
      "/images/products/hand-wheel.jpg"
    ],
    features: [
      "Polished chrome/mirror finish on rim for comfortable grip",
      "Tough electro-powder-coated or textured black casting body",
      "Bore options: Round with standard keyway, Square bore, or Hex bore",
      "Available with revolving ergonomic phenolic side handle",
      "2-Spoke, 3-Spoke, 4-Spoke, and Solid Dish designs available",
      "Custom casting and center hub dimensions as per OEM drawings"
    ],
    available_sizes: [
      "100 mm (4\")", "125 mm (5\")", "150 mm (6\")", "200 mm (8\")",
      "250 mm (10\")", "300 mm (12\")", "350 mm (14\")", "400 mm (16\")", "500 mm (20\")"
    ],
    specifications: [
      { key: "Outer Diameter", value: "50 mm – 500 mm (2\" to 20\")" },
      { key: "Bore Types", value: "Round Keyway / Square / Hexagon / Taper Bore (10mm to 65mm)" },
      { key: "Spoke Styles", value: "2-Spoke, 3-Spoke, 4-Spoke, Dished Spoke, Solid Web" },
      { key: "Surface Treatment", value: "Black Powder Coated Body with Mirror Polished Rim" },
      { key: "Handle Options", value: "Fixed Handle / Revolving Grip / Foldaway Safety Handle" }
    ],
    applications: [
      { application: "Gate Valves, Globe Valves, Butterfly Valves & Sluice Gates", industry: "Oil & Gas, Chemical & Water" },
      { application: "Lathe Machines, Milling Feed, Headstock & Tailstock", industry: "Machine Tools & CNC" },
      { application: "Material Handling & Hydraulic Control Valves", industry: "Automation & Hydraulics" }
    ],
    is_featured: true,
    is_published: true,
    rating: 4.9,
    reviewsCount: 31
  },
  {
    id: 6,
    name: "Precision Taper Lock Bush",
    slug: "taper-bush",
    category_id: 4,
    category_name: "Accessories",
    category_slug: "accessories",
    short_description: "Standardized taper lock bushing for rapid, concentric mounting of pulleys and couplings onto drive shafts.",
    description: "Balaji Metal Taper Lock Bushes provide a proven, flexible clamping system for pulleys, sprockets, and couplings. Conforming to international standards, they ensure concentric grip, eliminate shaft keyway damage, and simplify assembly and disassembly with standard allen keys.",
    material: "High Grade Grey Cast Iron (Grade 220) / Carbon Steel SAE 1045",
    image: "/images/products/taper-bush.jpg",
    gallery: [
      "/images/products/taper-bush.jpg"
    ],
    features: [
      "Concentric split taper clamp locks firmly onto shaft",
      "Easy installation & removal using standard grub screws",
      "Full metric and imperial bore range with standard keyways",
      "Interchangeable with international brands (Fenner, Martin, SKF)",
      "High torque transmission capability without shaft damage"
    ],
    available_sizes: [
      "1008", "1108", "1210", "1610", "1615", "2012", "2517", "3020", "3535", "4040", "4545", "5050"
    ],
    specifications: [
      { key: "Bush Series", value: "1008 to 5050" },
      { key: "Bore Range", value: "9 mm to 125 mm (3/8\" to 5\")" },
      { key: "Keyway Standard", value: "DIN 6885 / BS 4235 / ISO R773" },
      { key: "Surface Treatment", value: "Black Chemically Phosphated Anti-Rust Finish" }
    ],
    applications: [
      { application: "V-Belt Pulleys, Timing Pulleys & Sprockets", industry: "Power Transmission" },
      { application: "Flexible Couplings & Speed Reducer Shafts", industry: "Mechanical Drives" }
    ],
    is_featured: false,
    is_published: true,
    rating: 4.8,
    reviewsCount: 19
  }
];
