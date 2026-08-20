# Miky Baby SL 👶🧸

A modern and responsive e-commerce platform built for **Miky Baby SL**, a Sri Lankan baby and children's-goods business specializing in baby-room wall art, nursery décor, children's gifts, and artful home treasures.

The platform transforms the existing manual ordering process through **Facebook, WhatsApp, and Messenger** into a complete digital shopping experience featuring online product browsing, Cash on Delivery (COD), inventory management, customer management, automated notifications, and an advanced admin dashboard.

[![Status](https://img.shields.io/badge/status-active-success)](https://github.com/)

[![License](https://img.shields.io/badge/license-MIT-blue)](https://github.com/)

[![Built With](https://img.shields.io/badge/Built%20With-Next.js%20%7C%20Firebase-orange)](https://nextjs.org/)

---

# 📖 About the Project

Miky Baby SL is a full-stack e-commerce website developed for a Sri Lankan baby and children's-goods business with an established Facebook presence branded as **MIKI**.

The existing business primarily uses Facebook as its digital storefront, while WhatsApp and Messenger provide direct communication with customers. The current manual ordering approach can require repeated conversations to collect product, customer, and delivery information.

This project introduces a professional online shopping platform where customers can:

- Browse baby and children's products
- Explore wall art and nursery décor
- Search and filter products
- View detailed product information
- Add products to a shopping cart
- Provide delivery information
- Place Cash on Delivery (COD) orders
- Receive order confirmation

The system also includes a secure **Admin Dashboard** that centralizes product management, inventory, orders, customers, promotions, staff access, and analytics.

---

# ✨ Features

## 🛍 Customer Features

- Browse all available products
- Search products instantly
- Filter products by category
- Filter products by price
- Filter products by availability
- Sort products by newest
- Sort products by price
- Sort products by best sellers
- Product detail pages
- Multiple product images
- Product dimensions and material information
- Product availability information
- Shopping cart
- Quantity management
- Cash on Delivery (COD) checkout
- Delivery district selection
- Delivery notes
- Order confirmation
- Order reference number
- Customer contact information
- Responsive mobile-first design
- WhatsApp support
- Messenger support
- Contact form
- New Arrivals
- Best Sellers
- Offers & Sale

---

## 🔐 Admin Features

- Secure Admin Login
- Dashboard Overview
- Product Management (CRUD)
- Category Management
- Inventory Management
- Order Management
- Customer Management
- Promotions & Offers
- Staff Management
- Role-Based Access Control
- Product Image Management
- Stock Monitoring
- Low Stock Alerts
- Order Status Management
- Customer Inquiry Management
- Analytics
- Facebook/Meta conversion tracking

### Admin Roles

The administration system supports two main roles:

#### Owner / Super Admin

- Full dashboard access
- Product management
- Category management
- Inventory management
- Order management
- Customer management
- Promotion management
- Staff management
- Permission management
- Analytics
- System settings

#### Staff / Operator

- View assigned dashboard modules
- Manage assigned products
- Manage assigned inventory
- Process assigned orders
- View customer information
- Manage assigned operational tasks

---

# 👶 Product Categories

The proposed catalog is based on the current business presence and research requirements.

- 🖼️ Baby Room Wall Art
- 🐻 Nursery Prints
- 🦁 Animal-Themed Art
- 💖 Inspirational Prints
- 🎁 Baby Gifts
- 🧸 Children's Gifts
- 🏠 Nursery Décor
- ✨ Home & Family Gifts
- 🆕 New Arrivals
- ⭐ Best Sellers
- 🏷️ Offers & Sale

> Note: The final product categories should be confirmed using the complete product catalog provided by the business owner.

---

# 📂 Project Structure

```text
Miky-Baby-SL/
│
├── app/
│   ├── admin/
│   │   ├── dashboard/
│   │   └── login/
│   │
│   ├── shop/
│   ├── products/
│   ├── categories/
│   ├── cart/
│   ├── checkout/
│   ├── confirmation/
│   ├── about/
│   ├── contact/
│   ├── offers/
│   ├── new-arrivals/
│   ├── best-sellers/
│   ├── shipping/
│   ├── returns/
│   ├── faq/
│   ├── privacy/
│   ├── terms/
│   ├── layout.js
│   └── page.js
│
├── components/
│
├── firebase/
│
├── hooks/
│
├── lib/
│
├── public/
│
├── services/
│
├── styles/
│
├── utils/
│
├── .env.local
├── package.json
├── next.config.js
├── tailwind.config.js
└── README.md
```

---

# 🛠 Technology Stack

| Technology              | Purpose                      |
| ----------------------- | ---------------------------- |
| Next.js                 | React Framework              |
| React.js                | Frontend Development         |
| Firebase                | Backend Platform             |
| Firestore               | Cloud Database               |
| Firebase Authentication | User & Admin Authentication  |
| Firebase Storage        | Product Image Storage        |
| Firebase Hosting        | Deployment                   |
| Cloud Functions         | Server-side Business Logic   |
| Node.js                 | Backend Functions            |
| Tailwind CSS            | Styling                      |
| EmailJS                 | Email Notifications          |
| React Context           | Shopping Cart State          |
| Meta Pixel              | Facebook Conversion Tracking |
| next/image              | Image Optimization           |
| Google Lighthouse       | Performance Testing          |


---

## 🎨 UI Highlights

- Mobile-first responsive design
- Warm and playful visual identity
- Child and family-oriented interface
- Clean product grid
- High-quality product photography
- Nursery-inspired product presentation
- Product image galleries
- Clear product dimensions
- Material information
- Stock availability indicators
- Promotional banners
- New Arrivals section
- Best Sellers section
- Facebook-oriented landing experience
- WhatsApp and Messenger contact options
- Trust-focused checkout
- Accessible navigation
- Simple mobile navigation
- Clear product information

---

# 🔍 Search & Filtering

Customers can quickly find products using:

- Instant Search
- Category Filter
- Price Filter
- Availability Filter
- Newest Sorting
- Price Sorting
- Best Sellers
- New Arrivals
- Offers & Sale

---

# 📱 System Workflow

```text
Customer
     │
     ▼
Facebook / Search / Direct Visit
     │
     ▼
Visit Website
     │
     ▼
Browse Products
     │
     ▼
Search & Filter
     │
     ▼
View Product Details
     │
     ▼
Check Dimensions / Material / Availability
     │
     ▼
Add to Cart
     │
     ▼
Checkout
     │
     ▼
Enter Customer & Delivery Details
     │
     ▼
Cash on Delivery (COD)
     │
     ▼
Confirm Order
     │
     ▼
Order Created
     │
     ▼
Email Confirmation
     │
     ▼
Admin Receives Order
     │
     ▼
Pending
     │
     ▼
Confirmed
     │
     ▼
Processing
     │
     ▼
Dispatched
     │
     ▼
Completed
```
---

# 🔐 Order Status Workflow

```text
Pending
   │
   ▼
Confirmed
   │
   ▼
Processing
   │
   ▼
Dispatched
   │
   ▼
Completed
```
---

# 🔥 Firebase Collections

| Collection   | Description                            |
| ------------ | -------------------------------------- |
| `products`   | Complete product catalog               |
| `categories` | Product categories and navigation      |
| `orders`     | Customer purchases and COD orders      |
| `customers`  | Customer information and order history |
| `promotions` | Promotional campaigns and offers       |
| `adminUsers` | Owner and staff accounts               |


---

# 👥 User Roles

Customer can:

- Browse Products
- Search Products
- Filter Products
- View Product Details
- Add Products to Cart
- Checkout
- Place COD Orders
- Receive Order Confirmation
- Contact the Business
- View Product Availability
- Owner / Super Admin

The Owner / Super Admin can:

- Access the complete dashboard
- Manage products
- Manage categories
- Manage inventory
- Manage orders
- Manage customers
- Manage promotions
- Manage staff
- Manage permissions
- View analytics
- Configure system settings
- Manage customer inquiries
- Staff / Operator

Staff members can receive individually assigned permissions for:

- Products
- Inventory
- Orders
- Customers
- Promotions
- Analytics
- Customer inquiries

---

# 📊 Admin Dashboard

The Admin Dashboard provides:

- Dashboard Overview
- Order Management
- Product Management
- Category Management
- Inventory Management
- Customer Management
- Promotions & Offers
- Staff Management
- Analytics
- Customer Inquiries
- Low Stock Monitoring
- Order Status Management
- Product Image Management
- System Settings

---

# 🔮 Future Enhancements

- Online Payment Gateway
- Wishlist
- Loyalty Rewards
- Customer Reviews
- AI Product Recommendations
- Order Tracking
- Coupon System
- Multi-language Support

---

# 🔐 Security

The system uses:
1. Firebase Authentication
2. Firestore Security Rules
3. Protected Admin Routes
4. Role-Based Authorization
5. Owner/Staff Permission Control
6. Environment Variables
7. Secure Firebase Access
8. Server-side Cloud Functions

---

# 📈 SEO

- Dynamic Metadata
- Unique Meta Titles
- Meta Descriptions
-  Open Graph Tags
- Organization/Brand JSON-LD
-  Product Structured Data
-  Image Alt Attributes
- XML Sitemap
- Robots.txt
- Semantic HTML
- Optimized Product Images
-  Search Engine Friendly Product URLs


---

# 🎯 Target Audience

- 👨‍👩‍👧 Parents
- 🤰 Expectant Parents
- 🎁 Baby Gift Buyers
- 🧸 Children's Gift Buyers
- 🏠 Nursery Décor Shoppers
- 🎉 Birthday Gift Buyers
- 👶 Newborn Gift Buyers
- 💝 Baby Shower Gift Buyers
- 🛍️ Online COD Shoppers

---

# 📌 Project Status

✔ Business Research Completed

✔ Requirements Analysis

✔ UI/UX Planning

✔ Website Architecture

✔ Firebase Architecture

✔ Customer Website Planning

✔ Admin Dashboard Planning

✔ Product & Category Planning

✔ Inventory Management Planning

✔ COD Workflow

✔ Email Notification Planning

✔ SEO Planning

✔ Performance Planning

✔ Meta Pixel Planning

✔ Testing Plan

✔ Deployment Plan

✔ Documentation

---

# 💖 Brand Vision

"Creating beautiful moments for little ones and meaningful treasures for every family."

Miky Baby SL aims to provide parents, families, and gift buyers across Sri Lanka with a convenient and trustworthy online shopping experience for baby products, nursery décor, children's gifts, and beautiful home treasures.

The website combines the warmth of the existing MIKI brand with a modern digital shopping experience, helping customers discover products, place COD orders, and receive reliable customer support.
---

# 📄 License

This project was developed for educational and portfolio purposes.

All branding, logos, product photographs, designs, and business content belong to Miky Baby SL.

---

# 👩‍💻 Developed By

## Wenuri Sanjana
