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
    orbitRadius: 220,
  },
  {
    id: "backoffice",
    title: "Back Office",
    subtitle: "Task Automation",
    description: "Intelligent automation of back-office operations including document processing, data entry, reconciliation, and compliance workflows. Unlock efficiency and slash costs with intelligent automation.",
    icon: "⚙️",
    color: "from-purple-500 to-pink-500",
    angle: 45,
    orbitRadius: 220,
    carouselImages: [
      { src: "/carousel/2_Unlock-efficiency-and-slash-costs-with-intelligent-automation.png", title: "Unlock Efficiency" },
      { src: "/carousel/3_Why-Automate-Your-Back-Office.png", title: "Why Automate" },
      { src: "/carousel/4_Key-Tasks-You-Can-Automate-Today.png", title: "Key Tasks" },
      { src: "/carousel/5_Tools-Powering-Back-Office-Automation-in-2025.png", title: "Power Tools 2025" },
      { src: "/carousel/6_Ready-to-Transform-Your-Back-Office.png", title: "Transform Today" },
    ],
  },
  {
    id: "finance",
    title: "Finance",
    subtitle: "Risk & Compliance",
    description: "Advanced financial risk assessment, regulatory compliance automation, and real-time fraud detection powered by quantum-safe cryptography.",
    icon: "💰",
    color: "from-green-500 to-emerald-500",
    angle: 90,
    orbitRadius: 220,
  },
  {
    id: "agriculture",
    title: "Agriculture",
    subtitle: "Precision Farming",
    description: "AI-driven crop optimization, precision farming, and sustainable agriculture solutions leveraging IoT sensors and predictive analytics.",
    icon: "🌾",
    color: "from-yellow-500 to-orange-500",
    angle: 135,
    orbitRadius: 220,
  },
  {
    id: "education",
    title: "Education",
    subtitle: "Integrated Management",
    description: "Comprehensive educational management system integrating student information, learning analytics, and administrative workflows for modern institutions.",
    icon: "🎓",
    color: "from-blue-500 to-indigo-500",
    angle: 180,
    orbitRadius: 220,
    carouselImages: [
      { src: "/carousel/1_Introducing-the-Integrated-Educational-Management-System.png", title: "IEMS Introduction" },
      { src: "/carousel/2_Transforming-Education-with-Smart-Technology.png", title: "Smart Technology" },
      { src: "/carousel/3_Streamline-Operations-Empower-Educators.png", title: "Empower Educators" },
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

  const handleClose = () => {
    setSelectedItem(null);
    setCarouselIndex(0);
  };

  const nextSlide = () => {
    if (selectedItem?.carouselImages) {
      setCarouselIndex((prev) => (prev + 1) % (selectedItem.carouselImages?.length || 1));
    }
  };

  const prevSlide = () => {
    if (selectedItem?.carouselImages) {
      setCarouselIndex((prev) => 
        prev === 0 ? (selectedItem.carouselImages?.length || 1) - 1 : prev - 1
      );
    }
  };

  return (
    <div className="relative w-full h-[600px] flex items-center justify-center">
      {/* Central Logo - Stationary */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="relative w-24 h-24">
          <img 
            src="/images/Logo.naked.png" 
            alt="Taurus AI" 
            className="w-full h-full object-contain"
          />
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-quantum/30 blur-xl animate-pulse" />
        </div>
      </div>

      {/* Rotating Golden Orbital Lines */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        {/* Inner orbit ring */}
        <div className="absolute w-[300px] h-[300px] rounded-full border-2 border-warning/30" />
        
        {/* Middle orbit ring */}
        <div className="absolute w-[440px] h-[440px] rounded-full border-2 border-warning/20" />
        
        {/* Outer orbit ring */}
        <div className="absolute w-[580px] h-[580px] rounded-full border border-warning/10" />

        {/* Golden supernova lines */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-full origin-center"
            style={{
              transform: `rotate(${i * 45}deg)`,
              background: `linear-gradient(to bottom, transparent 0%, rgba(251, 191, 36, 0.3) 45%, rgba(251, 191, 36, 0.1) 55%, transparent 100%)`,
            }}
          />
        ))}
      </motion.div>

      {/* Rotating Ecosystem Cubes */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        {orbitItems.map((item, index) => {
          const angle = (index / orbitItems.length) * 360;
          const radian = (angle * Math.PI) / 180;
          const x = Math.cos(radian) * item.orbitRadius;
          const y = Math.sin(radian) * item.orbitRadius;

          return (
            <motion.div
              key={item.id}
              className="absolute"
              style={{
                left: "50%",
                top: "50%",
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              }}
              animate={{ rotate: -360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            >
              <motion.button
                whileHover={{ scale: 1.2, rotateY: 180 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleItemClick(item)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`
                  relative w-20 h-20 rounded-lg
                  bg-gradient-to-br ${item.color}
                  shadow-lg hover:shadow-2xl
                  transition-all duration-300
                  flex items-center justify-center
                  text-3xl
                  cursor-pointer
                  border-2 border-white/20
                `}
                style={{
                  transformStyle: "preserve-3d",
                  perspective: "1000px",
                }}
              >
                {/* Cube face */}
                <span className="relative z-10">{item.icon}</span>
                
                {/* Glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-50 blur-md rounded-lg`} />
                
                {/* Label on hover */}
                <AnimatePresence>
                  {hoveredItem === item.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute -bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap"
                    >
                      <div className="bg-card/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-xl border border-border">
                        <p className="text-sm font-bold text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Modal/Popup for Selected Item */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-card rounded-2xl shadow-2xl border border-border overflow-hidden"
            >
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className="p-8">
                {/* Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${selectedItem.color} flex items-center justify-center text-3xl shadow-lg`}>
                    {selectedItem.icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-foreground mb-2">
                      {selectedItem.title}
                    </h2>
                    <p className="text-lg text-primary">{selectedItem.subtitle}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                  {selectedItem.description}
                </p>

                {/* Carousel (if available) */}
                {selectedItem.carouselImages && selectedItem.carouselImages.length > 0 && (
                  <div className="relative mb-6">
                    <div className="relative h-96 bg-background rounded-xl overflow-hidden">
                      <img
                        src={selectedItem.carouselImages[carouselIndex].src}
                        alt={selectedItem.carouselImages[carouselIndex].title}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Carousel controls */}
                    {selectedItem.carouselImages.length > 1 && (
                      <>
                        <button
                          onClick={prevSlide}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={nextSlide}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>

                        {/* Dots indicator */}
                        <div className="flex justify-center gap-2 mt-4">
                          {selectedItem.carouselImages.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCarouselIndex(index)}
                              className={`w-2 h-2 rounded-full transition-all ${
                                index === carouselIndex
                                  ? "bg-primary w-8"
                                  : "bg-muted-foreground/30"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-4">
                  {selectedItem.link && (
                    <Button size="lg" className="gap-2">
                      Learn More
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  )}
                  <Button size="lg" variant="outline" className="gap-2">
                    Schedule Demo
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
