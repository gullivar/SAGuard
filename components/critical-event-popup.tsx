"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Ship, FileText } from "lucide-react"
import ActionResponseGuidePopup from "@/components/action-response-guide-popup"
import { useState } from "react"

type ActionStatus = "Not started" | "In progress" | "Completed"

interface CriticalEventPopupProps {
  isOpen: boolean
  onClose: () => void
  onViewShipDetails: () => void
  onOpenActionGuide: () => void
}

export default function CriticalEventPopup({
  isOpen,
  onClose,
  onViewShipDetails,
  onOpenActionGuide,
}: CriticalEventPopupProps) {
  const [currentStatus, setCurrentStatus] = useState<ActionStatus>("Not started")
  const [isLoading, setIsLoading] = useState(false)
  const [actionGuideOpen, setActionGuideOpen] = useState(false)

  const handleStatusChange = async (newStatus: ActionStatus) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setCurrentStatus(newStatus)
    setIsLoading(false)
  }

  const handleActionGuideClick = () => {
    setActionGuideOpen(true)
  }

  const getStatusBadge = (status: ActionStatus) => {
    switch (status) {
      case "Not started":
        return <Badge variant="outline">Not started</Badge>
      case "In progress":
        return (
          <Badge variant="default" className="bg-blue-500">
            In progress
          </Badge>
        )
      case "Completed":
        return (
          <Badge variant="default" className="bg-green-500">
            Completed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="h-5 w-5" />
              [Critical] EICAR Test File Detected
            </DialogTitle>
            <DialogDescription>09.18.2025 14:12:51</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Ship :</strong> Test ship
                </div>
                <div>
                  <strong>Host :</strong> CBS (10.1.1.1)
                </div>
                <div className="mt-3">
                  <strong>Description :</strong>
                  <p className="mt-1 text-red-700 dark:text-red-300">
                    A file identified as malware by the Endpoint Protection Agent was detected.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Action status :</label>
              <div className="flex items-center gap-2">
                {getStatusBadge(currentStatus)}
                <Select value={currentStatus} onValueChange={handleStatusChange} disabled={isLoading}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Not started">Not started</SelectItem>
                    <SelectItem value="In progress">In progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleActionGuideClick} variant="default" className="flex-1 text-sm py-2">
                <FileText className="mr-1 h-3 w-3" />
                Action Response Guide
              </Button>
              <Button onClick={onViewShipDetails} variant="outline" className="flex-1 text-sm py-2 bg-transparent">
                <Ship className="mr-1 h-3 w-3" />
                View Ship Details
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ActionResponseGuidePopup
        isOpen={actionGuideOpen}
        onClose={() => setActionGuideOpen(false)}
        ruleName="[Critical] EICAR Test File Detected"
        ruleDescription="A file identified as malware by the Endpoint Protection Agent was detected on the ship's CBS system. This detection indicates that the endpoint protection is functioning correctly and has identified a known test signature."
        ruleQuery="SELECT * FROM file_events WHERE file_hash = 'X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*' AND host_ip = '10.1.1.1'"
        investigationGuide={`## Critical Security Response

### Immediate Actions Required

1. **Verification**: Confirm that the Endpoint Protection Agent automatically quarantined or deleted the EICAR file. This confirms the agent is functioning correctly.

2. **Check Agent Logs**: Review the agent logs on the host (10.1.1.1) for a successful detection and remediation entry.

3. **No Automatic Action?**: If the file was NOT automatically remediated, escalate to the security engineering team to investigate the agent's configuration. **This is a critical finding.**

4. **Update Status**: Once verified, change the "Action Status" to "Completed" to close this alert.

### Additional Considerations

- **Network Isolation**: If this were a real threat, consider isolating the affected system
- **Forensic Collection**: Document all system states before remediation
- **Incident Response**: Notify relevant stakeholders for actual malware detections`}
      />
    </>
  )
}
