# Feature Testing Checklist

## 🌐 Home Page Verification
- [ ] Open http://localhost:3000
- [ ] Verify headline: "Scan, order, play, win!"
- [ ] Verify description mentions: games, AI voice, email invoicing
- [ ] Click "Demo Table 7" link works
- [ ] Click "Demo Takeaway" link works
- [ ] Click "Owner Dashboard" link works
- [ ] Super Admin link is NOT visible (should be removed)

## 🛒 Customer Experience (Demo Table 7)
- [ ] Page loads at http://localhost:3000/green-bowl?table=7
- [ ] Table number "Table 7" displays in header
- [ ] Menu loads with food items
- [ ] Each menu item has a "🔊 Listen" button (AI voice)
- [ ] GameHub section appears between menu and social links
- [ ] Game selection dropdown shows available games
- [ ] "Play Game" button visible
- [ ] Daily game counter shows "0 / [limit] games today"
- [ ] QR code help button (?) appears in bottom right

### AI Voice Features
- [ ] Click "Listen" button on any menu item
- [ ] Browser prompts for audio permission (first time)
- [ ] Voice reads menu item description
- [ ] Stop button appears while speaking
- [ ] Multiple items can have voice enabled/disabled

### Game Features
- [ ] Game selection dropdown displays available games
- [ ] Click "Play Game" button
- [ ] Win/loss animation appears
- [ ] Discount amount shows (e.g., "You won 10% discount!")
- [ ] Daily counter increments
- [ ] After reaching limit, "Play Game" button disables
- [ ] Membership tier affects discount (if logged in with customer profile)

### QR Scanner Help
- [ ] Click "?" icon in bottom right
- [ ] Modal opens with QR scanner guide
- [ ] Instructions are clear and readable
- [ ] "Close" button works
- [ ] Modal is mobile-friendly

## 👨‍💼 Owner Dashboard Access
- [ ] On customer page, press Ctrl+Shift+C
- [ ] Owner login modal appears (or redirects to /green-bowl/owner)
- [ ] Dashboard loads with "Orders" and "Games & Discounts" tabs
- [ ] Can toggle between tabs
- [ ] "Orders" tab shows active orders
- [ ] "Games & Discounts" tab shows new features

### Games & Discounts Configuration
- [ ] "Game Configuration" form visible
- [ ] Input fields appear:
  - [ ] Games per customer per day (spinner)
  - [ ] Max discount percentage (%)
  - [ ] Max discount value (₹)
  - [ ] Basic tier multiplier
  - [ ] Silver tier multiplier
  - [ ] Gold tier multiplier
  - [ ] Platinum tier multiplier
- [ ] "Save Configuration" button works
- [ ] Success message appears after save

### Games Management
- [ ] "Games Management" section visible
- [ ] "Add New Game" button present
- [ ] Existing games list with play counts
- [ ] Game types available: Wheel, Dice, Cards, Spin
- [ ] Can create new game
- [ ] Can edit existing game
- [ ] Can delete game
- [ ] Confirmation prompt appears before delete

### Bill Email Feature
- [ ] On "Orders" tab, click "Send Bill Email" button
- [ ] Email form appears with:
  - [ ] Customer email field
  - [ ] Customer name field
  - [ ] Payment method dropdown
- [ ] Submit button sends email
- [ ] Success message confirms send
- [ ] Email received by customer (check spam folder)
- [ ] Email received by owner (check app logs)

## 📊 Mobile Responsiveness
- [ ] Test on mobile device or resize browser to 375px width
- [ ] Menu items stack vertically
- [ ] Buttons are clickable (not too small)
- [ ] GameHub scrolls horizontally if needed
- [ ] Owner dashboard is usable on mobile
- [ ] QR scanner guide modal is readable
- [ ] AI voice works on mobile browser (Chrome, Safari, Firefox)

## 🔌 API Endpoints (Test with Postman/curl)

### Game Play API
```
POST /api/games/play
Content-Type: application/json

{
  "cafeId": "cm0xxxxx",
  "customerEmail": "test@example.com",
  "customerName": "Test User",
  "membershipTier": "gold",
  "gameId": "cm0xxxxx"
}

Expected Response:
{
  "success": true,
  "won": true,
  "discountPercentage": 15,
  "discountValue": "1000",
  "discountValueRupees": "₹150.00"
}
```

### Get Games API
```
GET /api/games/[cafeId]

Expected Response:
{
  "games": [
    {
      "id": "cm0xxxxx",
      "name": "Lucky Wheel",
      "description": "Spin to win",
      "gameType": "wheel",
      "isActive": true,
      "_count": {
        "gamePlays": 5
      }
    }
  ]
}
```

