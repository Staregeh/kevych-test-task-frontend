"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, Train, User, LogOut } from "lucide-react";

function Navbar() {
  const pathname = usePathname();
  const isLoggedIn =
    typeof window !== "undefined" && localStorage.getItem("authToken");

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      window.location.href = "/login";
    }
  };

  const navItems = [
    {
      path: "/schedule",
      label: "Schedule",
      icon: <Train className="h-4 w-4 mr-2" />,
    },
  ];

  return (
    <nav className="border-b bg-background sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center py-4">
        <Link href="/" className="flex items-center space-x-2 cursor-pointer">
          <Train className="h-6 w-6" />
          <span className="font-bold text-xl">TrainScheduler</span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex space-x-4">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path} className="cursor-pointer">
              <Button
                variant={pathname === item.path ? "default" : "ghost"}
                className="flex items-center cursor-pointer"
              >
                {item.icon}
                {item.label}
              </Button>
            </Link>
          ))}

          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <User className="h-4 w-4" />
                  <span>Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex space-x-2">
              <Link href="/login" className="cursor-pointer">
                <Button variant="outline" className="cursor-pointer">
                  Login
                </Button>
              </Link>
              <Link href="/register" className="cursor-pointer">
                <Button className="cursor-pointer">Register</Button>
              </Link>
            </div>
          )}
        </div>

        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="cursor-pointer">
                <Menu />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {navItems.map((item) => (
                <DropdownMenuItem key={item.path} asChild>
                  <Link
                    href={item.path}
                    className="flex items-center cursor-pointer"
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              {isLoggedIn ? (
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Logout</span>
                </DropdownMenuItem>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/login" className="cursor-pointer">
                      Login
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/register" className="cursor-pointer">
                      Register
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
