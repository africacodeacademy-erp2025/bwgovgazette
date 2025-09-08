# govgazette 

**govgazette** is a modern, comprehensive digital platform for managing and distributing official government gazettes and public notices. Built with React, TypeScript, and Tailwind CSS, it provides seamless access to governmental publications for citizens and administrative management for officials.

## Features

### For Citizens
- ** Browse Gazettes**: Easy access to all published gazettes with advanced search and filtering
- ** Smart Search**: Find specific notices by title, category, date, or keywords  
- ** Responsive Design**: Fully optimized for desktop, tablet, and mobile devices
- ** Download Center**: Direct download access to official documents
- ** Category Organization**: Browse by Infrastructure, Legal, Environment, Health, Education, and Finance

### For Administrators
- ** Content Management**: Create new gazettes with rich text editor
- ** Document Upload**: Drag-and-drop file upload with automatic processing
- ** Analytics Dashboard**: Track downloads, user engagement, and publication metrics
- ** User Management**: Monitor active users and system activity
- ** Notification System**: Real-time alerts for pending approvals and system updates
- ** Quick Actions**: Streamlined workflow for publishing and managing content

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Shadcn/ui component library
- **Animations**: Framer Motion for smooth interactions
- **Icons**: Lucide React icon library
- **Routing**: React Router DOM
- **State Management**: TanStack Query for server state
- **Build Tool**: Vite for fast development and builds

##  Project Structure

```
govgazette/
├── src/
│   ├── components/
│   │   ├── admin/           # Admin-specific components
│   │   │   ├── CreateGazetteDialog.tsx
│   │   │   └── UploadDocumentDialog.tsx
│   │   ├── auth/            # Authentication components  
│   │   │   └── AuthUI.tsx
│   │   └── ui/              # Reusable UI components
│   ├── pages/               # Page components
│   │   ├── Index.tsx        # Homepage
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminLogin.tsx
│   │   ├── AdminSignup.tsx
│   │   ├── TenderView.tsx
│   │   └── NotFound.tsx
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   └── main.tsx            # Application entry point
├── public/                  # Static assets
└── package.json            # Dependencies and scripts
```

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/govgazette.git
   cd govgazette
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or  
   bun dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173` to view the application

## Design System

govgazette uses a comprehensive design system built on Tailwind CSS:

- **Colors**: Semantic color tokens for consistent theming
- **Typography**: Responsive font scales and weights
- **Components**: Reusable UI components with variants
- **Animations**: Smooth transitions and micro-interactions
- **Dark Mode**: Full support for light and dark themes

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality

## Admin Access

The admin dashboard provides comprehensive management tools:

- **URL**: `/admin/dashboard`
- **Login**: `/admin/login`  
- **Signup**: `/admin/signup`

### Admin Features
- Create and publish gazettes
- Upload documents with drag-and-drop
- Monitor system analytics
- Manage user permissions
- Real-time notifications

## API Integration

govgazette is designed to integrate with government backend systems:

- **RESTful API**: Standard HTTP methods for CRUD operations
- **Authentication**: Secure admin authentication system
- **File Upload**: Support for PDF, DOC, DOCX document formats
- **Search API**: Advanced search and filtering capabilities

## Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile Browsers**: iOS Safari, Chrome Mobile, Samsung Internet
- **Progressive Web App**: PWA capabilities for mobile installation

## Contributing

We welcome contributions to improve govgazette:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:

- **Documentation**: [https://docs.govgazette.gov](https://docs.govgazette.gov)
- **Issues**: Create an issue on GitHub
- **Email**: support@govgazette.gov

## Deployment

### Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to hosting platform**
   - Vercel: `vercel deploy`
   - Netlify: Drag and drop `dist` folder
   - GitHub Pages: Enable in repository settings

### Environment Variables

Create a `.env` file for environment-specific configuration:

```env
VITE_API_BASE_URL=https://api.govgazette.gov
VITE_APP_NAME=govgazette
VITE_CONTACT_EMAIL=support@govgazette.gov
```

##  Roadmap

### Upcoming Features
- [ ] Multi-language support
- [ ] Advanced search with AI
- [ ] Email notification subscriptions  
- [ ] Mobile app (React Native)
- [ ] API documentation portal
- [ ] Automated gazette generation
- [ ] Integration with e-signature systems

---

**govgazette** - Empowering transparent government communication through digital innovation.

