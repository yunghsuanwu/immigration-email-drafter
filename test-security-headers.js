#!/usr/bin/env node

/**
 * Simple script to test security headers implementation
 * Run with: node test-security-headers.js
 */

const https = require('https');
const http = require('http');

const testUrl = process.argv[2] || 'http://localhost:3000';

console.log(`🔒 Testing security headers for: ${testUrl}\n`);

const expectedHeaders = {
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
  'referrer-policy': 'no-referrer',
  'content-security-policy': 'default-src \'self\'',
  'x-dns-prefetch-control': 'off',
};

const forbiddenHeaders = [
  'x-powered-by',
  'server'
];

function testHeaders(url) {
  const protocol = url.startsWith('https') ? https : http;
  
  protocol.get(url, (res) => {
    console.log(`📊 Status: ${res.statusCode}`);
    console.log(`📋 Headers received:\n`);
    
    let passedTests = 0;
    let totalTests = Object.keys(expectedHeaders).length + forbiddenHeaders.length;
    
    // Test expected headers
    Object.entries(expectedHeaders).forEach(([header, expectedValue]) => {
      const actualValue = res.headers[header];
      if (actualValue) {
        if (actualValue.includes(expectedValue)) {
          console.log(`✅ ${header}: ${actualValue}`);
          passedTests++;
        } else {
          console.log(`⚠️  ${header}: ${actualValue} (expected to contain: ${expectedValue})`);
        }
      } else {
        console.log(`❌ ${header}: MISSING`);
      }
    });
    
    // Test forbidden headers
    forbiddenHeaders.forEach(header => {
      if (res.headers[header]) {
        console.log(`❌ ${header}: ${res.headers[header]} (should be removed)`);
      } else {
        console.log(`✅ ${header}: Not present (good!)`);
        passedTests++;
      }
    });
    
    console.log(`\n📈 Security Score: ${passedTests}/${totalTests} (${Math.round(passedTests/totalTests*100)}%)`);
    
    if (passedTests === totalTests) {
      console.log('🎉 All security headers are properly configured!');
    } else {
      console.log('⚠️  Some security headers need attention.');
    }
    
  }).on('error', (err) => {
    console.error('❌ Error testing headers:', err.message);
    console.log('\n💡 Make sure your Next.js app is running:');
    console.log('   npm run dev');
  });
}

testHeaders(testUrl);
