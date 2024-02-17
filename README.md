# Getder Backend

Welcome to the Getder backend repository! Getder is a Node.js-based application designed to revolutionize the ride-hailing experience by reintroducing negotiation-friendly features into the ride-hailing ecosystem.

**Features:**
- **Negotiation:** Getder allows passengers and drivers to engage in real-time negotiations regarding fares and ride conditions, restoring a sense of control and fairness to the fare determination process.
- **User Authentication:** Secure user authentication mechanisms ensure the safety and privacy of user data.
- **Real-time Communication:** Utilizing Socket.IO, Getder facilitates real-time communication between users, enabling seamless negotiation and interaction.
- **Integration with MongoDB:** Getder seamlessly integrates with MongoDB, providing a robust and scalable database solution for storing user data and ride information.

**Installation:**

1. Clone the repository:
   ```
   git clone https://github.com/Button-20/getder-backend.git
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Define the following environment variables:
     ```
     PORT=3000
     MONGODB_URI=your_mongodb_uri
     JWT_SECRET=your_jwt_secret
     ```

4. Start the server:
   ```
   npm start
   ```

**API Endpoints:**

- **POST /login:** Endpoint for user authentication and login.
- **POST /register:** Endpoint for user registration.
- **GET /user/profile:** Endpoint to fetch user profile information.
- **PUT /user/profile:** Endpoint to update user profile information.
- **POST /request/create:** Endpoint to create a ride request.
- **GET /request/:requestId:** Endpoint to retrieve a specific ride request.
- **PUT /request/:requestId:** Endpoint to update a ride request.
- **DELETE /request/:requestId:** Endpoint to cancel a ride request.

**Contributing:**

We welcome contributions from the community! Feel free to open issues, submit pull requests, or suggest new features.

1. Fork the repository.
2. Create your feature branch:
   ```
   git checkout -b feature/new-feature
   ```
3. Commit your changes:
   ```
   git commit -am 'Add new feature'
   ```
4. Push to the branch:
   ```
   git push origin feature/new-feature
   ```
5. Submit a pull request.

**License:**

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

**Acknowledgements:**

- Special thanks to the contributors and open-source community for their valuable contributions and support.

**Contact:**

For inquiries or support, please contact [jasonaddy51@gmail.com](mailto:jasonaddy51@gmail.com).

Thank you for choosing Getder! We hope you enjoy the ride. 🚗💨