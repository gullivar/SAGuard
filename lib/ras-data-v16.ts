export interface CbsV16 {
  id: string
  name: string
  ip: string
  location: string
  status: "online" | "offline" | "maintenance"
  lastSeen: Date
  connectionCount: number
}

export interface ConnectionV16 {
  connId: string
  connTime: Date
  userId: string
  cbsId: string
  duration: number // in minutes
  sentBytes: number
  receivedBytes: number
  connectionType: "VPN" | "Direct" | "Satellite"
  priority: "High" | "Medium" | "Low"
  status: "Active" | "Idle" | "Disconnected"
  sessionId: string
  bandwidth: number // in Mbps
}

export interface UserV16 {
  id: string
  name: string
  role: "Captain" | "Engineer" | "Navigator" | "Operator"
  department: string
  lastLogin: Date
  activeConnections: number
}

// Version16 Mock Data Generator
export const generateV16MockData = () => {
  const users: UserV16[] = [
    {
      id: "User_A",
      name: "김선장",
      role: "Captain",
      department: "Bridge",
      lastLogin: new Date(Date.now() - Math.random() * 2 * 60 * 60 * 1000),
      activeConnections: 3,
    },
    {
      id: "User_F",
      name: "이기관장",
      role: "Engineer",
      department: "Engine Room",
      lastLogin: new Date(Date.now() - Math.random() * 4 * 60 * 60 * 1000),
      activeConnections: 1,
    },
    {
      id: "User_L",
      name: "박항해사",
      role: "Navigator",
      department: "Bridge",
      lastLogin: new Date(Date.now() - Math.random() * 1 * 60 * 60 * 1000),
      activeConnections: 2,
    },
    {
      id: "User_O",
      name: "최운항사",
      role: "Operator",
      department: "Control Room",
      lastLogin: new Date(Date.now() - Math.random() * 3 * 60 * 60 * 1000),
      activeConnections: 4,
    },
  ]

  const cbs: CbsV16[] = [
    {
      id: "cbs-0",
      name: "Stabilizer",
      ip: "10.1.1.1",
      location: "Engine Room",
      status: "online",
      lastSeen: new Date(),
      connectionCount: 2,
    },
    {
      id: "cbs-1",
      name: "NaviSys-Prime",
      ip: "192.168.1.101",
      location: "Bridge",
      status: "online",
      lastSeen: new Date(),
      connectionCount: 3,
    },
    {
      id: "cbs-2",
      name: "WeatherMon-X",
      ip: "10.0.5.20",
      location: "Bridge",
      status: "maintenance",
      lastSeen: new Date(Date.now() - 30 * 60 * 1000),
      connectionCount: 1,
    },
    {
      id: "cbs-3",
      name: "DataLogger-Pro",
      ip: "192.168.1.5",
      location: "Control Room",
      status: "online",
      lastSeen: new Date(),
      connectionCount: 4,
    },
    {
      id: "cbs-4",
      name: "BallastCtrl-G2",
      ip: "172.16.30.12",
      location: "Engine Room",
      status: "offline",
      lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
      connectionCount: 0,
    },
    {
      id: "cbs-5",
      name: "EngineCtrl-MK3",
      ip: "192.168.2.53",
      location: "Engine Room",
      status: "online",
      lastSeen: new Date(),
      connectionCount: 2,
    },
    {
      id: "cbs-6",
      name: "CargoMon-Plus",
      ip: "192.168.1.106",
      location: "Cargo Hold",
      status: "online",
      lastSeen: new Date(),
      connectionCount: 1,
    },
    {
      id: "cbs-7",
      name: "Comms-Sat-1",
      ip: "10.10.10.2",
      location: "Communication Room",
      status: "online",
      lastSeen: new Date(),
      connectionCount: 3,
    },
  ]

  const connections: ConnectionV16[] = []

  // Generate realistic connections based on user roles and CBS systems
  const connectionMappings = [
    { userId: "User_A", cbsIds: ["cbs-1", "cbs-2", "cbs-7"], type: "VPN" as const, priority: "High" as const },
    { userId: "User_F", cbsIds: ["cbs-0", "cbs-4", "cbs-5"], type: "Direct" as const, priority: "High" as const },
    { userId: "User_L", cbsIds: ["cbs-1", "cbs-2"], type: "VPN" as const, priority: "Medium" as const },
    {
      userId: "User_O",
      cbsIds: ["cbs-3", "cbs-6", "cbs-7", "cbs-1"],
      type: "Satellite" as const,
      priority: "Medium" as const,
    },
  ]

  connectionMappings.forEach((mapping, index) => {
    mapping.cbsIds.forEach((cbsId, cbsIndex) => {
      const baseTime = Date.now() - Math.random() * 8 * 60 * 60 * 1000
      connections.push({
        connId: `conn-v16-${index}-${cbsIndex}`,
        userId: mapping.userId,
        cbsId: cbsId,
        connTime: new Date(baseTime),
        duration: Math.floor(Math.random() * 240) + 15, // 15 to 255 minutes
        sentBytes: Math.floor(Math.random() * 1024 * 1024 * 800), // up to 800MB
        receivedBytes: Math.floor(Math.random() * 1024 * 1024 * 200), // up to 200MB
        connectionType: mapping.type,
        priority: mapping.priority,
        status: Math.random() > 0.1 ? "Active" : Math.random() > 0.5 ? "Idle" : "Disconnected",
        sessionId: `sess-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        bandwidth: Number((Math.random() * 100 + 10).toFixed(2)), // 10-110 Mbps
      })
    })
  })

  return { users, cbs, connections }
}

export const formatBytesV16 = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}
