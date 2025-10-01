"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, RotateCcw, X, Search } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

// Mock data types
interface User {
  id: string
  name: string
  cbsCount: number
  status: "online" | "offline" | "warning"
}

interface CBS {
  id: string
  name: string
  userCount: number
  ip: string
  status: "online" | "offline" | "maintenance"
}

interface ConnectionDetail {
  id: string
  firstConnectionTime: string
  userId: string
  cbsName: string
  ipAddress: string
  duration: number
  sentBytes: number
  receivedBytes: number
  connectionCount: number
  status: "Connected" | "Disconnected"
}

// Mock data
const mockUsers: User[] = [
  { id: "User_D", name: "User D", cbsCount: 2, status: "online" },
  { id: "User_J", name: "User J", cbsCount: 3, status: "online" },
  { id: "User_K", name: "User K", cbsCount: 3, status: "warning" },
  { id: "User_R", name: "User R", cbsCount: 2, status: "online" },
]

const mockCBS: CBS[] = [
  { id: "CommsUnit", name: "CommsUnit", userCount: 1, ip: "192.168.1.10", status: "online" },
  { id: "Propulsion", name: "Propulsion", userCount: 1, ip: "192.168.1.11", status: "online" },
  { id: "DataLogger", name: "DataLogger", userCount: 2, ip: "192.168.1.12", status: "online" },
  { id: "NaviSys", name: "NaviSys", userCount: 2, ip: "192.168.1.13", status: "online" },
  { id: "WeatherMon", name: "WeatherMon", userCount: 1, ip: "192.168.1.14", status: "online" },
  { id: "AutoPilot", name: "AutoPilot", userCount: 2, ip: "192.168.1.15", status: "online" },
  { id: "FireDetect", name: "FireDetect", userCount: 1, ip: "192.168.1.16", status: "online" },
  { id: "SecurityGW", name: "SecurityGW", userCount: 1, ip: "192.168.1.17", status: "online" },
  { id: "SteeringGear", name: "SteeringGear", userCount: 1, ip: "192.168.1.18", status: "online" },
  { id: "Stabilizer", name: "Stabilizer", userCount: 1, ip: "192.168.1.19", status: "online" },
]

const mockConnections: ConnectionDetail[] = [
  {
    id: "1",
    firstConnectionTime: "2025.08.14 13:26:05",
    userId: "User_K",
    cbsName: "CargoMon",
    ipAddress: "192.168.2.52",
    duration: 3,
    sentBytes: 4.89 * 1024 * 1024,
    receivedBytes: 11.78 * 1024 * 1024,
    connectionCount: 1,
    status: "Connected",
  },
  {
    id: "2",
    firstConnectionTime: "2025.08.14 13:15:58",
    userId: "User_U",
    cbsName: "SteeringGear",
    ipAddress: "192.168.1.106",
    duration: 13,
    sentBytes: 3.03 * 1024 * 1024,
    receivedBytes: 0.59 * 1024 * 1024,
    connectionCount: 1,
    status: "Connected",
  },
  {
    id: "3",
    firstConnectionTime: "2025.08.14 12:21:58",
    userId: "User_D",
    cbsName: "Propulsion",
    ipAddress: "192.168.1.105",
    duration: 67,
    sentBytes: 4.74 * 1024 * 1024,
    receivedBytes: 17.38 * 1024 * 1024,
    connectionCount: 1,
    status: "Disconnected",
  },
  {
    id: "4",
    firstConnectionTime: "2025.08.14 11:34:13",
    userId: "User_R",
    cbsName: "DataLogger",
    ipAddress: "192.168.5.5",
    duration: 115,
    sentBytes: 3.95 * 1024 * 1024,
    receivedBytes: 16.42 * 1024 * 1024,
    connectionCount: 1,
    status: "Disconnected",
  },
]

