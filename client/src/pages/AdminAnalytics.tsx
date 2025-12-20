import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { TrendingUp, Users, CheckCircle2, XCircle, Calendar, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const COLORS = {
  primary: "#00d4ff",
  success: "#00ff88",
  warning: "#ffaa00",
  destructive: "#ff4466",
};

export default function AdminAnalytics() {
  const { user, loading, isAuthenticated } = useAuth();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data: analytics, isLoading, refetch } = trpc.consultations.analytics.useQuery(
    { startDate: startDate || undefined, endDate: endDate || undefined },
    { enabled: isAuthenticated && user?.role === 'admin' }
  );

  const handleFilter = () => {
    refetch();
  };

  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    refetch();
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

  if (!analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">No analytics data available</p>
      </div>
    );
  }

  // Prepare data for charts
  const statusData = [
    { name: "Scheduled", value: analytics.statusCounts.scheduled, color: COLORS.primary },
    { name: "Completed", value: analytics.statusCounts.completed, color: COLORS.success },
    { name: "Cancelled", value: analytics.statusCounts.cancelled, color: COLORS.destructive },
    { name: "Rescheduled", value: analytics.statusCounts.rescheduled, color: COLORS.warning },
  ];

  const typeData = [
    { name: "Discovery", value: analytics.typeCounts.discovery },
    { name: "Demo", value: analytics.typeCounts.demo },
    { name: "Technical", value: analytics.typeCounts.technical },
    { name: "Enterprise", value: analytics.typeCounts.enterprise },
  ];

  const monthlyTrends = Object.entries(analytics.consultationsByMonth).map(([month, count]) => ({
    month,
    consultations: count,
  })).sort((a, b) => a.month.localeCompare(b.month));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Consultation Analytics</h1>
            <p className="text-muted-foreground">Track booking metrics and consultation performance</p>
          </div>

          {/* Date Range Filter */}
          <Card className="p-6 mb-8">
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-[200px]">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <Button onClick={handleFilter}>Apply Filter</Button>
              <Button variant="outline" onClick={handleClearFilter}>Clear</Button>
            </div>
          </Card>

          {/* Key Metrics Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Consultations</span>
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-bold text-foreground">{analytics.totalConsultations}</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Conversion Rate</span>
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <p className="text-3xl font-bold text-foreground">{analytics.conversionRate}%</p>
              <p className="text-xs text-muted-foreground mt-1">{analytics.totalLeads} total leads</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Completion Rate</span>
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
              <p className="text-3xl font-bold text-foreground">{analytics.completionRate}%</p>
              <p className="text-xs text-muted-foreground mt-1">{analytics.statusCounts.completed} completed</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">No-Show Rate</span>
                <XCircle className="w-5 h-5 text-destructive" />
              </div>
              <p className="text-3xl font-bold text-foreground">{analytics.noShowRate}%</p>
              <p className="text-xs text-muted-foreground mt-1">{analytics.statusCounts.cancelled} cancelled</p>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Status Distribution */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-6">Consultation Status</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            {/* Consultation Types */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-6">Consultation Types</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={typeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="value" fill={COLORS.primary} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Monthly Trends */}
          {monthlyTrends.length > 0 && (
            <Card className="p-6 mb-8">
              <h3 className="text-xl font-semibold mb-6">Monthly Consultation Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="month" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="consultations" 
                    stroke={COLORS.primary} 
                    strokeWidth={2}
                    dot={{ fill: COLORS.primary, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          )}

          {/* Insights */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Key Insights</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-success mt-0.5" />
                <div>
                  <p className="font-medium">Conversion Performance</p>
                  <p className="text-sm text-muted-foreground">
                    {analytics.conversionRate >= 50 
                      ? "Excellent conversion rate! Your lead qualification process is working well."
                      : analytics.conversionRate >= 30
                      ? "Good conversion rate. Consider optimizing your lead nurturing process."
                      : "Conversion rate could be improved. Review your lead qualification criteria."}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-success mt-0.5" />
                <div>
                  <p className="font-medium">Completion Rate</p>
                  <p className="text-sm text-muted-foreground">
                    {analytics.completionRate >= 80
                      ? "Excellent! Most consultations are being completed successfully."
                      : analytics.completionRate >= 60
                      ? "Good completion rate. Monitor for any patterns in incomplete consultations."
                      : "Consider sending reminder emails before consultations to reduce no-shows."}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Popular Consultation Type</p>
                  <p className="text-sm text-muted-foreground">
                    {Object.entries(analytics.typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] 
                      ? `${Object.entries(analytics.typeCounts).sort((a, b) => b[1] - a[1])[0][0]} consultations are most popular.`
                      : "Not enough data to determine popular consultation type."}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
