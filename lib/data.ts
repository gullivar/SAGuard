export interface Asset {
  assetId: string
  function: string
  systemSuC: string
  systemSupplier: string
  hwOriginatorSupplier?: string
  typeComponentModelNo: string
  hwType: string
  location: string
  os?: string
  ipAddress?: string
  subnetMask?: string
  description?: string
  remarks?: string
  cpuUsage?: number
  memoryUsage?: number
  diskUsage?: number
  resourceHistory?: {
    cpu: number[]
    memory: number[]
    disk: number[]
  }
  connections?: string[]
  // New fields for enhanced asset management
  system: string
  manufacturer: string
  model: string
  software: SoftwareInfo[]
}

export interface SoftwareInfo {
  swName: string
  swType: string
  version: string
  function: string
}

export interface ChangeLog {
  logId: string
  timestamp: string
  targetType: "HW" | "SW"
  assetId: string
  targetName: string
  changeComponent: string
  changeType: "Added" | "Changed" | "Deleted" | "Updated"
  valueBefore: string | null
  valueAfter: string | null
}

export interface DetectionEvent {
  id: string
  detectionTime: string
  shipName: string
  detectionRule: string
  severityLevel: "Critical" | "High" | "Medium" | "Low"
  sourceDevice: string
  eventCategory: string
  affectedAsset: string
  ruleTriggerCount: number
  investigationStatus: "New" | "In Progress" | "Resolved" | "False Positive"
  rawDataReference: string
  elasticRuleId: string
  description: string
<<<<<<< HEAD
  actionStatus: "Not started" | "In progress" | "Completed"
=======
>>>>>>> 635fb68316ea188d00a1ccbf846d7710502b0e5a
}

export interface Ship {
  id: string
  name: string
  lat: number
  lon: number
  status: string
  comms: string
  infra: {
    cpu: number
    memory: number
    network: number
    status: string
  }
  security: {
    critical: number
    warning: number
    notice: number
    status: string
  }
  securityEvents: any[]
  assets?: Asset[]
  changeLog?: ChangeLog[]
}

export interface ResourceData {
  id: string
  timestamp: string
  shipName: string
  dataCategory: string
  equipmentType: string
  targetDevice: string
  collectionChannel: string
  collectionInterval: string
  resourceType?: string
  logType?: string
  value: string
  eventDetails: string
}

const SHIP_COUNT = 15
const shipTypes = {
  container: { name: "Container Ship" },
  lng_tanker: { name: "LNG Tanker" },
  oil_tanker: { name: "Oil Tanker" },
  bulk_carrier: { name: "Bulk Carrier" },
  drillship: { name: "Drillship" },
}

const regions = {
  malacca_strait: { latMin: 1.5, latMax: 5.5, lonMin: 100, lonMax: 103.5 },
  suez_canal: { latMin: 29.5, latMax: 31.5, lonMin: 32.2, lonMax: 32.7 },
  panama_canal: { latMin: 8.5, latMax: 9.8, lonMin: -79.9, lonMax: -79.4 },
  gibraltar_strait: { latMin: 35.8, latMax: 36.2, lonMin: -5.8, lonMax: -5.2 },
  english_channel: { latMin: 49.5, latMax: 50.8, lonMin: -1.5, lonMax: 1.5 },
  north_sea: { latMin: 52, latMax: 58, lonMin: 1, lonMax: 7 },
  south_china_sea: { latMin: 8, latMax: 18, lonMin: 110, lonMax: 117 },
  us_east_coast: { latMin: 30, latMax: 40, lonMin: -75, lonMax: -70 },
  us_west_coast: { latMin: 33, latMax: 45, lonMin: -128, lonMax: -123 },
  north_atlantic: { latMin: 40, latMax: 50, lonMin: -45, lonMax: -20 },
}

