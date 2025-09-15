"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DateRangePickerProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
}

export function DateRangePicker({
  value,
  onChange,
  placeholder = "DD-MM-YYYY to DD-MM-YYYY",
  className,
}: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(() => {
    if (value) {
      const parts = value.split(" to ")
      if (parts.length === 2) {
        const [startStr, endStr] = parts
        const startDate = parseDate(startStr)
        const endDate = parseDate(endStr)
        if (startDate && endDate) {
          return { from: startDate, to: endDate }
        }
      }
    }
    return undefined
  })

  const formatDate = (date: Date) => {
    return format(date, "dd-MM-yyyy")
  }

  const parseDate = (dateStr: string) => {
    const parts = dateStr.split("-")
    if (parts.length === 3) {
      const [day, month, year] = parts
      const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day))
      if (!isNaN(date.getTime())) {
        return date
      }
    }
    return null
  }

  const handleDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate)
    if (newDate?.from && newDate?.to && onChange) {
      const fromStr = formatDate(newDate.from)
      const toStr = formatDate(newDate.to)
      onChange(`${fromStr} to ${toStr}`)
    } else if (!newDate && onChange) {
      onChange("")
    }
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal bg-transparent",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {formatDate(date.from)} to {formatDate(date.to)}
                </>
              ) : (
                formatDate(date.from)
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
