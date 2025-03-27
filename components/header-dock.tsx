"use client";

import React from "react";
import { FloatingDock } from "@/components/ui/dock";
import {
  IconBrandGithub,
  IconHome,
  IconBrandPaypal,
  IconQuestionMark,
  IconListLetters,
  IconShieldCheck
} from "@tabler/icons-react";
const links = [
  {
    title: "Home",
    icon: (
      <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    ),
    href: "/"
  },

  {
    title: "Frequently Asked Questions",
    icon: (
      <IconQuestionMark className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    ),
    href: "/frequently-asked-question"
  },
  {
    title: "Privacy Policy",
    icon: (
      <IconShieldCheck className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    ),
    href: "/privacy-policy"
  },
  {
    title: "Updates",
    icon: (
      <IconListLetters className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    ),
    href: "/changelog"
  },

  {
    title: "Visit my Github",
    icon: (
      <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    ),
    href: "https://www.github.com/adhaghani"
  },
  {
    title: "Buy me a coffee",
    icon: (
      <IconBrandPaypal className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    ),
    href: "#"
  }
];
const HeaderDock = () => {
  return <FloatingDock items={links} />;
};

export default HeaderDock;
