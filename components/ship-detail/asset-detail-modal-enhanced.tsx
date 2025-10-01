"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface SoftwareInfo {
  swType: string
  swName: string
  brandOriginator: string
  version: string
  function: string
}

interface ExtendedAsset {
  assetId: string
  function: string
  systemSuC: string
  systemSupplier: string
  hwOriginatorSupplier?: string
  typeComponentModelNo: string
  hwType: string
  location: string
  os?: string
  ipAddress?: string
  subnetMask?: string
  description?: string
  remarks?: string
  interfaceInfo: {
    interfaceToOtherSystems: string
    interfaceMethod: string
    remoteOnshoreConn: string
    accessibility: string
    ports: string
    malwareProtection: string
  }
  installedSoftware: SoftwareInfo[]
}

interface AssetDetailModalEnhancedProps {
  asset: ExtendedAsset | null
  isOpen: boolean
  onClose: () => void
}

export default function AssetDetailModalEnhanced({ asset, isOpen, onClose }: AssetDetailModalEnhancedProps) {
  if (!asset) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-blue-400">Asset Details: {asset.assetId}</DialogTitle>
        </DialogHeader>

        <div className="space-y-8">
          {/* Hardware Information */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-blue-400 border-b border-blue-400/30 pb-2">
              Hardware Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex">
                  <span className="text-blue-400 font-medium w-40">Function</span>
                  <span>{asset.function}</span>
                </div>
                <div className="flex">
                  <span className="text-blue-400 font-medium w-40">System (SuC)</span>
                  <span>{asset.systemSuC}</span>
                </div>
                <div className="flex">
                  <span className="text-blue-400 font-medium w-40">System Supplier</span>
                  <span>{asset.systemSupplier}</span>
                </div>
                <div className="flex">
                  <span className="text-blue-400 font-medium w-40">Originator (HW)</span>
                  <span>{asset.hwOriginatorSupplier || asset.systemSupplier}</span>
                </div>
                <div className="flex">
                  <span className="text-blue-400 font-medium w-40">Type/Model No.</span>
                  <span>{asset.typeComponentModelNo}</span>
                </div>
                <div className="flex">
                  <span className="text-blue-400 font-medium w-40">HW TYPE</span>
                  <span>{asset.hwType}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex">
                  <span className="text-blue-400 font-medium w-40">Location</span>
                  <span>{asset.location}</span>
                </div>
                <div className="flex">
                  <span className="text-blue-400 font-medium w-40">IP Address</span>
                  <span>{asset.ipAddress || "192.168.0.1"}</span>
                </div>
                <div className="flex">
                  <span className="text-blue-400 font-medium w-40">Subnet Mask</span>
                  <span>{asset.subnetMask || "-"}</span>
                </div>
                <div className="flex">
                  <span className="text-blue-400 font-medium w-40">OS</span>
                  <span>{asset.os || "Proprietary"}</span>
                </div>
                <div className="flex">
                  <span className="text-blue-400 font-medium w-40">Description</span>
                  <span>{asset.description || "-"}</span>
                </div>
                <div className="flex">
                  <span className="text-blue-400 font-medium w-40">Remarks</span>
                  <span>{asset.remarks || "-"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interface Information */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-blue-400 border-b border-blue-400/30 pb-2">
              Interface Information
            </h3>
            <div className="space-y-4">
              <div className="flex">
                <span className="text-blue-400 font-medium w-64">Interface to other Systems</span>
                <span>{asset.interfaceInfo.interfaceToOtherSystems}</span>
              </div>
              <div className="flex">
                <span className="text-blue-400 font-medium w-64">Interface Method</span>
                <span>{asset.interfaceInfo.interfaceMethod}</span>
              </div>
              <div className="flex">
                <span className="text-blue-400 font-medium w-64">Remote Onshore Conn.</span>
                <span>{asset.interfaceInfo.remoteOnshoreConn}</span>
              </div>
              <div className="flex">
                <span className="text-blue-400 font-medium w-64">Accessibility (USB/NB)</span>
                <span>{asset.interfaceInfo.accessibility}</span>
              </div>
              <div className="flex">
                <span className="text-blue-400 font-medium w-64">Ports</span>
                <span>{asset.interfaceInfo.ports}</span>
              </div>
              <div className="flex">
                <span className="text-blue-400 font-medium w-64">Malware Protection</span>
                <span>{asset.interfaceInfo.malwareProtection}</span>
              </div>
            </div>
          </div>

          {/* Installed Software */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-blue-400 border-b border-blue-400/30 pb-2">
              Installed Software
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-blue-400">SW Type</TableHead>
                  <TableHead className="text-blue-400">SW Name</TableHead>
                  <TableHead className="text-blue-400">Brand / Originator</TableHead>
                  <TableHead className="text-blue-400">Version</TableHead>
                  <TableHead className="text-blue-400">Function</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {asset.installedSoftware.map((software, index) => (
                  <TableRow key={index}>
                    <TableCell>{software.swType}</TableCell>
                    <TableCell>{software.swName}</TableCell>
                    <TableCell>{software.brandOriginator}</TableCell>
                    <TableCell>{software.version}</TableCell>
                    <TableCell>{software.function}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
