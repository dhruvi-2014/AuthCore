const express = require('express');
const cors = require('cors');
require('dotenv').config();
const Auth = require('./index');
const SqliteStorageAdapter = require('./adapters/storage/sqlite');

const app = express();

const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: CORS_ORIGIN,
    credentials: true
}));

app.use(express.json());

const dbAdapter = new SqliteStorageAdapter();

const mockClaimsResolver = async (params) => {
    return { roles: ['user'], tenant: params.context?.tenant || 'default' };
};

const mockPolicyResolver = async ({ policy, claims, context }) => {
    return true;
};

const authSystem = Auth.init({
    storageAdapter: dbAdapter,
    claimsResolver: mockClaimsResolver,
    policyResolver: mockPolicyResolver,
    jwtSecret: process.env.JWT_SECRET || 'super-secret-demo-key-123',
    accessExpiry: process.env.ACCESS_EXPIRY || '1m',
    refreshExpiryMs: parseInt(process.env.REFRESH_EXPIRY_MS, 10) || 1000 * 60 * 60 * 24,
    trustJwtClaims: true
});

// In development, log password reset token so you can test without email
authSystem.onPasswordResetRequested(({ identifier, rawToken, expiresAt }) => {
    if (process.env.NODE_ENV !== 'production') {
        console.log('[Dev] Password reset requested for:', identifier);
        console.log('[Dev] Reset token (use in Reset Password form):', rawToken);
        console.log('[Dev] Expires at:', expiresAt);
    }
});

app.use('/auth', authSystem.router);

app.listen(PORT, () => {
    console.log(`Auth Engine server running on http://localhost:${PORT}`);
    console.log('✨ SQLite Database Storage Adapter is active.');
});
