# Hafez Exchange - Currency Exchange Platform

A modern, bilingual currency exchange platform built with Nuxt.js, Vue 3, and PrimeVue. This application provides real-time currency exchange rates and facilitates secure money transfers.

## 🌟 Features

- **Real-time Currency Exchange**: Live exchange rates for major currencies (USD, EUR, GBP, JPY, CHF)
- **Bilingual Support**: Full internationalization with English and Persian (Farsi) languages
- **User Authentication**: Secure login and registration system
- **User Verification**: Multi-level verification process for enhanced security
- **Recipient Management**: Save and manage multiple recipients for money transfers
- **Invoice Generation**: Create and track payment invoices
- **Responsive Design**: Mobile-first approach with beautiful, modern UI
- **RTL Support**: Full right-to-left layout support for Persian language

## 🚀 Tech Stack

- **Framework**: [Nuxt.js 4](https://nuxt.com/) (Vue 3)
- **UI Library**: [PrimeVue 4](https://primevue.org/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/)
- **Internationalization**: [@nuxtjs/i18n](https://i18n.nuxtjs.org/)
- **Icons**: 
  - [Material Design Icons](https://materialdesignicons.com/)
  - [Iconify](https://iconify.design/)
  - [Circle Flags](https://github.com/HatScripts/circle-flags)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Font**: [Vazirmatn](https://github.com/rastikerdar/vazirmatn) (Persian font)

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tsd.sarafihafez.web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   API_BASE_URL=your_api_base_url
   API_PROXY_PATH=your_proxy_path
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:4000`

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run generate` - Generate static site
- `npm run preview` - Preview production build
- `npm run postinstall` - Prepare Nuxt (runs automatically after install)

## 🏗️ Project Structure

```
tsd.sarafihafez.web/
├── app/
│   ├── assets/
│   │   └── css/           # Stylesheets (Tailwind, PrimeVue custom)
│   ├── components/        # Vue components
│   │   ├── AmountInput.vue
│   │   ├── AuthDialog.vue
│   │   ├── CurrencyDropdown.vue
│   │   ├── RecipientDialog.vue
│   │   └── ...
│   ├── composables/       # Vue composables
│   │   ├── useAuth.ts
│   │   ├── useCurrencyExchange.ts
│   │   ├── usePaymentFlow.ts
│   │   └── useRecipients.ts
│   ├── layouts/           # Nuxt layouts
│   ├── pages/             # Nuxt pages (routes)
│   ├── plugins/           # Nuxt plugins
│   └── utils/             # Utility functions
├── i18n/
│   └── locales/           # Translation files
│       ├── en-US.json
│       └── fa-IR.json
├── public/                # Static assets
│   ├── logo/
│   └── robots.txt
├── server/
│   ├── api/               # Server API routes
│   └── middleware/        # Server middleware
├── nuxt.config.js         # Nuxt configuration
├── tailwind.config.js     # Tailwind configuration
└── tsconfig.json          # TypeScript configuration
```

## 🎨 Key Components

### Core Components

- **CurrencyPairDisplay**: Displays the currency pair being exchanged
- **CurrencyDropdown**: Dropdown selector for currency selection
- **PriceCard**: Shows buy/sell prices for currencies
- **AmountInput**: Input field for amount to convert
- **TotalPayable**: Displays calculated total amount
- **AuthDialog**: Authentication modal (login/register)
- **RecipientDialog**: Recipient management modal
- **UserProfile**: User profile and verification status

### Composables

- **useAuth**: Authentication state and methods
- **useCurrencyExchange**: Currency exchange logic and calculations
- **usePaymentFlow**: Payment and invoice creation flow
- **useRecipients**: Recipient management
- **useInvoice**: Invoice handling

## 🌐 Internationalization

The application supports two languages:

- **English (en)**: Default language, LTR layout
- **Persian (fa)**: RTL layout with Persian fonts

Language detection is automatic based on browser settings, with fallback to English. The selected language is stored in cookies for persistence.

## 🎨 Theming

The application uses a custom PrimeVue Aura preset with:
- Primary color: Blue (customized)
- Warning color: Yellow
- Light color scheme
- Responsive design system

## 🔒 Security Features

- User authentication and session management
- Multi-level user verification system
- Secure API proxy middleware
- Environment-based configuration

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Generate Static Site

```bash
npm run generate
```

### Preview Production Build

```bash
npm run preview
```

## 🌍 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `API_BASE_URL` | Backend API base URL | Yes |
| `API_PROXY_PATH` | API proxy path for routing | No |

## 📱 Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- RTL support for Persian language

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary. All rights belong to Hafez Exchange.

## 👥 Support

For support, please contact the development team or open an issue in the repository.

---

**© All rights of this website belong to Hafez Exchange**
