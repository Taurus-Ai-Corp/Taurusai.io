import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CarouselImage {
  src: string;
  title: string;
}

interface OrbitItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  link?: string;
  angle: number;
  orbitRadius: number;
  carouselImages?: CarouselImage[];
}

const orbitItems: OrbitItem[] = [
  {
    id: "multilingual",
    title: "Multilingual Local",
    subtitle: "Integrations",
    description: "Seamless integration with local systems and multilingual support for global enterprise deployment across diverse markets and regulatory environments.",
    icon: "🌐",
    color: "from-cyan to-blue-500",
    angle: 0,
    orbitRadius: 180,
  },
  {
    id: "backoffice",
    title: "Back Office",
    subtitle: "Task Automation",
    description: "Intelligent automation of back-office operations including document processing, data entry, reconciliation, and compliance workflows. Unlock efficiency and slash costs with intelligent automation.",
    icon: "⚙️",
    color: "from-purple-500 to-pink-500",
    angle: 45,
    orbitRadius: 180,
    carouselImages: [
      { src: "/carousel/2_Unlock-efficiency-and-slash-costs-with-intelligent-automation.png", title: "Unlock Efficiency" },
      { src: "/carousel/3_Why-Automate-Your-Back-Office.png", title: "Why Automate" },
      { src: "/carousel/4_Key-Tasks-You-Can-Automate-Today.png", title: "Key Tasks" },
      { src: "/carousel/5_Tools-Powering-Back-Office-Automation-in-2025.png", title: "Power Tools 2025" },
      { src: "/carousel/6_Ready-to-Transform-Your-Back-Office.png", title: "Transform Today" },
    ],
  },
  {
    id: "saas",
    title: "AI Powered",
    subtitle: "SaaS Modules",
    description: "Modular AI-powered software-as-a-service components that can be deployed independently or as part of an integrated enterprise solution.",
    icon: "🤖",
    color: "from-quantum to-cyan",
    angle: 90,
    orbitRadius: 180,
  },
  {
    id: "publicsector",
    title: "Public Sector",
    subtitle: "Organisation",
    description: "Revolutionizing public-sector organizations through AI-driven digital transformation, citizen services, and government process automation.",
    icon: "🏛️",
    color: "from-success to-teal-500",
    angle: 135,
    orbitRadius: 180,
  },
  {
    id: "agriculture",
    title: "Precision",
    subtitle: "Agriculture",
    description: "AI-optimized agricultural solutions for crop monitoring, yield prediction, resource management, and sustainable farming practices.",
    icon: "🌾",
    color: "from-green-500 to-emerald-500",
    angle: 180,
    orbitRadius: 180,
  },
  {
    id: "retail",
    title: "Digital & Retail",
    subtitle: "Business Automation",
    description: "End-to-end automation for retail and digital businesses including inventory management, customer engagement, and omnichannel operations.",
    icon: "🛒",
    color: "from-orange-500 to-amber-500",
    angle: 225,
    orbitRadius: 180,
  },
  {
    id: "education",
    title: "Educational",
    subtitle: "Management System",
    description: "Integrated educational management platform for institutions, featuring student tracking, curriculum management, and AI-powered learning analytics.",
    icon: "📚",
    color: "from-blue-500 to-indigo-500",
    angle: 270,
    orbitRadius: 180,
    carouselImages: [
      { src: "/carousel/2_Transforming-Education-with-an-Integrated-Management-System.png", title: "Transforming Education" },
      { src: "/carousel/3_What-is-an-Integrated-Educational-Management-System-IEMS.png", title: "What is IEMS" },
      { src: "/carousel/4_Real-Impact-How-IEMS-Revolutionizes-Schools.png", title: "Real Impact" },
      { src: "/carousel/5_Safety-and-Engagement-Powered-by-Technology.png", title: "Safety & Engagement" },
      { src: "/carousel/6_Ready-to-Reimagine-Your-Schools-Future.png", title: "Reimagine Future" },
    ],
  },
];