const getRandomElement = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)]
const getRandomCoordInRegion = (region: { latMin: number; latMax: number; lonMin: number; lonMax: number }) => {
  const lat = Math.random() * (region.latMax - region.latMin) + region.latMin
  const lon = Math.random() * (region.lonMax - region.lonMin) + region.lonMin
  return { lat: Number.parseFloat(lat.toFixed(4)), lon: Number.parseFloat(lon.toFixed(4)) }
}

const generateStatusAndData = () => {
  const rand = Math.random()
  let infraStatus = "OK",
    securityStatus = "OK",
    commsStatus = "OK"
  let cpu = 20,
    memory = 30,
    network = 5,
    secCrit = 0,
    secWarn = 0,
    secNotice = 1

  if (rand < 0.03) {
    // Critical
    infraStatus = "Critical"
    cpu = 85 + Math.random() * 15
    memory = 88 + Math.random() * 12
    secCrit = Math.floor(1 + Math.random() * 2)
  } else if (rand < 0.06) {
    // High Risk
    securityStatus = "High Risk"
    secCrit = Math.floor(1 + Math.random() * 3)
    secWarn = Math.floor(2 + Math.random() * 5)
  } else if (rand < 0.1) {
    // Disconnected
    commsStatus = "Disconnected"
    infraStatus = "Unknown"
    securityStatus = "Unknown"
    cpu = -1
    memory = -1
    network = -1
    secCrit = -1
    secWarn = -1
    secNotice = -1
  } else if (rand < 0.18) {
    // Warning
    if (Math.random() > 0.5) {
      infraStatus = "Warning"
      cpu = 70 + Math.random() * 15
    } else {
      securityStatus = "Warning"
      secWarn = Math.floor(2 + Math.random() * 8)
    }
  } else if (rand < 0.25) {
    // Low Bandwidth
    commsStatus = "Low Bandwidth"
    network = 0.5 + Math.random() * 0.5
  } else {
    // OK
    cpu = 10 + Math.random() * 25
    memory = 20 + Math.random() * 30
    network = 3 + Math.random() * 7
    secNotice = Math.floor(1 + Math.random() * 5)
  }
  return { infraStatus, securityStatus, commsStatus, cpu, memory, network, secCrit, secWarn, secNotice }
}

export function generateShipData(): Ship[] {
  const ships: Ship[] = []
  const typeKeys = Object.keys(shipTypes)
  const regionKeys = Object.keys(regions)

  for (let i = 0; i < SHIP_COUNT; i++) {
    const shipId = `SHIP${String(i + 1).padStart(3, "0")}`
    const randomTypeKey = getRandomElement(typeKeys) as keyof typeof shipTypes
    const randomRegionKey = getRandomElement(regionKeys) as keyof typeof regions
    const { lat, lon } = getRandomCoordInRegion(regions[randomRegionKey])
    const { infraStatus, securityStatus, commsStatus, cpu, memory, network, secCrit, secWarn, secNotice } =
      generateStatusAndData()

    const securityEvents: any[] = []
    const numEvents = 30 + Math.floor(Math.random() * 50)
    const eventTypes = ["Infra", "Security", "Network", "Application"]
    const severities = ["critical", "warning", "notice"]
<<<<<<< HEAD
    const actionStatuses = ["Not started", "In progress", "Completed"]
=======
>>>>>>> 635fb68316ea188d00a1ccbf846d7710502b0e5a

    for (let j = 0; j < numEvents; j++) {
      const severity = getRandomElement(severities)
      securityEvents.push({
        timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        type: getRandomElement(eventTypes),
        cbsName: `System ${String.fromCharCode(88 + (j % 3))}`,
        ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        severity: severity,
        eventName: `${severity.charAt(0).toUpperCase() + severity.slice(1)} Event ${j}`,
        details: `Details for event number ${j}. This is a mock description of what happened.`,
<<<<<<< HEAD
        actionStatus: getRandomElement(actionStatuses),
=======
>>>>>>> 635fb68316ea188d00a1ccbf846d7710502b0e5a
      })
    }

    ships.push({
      id: shipId,
      name: `${shipTypes[randomTypeKey].name} #${Number.parseInt(shipId.replace("SHIP", ""))}`,
      lat,
      lon,
      status: commsStatus === "Disconnected" ? "Unknown" : "Operational",
      comms: commsStatus,
      infra: { cpu, memory, network, status: infraStatus },
      security: { critical: secCrit, warning: secWarn, notice: secNotice, status: securityStatus },
      securityEvents: securityEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    })
  }
  return ships
}

