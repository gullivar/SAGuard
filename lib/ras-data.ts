export interface Cbs {
  id: string
  name: string
  ip: string
}

export interface Connection {
  connId: string
  connTime: Date
  userId: string
  cbsId: string
  duration: number // in minutes
  sentBytes: number
  receivedBytes: number
}

const USERS = ["User_A", "User_B", "User_C", "User_D", "User_E", "User_F", "User_G", "User_H", "User_I", "User_J"]
const CBS_SYSTEMS: Omit<Cbs, "id">[] = [
  { name: "NaviSys-Prime", ip: "192.168.1.101" },
  { name: "WeatherMon-X", ip: "10.0.5.20" },
  { name: "DataLogger-Pro", ip: "192.168.1.5" },
  { name: "BallastCtrl-G2", ip: "172.16.30.12" },
  { name: "EngineCtrl-MK3", ip: "192.168.2.53" },
  { name: "CargoMon-Plus", ip: "192.168.1.106" },
  { name: "Comms-Sat-1", ip: "10.10.10.2" },
  { name: "Firewall-Main", ip: "192.168.0.1" },
]

export const generateMockData = () => {
  const users = USERS
  const cbs = CBS_SYSTEMS.map((c, i) => ({ ...c, id: `cbs-${i}` }))

  const connections: Connection[] = []
  for (let i = 0; i < 75; i++) {
    const user = users[Math.floor(Math.random() * users.length)]
    const cbsSystem = cbs[Math.floor(Math.random() * cbs.length)]
    connections.push({
      connId: `conn-${i}`,
      userId: user,
      cbsId: cbsSystem.id,
      connTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // last 7 days
      duration: Math.floor(Math.random() * 180) + 5, // 5 to 185 mins
      sentBytes: Math.floor(Math.random() * 1024 * 1024 * 500), // up to 500MB
      receivedBytes: Math.floor(Math.random() * 1024 * 1024 * 100), // up to 100MB
    })
  }

  return { users, cbs, connections }
}

export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}
