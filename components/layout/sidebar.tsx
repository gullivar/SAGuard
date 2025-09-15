"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Search,
  Database,
  FileText,
  Settings,
  Book,
  ChevronRight,
  ShipIcon,
  Globe,
  Ship,
  Network,
} from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useSidebar } from "./sidebar-context"
import ThemeToggle from "@/components/theme-toggle"

const SidebarLink = ({ href, icon: Icon, text, isMinimized, isSubItem = false }: any) => {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={href}
            className={cn(
              "flex items-center h-10 rounded-md text-sm font-medium transition-colors overflow-hidden",
              isSubItem ? "pl-11 pr-4" : "px-4",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            <span
              className={cn(
                "ml-4 whitespace-nowrap transition-all duration-300",
                isMinimized ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto delay-100",
              )}
            >
              {text}
            </span>
          </Link>
        </TooltipTrigger>
        {isMinimized && (
          <TooltipContent side="right">
            <p>{text}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  )
}

export default function Sidebar() {
  const { isMinimized, setIsMinimized } = useSidebar()

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-background transition-all duration-300 ease-in-out overflow-hidden",
        isMinimized ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-16 items-center justify-center border-b px-4 overflow-hidden">
        <ShipIcon className="h-8 w-8 text-primary flex-shrink-0" />
      </div>
      <nav className="flex flex-col gap-1 p-2 overflow-hidden flex-1">
        <SidebarLink href="/" icon={LayoutDashboard} text="Dashboard" isMinimized={isMinimized} />

        {!isMinimized && (
          <Collapsible>
            <CollapsibleTrigger className="w-full">
              <div
                className={cn(
                  "flex items-center h-10 px-4 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground overflow-hidden",
                )}
              >
                <Search className="h-5 w-5 flex-shrink-0" />
                <span className="ml-4 whitespace-nowrap">Search</span>
                <ChevronRight className="ml-auto h-4 w-4 flex-shrink-0" />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 overflow-hidden">
              <SidebarLink href="/search/ships" icon={Ship} text="Ship" isMinimized={isMinimized} isSubItem />
              <SidebarLink href="/search/data" icon={Database} text="Data" isMinimized={isMinimized} isSubItem />
            </CollapsibleContent>
          </Collapsible>
        )}

        {isMinimized && (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center h-10 px-4 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
                  <Search className="h-5 w-5 flex-shrink-0" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Search</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {!isMinimized && (
          <Collapsible>
            <CollapsibleTrigger className="w-full">
              <div
                className={cn(
                  "flex items-center h-10 px-4 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground overflow-hidden",
                )}
              >
                <Settings className="h-5 w-5 flex-shrink-0" />
                <span className="ml-4 whitespace-nowrap">System Settings</span>
                <ChevronRight className="ml-auto h-4 w-4 flex-shrink-0" />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 overflow-hidden">
              <SidebarLink
                href="/settings/gui-editor"
                icon={FileText}
                text="Network Topology Editor"
                isMinimized={isMinimized}
                isSubItem
              />
              <SidebarLink
                href="/snmp-editor"
                icon={Network}
                text="SNMP Request Editor"
                isMinimized={isMinimized}
                isSubItem
              />
            </CollapsibleContent>
          </Collapsible>
        )}

        {isMinimized && (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center h-10 px-4 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
                  <Settings className="h-5 w-5 flex-shrink-0" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>System Settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        <SidebarLink href="/report" icon={Book} text="Reports" isMinimized={isMinimized} />
      </nav>

      <div className="border-t p-2 space-y-2">
        <div className="flex items-center justify-center gap-2">
          <ThemeToggle />
          {!isMinimized && <span className="text-sm text-muted-foreground">Theme</span>}
        </div>

        <div className="flex items-center justify-center gap-2">
          {isMinimized ? (
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center justify-center w-8 h-8">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>English</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <>
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">English</span>
            </>
          )}
        </div>
      </div>
    </aside>
  )
}
