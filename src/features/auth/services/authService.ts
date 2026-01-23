// Mock authentication service
// In a real application, this would interact with a backend API.

interface User {
    id: string;
    username: string;
    token: string;
    isKycCompleted?: boolean; // Add optional isKycCompleted property
}

// In-memory user store for mock service
const users: Record<string, { password: string, isKycCompleted: boolean }> = {
    'existing@example.com': { password: 'TestPassword123!', isKycCompleted: true }, // An existing user with KYC completed
};

const authService = {
    async login(username: string, password: string): Promise<User> {
        console.log(`Attempting login for: ${username}`);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const storedUser = users[username];
                if (storedUser && storedUser.password === password) {
                    console.log(`Login successful for: ${username}`);
                    resolve({ id: '1', username, token: 'mock-jwt-token', isKycCompleted: storedUser.isKycCompleted });
                } else {
                    console.log(`Login failed for: ${username} - Invalid credentials.`);
                    reject(new Error('Invalid username or password'));
                }
            }, 500);
        });
    },

    async register(username: string, password: string): Promise<User> {
        console.log(`Attempting registration for: ${username}`);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (users[username]) {
                    console.log(`Registration failed for: ${username} - User already exists.`);
                    reject(new Error('User already exists'));
                } else {
                    // For new users, ensure isKycCompleted is explicitly false
                    users[username] = { password: password, isKycCompleted: false };
                    console.log(`Registration successful for: ${username}`);
                    resolve({ id: 'new-user', username, token: 'mock-jwt-token-new', isKycCompleted: false });
                }
            }, 500);
        });
    },

    async completeKyc(profileData: any): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('KYC Data submitted:', profileData);
                // In a real app, this would update the user's KYC status in the backend.
                // For mock, find the user and update their status.
                const userEntry = users[profileData.username];
                if (userEntry) {
                    userEntry.isKycCompleted = true;
                }
                resolve(true); // Simulate successful KYC
            }, 1000);
        });
    },

    async sendOtp(identifier: string): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`OTP sent to ${identifier}`);
                resolve(true); // Simulate successful OTP send
            }, 500);
        });
    },

    async verifyOtp(identifier: string, otp: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (otp === '123456') { // Mock OTP for testing
                    console.log(`OTP ${otp} verified for ${identifier}`);
                    resolve(true);
                } else {
                    reject(new Error('Invalid OTP'));
                }
            }, 500);
        });
    },

    async logout(): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('User logged out');
                resolve();
            }, 200);
        });
    },
};

export default authService;
