const fs = require('fs');
const path = require('path');

const environmentProd = `
export const environment = {
  production: true,
  firebaseConfig: {
    apiKey: "${process.env.FIREBASE_API_KEY || 'AIzaSyDP0IyzW1288gpa9Dz-7rHx7LLiKb_CGa4'}",
    authDomain: "${process.env.FIREBASE_AUTH_DOMAIN || 'todo-pro-7b909.firebaseapp.com'}",
    projectId: "${process.env.FIREBASE_PROJECT_ID || 'todo-pro-7b909'}",
    storageBucket: "${process.env.FIREBASE_STORAGE_BUCKET || 'todo-pro-7b909.firebasestorage.app'}",
    messagingSenderId: "${process.env.FIREBASE_MESSAGING_SENDER_ID || '596023254829'}",
    appId: "${process.env.FIREBASE_APP_ID || '1:596023254829:web:6cf74d96882a751e03fda4'}"
  }
};
`;

const environmentDev = `
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "${process.env.FIREBASE_API_KEY || 'AIzaSyDP0IyzW1288gpa9Dz-7rHx7LLiKb_CGa4'}",
    authDomain: "${process.env.FIREBASE_AUTH_DOMAIN || 'todo-pro-7b909.firebaseapp.com'}",
    projectId: "${process.env.FIREBASE_PROJECT_ID || 'todo-pro-7b909'}",
    storageBucket: "${process.env.FIREBASE_STORAGE_BUCKET || 'todo-pro-7b909.firebasestorage.app'}",
    messagingSenderId: "${process.env.FIREBASE_MESSAGING_SENDER_ID || '596023254829'}",
    appId: "${process.env.FIREBASE_APP_ID || '1:596023254829:web:6cf74d96882a751e03fda4'}"
  }
};
`;

const envDir = path.join(__dirname, 'src', 'environments');
if (!fs.existsSync(envDir)) {
  fs.mkdirSync(envDir, { recursive: true });
}

fs.writeFileSync(path.join(envDir, 'environment.prod.ts'), environmentProd);
fs.writeFileSync(path.join(envDir, 'environment.ts'), environmentDev);

console.log('Environment files generated successfully!');