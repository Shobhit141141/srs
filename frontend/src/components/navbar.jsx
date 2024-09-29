"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@nextui-org/react";
import Link from "next/link";

const CustomNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Create Student", href: "/create-students" },
    // Add more links as needed
  ];

  return (
    <nav className=" text-white">
      <div className="container mx-auto flex justify-between items-center px-2 py-4">
       
        <div className="flex items-center space-x-2">
          <img src="/srs.png" alt="Logo" className="h-10 w-10 object-cover" />
        </div>
        <div className="hidden md:flex space-x-4">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="hover:text-gray-400">
              {link.name}
            </a>
          ))}
        </div>
      </div>
      <div className="md:hidden">
        <button
          onClick={toggleMenu}
          className="focus:outline-none max-z z-[999] absolute top-4 right-8 text-[18px]"
        >
          {isOpen ? "Close" : "Menu"}
        </button>
      </div>

      {isOpen && (
        <motion.div
          className="md:hidden bg-[#00000099] absolute w-full h-[100vh] top-0 left-0  inset-0 backdrop-blur-md z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ height: 0 }}
        >
          <div className="flex flex-col p-4 justify-center items-center h-full">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="py-2 hover:text-gray-400 text-[30px] text-yellow-400"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default CustomNavbar;
