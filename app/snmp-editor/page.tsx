"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus, Upload, Download } from "lucide-react"

interface SNMPEntry {
  id: string
  deviceId: string
  vendor: string
  modelName: string
  sourceIP: string // Added Source IP field
  firmwareVersion: string // Added Firmware Version field
  targetDeviceIP: string
  targetPort: number
  oid: string
  oidDescription: string
  pollingInterval: number
  remarks: string
}

interface NewEntryData {
  deviceId: string
  vendor: string
  modelName: string
  sourceIP: string // Added Source IP field
  firmwareVersion: string // Added Firmware Version field
  targetDeviceIP: string
  targetPort: string
  oid: string
  oidDescription: string
  pollingInterval: string
  remarks: string
}

export default function SNMPRequestEditor() {
  const [entries, setEntries] = useState<SNMPEntry[]>([
    {
      id: "1",
      deviceId: "DEV001",
      vendor: "Cisco",
      modelName: "Catalyst 2960",
      sourceIP: "192.168.1.10", // Added Source IP to mock data
      firmwareVersion: "15.2(7)E3", // Added Firmware Version to mock data
      targetDeviceIP: "192.168.1.10",
      targetPort: 161,
      oid: "1.3.6.1.2.1.1.1.0",
      oidDescription: "System Description",
      pollingInterval: 30,
      remarks: "Main switch monitoring",
    },
    {
      id: "2",
      deviceId: "DEV002",
      vendor: "FortiGate",
      modelName: "FortiGate 60F",
      sourceIP: "192.168.1.1", // Added Source IP to mock data
      firmwareVersion: "v7.0.12", // Added Firmware Version to mock data
      targetDeviceIP: "192.168.1.1",
      targetPort: 161,
      oid: "1.3.6.1.4.1.12356.101.4.1.3.0",
      oidDescription: "CPU Usage",
      pollingInterval: 60,
      remarks: "Firewall performance monitoring",
    },
    {
      id: "3",
      deviceId: "DEV003",
      vendor: "HP",
      modelName: "ProLiant DL380",
      sourceIP: "192.168.1.20", // Added Source IP to mock data
      firmwareVersion: "U32 v2.78", // Added Firmware Version to mock data
      targetDeviceIP: "192.168.1.20",
      targetPort: 161,
      oid: "1.3.6.1.4.1.232.6.2.6.8.1.4.0",
      oidDescription: "Memory Usage",
      pollingInterval: 45,
      remarks: "Server health monitoring",
    },
  ])

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [newEntry, setNewEntry] = useState<NewEntryData>({
    deviceId: "",
    vendor: "",
    modelName: "",
    sourceIP: "", // Added Source IP to new entry state
    firmwareVersion: "", // Added Firmware Version to new entry state
    targetDeviceIP: "",
    targetPort: "",
    oid: "",
    oidDescription: "",
    pollingInterval: "",
    remarks: "",
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedIds(new Set(entries.map((entry) => entry.id)))
      } else {
        setSelectedIds(new Set())
      }
    },
    [entries],
  )

  const handleSelectEntry = useCallback((id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev)
      if (checked) {
        newSet.add(id)
      } else {
        newSet.delete(id)
      }
      return newSet
    })
  }, [])

  const handleDeleteSelected = useCallback(() => {
    setEntries((prev) => prev.filter((entry) => !selectedIds.has(entry.id)))
    setSelectedIds(new Set())
  }, [selectedIds])

  const handleAddNew = useCallback(() => {
    setIsAddingNew(true)
    setNewEntry({
      deviceId: "",
      vendor: "",
      modelName: "",
      sourceIP: "", // Reset Source IP field
      firmwareVersion: "", // Reset Firmware Version field
      targetDeviceIP: "",
      targetPort: "",
      oid: "",
      oidDescription: "",
      pollingInterval: "",
      remarks: "",
    })
  }, [])

  const handleSaveNew = useCallback(() => {
    const newId = (Math.max(...entries.map((e) => Number.parseInt(e.id)), 0) + 1).toString()
    const entry: SNMPEntry = {
      id: newId,
      deviceId: newEntry.deviceId,
      vendor: newEntry.vendor,
      modelName: newEntry.modelName,
      sourceIP: newEntry.sourceIP, // Added Source IP to save functionality
      firmwareVersion: newEntry.firmwareVersion, // Added Firmware Version to save functionality
      targetDeviceIP: newEntry.targetDeviceIP,
      targetPort: Number.parseInt(newEntry.targetPort) || 161,
      oid: newEntry.oid,
      oidDescription: newEntry.oidDescription,
      pollingInterval: Number.parseInt(newEntry.pollingInterval) || 30,
      remarks: newEntry.remarks,
    }

    setEntries((prev) => [...prev, entry])
    setIsAddingNew(false)
  }, [entries, newEntry])

  const handleCancelNew = useCallback(() => {
    setIsAddingNew(false)
  }, [])

  const handleNewEntryChange = useCallback((field: keyof NewEntryData, value: string) => {
    setNewEntry((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleImport = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string)

        // Validate JSON structure
        if (!Array.isArray(jsonData)) {
          alert("Invalid JSON format: Expected an array of SNMP entries")
          return
        }

        // Validate each entry has required fields
        const validEntries: SNMPEntry[] = jsonData.map((item, index) => {
          if (!item.deviceId || !item.vendor || !item.modelName || !item.targetDeviceIP || !item.oid) {
            throw new Error(`Invalid entry at index ${index}: Missing required fields`)
          }

          return {
            id: item.id || (Date.now() + index).toString(),
            deviceId: item.deviceId,
            vendor: item.vendor,
            modelName: item.modelName,
            sourceIP: item.sourceIP || "", // Added Source IP to import validation
            firmwareVersion: item.firmwareVersion || "", // Added Firmware Version to import validation
            targetDeviceIP: item.targetDeviceIP,
            targetPort: Number(item.targetPort) || 161,
            oid: item.oid,
            oidDescription: item.oidDescription || "",
            pollingInterval: Number(item.pollingInterval) || 30,
            remarks: item.remarks || "",
          }
        })

        setEntries(validEntries)
        setSelectedIds(new Set())
        alert(`Successfully imported ${validEntries.length} SNMP entries`)
      } catch (error) {
        console.error("Import error:", error)
        alert(`Import failed: ${error instanceof Error ? error.message : "Invalid JSON format"}`)
      }
    }

    reader.readAsText(file)
    // Reset file input
    event.target.value = ""
  }, [])

  const handleExport = useCallback(() => {
    if (selectedIds.size === 0) {
      alert("Please select at least one entry to export")
      return
    }

    const selectedEntries = entries.filter((entry) => selectedIds.has(entry.id))
    const jsonData = JSON.stringify(selectedEntries, null, 2)

    const blob = new Blob([jsonData], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = `snmp-entries-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)
    alert(`Successfully exported ${selectedEntries.length} SNMP entries`)
  }, [entries, selectedIds])

  const isAllSelected = entries.length > 0 && selectedIds.size === entries.length
  const isIndeterminate = selectedIds.size > 0 && selectedIds.size < entries.length

  return (
    <div className="min-h-screen bg-[#f4f6f9] p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-semibold text-gray-900">SNMP Request Editor</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              style={{ display: "none" }}
            />

            {/* Control Buttons Section */}
            <div className="flex gap-3">
              <Button onClick={handleAddNew} disabled={isAddingNew} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add New Entry
              </Button>

              <Button onClick={handleDeleteSelected} disabled={selectedIds.size === 0} variant="destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Selected
              </Button>

              <Button onClick={handleImport} variant="outline" className="bg-gray-600 text-white hover:bg-gray-700">
                <Upload className="w-4 h-4 mr-2" />
                Import (JSON)
              </Button>

              <Button
                onClick={handleExport}
                disabled={selectedIds.size === 0}
                variant="outline"
                className="bg-gray-600 text-white hover:bg-gray-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Export (JSON)
              </Button>
            </div>

            {/* Data Table */}
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#e9ecef]">
                  <tr>
                    <th className="p-3 text-left">
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={handleSelectAll}
                        ref={(el) => {
                          if (el) {
                            el.indeterminate = isIndeterminate
                          }
                        }}
                      />
                    </th>
                    <th className="p-3 text-left font-medium text-gray-700">Device ID</th>
                    <th className="p-3 text-left font-medium text-gray-700">Vendor</th>
                    <th className="p-3 text-left font-medium text-gray-700">Model Name</th>
                    <th className="p-3 text-left font-medium text-gray-700">Source IP</th>{" "}
                    {/* Added Source IP column header */}
                    <th className="p-3 text-left font-medium text-gray-700">FW Version</th>{" "}
                    {/* Added Firmware Version column header (shortened) */}
                    <th className="p-3 text-left font-medium text-gray-700">Target Device IP</th>
                    <th className="p-3 text-left font-medium text-gray-700">Target Port</th>
                    <th className="p-3 text-left font-medium text-gray-700">OID</th>
                    <th className="p-3 text-left font-medium text-gray-700">OID Description</th>
                    <th className="p-3 text-left font-medium text-gray-700">Polling Interval (sec)</th>
                    <th className="p-3 text-left font-medium text-gray-700">Remarks</th>
                  </tr>
                </thead>

                <tbody>
                  {entries.map((entry) => (
                    <tr key={entry.id} className="border-t hover:bg-gray-50 transition-colors">
                      <td className="p-3">
                        <Checkbox
                          checked={selectedIds.has(entry.id)}
                          onCheckedChange={(checked) => handleSelectEntry(entry.id, checked as boolean)}
                        />
                      </td>
                      <td className="p-3 text-sm">{entry.deviceId}</td>
                      <td className="p-3 text-sm">{entry.vendor}</td>
                      <td className="p-3 text-sm">{entry.modelName}</td>
                      <td className="p-3 text-sm">{entry.sourceIP}</td> {/* Added Source IP column data */}
                      <td className="p-3 text-sm">{entry.firmwareVersion}</td>{" "}
                      {/* Added Firmware Version column data */}
                      <td className="p-3 text-sm">{entry.targetDeviceIP}</td>
                      <td className="p-3 text-sm">{entry.targetPort}</td>
                      <td className="p-3 text-sm font-mono text-xs">{entry.oid}</td>
                      <td className="p-3 text-sm">{entry.oidDescription}</td>
                      <td className="p-3 text-sm">{entry.pollingInterval}</td>
                      <td className="p-3 text-sm">{entry.remarks}</td>
                    </tr>
                  ))}
                </tbody>

                {/* Add New Entry Row */}
                {isAddingNew && (
                  <tfoot>
                    <tr className="border-t bg-blue-50">
                      <td className="p-3"></td>
                      <td className="p-3">
                        <Input
                          value={newEntry.deviceId}
                          onChange={(e) => handleNewEntryChange("deviceId", e.target.value)}
                          placeholder="Device ID"
                          className="h-8 text-sm"
                        />
                      </td>
                      <td className="p-3">
                        <Input
                          value={newEntry.vendor}
                          onChange={(e) => handleNewEntryChange("vendor", e.target.value)}
                          placeholder="Vendor"
                          className="h-8 text-sm"
                        />
                      </td>
                      <td className="p-3">
                        <Input
                          value={newEntry.modelName}
                          onChange={(e) => handleNewEntryChange("modelName", e.target.value)}
                          placeholder="Model Name"
                          className="h-8 text-sm"
                        />
                      </td>
                      <td className="p-3">
                        <Input
                          value={newEntry.sourceIP}
                          onChange={(e) => handleNewEntryChange("sourceIP", e.target.value)}
                          placeholder="Source IP"
                          className="h-8 text-sm"
                        />
                      </td>
                      <td className="p-3">
                        <Input
                          value={newEntry.firmwareVersion}
                          onChange={(e) => handleNewEntryChange("firmwareVersion", e.target.value)}
                          placeholder="FW Version"
                          className="h-8 text-sm"
                        />
                      </td>
                      <td className="p-3">
                        <Input
                          value={newEntry.targetDeviceIP}
                          onChange={(e) => handleNewEntryChange("targetDeviceIP", e.target.value)}
                          placeholder="IP Address"
                          className="h-8 text-sm"
                        />
                      </td>
                      <td className="p-3">
                        <Input
                          value={newEntry.targetPort}
                          onChange={(e) => handleNewEntryChange("targetPort", e.target.value)}
                          placeholder="161"
                          type="number"
                          className="h-8 text-sm"
                        />
                      </td>
                      <td className="p-3">
                        <Input
                          value={newEntry.oid}
                          onChange={(e) => handleNewEntryChange("oid", e.target.value)}
                          placeholder="OID"
                          className="h-8 text-sm font-mono"
                        />
                      </td>
                      <td className="p-3">
                        <Input
                          value={newEntry.oidDescription}
                          onChange={(e) => handleNewEntryChange("oidDescription", e.target.value)}
                          placeholder="Description"
                          className="h-8 text-sm"
                        />
                      </td>
                      <td className="p-3">
                        <Input
                          value={newEntry.pollingInterval}
                          onChange={(e) => handleNewEntryChange("pollingInterval", e.target.value)}
                          placeholder="30"
                          type="number"
                          className="h-8 text-sm"
                        />
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Input
                            value={newEntry.remarks}
                            onChange={(e) => handleNewEntryChange("remarks", e.target.value)}
                            placeholder="Remarks"
                            className="h-8 text-sm flex-1"
                          />
                          <Button
                            onClick={handleSaveNew}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 h-8 px-3"
                          >
                            Save
                          </Button>
                          <Button
                            onClick={handleCancelNew}
                            size="sm"
                            variant="outline"
                            className="h-8 px-3 bg-transparent"
                          >
                            Cancel
                          </Button>
                        </div>
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
