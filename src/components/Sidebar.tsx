import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { Home, LandPlot, User } from "lucide-react";
import { getAuthSession } from "@/lib/auth";
import LogoutButton from "./LogoutButton";
import Image from "next/image";

export default async function Sidebar() {
  const session = await getAuthSession();

  return (
    <aside className="bg-foreground w-16 h-[600px] rounded-l-md flex items-center py-6 border-r border-background/20 flex-col justify-between">
      <ul className="flex flex-col gap-6">
        <li>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/">
                  <div className="w-6 h-6 relative">
                    <Image
                      src="/cloudsmartiot.png"
                      alt="cloudsmartiot logo"
                      fill
                    />
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="bg-foreground text-background border-background/20"
              >
                ホーム
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </li>
        {session ? (
          <>
            <li>
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/dashboard">
                      <Home className="w-6 h-6 hover:text-background text-accent/80 transition-colors" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="bg-foreground text-background border-background/20"
                  >
                    ダッシュボード
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </li>
            <li>
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/locations">
                      <LandPlot className="w-6 h-6 hover:text-background text-accent/80 transition-colors" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="bg-foreground text-background border-background/20"
                  >
                    ロケーション
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </li>
          </>
        ) : (
          ""
        )}
      </ul>
      <ul>
        {!session ? (
          <li>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/signin">
                    <User className="w-6 h-6 hover:text-background text-accent/80 transition-colors" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="bg-foreground text-background border-background/20"
                >
                  ログイン
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
        ) : (
          <li>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <LogoutButton />
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="bg-foreground text-background border-background/20"
                >
                  ログアウト
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
        )}
      </ul>
    </aside>
  );
}
