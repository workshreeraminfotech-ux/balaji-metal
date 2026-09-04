export const CATEGORIES = [
  {
    id: 1,
    name: "Flexible & Rigid Couplings",
    slug: "couplings",
    shortName: "Couplings",
    description: "Heavy-duty shock absorbing, vibration dampening, and torque transmission shaft couplings for all motor drives.",
    icon: "Layers",
    productCount: 2
  },
  {
    id: 2,
    name: "Industrial V-Belt Pulleys",
    slug: "pulleys",
    shortName: "Pulleys",
    description: "Precision machined, dynamically balanced V-belt and multi-groove drive pulleys conforming to ISO 1940.",
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
    short_description: "Heavy-duty cushioned flexible coupling that absorbs motor shock loads and protects connected machinery shafts.",
    description: "Pin Bush Flexible Coupling is designed to connect electric motors with pumps, gearboxes, and industrial machinery. It features durable rubber bushes with high-tensile steel pins that absorb heavy shocks, reduce vibrations, and adjust for minor shaft misalignments, ensuring long life and smooth operation.",
    material: "High-Grade Graded Cast Iron with Heavy-Duty Rubber Bushes",
    image: "/images/products/pin-bush-coupling/pin-bush-coupling-01.jpeg",
    gallery: [
      "/images/products/pin-bush-coupling/pin-bush-coupling-01.jpeg",
      "/images/products/pin-bush-coupling/pin-bush-coupling-02.jpeg",
      "/images/products/pin-bush-coupling/pin-bush-coupling-03.jpeg",
      "/images/products/pin-bush-coupling/pin-bush-coupling-04.jpeg",
      "/images/products/pin-bush-coupling/pin-bush-coupling-05.jpeg"
    ],
    features: [
      "Absorbs heavy shock loads and machine vibration",
      "Protects motor and pump bearings from damage",
      "Durable oil & heat resistant rubber bushes",
      "Easy to install and replace bushes without moving heavy motors",
      "Balanced for smooth running at standard motor speeds"
    ],
    available_sizes: [
      "Size FBP-100", "Size FBP-125", "Size FBP-150", 
      "Size FBP-200", "Size FBP-250", "Size FBP-300", 
      "Size FBP-350", "Size FBP-400", "Size FBP-450", "Size FBP-500"
    ],
    specifications: [
      { key: "Standard Material", value: "Graded Cast Iron (FG 220/250)" },
      { key: "Bush Type", value: "Oil Resistant Nitrile Rubber / Polyurethane" },
      { key: "Fitment", value: "Available with Pilot Bore or Custom Keyway" },
      { key: "Balancing", value: "Dynamically Balanced for Smooth Running" }
    ],
    applications: [
      { application: "Centrifugal Water Pumps & Chemical Pumps", industry: "Chemical & Water Plants" },
      { application: "Conveyor Belts & Bucket Elevators", industry: "Mining, Cement & Handling" },
      { application: "Industrial Exhaust Fans & Air Blowers", industry: "HVAC & Ventilation" },
      { application: "Diesel Generators & Hydraulic Power Packs", industry: "Power Generation & Machinery" }
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
    short_description: "Compact, maintenance-free flexible jaw coupling with polyurethane star insert for smooth vibration-free motor drive.",
    description: "Star Bush Spider Coupling (Jaw Coupling) connects motors and driven equipment with a high-grade polyurethane star insert. It requires no lubrication, provides electrical insulation between shafts, dampens vibrations, and is ideal for electric motor drives.",
    material: "Graded Cast Iron / SAE 1045 Steel with Polyurethane Spider",
    image: "/images/products/star-bush-coupling/star-bush-coupling-01.jpeg",
    gallery: [
      "/images/products/star-bush-coupling/star-bush-coupling-01.jpeg",
      "/images/products/star-bush-coupling/star-bush-coupling-02.jpeg",
      "/images/products/star-bush-coupling/star-bush-coupling-03.jpeg",
      "/images/products/star-bush-coupling/star-bush-coupling-04.jpeg",
      "/images/products/star-bush-coupling/star-bush-coupling-05.jpeg",
      "/images/products/star-bush-coupling/star-bush-coupling-06.jpeg",
      "/images/products/star-bush-coupling/star-bush-coupling-07.jpeg",
      "/images/products/star-bush-coupling/star-bush-coupling-08.jpeg"
    ],
    features: [
      "100% Lubrication-free and maintenance-free",
      "Flexible star spider absorbs torsional vibration",
      "Compact size with high torque capacity",
      "Fast replacement of spider insert without moving hubs",
      "Safe and reliable power transmission"
    ],
    available_sizes: [
      "L-050", "L-070", "L-075", "L-090", "L-095", "L-100", 
      "L-110", "L-150", "L-190", "L-225"
    ],
    specifications: [
      { key: "Body Material", value: "Graded Cast Iron / Steel" },
      { key: "Spider Material", value: "High Resilience Polyurethane (PU)" },
      { key: "Bore Fitment", value: "Pilot Bore / Finished Bore with Keyway" },
      { key: "Maintenance", value: "Zero Lubrication Required" }
    ],
    applications: [
      { application: "Electric Motors & Gearboxes", industry: "Manufacturing & Automation" },
      { application: "Water Pumps & Liquid Dosing Skids", industry: "Water & Chemical Plants" },
      { application: "Packaging Machines & Printing Units", industry: "Packaging & Processing" },
      { application: "Air Compressors & Industrial Blowers", industry: "Pneumatics & HVAC" }
    ],
    is_featured: true,
    is_published: true,
    rating: 4.8,
    reviewsCount: 42
  },
  {
    id: 3,
    name: "Precision Machined V-Belt Pulley",
    slug: "v-belt-pulley",
    category_id: 2,
    category_name: "Pulleys",
    category_slug: "pulleys",
    short_description: "Dynamically balanced cast iron V-Belt pulley with smooth precision grooves for maximum grip and long belt life.",
    description: "Balaji Metal V-Belt Pulleys are cast from heavy-duty grey iron and precision turned for perfect groove alignment. Dynamically balanced to eliminate vibration, they ensure smooth power transmission, prevent belt slipping, and extend the operating life of belts.",
    material: "High-Grade Fine Grain Cast Iron (FG 200/250)",
    image: "/images/products/v-belt-pulley/v-belt-pulley-01.jpeg",
    gallery: [
      "/images/products/v-belt-pulley/v-belt-pulley-01.jpeg",
      "/images/products/v-belt-pulley/v-belt-pulley-02.jpeg",
      "/images/products/v-belt-pulley/v-belt-pulley-03.jpeg",
      "/images/products/v-belt-pulley/v-belt-pulley-04.jpeg",
      "/images/products/v-belt-pulley/v-belt-pulley-05.jpeg",
      "/images/products/v-belt-pulley/v-belt-pulley-06.jpeg",
      "/images/products/v-belt-pulley/v-belt-pulley-07.jpeg",
      "/images/products/v-belt-pulley/v-belt-pulley-08.jpeg"
    ],
    features: [
      "Dynamically balanced for smooth, vibration-free running",
      "Smooth groove finish prevents belt wear and slipping",
      "Heavy cast iron construction for long service life",
      "Available with pilot bore, finished keyway, or taper bush fitment",
      "Corrosion-resistant protective coating"
    ],
    available_sizes: [
      "SPZ Series (1 to 6 Grooves)",
      "SPA Series (1 to 6 Grooves)",
      "SPB Series (1 to 10 Grooves)",
      "SPC Series (2 to 12 Grooves)",
      "Classical A, B, C Section Pulleys"
    ],
    specifications: [
      { key: "Material", value: "Graded Cast Iron FG 200/250" },
      { key: "Groove Sections", value: "SPA, SPB, SPC, SPZ, A, B, C" },
      { key: "Balancing", value: "Dynamic Balancing to ISO 1940" },
      { key: "Mounting", value: "Pilot Bore or Standard Taper Bush" }
    ],
    applications: [
      { application: "Textile Spinning Frames & Looms", industry: "Textile Machinery" },
      { application: "Rice Mills, Flour Mills & Grain Processing", industry: "Agro & Food Processing" },
      { application: "Rotary Air Compressors & Blowers", industry: "Industrial Machinery" },
      { application: "Stone Crushers & Screening Plants", industry: "Quarrying & Mining" }
    ],
    is_featured: true,
    is_published: true,
    rating: 5.0,
    reviewsCount: 54
  },
  {
    id: 4,
    name: "Heavy-Duty Multi-Groove Drive Pulley (Series 2)",
    slug: "v-belt-pulley-2",
    category_id: 2,
    category_name: "Pulleys",
    category_slug: "pulleys",
    short_description: "Heavy multi-groove cast iron drive pulley built for high-horsepower motors and heavy industrial loads.",
    description: "Designed for heavy continuous operation, this Multi-Groove Drive Pulley provides exceptional grip for high-horsepower industrial drives. Statically and dynamically balanced to eliminate vibration, it is ideal for heavy crushing and processing equipment.",
    material: "Heavy Graded Cast Iron (FG 250) / Ductile Iron",
    image: "/images/products/v-belt-pulley-2/v-belt-pulley-2-01.jpeg",
    gallery: [
      "/images/products/v-belt-pulley-2/v-belt-pulley-2-01.jpeg",
      "/images/products/v-belt-pulley-2/v-belt-pulley-2-02.jpeg",
      "/images/products/v-belt-pulley-2/v-belt-pulley-2-03.jpeg"
    ],
    features: [
      "High torque transmission for heavy machinery",
      "Multi-groove design ensures maximum belt contact",
      "Dynamically balanced for smooth operation at high speeds",
      "Heavy cast iron casting absorbs mechanical drive strain",
      "Anti-rust protective primer finish"
    ],
    available_sizes: [
      "SPC Section Multi-Groove (3 to 12 Grooves)",
      "SPB Section Multi-Groove (4 to 10 Grooves)",
      "SPA Section Multi-Groove (2 to 8 Grooves)",
      "Heavy C & D Section Multi-Groove"
    ],
    specifications: [
      { key: "Material Grade", value: "Heavy-Duty Cast Iron FG 250" },
      { key: "Number of Grooves", value: "3 to 12 Grooves" },
      { key: "Balancing Standard", value: "ISO 1940 Dynamic Balancing" },
      { key: "Fitment", value: "Custom Pilot Bore / Keyway / Taper Lock" }
    ],
    applications: [
      { application: "Stone Crushers & Heavy Shredders", industry: "Mining & Quarrying" },
      { application: "Heavy Conveyor Belt Drives", industry: "Material Handling" },
      { application: "High-Pressure Industrial Compressors", industry: "Process Plants" }
    ],
    is_featured: true,
    is_published: true,
    rating: 5.0,
    reviewsCount: 29
  },
  {
    id: 5,
    name: "Heavy Industrial Hand Wheel",
    slug: "hand-wheel",
    category_id: 3,
    category_name: "Hand Wheels",
    category_slug: "hand-wheels",
    short_description: "Precision-cast industrial hand wheel with mirror polished rim and durable powder-coated body for easy valve and machine control.",
    description: "Balaji Metal Industrial Hand Wheels provide comfortable manual control for industrial valves, lathe machines, and sluice gates. Made from high-tensile cast iron, they feature a smooth contoured rim, durable powder-coated body, and revolving side handles.",
    material: "High-Tensile Cast Iron (FG 200/250) / Stainless Steel / Mild Steel",
    image: "/images/products/hand-wheel/hand-wheel-01.jpeg",
    gallery: [
      "/images/products/hand-wheel/hand-wheel-01.jpeg",
      "/images/products/hand-wheel/hand-wheel-02.jpeg",
      "/images/products/hand-wheel/hand-wheel-03.jpeg",
      "/images/products/hand-wheel/hand-wheel-04.jpeg",
      "/images/products/hand-wheel/hand-wheel-05.jpeg",
      "/images/products/hand-wheel/hand-wheel-06.jpeg"
    ],
    features: [
      "Polished smooth rim for comfortable hand grip",
      "Durable black powder-coated cast iron body",
      "Available with standard keyway bore, square bore, or hex bore",
      "Optional revolving phenolic or chrome-plated side handle",
      "Spoke design and solid web options available"
    ],
    available_sizes: [
      "100 mm (4\")", "125 mm (5\")", "150 mm (6\")", "200 mm (8\")",
      "250 mm (10\")", "300 mm (12\")", "350 mm (14\")", "400 mm (16\")", "500 mm (20\")"
    ],
    specifications: [
      { key: "Material", value: "Cast Iron FG 200/250 / Mild Steel" },
      { key: "Bore Types", value: "Round with Keyway / Square / Hexagon" },
      { key: "Finish", value: "Polished Rim with Black Powder Coated Body" },
      { key: "Handle Type", value: "Revolving Grip Handle / Fixed Handle" }
    ],
    applications: [
      { application: "Gate Valves, Globe Valves & Sluice Gates", industry: "Water, Chemical & Pipeline" },
      { application: "Lathe Machines & Workshop Equipment", industry: "Machine Tools & Machinery" },
      { application: "Hydraulic & Manual Control Systems", industry: "Automation & Hydraulics" }
    ],
    is_featured: true,
    is_published: true,
    rating: 4.9,
    reviewsCount: 31
  }
];

