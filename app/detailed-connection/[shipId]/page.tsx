"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ArrowLeft, CalendarIcon, X, Network, Minus, Plus } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface ConnectionData {
  userId: string
  cbsName: string
  cbsIp: string
  connectTime: string
  duration: number
  sentBytes: number
  receivedBytes: number
  connectionCount: number
  status: string
}

interface UserNode {
  id: string
  name: string
  cbsCount: number
  status: "normal" | "warning" | "critical"
  connections: { cbsName: string; cbsIp: string; connectTime: string }[]
}

interface CBSNode {
  id: string
  name: string
  userCount: number
  status: "normal" | "warning" | "critical"
  users: {
    userId: string
    connectTime: string
    duration: number
    ip: string
    sentMB: number
    receivedMB: number
    connectionCount: number
  }[]
}

const connectionData: ConnectionData[] = [
  {
    userId: "User_A",
    cbsName: "CommsUnit",
    cbsIp: "192.168.1.100",
    connectTime: "2025.08.14 09:30:15",
    duration: 180,
    sentBytes: 2100,
    receivedBytes: 8500,
    connectionCount: 1,
    status: "normal",
  },
  {
    userId: "User_D",
    cbsName: "CommsUnit",
    cbsIp: "192.168.1.100",
    connectTime: "2025.08.14 10:56:18",
    duration: 120,
    sentBytes: 3200,
    receivedBytes: 12300,
    connectionCount: 1,
    status: "normal",
  },
  {
    userId: "User_B",
    cbsName: "Propulsion",
    cbsIp: "192.168.1.105",
    connectTime: "2025.08.14 10:15:30",
    duration: 95,
    sentBytes: 5800,
    receivedBytes: 15200,
    connectionCount: 1,
    status: "normal",
  },
  {
    userId: "User_D",
    cbsName: "Propulsion",
    cbsIp: "192.168.1.105",
    connectTime: "2025.08.14 11:21:58",
    duration: 67,
    sentBytes: 4740,
    receivedBytes: 17380,
    connectionCount: 1,
    status: "normal",
  },
  {
    userId: "User_C",
    cbsName: "DataLogger",
    cbsIp: "192.168.5.5",
    connectTime: "2025.08.14 08:20:45",
    duration: 200,
    sentBytes: 1800,
    receivedBytes: 9700,
    connectionCount: 1,
    status: "warning",
  },
  {
    userId: "User_G",
    cbsName: "DataLogger",
    cbsIp: "192.168.5.5",
    connectTime: "2025.08.14 10:05:12",
    duration: 145,
    sentBytes: 2900,
    receivedBytes: 11400,
    connectionCount: 1,
    status: "warning",
  },
  {
    userId: "User_J",
    cbsName: "DataLogger",
    cbsIp: "192.168.5.5",
    connectTime: "2025.08.14 10:56:18",
    duration: 153,
    sentBytes: 490,
    receivedBytes: 10590,
    connectionCount: 1,
    status: "warning",
  },
  {
    userId: "User_E",
    cbsName: "NaviSys",
    cbsIp: "192.168.1.102",
    connectTime: "2025.08.14 09:10:22",
    duration: 165,
    sentBytes: 3100,
    receivedBytes: 7800,
    connectionCount: 1,
    status: "warning",
  },
  {
    userId: "User_I",
    cbsName: "NaviSys",
    cbsIp: "192.168.1.102",
    connectTime: "2025.08.14 11:30:15",
    duration: 90,
    sentBytes: 2400,
    receivedBytes: 5600,
    connectionCount: 1,
    status: "warning",
  },
  {
    userId: "User_J",
    cbsName: "NaviSys",
    cbsIp: "192.168.1.102",
    connectTime: "2025.08.14 11:15:32",
    duration: 134,
    sentBytes: 2590,
    receivedBytes: 2570,
    connectionCount: 1,
    status: "warning",
  },
  {
    userId: "User_A",
    cbsName: "WeatherMon",
    cbsIp: "10.0.5.20",
    connectTime: "2025.08.14 09:45:30",
    duration: 175,
    sentBytes: 1200,
    receivedBytes: 6800,
    connectionCount: 1,
    status: "normal",
  },
  {
    userId: "User_F",
    cbsName: "WeatherMon",
    cbsIp: "10.0.5.20",
    connectTime: "2025.08.14 11:00:45",
    duration: 110,
    sentBytes: 2800,
    receivedBytes: 9100,
    connectionCount: 1,
    status: "normal",
  },
  {
    userId: "User_B",
    cbsName: "AutoPilot",
    cbsIp: "172.16.0.101",
    connectTime: "2025.08.14 10:30:18",
    duration: 85,
    sentBytes: 4200,
    receivedBytes: 13500,
    connectionCount: 1,
    status: "normal",
  },
  {
    userId: "User_G",
    cbsName: "AutoPilot",
    cbsIp: "172.16.0.101",
    connectTime: "2025.08.14 10:20:33",
    duration: 95,
    sentBytes: 3700,
    receivedBytes: 11800,
    connectionCount: 1,
    status: "normal",
  },
  {
    userId: "User_B",
    cbsName: "FireDetect",
    cbsIp: "10.0.6.1",
    connectTime: "2025.08.14 10:45:12",
    duration: 75,
    sentBytes: 6100,
    receivedBytes: 18900,
    connectionCount: 1,
    status: "critical",
  },
  {
    userId: "User_G",
    cbsName: "FireDetect",
    cbsIp: "10.0.6.1",
    connectTime: "2025.08.14 10:35:27",
    duration: 80,
    sentBytes: 5800,
    receivedBytes: 17200,
    connectionCount: 1,
    status: "critical",
  },
  {
    userId: "User_C",
    cbsName: "SecurityGW",
    cbsIp: "10.0.0.1",
    connectTime: "2025.08.14 08:35:40",
    duration: 190,
    sentBytes: 7200,
    receivedBytes: 21400,
    connectionCount: 1,
    status: "critical",
  },
  {
    userId: "User_H",
    cbsName: "SecurityGW",
    cbsIp: "10.0.0.1",
    connectTime: "2025.08.14 08:45:55",
    duration: 185,
    sentBytes: 6800,
    receivedBytes: 19700,
    connectionCount: 1,
    status: "critical",
  },
  {
    userId: "User_E",
    cbsName: "SteeringGear",
    cbsIp: "192.168.1.106",
    connectTime: "2025.08.14 09:25:18",
    duration: 155,
    sentBytes: 4500,
    receivedBytes: 14200,
    connectionCount: 1,
    status: "warning",
  },
  {
    userId: "User_H",
    cbsName: "SteeringGear",
    cbsIp: "192.168.1.106",
    connectTime: "2025.08.14 09:00:33",
    duration: 170,
    sentBytes: 5100,
    receivedBytes: 16800,
    connectionCount: 1,
    status: "warning",
  },
  {
    userId: "User_E",
    cbsName: "Stabilizer",
    cbsIp: "10.0.5.21",
    connectTime: "2025.08.14 09:40:25",
    duration: 140,
    sentBytes: 3300,
    receivedBytes: 10700,
    connectionCount: 1,
    status: "normal",
  },
  {
    userId: "User_I",
    cbsName: "Stabilizer",
    cbsIp: "10.0.5.21",
    connectTime: "2025.08.14 11:45:12",
    duration: 75,
    sentBytes: 2100,
    receivedBytes: 7900,
    connectionCount: 1,
    status: "normal",
  },
  {
    userId: "User_E",
    cbsName: "CargoMon",
    cbsIp: "192.168.2.52",
    connectTime: "2025.08.14 09:55:40",
    duration: 125,
    sentBytes: 8200,
    receivedBytes: 24600,
    connectionCount: 1,
    status: "warning",
  },
  {
    userId: "User_I",
    cbsName: "CargoMon",
    cbsIp: "192.168.2.52",
    connectTime: "2025.08.14 12:00:15",
    duration: 60,
    sentBytes: 6700,
    receivedBytes: 19300,
    connectionCount: 1,
    status: "warning",
  },
  {
    userId: "User_F",
    cbsName: "SafetySys",
    cbsIp: "192.168.3.11",
    connectTime: "2025.08.14 11:15:28",
    duration: 105,
    sentBytes: 3800,
    receivedBytes: 12100,
    connectionCount: 1,
    status: "normal",
  },
  {
    userId: "User_J",
    cbsName: "SafetySys",
    cbsIp: "192.168.3.11",
    connectTime: "2025.08.14 11:21:00",
    duration: 128,
    sentBytes: 4800,
    receivedBytes: 6920,
    connectionCount: 1,
    status: "normal",
  },
]

