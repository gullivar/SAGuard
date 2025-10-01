"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"

interface RasFiltersProps {
  users: string[]
  onFilterApply: (filters: any) => void
  onFilterReset: () => void
}

const formatDateForDisplay = (dateString: string) => {
  if (!dateString) return ""
  const date = new Date(dateString)
  const day = date.getDate().toString().padStart(2, "0")
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const year = date.getFullYear().toString().slice(-2)
  return `${day}-${month}-${year}`
}

// Changed to named export
export function RasFilters({ users, onFilterApply, onFilterReset }: RasFiltersProps) {
  const [startDate, setStartDate] = React.useState("")
  const [endDate, setEndDate] = React.useState("")
  const [selectedUsers, setSelectedUsers] = React.useState<Set<string>>(new Set())
  const [minDuration, setMinDuration] = React.useState("")
  const [minSent, setMinSent] = React.useState("")
  const [minReceived, setMinReceived] = React.useState("")

  const handleApply = () => {
    onFilterApply({
      startDate,
      endDate,
      selectedUsers: Array.from(selectedUsers),
      minDuration: minDuration ? Number(minDuration) : null,
      minSent: minSent ? Number(minSent) * 1024 * 1024 : null,
      minReceived: minReceived ? Number(minReceived) * 1024 * 1024 : null,
    })
  }

  const handleReset = () => {
    setStartDate("")
    setEndDate("")
    setSelectedUsers(new Set())
    setMinDuration("")
    setMinSent("")
    setMinReceived("")
    onFilterReset()
  }

  return (
    <div className="p-4 rounded-lg" style={{ backgroundColor: "#2a2a2a" }}>
      <div className="flex flex-wrap gap-4 items-end">
        <FilterControl label="Initial Connection Time (Start)">
          <div className="space-y-1">
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            {startDate && <div className="text-xs text-gray-400">Format: {formatDateForDisplay(startDate)}</div>}
          </div>
        </FilterControl>
        <FilterControl label="Initial Connection Time (End)">
          <div className="space-y-1">
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            {endDate && <div className="text-xs text-gray-400">Format: {formatDateForDisplay(endDate)}</div>}
          </div>
        </FilterControl>
        <FilterControl label="User ID (All)">
          <MultiSelect users={users} selected={selectedUsers} setSelected={setSelectedUsers} />
        </FilterControl>
        <FilterControl label="Connection Duration (min or more)">
          <Input type="number" placeholder="" value={minDuration} onChange={(e) => setMinDuration(e.target.value)} />
        </FilterControl>
        <FilterControl label="Sent Bytes (MB or more)">
          <Input type="number" placeholder="" value={minSent} onChange={(e) => setMinSent(e.target.value)} />
        </FilterControl>
        <FilterControl label="Received Bytes (MB or more)">
          <Input type="number" placeholder="" value={minReceived} onChange={(e) => setMinReceived(e.target.value)} />
        </FilterControl>
        <div className="flex gap-2 ml-auto">
          <Button variant="destructive" onClick={handleReset}>
            Reset Filters
          </Button>
          <Button className="bg-green-600 hover:bg-green-700" onClick={handleApply}>
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  )
}

const FilterControl = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="grid flex-1 min-w-[180px] items-center gap-1.5">
    <Label className="text-sm text-gray-300">{label}</Label>
    {children}
  </div>
)

function MultiSelect({
  users,
  selected,
  setSelected,
}: {
  users: string[]
  selected: Set<string>
  setSelected: React.Dispatch<React.SetStateAction<Set<string>>>
}) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (user: string) => {
    const newSelected = new Set(selected)
    if (newSelected.has(user)) {
      newSelected.delete(user)
    } else {
      newSelected.add(user)
    }
    setSelected(newSelected)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-transparent"
        >
          {selected.size > 0 ? `${selected.size} selected` : "Select users..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search users..." />
          <CommandList>
            <CommandEmpty>No users found.</CommandEmpty>
            <CommandGroup>
              {users.map((user) => (
                <CommandItem key={user} onSelect={() => handleSelect(user)}>
                  <Check className={cn("mr-2 h-4 w-4", selected.has(user) ? "opacity-100" : "opacity-0")} />
                  {user}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