export function getOverallStatus(ship: Ship): string {
  if (!ship) return "Unknown"
  if (ship.comms === "Disconnected") return "Disconnected"
  if (ship.security.status === "High Risk" || ship.infra.status === "Critical") return "Critical"
  if (ship.security.status === "Warning" || ship.infra.status === "Warning") return "Warning"
  if (ship.comms === "Low Bandwidth") return "Low Bandwidth"
  return "OK"
}

const generateResourceHistory = (baseVal: number, numPoints = 144): number[] => {
  const history = []
  let currentValue = baseVal
  for (let i = 0; i < numPoints; i++) {
    const fluctuation = (Math.random() - 0.5) * 10
    currentValue += fluctuation
    currentValue = Math.max(0, Math.min(100, currentValue))
    history.push(Number.parseFloat(currentValue.toFixed(1)))
  }
  return history
}

export function generateDetailedShipData(ship: Ship): Ship {
  const assets: Asset[] = []
  const numAssets = 3
  const assetTypes = ["Firewall", "Switch", "Router", "Server", "PC", "Camera", "PLC", "Sensor"]

  // Enhanced data for realistic asset management
  const systems = ["ICMS", "BMS", "Navi. System", "Engine Control", "Safety System", "Communication"]
  const manufacturers = ["Lenovo", "Fortinet", "JRC", "Cisco", "HP", "Dell", "Siemens", "ABB"]
  const locations = ["W/H(2)", "D Deck", "ECR", "Bridge", "Engine Room", "Control Room"]

  for (let i = 0; i < numAssets; i++) {
    const hwType = getRandomElement(assetTypes)
    const manufacturer = getRandomElement(manufacturers)
    const system = getRandomElement(systems)
    const cpuUsage = 10 + Math.random() * 80
    const memoryUsage = 15 + Math.random() * 80
    const diskUsage = 20 + Math.random() * 75

    // Generate realistic software based on hardware type
    const software: SoftwareInfo[] = []
    if (hwType === "Firewall") {
      software.push(
        {
          swName: "FortiOS",
          swType: "Operating System",
          version: "7.2.4",
          function: "Network Security OS",
        },
        {
          swName: "UTM Engine",
          swType: "Security Software",
          version: "2.1.0",
          function: "Unified Threat Management",
        },
      )
    } else if (hwType === "Server") {
      software.push(
        {
          swName: "Windows Server",
          swType: "Operating System",
          version: "2022",
          function: "Server OS",
        },
        {
          swName: "Antivirus",
          swType: "Security Software",
          version: "12.5.1",
          function: "Malware Protection",
        },
      )
    } else {
      software.push({
        swName: "Proprietary OS",
        swType: "Operating System",
        version: "1.0",
        function: "Device Control",
      })
    }

    assets.push({
      assetId: `${ship.id}-ASSET-${String(i + 1).padStart(3, "0")}`,
      function: `Function ${String.fromCharCode(65 + (i % 5))}`,
      systemSuC: `System ${String.fromCharCode(88 + (i % 3))}`,
      systemSupplier: getRandomElement(["Supplier A", "Supplier B", "Supplier C"]),
      typeComponentModelNo: `${hwType}-${Math.floor(1000 + Math.random() * 9000)}`,
      hwType: hwType,
      location: getRandomElement(["Bridge", "Engine Room", "Deck", "Control Room"]),
      ipAddress: `192.168.${i % 10}.${100 + i}`,
      cpuUsage,
      memoryUsage,
      diskUsage,
      resourceHistory: {
        cpu: generateResourceHistory(cpuUsage),
        memory: generateResourceHistory(memoryUsage),
        disk: generateResourceHistory(diskUsage),
      },
      // New enhanced fields
      system: system,
      manufacturer: manufacturer,
      model: `${manufacturer.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      software: software,
    })
  }

  // Generate connections between assets
  assets.forEach((asset) => {
    asset.connections = []
    const numConnections = 1 + Math.floor(Math.random() * 3)
    for (let i = 0; i < numConnections; i++) {
      const targetAsset = getRandomElement(assets)
      if (targetAsset.assetId !== asset.assetId && !asset.connections.includes(targetAsset.assetId)) {
        asset.connections.push(targetAsset.assetId)
      }
    }
  })

  const changeLog: ChangeLog[] = []
  const numLogs = 5
  const changeTypes: ChangeLog["changeType"][] = ["Added", "Changed", "Deleted", "Updated"]

  for (let i = 0; i < numLogs; i++) {
    const changeType = getRandomElement(changeTypes)
    const randomAsset = getRandomElement(assets)

    changeLog.push({
      logId: `log-${ship.id}-${i}`,
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      targetType: randomAsset.hwType === "Firewall" || randomAsset.hwType === "Router" ? "HW" : "SW",
      assetId: randomAsset.assetId,
      targetName:
        randomAsset.hwType === "Firewall" || randomAsset.hwType === "Router"
          ? randomAsset.typeComponentModelNo
          : `Software-${String.fromCharCode(65 + (i % 10))}`,
      changeComponent:
        randomAsset.hwType === "Firewall" || randomAsset.hwType === "Router"
          ? getRandomElement(["CPU", "RAM", "Disk"])
          : getRandomElement(["Kernel", "Driver", "UI"]),
      changeType: changeType,
      valueBefore: changeType === "Added" ? null : `v1.${i % 5}.0`,
      valueAfter: changeType === "Deleted" ? null : `v1.${(i % 5) + 1}.0`,
    })
  }

  return {
    ...ship,
    assets,
    changeLog: changeLog.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
  }
}

export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}

export const recommendationsData = {
  critical: [
    "Immediately isolate the affected system from the network to prevent lateral movement.",
    "Investigate the root cause of the critical alert. Check firewall logs, IDS/IPS alerts, and system logs on the affected device.",
    "Apply emergency patches if a known vulnerability was exploited.",
    "Initiate incident response protocol and notify the security officer.",
  ],
  warning: [
    "Review the warning event to understand its context. This may be an early indicator of a larger attack.",
    "Increase monitoring on the affected asset and related network segments.",
    "Check for misconfigurations or policy violations that may have triggered the warning.",
    "Ensure all relevant software and systems are up-to-date with the latest security patches.",
  ],
  notice: [
    "Acknowledge the notice and document the event in the ship's log.",
    "Review the event to ensure it aligns with expected system behavior.",
    "Use this information for periodic security audits and to fine-tune monitoring rules.",
    "No immediate action required, but monitor for recurring notices which may indicate an underlying issue.",
  ],
}

export function generateResourceData(): ResourceData[] {
  const resourceData: ResourceData[] = []
  const ships = generateShipData()

  const dataCategories = [
    "Resource Usage",
    "Security Events",
    "Network Events",
    "Security Detection Events",
    "Hardware Installation Info",
    "Software Installation Info",
    "Audit Log",
    "System Logs",
  ]

  const equipmentTypes = ["Security (FortiGate)", "Network Switch", "CBS Windows", "CBS Linux"]

  const collectionChannels = [
    "SNMP v2c trap",
    "syslog",
    "metricbeat",
    "filebeat (osquery)",
    "winlogbeat (osquery)",
    "auditbeat",
  ]

  const collectionIntervals = ["10 seconds", "Daily", "Real-time"]

  const resourceTypes = ["CPU", "Memory", "Disk", "Network"]

  const linuxAuditLogTypes = [
    "USER_AUTH",
    "USER_LOGIN",
    "USER_ACCT",
    "EXECVE",
    "CONNECT",
    "SYSCALL",
    "CONFIG_CHANGE",
    "SYSTEM_BOOT",
    "DAEMON_START",
    "CRED_REVOKE",
  ]

  const windowsLogTypes = ["Application", "Security", "Setup", "System", "Forwarded Events"]

  const linuxSystemLogTypes = ["/var/log/messages", "/var/log/syslog", "/var/log/auth.log"]

  // Generate 250+ records for last 24 hours
  for (let i = 0; i < 250; i++) {
    const ship = getRandomElement(ships)
    const dataCategory = getRandomElement(dataCategories)
    const equipmentType = getRandomElement(equipmentTypes)

    let collectionChannel = ""
    if (equipmentType === "Security (FortiGate)" || equipmentType === "Network Switch") {
      if (dataCategory === "Resource Usage" || dataCategory === "Security Detection Events") {
        collectionChannel = "SNMP v2c trap"
      } else {
        collectionChannel = "syslog"
      }
    } else if (equipmentType === "CBS Windows") {
      if (dataCategory === "Hardware Installation Info" || dataCategory === "Software Installation Info") {
        collectionChannel = "winlogbeat (osquery)"
      } else if (dataCategory === "Resource Usage") {
        collectionChannel = "metricbeat"
      } else {
        collectionChannel = "winlogbeat"
      }
    } else if (equipmentType === "CBS Linux") {
      if (dataCategory === "Hardware Installation Info" || dataCategory === "Software Installation Info") {
        collectionChannel = "filebeat (osquery)"
      } else if (dataCategory === "Resource Usage") {
        collectionChannel = "metricbeat"
      } else if (dataCategory === "Audit Log") {
        collectionChannel = "auditbeat"
      } else {
        collectionChannel = "filebeat"
      }
    }

    // Determine collection interval based on data category
    let collectionInterval = ""
    if (dataCategory === "Resource Usage") {
      collectionInterval = "10 seconds"
    } else if (dataCategory === "Hardware Installation Info" || dataCategory === "Software Installation Info") {
      collectionInterval = "Daily"
    } else {
      collectionInterval = "Real-time"
    }

    let resourceType = ""
    let logType = ""
    let value = ""
    let eventDetails = ""

    // Generate appropriate data based on category
    if (dataCategory === "Resource Usage") {
      resourceType = getRandomElement(resourceTypes)
      logType = `${resourceType} Usage`
      if (resourceType === "CPU") {
        value = `${(Math.random() * 100).toFixed(1)}%`
        eventDetails = `CPU utilization threshold reached on ${equipmentType}`
      } else if (resourceType === "Memory") {
        value = `${(Math.random() * 100).toFixed(1)}%`
        eventDetails = `Memory usage threshold exceeded on ${equipmentType}`
      } else if (resourceType === "Disk") {
        value = `${(Math.random() * 100).toFixed(1)}%`
        eventDetails = `Disk space threshold warning on ${equipmentType}`
      } else if (resourceType === "Network") {
        value = `${(Math.random() * 1000).toFixed(0)} Mbps`
        eventDetails = `Network bandwidth threshold alert on ${equipmentType}`
      }
    } else if (dataCategory === "Security Events") {
      const eventTypes = ["Firewall Policy", "UTM Detection", "Access Control"]
      logType = getRandomElement(eventTypes)
      value = `Policy ID: ${Math.floor(1000 + Math.random() * 9000)}`
      eventDetails = `${logType} event - Source: 192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}, Action: ${getRandomElement(["Block", "Allow", "Monitor"])}`
    } else if (dataCategory === "Network Events") {
      const eventTypes = ["Port Status", "Device Management"]
      logType = getRandomElement(eventTypes)
      if (logType === "Port Status") {
        value = getRandomElement(["Link Up", "Link Down"])
        eventDetails = `Port ${Math.floor(1 + Math.random() * 24)} status change on ${equipmentType}`
      } else {
        value = getRandomElement(["Config Change", "Login", "Logout"])
        eventDetails = `Device management event on ${equipmentType} - Admin action performed`
      }
    } else if (dataCategory === "Security Detection Events") {
      const eventTypes = ["Intrusion Attempt", "Malware Detection", "Policy Violation", "Anomaly Detection"]
      logType = getRandomElement(eventTypes)
      value = `Alert ID: ${Math.floor(1000 + Math.random() * 9000)}`
      eventDetails = `${logType} detected on ${equipmentType} - Severity: ${getRandomElement(["High", "Medium", "Low"])}`
    } else if (dataCategory === "Audit Log") {
      const logTypes = [
        "USER_AUTH",
        "USER_LOGIN",
        "USER_ACCT",
        "EXECVE",
        "CONNECT",
        "SYSCALL",
        "CONFIG_CHANGE",
        "SYSTEM_BOOT",
        "DAEMON_START",
        "CRED_REVOKE",
      ]
      logType = getRandomElement(logTypes)
      value = `Event ID: ${Math.floor(1000 + Math.random() * 9000)}`
      eventDetails = `Linux audit event: ${logType} - User: ${getRandomElement(["root", "admin", "operator"])}, PID: ${Math.floor(1000 + Math.random() * 9000)}`
    } else if (dataCategory === "System Logs") {
      const logTypes = ["Application", "Security", "Setup", "System", "Forwarded Events"]
      logType = getRandomElement(logTypes)
      value = `Event ID: ${Math.floor(1000 + Math.random() * 9000)}`
      eventDetails = `Windows ${logType} log - Source: ${getRandomElement(["System", "Application", "Service"])}, Level: ${getRandomElement(["Information", "Warning", "Error"])}`
    } else if (dataCategory === "Hardware Installation Info") {
      const changeTypes = ["Installed", "Updated", "Removed", "Modified"]
      const changeType = getRandomElement(changeTypes)
      logType = "Hardware Install"
      value = changeType
      eventDetails = `Hardware component ${changeType.toLowerCase()}: ${getRandomElement(["Network Card", "Memory Module", "Storage Drive", "CPU"])} via osquery`
    } else if (dataCategory === "Software Installation Info") {
      const changeTypes = ["Installed", "Updated", "Removed", "Modified"]
      const changeType = getRandomElement(changeTypes)
      logType = "Software Install"
      value = changeType
      eventDetails = `Software ${changeType.toLowerCase()}: ${getRandomElement(["Antivirus", "OS Update", "Driver", "Application"])} via osquery`
    }

    const timestamp = new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()

    resourceData.push({
      id: `resource-${i + 1}`,
      timestamp,
      shipName: ship.name,
      dataCategory,
      equipmentType,
      targetDevice: `${equipmentType.split(" ")[0]}-${Math.floor(100 + Math.random() * 900)}`,
      collectionChannel,
      collectionInterval,
      resourceType: resourceType || undefined,
      logType: logType || undefined,
      value,
      eventDetails,
    })
  }

  return resourceData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export function generateDetectionEvents(): DetectionEvent[] {
  const detectionEvents: DetectionEvent[] = []
  const ships = generateShipData()

  const elasticSecurityRules = [
    {
      id: "rule-001",
      name: "High CPU Usage Anomaly",
      category: "Resource Usage Anomaly",
      description: "CPU usage exceeding 90% for more than 1 hour",
    },
    {
      id: "rule-002",
      name: "Memory Exhaustion Pattern",
      category: "Resource Usage Anomaly",
      description: "Memory usage consistently above 85% with increasing trend",
    },
    {
      id: "rule-003",
      name: "Suspicious Network Traffic",
      category: "Network Anomaly",
      description: "Unusual outbound connections to unknown destinations",
    },
    {
      id: "rule-004",
      name: "Failed Authentication Attempts",
      category: "Security Breach",
      description: "Multiple failed login attempts from same source",
    },
    {
      id: "rule-005",
      name: "Firewall Policy Violation",
      category: "Security Policy Violation",
      description: "Traffic blocked by firewall policy multiple times",
    },
    {
      id: "rule-006",
      name: "Malware Detection Alert",
      category: "Malware Detection",
      description: "UTM engine detected potential malware activity",
    },
    {
      id: "rule-007",
      name: "Unauthorized Software Installation",
      category: "System Integrity",
      description: "Software installed without proper authorization",
    },
    {
      id: "rule-008",
      name: "Privilege Escalation Attempt",
      category: "Security Breach",
      description: "User attempting to gain elevated privileges",
    },
    {
      id: "rule-009",
      name: "Network Port Scanning",
      category: "Network Anomaly",
      description: "Port scanning activity detected from internal source",
    },
    {
      id: "rule-010",
      name: "System Configuration Change",
      category: "System Integrity",
      description: "Critical system configuration modified unexpectedly",
    },
  ]

  const sourceDeviceTypes = [
    "FortiGate-200E",
    "FortiGate-100F",
    "Cisco-2960X",
    "HP-ProCurve-2920",
    "CBS-CargoControl",
    "CBS-NavigationSystem",
    "CBS-EngineMonitor",
    "CBS-SecuritySystem",
  ]

  const severityLevels: DetectionEvent["severityLevel"][] = ["Critical", "High", "Medium", "Low"]
  const investigationStatuses: DetectionEvent["investigationStatus"][] = [
    "New",
    "In Progress",
    "Resolved",
    "False Positive",
  ]
<<<<<<< HEAD
  const actionStatuses: DetectionEvent["actionStatus"][] = ["Not started", "In progress", "Completed"]
=======
>>>>>>> 635fb68316ea188d00a1ccbf846d7710502b0e5a

  // Generate detection events for last 90 days (more realistic for security monitoring)
  for (let i = 0; i < 50; i++) {
    const ship = getRandomElement(ships)
    const rule = getRandomElement(elasticSecurityRules)
    const sourceDevice = getRandomElement(sourceDeviceTypes)
    const severityLevel = getRandomElement(severityLevels)
    const investigationStatus = getRandomElement(investigationStatuses)
<<<<<<< HEAD
    const actionStatus = getRandomElement(actionStatuses)
=======
>>>>>>> 635fb68316ea188d00a1ccbf846d7710502b0e5a

    // Generate detection time within last 90 days
    const detectionTime = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString()

    // Generate rule trigger count based on severity
    let ruleTriggerCount = 1
    if (severityLevel === "Critical") {
      ruleTriggerCount = Math.floor(5 + Math.random() * 15)
    } else if (severityLevel === "High") {
      ruleTriggerCount = Math.floor(3 + Math.random() * 7)
    } else if (severityLevel === "Medium") {
      ruleTriggerCount = Math.floor(1 + Math.random() * 5)
    }

    detectionEvents.push({
      id: `detection-${i + 1}`,
      detectionTime,
      shipName: ship.name,
      detectionRule: rule.name,
      severityLevel,
      sourceDevice,
      eventCategory: rule.category,
      affectedAsset: `${sourceDevice}-${Math.floor(100 + Math.random() * 900)}`,
      ruleTriggerCount,
      investigationStatus,
      rawDataReference: `resource-${Math.floor(1 + Math.random() * 250)}`,
      elasticRuleId: rule.id,
      description: rule.description,
<<<<<<< HEAD
      actionStatus,
=======
>>>>>>> 635fb68316ea188d00a1ccbf846d7710502b0e5a
    })
  }

  return detectionEvents.sort((a, b) => new Date(b.detectionTime).getTime() - new Date(a.detectionTime).getTime())
}