const userNodes: UserNode[] = [
  {
    id: "User_A",
    name: "User_A",
    cbsCount: 2,
    status: "normal",
    connections: [
      { cbsName: "CommsUnit", cbsIp: "192.168.1.100", connectTime: "09:30" },
      { cbsName: "WeatherMon", cbsIp: "10.0.5.20", connectTime: "09:45" },
    ],
  },
  {
    id: "User_B",
    name: "User_B",
    cbsCount: 3,
    status: "warning",
    connections: [
      { cbsName: "Propulsion", cbsIp: "192.168.1.105", connectTime: "10:15" },
      { cbsName: "AutoPilot", cbsIp: "172.16.0.101", connectTime: "10:30" },
      { cbsName: "FireDetect", cbsIp: "10.0.6.1", connectTime: "10:45" },
    ],
  },
  {
    id: "User_C",
    name: "User_C",
    cbsCount: 2,
    status: "normal",
    connections: [
      { cbsName: "DataLogger", cbsIp: "192.168.5.5", connectTime: "08:20" },
      { cbsName: "SecurityGW", cbsIp: "10.0.0.1", connectTime: "08:35" },
    ],
  },
  {
    id: "User_D",
    name: "User_D",
    cbsCount: 2,
    status: "normal",
    connections: [
      { cbsName: "CommsUnit", cbsIp: "192.168.1.100", connectTime: "10:56" },
      { cbsName: "Propulsion", cbsIp: "192.168.1.105", connectTime: "11:21" },
    ],
  },
  {
    id: "User_E",
    name: "User_E",
    cbsCount: 4,
    status: "critical",
    connections: [
      { cbsName: "NaviSys", cbsIp: "192.168.1.102", connectTime: "09:10" },
      { cbsName: "SteeringGear", cbsIp: "192.168.1.106", connectTime: "09:25" },
      { cbsName: "Stabilizer", cbsIp: "10.0.5.21", connectTime: "09:40" },
      { cbsName: "CargoMon", cbsIp: "192.168.2.52", connectTime: "09:55" },
    ],
  },
  {
    id: "User_F",
    name: "User_F",
    cbsCount: 2,
    status: "warning",
    connections: [
      { cbsName: "WeatherMon", cbsIp: "10.0.5.20", connectTime: "11:00" },
      { cbsName: "SafetySys", cbsIp: "192.168.3.11", connectTime: "11:15" },
    ],
  },
  {
    id: "User_G",
    name: "User_G",
    cbsCount: 3,
    status: "normal",
    connections: [
      { cbsName: "DataLogger", cbsIp: "192.168.5.5", connectTime: "10:05" },
      { cbsName: "AutoPilot", cbsIp: "172.16.0.101", connectTime: "10:20" },
      { cbsName: "FireDetect", cbsIp: "10.0.6.1", connectTime: "10:35" },
    ],
  },
  {
    id: "User_H",
    name: "User_H",
    cbsCount: 2,
    status: "critical",
    connections: [
      { cbsName: "SecurityGW", cbsIp: "10.0.0.1", connectTime: "08:45" },
      { cbsName: "SteeringGear", cbsIp: "192.168.1.106", connectTime: "09:00" },
    ],
  },
  {
    id: "User_I",
    name: "User_I",
    cbsCount: 3,
    status: "warning",
    connections: [
      { cbsName: "NaviSys", cbsIp: "192.168.1.102", connectTime: "11:30" },
      { cbsName: "Stabilizer", cbsIp: "10.0.5.21", connectTime: "11:45" },
      { cbsName: "CargoMon", cbsIp: "192.168.2.52", connectTime: "12:00" },
    ],
  },
  {
    id: "User_J",
    name: "User_J",
    cbsCount: 3,
    status: "critical",
    connections: [
      { cbsName: "DataLogger", cbsIp: "192.168.5.5", connectTime: "10:56" },
      { cbsName: "NaviSys", cbsIp: "192.168.1.102", connectTime: "11:15" },
      { cbsName: "SafetySys", cbsIp: "192.168.3.11", connectTime: "11:21" },
    ],
  },
]

