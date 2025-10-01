"use client"

import * as React from "react"
import type { ChangeLog } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
<<<<<<< HEAD
import { Button } from "@/components/ui/button"
import { ArrowUpDown, X, Calendar } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { MultiSelect } from "@/components/ui/multi-select"
=======
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, X } from "lucide-react"
>>>>>>> 635fb68316ea188d00a1ccbf846d7710502b0e5a

interface AssetChangeLogProps {
  changeLogs: ChangeLog[]
}

type SortKey = keyof ChangeLog | null

export default function AssetChangeLog({ changeLogs }: AssetChangeLogProps) {
<<<<<<< HEAD
  const [filters, setFilters] = React.useState({
    targetType: [] as string[],
    changeType: [] as string[],
    dateFrom: undefined as Date | undefined,
    dateTo: undefined as Date | undefined,
  })
=======
  const [filters, setFilters] = React.useState({ targetType: "", changeType: "" })
>>>>>>> 635fb68316ea188d00a1ccbf846d7710502b0e5a
  const [sort, setSort] = React.useState<{ key: SortKey; direction: "asc" | "desc" }>({
    key: "timestamp",
    direction: "desc",
  })

  const handleSort = (key: SortKey) => {
    if (!key) return
    setSort((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }))
  }

  const filteredAndSortedLogs = React.useMemo(() => {
    let logs = [...changeLogs]

<<<<<<< HEAD
    if (filters.targetType.length > 0) {
      logs = logs.filter((log) => filters.targetType.includes(log.targetType))
    }
    if (filters.changeType.length > 0) {
      logs = logs.filter((log) => filters.changeType.includes(log.changeType))
    }
    if (filters.dateFrom) {
      logs = logs.filter((log) => new Date(log.timestamp) >= filters.dateFrom!)
    }
    if (filters.dateTo) {
      logs = logs.filter((log) => new Date(log.timestamp) <= filters.dateTo!)
=======
    if (filters.targetType) {
      logs = logs.filter((log) => log.targetType === filters.targetType)
    }
    if (filters.changeType) {
      logs = logs.filter((log) => log.changeType === filters.changeType)
>>>>>>> 635fb68316ea188d00a1ccbf846d7710502b0e5a
    }

    if (sort.key) {
      logs.sort((a, b) => {
        const valA = a[sort.key!]
        const valB = b[sort.key!]
        if (valA === null || valA === undefined) return 1
        if (valB === null || valB === undefined) return -1

        let comparison = 0
        if (typeof valA === "string" && typeof valB === "string") {
          if (sort.key === "timestamp") {
            comparison = new Date(valA).getTime() - new Date(valB).getTime()
          } else {
            comparison = valA.localeCompare(valB)
          }
        } else if (typeof valA === "number" && typeof valB === "number") {
          comparison = valA - valB
        }

        return sort.direction === "asc" ? comparison : -comparison
      })
    }

    return logs
  }, [changeLogs, filters, sort])

  const resetFilters = () => {
<<<<<<< HEAD
    setFilters({ targetType: [], changeType: [], dateFrom: undefined, dateTo: undefined })
  }

  const targetTypeOptions = [
    { label: "HW", value: "HW" },
    { label: "SW", value: "SW" },
  ]

  const changeTypeOptions = [
    { label: "Added", value: "Added" },
    { label: "Changed", value: "Changed" },
    { label: "Deleted", value: "Deleted" },
    { label: "Updated", value: "Updated" },
  ]

=======
    setFilters({ targetType: "", changeType: "" })
  }

>>>>>>> 635fb68316ea188d00a1ccbf846d7710502b0e5a
  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Change Log</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 mb-4">
<<<<<<< HEAD
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[140px] justify-start text-left font-normal bg-transparent text-xs px-2 py-1 h-8"
              >
                <Calendar className="mr-1 h-3 w-3" />
                <span className="truncate">
                  {filters.dateFrom ? format(filters.dateFrom, "dd/MM/yy") : "From Date"}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={filters.dateFrom}
                onSelect={(date) => setFilters((f) => ({ ...f, dateFrom: date }))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[140px] justify-start text-left font-normal bg-transparent text-xs px-2 py-1 h-8"
              >
                <Calendar className="mr-1 h-3 w-3" />
                <span className="truncate">{filters.dateTo ? format(filters.dateTo, "dd/MM/yy") : "To Date"}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={filters.dateTo}
                onSelect={(date) => setFilters((f) => ({ ...f, dateTo: date }))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <MultiSelect
            options={targetTypeOptions}
            selected={filters.targetType}
            onChange={(selected) => setFilters((f) => ({ ...f, targetType: selected }))}
            placeholder="Target Type"
            className="w-[140px] h-8 text-xs"
          />
          <MultiSelect
            options={changeTypeOptions}
            selected={filters.changeType}
            onChange={(selected) => setFilters((f) => ({ ...f, changeType: selected }))}
            placeholder="Change Type"
            className="w-[140px] h-8 text-xs"
          />
          <Button variant="outline" onClick={resetFilters} className="h-8 text-xs px-2 bg-transparent">
            <X className="mr-1 h-3 w-3" /> Reset
=======
          <Select value={filters.targetType} onValueChange={(v) => setFilters((f) => ({ ...f, targetType: v }))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Target Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="HW">HW</SelectItem>
              <SelectItem value="SW">SW</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.changeType} onValueChange={(v) => setFilters((f) => ({ ...f, changeType: v }))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Change Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Added">Added</SelectItem>
              <SelectItem value="Changed">Changed</SelectItem>
              <SelectItem value="Deleted">Deleted</SelectItem>
              <SelectItem value="Updated">Updated</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={resetFilters}>
            <X className="mr-2 h-4 w-4" /> Reset
>>>>>>> 635fb68316ea188d00a1ccbf846d7710502b0e5a
          </Button>
        </div>
        <div className="overflow-x-auto max-h-[400px]">
          <Table>
            <TableHeader className="sticky top-0 bg-muted">
              <TableRow>
                <TableHead onClick={() => handleSort("timestamp")} className="cursor-pointer">
                  Timestamp <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Asset ID</TableHead>
                <TableHead>Target Name</TableHead>
                <TableHead>Component</TableHead>
                <TableHead>Change Type</TableHead>
                <TableHead>Before</TableHead>
                <TableHead>After</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedLogs.map((log) => (
                <TableRow key={log.logId}>
                  <TableCell>
                    {new Date(log.timestamp).toLocaleString("en-GB", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: false,
                    })}
                  </TableCell>
                  <TableCell>{log.targetType}</TableCell>
                  <TableCell>{log.assetId}</TableCell>
                  <TableCell className="max-w-[150px] truncate">{log.targetName}</TableCell>
                  <TableCell>{log.changeComponent}</TableCell>
                  <TableCell>{log.changeType}</TableCell>
                  <TableCell>{log.valueBefore || "-"}</TableCell>
                  <TableCell>{log.valueAfter || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
