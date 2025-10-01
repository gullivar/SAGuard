"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface RefreshTimerWidgetProps {
  onIntervalChange: (interval: number) => void
}

export default function RefreshTimerWidget({ onIntervalChange }: RefreshTimerWidgetProps) {
  const [currentValue, setCurrentValue] = useState("0")

  const handleValueChange = (value: string) => {
    console.log("[v0] Refresh timer value changed:", value)
    setCurrentValue(value)
    onIntervalChange(Number.parseInt(value, 10))
  }

  return (
    <div className="bg-background/80 backdrop-blur-sm border border-border rounded-lg p-2 shadow-lg flex items-center gap-2">
      <Label htmlFor="refresh-interval" className="text-xs px-1">
        Refresh
      </Label>
      <Select value={currentValue} onValueChange={handleValueChange}>
        <SelectTrigger id="refresh-interval" className="w-[100px] h-8 text-xs">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent className="z-[9999] bg-background border border-border shadow-lg">
          <SelectItem value="0">Off</SelectItem>
          <SelectItem value="30000">30 sec</SelectItem>
          <SelectItem value="45000">45 sec</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
