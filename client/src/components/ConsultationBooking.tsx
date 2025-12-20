import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, User, Mail, Building, MessageSquare, CheckCircle2, ArrowRight, Video, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
];

const consultationTypes = [
  { value: "discovery", label: "Discovery Call", duration: "30 min" },
  { value: "demo", label: "Product Demo", duration: "45 min" },
  { value: "technical", label: "Technical Consultation", duration: "60 min" },
  { value: "enterprise", label: "Enterprise Assessment", duration: "90 min" },
];

export default function ConsultationBooking() {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [consultationType, setConsultationType] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    companySize: "",
    industry: "",
    message: "",
  });

  const [calendarCreated, setCalendarCreated] = useState(false);
  const [meetLink, setMeetLink] = useState<string | null>(null);

  const bookConsultation = trpc.leads.bookConsultation.useMutation({
    onSuccess: (data) => {
      setIsSubmitted(true);
      setCalendarCreated(data.calendarEventCreated);
      if (data.meetLink) {
        setMeetLink(data.meetLink);
      }
      if (data.calendarEventCreated) {
        toast.success("Consultation booked! Calendar invite with Google Meet link sent.");
      } else {
        toast.success("Consultation booked! Our team will send you a calendar invite.");
      }
    },
    onError: () => {
      toast.error("Failed to book consultation. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const nameParts = formData.name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    bookConsultation.mutate({
      firstName,
      lastName,
      email: formData.email,
      company: formData.company,
      companySize: formData.companySize || undefined,
      industry: formData.industry || undefined,
      consultationType: consultationType as "discovery" | "demo" | "technical" | "enterprise",
      date: selectedDate,
      time: selectedTime,
      message: formData.message || undefined,
    });
  };

  // Generate next 14 days for date selection
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      // Skip weekends
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push({
          value: date.toISOString().split('T')[0],
          label: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        });
      }
    }
    return dates;
  };

  if (isSubmitted) {
    return (
      <section className="py-24 bg-gradient-to-b from-card/50 to-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/20 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-success" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">Consultation Booked!</h2>
            <p className="text-muted-foreground mb-6">
              {calendarCreated 
                ? "Your consultation is confirmed! A calendar invite has been sent to your email with meeting details."
                : "Thank you for scheduling a consultation. Our team will send you a calendar invite and meeting details shortly."
              }
            </p>
            {calendarCreated && (
              <div className="flex items-center justify-center gap-2 text-success mb-4">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-medium">Calendar invite sent</span>
              </div>
            )}
            <div className="p-4 rounded-xl bg-card border border-border mb-6">
              <div className="flex items-center justify-center gap-4 text-sm mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>{selectedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>{selectedTime}</span>
                </div>
              </div>
              {meetLink && (
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Video className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Google Meet Link</span>
                  </div>
                  <a
                    href={meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded-lg text-primary text-sm font-medium transition-colors"
                  >
                    <span className="truncate max-w-[200px]">{meetLink}</span>
                    <ExternalLink className="w-4 h-4 flex-shrink-0" />
                  </a>
                </div>
              )}
            </div>
            <div className="flex gap-3 justify-center">
              {meetLink && (
                <Button asChild>
                  <a href={meetLink} target="_blank" rel="noopener noreferrer">
                    <Video className="w-4 h-4 mr-2" />
                    Join Meeting
                  </a>
                </Button>
              )}
              <Button onClick={() => setIsSubmitted(false)} variant="outline">
                Book Another Consultation
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-b from-card/50 to-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="container relative z-10">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Schedule a <span className="gradient-text">Consultation</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Book a personalized session with our experts to explore how Taurus AI can transform your enterprise operations.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Side - Consultation Types */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">Choose Your Session</h3>
              <div className="space-y-3">
                {consultationTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setConsultationType(type.value)}
                    className={`w-full p-4 rounded-xl border text-left transition-all ${
                      consultationType === type.value
                        ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                        : 'border-border bg-card hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-foreground">{type.label}</h4>
                        <p className="text-sm text-muted-foreground">{type.duration}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        consultationType === type.value ? 'border-primary bg-primary' : 'border-muted-foreground'
                      }`}>
                        {consultationType === type.value && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Date Selection */}
              <div className="space-y-3">
                <Label className="text-foreground">Select Date</Label>
                <Select value={selectedDate} onValueChange={setSelectedDate}>
                  <SelectTrigger className="bg-card">
                    <SelectValue placeholder="Choose a date" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableDates().map((date) => (
                      <SelectItem key={date.value} value={date.value}>
                        {date.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Time Selection */}
              <div className="space-y-3">
                <Label className="text-foreground">Select Time (IST)</Label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-2 rounded-lg text-sm font-medium transition-all ${
                        selectedTime === time
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-card border border-border hover:border-primary/50'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-foreground mb-6">Your Information</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="John Doe"
                      className="pl-10 bg-background"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@company.com"
                      className="pl-10 bg-background"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company" className="text-foreground">Company</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="company"
                      placeholder="Acme Corporation"
                      className="pl-10 bg-background"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companySize" className="text-foreground">Company Size (Optional)</Label>
                  <Select value={formData.companySize} onValueChange={(value) => setFormData({ ...formData, companySize: value })}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="201-500">201-500 employees</SelectItem>
                      <SelectItem value="501-1000">501-1000 employees</SelectItem>
                      <SelectItem value="1000+">1000+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry" className="text-foreground">Industry (Optional)</Label>
                  <Select value={formData.industry} onValueChange={(value) => setFormData({ ...formData, industry: value })}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Financial Services">Financial Services</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Government">Government</SelectItem>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Retail">Retail</SelectItem>
                      <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-foreground">What would you like to discuss?</Label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Textarea
                      id="message"
                      placeholder="Tell us about your needs..."
                      className="pl-10 bg-background min-h-[100px]"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={!consultationType || !selectedDate || !selectedTime || bookConsultation.isPending}
                >
                  {bookConsultation.isPending ? (
                    "Booking..."
                  ) : (
                    <>
                      Book Consultation
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
