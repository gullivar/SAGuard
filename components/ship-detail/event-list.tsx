"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
<<<<<<< HEAD
import { ArrowUpDown, X, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import ActionResponseGuidePopup from "@/components/action-response-guide-popup"
import { recommendationsData } from "@/lib/data"
import { MultiSelect } from "@/components/ui/multi-select"

interface EventListProps {
  events: any[]
  filters: { severity: string; actionStatus: string; search: string }
  setFilters: React.Dispatch<React.SetStateAction<{ severity: string; actionStatus: string; search: string }>>
  statusFilter?: "critical" | "warning" | "notice" | null
}

type SortKey = "timestamp" | "cbsName" | "severity"
type ActionStatus = "Not started" | "In progress" | "Completed"

export default function EventList({ events, filters, setFilters, statusFilter }: EventListProps) {
  const [editingRowIndex, setEditingRowIndex] = React.useState<number | null>(null)
  const [actionGuideOpen, setActionGuideOpen] = React.useState(false)
  const [selectedGuideContent, setSelectedGuideContent] = React.useState<string[]>([])
  const [dateFilters, setDateFilters] = React.useState({
    dateFrom: undefined as Date | undefined,
    dateTo: undefined as Date | undefined,
  })

=======
import { ArrowUpDown, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { recommendationsData } from "@/lib/data"

interface EventListProps {
  events: any[]
  filters: { severity: string; type: string; search: string }
  setFilters: React.Dispatch<React.SetStateAction<{ severity: string; type: string; search: string }>>
  statusFilter?: "critical" | "warning" | "ok" | null
}

type SortKey = "timestamp" | "type" | "cbsName" | "severity"

export default function EventList({ events, filters, setFilters, statusFilter }: EventListProps) {
>>>>>>> 635fb68316ea188d00a1ccbf846d7710502b0e5a
  const [sort, setSort] = React.useState<{ key: SortKey; direction: "asc" | "desc" }>({
    key: "timestamp",
    direction: "desc",
  })

<<<<<<< HEAD
  const [selectedEventData, setSelectedEventData] = React.useState<{
    ruleName: string
    ruleDescription: string
    ruleQuery: string
    investigationGuide: string
  } | null>(null)

  const [eventStatuses, setEventStatuses] = React.useState<Record<string, ActionStatus>>({})
  const [loadingEvents, setLoadingEvents] = React.useState<Set<string>>(new Set())

  React.useEffect(() => {
    const initialStatuses: Record<string, ActionStatus> = {}
    events.forEach((event, index) => {
      const eventKey = `${event.timestamp}-${index}`
      initialStatuses[eventKey] = event.actionStatus || "Not started"
    })
    setEventStatuses(initialStatuses)
  }, [events])

=======
>>>>>>> 635fb68316ea188d00a1ccbf846d7710502b0e5a
  const handleSort = (key: SortKey) => {
    setSort((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }))
  }

  const getRecommendations = (severity: string) => {
    const severityKey = severity?.toLowerCase() as keyof typeof recommendationsData
    const recommendations = recommendationsData[severityKey]
    if (!recommendations || recommendations.length === 0) {
      return "No action"
    }

    const actionMap: Record<string, string> = {
      critical: "Isolate Now",
      warning: "Monitor",
      notice: "Review",
    }

    return actionMap[severityKey] || "Review"
  }

  const getFullRecommendations = (severity: string) => {
    const severityKey = severity?.toLowerCase() as keyof typeof recommendationsData
    const recommendations = recommendationsData[severityKey]
    if (!recommendations || recommendations.length === 0) {
      return "No specific recommendations available"
    }
    return recommendations.join("\n• ")
  }

<<<<<<< HEAD
  const [multiFilters, setMultiFilters] = React.useState({
    severity: [] as string[],
    actionStatus: [] as string[],
    search: "",
  })

=======
>>>>>>> 635fb68316ea188d00a1ccbf846d7710502b0e5a
  const filteredAndSortedEvents = React.useMemo(() => {
    let filtered = [...events]

    if (statusFilter) {
      filtered = filtered.filter((event) => {
        const severity = event.severity?.toLowerCase()
        if (statusFilter === "critical") {
          return severity === "critical"
        } else if (statusFilter === "warning") {
          return severity === "warning"
<<<<<<< HEAD
        } else if (statusFilter === "notice") {
          return severity === "notice"
=======
        } else if (statusFilter === "ok") {
          return severity === "notice" // OK status shows only notice events
>>>>>>> 635fb68316ea188d00a1ccbf846d7710502b0e5a
        }
        return true
      })
    }

<<<<<<< HEAD
    if (multiFilters.severity.length > 0) {
      filtered = filtered.filter((event) => multiFilters.severity.includes(event.severity))
    }
    if (multiFilters.actionStatus.length > 0) {
      filtered = filtered.filter((event, index) => {
        const eventKey = `${event.timestamp}-${index}`
        return multiFilters.actionStatus.includes(eventStatuses[eventKey] || "Not started")
      })
    }
    if (multiFilters.search) {
      const searchLower = multiFilters.search.toLowerCase()
=======
    if (filters.severity) {
      filtered = filtered.filter((event) => event.severity === filters.severity)
    }
    if (filters.type) {
      filtered = filtered.filter((event) => event.type === filters.type)
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
>>>>>>> 635fb68316ea188d00a1ccbf846d7710502b0e5a
      filtered = filtered.filter(
        (event) =>
          event.eventName.toLowerCase().includes(searchLower) ||
          event.details.toLowerCase().includes(searchLower) ||
          event.cbsName.toLowerCase().includes(searchLower),
      )
    }

<<<<<<< HEAD
    if (dateFilters.dateFrom) {
      filtered = filtered.filter((event) => new Date(event.timestamp) >= dateFilters.dateFrom!)
    }
    if (dateFilters.dateTo) {
      filtered = filtered.filter((event) => new Date(event.timestamp) <= dateFilters.dateTo!)
    }

=======
>>>>>>> 635fb68316ea188d00a1ccbf846d7710502b0e5a
    filtered.sort((a, b) => {
      const valA = a[sort.key]
      const valB = b[sort.key]
      if (valA === null || valA === undefined) return 1
      if (valB === null || valB === undefined) return -1

      let comparison = 0
      if (sort.key === "timestamp") {
        comparison = new Date(valA).getTime() - new Date(valB).getTime()
      } else if (typeof valA === "string" && typeof valB === "string") {
        comparison = valA.localeCompare(valB)
      }

      return sort.direction === "asc" ? comparison : -comparison
    })

    return filtered
<<<<<<< HEAD
  }, [events, multiFilters, sort, statusFilter, dateFilters, eventStatuses])

  const resetFilters = () => {
    setMultiFilters({ severity: [], actionStatus: [], search: "" })
    setDateFilters({ dateFrom: undefined, dateTo: undefined })
=======
  }, [events, filters, sort, statusFilter])

  const resetFilters = () => {
    setFilters({ severity: "", type: "", search: "" })
>>>>>>> 635fb68316ea188d00a1ccbf846d7710502b0e5a
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>
      case "warning":
        return (
          <Badge variant="secondary" className="bg-yellow-500 text-black hover:bg-yellow-500/80">
            Warning
          </Badge>
        )
      case "notice":
        return (
          <Badge variant="default" className="bg-blue-500 hover:bg-blue-500/80">
            Notice
          </Badge>
        )
      default:
        return <Badge variant="outline">{severity}</Badge>
    }
  }

  const getDetailedActions = (severity: string) => {
<<<<<<< HEAD
    const severityKey = severity?.toLowerCase()

    switch (severityKey) {
      case "critical":
        return {
          title: "Critical Security Response",
          actions: [
            "Immediately isolate the affected system from the network",
            "Contact the security team and incident response coordinator",
            "Document all current system states and network connections",
            "Begin forensic data collection before any remediation",
            "Notify relevant stakeholders and management",
            "Activate emergency response procedures",
            "Monitor for lateral movement or additional compromised systems",
          ],
        }

      case "warning":
        return {
          title: "Security Monitoring Required",
          actions: [
            "Increase monitoring frequency for the affected system",
            "Review recent access logs and user activities",
            "Check for unusual network traffic patterns",
            "Verify system configurations against security baselines",
            "Schedule security assessment within 24 hours",
            "Update threat intelligence feeds",
            "Prepare incident response team for potential escalation",
          ],
        }

      case "notice":
        return {
          title: "Routine Security Review",
          actions: [
            "Review system logs for any anomalies",
            "Verify compliance with security policies",
            "Update security documentation if needed",
            "Schedule routine security assessment",
            "Check for available security updates",
            "Review user access permissions",
            "Document findings in security log",
          ],
        }

      default:
        return {
          title: "General Review",
          actions: ["Review the event and take appropriate action based on your security policies."],
        }
    }
  }

  const handleActionStatusClick = (rowIndex: number, event: any) => {
    setEditingRowIndex(rowIndex)
  }

  const handleActionStatusChange = async (newStatus: ActionStatus, eventKey: string) => {
    setLoadingEvents((prev) => new Set(prev).add(eventKey))
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setEventStatuses((prev) => ({ ...prev, [eventKey]: newStatus }))
    setEditingRowIndex(null)
    setLoadingEvents((prev) => {
      const newSet = new Set(prev)
      newSet.delete(eventKey)
      return newSet
    })
  }

  const getActionStatusBadge = (status: ActionStatus) => {
    switch (status) {
      case "Not started":
        return (
          <Badge variant="outline" className="cursor-pointer hover:bg-muted">
            Not started
          </Badge>
        )
      case "In progress":
        return (
          <Badge variant="default" className="bg-blue-500 cursor-pointer hover:bg-blue-600">
            In progress
          </Badge>
        )
      case "Completed":
        return (
          <Badge variant="default" className="bg-green-500 cursor-pointer hover:bg-green-600">
            Completed
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="cursor-pointer">
            {status}
          </Badge>
        )
    }
  }

  const handleViewDetails = (event: any) => {
    const eventData = {
      ruleName: `[${event.severity}] ${event.eventName}`,
      ruleDescription: event.details,
      ruleQuery: `SELECT * FROM security_events WHERE event_id = '${event.id || "unknown"}' AND severity = '${event.severity}' AND timestamp = '${event.timestamp}'`,
      investigationGuide: getInvestigationGuideMarkdown(event.severity),
    }

    setSelectedEventData(eventData)
    setActionGuideOpen(true)
  }

  const getInvestigationGuideMarkdown = (severity: string) => {
    const severityKey = severity?.toLowerCase()

    switch (severityKey) {
      case "critical":
        return `## Critical Security Response

### Immediate Actions Required

1. **Immediate Isolation**: Isolate the affected system from the network immediately
2. **Contact Security Team**: Notify the security team and incident response coordinator
3. **Document System State**: Record all current system states and network connections
4. **Forensic Collection**: Begin forensic data collection before any remediation
5. **Stakeholder Notification**: Notify relevant stakeholders and management
6. **Emergency Procedures**: Activate emergency response procedures
7. **Monitor for Spread**: Watch for lateral movement or additional compromised systems

### Critical Considerations
- **Time is critical** - Act within minutes, not hours
- **Preserve evidence** before remediation
- **Coordinate response** with all relevant teams`

      case "warning":
        return `## Security Monitoring Required

### Monitoring Actions

1. **Increase Monitoring**: Enhance monitoring frequency for the affected system
2. **Review Access Logs**: Check recent access logs and user activities
3. **Network Traffic Analysis**: Look for unusual network traffic patterns
4. **Configuration Verification**: Verify system configurations against security baselines
5. **Schedule Assessment**: Plan security assessment within 24 hours
6. **Update Intelligence**: Refresh threat intelligence feeds
7. **Prepare Response Team**: Ready incident response team for potential escalation

### Monitoring Focus
- **Behavioral changes** in system or user activity
- **Network anomalies** that could indicate compromise
- **Configuration drift** from security standards`

      case "notice":
        return `## Routine Security Review

### Review Actions

1. **Log Analysis**: Review system logs for any anomalies
2. **Policy Compliance**: Verify compliance with security policies
3. **Documentation Update**: Update security documentation if needed
4. **Schedule Assessment**: Plan routine security assessment
5. **Security Updates**: Check for available security updates
6. **Access Review**: Review user access permissions
7. **Security Logging**: Document findings in security log

### Review Focus
- **Compliance verification** with established policies
- **Routine maintenance** of security controls
- **Documentation accuracy** and completeness`

      default:
        return `## General Security Review

### Standard Actions

1. **Event Analysis**: Review the event details and context
2. **Risk Assessment**: Evaluate the potential security impact
3. **Policy Check**: Verify compliance with security policies
4. **Documentation**: Record findings and actions taken
5. **Follow-up**: Schedule appropriate follow-up actions

### General Considerations
- Follow your organization's security policies
- Document all actions taken
- Escalate if uncertain about severity`
    }
  }

  const severityOptions = [
    { label: "Critical", value: "critical" },
    { label: "Warning", value: "warning" },
    { label: "Notice", value: "notice" },
  ]

  const actionStatusOptions = [
    { label: "Not started", value: "Not started" },
    { label: "In progress", value: "In progress" },
    { label: "Completed", value: "Completed" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detection Event</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 mb-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[180px] justify-start text-left font-normal bg-transparent">
                <Calendar className="mr-2 h-4 w-4" />
                {dateFilters.dateFrom ? format(dateFilters.dateFrom, "PPP") : "From Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={dateFilters.dateFrom}
                onSelect={(date) => setDateFilters((f) => ({ ...f, dateFrom: date }))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[180px] justify-start text-left font-normal bg-transparent">
                <Calendar className="mr-2 h-4 w-4" />
                {dateFilters.dateTo ? format(dateFilters.dateTo, "PPP") : "To Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={dateFilters.dateTo}
                onSelect={(date) => setDateFilters((f) => ({ ...f, dateTo: date }))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Input
            placeholder="Search events..."
            value={multiFilters.search}
            onChange={(e) => setMultiFilters((f) => ({ ...f, search: e.target.value }))}
            className="max-w-sm"
          />
          <MultiSelect
            options={severityOptions}
            selected={multiFilters.severity}
            onChange={(selected) => setMultiFilters((f) => ({ ...f, severity: selected }))}
            placeholder="Severity"
            className="w-[180px]"
          />
          <MultiSelect
            options={actionStatusOptions}
            selected={multiFilters.actionStatus}
            onChange={(selected) => setMultiFilters((f) => ({ ...f, actionStatus: selected }))}
            placeholder="Action Status"
            className="w-[180px]"
          />
=======
    const severityKey = severity?.toLowerCase() as keyof typeof recommendationsData
    const recommendations = recommendationsData[severityKey]

    if (!recommendations || recommendations.length === 0) {
      return {
        title: "No Actions Required",
        actions: ["No specific actions needed at this time."],
      }
    }

    const actionDetails: Record<string, { title: string; actions: string[] }> = {
      critical: {
        title: "Critical Security Response",
        actions: [
          "Immediately isolate the affected system from the network",
          "Contact the security team and incident response coordinator",
          "Document all current system states and network connections",
          "Begin forensic data collection before any remediation",
          "Notify relevant stakeholders and management",
          "Activate emergency response procedures",
          "Monitor for lateral movement or additional compromised systems",
        ],
      },
      warning: {
        title: "Security Monitoring Required",
        actions: [
          "Increase monitoring frequency for the affected system",
          "Review recent access logs and user activities",
          "Check for unusual network traffic patterns",
          "Verify system configurations against security baselines",
          "Schedule security assessment within 24 hours",
          "Update threat intelligence feeds",
          "Prepare incident response team for potential escalation",
        ],
      },
      notice: {
        title: "Routine Security Review",
        actions: [
          "Review system logs for any anomalies",
          "Verify compliance with security policies",
          "Update security documentation if needed",
          "Schedule routine security assessment",
          "Check for available security updates",
          "Review user access permissions",
          "Document findings in security log",
        ],
      },
    }

    return (
      actionDetails[severityKey] || {
        title: "General Review",
        actions: ["Review the event and take appropriate action based on your security policies."],
      }
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 mb-4">
          <Input
            placeholder="Search events..."
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            className="max-w-sm"
          />
          <Select value={filters.severity} onValueChange={(v) => setFilters((f) => ({ ...f, severity: v }))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="notice">Notice</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.type} onValueChange={(v) => setFilters((f) => ({ ...f, type: v }))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Infra">Infra</SelectItem>
              <SelectItem value="Security">Security</SelectItem>
              <SelectItem value="Network">Network</SelectItem>
              <SelectItem value="Application">Application</SelectItem>
            </SelectContent>
          </Select>
>>>>>>> 635fb68316ea188d00a1ccbf846d7710502b0e5a
          <Button variant="outline" onClick={resetFilters}>
            <X className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>
        <div className="overflow-x-auto max-h-[400px]">
<<<<<<< HEAD
          <Table className="min-w-[900px]">
=======
          <Table className="min-w-[800px]">
>>>>>>> 635fb68316ea188d00a1ccbf846d7710502b0e5a
            <TableHeader className="sticky top-0 bg-muted">
              <TableRow>
                <TableHead onClick={() => handleSort("timestamp")} className="cursor-pointer w-[140px]">
                  Timestamp <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead onClick={() => handleSort("severity")} className="cursor-pointer w-[100px]">
                  Severity <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
<<<<<<< HEAD
                <TableHead className="w-[150px]">Event Name</TableHead>
                <TableHead className="w-[200px]">Descriptions</TableHead>
                <TableHead className="w-[120px]">Action Status</TableHead>
                <TableHead className="w-[110px]">Details</TableHead>
=======
                <TableHead onClick={() => handleSort("type")} className="cursor-pointer w-[100px]">
                  Type <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead className="w-[150px]">Event Name</TableHead>
                <TableHead className="w-[200px]">Details</TableHead>
                <TableHead className="w-[110px]">Actions</TableHead>
>>>>>>> 635fb68316ea188d00a1ccbf846d7710502b0e5a
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedEvents.map((event, index) => {
<<<<<<< HEAD
                const eventKey = `${event.timestamp}-${index}`
                const currentStatus = eventStatuses[eventKey] || "Not started"
                const isLoading = loadingEvents.has(eventKey)

                return (
                  <TableRow key={eventKey}>
=======
                const actionDetails = getDetailedActions(event.severity)
                return (
                  <TableRow key={`${event.timestamp}-${index}`}>
>>>>>>> 635fb68316ea188d00a1ccbf846d7710502b0e5a
                    <TableCell className="w-[140px]">
                      {new Date(event.timestamp).toLocaleString("en-GB", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false,
                      })}
                    </TableCell>
                    <TableCell className="w-[100px]">{getSeverityBadge(event.severity)}</TableCell>
<<<<<<< HEAD
                    <TableCell className="w-[150px]">{event.eventName}</TableCell>
                    <TableCell className="w-[200px] whitespace-normal break-words">{event.details}</TableCell>
                    <TableCell className="w-[120px]">
                      {editingRowIndex === index ? (
                        <Select
                          value={currentStatus}
                          onValueChange={(newStatus: ActionStatus) => handleActionStatusChange(newStatus, eventKey)}
                          disabled={isLoading}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Not started">Not started</SelectItem>
                            <SelectItem value="In progress">In progress</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div onClick={() => handleActionStatusClick(index, event)}>
                          {getActionStatusBadge(currentStatus)}
                          {isLoading && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary ml-2 inline-block"></div>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="w-[110px]">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-0 h-auto font-medium"
                        onClick={() => handleViewDetails(event)}
                      >
                        View
                      </Button>
=======
                    <TableCell className="w-[100px]">{event.type}</TableCell>
                    <TableCell className="w-[150px]">{event.eventName}</TableCell>
                    <TableCell className="w-[200px] whitespace-normal break-words">{event.details}</TableCell>
                    <TableCell className="w-[110px]">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-0 h-auto font-medium"
                          >
                            {getRecommendations(event.severity)}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              {getSeverityBadge(event.severity)}
                              {actionDetails.title}
                            </DialogTitle>
                            <DialogDescription>
                              Event: {event.eventName} | Type: {event.type}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold mb-2">Event Details:</h4>
                              <p className="text-sm text-muted-foreground bg-muted p-3 rounded">{event.details}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-3">Recommended Actions:</h4>
                              <ul className="space-y-2">
                                {actionDetails.actions.map((action, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <span className="text-blue-600 dark:text-blue-400 font-bold mt-1">•</span>
                                    <span className="text-sm">{action}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
>>>>>>> 635fb68316ea188d00a1ccbf846d7710502b0e5a
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
<<<<<<< HEAD
        <ActionResponseGuidePopup
          isOpen={actionGuideOpen}
          onClose={() => setActionGuideOpen(false)}
          ruleName={selectedEventData?.ruleName}
          ruleDescription={selectedEventData?.ruleDescription}
          ruleQuery={selectedEventData?.ruleQuery}
          investigationGuide={selectedEventData?.investigationGuide}
        />
=======
>>>>>>> 635fb68316ea188d00a1ccbf846d7710502b0e5a
      </CardContent>
    </Card>
  )
}
