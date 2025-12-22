import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CarouselImage {
  src: string;
  title: string;
}

interface EcosystemNode {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  position: { x: string; y: string }; // Percentage positions on image
  carouselImages?: CarouselImage[];
}

const ecosystemNodes: EcosystemNode[] = [
  {
    id: "multilingual",
    title: "Multilingual Local Integrations",
    subtitle: "Global Deployment",
    description: "Seamless integration with local systems and multilingual support for global enterprise deployment across diverse markets and regulatory environments.",
    position: { x: "50%", y: "15%" },
  },
  {
    id: "backoffice",
    title: "Back Office Task Automation",
    subtitle: "Intelligent Automation",
    description: "Intelligent automation of back-office operations including document processing, data entry, reconciliation, and compliance workflows. Unlock efficiency and slash costs with intelligent automation.",
    position: { x: "70%", y: "30%" },
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
    title: "AI Powered SaaS Modules",
    subtitle: "Enterprise Solutions",
    description: "Comprehensive suite of AI-powered SaaS modules designed for enterprise-grade deployment, scalability, and security.",
    position: { x: "85%", y: "50%" },
  },
  {
    id: "public-sector",
    title: "Revolutionising Public-Sector Organisation Through AI",
    subtitle: "Government Innovation",
    description: "Transform public sector operations with AI-driven automation, citizen services optimization, and data-driven policy making.",
    position: { x: "70%", y: "70%" },
  },
  {
    id: "agriculture",
    title: "Precision Agriculture Optimisation",
    subtitle: "Smart Farming",
    description: "AI-driven crop optimization, precision farming, and sustainable agriculture solutions leveraging IoT sensors and predictive analytics.",
    position: { x: "50%", y: "85%" },
  },
  {
    id: "retail",
    title: "AI-Powered Digital & Retail Business Automation",
    subtitle: "Commerce Innovation",
    description: "End-to-end retail automation including inventory management, customer analytics, personalization, and omnichannel orchestration.",
    position: { x: "30%", y: "70%" },
  },
  {
    id: "education",
    title: "An Integrated Educational Management System",
    subtitle: "Smart Education",
    description: "Comprehensive educational management system integrating student information, learning analytics, and administrative workflows for modern institutions.",
    position: { x: "15%", y: "50%" },
    carouselImages: [
      { src: "/carousel/1_Introducing-the-Integrated-Educational-Management-System.png", title: "IEMS Introduction" },
      { src: "/carousel/2_Transforming-Education-with-Smart-Technology.png", title: "Smart Technology" },
      { src: "/carousel/3_Streamline-Operations-Empower-Educators.png", title: "Empower Educators" },
      { src: "/carousel/4_Real-Impact-How-IEMS-Revolutionizes-Schools.png", title: "Real Impact" },
      { src: "/carousel/5_Safety-and-Engagement-Powered-by-Technology.png", title: "Safety & Engagement" },
      { src: "/carousel/6_Ready-to-Reimagine-Your-Schools-Future.png", title: "Reimagine Future" },
    ],
  },
  {
    id: "healthcare",
    title: "Advanced AI Integration in Healthcare Triage Systems & EHR",
    subtitle: "Health Innovation",
    description: "Advanced AI integration for healthcare triage systems and electronic health records, improving patient outcomes and operational efficiency.",
    position: { x: "30%", y: "30%" },
  },
];

export default function EcosystemOrbit() {
  const [selectedNode, setSelectedNode] = useState<EcosystemNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const handleNodeClick = (node: EcosystemNode) => {
    setSelectedNode(node);
    setCarouselIndex(0);
  };

  const handleClose = () => {
    setSelectedNode(null);
    setCarouselIndex(0);
  };

  const nextSlide = () => {
    if (selectedNode?.carouselImages) {
      setCarouselIndex((prev) => (prev + 1) % (selectedNode.carouselImages?.length || 1));
    }
  };

  const prevSlide = () => {
    if (selectedNode?.carouselImages) {
      setCarouselIndex((prev) => 
        prev === 0 ? (selectedNode.carouselImages?.length || 1) - 1 : prev - 1
      );
    }
  };

  return (
    <div className="w-full py-24 relative overflow-hidden">
      {/* Section Header */}
      <div className="container text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text-multi">Evolution of AI Integration</span>{" "}
            <span className="text-gradient-cyan-purple">& Orchestration</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our comprehensive ecosystem of AI-powered solutions designed to transform every aspect of enterprise operations.
          </p>
        </motion.div>
      </div>

      {/* Interactive Ecosystem Image */}
      <div className="container">
        <motion.div
          className="relative w-full aspect-square max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Animated Background Image */}
          <motion.div
            className="absolute inset-0"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <img
              src="/ecosystem-visual.png"
              alt="Taurus AI Ecosystem"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Overlay gradient for better hotspot visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/20" />

          {/* Interactive Hotspots */}
          {ecosystemNodes.map((node, index) => (
            <motion.button
              key={node.id}
              className="absolute w-16 h-16 -translate-x-1/2 -translate-y-1/2 group"
              style={{
                left: node.position.x,
                top: node.position.y,
              }}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleNodeClick(node)}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {/* Pulsing ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.8, 0, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />

              {/* Hotspot dot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-primary shadow-lg shadow-primary/50 group-hover:w-6 group-hover:h-6 transition-all duration-300" />
              </div>

              {/* Hover tooltip */}
              <AnimatePresence>
                {hoveredNode === node.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-4 whitespace-nowrap pointer-events-none z-10"
                  >
                    <div className="bg-card/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-xl border border-border">
                      <p className="text-sm font-bold text-foreground">{node.title}</p>
                      <p className="text-xs text-primary">{node.subtitle}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          ))}

          {/* Floating particles effect */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Modal/Popup for Selected Node */}
      <AnimatePresence>
        {selectedNode && (
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
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-foreground mb-2">
                    {selectedNode.title}
                  </h2>
                  <p className="text-lg text-primary">{selectedNode.subtitle}</p>
                </div>

                {/* Description */}
                <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                  {selectedNode.description}
                </p>

                {/* Carousel (if available) */}
                {selectedNode.carouselImages && selectedNode.carouselImages.length > 0 && (
                  <div className="relative mb-6">
                    <div className="relative h-96 bg-background rounded-xl overflow-hidden">
                      <img
                        src={selectedNode.carouselImages[carouselIndex].src}
                        alt={selectedNode.carouselImages[carouselIndex].title}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Carousel controls */}
                    {selectedNode.carouselImages.length > 1 && (
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
                          {selectedNode.carouselImages.map((_, index) => (
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
                  <Button size="lg" className="gap-2">
                    Learn More
                    <ExternalLink className="w-4 h-4" />
                  </Button>
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
