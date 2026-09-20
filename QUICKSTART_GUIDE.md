# Quick Start & Troubleshooting Guide

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+ (check: `node --version`)
- PostgreSQL database (or use free tier at neon.tech, railway.app)
- Gmail account (for email features - optional, can use test account)
- Modern web browser (Chrome, Safari, Firefox, Edge)

### 2. Installation (5 minutes)
```bash
# Navigate to project
cd c:\CAFE

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Start development server
npm run dev
```

### 3. Access Application
- **Home**: http://localhost:3000
- **Customer Menu**: http://localhost:3000/green-bowl?table=7
- **Owner Dashboard**: http://localhost:3000/green-bowl/owner (then Ctrl+Shift+C)

### 4. Create Test Data
1. Open http://localhost:3000/green-bowl/owner
2. Create cafe with sample menu items
3. Press Ctrl+Shift+C to access owner dashboard
4. Go to "Games & Discounts" tab
5. Create a game (Wheel, Dice, Cards, or Spin)
6. Set discount configuration

### 5. Test All Features
- Play a game as customer
- Click AI voice button on menu items
- Use owner dashboard to send bill email
- Check QR scanner guide (? button)

## 📊 Environment Setup

### Development (No Database Required Initially)
```bash
# Just run dev server
npm run dev
# Uses in-memory data or returns sample responses
```

### Production (Requires PostgreSQL)

#### Option 1: Use Neon (Easiest - Free Tier)
1. Go to https://neon.tech
2. Sign up (free)
3. Create project
4. Copy connection string
5. In `.env.local`:
   ```
   DATABASE_URL="your-neon-connection-string"
   ```
6. Run migration:
   ```bash
   npx prisma migrate deploy
   ```

#### Option 2: Use Railway (Free Credits)
1. Go to https://railway.app
2. Sign up (free)
3. Create PostgreSQL service
4. Copy DATABASE_URL
5. Same steps as Neon above

#### Option 3: Local PostgreSQL
```bash
# Install PostgreSQL
# Create database
createdb cafe_saas

# In .env.local
DATABASE_URL="postgresql://user:password@localhost:5432/cafe_saas"

# Run migration
npx prisma migrate deploy
```

## 🎮 Game System Setup

### For Owners:
1. Access Owner Dashboard (Ctrl+Shift+C)
2. Go to "Games & Discounts" tab
3. Configure:
   - Games per customer per day: 1-10 (suggested: 2)
   - Max discount %: 5-50% (suggested: 30%)
   - Max discount ₹: 100-5000 (suggested: 2000)
   - Tier multipliers: Basic 1.0, Gold 3.0 (customize as needed)
4. Create games:
   - Name: "Lucky Wheel", "Dice Roll", "Card Pick", "Spin to Win"
   - Type: wheel, dice, cards, spin
   - Description: "Spin the wheel for a chance to win big!"
   - Keep isActive checked

### Game Logic:
- Customer plays 1 game per menu visit
- 50% win rate (configurable in `src/app/api/games/play/route.ts`)
- Discount = Math.random() * maxDiscountPercentage * tierMultiplier
- Applied automatically at checkout
- Daily limit prevents abuse

## 📧 Email Configuration

### Option 1: Gmail (Recommended)
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer"
3. Generate password
4. Add to `.env.local`:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```
5. Restart dev server

### Option 2: Other Email Services
```env
# Outlook
SMTP_HOST=outlook.office365.com
SMTP_PORT=587

# SendGrid (requires API key conversion)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key

# Mailgun
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
```

### Option 3: Test Email (Development Only)
- No configuration needed
- Uses Ethereal Email (temporary service)
- Emails saved but not actually sent
- Check server logs for "test email" links

## 🔊 AI Voice Features

### Browser Support:
- ✅ Chrome/Chromium (100%)
- ✅ Safari (100%)
- ✅ Firefox (95%)
- ✅ Edge (100%)
- ⚠️ Mobile Safari (requires user gesture first)

### Voice Settings:
- Language: Auto-detected from browser settings
- Speed: Normal (1x)
- Pitch: Normal
- Volume: Device volume

### Customization:
Edit `src/components/MenuItemWithVoice.tsx`:
```typescript
utterance.rate = 1.0;      // Speed (0.1 - 10)
utterance.pitch = 1.0;     // Pitch (0 - 2)
utterance.volume = 1.0;    // Volume (0 - 1)
```

## 🔐 Security Considerations

### Never Expose in Code:
- ❌ SMTP_PASS
- ❌ DATABASE_URL
- ❌ API_KEYS
- ❌ SECRET_TOKENS

### Use `.env.local`:
```bash
# Create .env.local (git-ignored)
SMTP_HOST=...
SMTP_PASS=...
DATABASE_URL=...
```

### Super-Admin Removed:
- ✅ No super-admin endpoints
- ✅ No super-admin dashboard
- ✅ Reduces attack surface
- ✅ More secure multi-tenant

## 🐛 Common Issues & Solutions

### Issue: "Database not connected"
**Symptom**: Menu doesn't load, 500 errors
**Solution**:
```bash
# Check DATABASE_URL in .env.local
# If not set, that's OK for testing

