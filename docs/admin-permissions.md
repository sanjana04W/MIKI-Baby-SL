# Admin Permissions Audit — MIKI Baby SL

## Overview

This document defines which product detail page actions are **admin-controlled** vs **system-controlled**, and documents the permission model for the entire admin panel.

---

## Product Detail Page Actions

| Action | Controller | Who Can Perform | Notes |
|--------|-----------|----------------|-------|
| **View Product** | System | All visitors (public) | No authentication required |
| **Add to Cart** | System | All visitors | Controlled by stock availability |
| **Buy Now** | System | All visitors | Redirects to checkout |
| **Submit Review** | System | Logged-in customers with verified purchase | System checks purchase history |
| **Edit Product** | Admin | Owner + Staff with `products` permission | Via admin panel only |
| **Delete Product** | Admin | Owner only | `adminUser.role === "owner"` check |
| **Add/Edit/Delete Variants** | Admin | Owner + Staff with `products` permission | Via ProductModal in admin |
| **Manage Stock Level** | Admin | Owner + Staff with `inventory` permission | Via inventory page or product edit |
| **Toggle Featured** | Admin | Owner + Staff with `products` permission | Via Featured Products page |
| **Toggle New Arrival** | Admin | Owner + Staff with `products` permission | Via ProductModal |
| **Change Product Status** | Admin | Owner + Staff with `products` permission | Active/Archived toggle |
| **Approve/Reject Reviews** | Admin | Owner + Staff (all) | Via Reviews admin page |
| **Delete Reviews** | Admin | Owner + Staff (all) | Via Reviews admin page |

---

## Admin Panel Permission Matrix

### Permission Flags (from `AdminPermissions`)

| Flag | Description | Affects |
|------|-------------|---------|
| `orders` | Order management access | Order list, order details, status updates |
| `products` | Product catalog access | Product CRUD, featured toggle, master data |
| `inventory` | Stock & inventory access | Stock adjustments, low stock alerts |
| `customers` | Customer data access | Customer list, customer details |
| `analytics` | Analytics dashboard access | Revenue reports, sales trends |
| `settings` | System settings access | Store config, payment settings |

### Role-Based Access

| Page / Feature | Owner | Staff (with permission) | Staff (without permission) |
|----------------|-------|------------------------|---------------------------|
| Dashboard | ✅ | ✅ | ✅ |
| Order Management | ✅ | ✅ (needs `orders`) | ❌ |
| Product Catalog | ✅ | ✅ (needs `products`) | ❌ |
| Featured Products | ✅ | ✅ (needs `products`) | ❌ |
| Master Data | ✅ | ✅ (needs `products`) | ❌ |
| Stock & Inventory | ✅ | ✅ (needs `inventory`) | ❌ |
| Promotions | ✅ | ✅ (needs `products`) | ❌ |
| Analytics | ✅ | ✅ (needs `analytics`) | ❌ |
| Audit Logs | ✅ | ❌ | ❌ |
| User Management | ✅ | ❌ | ❌ |
| Messages | ✅ | ✅ | ✅ |
| System Settings | ✅ | ❌ | ❌ |
| Reviews Management | ✅ | ✅ | ✅ |

### Owner-Only Actions

These actions are restricted exclusively to the `owner` role:
- Delete products from catalog
- Access & clear audit logs
- Manage staff accounts (User Management)
- Modify system settings
- Clear all audit history

### System-Controlled Behaviors

These behaviors are determined by code logic and cannot be changed from the admin panel:
- Stock status calculation (`in_stock` / `low_stock` / `out_of_stock` based on thresholds: >5 / 1-5 / 0)
- Order ID generation format (`MIKI-2026-XXXX`)
- Product ID generation format (`miki-prod-XXXX`)
- Review verification (checks purchase history automatically)
- Order stock decrement on purchase
- Stock restoration on order cancellation
