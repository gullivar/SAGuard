"use client"

import * as React from "react"
import { generateShipData } from "@/lib/data"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, X } from "lucide-react"

// 추론된 탐지 로그 데이터 구조
interface DetectionLog {
  id: string
  timestamp: Date
  shipId: string
  shipName: string
  severity: "Critical" | "Warning" | "Info"
  logType: "Security" | "System" | "Network" | "User"
  source: string // Asset Name or IP
  event: string
  details: string
  action: "Blocked" | "Allowed" | "Detected" | "Logged"
}

// 추론된 탐지 로그 생성 함수
const generateDetectionLogs = (ships: any[]): DetectionLog[] => {
  const logs: DetectionLog[] = []
  const severities: DetectionLog["severity"][] = ["Critical", "Warning", "Info"]
  const logTypes: DetectionLog["logType"][] = ["Security", "System", "Network", "User"]
  const actions: DetectionLog["action"][] = ["Blocked", "Allowed", "Detected", "Logged"]
  const events = {
    Security: ["Unauthorized access attempt", "Malware detected", "Firewall rule violation"],
    System: ["Service failed to start", "CPU temperature exceeded threshold", "Unexpected shutdown"],
    Network: ["Port scan detected from external IP", "Unusual traffic pattern observed", "New device connected"],
    User: ["Failed login attempt (x5)", "Privilege escalation", "User account created"],
  }

  ships.forEach((ship) => {
    for (let i = 0; i < 100; i++) {
      const logType = logTypes[Math.floor(Math.random() * logTypes.length)]
      logs.push({
        id: `log-${ship.id}-${i}`,
        timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        shipId: ship.id,
        shipName: ship.name,
        severity: severities[Math.floor(Math.random() * severities.length)],
        logType: logType,
        source: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        event: events[logType][Math.floor(Math.random() * events[logType].length)],
        details: `Detailed information about event log #${i}.`,
        action: actions[Math.floor(Math.random() * actions.length)],
      })
    }
  })
  return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

export default function DetectionLogPage() {
  const [allLogs, setAllLogs] = React.useState<DetectionLog[]>([])
  const [ships, setShips] = React.useState<any[]>([])
  const [filters, setFilters] = React.useState({
    shipId: "all",
    severity: "all",
    logType: "all",
    searchTerm: "",
  })

  React.useEffect(() => {
    const shipsData = generateShipData()
    setShips(shipsData)
    setAllLogs(generateDetectionLogs(shipsData))
  }, [])

  const filteredLogs = React.useMemo(() => {
    return allLogs.filter((log) => {
      const searchTermLower = filters.searchTerm.toLowerCase()
      return (
        (filters.shipId === "all" || log.shipId === filters.shipId) &&
        (filters.severity === "all" || log.severity === filters.severity) &&
        (filters.logType === "all" || log.logType === filters.logType) &&
        (filters.searchTerm === "" ||
          log.source.toLowerCase().includes(searchTermLower) ||
          log.event.toLowerCase().includes(searchTermLower) ||
          log.details.toLowerCase().includes(searchTermLower))
      )
    })
  }, [allLogs, filters])

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "Critical":
        return <Badge variant="destructive">Critical</Badge>
      case "Warning":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Warning</Badge>
      case "Info":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Info</Badge>
      default:
        return <Badge variant="secondary">{severity}</Badge>
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 h-screen overflow-y-auto">
      <h1 className="text-2xl font-bold mb-6">탐지 로그 조회</h1>
      <Card>
        <CardHeader>
          <CardTitle>검색 필터</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Source, Event, Details 검색..."
                  className="pl-8"
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                />
              </div>
            </div>
            <div className="w-[150px]">
              <Select value={filters.shipId} onValueChange={(v) => setFilters({ ...filters, shipId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="선박 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 선박</SelectItem>
                  {ships.map((ship) => (
                    <SelectItem key={ship.id} value={ship.id}>
                      {ship.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-[120px]">
              <Select value={filters.severity} onValueChange={(v) => setFilters({ ...filters, severity: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="심각도" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 심각도</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="Warning">Warning</SelectItem>
                  <SelectItem value="Info">Info</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-[120px]">
              <Select value={filters.logType} onValueChange={(v) => setFilters({ ...filters, logType: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="로그 타입" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 타입</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
                  <SelectItem value="System">System</SelectItem>
                  <SelectItem value="Network">Network</SelectItem>
                  <SelectItem value="User">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="ml-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilters({ shipId: "all", severity: "all", logType: "all", searchTerm: "" })}
                className="h-10"
              >
                <X className="mr-1 h-3 w-3" />
                초기화
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>선박명</TableHead>
              <TableHead>심각도</TableHead>
              <TableHead>로그 타입</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.slice(0, 200).map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.timestamp.toLocaleString()}</TableCell>
                <TableCell>{log.shipName}</TableCell>
                <TableCell>{getSeverityBadge(log.severity)}</TableCell>
                <TableCell>{log.logType}</TableCell>
                <TableCell>{log.source}</TableCell>
                <TableCell>{log.event}</TableCell>
                <TableCell>{log.action}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
