/**
 * ACYD Gallery Deployment Script
 * 
 * This script helps with deploying the ACYD Gallery application.
 * It handles:
 * 1. Building the React application
 * 2. Setting up environment variables
 * 3. Configuring the server for production
 * 
 * Usage: node deploy.js [--production]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Configuration
const config = {
  isProduction: process.argv.includes('--production'),
  rootDir: path.join(__dirname, '..'),
  buildDir: path.join(__dirname, '..', 'build'),
  serverDir: __dirname,
  envFile: path.join(__dirname, '.env'),
  comingSoonPage: path.join(__dirname, '..', 'public', 'coming-soon.html'),
  indexFile: path.join(__dirname, '..', 'public', 'index.html')
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

/**
 * Main function to run the deployment process
 */
async function deploy() {
  console.log(`${colors.bright}${colors.cyan}=== ACYD Gallery Deployment ====${colors.reset}\n`);
  
  // Check if we're in production mode
  if (config.isProduction) {
    console.log(`${colors.yellow}Running in PRODUCTION mode${colors.reset}\n`);
  } else {
    console.log(`${colors.green}Running in DEVELOPMENT mode${colors.reset}\n`);
    console.log(`${colors.dim}Use --production flag to deploy for production${colors.reset}\n`);
  }
  
  // Get domain information
  const domain = await promptForInput('Enter your domain name (e.g., acydgallery.com): ');
  
  // Update environment variables
  await updateEnvFile(domain);
  
  // Build the React application if in production mode
  if (config.isProduction) {
    await buildReactApp();
  }
  
  // Configure the server
  await configureServer(domain);
  
  // Set up coming soon page if needed
  const useLiveSite = await promptForYesNo('Do you want to make the site live now? (y/n): ');
  
  if (!useLiveSite) {
    await setupComingSoonPage();
  }
  
  console.log(`\n${colors.bright}${colors.green}Deployment configuration completed!${colors.reset}\n`);
  
  // Show next steps
  showNextSteps(domain, useLiveSite);
  
  rl.close();
}

/**
 * Prompt for user input
 */
