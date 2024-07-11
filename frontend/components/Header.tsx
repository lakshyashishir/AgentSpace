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
      <h1 className="text-2xl md:text-3xl font-bold">
        <Link to="/">{title}</Link>
      </h1>

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
                  <Link className={buttonVariants({ variant: "link" })} to={"/my-collections"} onClick={() => setIsOpen(false)}>
                    My Collections
                  </Link>
                  <Link className={buttonVariants({ variant: "link" })} to={"/create-collection"} onClick={() => setIsOpen(false)}>
                    Create Collection
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
            <Link className={buttonVariants({ variant: "link" })} to={"/my-collections"}>
              My Collections
            </Link>
            <Link className={buttonVariants({ variant: "link" })} to={"/create-collection"}>
              Create Collection
            </Link>
          </>
        )}
        <WalletSelector />
      </div>
    </div>
  );
}
