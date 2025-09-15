"use client"

import * as React from "react"
import type { Asset } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RotateCcw } from "lucide-react"

interface AssetListProps {
  assets: Asset[]
}

export default function AssetList({ assets }: AssetListProps) {
  const [selectedSystem, setSelectedSystem] = React.useState("all")
  const [selectedType, setSelectedType] = React.useState("all")
  const [selectedBrand, setSelectedBrand] = React.useState("all")
  const [selectedModel, setSelectedModel] = React.useState("all")
  const [selectedAsset, setSelectedAsset] = React.useState<Asset | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  const filteredAssets = React.useMemo(() => {
    return assets.filter((asset) => {
      const matchesSystem = selectedSystem === "all" || asset.system === selectedSystem
      const matchesType = selectedType === "all" || asset.hwType === selectedType
      const matchesBrand = selectedBrand === "all" || asset.manufacturer === selectedBrand
      const matchesModel = selectedModel === "all" || asset.model === selectedModel

      return matchesSystem && matchesType && matchesBrand && matchesModel
    })
  }, [assets, selectedSystem, selectedType, selectedBrand, selectedModel])

  const uniqueSystems = React.useMemo(() => {
    return ["all", ...new Set(assets.map((asset) => asset.system))].sort()
  }, [assets])

  const uniqueTypes = React.useMemo(() => {
    return ["all", ...new Set(assets.map((asset) => asset.hwType))].sort()
  }, [assets])

  const uniqueBrands = React.useMemo(() => {
    return ["all", ...new Set(assets.map((asset) => asset.manufacturer))].sort()
  }, [assets])

  const uniqueModels = React.useMemo(() => {
    return ["all", ...new Set(assets.map((asset) => asset.model))].sort()
  }, [assets])

  const resetFilters = () => {
    setSelectedSystem("all")
    setSelectedType("all")
    setSelectedBrand("all")
    setSelectedModel("all")
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <div>
              <Select value={selectedSystem} onValueChange={setSelectedSystem}>
                <SelectTrigger className="bg-transparent">
                  <SelectValue placeholder="All Systems" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Systems</SelectItem>
                  {uniqueSystems
                    .filter((system) => system !== "all")
                    .map((system) => (
                      <SelectItem key={system} value={system}>
                        {system}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="bg-transparent">
                  <SelectValue placeholder="All Hardware Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Hardware Types</SelectItem>
                  {uniqueTypes
                    .filter((type) => type !== "all")
                    .map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger className="bg-transparent">
                  <SelectValue placeholder="All Brands" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  {uniqueBrands
                    .filter((brand) => brand !== "all")
                    .map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="bg-transparent">
                  <SelectValue placeholder="All Models" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Models</SelectItem>
                  {uniqueModels
                    .filter((model) => model !== "all")
                    .map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Button variant="outline" size="sm" onClick={resetFilters} className="w-full bg-transparent">
                <RotateCcw className="mr-2 h-4 w-4" />
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
                        <strong>MAC Address:</strong> 00:1B:44:11:3A:B7
                      </div>
                      <div>
                        <strong>Firmware Version:</strong> v2.1.4
                      </div>
                      <div>
                        <strong>Serial Number:</strong> SN{Math.floor(100000 + Math.random() * 900000)}
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
