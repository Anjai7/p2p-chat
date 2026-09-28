# AnonChat

## Project Description

AnonChat is a frictionless, anonymous, peer-to-peer (P2P) chat and file-sharing application that runs entirely in the web browser. 

**What problem it solves:** Traditional messaging applications route all conversations and files through centralized servers. This requires user accounts, stores sensitive metadata, and creates artificial bottlenecks (such as file size limits) when uploading and downloading data.

**Why it is useful:** AnonChat leverages WebRTC to create a direct **Full Mesh Network** between users. Once connected via a simple 5-digit room code, all messages and file transfers flow directly from browser to browser. Nothing is ever stored on a central server, ensuring absolute privacy and allowing you to utilize your maximum internet bandwidth for transferring massive files. 

## Features

* **True Mesh P2P Architecture:** Connect multiple users in a single room where everyone maintains a direct, encrypted connection to everyone else.
* **Serverless Signaling Router:** Uses lightweight Vercel Edge functions and a Redis database to automate the complex WebRTC connection handshake seamlessly.
* **End-to-End Encrypted:** Because data flows over WebRTC DataChannels, everything is encrypted by default using DTLS and SRTP.
* **Unlimited File Sharing:** Bypass server upload limits and transfer massive files directly to your peers.
* **Premium Glassmorphic UI:** A modern, fully responsive dark-mode interface built with deep CSS variables and fluid animations.
* **No Sign-ups Required:** 100% anonymous. Just enter a display name and start chatting instantly.

## How it Works (Architecture)

AnonChat uses Vercel Edge functions and Redis as a stateless signaling server to exchange initial connection data. Once peers are connected, all chat and file data routes directly between browsers locally.

```mermaid
sequenceDiagram
    participant A as User A
    participant Server as Vercel + Redis (Signaling)
    participant B as User B
    participant C as User C

    Note over A: Creates Room
    A->>Server: POST /api/create-room
    Server-->>A: Base Code (e.g. '12345')
    
    Note over B: Joins Room
    B->>Server: POST /api/join-room ('12345')
    Server-->>A: Signal: peer-joined
    
    Note over A, B: Auto WebRTC Handshake
    A->>Server: POST /api/send-signal (Offer)
    Server-->>B: Signal: offer
    B->>Server: POST /api/send-signal (Answer)
    Server-->>A: Signal: answer
    
    Note over A, B: 🔒 Direct P2P Connection Established

    Note over C: Joins Room
    C->>Server: POST /api/join-room ('12345')
    
    Note over Server: Broadcasts to all users
    Server-->>A: Signal: peer-joined
    Server-->>B: Signal: peer-joined
    
    Note over A, C: Exchange Offers/Answers via Signals
    Note over B, C: Exchange Offers/Answers via Signals
    
    Note over A, C: 🌐 Full Mesh Network Created!
```

## Demo / Screenshots

![AnonChat UI](https://via.placeholder.com/1000x500.png?text=AnonChat+Premium+Glassmorphic+UI)
*(Note: Replace this placeholder with actual screenshots of your application)*

## Installation

To run AnonChat locally on your machine, you will need Node.js, the Vercel CLI, and a Redis database (such as a free [Upstash](https://upstash.com/) instance).

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Anjai7/Anonymous_p2p_chaT.git
   cd Anonymous_p2p_chaT
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and add your Redis Connection URL:
   ```env
   REDIS_URL="redis://default:YOUR_PASSWORD@your-redis-url.com:PORT"
   ```

4. **Start the local development server:**
   ```bash
   vercel dev
   ```

## Usage

1. Open `http://localhost:3000` in your web browser.
2. Under the **Start a Room** section, click **Create Room**. A 5-digit room code will be generated.
3. Share this 5-digit room code with your friends.
4. Your friends can open the app, enter the code under the **Join a Room** section, and click **Join Room**.
5. Once connected, the chat interface will appear, and you can instantly send P2P messages and drag-and-drop files.

## Project Structure

* `/api/`: Contains the Vercel Serverless Functions (`create-room.js`, `join-room.js`, `send-signal.js`, `poll-signals.js`) that act as a stateless mailbox router for WebRTC connection data.
* `app.js`: The core frontend client logic. It manages the dynamic generation of `RTCPeerConnection` objects for the mesh network, handles data channels, and controls the UI state.
* `index.html`: The main semantic HTML structure of the application.
* `style.css`: The styling rules, featuring responsive layouts and a comprehensive Glassmorphic design system.
* `DEPLOYMENT.md`: Dedicated guide for deploying the application to production via Vercel.

## Technologies Used

* **Frontend:** HTML5, CSS3 (Vanilla), JavaScript (Vanilla ES6+)
* **Networking:** WebRTC (`RTCPeerConnection`, `RTCDataChannel`)
* **Backend API:** Vercel Serverless/Edge Functions (Node.js)
* **Database:** Redis (via the `ioredis` package) for ephemeral signal queueing

## Contributing

Contributions are always welcome! If you would like to improve AnonChat:

1. Fork the repository.
2. Create a new feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add some amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request for review.

## Author

Created by [Anjai7](https://github.com/Anjai7)





