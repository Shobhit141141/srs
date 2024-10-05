"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Home, PlusCircle, Calendar, LucideLogOut } from "lucide-react"; // Import Lucide icons
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@radix-ui/react-navigation-menu"; // Radix UI components

const CustomNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Add Student", href: "/create-students", icon: PlusCircle },
    { name: "Montly", href: "/monthly", icon: Calendar },
    { name: "Logout", href: "/logout", icon: LucideLogOut },
  ];

  return (
    <nav className="text-white px-4">
      {/* Navbar for larger screens */}
      <div className="mx-auto  justify-between items-center px-2 py-4 hidden md:flex">
        <div className="flex items-center space-x-2">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink href="/">
                  <img src="/srs.png" alt="Logo" className="h-10 w-10 object-cover" />
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="hidden md:flex space-x-4">
          <NavigationMenu>
            <NavigationMenuList>
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.name}>
                  <NavigationMenuLink href={link.href} className="hover:text-gray-400">
                    {link.name}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>

      {/* Toggle Button for mobile menu */}
      {/* <div className="md:hidden">
        <button
          onClick={toggleMenu}
          className="focus:outline-none max-z z-[999] absolute top-4 right-8 text-[18px]"
        >
          {isOpen ? "Close" : "Menu"}
        </button>
      </div> */}

      {/* Menu for mobile screen */}
      {/* {isOpen && (
        <motion.div
          className="md:hidden bg-[#00000099] absolute w-full h-[100vh] top-0 left-0 inset-0 backdrop-blur-md z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ height: 0 }}
        >
          <div className="flex flex-col p-4 justify-center items-center h-full">
            {navLinks.map((link) => (
              <NavigationMenu key={link.name}>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      href={link.href}
                      className="py-2 hover:text-gray-400 text-[30px] text-yellow-400"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            ))}
          </div>
        </motion.div>
      )} */}

      {/* Bottom navigation for mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#181818] py-4 flex justify-around z-50 ">
        <NavigationMenu>
          <NavigationMenuList className="flex flex-row justify-evenly items-center w-screen">
            {navLinks.map((link) => (
              <NavigationMenuItem key={link.name}>
                <NavigationMenuLink
                  href={link.href}
                  className="flex flex-row items-center justify-center space-x-1"
                >
                  <link.icon className="w-6 h-6 text-yellow-400 hover:text-white " />
                  {/* <span className="text-sm text-white">{link.name}</span> */}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
};

export default CustomNavbar;
