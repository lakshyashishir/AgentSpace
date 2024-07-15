import { Link } from "react-router-dom";
import { WalletSelector } from "./WalletSelector";
import { IS_DEV } from "@/constants";
import { buttonVariants } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const title = "AgentSpace";

  return (
    <div className="flex items-center justify-between px-4 py-2 max-w-screen-xl mx-auto w-full flex-wrap">
      <Link to="/">
        <div className="flex items-center gap-2">
          <img src={"aptos.png"} alt="logo" className="h-8 w-auto" />
          <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
        </div>
      </Link>
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-4">
            <div className="flex flex-col gap-4">
              {IS_DEV && (
                <>
                  <Link className={buttonVariants({ variant: "link" })} to={"/agents"}>
                    My Agents
                  </Link>
                  <Link className={buttonVariants({ variant: "link" })} to={"/workflows"}>
                    Workflows
                  </Link>
                  <Link className={buttonVariants({ variant: "link" })} to={"/marketplace"}>
                    Marketplace
                  </Link>
                </>
              )}
              <WalletSelector />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden md:flex gap-2 items-center flex-wrap">
        {IS_DEV && (
          <>
            <Link className={buttonVariants({ variant: "link" })} to={"/agents"}>
              My Agents
            </Link>
            <Link className={buttonVariants({ variant: "link" })} to={"/workflows"}>
              Workflows
            </Link>
            <Link className={buttonVariants({ variant: "link" })} to={"/marketplace"}>
              Marketplace
            </Link>
          </>
        )}
        <WalletSelector />
      </div>
    </div>
  );
}