# Create PostgreSQL database
# Update DATABASE_URL
# Run migration
npx prisma migrate deploy
```

### Issue: "Email not sending"
**Symptom**: "Send Bill Email" button doesn't work
**Solution**:
```bash
# Check SMTP settings in .env.local
# Gmail: Generate app password (not regular password)
# Restart dev server after env changes

# Test SMTP connection:
npx ts-node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});
transporter.verify((error, success) => {
  if (error) console.log('Error:', error);
  else console.log('SMTP connection OK');
  process.exit(0);
});
"
```

### Issue: "AI Voice not working"
**Symptom**: No audio when clicking Listen button
**Solution**:
1. Check browser console for errors
2. Allow audio in browser permissions
3. Volume not muted
4. Not supported in this browser:
   - Try Chrome, Safari, or Firefox instead
   - Edge works too
5. Network issue:
   - Works offline (no API needed)
   - Just uses browser APIs

### Issue: "Games not appearing"
**Symptom**: GameHub shows but no games in dropdown
**Solution**:
1. Create games in Owner Dashboard first
2. Check database connection
3. Games must have isActive = true
4. Clear browser cache (Ctrl+Shift+Delete)

### Issue: "Build fails with TypeScript errors"
**Symptom**: `npm run build` exits with errors
**Solution**:
```bash
# Regenerate Prisma client
npx prisma generate

# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Try build again
npm run build
```

### Issue: "Port 3000 already in use"
**Symptom**: "Port already in use" error
**Solution**:
```bash
# Kill existing process
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
npm run dev -- -p 3001
```

### Issue: "Middleware not working"
**Symptom**: Routes not protected or accessible
**Solution**:
1. Check `src/middleware.ts` exists
2. Verify Next.js version >= 12.2
3. middleware.ts must be in src/ root
4. No .next in path

## 📈 Performance Optimization

### Recommended Settings:
```bash
# .env.local optimization settings
NODE_ENV=production       # Use production mode
NEXT_PUBLIC_DEBUG=false   # Disable debug output
```

### Build Optimization:
```bash
# Create optimized build
npm run build

# Build size:
# home: ~96KB (good)
# owner dashboard: ~191KB (acceptable)
# API routes: ~0KB (serverless)
```

### Database Optimization:
```bash
# Create indexes for frequently queried fields
# In prisma/schema.prisma:
@@index([cafeId])
@@index([customerEmail])
```

## 🌐 Deployment Checklist

### Pre-Deployment:
- [ ] Build succeeds: `npm run build`
- [ ] No console errors
- [ ] All features tested
- [ ] Database migration ready
- [ ] Environment variables documented
- [ ] SMTP configured (if using email)

### Deploy to Vercel (Recommended):
```bash
# 1. Push to GitHub
git push origin main

# 2. Go to vercel.com
# 3. Import repository
# 4. Add environment variables:
# - DATABASE_URL
# - SMTP_HOST
# - SMTP_PORT
# - SMTP_USER
# - SMTP_PASS

# 5. Deploy
# 6. Get URL: yourdomain.vercel.app
```

### Deploy to Railway:
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Connect project
railway init

# 4. Add PostgreSQL service
railway add --service postgres

# 5. Set environment variables
railway variables set SMTP_HOST=...

# 6. Deploy
railway up
```

## 📞 Support Resources

### Documentation:
- `/IMPLEMENTATION_SUMMARY.md` - Full feature list
- `/FEATURES_GUIDE.md` - Customer & owner guide
- `/QR_SCANNER_HOSTING_GUIDE.md` - QR setup guide
- `/TESTING_CHECKLIST.md` - Testing procedures

### External Resources:
- Next.js: https://nextjs.org/docs
- Prisma: https://prisma.io/docs
- Nodemailer: https://nodemailer.com
- Web Speech API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API

### Emergency Contacts:
- Next.js Discord: https://discord.gg/nextjs
- Prisma Community: https://www.prisma.io/community
- Stack Overflow: Tag with [next.js] [prisma] [nodejs]

## 📋 Maintenance

### Regular Checks:
```bash
# Update dependencies
npm update

# Check for vulnerabilities
npm audit

# Run tests (if added)
npm test

# Format code
npm run format

# Lint code
npm run lint
```

### Database Maintenance:
```bash
# View schema
npx prisma studio

# Create new migration
npx prisma migrate dev --name migration_name

# Reset database (development only!)
npx prisma migrate reset

# Check migration status
npx prisma migrate status
```

## 🎓 Learning Path

1. **Week 1**: Basic setup, test home page
2. **Week 2**: Customer experience (menu, AI voice, games)
3. **Week 3**: Owner dashboard, configuration
4. **Week 4**: Email setup, bill sending
5. **Week 5**: QR code generation and testing
6. **Week 6**: Deploy to Vercel
7. **Week 7**: Go live with customers!

---

## ✅ You're Ready!

The application is built and running. Start testing at:
### http://localhost:3000

**Next Step**: Complete the Testing Checklist in TESTING_CHECKLIST.md
