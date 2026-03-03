// src/config/navigation.js

import {
  FiHome,
  FiBarChart2,
  FiBox,
  FiUsers,
  FiFileText,
  FiSettings,
} from "react-icons/fi";

export const ownerNavigation = [
  {
    label: "Home",
    icon: FiHome,
    path: "/owner/dashboard",
  },
  {
    label: "View All Sales",
    icon: FiBarChart2,
    path: "/owner/sales",
  },

  {
    label: "Suppliers",
    icon: FiUsers,
    children: [
      { label: "Supplier List", path: "/owner/suppliers" },
      { label: "Supplier Purchases", path: "/owner/supplier-purchases" },
      { label: "I owe them", path: "/owner/suppliers/creditors" },
    ],
  },

  {
    label: "Stock",
    icon: FiBox,
    children: [
      { label: "Stock List", path: "/owner/stock" },
      { label: "Add Stock", path: "/owner/stock/add" },
      { label: "Stock History", path: "/owner/stock/history" },
    ],
  },

  {
    label: "Customers",
    icon: FiUsers,
    children: [
      { label: "They owe me", path: "/owner/customers/debtors" },
      { label: "Add Customer", path: "/owner/customers/add" },
      { label: "Customers List", path: "/owner/all/customers" },
    ],
  },

  {
    label: "Manage Staff",
    icon: FiUsers,
    path: "/owner/staff",
  },

  {
    label: "Reports",
    icon: FiFileText,
    path: "/owner/reports",
  },
  {
    label: "Settings",
    icon: FiSettings,
    path: "/owner/settings",
  }
];

export const staffNavigation = [
  {
    label: "Dashboard",
    icon: FiHome,
    path: "/staff",
  },
  {
    label: "My Profile",
    icon: FiUsers,
    path: "/staff/profile",
  },
  {
    label: "Change Password",
    icon: FiFileText,
    path: "/staff/password",
  },
];

export const superAdminNavigation = [
  {
    label: "Dashboard",
    icon: FiHome,
    path: "/super-admin/dashboard",
},
{
  label: "Organizations",
  icon: FiUsers,
  path: "/super-admin/organizations",
},
];
