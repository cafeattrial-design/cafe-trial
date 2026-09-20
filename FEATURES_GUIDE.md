# Cafe SaaS - New Features Guide

## 🎮 Game & Discount System

### For Customers
Customers can play games after ordering to win discounts:

- **2 games per day** (configurable by owner)
- **Win up to 30% discount** (configurable limit)
- **Membership tiers** boost rewards (basic → silver → gold → platinum)
- **Instant discount** applied to their bill

### How to Play
1. After adding items to cart, navigate to **"Play & Win Discounts"** section
2. Select a game (Wheel, Dice, Cards, or Spin)
3. Tap "🎮 Play Game"
4. If you win, get discount code for checkout
5. Discount applies automatically to your order

### For Owners
Configure the game system in Owner Dashboard:

1. Log in: **Ctrl+Shift+C** (while on customer page)
2. Go to **"Games & Discounts"** tab
3. **Configure Settings:**
   - Games allowed per customer per day (1-10)
   - Maximum discount percentage (5-50%)
   - Membership tier multipliers (Basic: 1x, Silver: 1.5x, Gold: 2x, Platinum: 3x)

4. **Create Games:**
   - Click "+ New Game"
   - Set name (e.g., "Lucky Wheel", "Dice Roll")
   - Choose type: Wheel, Dice, Cards, or Spin
   - Add description
   - Save

5. **View Analytics:**
   - See how many times each game was played
   - Track discount distribution
   - Monitor customer engagement

## 🔊 AI Voice Menu Descriptions

### For Customers
Every menu item has a "Listen" button to hear AI-generated descriptions:

- **Ingredients:** What's in the dish
- **Preparation:** How it's made
- **Serving:** What comes with it
- **Allergens:** Important information

### How to Use
1. Browse menu
2. Find an item you're interested in
3. Click **"🔊 Listen"** button
4. Hear detailed description
5. Click again to stop audio

### For Owners
Add AI voice descriptions when editing menu items:

1. Go to menu management
2. Edit each item
3. Add `aiVoiceText` with detailed description
4. Example: "Paneer butter masala - homemade paneer cubes in rich tomato butter sauce, served with basmati rice and warm naan bread"
5. Save - customers can now listen!

**Note:** Uses browser's native text-to-speech (no API costs)

## 📧 Email Bills & Receipts

### For Customers
After payment, get instant bill via email:

- **Professional receipt** with itemized list
- **QR code** for future reference
- **Payment method** confirmation
- **Sent immediately** to your email

### For Owners
Bill copies automatically sent to cafe email:

- **Record keeping** for accounting
- **Customer proof** of order
- **Customizable** email format
- **Automatic** on every order

### How to Send Bill
1. Order reaches "Billing Pending" state
2. Select payment method (Cash, UPI, Card)
3. Click **"📧 Send Bill Email"**
4. Bill sent to customer + owner automatically

## ❌ Super Admin Removed

**Breaking Change:** Super admin section has been completely removed:
- No more `/super-admin` route
- No more super admin authentication
- Focus on individual cafe owners managing their business

This makes the platform more secure and focused on cafe-specific operations.

## 🎯 Membership Tiers

Customers can progress through membership levels for better rewards:

| Tier | Discount Multiplier | Games/Day | Best For |
|------|-------------------|-----------|----------|
| Basic | 1.0x | 2 | New customers |
| Silver | 1.5x | 2 | Regular visitors |
| Gold | 2.0x | 2 | Loyal customers |
| Platinum | 3.0x | 2 | VIP members |

### How to Upgrade Customers
1. Owner can manually set membership tier
2. Loyalty system tracks visits (in development)
3. Higher tiers give bigger discounts on game wins

## 📱 QR Code Scanner

### Setup for Owners
1. Get your cafe menu URL: `https://domain.com/cafe-slug?table=1`
2. Generate QR code at [qr-code-generator.com](https://qr-code-generator.com)
3. Print and place on:
   - Table centerpieces
   - Entry door
   - Counter
   - Website/social media

### Customer Usage
1. Scan table QR code with phone camera
2. Menu opens instantly - no app needed
3. Browse, customize, order
4. Play games for discounts
5. Get email bill

**See:** `QR_SCANNER_HOSTING_GUIDE.md` for detailed setup

## 🏠 Hosting & Deployment

### Quick Start (Free Options)
- **Vercel:** 1-click deploy from GitHub (free tier available)
- **Railway:** Automatic deployment (free credits)
- **AWS Amplify:** Auto-deploy with free tier

### Domain Setup
1. Get a domain (e.g., mycafemenu.com)
2. Point DNS to your hosting provider
3. Enable SSL (most providers do automatically)
4. Your cafe link: `https://mycafemenu.com/cafe-slug`

### Environment Variables (Required)
```env
DATABASE_URL=postgresql://...
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=app-password
```

**See:** `QR_SCANNER_HOSTING_GUIDE.md` for detailed hosting instructions

## 💻 Owner Dashboard

### New Features in Dashboard
1. **Games & Discounts Tab**
   - Configure game rules
   - Create/edit games
   - Set membership multipliers
   - View game statistics

2. **Send Bill Email**
   - One-click bill sending
   - Goes to customer + owner
   - Professional formatted

3. **Enhanced Order Board**
   - Same real-time updates
   - Integrated with discount system
   - Better payment handling

## 🔄 Migration Guide

If upgrading from v1.0:

1. **Run Prisma migration:**
   ```bash
   npx prisma migrate dev --name add_games_and_voice
   ```

2. **Database changes:**
   - New tables: `CustomerProfile`, `GameConfig`, `Game`, `GamePlay`
   - New fields: `MenuItem.aiVoiceText`
   - Old tables intact: no data loss

3. **Features available immediately:**
   - Games for new customers
   - AI voice for menu items (set descriptions)
   - Email bills on new orders

4. **No breaking changes:**
   - Existing customers still work
   - Existing orders unaffected
   - Menu structure unchanged

## 📊 Analytics & Insights

Owner dashboard shows:
- Game participation rate
- Most played games
- Discount redemption
- Revenue with/without discounts
- Customer engagement metrics

## 🚀 What's Next?

Planned features:
- Loyalty card system (digital stamps)
- Customer profiles and history
- Advanced game types
- Integration with payment gateways
- Customer app (native mobile)

## Support & Troubleshooting

### Games Not Showing?
- Ensure GameConfig is created (auto-creates on first access)
- Refresh browser
- Check cafe ID matches

### Email Not Sending?
- Verify SMTP credentials in environment
- Check spam folder
- Use test email service in development

### QR Not Scanning?
- Ensure size ≥ 2cm x 2cm
- High contrast (black on white)
- Clean the phone camera lens

## Questions?

- **Owners:** Check dashboard help, contact cafe support
- **Developers:** See `/README.md` and GitHub issues
- **Customers:** Use the QR code help button (💡 icon)

---

**Version:** 2.0  
**Released:** 2024-2025  
**Last Updated:** Today
