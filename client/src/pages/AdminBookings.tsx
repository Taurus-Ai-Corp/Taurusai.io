import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Clock, User, Building, Mail, Video, Edit, X, CheckCircle2, XCircle, AlertCircle, BarChart3, Target } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AdminBookings() {
  const { user, loading, isAuthenticated } = useAuth();
  const [selectedConsultation, setSelectedConsultation] = useState<number | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editNotes, setEditNotes] = useState("");

  const { data: consultations, isLoading, refetch } = trpc.consultations.getAll.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const updateMutation = trpc.consultations.update.useMutation({
    onSuccess: () => {
      toast.success("Consultation updated successfully");
      refetch();
      setSelectedConsultation(null);
    },
    onError: () => {
      toast.error("Failed to update consultation");
    },
  });

  const cancelMutation = trpc.consultations.cancel.useMutation({
    onSuccess: () => {
      toast.success("Consultation cancelled");
      refetch();
    },
    onError: () => {
      toast.error("Failed to cancel consultation");
    },
  });

  const handleUpdate = () => {
    if (!selectedConsultation) return;
    
    updateMutation.mutate({
      id: selectedConsultation,
      date: editDate || undefined,
      time: editTime || undefined,
      status: editStatus as any || undefined,
      notes: editNotes || undefined,
    });
  };

  const handleCancel = (id: number) => {
    if (confirm("Are you sure you want to cancel this consultation?")) {
      cancelMutation.mutate({ id, notes: "Cancelled by admin" });
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Card className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">You need admin privileges to access this page.</p>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled":
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-primary" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-destructive" />;
      case "rescheduled":
        return <AlertCircle className="w-5 h-5 text-warning" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-success/10 text-success border-success/20";
      case "completed":
        return "bg-primary/10 text-primary border-primary/20";
      case "cancelled":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "rescheduled":
        return "bg-warning/10 text-warning border-warning/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="container">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Consultation Bookings</h1>
              <p className="text-muted-foreground">Manage all consultation appointments</p>
            </div>
            <Button onClick={() => window.location.href = '/admin/analytics'} className="gap-2">
              <BarChart3 className="w-4 h-4" />
              View Analytics
            </Button>
          </div>

          <div className="grid gap-6">
            {consultations && consultations.length > 0 ? (
              consultations.map((consultation) => (
                <Card key={consultation.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className={`px-3 py-1 rounded-full border flex items-center gap-2 ${getStatusColor(consultation.status)}`}>
                          {getStatusIcon(consultation.status)}
                          <span className="text-sm font-medium capitalize">{consultation.status}</span>
                        </div>
                        {consultation.leadScore !== undefined && consultation.leadScore !== null && (
                          <div className={`px-3 py-1 rounded-full border flex items-center gap-2 ${
                            consultation.leadScore >= 80 ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                            consultation.leadScore >= 60 ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' :
                            consultation.leadScore >= 40 ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' :
                            'bg-gray-500/10 border-gray-500/20 text-gray-500'
                          }`}>
                            <Target className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              Score: {consultation.leadScore}/100 
                              {consultation.leadScore >= 80 ? ' (Critical)' :
                               consultation.leadScore >= 60 ? ' (High)' :
                               consultation.leadScore >= 40 ? ' (Medium)' : ' (Low)'}
                            </span>
                          </div>
                        )}
                        <span className="text-sm text-muted-foreground">
                          {new Date(consultation.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{consultation.firstName} {consultation.lastName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <span>{consultation.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Building className="w-4 h-4 text-muted-foreground" />
                            <span>{consultation.company}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span>{consultation.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span>{consultation.time}</span>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium capitalize">{consultation.consultationType}</span> consultation
                          </div>
                        </div>
                      </div>

                      {consultation.message && (
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground">{consultation.message}</p>
                        </div>
                      )}

                      {consultation.meetLink && (
                        <div className="flex items-center gap-2">
                          <Video className="w-4 h-4 text-primary" />
                          <a
                            href={consultation.meetLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                          >
                            Join Google Meet
                          </a>
                        </div>
                      )}

                      {consultation.notes && (
                        <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                          <p className="text-sm font-medium text-warning">Admin Notes:</p>
                          <p className="text-sm text-muted-foreground mt-1">{consultation.notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedConsultation(consultation.id);
                              setEditDate(consultation.date);
                              setEditTime(consultation.time);
                              setEditStatus(consultation.status);
                              setEditNotes(consultation.notes || "");
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Consultation</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Date</Label>
                              <Input
                                type="date"
                                value={editDate}
                                onChange={(e) => setEditDate(e.target.value)}
                              />
                            </div>
                            <div>
                              <Label>Time</Label>
                              <Input
                                type="time"
                                value={editTime}
                                onChange={(e) => setEditTime(e.target.value)}
                              />
                            </div>
                            <div>
                              <Label>Status</Label>
                              <Select value={editStatus} onValueChange={setEditStatus}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="scheduled">Scheduled</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                  <SelectItem value="rescheduled">Rescheduled</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Admin Notes</Label>
                              <Textarea
                                value={editNotes}
                                onChange={(e) => setEditNotes(e.target.value)}
                                placeholder="Add notes..."
                              />
                            </div>
                            <Button onClick={handleUpdate} className="w-full">
                              Save Changes
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {consultation.status !== "cancelled" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancel(consultation.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-12 text-center">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Consultations Yet</h3>
                <p className="text-muted-foreground">Consultation bookings will appear here.</p>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
