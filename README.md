# Bosowa Bandar Group Web Profile

A lightweight, high-performance company profile website for **Bosowa Bandar Group** (BBI) and its business units. Built with Node.js, Express, and EJS, optimized for speed and security on aaPanel/VPS environments.

## 🚀 Key Features

*   **Multi-Language Support**: Full bilingual support (Indonesian/English) for all pages including dynamic content.
*   **Business Unit Structure**: Dedicated pages for PT Bosowa Bandar Indonesia, Bosowa Bandar Agensi, and Jasa Pelabuhan Indonesia.
*   **Admin Panel**:
    *   Secure Login/Logout with `bcrypt`.
    *   News Management (CRUD) with Rich Text Editor (Quill.js).
    *   Office Branch Management (CRUD) with Google Maps embedding.
    *   Comment Moderation System.
    *   Site Settings Management.
*   **Performance Optimized**:
    *   **Gzip Compression**: Reduces file sizes by up to 70%.
    *   **Browser Caching**: Static assets cached for 1 day.
    *   **SQL Optimization**: efficient queries fetching only required columns.
    *   **Production Mode**: Pre-configured scripts for optimized runtime.
*   **Security Enhanced**:
    *   **Helmet**: Sets secure HTTP headers.
    *   **Rate Limiting**: Protects against brute-force/DDoS (100 req/15min).
    *   **Trust Proxy**: Configured for Nginx/Reverse Proxies (aaPanel).
*   **Responsive Design**: Mobile-friendly navigation, sticky header, and touch-swipe capablities.

## 🛠️ Technology Stack

*   **Runtime**: Node.js (Express.js)
*   **View Engine**: EJS (Embedded JavaScript)
*   **Database**: MySQL (via `mysql2` library)
*   **Session Store**: MySQL Session Store (`express-mysql-session`)
*   **Styling**: Custom CSS (No heavy frameworks like Bootstrap/Tailwind runtime overhead)
*   **Dependencies**: `compression`, `helmet`, `morgan`, `express-rate-limit`, `dotenv`, `multer`.

## 📦 Installation (Local Development)

1.  **Clone Repository**
    ```bash
    git clone https://github.com/your-repo/bbi-web.git
    cd bbi-web
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory:
    ```env
    PORT=
    DB_HOST=
    DB_USER=
    DB_PASS=
    DB_NAME=
    SESSION_SECRET=
    NODE_ENV=
    ```

4.  **Setup Database**
    Create a MySQL database named `bbi_db`. The application will **automatically** create necessary tables on the first run.

5.  **Run Application**
    ```bash
    npm run dev
    # Runs with nodemon for auto-reload
    # Access at http://localhost:3000
    ```

## 🌐 Deployment Logic (aaPanel / VPS)

This project is optimized for deployment on Linux servers (Ubuntu/CentOS) using process managers like **PM2**.

### 1. Environment Setup
On your server (e.g., in `.env` file), ensure you set:
```env
NODE_ENV=production
```
This enables view caching, disables verbose error messages, and optimizes Express performance.

### 2. Startup Command
Use the production-ready script:
```bash
npm run start:prod
# OR direct PM2 command:
pm2 start src/server.js --name "bbi-web" --env production
```

### 3. Nginx Configuration (Reverse Proxy)
If using Nginx (default in aaPanel), add this to your configuration to handle static files and proxy correctly:
```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```
*Note: The app is already configured with `app.set('trust proxy', 1)` to handle IP addresses correctly behind Nginx.*

## 📂 Project Structure

```
bbi-web/
├── public/             # Static assets (css, js, images, uploads)
│   ├── css/            # Global styles
│   ├── images/         # Site assets
│   ├── js/             # Client-side logic (main.js)
│   └── uploads/        # User uploaded content (news images)
├── src/
│   ├── config/         # Database configuration
│   ├── routes/         # Express routes (admin, public, news)
│   ├── views/          # EJS Templates
│   │   ├── admin/      # Back-office views
│   │   ├── partials/   # Reusable components (header, footer)
│   │   └── ...         # Public pages
│   └── server.js       # App entry point
├── .env                # Environment variables
└── package.json        # Dependencies & Scripts
```

## 📝 Recent Updates (Changelog)

*   **Fixed Comment Redirect**: Solved issue where submitting comments redirected to `undefined` or Home. Now correctly redirects back to the specific article slug.
*   **Favicon**: Added consistent favicon support across all pages including Admin and stand-alone Business Unit pages.
*   **Security & Performance**: Integrated `helmet` for headers, `compression` for Gzip, and `express-rate-limit` for API protection.
*   **Mobile UX**: Improved mobile navbar interaction and carousel touch support.

---
© 2024 Bosowa Bandar Group. All Rights Reserved.
