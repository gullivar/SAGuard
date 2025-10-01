"use client"

import * as React from "react"
import type { Asset } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RotateCcw, Calendar } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { MultiSelect } from "@/components/ui/multi-select"

interface AssetListProps {
  assets: Asset[]
}

export default function AssetList({ assets }: AssetListProps) {
  const [selectedSystem, setSelectedSystem] = React.useState<string[]>([])
  const [selectedType, setSelectedType] = React.useState<string[]>([])
  const [selectedBrand, setSelectedBrand] = React.useState<string[]>([])
  const [selectedModel, setSelectedModel] = React.useState<string[]>([])
  const [selectedAsset, setSelectedAsset] = React.useState<Asset | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [fromDate, setFromDate] = React.useState<Date | undefined>(undefined)
  const [toDate, setToDate] = React.useState<Date | undefined>(undefined)

  const filteredAssets = React.useMemo(() => {
    return assets.filter((asset) => {
      const matchesSystem = selectedSystem.length === 0 || selectedSystem.includes(asset.system)
      const matchesType = selectedType.length === 0 || selectedType.includes(asset.hwType)
      const matchesBrand = selectedBrand.length === 0 || selectedBrand.includes(asset.manufacturer)
      const matchesModel = selectedModel.length === 0 || selectedModel.includes(asset.model)
      const matchesDate = !fromDate || !toDate || (asset.purchaseDate >= fromDate && asset.purchaseDate <= toDate)

      return matchesSystem && matchesType && matchesBrand && matchesModel && matchesDate
    })
  }, [assets, selectedSystem, selectedType, selectedBrand, selectedModel, fromDate, toDate])

  const systemOptions = React.useMemo(() => {
    return [...new Set(assets.map((asset) => asset.system))].sort().map((system) => ({
      label: system,
      value: system,
    }))
  }, [assets])

  const typeOptions = React.useMemo(() => {
    return [...new Set(assets.map((asset) => asset.hwType))].sort().map((type) => ({
      label: type,
      value: type,
    }))
  }, [assets])

  const brandOptions = React.useMemo(() => {
    return [...new Set(assets.map((asset) => asset.manufacturer))].sort().map((brand) => ({
      label: brand,
      value: brand,
    }))
  }, [assets])

  const modelOptions = React.useMemo(() => {
    return [...new Set(assets.map((asset) => asset.model))].sort().map((model) => ({
      label: model,
      value: model,
    }))
  }, [assets])

  const resetFilters = () => {
    setSelectedSystem([])
    setSelectedType([])
    setSelectedBrand([])
    setSelectedModel([])
    setFromDate(undefined)
    setToDate(undefined)
  }

  const handleAssetDetail = (asset: Asset) => {
    setSelectedAsset(asset)
    setIsModalOpen(true)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-400">Asset List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-4">
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-transparent text-xs px-2 py-1 h-8"
                  >
                    <Calendar className="mr-1 h-3 w-3" />
                    <span className="truncate">From Date</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent mode="single" selected={fromDate} onSelect={setFromDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-transparent text-xs px-2 py-1 h-8"
                  >
                    <Calendar className="mr-1 h-3 w-3" />
                    <span className="truncate">To Date</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent mode="single" selected={toDate} onSelect={setToDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <MultiSelect
                options={systemOptions}
                selected={selectedSystem}
                onChange={setSelectedSystem}
                placeholder="All Systems"
                className="bg-transparent h-8 text-xs"
              />
            </div>
            <div>
              <MultiSelect
                options={typeOptions}
                selected={selectedType}
                onChange={setSelectedType}
                placeholder="All Hardware Types"
                className="bg-transparent h-8 text-xs"
              />
            </div>
            <div>
              <MultiSelect
                options={brandOptions}
                selected={selectedBrand}
                onChange={setSelectedBrand}
                placeholder="All Brands"
                className="bg-transparent h-8 text-xs"
              />
            </div>
            <div>
              <MultiSelect
                options={modelOptions}
                selected={selectedModel}
                onChange={setSelectedModel}
                placeholder="All Models"
                className="bg-transparent h-8 text-xs"
              />
            </div>
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="w-full bg-transparent h-8 text-xs px-2"
              >
                <RotateCcw className="mr-1 h-3 w-3" />
                Reset
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto max-h-[400px]">
            <Table>
              <TableHeader className="sticky top-0 bg-muted">
                <TableRow>
                  <TableHead className="text-blue-400">System</TableHead>
                  <TableHead className="text-blue-400">Type</TableHead>
                  <TableHead className="text-blue-400">Brand</TableHead>
                  <TableHead className="text-blue-400">Model</TableHead>
                  <TableHead className="text-blue-400">Location</TableHead>
                  <TableHead className="text-blue-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.map((asset) => (
                  <TableRow key={asset.assetId}>
                    <TableCell>{asset.system}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{asset.hwType}</Badge>
                    </TableCell>
                    <TableCell>{asset.manufacturer}</TableCell>
                    <TableCell>{asset.model}</TableCell>
                    <TableCell>{asset.location}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => handleAssetDetail(asset)}
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Asset Details - {selectedAsset?.function}</DialogTitle>
          </DialogHeader>
          {selectedAsset && (
            <Tabs defaultValue="hardware" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="hardware">Hardware Details</TabsTrigger>
                <TabsTrigger value="software">Installed Software</TabsTrigger>
              </TabsList>
              <TabsContent value="hardware" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Basic Information</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Asset ID:</strong> {selectedAsset.assetId}
                      </div>
                      <div>
                        <strong>System:</strong> {selectedAsset.system}
                      </div>
                      <div>
                        <strong>Function:</strong> {selectedAsset.function}
                      </div>
                      <div>
                        <strong>Brand:</strong> {selectedAsset.manufacturer}
                      </div>
                      <div>
                        <strong>Model:</strong> {selectedAsset.model}
                      </div>
                      <div>
                        <strong>Type:</strong> {selectedAsset.hwType}
                      </div>
                      <div>
                        <strong>Location:</strong> {selectedAsset.location}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Network Information</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>IP Address:</strong> {selectedAsset.ipAddress || "N/A"}
                      </div>
                      <div>
                        <strong>Subnet Mask:</strong> {selectedAsset.subnetMask || "N/A"}
                      </div>
                      <div>
                        <strong>MAC Address:</strong> {selectedAsset.macAddress || "N/A"}
                      </div>
                      <div>
                        <strong>Firmware Version:</strong> {selectedAsset.firmwareVersion || "N/A"}
                      </div>
                      <div>
                        <strong>Serial Number:</strong> {selectedAsset.serialNumber || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
                {selectedAsset.description && (
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-sm">{selectedAsset.description}</p>
                  </div>
                )}
                {selectedAsset.remarks && (
                  <div>
                    <h4 className="font-semibold mb-2">Remarks</h4>
                    <p className="text-sm">{selectedAsset.remarks}</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="software" className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-4">Installed Software</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>SW Name</TableHead>
                        <TableHead>SW Type</TableHead>
                        <TableHead>Version</TableHead>
                        <TableHead>Function</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedAsset.software?.map((sw, index) => (
                        <TableRow key={index}>
                          <TableCell>{sw.swName}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{sw.swType}</Badge>
                          </TableCell>
                          <TableCell>{sw.version}</TableCell>
                          <TableCell>{sw.function}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
