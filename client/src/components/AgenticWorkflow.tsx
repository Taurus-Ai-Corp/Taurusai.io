import { motion } from "framer-motion";
import { 
  Brain, 
  Cpu, 
  Database, 
  GitBranch, 
  Layers, 
  Network, 
  Workflow,
  Zap,
  ArrowRight,
  Bot,
  Sparkles,
} from "lucide-react";

const workflowSteps = [
  {
    id: 1,
    title: "Data Ingestion",
    description: "Multi-source data collection and normalization",
    icon: Database,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    title: "AI Processing",
    description: "Intelligent analysis and pattern recognition",
    icon: Brain,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 3,
    title: "Decision Engine",
    description: "Autonomous decision-making with human oversight",
    icon: GitBranch,
    color: "from-quantum to-cyan",
  },
  {
    id: 4,
    title: "Action Execution",
    description: "Automated task completion and workflow triggers",
    icon: Zap,
    color: "from-warning to-orange-500",
  },
  {
    id: 5,
    title: "Continuous Learning",
    description: "Self-improving models with feedback loops",
    icon: Sparkles,
    color: "from-success to-emerald-500",
  },
];

const agentTypes = [
  { name: "Data Agents", icon: Database, description: "Extract, transform, validate" },
  { name: "Analysis Agents", icon: Brain, description: "Insights, predictions, patterns" },
  { name: "Orchestration Agents", icon: Network, description: "Coordinate, schedule, optimize" },
  { name: "Execution Agents", icon: Bot, description: "Automate, integrate, deploy" },
];

export default function AgenticWorkflow() {
  return (
    <section className="py-24 bg-gradient-to-b from-background via-card/30 to-background relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      <div className="container relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Agentic <span className="gradient-text">AI Workflow</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the next generation of autonomous AI systems that think, decide, and act on your behalf.
            </p>
          </motion.div>
        </div>

        {/* Workflow Pipeline */}
        <div className="mb-20">
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-0">
            {workflowSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center"
              >
                <div className="relative group">
                  {/* Step Card */}
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className={`
                      w-40 h-40 md:w-44 md:h-44 rounded-2xl 
                      bg-gradient-to-br ${step.color}
                      p-[2px] cursor-pointer
                    `}
                  >
                    <div className="w-full h-full rounded-2xl bg-card flex flex-col items-center justify-center p-4 text-center">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="mb-3"
                      >
                        <step.icon className="w-8 h-8 text-primary" />
                      </motion.div>
                      <h3 className="font-semibold text-foreground text-sm mb-1">{step.title}</h3>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    </div>
                  </motion.div>

                  {/* Step Number */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    {step.id}
                  </div>

                  {/* Pulse Effect */}
                  <motion.div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-20`}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>

                {/* Arrow */}
                {index < workflowSteps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                    className="hidden md:flex items-center mx-2"
                  >
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-6 h-6 text-primary/50" />
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Agent Types Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          {agentTypes.map((agent, index) => (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-card border border-border rounded-xl p-6 text-center group hover:border-primary/50 transition-all"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <agent.icon className="w-7 h-7 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">{agent.name}</h4>
              <p className="text-sm text-muted-foreground">{agent.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Central Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 flex justify-center"
        >
          <div className="relative w-64 h-64">
            {/* Orbiting Elements */}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <motion.div
                key={angle}
                className="absolute top-1/2 left-1/2 w-10 h-10"
                animate={{ rotate: 360 }}
                transition={{ duration: 15 + i * 2, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "0 0" }}
              >
                <motion.div
                  className="absolute w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-quantum/20 border border-primary/30 flex items-center justify-center"
                  style={{
                    transform: `rotate(${angle}deg) translateX(100px) rotate(-${angle}deg)`,
                  }}
                  whileHover={{ scale: 1.2 }}
                >
                  {i % 3 === 0 && <Cpu className="w-5 h-5 text-primary" />}
                  {i % 3 === 1 && <Layers className="w-5 h-5 text-quantum" />}
                  {i % 3 === 2 && <Workflow className="w-5 h-5 text-cyan" />}
                </motion.div>
              </motion.div>
            ))}

            {/* Center Core */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-primary via-quantum to-cyan p-[2px]"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                <Brain className="w-8 h-8 text-primary" />
              </div>
            </motion.div>

            {/* Orbit Rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 rounded-full border border-primary/20" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border border-quantum/20" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
