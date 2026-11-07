export interface UnlockingMethod {
  id: string;
  name: string;
  description: string;
  iconName: string;
  tag: string;
  speed: string;
}

export interface SpecificationItem {
  label: string;
  value: string;
  detail: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const PRODUCT_DATA = {
  brand: "MAX LUXURY",
  productName: "A-01 Deadbolt Type Smart Lock",
  modelCode: "A-01",
  modelFullName: "A-01 | DEADBOLT TYPE SMART LOCK",
  headline: "SMART ACCESS. SECURE EVERY DAY.",
  subheadline: "Advanced security meets modern convenience. Control access your way, anytime, anywhere.",
  sleekTagline: "SLEEK DESIGN. ADVANCED PROTECTION.",
  tagline: "The Future of Home Security Is Here.",
  regularPrice: 250000,
  sellingPrice: 180000,
  currencySymbol: "₦",
  whatsappNumber: "2348147778029",
  whatsappDisplayNumber: "08147778029",
  defaultWhatsappMessage: "Hello Max Luxury, I'm interested in the A-01 Deadbolt Type Smart Lock. Please provide more details about delivery and installation.",
  bannerImage: "/assets/aistudio/66526504-e15f-4f9f-b133-3debd5d0cd41_23068f74.png",
  sidePillars: [
    "Built for reliability.",
    "Designed for you.",
    "Stronger security.",
    "Smarter control.",
    "Modern & stylish.",
  ],
  imageFeatureGrid: [
    { label: "FACE RECOGNITION CAT EYE CAMERA", sub: "3D Biometrics" },
    { label: "4.0-INCH INTERIOR SCREEN", sub: "HD Viewer" },
    { label: "TOUCH FUNCTION KEY", sub: "Smart Touch" },
    { label: "ONE BUTTON SWITCH LOCK", sub: "Instant Secure" },
    { label: "QUICK OPEN HANDLE", sub: "Rapid Exit" },
    { label: "ANTI-LOCK KNOB", sub: "Interior Privacy" },
    { label: "DISPLAY SCREEN", sub: "Status OLED" },
    { label: "PASSWORD SWIPE AREA", sub: "Anti-Peep PIN" },
    { label: "SEMICONDUCTOR FINGERPRINT", sub: "< 0.4s Verification" },
    { label: "ONE-CLICK DOORBELL", sub: "Chime + Alert" },
    { label: "MECHANICAL KEYHOLE", sub: "Emergency Key" },
    { label: "TYPE-C EMERGENCY INTERFACE", sub: "Backup Power" },
  ],
  bottomPillars: [
    { title: "MULTIPLE ACCESS", description: "Choose the way that's most convenient for you." },
    { title: "SMART CONTROL", description: "Manage and monitor access remotely with Tuya App." },
    { title: "RELIABLE SECURITY", description: "Advanced features to keep your home and loved ones safe." },
    { title: "EASY INSTALLATION", description: "Designed for quick and hassle-free installation." },
    { title: "EMERGENCY READY", description: "Emergency power port ensures access even in low battery." },
  ],
  images: {
    banner: "/assets/aistudio/66526504-e15f-4f9f-b133-3debd5d0cd41_23068f74.png",
    main: "/assets/aistudio/Hc659a48981584a37808c4ff71ace4e15Q_70d0fdaa.jpg",
    biometrics: "/assets/aistudio/Hc076d8af20dd418aafe4240130117754c_13e4c416.png",
    camera: "/assets/aistudio/H7bf0cea8eeb14e8a91fa85994cf3ee32y_f2d9df07.png",
    mortise: "/assets/aistudio/H72b4f3f6e4ce40499d05b51eaf5f1b78D_2d02bc68.png",
    smartphone: "/assets/aistudio/H54d3a9d34daf48ce8118bf46858beec83_7954be9b.png",
    parameters: "/assets/aistudio/H1f9721f6088c455d83a5210c178ff9848_3aaa8151.png",
    packageBox: "/assets/aistudio/H6d5ba8d74f614c58a8c4f37b96c1bca9P_5d986491.png",
    functionality: "/assets/aistudio/Ha59b69eaf8b84f4a9dea5ee079f40b681_2a2c14c3.png",
    certifications: "/assets/aistudio/Ha7c3a23ab2614268984bce17521e7e6ab_c51ee9b7.png",
  },
  mortiseDimensions: [
    { label: "Faceplate Width", value: "24 mm", detail: "Front stainless steel trim" },
    { label: "Faceplate Length", value: "240 mm", detail: "Standard high-security height" },
    { label: "Backset", value: "60 mm", detail: "Keyhole & handle edge distance" },
    { label: "Center Distance", value: "68 mm", detail: "Standard 6068 lock configuration" },
    { label: "Lock Body Height", value: "176 mm", detail: "Heavy-duty steel mortise cage" },
    { label: "Lock Body Width", value: "90 mm", detail: "Internal door cavity requirement" },
    { label: "Latch Orientation", value: "Reversible (Right / Left)", detail: "Adjustable for push or pull doors" },
  ],
  unlockingMethods: [
    {
      id: "facial",
      name: "Facial Recognition",
      description: "Access your property using supported facial recognition technology without searching for keys.",
      iconName: "ScanFace",
      tag: "Contactless 3D Scan",
      speed: "< 0.4s",
    },
    {
      id: "palm",
      name: "Palm Vein Recognition",
      description: "Experience advanced contactless biometric unlocking using palm vein recognition.",
      iconName: "Hand",
      tag: "Infrared Sub-dermal",
      speed: "< 0.5s",
    },
    {
      id: "fingerprint",
      name: "Fingerprint Unlock",
      description: "Unlock your door conveniently using your registered fingerprint.",
      iconName: "Fingerprint",
      tag: "Semiconductor Sensor",
      speed: "< 0.3s",
    },
    {
      id: "password",
      name: "Password Unlock",
      description: "Enter your secure PIN code using the integrated keypad.",
      iconName: "KeyRound",
      tag: "Anti-Peep Virtual PIN",
      speed: "Instant",
    },
    {
      id: "nfc",
      name: "NFC Card Unlock",
      description: "Access your door using a compatible registered access card.",
      iconName: "CreditCard",
      tag: "High-Frequency IC Card",
      speed: "Tap & Go",
    },
    {
      id: "key",
      name: "Physical Key Unlock",
      description: "Use the mechanical key as an alternative unlocking method.",
      iconName: "Key",
      tag: "Class-C Brass Cylinder",
      speed: "Manual Backup",
    },
    {
      id: "combination",
      name: "Combination Unlock",
      description: "Use supported multi-method authentication for additional access control.",
      iconName: "ShieldCheck",
      tag: "Dual Verification Mode",
      speed: "High Security",
    },
    {
      id: "app",
      name: "Mobile App Unlock",
      description: "Manage supported lock functions through the Tuya-compatible smartphone application.",
      iconName: "Smartphone",
      tag: "Tuya Smart Ecosystem",
      speed: "Global Remote",
    },
  ] as UnlockingMethod[],
  faqs: [
    {
      question: "Can I unlock the door without a physical key?",
      answer: "Yes. The product supports several alternative unlocking methods, including compatible biometric and digital access options such as 3D facial recognition, palm vein recognition, optical fingerprint, PIN keypad, RFID access cards, and smartphone mobile app control.",
    },
    {
      question: "Can I control the lock with my phone?",
      answer: "The lock is advertised as compatible with Tuya smart app features. Remote functionality depends on its configuration and connectivity, allowing remote unlocking requests, access log monitoring, temporary visitor passcode creation, and visitor communication.",
    },
    {
      question: "Does the lock support facial recognition?",
      answer: "Yes, facial recognition is among the advertised unlocking methods. It utilizes integrated optical sensors designed for quick, hands-free recognition when approaching the door.",
    },
    {
      question: "Can it be installed on any door?",
      answer: "Compatibility depends on the door's thickness, construction, existing lock opening, and mortise dimensions (standard 6068 mortise size: 24mm x 240mm faceplate, 60mm backset). Customers should confirm compatibility before purchase.",
    },
    {
      question: "Can I pay on delivery?",
      answer: "Payment on Delivery is available for eligible locations across Nigeria, subject to order verification and dispatch confirmation.",
    },
    {
      question: "Is installation included?",
      answer: "Installation availability and charges should be confirmed before placing the order. Depending on your state and city, certified locksmith technician referrals or self-installation guides can be arranged.",
    },
  ] as FaqItem[],
  propertyTypes: [
    {
      title: "Luxury Homes & Villas",
      description: "Effortless hands-free entry for family members without juggling keys or worrying about lockouts.",
      iconName: "Home",
    },
    {
      title: "Apartments & Short-Let Properties",
      description: "Issue temporary access PINs or smart authorization for Airbnb & short-stay guests remotely.",
      iconName: "Building2",
    },
    {
      title: "Offices & Commercial Workspaces",
      description: "Track entry logs, manage employee biometric permissions, and keep private executive suites secure.",
      iconName: "Briefcase",
    },
    {
      title: "Hotels & Guest Accommodation",
      description: "Provide contactless card access, eliminate missing physical master keys, and elevate guest prestige.",
      iconName: "Hotel",
    },
  ],
  packageContents: [
    "1x Exterior Smart Lock Panel (Biometrics, Camera, Keypad)",
    "1x Interior Lock Panel (Display Screen, Handle, Manual Knob)",
    "1x 6068 Heavy-Duty Stainless Steel Mortise Lock Body",
    "2x Mechanical Backup Emergency Keys (High Security)",
    "2x Encrypted RFID Smart IC Access Cards",
    "1x Rechargeable Lithium Battery & USB-C Cable",
    "1x Complete Screws & Spindle Installation Hardware Kit",
    "1x Door Cutout Template & English User Manual",
  ],
};

export const NIGERIAN_STATES = [
  "Lagos",
  "Abuja (FCT)",
  "Rivers",
  "Ogun",
  "Oyo",
  "Anambra",
  "Delta",
  "Edo",
  "Enugu",
  "Kano",
  "Kaduna",
  "Akwa Ibom",
  "Abia",
  "Adamawa",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Ebonyi",
  "Ekiti",
  "Gombe",
  "Imo",
  "Jigawa",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Nasarawa",
  "Niger",
  "Ondo",
  "Osun",
  "Plateau",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];
