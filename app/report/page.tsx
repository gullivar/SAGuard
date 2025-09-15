"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { DateRange } from "react-day-picker"
import SecurityThreatSummary from "@/components/reports/security-threat-summary"

export default function ReportPage() {
  const [reportType, setReportType] = useState<string>("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 20),
    to: new Date(2024, 1, 9),
  })
  const [showReport, setShowReport] = useState(false)

  const handleGenerateReport = () => {
    console.log("[v0] Generating report:", { reportType, dateRange })
    setShowReport(true)
  }

  const renderReportComponent = () => {
    switch (reportType) {
      case "security-threat-summary":
        return <SecurityThreatSummary dateRange={dateRange} />
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">Generate and view comprehensive reports</p>
        </div>
      </div>

      {/* Report Settings Section */}
      <Card>
        <CardHeader>
          <CardTitle>Report Settings</CardTitle>
          <CardDescription>Configure your report parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Report Type Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="security-threat-summary">Security Threat Summary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Time Range Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Range</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !dateRange && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Generate Report Button */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Action</label>
              <Button onClick={handleGenerateReport} disabled={!reportType} className="w-full">
                Generate Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Results Section */}
      {showReport && reportType && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Report Results</h2>
          </div>
          {renderReportComponent()}
        </div>
      )}
    </div>
  )
}
