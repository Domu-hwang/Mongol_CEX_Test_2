# Landing Module (Frontend)

## 1. Overview

The Landing module provides **public-facing pages** for marketing and information.

**Purpose:**
- Attract new users with compelling landing page
- Provide service information
- Display legal pages (terms, privacy)
- SEO-optimized public pages

**Scope:**
- ✅ Landing page with hero section
- ✅ Features showcase
- ✅ Terms of Service page
- ✅ Privacy Policy page
- ❌ Blog/News section
- ❌ Multilingual support

---

## 2. Structure

```
src/features/landing/
├── components/
│   ├── LandingPage.tsx          # Main landing page
│   ├── HeroSection.tsx          # Hero with CTA
│   ├── FeaturesSection.tsx      # Feature highlights
│   ├── CTASection.tsx           # Call-to-action
│   ├── Footer.tsx               # Site footer
│   ├── TermsPage.tsx            # Terms of service
│   └── PrivacyPage.tsx          # Privacy policy
│
└── types/
    └── index.ts
```

---

## 3. Key Components

### LandingPage

```typescript
export function LandingPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </div>
  );
}
```

### HeroSection

```typescript
export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-to-br from-blue-600 to-purple-700 text-white">
      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Trade Crypto in Mongolia
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Fast, secure, and reliable cryptocurrency exchange platform
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              variant="white"
              onClick={() => navigate('/register')}
            >
              Start Trading
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
```

### FeaturesSection

```typescript
export function FeaturesSection() {
  const features = [
    {
      icon: <Shield />,
      title: 'Secure',
      description: 'Bank-level security with encrypted transactions',
    },
    {
      icon: <Zap />,
      title: 'Fast',
      description: 'Instant order execution and real-time updates',
    },
    {
      icon: <Users />,
      title: 'Local',
      description: 'Built for the Mongolian market',
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose Us
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="text-center">
              <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## 4. Routes

```typescript
/              # Landing page
/terms         # Terms of service
/privacy       # Privacy policy
```

---

## 5. SEO Considerations

```typescript
// Use React Helmet for meta tags
<Helmet>
  <title>CEX Pilot - Crypto Trading in Mongolia</title>
  <meta name="description" content="..." />
  <meta property="og:title" content="..." />
</Helmet>
```

---

## 6. Related Documents

- `../README.md` - Frontend patterns
- `auth.md` - Registration/login flow
