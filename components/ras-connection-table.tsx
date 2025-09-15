"use client"

import * as React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Check, ChevronsUpDown, X } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { formatBytes, type Connection, type Cbs } from "@/lib/ras-data"
import { ArrowUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface ConnectionTableProps {
  connections: Connection[]
  cbs: Cbs[]
  highlightedConnectionId: string | null
  onRowClick: (id: string | null) => void
}

type SortKey = keyof Connection | "cbsName" | "ipAddress"

const format24HourTime = (date: Date) => {
  return date
    .toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    .replace(",", "")
}

// Changed to named export
export function RasConnectionTable({ connections, cbs, highlightedConnectionId, onRowClick }: ConnectionTableProps) {
  const [sort, setSort] = React.useState<{ key: SortKey; direction: "asc" | "desc" }>({
    key: "connTime",
    direction: "desc",
  })

  // Filter states
  const [filters, setFilters] = React.useState({
    startDate: "",
    endDate: "",
    selectedUsers: new Set<string>(),
    selectedCbs: new Set<string>(),
    ipAddress: "",
  })

  const cbsMap = React.useMemo(() => new Map(cbs.map((c) => [c.id, c])), [cbs])

  // Get unique users and CBS names for filter options
  const uniqueUsers = React.useMemo(() => {
    return Array.from(new Set(connections.map((c) => c.userId))).sort()
  }, [connections])

  const uniqueCbsNames = React.useMemo(() => {
    return Array.from(new Set(connections.map((c) => cbsMap.get(c.cbsId)?.name).filter(Boolean))).sort()
  }, [connections, cbsMap])

  // Filter and sort connections
  const filteredAndSortedConnections = React.useMemo(() => {
    let filtered = [...connections]

    // Apply filters
    if (filters.startDate) {
      const startDate = new Date(filters.startDate)
      filtered = filtered.filter((c) => c.connTime >= startDate)
    }
    if (filters.endDate) {
      const endDate = new Date(filters.endDate)
      endDate.setHours(23, 59, 59, 999) // End of day
      filtered = filtered.filter((c) => c.connTime <= endDate)
    }
    if (filters.selectedUsers.size > 0) {
      filtered = filtered.filter((c) => filters.selectedUsers.has(c.userId))
    }
    if (filters.selectedCbs.size > 0) {
      filtered = filtered.filter((c) => {
        const cbsName = cbsMap.get(c.cbsId)?.name
        return cbsName && filters.selectedCbs.has(cbsName)
      })
    }
    if (filters.ipAddress) {
      const searchTerm = filters.ipAddress.toLowerCase()
      filtered = filtered.filter((c) => {
        const cbsIp = cbsMap.get(c.cbsId)?.ip
        return cbsIp && cbsIp.toLowerCase().includes(searchTerm)
      })
    }

    // Sort
    return filtered.sort((a, b) => {
      let aVal, bVal
      switch (sort.key) {
        case "cbsName":
          aVal = cbsMap.get(a.cbsId)?.name
          bVal = cbsMap.get(b.cbsId)?.name
          break
        case "ipAddress":
          aVal = cbsMap.get(a.cbsId)?.ip
          bVal = cbsMap.get(b.cbsId)?.ip
          break
        default:
          aVal = a[sort.key as keyof Connection]
          bVal = b[sort.key as keyof Connection]
      }

      if (aVal === undefined || bVal === undefined) return 0
      let comparison = 0
      if (typeof aVal === "string" && typeof bVal === "string") {
        comparison = aVal.localeCompare(bVal)
      } else if (aVal instanceof Date && bVal instanceof Date) {
        comparison = aVal.getTime() - bVal.getTime()
      } else if (typeof aVal === "number" && typeof bVal === "number") {
        comparison = aVal - bVal
      }
      return sort.direction === "asc" ? comparison : -comparison
    })
  }, [connections, filters, sort, cbsMap])

  const handleSort = (key: SortKey) => {
    setSort((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }))
  }

  const handleResetFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      selectedUsers: new Set(),
      selectedCbs: new Set(),
      ipAddress: "",
    })
  }

  return (
    <div className="bg-gray-800/50 border-gray-700 rounded-lg p-4">
      <h2 className="text-white text-lg font-semibold mb-4">Connection Status Details</h2>

      {/* Filter Section */}
      <div className="mb-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-end">
          {/* Initial Connection Time (Start) */}
          <div className="space-y-2">
            <Label className="text-sm text-gray-300">Initial Connection Time (Start)</Label>
            <div className="space-y-1">
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters((f) => ({ ...f, startDate: e.target.value }))}
                className="bg-gray-800 border-gray-600"
              />
              <div className="text-xs text-gray-400">DD-MM-YY</div>
            </div>
          </div>

          {/* Initial Connection Time (End) */}
          <div className="space-y-2">
            <Label className="text-sm text-gray-300">Initial Connection Time (End)</Label>
            <div className="space-y-1">
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters((f) => ({ ...f, endDate: e.target.value }))}
                className="bg-gray-800 border-gray-600"
              />
              <div className="text-xs text-gray-400">DD-MM-YY</div>
            </div>
          </div>

          {/* User ID (다중 선택) */}
          <div className="space-y-2">
            <Label className="text-sm text-gray-300">User ID</Label>
            <MultiSelect
              options={uniqueUsers}
              selected={filters.selectedUsers}
              onSelectionChange={(selected) => setFilters((f) => ({ ...f, selectedUsers: selected }))}
              placeholder="Select users..."
            />
          </div>

          {/* CBS명 (다중 선택) */}
          <div className="space-y-2">
            <Label className="text-sm text-gray-300">CBS Name</Label>
            <MultiSelect
              options={uniqueCbsNames}
              selected={filters.selectedCbs}
              onSelectionChange={(selected) => setFilters((f) => ({ ...f, selectedCbs: selected }))}
              placeholder="Select CBS..."
            />
          </div>

          {/* IP 주소 */}
          <div className="space-y-2">
            <Label className="text-sm text-gray-300">IP Address</Label>
            <Input
              placeholder="Search IP address..."
              value={filters.ipAddress}
              onChange={(e) => setFilters((f) => ({ ...f, ipAddress: e.target.value }))}
              className="bg-gray-800 border-gray-600"
            />
          </div>
        </div>

        {/* Reset Button */}
        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={handleResetFilters} className="bg-gray-800 border-gray-600">
            <X className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-h-[60vh] border border-gray-700 rounded-lg">
        <Table>
          <TableHeader className="sticky top-0 bg-gray-800">
            <TableRow>
              <SortableHeader sortKey="connTime" currentSort={sort} onSort={handleSort}>
                Initial Connection Time
              </SortableHeader>
              <SortableHeader sortKey="userId" currentSort={sort} onSort={handleSort}>
                User ID
              </SortableHeader>
              <SortableHeader sortKey="cbsName" currentSort={sort} onSort={handleSort}>
                CBS Name
              </SortableHeader>
              <SortableHeader sortKey="ipAddress" currentSort={sort} onSort={handleSort}>
                IP Address
              </SortableHeader>
              <SortableHeader sortKey="duration" currentSort={sort} onSort={handleSort}>
                Connection Duration (min)
              </SortableHeader>
              <SortableHeader sortKey="sentBytes" currentSort={sort} onSort={handleSort}>
                Sent Bytes
              </SortableHeader>
              <SortableHeader sortKey="receivedBytes" currentSort={sort} onSort={handleSort}>
                Received Bytes
              </SortableHeader>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedConnections.map((conn) => (
              <TableRow
                key={conn.connId}
                onClick={() => onRowClick(conn.connId === highlightedConnectionId ? null : conn.connId)}
                className={cn(
                  "cursor-pointer transition-colors",
                  highlightedConnectionId === conn.connId ? "bg-cyan-900/70" : "hover:bg-gray-700/50",
                )}
              >
                <TableCell>{format24HourTime(conn.connTime)}</TableCell>
                <TableCell>{conn.userId}</TableCell>
                <TableCell>{cbsMap.get(conn.cbsId)?.name}</TableCell>
                <TableCell>{cbsMap.get(conn.cbsId)?.ip}</TableCell>
                <TableCell>{conn.duration}</TableCell>
                <TableCell>{formatBytes(conn.sentBytes)}</TableCell>
                <TableCell>{formatBytes(conn.receivedBytes)}</TableCell>
                <TableCell>
                  <DisconnectButton connection={conn} cbsName={cbsMap.get(conn.cbsId)?.name || ""} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Results count */}
      <div className="mt-2 text-sm text-gray-400">
        Total {filteredAndSortedConnections.length} connections (out of {connections.length})
      </div>
    </div>
  )
}

