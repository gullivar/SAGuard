"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Ship, X, Check, ChevronsUpDown } from "lucide-react"
import ShipDetailView from "@/components/ship-detail-view"
import { generateShipData, generateDetailedShipData, type Ship as ShipType } from "@/lib/data"
import { cn } from "@/lib/utils"

export default function ShipSearchPage() {
  const [selectedShipIds, setSelectedShipIds] = useState<string[]>([])
  const [selectedShipTypes, setSelectedShipTypes] = useState<string[]>([])
  const [selectedShip, setSelectedShip] = useState<ShipType | null>(null)
  const [ships, setShips] = useState<ShipType[]>([])
  const [open, setOpen] = useState(false)
  const [typeOpen, setTypeOpen] = useState(false)

  useEffect(() => {
    const generatedShips = generateShipData()
    setShips(generatedShips)
  }, [])

  const handleSearch = () => {
    // Search functionality is now automatic based on selected ships
  }

  const handleBackToSearch = () => {
    setSelectedShip(null)
  }

  const removeSelectedShip = (shipId: string) => {
    setSelectedShipIds((prev) => prev.filter((id) => id !== shipId))
  }

  const removeSelectedShipType = (shipType: string) => {
    setSelectedShipTypes((prev) => prev.filter((type) => type !== shipType))
  }

  const toggleShipSelection = (shipId: string) => {
    setSelectedShipIds((prev) => (prev.includes(shipId) ? prev.filter((id) => id !== shipId) : [...prev, shipId]))
  }

  const toggleShipTypeSelection = (shipType: string) => {
    setSelectedShipTypes((prev) =>
      prev.includes(shipType) ? prev.filter((type) => type !== shipType) : [...prev, shipType],
    )
  }

  const shipTypes = Array.from(
    new Set(
      ships.map((ship) => {
        if (ship.name.includes("Container Ship")) return "Container Ship"
        if (ship.name.includes("LNG Tanker")) return "LNG Tanker"
        if (ship.name.includes("Oil Tanker")) return "Oil Tanker"
        if (ship.name.includes("Bulk Carrier")) return "Bulk Carrier"
        if (ship.name.includes("Drillship")) return "Drillship"
        return "Other"
      }),
    ),
  )

  const filteredShipOptions = ships.filter((ship) => {
    if (selectedShipTypes.length === 0) return true
    return selectedShipTypes.some((type) => ship.name.includes(type))
  })

  const selectedShips = ships.filter((ship) => selectedShipIds.includes(ship.id))

  if (selectedShip) {
    return (
      <ShipDetailView
        ship={selectedShip}
        onBack={handleBackToSearch}
        onViewRasDetails={(ship) => {
          // Handle RAS details navigation if needed
        }}
      />
    )
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Ship className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Ship Search</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-4">
            {/* Ship Name Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Ship Name</label>
            </div>

            {/* Select Ships Filter */}
            <div className="space-y-2">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-80 justify-between bg-transparent"
                  >
                    {selectedShipIds.length > 0 ? `${selectedShipIds.length} ship(s) selected` : "Select Ships"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0">
                  <Command>
                    <CommandInput placeholder="Search ships..." />
                    <CommandList>
                      <CommandEmpty>No ships found.</CommandEmpty>
                      <CommandGroup>
                        {filteredShipOptions.map((ship) => (
                          <CommandItem
                            key={ship.id}
                            value={`${ship.name} ${ship.id}`}
                            onSelect={() => toggleShipSelection(ship.id)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedShipIds.includes(ship.id) ? "opacity-100" : "opacity-0",
                              )}
                            />
                            {ship.name} ({ship.id})
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {selectedShipIds.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedShips.map((ship) => (
                    <Badge key={ship.id} variant="secondary" className="flex items-center gap-1 pr-1">
                      {ship.name}
                      <button
                        className="ml-1 h-4 w-4 rounded-full bg-muted-foreground/20 hover:bg-muted-foreground/30 flex items-center justify-center transition-colors"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          removeSelectedShip(ship.id)
                        }}
                        aria-label={`Remove ${ship.name}`}
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Ship Type Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Ship Type</label>
            </div>

            {/* Select Ship Types Filter */}
            <div className="space-y-2">
              <Popover open={typeOpen} onOpenChange={setTypeOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={typeOpen}
                    className="w-80 justify-between bg-transparent"
                  >
                    {selectedShipTypes.length > 0
                      ? `${selectedShipTypes.length} type(s) selected`
                      : "Select Ship Types"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0">
                  <Command>
                    <CommandInput placeholder="Search ship types..." />
                    <CommandList>
                      <CommandEmpty>No ship types found.</CommandEmpty>
                      <CommandGroup>
                        {shipTypes.map((type) => (
                          <CommandItem key={type} value={type} onSelect={() => toggleShipTypeSelection(type)}>
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedShipTypes.includes(type) ? "opacity-100" : "opacity-0",
                              )}
                            />
                            {type}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {selectedShipTypes.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedShipTypes.map((type) => (
                    <Badge key={type} variant="secondary" className="flex items-center gap-1 pr-1">
                      {type}
                      <button
                        className="ml-1 h-4 w-4 rounded-full bg-muted-foreground/20 hover:bg-muted-foreground/30 flex items-center justify-center transition-colors"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          removeSelectedShipType(type)
                        }}
                        aria-label={`Remove ${type}`}
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Clear Selection Button - Right Bottom */}
            <div className="flex justify-end pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedShipIds([])
                  setSelectedShipTypes([])
                }}
                disabled={selectedShipIds.length === 0 && selectedShipTypes.length === 0}
              >
                Clear Selection
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Search Results</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedShips.length > 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Found {selectedShips.length} ship(s). Click on any ship to view detailed information.
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ship Name</TableHead>
                    <TableHead>Ship ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedShips.map((ship) => (
                    <TableRow key={ship.id}>
                      <TableCell className="font-medium">{ship.name}</TableCell>
                      <TableCell>{ship.id}</TableCell>
                      <TableCell>
                        {ship.name.includes("Container Ship")
                          ? "Container Ship"
                          : ship.name.includes("LNG Tanker")
                            ? "LNG Tanker"
                            : ship.name.includes("Oil Tanker")
                              ? "Oil Tanker"
                              : ship.name.includes("Bulk Carrier")
                                ? "Bulk Carrier"
                                : ship.name.includes("Drillship")
                                  ? "Drillship"
                                  : "Other"}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => {
                            const detailedShip = generateDetailedShipData(ship)
                            setSelectedShip(detailedShip)
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-muted-foreground">
              Select ships from the dropdown above to view search results. Choose from {ships.length} available ships
              across different vessel types.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