const cbsNodes: CBSNode[] = [
  {
    id: "CommsUnit",
    name: "CommsUnit",
    userCount: 2,
    status: "normal",
    users: [
      {
        userId: "User_A",
        connectTime: "2025.08.14 09:30:15",
        duration: 180,
        ip: "192.168.1.100",
        sentMB: 2.1,
        receivedMB: 8.5,
        connectionCount: 1,
      },
      {
        userId: "User_D",
        connectTime: "2025.08.14 10:56:18",
        duration: 120,
        ip: "192.168.1.100",
        sentMB: 3.2,
        receivedMB: 12.3,
        connectionCount: 1,
      },
    ],
  },
  {
    id: "Propulsion",
    name: "Propulsion",
    userCount: 2,
    status: "normal",
    users: [
      {
        userId: "User_B",
        connectTime: "2025.08.14 10:15:30",
        duration: 95,
        ip: "192.168.1.105",
        sentMB: 5.8,
        receivedMB: 15.2,
        connectionCount: 1,
      },
      {
        userId: "User_D",
        connectTime: "2025.08.14 11:21:58",
        duration: 67,
        ip: "192.168.1.105",
        sentMB: 4.74,
        receivedMB: 17.38,
        connectionCount: 1,
      },
    ],
  },
  {
    id: "DataLogger",
    name: "DataLogger",
    userCount: 2,
    status: "normal",
    users: [
      {
        userId: "User_G",
        connectTime: "2025.08.14 10:05:22",
        duration: 150,
        ip: "192.168.5.5",
        sentMB: 1.8,
        receivedMB: 9.2,
        connectionCount: 1,
      },
      {
        userId: "User_J",
        connectTime: "2025.08.14 10:56:18",
        duration: 120,
        ip: "192.168.5.5",
        sentMB: 0.49,
        receivedMB: 10.59,
        connectionCount: 1,
      },
    ],
  },
  {
    id: "NaviSys",
    name: "NaviSys",
    userCount: 2,
    status: "warning",
    users: [
      {
        userId: "User_I",
        connectTime: "2025.08.14 11:30:45",
        duration: 85,
        ip: "192.168.1.102",
        sentMB: 3.1,
        receivedMB: 7.8,
        connectionCount: 1,
      },
      {
        userId: "User_J",
        connectTime: "2025.08.14 11:15:30",
        duration: 95,
        ip: "192.168.1.102",
        sentMB: 2.7,
        receivedMB: 11.4,
        connectionCount: 1,
      },
    ],
  },
  {
    id: "WeatherMon",
    name: "WeatherMon",
    userCount: 1,
    status: "normal",
    users: [
      {
        userId: "User_F",
        connectTime: "2025.08.14 11:00:12",
        duration: 110,
        ip: "10.0.5.20",
        sentMB: 1.2,
        receivedMB: 4.5,
        connectionCount: 1,
      },
    ],
  },
  {
    id: "AutoPilot",
    name: "AutoPilot",
    userCount: 2,
    status: "normal",
    users: [
      {
        userId: "User_C",
        connectTime: "2025.08.14 09:45:30",
        duration: 200,
        ip: "172.16.0.101",
        sentMB: 6.2,
        receivedMB: 18.7,
        connectionCount: 1,
      },
      {
        userId: "User_G",
        connectTime: "2025.08.14 10:20:15",
        duration: 130,
        ip: "172.16.0.101",
        sentMB: 4.1,
        receivedMB: 13.2,
        connectionCount: 1,
      },
    ],
  },
  {
    id: "FireDetect",
    name: "FireDetect",
    userCount: 1,
    status: "normal",
    users: [
      {
        userId: "User_G",
        connectTime: "2025.08.14 10:35:20",
        duration: 75,
        ip: "10.0.6.1",
        sentMB: 0.8,
        receivedMB: 3.1,
        connectionCount: 1,
      },
    ],
  },
  {
    id: "SecurityGW",
    name: "SecurityGW",
    userCount: 1,
    status: "critical",
    users: [
      {
        userId: "User_H",
        connectTime: "2025.08.14 08:45:10",
        duration: 300,
        ip: "10.0.0.1",
        sentMB: 8.9,
        receivedMB: 25.3,
        connectionCount: 1,
      },
    ],
  },
  {
    id: "SteeringGear",
    name: "SteeringGear",
    userCount: 1,
    status: "normal",
    users: [
      {
        userId: "User_H",
        connectTime: "2025.08.14 09:00:25",
        duration: 180,
        ip: "192.168.1.106",
        sentMB: 3.03,
        receivedMB: 0.59,
        connectionCount: 1,
      },
    ],
  },
  {
    id: "Stabilizer",
    name: "Stabilizer",
    userCount: 1,
    status: "normal",
    users: [
      {
        userId: "User_I",
        connectTime: "2025.08.14 11:45:30",
        duration: 60,
        ip: "10.0.5.21",
        sentMB: 1.5,
        receivedMB: 5.2,
        connectionCount: 1,
      },
    ],
  },
]

