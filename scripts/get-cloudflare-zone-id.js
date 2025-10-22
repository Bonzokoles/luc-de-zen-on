#!/usr/bin/env node
/**
 * Skrypt do pobrania Zone ID z Cloudflare API
 * Wymaga: CLOUDFLARE_API_TOKEN w zmiennych środowiskowych
 */

const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

if (!CLOUDFLARE_API_TOKEN) {
  console.error('❌ Brak CLOUDFLARE_API_TOKEN w zmiennych środowiskowych');
  process.exit(1);
}

async function getZoneId(domain = null) {
  try {
    const response = await fetch('https://api.cloudflare.com/client/v4/zones', {
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!data.success) {
      console.error('❌ Błąd API:', data.errors);
      return;
    }

    console.log('🌐 Dostępne domeny i Zone ID:');
    console.log('─'.repeat(50));

    data.result.forEach(zone => {
      console.log(`📍 ${zone.name}`);
      console.log(`   Zone ID: ${zone.id}`);
      console.log(`   Status: ${zone.status}`);
      console.log('');
    });

    // Jeśli podano konkretną domenę
    if (domain) {
      const targetZone = data.result.find(zone => zone.name === domain);
      if (targetZone) {
        console.log(`🎯 Zone ID dla ${domain}: ${targetZone.id}`);
        return targetZone.id;
      } else {
        console.log(`❌ Nie znaleziono domeny: ${domain}`);
      }
    }

  } catch (error) {
    console.error('❌ Błąd połączenia:', error.message);
  }
}

// Uruchom z argumentem domeny (opcjonalnie)
const domain = process.argv[2];
getZoneId(domain);