// Multi-select component for filters
function MultiSelect({
  options,
  selected,
  onSelectionChange,
  placeholder,
}: {
  options: string[]
  selected: Set<string>
  onSelectionChange: (selected: Set<string>) => void
  placeholder: string
}) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (option: string) => {
    const newSelected = new Set(selected)
    if (newSelected.has(option)) {
      newSelected.delete(option)
    } else {
      newSelected.add(option)
    }
    onSelectionChange(newSelected)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-gray-800 border-gray-600 hover:bg-gray-700"
        >
          {selected.size > 0 ? `${selected.size} selected` : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-gray-800 border-gray-600">
        <Command className="bg-gray-800">
          <CommandInput placeholder="Search..." className="bg-gray-800" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem key={option} onSelect={() => handleSelect(option)} className="hover:bg-gray-700">
                  <Check className={cn("mr-2 h-4 w-4", selected.has(option) ? "opacity-100" : "opacity-0")} />
                  {option}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

function SortableHeader({ sortKey, currentSort, onSort, children }: any) {
  return (
    <TableHead className="cursor-pointer hover:bg-gray-700/50" onClick={() => onSort(sortKey)}>
      <div className="flex items-center gap-2">
        {children}
        <ArrowUpDown className={cn("h-4 w-4", currentSort.key === sortKey ? "text-white" : "text-gray-500")} />
      </div>
    </TableHead>
  )
}

function DisconnectButton({ connection, cbsName }: { connection: Connection; cbsName: string }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" onClick={(e) => e.stopPropagation()}>
          Force Disconnect
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to disconnect?</AlertDialogTitle>
          <AlertDialogDescription>
            This will forcefully disconnect user '{connection.userId}' from '{cbsName}'. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => alert(`Disconnecting ${connection.userId}...`)}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