export default function DetailedConnectionPage({ params }: { params: { shipId: string } }) {
  const router = useRouter()
  const [startDate, setStartDate] = React.useState<Date>()
  const [endDate, setEndDate] = React.useState<Date>()
  const [selectedUserId, setSelectedUserId] = React.useState<string>("ALL")
  const [minDuration, setMinDuration] = React.useState<string>("")
  const [minSentBytes, setMinSentBytes] = React.useState<string>("")
  const [minReceivedBytes, setMinReceivedBytes] = React.useState<string>("")

  // Detail filters
  const [detailStartTime, setDetailStartTime] = React.useState<string>("")
  const [detailUserId, setDetailUserId] = React.useState<string>("")
  const [detailCbsName, setDetailCbsName] = React.useState<string>("")
  const [detailIpAddress, setDetailIpAddress] = React.useState<string>("")

  const [selectedUserModal, setSelectedUserModal] = React.useState<UserNode | null>(null)
  const [selectedCBSModal, setSelectedCBSModal] = React.useState<CBSNode | null>(null)
  const [highlightedUser, setHighlightedUser] = React.useState<string | null>(null)
  const [hoveredCBS, setHoveredCBS] = React.useState<string | null>(null)

  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState("00:00")

  const [connectionZoom, setConnectionZoom] = React.useState(1)

  const userIds = ["ALL", ...Array.from(new Set(connectionData.map((d) => d.userId)))]

  const resetMainFilters = () => {
    setStartDate(undefined)
    setEndDate(undefined)
    setSelectedUserId("ALL")
    setMinDuration("")
    setMinSentBytes("")
    setMinReceivedBytes("")
  }

  const applyMainFilters = () => {
    // Filter logic would be applied here
    console.log("Applying main filters...")
  }

  const resetDetailFilters = () => {
    setDetailStartTime("")
    setDetailUserId("")
    setDetailCbsName("")
    setDetailIpAddress("")
  }

  const forceDisconnectUser = (userId: string, cbsName: string) => {
    console.log(`Force disconnecting ${userId} from ${cbsName}`)
    // Implementation would go here
  }

  const getStatusColor = (status: "normal" | "warning" | "critical") => {
    switch (status) {
      case "critical":
        return "border-red-500 shadow-red-500/50 bg-red-500/10"
      case "warning":
        return "border-yellow-500 shadow-yellow-500/50 bg-yellow-500/10"
      default:
        return "border-green-500 shadow-green-500/50 bg-green-500/10"
    }
  }

  const getConnectionColor = (fromUser: string, toCBS: string) => {
    const user = userNodes.find((u) => u.id === fromUser)
    if (!user) return "stroke-gray-400"

    switch (user.status) {
      case "critical":
        return "stroke-red-500"
      case "warning":
        return "stroke-yellow-500"
      default:
        return "stroke-green-500"
    }
  }

  const getUserStatusColor = (userId: string) => {
    const user = userNodes.find((u) => u.id === userId)
    if (!user) return "fill-gray-400 stroke-gray-400"

    switch (user.status) {
      case "critical":
        return "fill-red-500 stroke-red-400"
      case "warning":
        return "fill-yellow-500 stroke-yellow-400"
      default:
        return "fill-green-500 stroke-green-400"
    }
  }

  const filteredConnectionData = connectionData.filter((item) => {
    if (detailStartTime && !item.connectTime.includes(detailStartTime)) return false
    if (detailUserId && item.userId !== detailUserId) return false
    if (detailCbsName && !item.cbsName.toLowerCase().includes(detailCbsName.toLowerCase())) return false
    if (detailIpAddress && !item.cbsIp.includes(detailIpAddress)) return false
    return true
  })

  const getConnectedUsers = (cbsId: string) => {
    return userNodes.filter((user) => user.connections.some((conn) => conn.cbsName === cbsId)).map((user) => user.id)
  }

  const [connectionDataState, setConnectionDataState] = React.useState(connectionData)

  React.useEffect(() => {
    setConnectionDataState(connectionData)
  })

  const handleConnectionWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Additional scroll prevention
    if (e.currentTarget) {
      e.currentTarget.style.touchAction = "none"
    }

    const delta = e.deltaY > 0 ? -0.1 : 0.1
    setConnectionZoom((prev) => {
      const newZoom = prev + delta
      return Math.max(0.5, Math.min(1.5, newZoom))
    })
  }

  const fitConnectionToView = () => {
    const maxNodes = Math.max(userNodes.length, cbsNodes.length)
    const requiredHeight = maxNodes * 90 + 120 // Node spacing + padding
    const requiredWidth = 800 // Approximate width needed for user nodes + CBS nodes + connections

    // Use actual container dimensions with some padding
    const availableHeight = 600 // Increased from 500 for better visibility
    const availableWidth = 1000 // Approximate container width

    // Calculate zoom based on both dimensions
    const heightZoom = availableHeight / requiredHeight
    const widthZoom = availableWidth / requiredWidth

    // Use the smaller zoom to ensure everything fits, but with a higher minimum
    const optimalZoom = Math.min(heightZoom, widthZoom)
    setConnectionZoom(Math.max(0.8, Math.min(1.2, optimalZoom))) // Increased min from 0.5 to 0.8
  }

  return (
    <div className="w-full h-full p-4 md:p-6 overflow-y-auto bg-background text-foreground">
      <div className="max-w-7xl mx-auto">
        <Button
          onClick={() => router.push(`/?ship=${params.shipId}`)}
          variant="outline"
          className="mb-4 bg-transparent"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Ship Detail
        </Button>

        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Detailed Connection Information</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Remote Access System for: <span className="font-semibold">{params.shipId}</span>
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filter (All Connection Targets)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Initial Connection Time (Start)</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal text-xs",
                        !startDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "MM/dd") : "Select"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Initial Connection Time (End)</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal text-xs",
                        !endDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "MM/dd") : "Select"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">User ID (All)</label>
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    {userIds.map((userId) => (
                      <SelectItem key={userId} value={userId}>
                        {userId}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Duration (min+)</label>
                <Input
                  type="number"
                  placeholder="Minutes"
                  value={minDuration}
                  onChange={(e) => setMinDuration(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Sent Bytes</label>
                <Input
                  type="number"
                  placeholder="MB"
                  value={minSentBytes}
                  onChange={(e) => setMinSentBytes(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Received Bytes</label>
                <Input
                  type="number"
                  placeholder="MB"
                  value={minReceivedBytes}
                  onChange={(e) => setMinReceivedBytes(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button onClick={resetMainFilters} variant="destructive" size="sm">
                Reset Filter
              </Button>
              <Button
                onClick={applyMainFilters}
                variant="default"
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                Apply Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                Connection Status (Unique CBS: {cbsNodes.length})
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setConnectionZoom(Math.max(0.5, connectionZoom - 0.1))}
                  className="h-8 w-8 p-0"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setConnectionZoom(Math.min(1.5, connectionZoom + 0.1))}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fitConnectionToView}
                  className="h-8 px-3 text-xs bg-transparent"
                >
                  1:1
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="relative w-full h-[600px] bg-card border rounded-lg p-4 overflow-hidden"
              onWheel={handleConnectionWheel}
              style={{ touchAction: "none", userSelect: "none" }}
            >
              <svg
                width="100%"
                height="100%"
                className="absolute inset-0"
                style={{
                  transform: `scale(${connectionZoom})`,
                  transformOrigin: "center center",
                  willChange: "transform",
                }}
                viewBox={`0 0 1000 ${Math.max(600, userNodes.length * 90 + 120)}`}
              >
                {/* Connection lines */}
                {userNodes.map((user) =>
                  user.connections.map((conn) => {
                    const cbs = cbsNodes.find((c) => c.name === conn.cbsName)
                    if (!cbs) return null

                    const userIndex = userNodes.findIndex((u) => u.id === user.id)
                    const cbsIndex = cbsNodes.findIndex((c) => c.id === cbs.id)

                    const userX = 150
                    const userY = 60 + userIndex * 90

                    const cbsX = 700
                    const cbsY = 60 + cbsIndex * 90

                    const isHighlighted =
                      highlightedUser === user.id ||
                      highlightedUser === cbs.id ||
                      (hoveredCBS === cbs.id && getConnectedUsers(cbs.id).includes(user.id))

                    return (
                      <line
                        key={`${user.id}-${cbs.id}`}
                        x1={userX + 35}
                        y1={userY}
                        x2={cbsX - 65}
                        y2={cbsY}
                        className={`${getConnectionColor(user.id, cbs.id)} transition-all duration-300`}
                        strokeWidth={isHighlighted ? 4 : 2}
                        opacity={isHighlighted ? 1 : 0.7}
                      />
                    )
                  }),
                )}

                {/* User nodes */}
                {userNodes.map((user, index) => {
                  const x = 150
                  const y = 60 + index * 90
                  const isHighlighted =
                    highlightedUser === user.id || (hoveredCBS && getConnectedUsers(hoveredCBS).includes(user.id))
                  const isDimmed = hoveredCBS && !getConnectedUsers(hoveredCBS).includes(user.id)

                  return (
                    <g key={user.id}>
                      <circle
                        cx={x}
                        cy={y}
                        r={35}
                        className={`${getUserStatusColor(user.id)} cursor-pointer transition-all duration-300 ${
                          isHighlighted ? "ring-4 ring-white/50" : ""
                        }`}
                        style={{ opacity: isDimmed ? 0.3 : 1 }}
                        onClick={() => setSelectedUserModal(user)}
                      />
                      <text
                        x={x}
                        y={y - 5}
                        textAnchor="middle"
                        className="text-sm font-semibold fill-gray-800 pointer-events-none"
                        style={{ opacity: isDimmed ? 0.3 : 1 }}
                      >
                        {user.name}
                      </text>
                      <text
                        x={x}
                        y={y + 10}
                        textAnchor="middle"
                        className="text-sm font-medium fill-gray-600 pointer-events-none"
                        style={{ opacity: isDimmed ? 0.3 : 1 }}
                      >
                        ({user.cbsCount} CBS)
                      </text>
                    </g>
                  )
                })}

                {/* CBS nodes */}
                {cbsNodes.map((cbs, index) => {
                  const x = 700
                  const y = 60 + index * 90
                  const isHighlighted = highlightedUser === cbs.id || hoveredCBS === cbs.id
                  const isDimmed = hoveredCBS && hoveredCBS !== cbs.id

                  return (
                    <g key={cbs.id}>
                      {isDimmed && (
                        <rect
                          x={x - 70}
                          y={y - 22}
                          width="140"
                          height="44"
                          rx="5"
                          className="fill-none stroke-blue-400 stroke-2 animate-pulse"
                          opacity="0.8"
                        />
                      )}
                      <rect
                        x={x - 65}
                        y={y - 20}
                        width="130"
                        height="40"
                        rx="5"
                        className={`cursor-pointer transition-all duration-300 ${
                          cbs.status === "critical"
                            ? "fill-red-500/20 stroke-red-400 stroke-2"
                            : cbs.status === "warning"
                              ? "fill-yellow-500/20 stroke-yellow-400 stroke-2"
                              : "fill-green-500/20 stroke-green-400 stroke-2"
                        } ${isHighlighted ? "brightness-150" : ""}`}
                        style={{ opacity: isDimmed ? 0.3 : 1 }}
                        onClick={() => setSelectedCBSModal(cbs)}
                        onMouseEnter={() => setHoveredCBS(cbs.id)}
                        onMouseLeave={() => setHoveredCBS(null)}
                      />
                      <text
                        x={x}
                        y={y - 5}
                        textAnchor="middle"
                        className="text-sm font-semibold fill-foreground pointer-events-none"
                        style={{ opacity: isDimmed ? 0.3 : 1 }}
                      >
                        {cbs.name}
                      </text>
                      <text
                        x={x}
                        y={y + 10}
                        textAnchor="middle"
                        className="text-sm font-medium fill-muted-foreground pointer-events-none"
                        style={{ opacity: isDimmed ? 0.3 : 1 }}
                      >
                        ({cbs.userCount})
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Connection Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="space-y-2 relative">
                <label className="text-sm font-medium">Initial Connection Time</label>
                <div
                  className="border rounded-md px-3 py-2 text-xs cursor-pointer hover:bg-muted/50"
                  onClick={() => setShowDatePicker(!showDatePicker)}
                >
                  {selectedDate
                    ? `${selectedDate.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })} ${selectedTime}`
                    : "Select date and time..."}
                </div>
                {showDatePicker && (
                  <div className="absolute top-full left-0 z-50 bg-background border rounded-lg shadow-lg p-4 mt-1">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Select Date</label>
                        <input
                          type="date"
                          value={selectedDate ? selectedDate.toISOString().split("T")[0] : ""}
                          onChange={(e) => {
                            if (e.target.value) {
                              setSelectedDate(new Date(e.target.value))
                            }
                          }}
                          className="w-full border rounded px-2 py-1 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Select Time</label>
                        <input
                          type="time"
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          className="w-full border rounded px-2 py-1 text-xs"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            if (selectedDate) {
                              setDetailStartTime(
                                `${selectedDate.toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                })} ${selectedTime}`,
                              )
                            }
                            setShowDatePicker(false)
                          }}
                          size="sm"
                          className="text-xs"
                        >
                          Apply
                        </Button>
                        <Button
                          onClick={() => setShowDatePicker(false)}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">User ID</label>
                <Input
                  placeholder="User ID selection..."
                  value={detailUserId}
                  onChange={(e) => setDetailUserId(e.target.value)}
                  className="text-xs"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">CBS Name</label>
                <Input
                  placeholder="CBS name selection..."
                  value={detailCbsName}
                  onChange={(e) => setDetailCbsName(e.target.value)}
                  className="text-xs"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">IP Address</label>
                <Input
                  placeholder="IP address search..."
                  value={detailIpAddress}
                  onChange={(e) => setDetailIpAddress(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>
            <div className="flex justify-end mb-4">
              <Button onClick={resetDetailFilters} variant="outline" size="sm">
                Reset Table Filter
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Initial Connection Time</th>
                    <th className="text-left p-2">User ID</th>
                    <th className="text-left p-2">CBS Name</th>
                    <th className="text-left p-2">IP Address</th>
                    <th className="text-left p-2">Connection Duration (min)</th>
                    <th className="text-left p-2">Sent Bytes</th>
                    <th className="text-left p-2">Received Bytes</th>
                    <th className="text-left p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {connectionDataState.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="p-2 text-xs">{item.connectTime}</td>
                      <td className="p-2 text-xs">{item.userId}</td>
                      <td className="p-2 text-xs">{item.cbsName}</td>
                      <td className="p-2 text-xs">{item.cbsIp}</td>
                      <td className="p-2 text-xs">{item.duration}</td>
                      <td className="p-2 text-xs">{(item.sentBytes / 1000).toFixed(2)} MB</td>
                      <td className="p-2 text-xs">{(item.receivedBytes / 1000).toFixed(2)} MB</td>
                      <td className="p-2">
                        <Button
                          onClick={() => {
                            const updatedData = connectionDataState.filter((_, i) => i !== index)
                            setConnectionDataState(updatedData)
                            console.log(`Disconnected user ${item.userId} from ${item.cbsName}`)
                          }}
                          variant="destructive"
                          size="sm"
                          className="text-xs"
                        >
                          Disconnect
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {selectedUserModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background border rounded-lg p-4 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">User: {selectedUserModal.name} (Connected CBS List)</h3>
                <Button
                  onClick={() => {
                    setSelectedUserModal(null)
                    setHighlightedUser(null)
                  }}
                  variant="ghost"
                  size="sm"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">CBS Name</th>
                      <th className="text-left p-2">CBS IP Address</th>
                      <th className="text-left p-2">Connection Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedUserModal.connections.map((conn, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">{conn.cbsName}</td>
                        <td className="p-2">{conn.cbsIp}</td>
                        <td className="p-2">{conn.connectTime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {selectedCBSModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background border rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">CBS: {selectedCBSModal.name} - Connected User Details</h3>
                <Button
                  onClick={() => {
                    setSelectedCBSModal(null)
                    setHighlightedUser(null)
                  }}
                  variant="ghost"
                  size="sm"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">User(s)</th>
                      <th className="text-left p-3">Initial Connection</th>
                      <th className="text-left p-3">Duration (min)</th>
                      <th className="text-left p-3">Connection IP</th>
                      <th className="text-left p-3">Sent (MB)</th>
                      <th className="text-left p-3">Received (MB)</th>
                      <th className="text-left p-3">Connection Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCBSModal.users.map((user, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-3">{user.userId}</td>
                        <td className="p-3">{user.connectTime}</td>
                        <td className="p-3">{user.duration}</td>
                        <td className="p-3">{user.ip}</td>
                        <td className="p-3">{user.sentMB}</td>
                        <td className="p-3">{user.receivedMB}</td>
                        <td className="p-3">{user.connectionCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
