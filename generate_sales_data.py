import requests
import json
import random
from datetime import datetime, timedelta

# Global sales data generator
countries_data = {
    'USA': {'region': 'North America', 'currency': 'USD', 'flag': '🇺🇸'},
    'Germany': {'region': 'Europe', 'currency': 'EUR', 'flag': '🇩🇪'},
    'Japan': {'region': 'Asia', 'currency': 'JPY', 'flag': '🇯🇵'},
    'UK': {'region': 'Europe', 'currency': 'GBP', 'flag': '🇬🇧'},
    'France': {'region': 'Europe', 'currency': 'EUR', 'flag': '🇫🇷'},
    'Canada': {'region': 'North America', 'currency': 'CAD', 'flag': '🇨🇦'},
    'Australia': {'region': 'Oceania', 'currency': 'AUD', 'flag': '🇦🇺'},
    'Brazil': {'region': 'South America', 'currency': 'BRL', 'flag': '🇧🇷'},
    'India': {'region': 'Asia', 'currency': 'INR', 'flag': '🇮🇳'},
    'China': {'region': 'Asia', 'currency': 'CNY', 'flag': '🇨🇳'},
    'Russia': {'region': 'Europe', 'currency': 'RUB', 'flag': '🇷🇺'},
    'Italy': {'region': 'Europe', 'currency': 'EUR', 'flag': '🇮🇹'},
    'Spain': {'region': 'Europe', 'currency': 'EUR', 'flag': '🇪🇸'},
    'Netherlands': {'region': 'Europe', 'currency': 'EUR', 'flag': '🇳🇱'},
    'Sweden': {'region': 'Europe', 'currency': 'SEK', 'flag': '🇸🇪'},
    'Norway': {'region': 'Europe', 'currency': 'NOK', 'flag': '🇳🇴'},
    'Mexico': {'region': 'North America', 'currency': 'MXN', 'flag': '🇲🇽'},
    'South Korea': {'region': 'Asia', 'currency': 'KRW', 'flag': '🇰🇷'},
    'Singapore': {'region': 'Asia', 'currency': 'SGD', 'flag': '🇸🇬'},
    'Switzerland': {'region': 'Europe', 'currency': 'CHF', 'flag': '🇨🇭'}
}

product_categories = [
    'Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports',
    'Beauty', 'Automotive', 'Food & Beverages', 'Health', 'Toys',
    'Software', 'Music', 'Movies', 'Gaming', 'Tools'
]

def generate_sales_data(num_records=500):
    sales_data = []
    
    for _ in range(num_records):
        country = random.choice(list(countries_data.keys()))
        country_info = countries_data[country]
        
        # Generate random date within last 2 years
        days_ago = random.randint(0, 730)
        date = (datetime.now() - timedelta(days=days_ago)).strftime('%Y-%m-%d')
        
        # Generate revenue based on country (some countries have higher values)
        base_revenue = random.uniform(10, 1000)
        if country in ['USA', 'Germany', 'Japan', 'UK']:
            base_revenue *= random.uniform(1.5, 3.0)  # Higher revenue countries
        
        record = {
            'country': country,
            'region': country_info['region'],
            'product_category': random.choice(product_categories),
            'revenue': round(base_revenue, 2),
            'units_sold': random.randint(1, 50),
            'currency': country_info['currency'],
            'date_recorded': date,
            'sales_channel': random.choice(['Online', 'Retail', 'Partner', 'Direct']),
            'customer_segment': random.choice(['B2B', 'B2C', 'Enterprise']),
            'product_id': f'PRD-{random.randint(1000, 9999)}'
        }
        
        sales_data.append(record)
    
    return sales_data

def upload_to_api(sales_data, api_url, admin_token):
    """Upload generated data to the MyBonzo API"""
    
    payload = {
        'sales': sales_data,
        'metadata': {
            'source': 'Python Data Generator',
            'generated_at': datetime.now().isoformat(),
            'total_records': len(sales_data),
            'countries_covered': len(set(record['country'] for record in sales_data))
        }
    }
    
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {admin_token}'
    }
    
    try:
        print(f"🚀 Uploading {len(sales_data)} sales records to {api_url}")
        
        response = requests.post(api_url, json=payload, headers=headers)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Success! Imported {result.get('imported', 0)} records")
            print(f"📊 Total records in database: {result.get('total_records', 'unknown')}")
            return True
        else:
            print(f"❌ Error {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Upload failed: {e}")
        return False

def save_to_file(sales_data, filename='global_sales_data.json'):
    """Save data to local file as backup"""
    
    output_data = {
        'sales': sales_data,
        'metadata': {
            'generated_at': datetime.now().isoformat(),
            'total_records': len(sales_data),
            'countries': list(set(record['country'] for record in sales_data)),
            'categories': list(set(record['product_category'] for record in sales_data))
        }
    }
    
    with open(filename, 'w') as f:
        json.dump(output_data, f, indent=2)
    
    print(f"💾 Data saved to {filename}")

if __name__ == "__main__":
    print("🌍 MyBonzo Global Sales Data Generator")
    print("=" * 50)
    
    # Configuration
    API_URL = "https://9055ee9e.luc-de-zen-on.pages.dev/api/admin/sales-data-import"
    ADMIN_TOKEN = "mybonzo_admin_2025"
    NUM_RECORDS = 1000  # Generate 1000 records
    
    # Generate sales data
    print(f"📝 Generating {NUM_RECORDS} sales records...")
    sales_data = generate_sales_data(NUM_RECORDS)
    
    # Show summary
    countries = set(record['country'] for record in sales_data)
    categories = set(record['product_category'] for record in sales_data)
    total_revenue = sum(record['revenue'] for record in sales_data)
    
    print(f"📊 Generated Data Summary:")
    print(f"   • Countries: {len(countries)} ({', '.join(sorted(countries))})")
    print(f"   • Product Categories: {len(categories)}")
    print(f"   • Total Revenue: ${total_revenue:,.2f}")
    print(f"   • Date Range: {min(record['date_recorded'] for record in sales_data)} to {max(record['date_recorded'] for record in sales_data)}")
    
    # Save to file first
    save_to_file(sales_data)
    
    # Upload to API
    print("\n🔄 Uploading to MyBonzo API...")
    success = upload_to_api(sales_data, API_URL, ADMIN_TOKEN)
    
    if success:
        print("\n🎉 Data generation and upload completed successfully!")
        print("📈 Visit https://luc-de-zen-on.pages.dev/admin/sales-dashboard to view the data")
    else:
        print("\n⚠️  Upload failed, but data is saved locally in global_sales_data.json")
        print("You can manually import this file through the dashboard")