### Game Config API
```
GET /api/owner/game-config?cafeId=cm0xxxxx

Expected Response:
{
  "cafeId": "cm0xxxxx",
  "gamesPerCustomerDaily": 2,
  "maxDiscountPercentage": 30,
  "maxDiscountValue": "2000",
  "basicTierMultiplier": 1.0,
  "silverTierMultiplier": 1.5,
  "goldTierMultiplier": 2.0,
  "platinumTierMultiplier": 3.0
}
```

### Send Bill Email API
```
POST /api/orders/send-bill
Content-Type: application/json

{
  "customerEmail": "customer@example.com",
  "customerName": "John Doe",
  "cafeEmail": "owner@cafe.com",
  "cafeName": "Green Bowl Cafe",
  "billNumber": "BILL-001",
  "billItems": [
    {
      "name": "Masala Dosa",
      "price": "150",
      "quantity": 1
    }
  ],
  "subtotal": "150",
  "tax": "15",
  "discount": "10",
  "total": "155",
  "paymentMethod": "cash"
}

Expected Response:
{
  "success": true,
  "message": "Email sent successfully"
}
```

## 🗄️ Database Verification (When PostgreSQL Connected)

- [ ] Run: `npx prisma migrate dev --name initial_migration`
- [ ] Creates new tables:
  - [ ] `CustomerProfile` table exists
  - [ ] `GameConfig` table exists
  - [ ] `Game` table exists
  - [ ] `GamePlay` table exists
- [ ] `MenuItem` table has `aiVoiceText` column
- [ ] All relations are correct (foreign keys)
- [ ] Cascade delete works properly

## 🔐 Security Checks

- [ ] Super-admin routes return 404 (not found)
- [ ] Direct access to /api/super-admin returns 404
- [ ] Game play validation works (no cheating via API)
- [ ] Discount calculations are server-side verified
- [ ] Daily game limit enforced server-side
- [ ] Table sessions still protected
- [ ] Cafe data remains isolated per cafes

## 📧 Email Setup (Optional - For Email Testing)

1. [ ] Get Gmail account (or use your email service)
2. [ ] Generate app password:
   - Go to https://myaccount.google.com/apppasswords
   - Select Mail and Device (Windows Computer)
   - Copy password
3. [ ] Create `.env.local` in project root:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```
4. [ ] Restart dev server
5. [ ] Test "Send Bill Email" button
6. [ ] Check email inbox (and spam folder)

## 🎨 Visual Design Checks

- [ ] Dark theme with charcoal background (#1a1a1a)
- [ ] Paneer yellow text (#f0e68c)
- [ ] Red accent color (#a02618)
- [ ] White text for contrast
- [ ] Icons are visible and properly sized
- [ ] Animations are smooth (no stuttering)
- [ ] Modal overlays work correctly
- [ ] Forms are properly aligned
- [ ] Buttons have hover effects

## ⚡ Performance

- [ ] Home page loads in < 2 seconds
- [ ] Menu page loads in < 3 seconds
- [ ] GameHub renders without lag
- [ ] Clicking "Play Game" responds instantly
- [ ] AI voice starts within 1-2 seconds
- [ ] Owner dashboard responds to interactions

## 📝 Console Checks

- [ ] No JavaScript errors in browser console
- [ ] No 404 errors for assets
- [ ] API calls show proper responses
- [ ] No CORS errors
- [ ] No warnings about deprecated features

## 📱 Device Testing

- [ ] Test on iPhone (Safari)
- [ ] Test on Android (Chrome)
- [ ] Test on iPad/tablet
- [ ] Test on desktop (Windows/Mac)
- [ ] Test on different browsers:
  - [ ] Chrome
  - [ ] Safari
  - [ ] Firefox
  - [ ] Edge

## 🚀 Pre-Deployment

- [ ] All tests pass
- [ ] No console errors
- [ ] Build succeeds: `npm run build`
- [ ] All features working
- [ ] Ready for hosting
- [ ] Environment variables documented
- [ ] Database migration ready
- [ ] SMTP config optional (development uses test account)

## 📋 Documentation Review

- [ ] IMPLEMENTATION_SUMMARY.md is accurate
- [ ] FEATURES_GUIDE.md explains all features
- [ ] QR_SCANNER_HOSTING_GUIDE.md is clear
- [ ] Code comments are helpful
- [ ] API documentation is correct

---

## ✅ Sign-Off Checklist

Once all tests pass:
- [ ] Development complete
- [ ] Features verified
- [ ] Documentation complete
- [ ] Ready for production deployment
- [ ] Ready for customer use
- [ ] Ready for QR code generation
- [ ] Ready for hosting on Vercel/Railway/AWS

**Start Testing**: Open http://localhost:3000 in your browser now! 🚀
