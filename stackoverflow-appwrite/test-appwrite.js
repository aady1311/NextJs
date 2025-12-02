// Simple test to check Appwrite connectivity
const { Client, Account } = require('appwrite');

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('6918a9cd002ea71f60fe');

const account = new Account(client);

async function testConnection() {
    try {
        console.log('Testing Appwrite connection...');
        const session = await account.getSession('current');
        console.log('Connection successful, session found:', session);
    } catch (error) {
        console.log('Connection test result:', {
            message: error.message,
            code: error.code,
            type: error.type
        });
        
        // This is expected if no session exists
        if (error.code === 401) {
            console.log('✅ Connection is working (no active session is normal)');
        } else {
            console.log('❌ Connection failed');
        }
    }
}

testConnection();