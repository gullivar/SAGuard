"use client"

import React from "react"

import { CommandList } from "@/components/ui/command"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Server, RotateCcw, Search, ChevronDown, Check, Eye } from "lucide-react"
import {
  generateShipData,
  generateResourceData,
  type DetectionEvent,
  generateDetectionEvents,
  generateDetailedShipData,
  type Asset,
  type Ship,
} from "@/lib/data"
import type { Ship as ShipType, ResourceData } from "@/lib/data"
import { cn } from "@/lib/utils"
import { MultiSelect } from "@/components/ui/multi-select"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import AssetDetailModalEnhanced from "@/components/ship-detail/asset-detail-modal-enhanced"

import ResourceMonitoring from "@/components/ship-detail/resource-monitoring"
import AssetList from "@/components/ship-detail/asset-list"
import AssetChangeLog from "@/components/ship-detail/asset-change-log"

interface SoftwareInfo {
  swType: string
  swName: string
  brandOriginator: string
  version: string
  function: string
}

interface IExtendedAsset extends Asset {
  shipName?: string
  interfaceInfo: {
    interfaceToOtherSystems: string
    interfaceMethod: string
    remoteOnshoreConn: string
    accessibility: string
    ports: string
    malwareProtection: string
  }
  installedSoftware: Array<{
    swType: string
    swName: string
    brandOriginator: string
    version: string
    function: string
  }>
}

interface AssetFilters {
  function: string
  systemSuC: string
  systemSupplier: string
  hwType: string
  location: string
  os: string
}

