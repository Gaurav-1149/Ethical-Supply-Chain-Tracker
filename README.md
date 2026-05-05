# Ethical Supply Chain Tracker

A full-stack MERN application that helps buyers explore product journeys and lets sellers publish transparent supply-chain data aligned with SDG 12.

## Features

- JWT registration and login with buyer/seller roles
- Seller product creation with supply-chain step management
- Auto-calculated ethical score from fair wages, eco-friendly practices, low transport, and sustainability flags
- Product search and filters for high-score and eco-friendly products
- Clickable supply-chain timeline with badges and detailed indicators
- Dashboard metrics and category impact chart
- QR code link for each product detail page
- Responsive dark-mode interface

## Quick Start

1. Install dependencies:

   ```bash
   npm run install:all
   ```

2. Create `backend/.env`:

   ```bash
   MONGODB_URI=mongodb://127.0.0.1:27017/ethical_supply_chain_tracker
   JWT_SECRET=replace-with-a-long-secret
   PORT=5001
   CLIENT_URL=http://localhost:5173
   ```

3. Seed sample data:

   ```bash
   npm run seed
   ```

4. Start the app:

   ```bash
   npm run dev
   ```

Frontend: `http://localhost:5173`

Backend API: `http://localhost:5001/api`

## Demo Accounts

- Buyer: `buyer@example.com` / `password123`
- Seller: `seller@example.com` / `password123`

## API Summary

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/products`
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products/:id/supply-chain`
- `GET /api/products/:id/supply-chain`
- `GET /api/dashboard`
# Ethical-Supply-Chain-Tracker