export default function DetailedConnectionPage() {
  const [searchShip, setSearchShip] = React.useState<string>("")
  const [startDate, setStartDate] = React.useState<Date>()
  const [endDate, setEndDate] = React.useState<Date>()
  const [selectedUserId, setSelectedUserId] = React.useState<string>("all")
  const [minDuration, setMinDuration] = React.useState<string>("")
  const [minSentBytes, setMinSentBytes] = React.useState<string>("")
  const [minReceivedBytes, setMinReceivedBytes] = React.useState<string>("")

  const [selectedUser, setSelectedUser] = React.useState<string | null>(null)
  const [selectedCBS, setSelectedCBS] = React.useState<string | null>(null)
  const [showUserModal, setShowUserModal] = React.useState(false)
  const [showCBSModal, setShowCBSModal] = React.useState(false)

  const [detailFilters, setDetailFilters] = React.useState({
    firstConnectionTime: "",
    userId: "",
    cbsName: "",
    ipAddress: "",
  })

  const resetFilters = () => {
    setStartDate(undefined)
    setEndDate(undefined)
    setSelectedUserId("all")
    setMinDuration("")
    setMinSentBytes("")
    setMinReceivedBytes("")
  }

  const resetDetailFilters = () => {
    setDetailFilters({
      firstConnectionTime: "",
      userId: "",
      cbsName: "",
      ipAddress: "",
    })
  }

  const getUserStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "border-green-500 bg-green-500/20"
      case "warning":
        return "border-yellow-500 bg-yellow-500/20"
      case "offline":
        return "border-red-500 bg-red-500/20"
      default:
        return "border-gray-500 bg-gray-500/20"
    }
  }

  const getCBSStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "border-green-500 bg-green-500/20"
      case "maintenance":
        return "border-yellow-500 bg-yellow-500/20"
      case "offline":
        return "border-red-500 bg-red-500/20"
      default:
        return "border-gray-500 bg-gray-500/20"
    }
  }

  const getConnectionColor = (userId: string, cbsId: string) => {
    const user = mockUsers.find((u) => u.id === userId)
    if (user?.status === "warning") return "stroke-yellow-500"
    return "stroke-green-500"
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Detailed Connection Information</h1>
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search ship..."
            value={searchShip}
            onChange={(e) => setSearchShip(e.target.value)}
            className="w-48"
          />
        </div>
      </div>

      {searchShip && (
        <p className="text-sm text-muted-foreground">
          Showing connection information for: <span className="font-semibold">{searchShip}</span>
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Filter (All Connection Targets)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="space-y-2">
              <Label>Initial Connection Time (Start)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "yyyy-MM-dd") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Initial Connection Time (End)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "yyyy-MM-dd") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>User ID (All)</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ALL</SelectItem>
                  {mockUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Connection Duration (min or more)</Label>
              <Input
                type="number"
                placeholder="Minutes"
                value={minDuration}
                onChange={(e) => setMinDuration(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Sent Bytes</Label>
              <Input
                type="number"
                placeholder="Bytes"
                value={minSentBytes}
                onChange={(e) => setMinSentBytes(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Received Bytes</Label>
              <Input
                type="number"
                placeholder="Bytes"
                value={minReceivedBytes}
                onChange={(e) => setMinReceivedBytes(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Connection Status (Unique CBS: {mockCBS.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-[600px] bg-gray-900/50 rounded-lg overflow-hidden">
            <svg className="absolute inset-0 w-full h-full">
              {/* Connection lines */}
              {mockUsers.map((user, userIndex) =>
                mockCBS.map((cbs, cbsIndex) => {
                  // Mock connections - in real app, this would be based on actual connection data
                  if ((userIndex + cbsIndex) % 2 === 0) {
                    const userX = 200
                    const userY = 100 + userIndex * 120
                    const cbsX = 800
                    const cbsY = 100 + cbsIndex * 110

                    return (
                      <line
                        key={`${user.id}-${cbs.id}`}
                        x1={userX}
                        y1={userY}
                        x2={cbsX}
                        y2={cbsY}
                        className={cn("stroke-2 opacity-70", getConnectionColor(user.id, cbs.id))}
                        strokeWidth="2"
                      />
                    )
                  }
                  return null
                }),
              )}
            </svg>

            {/* User nodes */}
            {mockUsers.map((user, index) => (
              <div
                key={user.id}
                className={cn(
                  "absolute w-24 h-24 rounded-full border-4 flex flex-col items-center justify-center cursor-pointer transition-all",
                  getUserStatusColor(user.status),
                )}
                style={{
                  left: 200,
                  top: 100 + index * 120,
                  transform: "translate(-50%, -50%)",
                }}
                onClick={() => {
                  setSelectedUser(user.id)
                  setShowUserModal(true)
                }}
              >
                <div className="text-white font-bold text-sm">{user.id}</div>
                <div className="text-white text-xs">({user.cbsCount} CBS)</div>
              </div>
            ))}

            {/* CBS nodes */}
            {mockCBS.map((cbs, index) => (
              <div
                key={cbs.id}
                className={cn(
                  "absolute w-32 h-20 border-4 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all",
                  getCBSStatusColor(cbs.status),
                )}
                style={{
                  left: 800,
                  top: 100 + index * 110,
                  transform: "translate(-50%, -50%)",
                }}
                onClick={() => {
                  setSelectedCBS(cbs.id)
                  setShowCBSModal(true)
                }}
              >
                <div className="text-white font-bold text-sm">{cbs.name}</div>
                <div className="text-white text-xs">({cbs.userCount})</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Connection Status Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Detail filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label>Initial Connection Time</Label>
                <Input
                  placeholder="Select period..."
                  value={detailFilters.firstConnectionTime}
                  onChange={(e) => setDetailFilters((prev) => ({ ...prev, firstConnectionTime: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>User ID</Label>
                <Input
                  placeholder="Select user ID..."
                  value={detailFilters.userId}
                  onChange={(e) => setDetailFilters((prev) => ({ ...prev, userId: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>CBS Name</Label>
                <Input
                  placeholder="Select CBS name..."
                  value={detailFilters.cbsName}
                  onChange={(e) => setDetailFilters((prev) => ({ ...prev, cbsName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>IP Address</Label>
                <Input
                  placeholder="Search IP address..."
                  value={detailFilters.ipAddress}
                  onChange={(e) => setDetailFilters((prev) => ({ ...prev, ipAddress: e.target.value }))}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={resetDetailFilters} variant="outline" className="w-full bg-transparent">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Table Filters
                </Button>
              </div>
            </div>

            {/* Detail table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Initial Connection Time</th>
                    <th className="text-left p-3">User ID</th>
                    <th className="text-left p-3">CBS Name</th>
                    <th className="text-left p-3">IP Address</th>
                    <th className="text-left p-3">Connection Duration (min)</th>
                    <th className="text-left p-3">Sent Bytes</th>
                    <th className="text-left p-3">Received Bytes</th>
                    <th className="text-left p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockConnections.map((connection) => (
                    <tr key={connection.id} className="border-b hover:bg-muted/50">
                      <td className="p-3">{connection.firstConnectionTime}</td>
                      <td className="p-3">{connection.userId}</td>
                      <td className="p-3">{connection.cbsName}</td>
                      <td className="p-3">{connection.ipAddress}</td>
                      <td className="p-3">{connection.duration}</td>
                      <td className="p-3">{(connection.sentBytes / (1024 * 1024)).toFixed(2)} MB</td>
                      <td className="p-3">{(connection.receivedBytes / (1024 * 1024)).toFixed(2)} MB</td>
                      <td className="p-3">
                        <Badge variant={connection.status === "Connected" ? "default" : "destructive"}>
                          {connection.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background border rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">👤 User: {selectedUser} (Connected CBS List)</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowUserModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 text-blue-400 text-lg">CBS Name</th>
                    <th className="text-left p-4 text-blue-400 text-lg">CBS IP Address</th>
                    <th className="text-left p-4 text-blue-400 text-lg">Connection Time</th>
                  </tr>
                </thead>
                <tbody>
                  {mockCBS.slice(0, 3).map((cbs) => (
                    <tr key={cbs.id} className="border-b">
                      <td className="p-4 text-base">{cbs.name}</td>
                      <td className="p-4 text-base">{cbs.ip}</td>
                      <td className="p-4 text-base">10:56</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CBS Modal */}
      {showCBSModal && selectedCBS && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background border rounded-lg p-8 max-w-6xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">🖥️ CBS: {selectedCBS} - Connected User Details</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowCBSModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 text-blue-400 text-lg">User(s)</th>
                    <th className="text-left p-4 text-blue-400 text-lg">Initial Connection</th>
                    <th className="text-left p-4 text-blue-400 text-lg">Connection IP</th>
                    <th className="text-left p-4 text-blue-400 text-lg">Sent (MB)</th>
                    <th className="text-left p-4 text-blue-400 text-lg">Received (MB)</th>
                    <th className="text-left p-4 text-blue-400 text-lg">Total Connections</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 text-base">User_J</td>
                    <td className="p-4 text-base">2025.08.14 10:56:18</td>
                    <td className="p-4 text-base">192.168.5.5</td>
                    <td className="p-4 text-base">0.49</td>
                    <td className="p-4 text-base">10.59</td>
                    <td className="p-4 text-base">1</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 text-base">User_R</td>
                    <td className="p-4 text-base">2025.08.14 11:34:13</td>
                    <td className="p-4 text-base">192.168.5.5</td>
                    <td className="p-4 text-base">3.95</td>
                    <td className="p-4 text-base">16.42</td>
                    <td className="p-4 text-base">1</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
