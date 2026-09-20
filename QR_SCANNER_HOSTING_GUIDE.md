# QR Scanner & Hosting Guide

## Overview

This guide explains how to set up QR codes for your cafe and how customers use them to access the menu.

## What is QR Scanning?

A QR (Quick Response) code is a matrix barcode that contains your cafe's menu URL. Customers simply scan it with their phone camera to instantly open the menu for ordering.

## Setting Up QR Codes for Your Cafe

### Step 1: Get Your Cafe Menu URL

After hosting this application, your cafe menu will be accessible at:

```
https://yourdomain.com/[cafe-slug]?table=[table-number]
```

**Examples:**
- Table ordering: `https://cafe.example.com/green-bowl?table=1`
- Takeaway: `https://cafe.example.com/green-bowl?type=takeaway`

> Important: Do not generate customer QR codes with `localhost`. A phone cannot reach your computer's localhost. In the owner dashboard, set **QR website address** to your hosted `https://...` domain. For temporary same-Wi-Fi testing, use your computer's LAN address, such as `http://192.168.1.20:3000`, and allow the app through Windows Firewall.

### Step 2: Generate QR Codes

Use a free QR code generator to create QR codes from your cafe URLs:

**Recommended Tools:**
- [qr-code-generator.com](https://www.qr-code-generator.com)
- [qr.io](https://qr.io)
- [goqr.me](https://goqr.me)
- [the-qr-code-generator.com](https://the-qr-code-generator.com)

**Steps:**
1. Go to any QR code generator
2. Enter your cafe menu URL
3. Click "Generate"
4. Download as PNG or PDF
5. Print and laminate (for durability)

### Step 3: Place QR Codes

Place printed QR codes in these locations:

- **On tables** - Center of tablecloths or placemats
- **On entry door** - For takeaway customers
- **On counter** - For order pickup
- **Wall signage** - Near entrance
- **Receipts** - Print on billing receipts
- **Social media** - Share URL/QR on Instagram, Facebook
- **Google Business** - Add to your Google Business listing

### Step 4: Size Recommendations

For optimal scanning:
- **Minimum size:** 2cm x 2cm (0.8" x 0.8")
- **Recommended size:** 5cm x 5cm (2" x 2") or larger
- **Maximum size:** 21cm x 21cm (8.3" x 8.3")
- **Color:** Black QR on white background (better recognition)

### Step 5: Test Your QR Codes

Before printing, test each QR code:
1. Open your phone camera
2. Point at the QR code on your screen
3. Tap the notification that appears
4. Verify the correct menu loads
5. Test on multiple devices (iPhone, Android)

## Hosting This Application

### Option 1: Deploy to Vercel (Recommended - FREE TIER AVAILABLE)

1. **Create a GitHub account** and fork this repository
2. **Go to [vercel.com](https://vercel.com)** and sign up
3. **Connect your GitHub repository**
4. **Click "Deploy"** - Vercel will automatically deploy
5. **Get your URL**: Your app will be at `https://your-project-name.vercel.app`

### Option 2: Deploy to Railway

1. **Go to [railway.app](https://railway.app)**
2. **Sign up with GitHub**
3. **Click "New Project" → Select your repository**
4. **Railway auto-deploys** - No configuration needed
5. **Get custom domain** in project settings

### Option 3: Deploy to AWS Amplify

1. **Go to [amplify.aws](https://amplify.aws)**
2. **Select "Deploy an app"**
3. **Choose GitHub** and select your repository
4. **Amplify auto-deploys** with free tier (50GB/month)

### Option 4: Self-Hosted (Advanced)

For self-hosting on your own server:

```bash
# Build the project
npm run build

# Start the server
npm run start
```

Requires:
- Node.js 18+ installed
- PostgreSQL database
- Domain name (DNS pointing to your server)
- SSL certificate (Let's Encrypt free option)

## Environment Setup

Before deploying, configure these environment variables:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/cafe_db"

# Email (optional, for bill sending)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="noreply@cafe.com"

# API
NEXT_PUBLIC_API_URL="https://yourdomain.com"
```

## Customer Experience with QR Codes

When customers scan your QR code:

1. **Menu Opens** - They see your cafe's beautiful menu
2. **Browse Items** - Filter by category, see prices, descriptions
3. **Listen Descriptions** - Click "Listen" to hear AI-powered food descriptions
4. **Customize Orders** - Add exclusions, add-ons, special requests
5. **Add to Cart** - Build their order
6. **Review Cart** - See subtotal, taxes, discounts
7. **Checkout** - Enter email for receipt
8. **Play Games** - Win discounts on purchases
9. **Get Bill** - Email receipt to their inbox

## Membership Tiers & Game Discounts

Customers can earn better discounts based on membership:

- **Basic:** 1x discount multiplier, 2 games/day
- **Silver:** 1.5x discount multiplier  
- **Gold:** 2x discount multiplier
- **Platinum:** 3x discount multiplier

### Configure in Owner Dashboard

1. Go to **Games & Discounts** tab
2. Adjust maximum discount percentage (0-50%)
3. Set membership tier multipliers
4. Create custom games (Wheel, Dice, Cards, Spin)
5. Save configuration

## Printing & Laminating Tips

For best results:

1. **Print on heavy cardstock** (200 GSM minimum)
2. **Use a color printer** for best quality (B&W works too)
3. **Laminate for durability** (clear lamination protects QR)
4. **Use double-sided tape** for table placement
5. **Mount at eye level** for easy scanning

## Troubleshooting

### QR Code Won't Scan

- Clean the camera lens
- Ensure adequate lighting
- Print at larger size (minimum 5cm x 5cm)
- Use high contrast (black on white)
- Try different QR code format (test with phone first)

### Page Won't Load After Scanning

- Check URL is correct
- Verify domain is live
- Check internet connection
- Clear browser cache and try again
- Test on different device

### Discount Not Applying

- Ensure game configuration is saved
- Check cafe ID matches
- Verify customer hasn't exceeded daily game limit
- Restart application

## Support & Help

For technical support:
- Check the [GitHub Issues](https://github.com/yourusername/cafe-saas)
- Review the main README.md
- Contact owner@cafeapp.local

## Quick Links

- **Main App:** https://yourdomain.com
- **Owner Dashboard:** https://yourdomain.com/[cafe-slug]/owner (Ctrl+Shift+C)
- **QR Code Generator:** https://qr-code-generator.com
- **Free Hosting:** https://vercel.com

---

**Version:** 2.0  
**Last Updated:** 2024-2025