export default function EcosystemOrbit() {
  const [selectedItem, setSelectedItem] = useState<OrbitItem | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const handleItemClick = (item: OrbitItem) => {
    setSelectedItem(item);
    setCarouselIndex(0);
  };

  const nextSlide = () => {
    if (selectedItem?.carouselImages) {
      setCarouselIndex((prev) => 
        prev === selectedItem.carouselImages!.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevSlide = () => {
    if (selectedItem?.carouselImages) {
      setCarouselIndex((prev) => 
        prev === 0 ? selectedItem.carouselImages!.length - 1 : prev - 1
      );
    }
  };

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-background via-card/30 to-background">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: "url('/images/taurus-ecosystem.png')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      
      <div className="container relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Evolution of AI Integration
            <span className="gradient-text"> & Orchestration</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our comprehensive ecosystem of AI-powered solutions designed to transform every aspect of enterprise operations.
          </p>
        </div>

        {/* Orbit Container */}
        <div className="relative w-full max-w-4xl mx-auto aspect-square">
          {/* Center Logo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-primary via-cyan to-quantum p-1"
            >
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                <div className="text-center">
                  <img 
                    src="/images/Logo.naked.png" 
                    alt="Taurus AI" 
                    className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-1"
                  />
                  <span className="text-xs md:text-sm font-bold text-foreground">TAURUS AI</span>
                  <span className="block text-[10px] text-muted-foreground">CORP.</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Orbit Rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] md:w-[450px] md:h-[450px] rounded-full border border-primary/20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] md:w-[350px] md:h-[350px] rounded-full border border-quantum/20" />
          
          {/* Golden Orbit Path */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] md:w-[450px] md:h-[450px]"
          >
            <svg className="w-full h-full" viewBox="0 0 450 450">
              <defs>
                <linearGradient id="orbitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#FFD700" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.6" />
                </linearGradient>
              </defs>
              <ellipse
                cx="225"
                cy="225"
                rx="180"
                ry="180"
                fill="none"
                stroke="url(#orbitGradient)"
                strokeWidth="2"
                strokeDasharray="10 5"
              />
            </svg>
          </motion.div>

          {/* Orbit Items */}
          {orbitItems.map((item, index) => {
            const angleRad = (item.angle * Math.PI) / 180;
            const x = Math.cos(angleRad) * item.orbitRadius;
            const y = Math.sin(angleRad) * item.orbitRadius;
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: hoveredItem === item.id ? 1.15 : 1,
                }}
                transition={{ 
                  delay: index * 0.1,
                  duration: 0.3,
                }}
                className="absolute top-1/2 left-1/2 z-10"
                style={{
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                }}
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleItemClick(item)}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`
                    w-20 h-20 md:w-24 md:h-24 rounded-2xl 
                    bg-gradient-to-br ${item.color}
                    border-2 border-white/20
                    shadow-lg shadow-black/30
                    flex flex-col items-center justify-center
                    cursor-pointer transition-all duration-300
                    hover:shadow-xl hover:shadow-primary/20
                    ${hoveredItem === item.id ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
                  `}
                >
                  <span className="text-2xl mb-1">{item.icon}</span>
                  <span className="text-[8px] md:text-[10px] font-semibold text-white text-center leading-tight px-1">
                    {item.title}
                  </span>
                  <span className="text-[7px] md:text-[8px] text-white/80 text-center leading-tight px-1">
                    {item.subtitle}
                  </span>
                </motion.button>
              </motion.div>
            );
          })}

          {/* Floating Geometric Shapes */}
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 right-10 w-8 h-8 border-2 border-primary/30 rotate-45"
          />
          <motion.div
            animate={{ 
              y: [0, 20, 0],
              rotate: [0, -180, -360],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-20 left-10 w-6 h-6 bg-quantum/20 rounded-full"
          />
          <motion.div
            animate={{ 
              x: [0, 15, 0],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/3 right-5 w-4 h-4 border border-cyan/40"
          />
        </div>

        {/* Instruction Text */}
        <p className="text-center text-muted-foreground mt-8">
          Click on any module to explore its capabilities
        </p>
      </div>

      {/* Modal with Carousel */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-2xl max-w-4xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${selectedItem.color} flex items-center justify-center text-3xl`}>
                  {selectedItem.icon}
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              
              <h3 className="text-2xl font-bold text-foreground mb-1">
                {selectedItem.title}
              </h3>
              <p className="text-primary font-medium mb-4">{selectedItem.subtitle}</p>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {selectedItem.description}
              </p>

              {/* Carousel Section */}
              {selectedItem.carouselImages && selectedItem.carouselImages.length > 0 && (
                <div className="mb-6">
                  <div className="relative rounded-xl overflow-hidden bg-black/20">
                    <motion.img
                      key={carouselIndex}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      src={selectedItem.carouselImages[carouselIndex].src}
                      alt={selectedItem.carouselImages[carouselIndex].title}
                      className="w-full h-auto max-h-[400px] object-contain"
                    />
                    
                    {/* Navigation Arrows */}
                    <button
                      onClick={prevSlide}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6 text-white" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                    >
                      <ChevronRight className="w-6 h-6 text-white" />
                    </button>

                    {/* Slide Counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 rounded-full text-white text-sm">
                      {carouselIndex + 1} / {selectedItem.carouselImages.length}
                    </div>
                  </div>

                  {/* Thumbnail Navigation */}
                  <div className="flex gap-2 mt-4 justify-center overflow-x-auto pb-2">
                    {selectedItem.carouselImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCarouselIndex(idx)}
                        className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                          idx === carouselIndex 
                            ? 'border-primary ring-2 ring-primary/30' 
                            : 'border-transparent hover:border-primary/50'
                        }`}
                      >
                        <img 
                          src={img.src} 
                          alt={img.title}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex gap-3">
                <Button className="flex-1">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                {selectedItem.link && (
                  <Button variant="outline" asChild>
                    <a href={selectedItem.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
