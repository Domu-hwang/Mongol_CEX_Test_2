// Mock authentication service
// In a real application, this would interact with a backend API.

interface User {
    id: string;
    username: string;
    token: string;
}

const users: Record<string, string> = {
    'user@example.com': 'password123',
};

const authService = {
    async login(username: string, password: string): Promise<User> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (users[username] === password) {
                    resolve({ id: '1', username, token: 'mock-jwt-token' });
                } else {
                    reject(new Error('Invalid username or password'));
                }
            }, 500);
        });
    },

    async register(username: string, password: string): Promise<User> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (users[username]) {
                    reject(new Error('User already exists'));
                } else {
                    users[username] = password;
                    resolve({ id: 'new-user', username, token: 'mock-jwt-token-new' });
                }
            }, 500);
        });
    },

    async completeKyc(profileData: any): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('KYC Data submitted:', profileData);
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
