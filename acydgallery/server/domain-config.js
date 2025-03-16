/**
 * Domain Configuration for ACYD Gallery
 * This file contains settings for connecting your domain to the application
 * Import and use these settings in server.js when ready to go live
 */

// Domain settings
const domainSettings = {
  // Replace 'yourdomain.com' with your actual domain name
  domain: process.env.DOMAIN || 'yourdomain.com',
  
  // CORS settings for production
  corsOptions: {
    origin: function(origin, callback) {
      const allowedOrigins = [
        `https://${process.env.DOMAIN || 'yourdomain.com'}`,
        `https://www.${process.env.DOMAIN || 'yourdomain.com'}`
      ];
      
      // Check if origin is allowed or if it's undefined (like for same-origin requests)
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  },
  
  // SSL settings (for when you add SSL)
  sslSettings: {
    enabled: false, // Set to true when you have SSL certificates
    certPath: '/path/to/cert.pem',
    keyPath: '/path/to/key.pem'
  },
  
  // Redirect settings (e.g., www to non-www or vice versa)
  redirectSettings: {
    enabled: true,
    type: 'www-to-non-www', // or 'non-www-to-www'
  }
};

module.exports = domainSettings; 