export default function DataSearchPage() {
  const [allAssets, setAllAssets] = useState<IExtendedAsset[]>([])
  const [activeTab, setActiveTab] = useState("asset")
  const [ships, setShips] = useState<ShipType[]>([])
  const [selectedShip, setSelectedShip] = useState<ShipType | null>(null)
  const [selectedAsset, setSelectedAsset] = useState<IExtendedAsset | null>(null)
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false)

  const [dropdownStates, setDropdownStates] = useState({
    shipName: false,
    manufacturer: false,
    os: false,
    modelSw: false,
    shipAsset: false,
    hwType: false,
    function: false,
    systemSuC: false,
    dataCategory: false,
    equipmentType: false,
    collectionChannel: false,
    resourceType: false,
    logType: false,
    investigationStatus: false,
  })

  // Asset filters (enhanced for hardware search)
  const [assetFilters, setAssetFilters] = useState<AssetFilters>({
    function: "",
    systemSuC: "",
    systemSupplier: "",
    hwType: "",
    location: "",
    os: "",
  })
  const [filteredAllAssets, setFilteredAllAssets] = useState<IExtendedAsset[]>([])

  const [resourceFilters, setResourceFilters] = useState({
    shipName: [] as string[],
    dataCategory: [] as string[],
    equipmentType: [] as string[],
    collectionChannel: [] as string[],
    logType: [] as string[],
    severity: [] as string[],
  })

  const [resourceData, setResourceData] = useState<ResourceData[]>([])
  const [filteredResourceData, setFilteredResourceData] = useState<ResourceData[]>([])

  const [detectionFilters, setDetectionFilters] = useState({
    dateRange: "",
    detectionRule: [] as string[],
    severityLevel: [] as string[],
    sourceDeviceType: [] as string[],
    eventCategory: [] as string[],
    affectedAsset: "",
    investigationStatus: [] as string[],
  })
  const [detectionEvents, setDetectionEvents] = useState<DetectionEvent[]>([])
  const [filteredDetectionEvents, setFilteredDetectionEvents] = useState<DetectionEvent[]>([])

  const [detailedShips, setDetailedShips] = React.useState<Ship[]>([])
  const [selectedShipForComponents, setSelectedShipForComponents] = React.useState<Ship | null>(null)

  const [debouncedResourceFilters, setDebouncedResourceFilters] = React.useState(resourceFilters)
  const [debouncedDetectionFilters, setDebouncedDetectionFilters] = React.useState(detectionFilters)

  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null)

  React.useEffect(() => {
    const ships = generateShipData()
    const detailed = ships.slice(0, 5).map((ship) => generateDetailedShipData(ship)) // Generate detailed data for first 5 ships for performance
    setDetailedShips(detailed)
    setSelectedShipForComponents(detailed[0] || null)
  }, [])

  React.useEffect(() => {
    const ships = generateShipData() // This generates 150 ships
    const assets: IExtendedAsset[] = []

    ships.forEach((ship) => {
      // Generate exactly 30 assets per ship
      const assetTypes = [
        "Radar System",
        "GPS Navigator",
        "AIS Transponder",
        "VDR System",
        "CCTV Camera",
        "Fire Detection",
        "HVAC Controller",
        "Power Management",
        "Engine Monitor",
        "Cargo Control",
        "Navigation Computer",
        "Communication Radio",
        "Weather Station",
        "Autopilot System",
        "Sonar Equipment",
        "Ballast Control",
        "Fuel Management",
        "Safety System",
        "Bridge Console",
        "Deck Equipment",
        "Winch Controller",
        "Crane System",
        "Pump Controller",
        "Valve Actuator",
        "Sensor Array",
        "Network Switch",
        "Security Gateway",
        "Data Logger",
        "Control Panel",
        "Monitoring Station",
      ]

      assetTypes.slice(0, 30).forEach((assetType, index) => {
        const assetId = `${ship.id}-ASSET-${String(index + 1).padStart(3, "0")}`

        assets.push({
          assetId,
          function: `Function ${String.fromCharCode(65 + (index % 5))}`,
          systemSuC: `System ${String.fromCharCode(88 + (index % 3))}`,
          systemSupplier: getRandomElement(["Furuno", "Kongsberg", "Wartsila", "ABB", "Siemens", "Schneider"]),
          typeComponentModelNo: `${assetType.replace(" ", "-")}-${Math.floor(1000 + Math.random() * 9000)}`,
          hwType: getRandomElement(["Server", "Workstation", "Controller", "Sensor", "Gateway", "Switch"]),
          location: getRandomElement(["Bridge", "Engine Room", "Deck", "Control Room", "Navigation Room"]),
          os: getRandomElement(["Windows 10", "Linux", "Proprietary", "VxWorks"]),
          ipAddress: `192.168.${Math.floor(1 + Math.random() * 254)}.${Math.floor(1 + Math.random() * 254)}`,
          subnetMask: "255.255.255.0",
          description: `${assetType} for ${ship.name}`,
          remarks: "Operational",
          cpuUsage: Math.floor(10 + Math.random() * 80),
          memoryUsage: Math.floor(15 + Math.random() * 75),
          diskUsage: Math.floor(20 + Math.random() * 70),
          interfaceInfo: {
            interfaceToOtherSystems: getRandomElement(["-", "Ethernet", "Serial", "CAN Bus"]),
            interfaceMethod: getRandomElement(["-", "TCP/IP", "Modbus", "NMEA"]),
            remoteOnshoreConn: getRandomElement(["-", "Satellite", "4G/LTE"]),
            accessibility: "USB: -, LAN: Available, Serial: -, CAN: -",
            ports: "USB: 2, LAN: 4, Serial: 1, CAN: -",
            malwareProtection: getRandomElement(["-", "Enabled", "Disabled"]),
          },
          installedSoftware: [
            {
              swType: "OS",
              swName: getRandomElement(["Windows 10", "Linux Ubuntu", "Proprietary OS"]),
              brandOriginator: getRandomElement(["Microsoft", "Canonical", "Vendor"]),
              version: `${Math.floor(1 + Math.random() * 5)}.${Math.floor(Math.random() * 10)}`,
              function: "Operating System",
            },
            {
              swType: "Application",
              swName: `${assetType} Software`,
              brandOriginator: getRandomElement(["Furuno", "Kongsberg", "Wartsila"]),
              version: `${Math.floor(1 + Math.random() * 3)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
              function: "Control Application",
            },
          ],
        })
      })
    })

    setAllAssets(assets)
  }, [])

  const getRandomElement = (array: string[]): string => {
    return array[Math.floor(Math.random() * array.length)]
  }

  useEffect(() => {
    const ships = generateShipData()
    const allShipAssets: IExtendedAsset[] = []

    ships.forEach((ship) => {
      const detailedShip = generateDetailedShipData(ship)
      if (detailedShip.assets) {
        const enhancedAssets = detailedShip.assets.map((asset) => ({
          ...asset,
          shipName: ship.name,
          interfaceInfo: {
            interfaceToOtherSystems:
              asset.hwType === "Switch"
                ? "Connected to all network devices"
                : asset.hwType === "Radio"
                  ? "Wireless communication systems"
                  : "Ethernet, Serial",
            interfaceMethod: asset.hwType === "Switch" ? "Ethernet" : asset.hwType === "Radio" ? "Wireless" : "TCP/IP",
            remoteOnshoreConn: asset.hwType === "Radio" || asset.hwType === "Server" ? "Yes" : "No",
            accessibility: "USB: Yes, LAN: Yes, Serial: No, CAN: No",
            ports: asset.hwType === "Switch" ? "24x GE, 4x 10GE" : asset.hwType === "Server" ? "2x GE" : "1x GE",
            malwareProtection: asset.hwType === "PC" || asset.hwType === "Server" ? "McAfee Enterprise" : "N/A",
          },
          installedSoftware: [
            {
              swType: "OS",
              swName: asset.os?.includes("Windows") ? "Windows OS" : "Linux OS",
              brandOriginator: asset.os?.includes("Windows") ? "Microsoft" : "Red Hat",
              version: asset.os?.includes("Windows") ? "10.0.19041" : "8.4",
              function: asset.function,
            },
            {
              swType: "Application",
              swName: `${asset.function} Control Software`,
              brandOriginator: asset.systemSupplier,
              version: `${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
              function: asset.function,
            },
            {
              swType: "Security",
              swName: "Antivirus Software",
              brandOriginator: "McAfee",
              version: "2024.1.0",
              function: "Malware Protection",
            },
          ],
        }))
        allShipAssets.push(...enhancedAssets)
      }
    })

    setAllAssets(allShipAssets)

    const shipData = generateShipData()
    setShips(shipData)

    const mockResourceData = generateResourceData()
    setResourceData(mockResourceData)
    setFilteredResourceData(mockResourceData)

    // Set default selected ship
    if (shipData.length > 0) {
      setSelectedShip(shipData[0])
      setAssetFilters((prev) => ({ ...prev, ship: shipData[0].name }))
    }

    // const enhancedAssets = generateEnhancedAssetData()
    // setAllAssets(enhancedAssets)
    // setFilteredAllAssets(enhancedAssets)
  }, [])

  useEffect(() => {
    const handleResizeObserverError = (e: ErrorEvent) => {
      if (e.message === "ResizeObserver loop completed with undelivered notifications.") {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
    }

    window.addEventListener("error", handleResizeObserverError)
    return () => window.removeEventListener("error", handleResizeObserverError)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedResourceFilters(resourceFilters)
    }, 300)
    return () => clearTimeout(timer)
  }, [resourceFilters])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedDetectionFilters(detectionFilters)
    }, 300)
    return () => clearTimeout(timer)
  }, [detectionFilters])

  useEffect(() => {
    let filtered = resourceData

    if (selectedShip) {
      filtered = filtered.filter((resource) => resource.shipName === selectedShip.name)
    }

    if (debouncedResourceFilters.dateRange) {
      const dateRangeParts = debouncedResourceFilters.dateRange.split(" to ")
      if (dateRangeParts.length === 2) {
        const startDate = new Date(dateRangeParts[0])
        const endDate = new Date(dateRangeParts[1])
        endDate.setHours(23, 59, 59, 999)

        filtered = filtered.filter((resource) => {
          const resourceDate = new Date(resource.timestamp)
          return resourceDate >= startDate && resourceDate <= endDate
        })
      }
    }

    if (debouncedResourceFilters.dataCategory.length > 0) {
      filtered = filtered.filter((resource) => debouncedResourceFilters.dataCategory.includes(resource.dataCategory))
    }

    if (debouncedResourceFilters.equipmentType.length > 0) {
      filtered = filtered.filter((resource) => debouncedResourceFilters.equipmentType.includes(resource.equipmentType))
    }

    if (debouncedResourceFilters.collectionChannel.length > 0) {
      filtered = filtered.filter((resource) =>
        debouncedResourceFilters.collectionChannel.includes(resource.collectionChannel),
      )
    }

    setFilteredResourceData(filtered)
  }, [resourceData, selectedShip, debouncedResourceFilters])

  useEffect(() => {
    let filtered = detectionEvents

    // Filter by selected ship first
    if (selectedShip) {
      filtered = filtered.filter((event) => event.shipName.includes(selectedShip.name.split("#")[0]))
    }

    if (debouncedDetectionFilters.dateRange) {
      const dateRangeParts = debouncedDetectionFilters.dateRange.split(" to ")
      if (dateRangeParts.length === 2) {
        const startDate = new Date(dateRangeParts[0])
        const endDate = new Date(dateRangeParts[1])
        endDate.setHours(23, 59, 59, 999)

        filtered = filtered.filter((event) => {
          const eventDate = new Date(event.detectionTime)
          return eventDate >= startDate && eventDate <= endDate
        })
      }
    }

    if (debouncedDetectionFilters.detectionRule.length > 0) {
      filtered = filtered.filter((event) => debouncedDetectionFilters.detectionRule.includes(event.detectionRule))
    }

    if (debouncedDetectionFilters.severityLevel.length > 0) {
      filtered = filtered.filter((event) => debouncedDetectionFilters.severityLevel.includes(event.severityLevel))
    }

    if (debouncedDetectionFilters.sourceDeviceType.length > 0) {
      filtered = filtered.filter((event) => debouncedDetectionFilters.sourceDeviceType.includes(event.sourceDevice))
    }

    if (debouncedDetectionFilters.eventCategory.length > 0) {
      filtered = filtered.filter((event) => debouncedDetectionFilters.eventCategory.includes(event.eventCategory))
    }

    if (debouncedDetectionFilters.investigationStatus.length > 0) {
      filtered = filtered.filter((event) =>
        debouncedDetectionFilters.investigationStatus.includes(event.investigationStatus),
      )
    }

    setFilteredDetectionEvents(filtered)
  }, [detectionEvents, selectedShip, debouncedDetectionFilters])

  useEffect(() => {
    let filtered = allAssets

    if (assetFilters.function) {
      filtered = filtered.filter((asset) => asset.function === assetFilters.function)
    }

    if (assetFilters.systemSuC) {
      filtered = filtered.filter((asset) => asset.systemSuC === assetFilters.systemSuC)
    }

    if (assetFilters.systemSupplier) {
      filtered = filtered.filter((asset) => asset.systemSupplier === assetFilters.systemSupplier)
    }

    if (assetFilters.hwType) {
      filtered = filtered.filter((asset) => asset.hwType === assetFilters.hwType)
    }

    if (assetFilters.os) {
      const assetOS = (asset) => asset.os || "Proprietary"
      if (assetFilters.os === "Windows") {
        filtered = filtered.filter((asset) => {
          const assetOS = asset.os || "Proprietary"
          return assetOS.toLowerCase().includes("windows")
        })
      } else if (assetFilters.os === "Linux") {
        filtered = filtered.filter((asset) => {
          const assetOS = asset.os || "Proprietary"
          return assetOS.toLowerCase().includes("linux")
        })
      } else {
        filtered = filtered.filter((asset) => {
          const assetOS = asset.os || "Proprietary"
          return assetOS === assetFilters.os
        })
      }
    }

    if (assetFilters.location) {
      filtered = filtered.filter((asset) => asset.location === assetFilters.location)
    }

    setFilteredAllAssets(filtered)
  }, [assetFilters, allAssets])

  useEffect(() => {
    const mockDetectionEvents = generateDetectionEvents()
    setDetectionEvents(mockDetectionEvents)
    setFilteredDetectionEvents(mockDetectionEvents)
  }, [])

  const resetAssetFilters = () => {
    setAssetFilters({
      function: "",
      systemSuC: "",
      systemSupplier: "",
      hwType: "",
      location: "",
      os: "",
    })
  }

  const resetResourceFilters = () => {
    setResourceFilters({
      shipName: [] as string[],
      dataCategory: [],
      equipmentType: [],
      collectionChannel: [],
      logType: [],
      severity: [],
    })
  }

  const resetDetectionFilters = () => {
    setDetectionFilters({
      dateRange: "",
      detectionRule: [],
      severityLevel: [],
      sourceDeviceType: [],
      eventCategory: [],
      affectedAsset: "",
      investigationStatus: [],
    })
  }

  const handleAssetDetail = (asset: IExtendedAsset) => {
    setSelectedAsset(asset)
    setIsAssetModalOpen(true)
  }

  const getUniqueValues = (key: string) => {
    const values = allAssets
      .filter((asset) => !assetFilters.ship || (asset as any).shipName === assetFilters.ship)
      .map((asset) => {
        switch (key) {
          case "function":
            return asset.function
          case "systemSuC":
            return asset.systemSuC
          case "systemSupplier":
            return asset.systemSupplier
          case "hwType":
            return asset.hwType
          case "location":
            return asset.location
          case "typeComponentModelNo":
            return asset.typeComponentModelNo
          default:
            return null
        }
      })
      .filter(Boolean)

    return [...new Set(values)].sort()
  }

  const getUniqueOS = () => {
    const allOSVersions = allAssets
      .filter((asset) => !assetFilters.ship || (asset as any).shipName === assetFilters.ship)
      .map((asset) => asset.os)
      .filter(Boolean)
    const osCategories = new Set<string>()

    allOSVersions.forEach((os) => {
      if (os!.toLowerCase().includes("windows")) {
        osCategories.add("Windows")
      } else if (os!.toLowerCase().includes("linux")) {
        osCategories.add("Linux")
      } else {
        osCategories.add(os!)
      }
    })

    return Array.from(osCategories).sort()
  }

  const getUniqueDetectionSources = () => {
    const sources = detectionEvents.map((event) => event.source)
    return [...new Set(sources)].sort()
  }

  const getUniqueDetectionSeverities = () => {
    const severities = detectionEvents.map((event) => event.severity)
    return [...new Set(severities)].sort()
  }

  const getUniqueDetectionRules = () => {
    const rules = detectionEvents.map((event) => event.detectionRule)
    return [...new Set(rules)].sort()
  }

  const getUniqueSeverityLevels = () => {
    const severities = detectionEvents.map((event) => event.severityLevel)
    return [...new Set(severities)].sort()
  }

  const getUniqueSourceDeviceTypes = () => {
    const devices = detectionEvents.map((event) => event.sourceDevice.split("-")[0])
    return [...new Set(devices)].sort()
  }

  const getUniqueEventCategories = () => {
    const categories = detectionEvents.map((event) => event.eventCategory)
    return [...new Set(categories)].sort()
  }

  const getUniqueInvestigationStatuses = () => {
    const statuses = detectionEvents.map((event) => event.investigationStatus)
    return Array.from(new Set(statuses)).filter(Boolean)
  }

  const MultiSelectFilter = ({
    label,
    options,
    selected,
    onSelectionChange,
    placeholder = "Select options...",
    filterKey,
  }: {
    label: string
    options: string[]
    selected: string[]
    onSelectionChange: (values: string[]) => void
    placeholder?: string
    filterKey: keyof typeof dropdownStates
  }) => {
    return (
      <div>
        <label className="text-sm font-medium mb-2 block">{label}</label>
        <Popover
          open={dropdownStates[filterKey]}
          onOpenChange={(open) => setDropdownStates((prev) => ({ ...prev, [filterKey]: open }))}
        >
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" className="w-full justify-between bg-transparent">
              {selected.length === 0
                ? placeholder
                : selected.length === 1
                  ? selected[0]
                  : `${selected.length} selected`}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
              <CommandList>
                <CommandEmpty>No options found.</CommandEmpty>
                <CommandGroup className="max-h-64 overflow-auto">
                  {options.map((option) => (
                    <CommandItem
                      key={option}
                      onSelect={() => {
                        const newSelected = selected.includes(option)
                          ? selected.filter((item) => item !== option)
                          : [...selected, option]
                        onSelectionChange(newSelected)
                      }}
                    >
                      <Checkbox checked={selected.includes(option)} className="mr-2" />
                      {option}
                      <Check
                        className={cn("ml-auto h-4 w-4", selected.includes(option) ? "opacity-100" : "opacity-0")}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
          <Server className="text-white text-sm font-bold" />
        </div>
        <h1 className="text-2xl font-bold text-blue-400">Data Search</h1>
      </div>

      {/* Ship Selection - Global Filter */}
      <Card className="border-blue-500/20">
        <CardHeader>
          <CardTitle className="text-blue-400">Ship Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Current Selected Ship</label>
              <Select
                value={selectedShip?.id || "none"}
                onValueChange={(value) => {
                  const ship = ships.find((s) => s.id === value)
                  setSelectedShip(ship || null)
                }}
              >
                <SelectTrigger className="bg-transparent">
                  <SelectValue placeholder="Select a ship to filter data..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">All Ships</SelectItem>
                  {ships.map((ship) => (
                    <SelectItem key={ship.id} value={ship.id}>
                      {ship.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedShip && (
              <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <p className="text-sm">
                  <span className="font-medium">Selected:</span> {selectedShip.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  All search results will be filtered to this ship's data only.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="asset">Asset</TabsTrigger>
          <TabsTrigger value="resource">Resource</TabsTrigger>
          <TabsTrigger value="detection">Detection Event</TabsTrigger>
        </TabsList>

        <TabsContent value="asset" className="space-y-6">
          {selectedShipForComponents && (
            <>
              <ResourceMonitoring
                assets={selectedShipForComponents.assets || []}
                selectedAssetId={selectedAssetId}
                onAssetSelect={(asset) => {
                  setSelectedAssetId(asset.assetId)
                }}
              />

              <AssetList assets={selectedShipForComponents.assets || []} />

              <AssetChangeLog changeLogs={selectedShipForComponents.changeLog || []} />
            </>
          )}
        </TabsContent>

        <TabsContent value="resource" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-400">Resource Data Search Filters</CardTitle>
              <p className="text-sm text-muted-foreground">
                Search through 24-hour stored raw data from ship monitoring systems (1 day retention period)
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                <MultiSelectFilter
                  label="Data Category"
                  options={[
                    "Resource Usage",
                    "Security Events",
                    "Network Events",
                    "Security Detection Events",
                    "Hardware Installation Info",
                    "Software Installation Info",
                    "Audit Log",
                    "System Logs",
                  ]}
                  selected={resourceFilters.dataCategory}
                  onSelectionChange={(values) => setResourceFilters((prev) => ({ ...prev, dataCategory: values }))}
                  placeholder="All Categories"
                  filterKey="dataCategory"
                />

                <MultiSelectFilter
                  label="Equipment Type"
                  options={["Security (FortiGate)", "Network Switch", "CBS Windows", "CBS Linux"]}
                  selected={resourceFilters.equipmentType}
                  onSelectionChange={(values) => setResourceFilters((prev) => ({ ...prev, equipmentType: values }))}
                  placeholder="All Equipment"
                  filterKey="equipmentType"
                />

                <MultiSelectFilter
                  label="Collection Channel"
                  options={["SNMP v2c trap", "syslog", "metricbeat", "filebeat", "winlogbeat", "auditbeat"]}
                  selected={resourceFilters.collectionChannel}
                  onSelectionChange={(values) => setResourceFilters((prev) => ({ ...prev, collectionChannel: values }))}
                  placeholder="All Channels"
                  filterKey="collectionChannel"
                />

                <MultiSelectFilter
                  label="Log Type"
                  options={[
                    "CPU Usage",
                    "Memory Usage",
                    "Disk Usage",
                    "Network Usage",
                    "Port Status",
                    "Device Management",
                    "Firewall Policy",
                    "UTM Detection",
                    "Hardware Install",
                    "Software Install",
                    "USER_AUTH",
                    "USER_LOGIN",
                    "EXECVE",
                    "CONNECT",
                    "SYSCALL",
                    "Windows Event",
                    "Linux System",
                  ]}
                  selected={resourceFilters.logType}
                  onSelectionChange={(values) => setResourceFilters((prev) => ({ ...prev, logType: values }))}
                  placeholder="All Log Types"
                  filterKey="logType"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={resetResourceFilters}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-blue-400">
                Resource Data Results ({filteredResourceData.length} records)
              </CardTitle>
              <p className="text-sm text-muted-foreground">Raw data from monitoring systems (DB retention: 1 day)</p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Ship</TableHead>
                      <TableHead>Data Category</TableHead>
                      <TableHead>Equipment</TableHead>
                      <TableHead>Device ID</TableHead>
                      <TableHead>Collection Method</TableHead>
                      <TableHead>Log Type</TableHead>
                      <TableHead>Value/Message</TableHead>
                      <TableHead>Raw Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResourceData.slice(0, 100).map((resource) => (
                      <TableRow key={resource.id}>
                        <TableCell className="font-mono text-xs">
                          {new Date(resource.timestamp).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }) +
                            ", " +
                            new Date(resource.timestamp).toLocaleTimeString("en-GB", {
                              hour12: false,
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                        </TableCell>
                        <TableCell className="font-medium">{resource.shipName}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {resource.dataCategory}
                          </Badge>
                        </TableCell>
                        <TableCell>{resource.equipmentType}</TableCell>
                        <TableCell className="font-mono text-xs">{resource.targetDevice}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {resource.collectionChannel}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">{resource.logType}</TableCell>
                        <TableCell className="font-mono text-xs max-w-xs truncate" title={resource.value}>
                          {resource.value}
                        </TableCell>
                        <TableCell className="text-xs max-w-xs truncate" title={resource.eventDetails}>
                          {resource.eventDetails}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {filteredResourceData.length > 100 && (
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  Showing first 100 of {filteredResourceData.length} records
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detection" className="space-y-6">
          {/* Detection Events Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-red-400">Detection Events Search Filters</CardTitle>
              <p className="text-sm text-muted-foreground">
                Search detection events generated by Elastic Security rules from resource data analysis
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Date Range</label>
                  <DateRangePicker
                    placeholder="DD-MM-YYYY to DD-MM-YYYY"
                    value={detectionFilters.dateRange}
                    onChange={(value) => setDetectionFilters((prev) => ({ ...prev, dateRange: value }))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Detection Rule</label>
                  <MultiSelect
                    options={getUniqueDetectionRules().map((rule) => ({ label: rule, value: rule }))}
                    selected={detectionFilters.detectionRule}
                    onChange={(selected) => setDetectionFilters((prev) => ({ ...prev, detectionRule: selected }))}
                    placeholder="Select detection rules"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Severity Level</label>
                  <MultiSelect
                    options={getUniqueSeverityLevels().map((severity) => ({ label: severity, value: severity }))}
                    selected={detectionFilters.severityLevel}
                    onChange={(selected) => setDetectionFilters((prev) => ({ ...prev, severityLevel: selected }))}
                    placeholder="Select severity levels"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Source Device Type</label>
                  <MultiSelect
                    options={getUniqueSourceDeviceTypes().map((device) => ({ label: device, value: device }))}
                    selected={detectionFilters.sourceDeviceType}
                    onChange={(selected) => setDetectionFilters((prev) => ({ ...prev, sourceDeviceType: selected }))}
                    placeholder="Select device types"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Event Category</label>
                  <MultiSelect
                    options={getUniqueEventCategories().map((category) => ({ label: category, value: category }))}
                    selected={detectionFilters.eventCategory}
                    onChange={(selected) => setDetectionFilters((prev) => ({ ...prev, eventCategory: selected }))}
                    placeholder="Select event categories"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Affected Asset</label>
                  <Input
                    placeholder="Search affected asset"
                    value={detectionFilters.affectedAsset}
                    onChange={(e) => setDetectionFilters((prev) => ({ ...prev, affectedAsset: e.target.value }))}
                    className="bg-transparent"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Investigation Status</label>
                  <MultiSelect
                    options={[
                      { label: "New", value: "New" },
                      { label: "In Progress", value: "In Progress" },
                      { label: "Resolved", value: "Resolved" },
                      { label: "False Positive", value: "False Positive" },
                    ]}
                    selected={detectionFilters.investigationStatus}
                    onChange={(selected) => setDetectionFilters((prev) => ({ ...prev, investigationStatus: selected }))}
                    placeholder="Select investigation status"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={resetDetectionFilters}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button className="bg-red-600 hover:bg-red-700">
                  <Search className="w-4 h-4 mr-2" />
                  Search Detection Events ({filteredDetectionEvents.length} results)
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Detection Events Results */}
          <Card>
            <CardHeader>
              <CardTitle className="text-red-400">Detection Events Results</CardTitle>
              <p className="text-sm text-muted-foreground">
                Events detected by Elastic Security rules based on resource data analysis (Last 90 days)
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Detection Time</TableHead>
                      <TableHead>Detection Rule</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Source Device</TableHead>
                      <TableHead>Event Category</TableHead>
                      <TableHead>Affected Asset</TableHead>
                      <TableHead>Investigation Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDetectionEvents.map((event) => (
                      <TableRow key={event.id} className="hover:bg-muted/50">
                        <TableCell className="font-mono text-sm">
                          {new Date(event.detectionTime).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }) +
                            ", " +
                            new Date(event.detectionTime).toLocaleTimeString("en-GB", {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              hour12: false,
                            })}
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate font-medium">{event.detectionRule}</div>
                          <div className="text-xs text-muted-foreground">Rule ID: {event.elasticRuleId}</div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              event.severityLevel === "Critical"
                                ? "destructive"
                                : event.severityLevel === "High"
                                  ? "destructive"
                                  : event.severityLevel === "Medium"
                                    ? "default"
                                    : "secondary"
                            }
                          >
                            {event.severityLevel}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-blue-500/50 text-blue-400">
                            {event.sourceDevice}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          <Badge variant="outline">{event.eventCategory}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{event.affectedAsset}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              event.investigationStatus === "New"
                                ? "destructive"
                                : event.investigationStatus === "In Progress"
                                  ? "default"
                                  : event.investigationStatus === "Resolved"
                                    ? "secondary"
                                    : "outline"
                            }
                            className={
                              event.investigationStatus === "New"
                                ? "bg-red-100 text-red-800 border-red-200"
                                : event.investigationStatus === "In Progress"
                                  ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                  : event.investigationStatus === "Resolved"
                                    ? "bg-green-100 text-green-800 border-green-200"
                                    : "bg-gray-100 text-gray-800 border-gray-200"
                            }
                          >
                            {event.investigationStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Asset Detail Modal */}
      {selectedAsset && (
        <AssetDetailModalEnhanced
          asset={selectedAsset}
          isOpen={isAssetModalOpen}
          onClose={() => setIsAssetModalOpen(false)}
        />
      )}
    </div>
  )
}
