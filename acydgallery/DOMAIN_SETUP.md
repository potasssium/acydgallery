# Domain Setup for ACYD Gallery

This guide will help you connect your domain name to your ACYD Gallery website without making it live yet.

## Prerequisites

- A registered domain name (e.g., acydgallery.com)
- Access to your domain's DNS settings (through your domain registrar like GoDaddy, Namecheap, etc.)
- A server or hosting service where you'll deploy your application

## Setup Options

There are two main approaches to connecting your domain without making the site fully live:

1. **Coming Soon Page**: Configure your domain to point to a server with a "coming soon" page
2. **Development Setup**: Configure your local development environment to use your domain for testing

## Option 1: Using the Deployment Script

We've created a deployment script that makes it easy to configure your domain:

1. Navigate to the server directory:
   ```
   cd acydgallery/server
   ```

2. Run the deployment script:
   ```
   node deploy.js
   ```

3. Follow the prompts to enter your domain name and configure your application.

4. When asked if you want to make the site live, select "No" to use the coming soon page.

## Option 2: Manual Setup

### Step 1: Update Environment Variables

1. Edit the `.env` file in the `acydgallery/server` directory:
   ```
   # Add these lines to your .env file
   DOMAIN=yourdomain.com
   NODE_ENV=development
   ```

2. Update the domain configuration in `domain-config.js`:
   ```javascript
   // Replace 'yourdomain.com' with your actual domain
   domain: process.env.DOMAIN || 'yourdomain.com',
   ```

### Step 2: DNS Configuration

1. Log in to your domain registrar's website (e.g., GoDaddy, Namecheap)
2. Find the DNS management section
3. Add the following records:

   **A Record**:
   - Host: @ (or leave blank)
   - Value: Your server's IP address
   - TTL: 3600 (or default)

   **CNAME Record**:
   - Host: www
   - Value: yourdomain.com (your root domain)
   - TTL: 3600 (or default)

### Step 3: Server Configuration

1. Install a web server like Nginx or Apache on your server
2. Configure it to serve the "coming soon" page:

   **Nginx Example**:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;
       
       root /path/to/acydgallery/public;
       index coming-soon.html;
       
       location / {
           try_files $uri $uri/ /coming-soon.html;
       }
   }
   ```

3. Restart your web server:
   ```
   sudo systemctl restart nginx
   ```

### Step 4: SSL Certificate (Optional but Recommended)

1. Install Certbot for Let's Encrypt:
   ```
   sudo apt-get install certbot python3-certbot-nginx
   ```

2. Obtain an SSL certificate:
   ```
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

3. Follow the prompts to complete the SSL setup

## Going Live

When you're ready to make your site live:

1. If using the deployment script, run it again with the production flag:
   ```
   node deploy.js --production
   ```

2. When prompted, choose to make the site live.

3. If you set up manually, update your web server configuration to serve your actual application instead of the coming soon page.

## Troubleshooting

- **DNS Propagation**: DNS changes can take 24-48 hours to fully propagate. Be patient if your domain doesn't work immediately.
- **SSL Issues**: If you're having trouble with SSL, make sure your server's firewall allows traffic on ports 80 and 443.
- **Server Errors**: Check your server logs for any errors in the configuration.

## Additional Resources

- [Digital Ocean: How to Point a Domain to a Server](https://www.digitalocean.com/community/tutorials/how-to-point-to-digitalocean-nameservers-from-common-domain-registrars)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [PM2 Process Manager](https://pm2.keymetrics.io/docs/usage/quick-start/) 