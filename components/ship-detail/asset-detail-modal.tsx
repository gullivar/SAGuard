"use client"

import type { Asset } from "@/lib/data"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"

interface AssetDetailModalProps {
  asset: Asset | null
  isOpen: boolean
  onClose: () => void
}

export function AssetDetailModal({ asset, isOpen, onClose }: AssetDetailModalProps) {
  if (!asset) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Asset Detail: {asset.assetId}</DialogTitle>
          <DialogDescription>{asset.typeComponentModelNo}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 max-h-[70vh] overflow-y-auto p-2">
          <div>
            <h4 className="font-semibold mb-2 text-primary">Hardware Info</h4>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Function</TableCell>
                  <TableCell>{asset.function}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">System (SuC)</TableCell>
                  <TableCell>{asset.systemSuC}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">HW Type</TableCell>
                  <TableCell>{asset.hwType}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Location</TableCell>
                  <TableCell>{asset.location}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">IP Address</TableCell>
                  <TableCell>{asset.ipAddress || "-"}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-primary">Live Resources</h4>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">CPU Usage</TableCell>
                  <TableCell>{asset.cpuUsage?.toFixed(1) ?? "-"}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Memory Usage</TableCell>
                  <TableCell>{asset.memoryUsage?.toFixed(1) ?? "-"}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Disk Usage</TableCell>
                  <TableCell>{asset.diskUsage?.toFixed(1) ?? "-"}%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AssetDetailModal
