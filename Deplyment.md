# **Deployment Plan**

✅ **Step 1: Verify IIIT-Delhi Hosting Server**  
First, check with your **college IT team or administrator** whether you have access to host your project on `https://cosylab.iiitd.edu.in/ratatouille/`.  
Ask these questions:

1. **What type of server is used?** (Apache, Nginx, or any cloud service)
2. **How can you upload files and configure the server?** (SSH, FTP, cPanel, etc.)
3. **Can the server run Node.js & React apps?**

---

## **Step 2: Prepare Your Backend for Deployment**

Your backend must be hosted on the IIIT-Delhi server so your frontend can fetch API data.

### **🔹 Option 1: Host Backend on IIITD Server**

1. **Connect to the server** (via SSH, FTP, or cPanel)
   - If SSH is available, use:
     ```bash
     ssh username@cosylab.iiitd.edu.in
     ```
2. **Upload backend code to the server** (using SCP, FTP, or a Git clone)
   ```bash
   scp -r /path/to/your/backend username@cosylab.iiitd.edu.in:/var/www/ratatouille-backend
   ```
3. **Install Node.js and dependencies**
   ```bash
   cd /var/www/ratatouille-backend
   npm install
   ```
4. **Run your backend using PM2 (to keep it running in the background)**
   ```bash
   npm install -g pm2
   pm2 start server.js --name ratatouille-backend
   pm2 save
   ```

📌 **Get the backend API URL** (Example: `https://cosylab.iiitd.edu.in/api/ratatouille`)

---

## **Step 3: Prepare Your React Frontend for Deployment**

Now that the backend is running, let’s prepare the frontend.

### **🔹 Modify `package.json` for Correct Deployment Path**

Since your project will be hosted at **`https://cosylab.iiitd.edu.in/ratatouille/`**, add this in `package.json`:

```json
"homepage": "https://cosylab.iiitd.edu.in/ratatouille"
```

---

### **🔹 Update API URLs in Your React App**

Modify `src/utils/api.js` to point to your deployed backend API:

```js
const BASE_URL = "https://cosylab.iiitd.edu.in/api/ratatouille";
export default BASE_URL;
```

---

### **🔹 Build the React App**

Run the build command:

```bash
npm run build
```

This creates a **`build/`** folder containing the static website.

---

## **Step 4: Deploy Frontend to IIITD Server**

Now, upload the **`build/`** folder to your hosting server.

### **🔹 Upload via SCP (Secure Copy)**

Run this command to upload the **build folder** to the server:

```bash
scp -r build/ username@cosylab.iiitd.edu.in:/var/www/ratatouille
```

### **🔹 Upload via SSH (Manual Method)**

1. Connect to the server:
   ```bash
   ssh username@cosylab.iiitd.edu.in
   ```
2. Navigate to the web root directory:
   ```bash
   cd /var/www/
   ```
3. Copy the `build/` folder there:
   ```bash
   mv ~/build ratatouille
   ```

---

## **Step 5: Configure the Server**

Your server needs to serve the React frontend and route API requests correctly.

### **🔹 If Using Apache**

1. Open the Apache config file:
   ```bash
   sudo nano /etc/apache2/sites-available/ratatouille.conf
   ```
2. Add this configuration:

   ```apache
   <VirtualHost *:80>
       ServerName cosylab.iiitd.edu.in
       DocumentRoot /var/www/ratatouille

       <Directory /var/www/ratatouille>
           Options Indexes FollowSymLinks
           AllowOverride All
           Require all granted
       </Directory>

       ProxyPass /api http://localhost:5000/
       ProxyPassReverse /api http://localhost:5000/
   </VirtualHost>
   ```

3. Restart Apache:
   ```bash
   sudo systemctl restart apache2
   ```

---

### **🔹 If Using Nginx**

1. Open the Nginx config file:
   ```bash
   sudo nano /etc/nginx/sites-available/ratatouille
   ```
2. Add this configuration:

   ```nginx
   server {
       listen 80;
       server_name cosylab.iiitd.edu.in;

       location / {
           root /var/www/ratatouille;
           index index.html;
           try_files $uri /index.html;
       }

       location /api/ {
           proxy_pass http://localhost:5000/;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

3. Restart Nginx:
   ```bash
   sudo systemctl restart nginx
   ```

---

## **Step 6: Final Testing**

✅ Open a browser and visit:  
🔗 **`https://cosylab.iiitd.edu.in/ratatouille/`**

### **✅ Checklist for a Successful Deployment**

✔ **Frontend Loads Correctly**  
✔ **Backend API Calls Work (`/api` is routed correctly)**  
✔ **No CORS Errors in Console**

---

## **🎯 Final Summary**

1. **Deploy Backend** (`/api/ratatouille`)
2. **Deploy Frontend** (`/ratatouille/`)
3. **Configure Apache/Nginx** to serve both
4. **Restart Server & Test**
