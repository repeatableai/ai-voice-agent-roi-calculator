// Industry-specific service templates for white-label onboarding

export const INDUSTRIES = [
  { value: "hvac", label: "HVAC" },
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical" },
  { value: "roofing", label: "Roofing" },
  { value: "landscaping", label: "Landscaping" },
  { value: "pool_service", label: "Pool Service" },
  { value: "pest_control", label: "Pest Control" },
  { value: "cleaning", label: "Cleaning Services" },
  { value: "handyman", label: "Handyman" },
  { value: "other", label: "Other" }
];

export const serviceTemplates = {
  hvac: [
    {
      name: "Annual Maintenance Plan",
      price: "$240/yr",
      when_to_offer: "During any routine service or tune-up call.",
      benefits: ["Priority Service Scheduling", "15% Discount on All Repairs", "Two Comprehensive Tune-ups Per Year", "Extends System Lifespan"],
      technician_script: "I noticed you're not currently enrolled in our maintenance plan. It's a great way to ensure your system runs efficiently and prevent costly breakdowns. For just $240 a year, you get priority service, discounts, and two tune-ups. Is that something you might be interested in hearing more about?",
      customer_description: "Ensure your HVAC system runs at peak performance and efficiency year-round. Our plan includes two seasonal tune-ups, priority service, and discounts on any necessary repairs.",
      is_active: true,
      order_priority: 1
    },
    {
      name: "Smart Thermostat Upgrade",
      price: "$399 Installed",
      when_to_offer: "When the customer has an older, non-programmable thermostat.",
      benefits: ["Lower Monthly Energy Bills", "Control Temperature From Your Phone", "Learns Your Schedule Automatically", "Geofencing Capabilities"],
      technician_script: "I see you have a traditional thermostat. We could upgrade you to a new smart thermostat today. They're amazing for saving on energy bills and you can control it right from your phone. We can get one installed for you right now for $399. Would you like to do that?",
      customer_description: "Take full control of your home's comfort and energy usage. A smart thermostat learns your preferences and can be controlled from anywhere, saving you money and keeping you comfortable.",
      is_active: true,
      order_priority: 2
    },
    {
      name: "Air Duct Cleaning",
      price: "$350",
      when_to_offer: "When system is over 5 years old or customer has allergies.",
      benefits: ["Improved Air Quality", "Better System Efficiency", "Reduced Allergens", "Lower Energy Bills"],
      technician_script: "When was the last time you had your air ducts cleaned? Over time, dust and allergens build up in there. We can clean your entire duct system for $350, which really helps with air quality and system efficiency.",
      customer_description: "Professional air duct cleaning removes years of dust, allergens, and debris from your HVAC system, improving air quality and system efficiency.",
      is_active: true,
      order_priority: 3
    },
    {
      name: "UV Air Purifier Installation",
      price: "$525",
      when_to_offer: "For customers concerned about air quality or with health issues.",
      benefits: ["Kills Bacteria and Viruses", "Eliminates Mold Spores", "Reduces Odors", "Healthier Indoor Air"],
      technician_script: "Have you considered adding a UV air purifier to your system? It kills bacteria, viruses, and mold spores right in the air handler. Great for families with allergies or anyone who wants cleaner air. Installation is $525.",
      customer_description: "UV air purification technology kills harmful bacteria, viruses, and mold spores in your HVAC system, providing cleaner, healthier air for your home.",
      is_active: true,
      order_priority: 4
    },
    {
      name: "Whole-Home Humidifier",
      price: "$450 Installed",
      when_to_offer: "During winter months or in dry climates.",
      benefits: ["Prevents Dry Skin", "Protects Wood Furniture", "Reduces Static Electricity", "More Comfortable Air"],
      technician_script: "Do you notice dry air in your home during winter? A whole-home humidifier connects right to your HVAC system and maintains perfect humidity levels automatically. It's $450 installed and makes a huge difference in comfort.",
      customer_description: "Maintain optimal humidity levels throughout your entire home automatically, preventing dry air problems and increasing comfort during dry seasons.",
      is_active: true,
      order_priority: 5
    },
    {
      name: "System Replacement",
      price: "$5,500 - $8,500",
      when_to_offer: "When system is 12+ years old or requires major repairs.",
      benefits: ["Up to 40% Lower Energy Bills", "Quieter Operation", "Better Temperature Control", "10-Year Warranty"],
      technician_script: "Your system is getting up there in age, and repair costs are adding up. A new high-efficiency system would cut your energy bills by up to 40% and comes with a 10-year warranty. We can have it installed in one day. Would you like me to work up a quote?",
      customer_description: "Modern, high-efficiency HVAC systems provide superior comfort, dramatically lower energy bills, and come with comprehensive warranties for peace of mind.",
      is_active: true,
      order_priority: 6
    },
    {
      name: "Ductless Mini-Split Installation",
      price: "$3,200 - $4,500",
      when_to_offer: "For room additions, garages, or hard-to-cool areas.",
      benefits: ["Perfect for Room Additions", "No Ductwork Needed", "Individual Room Control", "High Efficiency"],
      technician_script: "For that room addition or garage, a ductless mini-split is perfect. No ductwork needed, and you get independent temperature control. Installation runs $3,200 to $4,500 depending on the size. Want me to measure the space?",
      customer_description: "Ductless mini-split systems provide efficient heating and cooling for specific rooms or additions without the need for ductwork.",
      is_active: true,
      order_priority: 7
    },
    {
      name: "Air Quality Testing",
      price: "$150",
      when_to_offer: "When customer mentions allergies, odors, or health concerns.",
      benefits: ["Identify Hidden Problems", "Test for Allergens", "Check for Mold", "Professional Report"],
      technician_script: "Would you like us to do a complete air quality test? We'll check for allergens, mold spores, VOCs, and other contaminants. It's $150 and you get a detailed report with recommendations.",
      customer_description: "Professional indoor air quality testing identifies allergens, mold, and contaminants in your home, with detailed recommendations for improvement.",
      is_active: true,
      order_priority: 8
    },
    {
      name: "Emergency Service Plan",
      price: "$199/yr",
      when_to_offer: "To any customer who's had an emergency breakdown.",
      benefits: ["24/7 Priority Response", "No Overtime Charges", "Annual System Check", "10% Parts Discount"],
      technician_script: "To avoid situations like this in the future, we offer an emergency service plan. For $199 a year, you get 24/7 priority response with no overtime charges, plus an annual checkup and 10% off all parts.",
      customer_description: "Emergency service plan provides 24/7 priority response, no overtime charges, and peace of mind knowing your system has expert support anytime.",
      is_active: true,
      order_priority: 9
    },
    {
      name: "Zoning System Installation",
      price: "$1,800 - $3,500",
      when_to_offer: "For multi-story homes or homes with temperature imbalances.",
      benefits: ["Independent Temperature Control Per Zone", "Reduced Energy Waste", "Better Comfort", "Lower Utility Bills"],
      technician_script: "I notice the upstairs is warmer than the downstairs. A zoning system lets you control temperature independently in different areas. Installation ranges from $1,800 to $3,500 depending on the number of zones. Would that be helpful?",
      customer_description: "HVAC zoning systems provide independent temperature control for different areas of your home, improving comfort and reducing energy waste.",
      is_active: true,
      order_priority: 10
    }
  ],

  plumbing: [
    {
      name: "Annual Plumbing Inspection",
      price: "$150/yr",
      when_to_offer: "During any service call.",
      benefits: ["Prevent Major Failures", "Catch Small Issues Early", "Priority Scheduling", "10% Off Repairs"],
      technician_script: "We offer an annual plumbing inspection service. We check all your fixtures, pipes, water heater, and drains to catch small problems before they become expensive emergencies. Just $150 a year and you get priority scheduling plus 10% off any repairs.",
      customer_description: "Comprehensive annual plumbing inspection catches potential problems early, preventing costly emergencies and extending the life of your plumbing system.",
      is_active: true,
      order_priority: 1
    },
    {
      name: "Water Heater Replacement",
      price: "$1,200 - $2,500",
      when_to_offer: "When water heater is 8+ years old or showing signs of failure.",
      benefits: ["More Reliable Hot Water", "Better Energy Efficiency", "10-Year Warranty", "Professional Installation"],
      technician_script: "Your water heater is getting old, and they typically last 8-10 years. We can replace it with a new high-efficiency model for $1,200 to $2,500 depending on size. New ones are much more efficient and come with a 10-year warranty.",
      customer_description: "New water heater installation provides reliable hot water, improved energy efficiency, and comes with comprehensive warranty protection.",
      is_active: true,
      order_priority: 2
    },
    {
      name: "Tankless Water Heater Upgrade",
      price: "$2,800 - $4,500",
      when_to_offer: "For customers wanting unlimited hot water or energy savings.",
      benefits: ["Endless Hot Water", "30% Energy Savings", "Space Saving Design", "20+ Year Lifespan"],
      technician_script: "Have you considered going tankless? You'd never run out of hot water, they're 30% more efficient, and they last 20+ years. Installation runs $2,800 to $4,500, but the energy savings add up. Want me to explain how it works?",
      customer_description: "Tankless water heaters provide unlimited hot water on demand, significant energy savings, and a space-saving design that lasts 20+ years.",
      is_active: true,
      order_priority: 3
    },
    {
      name: "Whole-Home Water Filtration",
      price: "$1,500 - $3,000",
      when_to_offer: "In areas with hard water or water quality concerns.",
      benefits: ["Better Tasting Water", "Protects Appliances", "Softer Skin and Hair", "Reduces Scale Buildup"],
      technician_script: "I noticed you have hard water issues. A whole-home filtration system removes minerals and contaminants from all your water. Better for drinking, better for your skin, and protects your appliances. Runs $1,500 to $3,000 installed.",
      customer_description: "Whole-home water filtration removes contaminants and minerals, providing clean, great-tasting water throughout your home while protecting appliances.",
      is_active: true,
      order_priority: 4
    },
    {
      name: "Drain Cleaning Service",
      price: "$150 - $300",
      when_to_offer: "When customer mentions slow drains.",
      benefits: ["Clears Stubborn Clogs", "Prevents Backups", "Video Inspection Available", "Same-Day Service"],
      technician_script: "Those slow drains can lead to backups if not addressed. We can hydro-jet your main line or snake individual drains. Most jobs run $150 to $300. We can also do a video inspection to see what's going on. Want me to take care of it today?",
      customer_description: "Professional drain cleaning removes clogs and buildup from your plumbing, preventing backups and keeping water flowing freely.",
      is_active: true,
      order_priority: 5
    },
    {
      name: "Sump Pump Installation",
      price: "$800 - $1,500",
      when_to_offer: "In basements prone to flooding or high water tables.",
      benefits: ["Prevents Basement Flooding", "Automatic Operation", "Battery Backup Available", "Protects Your Home"],
      technician_script: "To protect your basement from flooding, we recommend a sump pump system. It automatically pumps out water before it becomes a problem. Installation is $800 to $1,500, and we can add a battery backup for power outages.",
      customer_description: "Sump pump installation protects your basement from flooding by automatically removing water, with optional battery backup for power outages.",
      is_active: true,
      order_priority: 6
    },
    {
      name: "Garbage Disposal Replacement",
      price: "$250 - $450",
      when_to_offer: "When disposal is jammed, leaking, or over 10 years old.",
      benefits: ["Quieter Operation", "More Powerful", "Professional Installation", "5-Year Warranty"],
      technician_script: "Your disposal is pretty old and they've gotten much better. New ones are quieter and more powerful. We can replace it for $250 to $450 depending on the model. Takes about an hour and comes with a 5-year warranty.",
      customer_description: "Modern garbage disposal installation provides quiet, powerful food waste grinding with professional installation and warranty protection.",
      is_active: true,
      order_priority: 7
    },
    {
      name: "Re-piping Service",
      price: "$4,000 - $15,000",
      when_to_offer: "For homes with galvanized pipes or frequent leaks.",
      benefits: ["Eliminates Old Pipe Problems", "Better Water Pressure", "Increases Home Value", "Prevents Future Leaks"],
      technician_script: "These old galvanized pipes are causing your problems. Re-piping with modern PEX or copper eliminates leaks, improves pressure, and adds value to your home. It's a bigger project - $4,000 to $15,000 depending on home size - but it's a permanent solution.",
      customer_description: "Complete home re-piping replaces old, problematic pipes with modern materials, eliminating leaks and improving water pressure throughout your home.",
      is_active: true,
      order_priority: 8
    },
    {
      name: "Backflow Prevention Device",
      price: "$300 - $600",
      when_to_offer: "Required by code in many areas; during irrigation system installation.",
      benefits: ["Protects Drinking Water", "Code Compliant", "Annual Testing Available", "Prevents Contamination"],
      technician_script: "Building code requires a backflow preventer to protect your drinking water from contamination. We can install one for $300 to $600, and we offer annual testing to keep you compliant.",
      customer_description: "Backflow prevention device installation protects your home's drinking water from contamination, meeting code requirements and ensuring water safety.",
      is_active: true,
      order_priority: 9
    },
    {
      name: "Leak Detection Service",
      price: "$200 - $500",
      when_to_offer: "When customer has high water bills or suspects hidden leaks.",
      benefits: ["Finds Hidden Leaks", "Non-Invasive Technology", "Prevents Water Damage", "Detailed Report"],
      technician_script: "High water bills often mean a hidden leak. We use electronic leak detection to find it without tearing into walls. Service runs $200 to $500 depending on complexity, and we give you a detailed report of what we find.",
      customer_description: "Professional leak detection service uses advanced technology to locate hidden leaks without damaging your property, preventing costly water damage.",
      is_active: true,
      order_priority: 10
    }
  ],

  electrical: [
    {
      name: "Electrical Safety Inspection",
      price: "$175",
      when_to_offer: "For any home over 20 years old or after purchasing a home.",
      benefits: ["Identify Safety Hazards", "Prevent Electrical Fires", "Code Compliance Check", "Detailed Report"],
      technician_script: "I recommend a complete electrical safety inspection. We check your panel, wiring, outlets, and identify any hazards or code violations. It's $175 and gives you peace of mind that your home is safe.",
      customer_description: "Comprehensive electrical safety inspection identifies potential hazards, code violations, and aging components to keep your home safe.",
      is_active: true,
      order_priority: 1
    },
    {
      name: "Panel Upgrade to 200 Amp",
      price: "$2,000 - $3,500",
      when_to_offer: "For homes with 100-amp service or frequent breaker trips.",
      benefits: ["Supports Modern Electrical Needs", "Safer Operation", "Adds Home Value", "Permits Future Additions"],
      technician_script: "Your 100-amp panel is maxed out. Upgrading to 200 amps gives you the capacity for modern appliances, EV chargers, and future additions. Runs $2,000 to $3,500 fully permitted. Would that work for you?",
      customer_description: "Electrical panel upgrade to 200-amp service provides the capacity needed for modern homes with multiple appliances and electronics.",
      is_active: true,
      order_priority: 2
    },
    {
      name: "Whole-Home Surge Protection",
      price: "$400 - $700",
      when_to_offer: "For homes with valuable electronics or in areas with power surges.",
      benefits: ["Protects All Electronics", "Prevents Damage from Lightning", "Covers Entire Home", "Insurance for Your Devices"],
      technician_script: "A whole-home surge protector installs at your panel and protects everything in your house from power surges and lightning. It's $400 to $700 and way better than individual surge strips. Think of it as insurance for all your electronics.",
      customer_description: "Whole-home surge protection shields all your electronics and appliances from damaging power surges and lightning strikes.",
      is_active: true,
      order_priority: 3
    },
    {
      name: "EV Charger Installation",
      price: "$800 - $2,000",
      when_to_offer: "For customers with electric vehicles.",
      benefits: ["Charge Overnight at Home", "Level 2 Fast Charging", "Smart Features Available", "Adds Home Value"],
      technician_script: "For your electric vehicle, we can install a Level 2 charger in your garage. Full charge overnight, and it's way more convenient than public charging. Installation runs $800 to $2,000 depending on your panel and distance.",
      customer_description: "Electric vehicle charger installation provides convenient, fast home charging for your EV with smart features and professional installation.",
      is_active: true,
      order_priority: 4
    },
    {
      name: "Smart Home Lighting System",
      price: "$600 - $2,500",
      when_to_offer: "For tech-savvy customers or new home construction.",
      benefits: ["Control Lights From Phone", "Voice Control Compatible", "Energy Savings", "Automated Scheduling"],
      technician_script: "We can set up smart lighting throughout your home. Control everything from your phone, set schedules, use voice control. Installation runs $600 to $2,500 depending on how many lights you want to automate. Really cool system.",
      customer_description: "Smart lighting system installation provides convenient phone and voice control of your home's lighting with automated schedules and energy savings.",
      is_active: true,
      order_priority: 5
    },
    {
      name: "Generator Installation",
      price: "$5,000 - $15,000",
      when_to_offer: "In areas with frequent power outages.",
      benefits: ["Automatic Backup Power", "Powers Whole Home", "Runs on Natural Gas", "Increases Home Value"],
      technician_script: "Tired of losing power? A whole-home generator automatically kicks on during outages and can power everything. Runs on your natural gas line. Installation is $5,000 to $15,000 depending on size, but it's a game-changer during storms.",
      customer_description: "Whole-home generator installation provides automatic backup power during outages, keeping your home comfortable and secure.",
      is_active: true,
      order_priority: 6
    },
    {
      name: "GFCI Outlet Upgrade",
      price: "$125 per outlet",
      when_to_offer: "In kitchens, bathrooms, and outdoor areas without GFCI protection.",
      benefits: ["Prevents Electrical Shock", "Required by Code", "Protects Against Electrocution", "Safer Home"],
      technician_script: "These outlets near water should be GFCI protected for safety. They cut power instantly if they detect a fault. Code requires them in bathrooms, kitchens, and outside. We can upgrade them for $125 per outlet.",
      customer_description: "GFCI outlet installation provides critical shock protection in wet areas, meeting code requirements and keeping your family safe.",
      is_active: true,
      order_priority: 7
    },
    {
      name: "Ceiling Fan Installation",
      price: "$200 - $400 per fan",
      when_to_offer: "For comfort improvement or energy savings.",
      benefits: ["Improved Air Circulation", "Lower Cooling Costs", "Adds Comfort", "Multiple Style Options"],
      technician_script: "Ceiling fans make a huge difference in comfort and can lower your AC costs. We can install them for $200 to $400 per fan depending on the model and whether wiring is already in place. Want me to add a few?",
      customer_description: "Professional ceiling fan installation improves air circulation, reduces cooling costs, and adds comfort to any room.",
      is_active: true,
      order_priority: 8
    },
    {
      name: "Exterior Lighting Package",
      price: "$800 - $2,000",
      when_to_offer: "For security or curb appeal improvements.",
      benefits: ["Enhanced Security", "Better Curb Appeal", "Motion Sensors Available", "LED Energy Efficiency"],
      technician_script: "Exterior lighting really improves security and looks great. We can do a complete package with motion sensors for $800 to $2,000. Includes path lights, spotlights, and security lighting. Want to see some options?",
      customer_description: "Exterior lighting package enhances home security and curb appeal with motion sensors, path lights, and energy-efficient LED fixtures.",
      is_active: true,
      order_priority: 9
    },
    {
      name: "Smoke and CO Detector Upgrade",
      price: "$75 per detector",
      when_to_offer: "For homes with old battery-only detectors.",
      benefits: ["Hardwired with Battery Backup", "Interconnected System", "10-Year Sealed Batteries", "Life-Saving Protection"],
      technician_script: "Your smoke detectors are outdated. New hardwired detectors with battery backup are much more reliable, and they're all interconnected so if one goes off, they all do. We can install them for $75 each. How many rooms do you have?",
      customer_description: "Hardwired smoke and CO detector installation provides reliable, interconnected protection throughout your home with battery backup.",
      is_active: true,
      order_priority: 10
    }
  ],

  // Add default template for other industries
  other: [
    {
      name: "Annual Service Plan",
      price: "$200/yr",
      when_to_offer: "During any service call.",
      benefits: ["Priority Service", "Discounted Rates", "Regular Maintenance", "Peace of Mind"],
      technician_script: "We offer an annual service plan that includes regular maintenance and priority scheduling. For $200 a year, you get peace of mind knowing your systems are well maintained.",
      customer_description: "Annual service plan provides regular maintenance, priority service, and discounted rates for all your service needs.",
      is_active: true,
      order_priority: 1
    },
    {
      name: "Extended Warranty Coverage",
      price: "$300-$500",
      when_to_offer: "When completing any major service or installation.",
      benefits: ["Long-term Protection", "Peace of Mind", "Covers Parts & Labor", "Transferable"],
      technician_script: "I'd recommend adding extended warranty coverage. For $300-500, you're protected against unexpected repair costs for the next 2-3 years, covering both parts and labor.",
      customer_description: "Extended warranty provides comprehensive coverage against unexpected repair costs, including parts and labor for 2-3 years.",
      is_active: true,
      order_priority: 2
    },
    {
      name: "Emergency Service Coverage",
      price: "$150/yr",
      when_to_offer: "During routine service calls.",
      benefits: ["24/7 Emergency Service", "Priority Response", "No Overtime Charges", "Same-Day Service"],
      technician_script: "For just $150 per year, you get 24/7 emergency coverage with priority response and no overtime charges. When something breaks at 2am, you'll be glad you have this.",
      customer_description: "24/7 emergency service coverage ensures priority response anytime day or night, with no overtime charges for after-hours calls.",
      is_active: true,
      order_priority: 3
    },
    {
      name: "Preventive Maintenance Package",
      price: "$250/yr",
      when_to_offer: "After completing any repair work.",
      benefits: ["Bi-Annual Inspections", "Prevents Breakdowns", "Extends Equipment Life", "Saves Money Long-term"],
      technician_script: "Regular preventive maintenance catches small issues before they become expensive problems. For $250 per year, you get two comprehensive inspections that can save you thousands in emergency repairs.",
      customer_description: "Comprehensive preventive maintenance package includes bi-annual inspections to catch issues early and extend equipment life.",
      is_active: true,
      order_priority: 4
    },
    {
      name: "System Upgrade Assessment",
      price: "$99",
      when_to_offer: "When servicing older equipment (5+ years).",
      benefits: ["Efficiency Analysis", "Cost-Benefit Review", "Rebate Research", "Professional Recommendations"],
      technician_script: "I noticed your system is getting older. For $99, I can do a complete upgrade assessment including efficiency analysis, rebate research, and show you exactly how much a new system would save you monthly.",
      customer_description: "Professional system assessment evaluates upgrade options, efficiency improvements, available rebates, and potential monthly savings.",
      is_active: true,
      order_priority: 5
    },
    {
      name: "Smart Technology Integration",
      price: "$200-$400",
      when_to_offer: "During any service visit with tech-savvy customers.",
      benefits: ["Remote Monitoring", "Energy Savings", "Convenience", "Alerts & Notifications"],
      technician_script: "Adding smart technology lets you monitor and control everything from your phone. Most customers save 15-20% on costs with smart controls, and the system pays for itself in about 2 years.",
      customer_description: "Smart technology integration provides remote monitoring, automated controls, and real-time alerts for optimal efficiency and convenience.",
      is_active: true,
      order_priority: 6
    },
    {
      name: "Safety Inspection & Certification",
      price: "$150",
      when_to_offer: "During any service call, especially for commercial customers.",
      benefits: ["Compliance Documentation", "Safety Verification", "Insurance Benefits", "Liability Protection"],
      technician_script: "A certified safety inspection documents that everything meets code and safety standards. This is valuable for insurance purposes and protects you from liability. It's just $150 and takes about 30 minutes.",
      customer_description: "Comprehensive safety inspection with official certification documentation for insurance and compliance requirements.",
      is_active: true,
      order_priority: 7
    },
    {
      name: "Performance Optimization Service",
      price: "$175",
      when_to_offer: "When system is running but not at peak performance.",
      benefits: ["Improved Efficiency", "Lower Operating Costs", "Better Performance", "Extended Equipment Life"],
      technician_script: "Your system is working, but it's not optimized. For $175, I can tune everything for peak performance. Most customers see 10-15% reduction in operating costs immediately.",
      customer_description: "Complete system optimization service maximizes efficiency, reduces operating costs, and improves overall performance.",
      is_active: true,
      order_priority: 8
    },
    {
      name: "Seasonal Preparation Package",
      price: "$125",
      when_to_offer: "Before peak season (summer/winter depending on industry).",
      benefits: ["Peak Season Ready", "Prevents Breakdowns", "Ensures Reliability", "Priority Scheduling"],
      technician_script: "Let's get you ready before the busy season hits. For $125, we'll do a complete seasonal preparation so you're not dealing with breakdowns when you need your system most. Plus you get priority scheduling if anything does come up.",
      customer_description: "Seasonal preparation service ensures your system is ready for peak demand periods with comprehensive inspection and tuning.",
      is_active: true,
      order_priority: 9
    },
    {
      name: "Training & Support Package",
      price: "$100",
      when_to_offer: "After installing new equipment or for commercial customers.",
      benefits: ["Proper Operation Training", "Troubleshooting Guide", "Direct Support Line", "Documentation"],
      technician_script: "I can provide a training session for your team on proper operation and basic troubleshooting. For $100, you get hands-on training, documentation, and a direct support line. This prevents most common issues and downtime.",
      customer_description: "Comprehensive training package teaches proper operation, basic troubleshooting, and provides ongoing support resources.",
      is_active: true,
      order_priority: 10
    }
  ]
};

// Return empty array for industries without templates
export const getServiceTemplatesForIndustry = (industry) => {
  return serviceTemplates[industry] || serviceTemplates.other;
};
