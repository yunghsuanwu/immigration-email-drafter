#!/usr/bin/env node

/**
 * Security Headers Testing Script
 * Tests the security headers implementation for the immigration email drafter
 * 
 * Usage:
 *   node test-security-headers.js [URL]
 *   node test-security-headers.js http://localhost:3000
 *   node test-security-headers.js https://your-production-domain.com
 */

const https = require('https');
const http = require('http');

const testUrl = process.argv[2] || 'http://localhost:3000';

console.log(`🔒 Testing security headers for: ${testUrl}\n`);

// Expected security headers
const expectedHeaders = {
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
  'referrer-policy': 'no-referrer',
  'content-security-policy': 'default-src \'self\'',
  'x-dns-prefetch-control': 'off',
};

// Headers that should NOT be present (security risk)
const forbiddenHeaders = [
  'x-powered-by',
  'server'
];

// Optional headers (good to have)
const optionalHeaders = {
  'strict-transport-security': 'max-age=',
  'permissions-policy': 'camera=(), microphone=(), geolocation=()'
};

function testHeaders(url) {
  const protocol = url.startsWith('https') ? https : http;
  
  protocol.get(url, (res) => {
    console.log(`📊 Status: ${res.statusCode}`);
    console.log(`📋 Headers received:\n`);
    
    let passedTests = 0;
    let totalTests = Object.keys(expectedHeaders).length + forbiddenHeaders.length;
    let optionalPassed = 0;
    
    // Test expected headers
    console.log('✅ REQUIRED SECURITY HEADERS:');
    Object.entries(expectedHeaders).forEach(([header, expectedValue]) => {
      const actualValue = res.headers[header];
      if (actualValue) {
        if (actualValue.includes(expectedValue)) {
          console.log(`   ✅ ${header}: ${actualValue}`);
          passedTests++;
        } else {
          console.log(`   ⚠️  ${header}: ${actualValue} (expected to contain: ${expectedValue})`);
        }
      } else {
        console.log(`   ❌ ${header}: MISSING`);
      }
    });
    
    // Test forbidden headers
    console.log('\n🚫 FORBIDDEN HEADERS (should be absent):');
    forbiddenHeaders.forEach(header => {
      if (res.headers[header]) {
        console.log(`   ❌ ${header}: ${res.headers[header]} (should be removed)`);
      } else {
        console.log(`   ✅ ${header}: Not present (good!)`);
        passedTests++;
      }
    });
    
    // Test optional headers
    console.log('\n🔧 OPTIONAL SECURITY HEADERS:');
    Object.entries(optionalHeaders).forEach(([header, expectedValue]) => {
      const actualValue = res.headers[header];
      if (actualValue) {
        if (actualValue.includes(expectedValue)) {
          console.log(`   ✅ ${header}: ${actualValue}`);
          optionalPassed++;
        } else {
          console.log(`   ⚠️  ${header}: ${actualValue} (expected to contain: ${expectedValue})`);
        }
      } else {
        console.log(`   ⚠️  ${header}: Not present (optional but recommended)`);
      }
    });
    
    // Security score calculation
    const securityScore = Math.round(passedTests/totalTests*100);
    const optionalScore = Math.round(optionalPassed/Object.keys(optionalHeaders).length*100);
    
    console.log(`\n📈 SECURITY SCORES:`);
    console.log(`   Required Headers: ${passedTests}/${totalTests} (${securityScore}%)`);
    console.log(`   Optional Headers: ${optionalPassed}/${Object.keys(optionalHeaders).length} (${optionalScore}%)`);
    
    // Overall assessment
    if (passedTests === totalTests) {
      console.log('\n🎉 All required security headers are properly configured!');
      if (optionalPassed === Object.keys(optionalHeaders).length) {
        console.log('🌟 Perfect security configuration!');
      } else {
        console.log('💡 Consider adding the optional security headers for enhanced protection.');
      }
    } else {
      console.log('\n⚠️  Some security headers need attention.');
      console.log('🔧 Check your middleware.ts and next.config.ts files.');
    }
    
    // CSP Analysis
    const csp = res.headers['content-security-policy'];
    if (csp) {
      console.log('\n🛡️  CSP ANALYSIS:');
      analyzeCSP(csp);
    }
    
  }).on('error', (err) => {
    console.error('❌ Error testing headers:', err.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Make sure your Next.js app is running: npm run dev');
    console.log('   2. Check if the URL is correct');
    console.log('   3. Verify your middleware.ts is in the root directory');
  });
}

function analyzeCSP(cspHeader) {
  const directives = cspHeader.split(';').map(d => d.trim());
  
  // Check for unsafe directives
  const unsafeDirectives = directives.filter(d => 
    d.includes('unsafe-inline') || d.includes('unsafe-eval')
  );
  
  if (unsafeDirectives.length > 0) {
    console.log('   ⚠️  Unsafe CSP directives found:');
    unsafeDirectives.forEach(d => console.log(`      - ${d}`));
    console.log('   💡 Consider using nonces or removing unsafe directives');
  } else {
    console.log('   ✅ No unsafe CSP directives found');
  }
  
  // Check for missing important directives
  const importantDirectives = ['default-src', 'script-src', 'style-src'];
  const missingDirectives = importantDirectives.filter(dir => 
    !directives.some(d => d.startsWith(dir))
  );
  
  if (missingDirectives.length > 0) {
    console.log('   ⚠️  Missing important CSP directives:');
    missingDirectives.forEach(d => console.log(`      - ${d}`));
  }
}

// Run the test
testHeaders(testUrl);
