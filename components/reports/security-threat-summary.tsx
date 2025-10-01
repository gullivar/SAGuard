"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { FileText, TrendingUp, AlertTriangle, Shield, Activity } from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import type { DateRange } from "react-day-picker"

interface SecurityThreatSummaryProps {
  dateRange?: DateRange
}

export default function SecurityThreatSummary({ dateRange }: SecurityThreatSummaryProps) {
  // Mock data for key metrics
  const keyMetrics = [
    {
      title: "Total Events",
      value: "1,247",
      change: "+12%",
      icon: Activity,
      color: "text-blue-600",
    },
    {
      title: "Critical/High Events",
      value: "89",
      change: "-5%",
      icon: AlertTriangle,
      color: "text-red-600",
    },
    {
      title: "Resolved Events",
      value: "1,158",
      change: "+18%",
      icon: Shield,
      color: "text-green-600",
    },
    {
      title: "Response Time (Avg)",
      value: "2.4h",
      change: "-15%",
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ]

  // Mock data for severity pie chart
  const severityData = [
    { name: "Critical", value: 23, color: "#dc2626" },
    { name: "High", value: 66, color: "#ea580c" },
    { name: "Medium", value: 312, color: "#ca8a04" },
    { name: "Low", value: 846, color: "#16a34a" },
  ]

  // Mock data for events over time bar chart
  const timeSeriesData = [
    { date: "Jan 20", critical: 4, high: 12, medium: 45, low: 123 },
    { date: "Jan 25", critical: 2, high: 8, medium: 38, low: 145 },
    { date: "Jan 30", critical: 6, high: 15, medium: 52, low: 134 },
    { date: "Feb 04", critical: 3, high: 11, medium: 41, low: 156 },
    { date: "Feb 09", critical: 8, high: 20, medium: 67, low: 178 },
  ]

  // Mock data for notable events table
  const notableEvents = [
    {
      id: "EVT-2024-001",
      timestamp: "2024-02-09 14:23:15",
      ship: "MV Ocean Pioneer",
      event: "Unauthorized Access Attempt",
      source: "FortiGate Firewall",
      status: "Investigating",
    },
    {
      id: "EVT-2024-002",
      timestamp: "2024-02-09 11:45:32",
      ship: "MV Sea Explorer",
      event: "Malware Detection",
      source: "CBS Security System",
      status: "Contained",
    },
    {
      id: "EVT-2024-003",
      timestamp: "2024-02-08 22:17:08",
      ship: "MV Atlantic Voyager",
      event: "Suspicious Network Traffic",
      source: "Network Switch",
      status: "Resolved",
    },
    {
      id: "EVT-2024-004",
      timestamp: "2024-02-08 16:55:41",
      ship: "MV Pacific Guardian",
      event: "Failed Authentication (Multiple)",
      source: "CBS Authentication",
      status: "Monitoring",
    },
  ]

  const handleExportPDF = () => {
    console.log("[v0] Exporting Security Threat Summary to PDF")
    // TODO: Implement PDF export functionality
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "resolved":
        return "default"
      case "investigating":
        return "destructive"
      case "contained":
        return "secondary"
      case "monitoring":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Export Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Security Threat Summary</h3>
          <p className="text-sm text-muted-foreground">
            {dateRange?.from && dateRange?.to
              ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
              : "All time data"}
          </p>
        </div>
        <Button onClick={handleExportPDF} variant="outline" className="gap-2 bg-transparent">
          <FileText className="h-4 w-4" />
          Export to PDF
        </Button>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {keyMetrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <Icon className={`h-4 w-4 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={metric.change.startsWith("+") ? "text-green-600" : "text-red-600"}>
                    {metric.change}
                  </span>{" "}
                  from last period
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Events by Severity Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Events by Severity</CardTitle>
            <CardDescription>Distribution of security events by severity level</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Events over Time Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Events over Time</CardTitle>
            <CardDescription>Security events trend by severity over selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="critical" stackId="a" fill="#dc2626" name="Critical" />
                <Bar dataKey="high" stackId="a" fill="#ea580c" name="High" />
                <Bar dataKey="medium" stackId="a" fill="#ca8a04" name="Medium" />
                <Bar dataKey="low" stackId="a" fill="#16a34a" name="Low" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Notable Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>Notable Events (Critical Severity)</CardTitle>
          <CardDescription>Recent critical security events requiring attention</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event ID</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Ship</TableHead>
                <TableHead>Event Type</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notableEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.id}</TableCell>
                  <TableCell>{event.timestamp}</TableCell>
                  <TableCell>{event.ship}</TableCell>
                  <TableCell>{event.event}</TableCell>
                  <TableCell>{event.source}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(event.status)}>{event.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
