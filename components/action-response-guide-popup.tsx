"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import ReactMarkdown from "react-markdown"

interface ActionResponseGuidePopupProps {
  isOpen: boolean
  onClose: () => void
  ruleName?: string
  ruleDescription?: string
  ruleQuery?: string
  investigationGuide?: string
}

export default function ActionResponseGuidePopup({
  isOpen,
  onClose,
  ruleName = "[Critical] EICAR Test File Detected",
  ruleDescription = "A file identified as malware by the Endpoint Protection Agent was detected.",
  ruleQuery = "SELECT * FROM file_events WHERE file_hash = 'X5O!P%@AP[4\\\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*'",
  investigationGuide = `## Investigation Steps

1. **Verification**: Confirm that the Endpoint Protection Agent automatically quarantined or deleted the EICAR file. This confirms the agent is functioning correctly.

2. **Check Agent Logs**: Review the agent logs on the host (10.1.1.1) for a successful detection and remediation entry.

3. **No Automatic Action?**: If the file was NOT automatically remediated, escalate to the security engineering team to investigate the agent's configuration. This is a critical finding.

4. **Update Status**: Once verified, change the "Action Status" to "Completed" to close this alert.`,
}: ActionResponseGuidePopupProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">Action Response Guide</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown
              components={{
                h2: ({ children }) => <h2 className="text-base font-semibold mt-4 mb-2">{children}</h2>,
                h3: ({ children }) => <h3 className="text-sm font-semibold mt-3 mb-1">{children}</h3>,
                p: ({ children }) => <p className="text-sm mb-2">{children}</p>,
                ol: ({ children }) => <ol className="text-sm space-y-2 ml-4">{children}</ol>,
                ul: ({ children }) => <ul className="text-sm space-y-1 ml-4">{children}</ul>,
                li: ({ children }) => <li className="text-sm">{children}</li>,
                strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                code: ({ children }) => (
                  <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">{children}</code>
                ),
              }}
            >
              {investigationGuide}
            </ReactMarkdown>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