function promptForInput(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

/**
 * Prompt for yes/no input
 */
async function promptForYesNo(question) {
  const answer = await promptForInput(question);
  return answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes';
}

/**
 * Update the .env file with domain information
 */
async function updateEnvFile(domain) {
  console.log(`\n${colors.cyan}Updating environment variables...${colors.reset}`);
  
  try {
    // Read the current .env file
    let envContent = fs.readFileSync(config.envFile, 'utf8');
    
    // Update or add domain settings
    if (envContent.includes('DOMAIN=')) {
      envContent = envContent.replace(/DOMAIN=.*/, `DOMAIN=${domain}`);
    } else {
      envContent += `\n# Domain Configuration\nDOMAIN=${domain}`;
    }
    
    // Update NODE_ENV
    if (envContent.includes('NODE_ENV=')) {
      envContent = envContent.replace(/NODE_ENV=.*/, `NODE_ENV=${config.isProduction ? 'production' : 'development'}`);
    } else {
      envContent += `\nNODE_ENV=${config.isProduction ? 'production' : 'development'}`;
    }
    
    // Update FRONTEND_URL
    const frontendUrl = config.isProduction ? `https://${domain}` : 'http://localhost:3000';
    if (envContent.includes('FRONTEND_URL=')) {
      envContent = envContent.replace(/FRONTEND_URL=.*/, `FRONTEND_URL=${frontendUrl}`);
    } else {
      envContent += `\nFRONTEND_URL=${frontendUrl}`;
    }
    
    // Write the updated content back to the .env file
    fs.writeFileSync(config.envFile, envContent);
    
    console.log(`${colors.green}Environment variables updated successfully!${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}Error updating .env file: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

/**
 * Build the React application
 */
async function buildReactApp() {
  console.log(`\n${colors.cyan}Building React application...${colors.reset}`);
  
  try {
    // Navigate to the root directory and run the build command
    process.chdir(config.rootDir);
    execSync('npm run build', { stdio: 'inherit' });
    
    console.log(`${colors.green}React application built successfully!${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}Error building React application: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

/**
 * Configure the server for the domain
 */
async function configureServer(domain) {
  console.log(`\n${colors.cyan}Configuring server for domain: ${domain}${colors.reset}`);
  
  try {
    // Update domain-config.js
    const domainConfigPath = path.join(config.serverDir, 'domain-config.js');
    let domainConfigContent = fs.readFileSync(domainConfigPath, 'utf8');
    
    // Update domain value
    domainConfigContent = domainConfigContent.replace(/domain: process\.env\.DOMAIN \|\| '.*'/, `domain: process.env.DOMAIN || '${domain}'`);
    
    // Update allowed origins
    domainConfigContent = domainConfigContent.replace(/`https:\/\/\${process\.env\.DOMAIN \|\| '.*'}`/, `\`https://\${process.env.DOMAIN || '${domain}'}\``);
    domainConfigContent = domainConfigContent.replace(/`https:\/\/www\.\${process\.env\.DOMAIN \|\| '.*'}`/, `\`https://www.\${process.env.DOMAIN || '${domain}'}\``);
    
    // Write the updated content back to the domain-config.js file
    fs.writeFileSync(domainConfigPath, domainConfigContent);
    
    console.log(`${colors.green}Server configured successfully for domain: ${domain}${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}Error configuring server: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

/**
 * Set up the coming soon page
 */
async function setupComingSoonPage() {
  console.log(`\n${colors.cyan}Setting up coming soon page...${colors.reset}`);
  
  try {
    // Check if coming soon page exists
    if (!fs.existsSync(config.comingSoonPage)) {
      console.error(`${colors.red}Coming soon page not found at: ${config.comingSoonPage}${colors.reset}`);
      return;
    }
    
    // Create a backup of the index.html file if it exists
    if (fs.existsSync(config.indexFile)) {
      const backupPath = `${config.indexFile}.backup`;
      fs.copyFileSync(config.indexFile, backupPath);
      console.log(`${colors.green}Created backup of index.html at: ${backupPath}${colors.reset}`);
    }
    
    // Copy the coming soon page to index.html
    fs.copyFileSync(config.comingSoonPage, config.indexFile);
    
    console.log(`${colors.green}Coming soon page set up successfully!${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}Error setting up coming soon page: ${error.message}${colors.reset}`);
  }
}

/**
 * Show next steps for deployment
 */
function showNextSteps(domain, useLiveSite) {
  console.log(`\n${colors.bright}${colors.magenta}=== Next Steps ===${colors.reset}\n`);
  
  console.log(`${colors.cyan}1. DNS Configuration:${colors.reset}`);
  console.log(`   - Log in to your domain registrar (e.g., GoDaddy, Namecheap)`);
  console.log(`   - Set up an A record pointing to your server's IP address`);
  console.log(`   - Set up a CNAME record for 'www' pointing to your root domain (${domain})`);
  
  console.log(`\n${colors.cyan}2. Server Setup:${colors.reset}`);
  console.log(`   - Make sure your server has Node.js installed`);
  console.log(`   - Upload your application files to your server`);
  console.log(`   - Install dependencies with: npm install`);
  
  if (config.isProduction) {
    console.log(`\n${colors.cyan}3. Process Management:${colors.reset}`);
    console.log(`   - Install PM2: npm install -g pm2`);
    console.log(`   - Start your application: pm2 start server.js`);
    console.log(`   - Set up PM2 to start on boot: pm2 startup`);
    console.log(`   - Save the PM2 configuration: pm2 save`);
  }
  
  console.log(`\n${colors.cyan}4. Web Server Configuration:${colors.reset}`);
  console.log(`   - Install and configure Nginx or Apache as a reverse proxy`);
  console.log(`   - Set up SSL with Let's Encrypt for https://${domain}`);
  
  if (!useLiveSite) {
    console.log(`\n${colors.cyan}5. Going Live:${colors.reset}`);
    console.log(`   - When ready to go live, restore the original index.html from the backup`);
    console.log(`   - Or run this script again with the --production flag and choose to make the site live`);
  }
  
  console.log(`\n${colors.green}Your domain ${domain} is now configured for your ACYD Gallery application!${colors.reset}`);
}

// Run the deployment process
deploy().catch(error => {
  console.error(`${colors.red}Deployment failed: ${error.message}${colors.reset}`);
  process.exit(1);
}); 