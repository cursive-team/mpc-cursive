import { Inter } from "next/font/google";
import { RouterItem } from "@/common/types";
import { Icons } from "./components/Icons";

export const fontBase = Inter({ subsets: ["latin"], variable: "--font-base" });

export const APP_CONFIG = {
  APP_NAME: "mpc.cursive.team",
  APP_DESCRIPTION: "A repo of MPC apps built by Cursive",
  SUPPORT_EMAIL: "hellp@cursive.team",
  ALLOW_INCOGNITO: true, // Set to false if you want to disable incognito mode
  IS_MOBILE_ONLY: true, // Set to true if you want to disable the web version
  FOOTER_ICON_SIZE: 20,
};

export const ROUTER_ITEMS: RouterItem[] = [
  {
    label: "Profile",
    href: "/",
    icon: Icons.Social,
    iconSize: 20,
  },
  {
    label: "Queries",
    href: "/queries",
    icon: Icons.Proof,
    iconSize: 20,
  },
  {
    label: "Components",
    href: "/components",
    icon: Icons.Settings,
    iconSize: 20,
  },
];
