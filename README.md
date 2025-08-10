# Chat System (WhatsApp Clone)

A real-time chat application built using **React**, **Node.js**, **Express**, **Socket.io**, and **MongoDB**.

---

## Features
- Real-time messaging with Socket.io
- Two-way communication between client and server
- Typing indicators
- Message status updates (sent, delivered, read)
- Stores messages in MongoDB
- Responsive design

---

## Tech Stack
**Frontend:** React, CSS  
**Backend:** Node.js, Express.js  
**Real-time:** Socket.io  
**Database:** MongoDB (Atlas)  

---

## Folder Structure
project/
│── client/ # React frontend
│── server/ # Express backend
│── .gitignore # Ignored files list

## Install dependencies
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

## Create .env file in server/ and add
MONGO_URI=your_mongo_connection_string
PORT=5000

## Run the application
# Start backend
cd server
npm start

# Start frontend
cd ../client
npm start

## 📷 Screenshots

<img width="1917" height="956" alt="image" src="https://github.com/user-attachments/assets/c10f5335-50e5-42f8-9760-9c77c6466d21" />

