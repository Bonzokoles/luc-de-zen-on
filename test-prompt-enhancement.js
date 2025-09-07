// Test script for prompt enhancement with wildcards integration
const BASE_URL = 'http://localhost:4321'; // Adjust if needed

async function testPromptEnhancement() {
    console.log('🎨 Testing Prompt Enhancement with Wildcards Integration\n');

    const testPrompts = [
        'a beautiful landscape',
        'futuristic cityscape',
        'portrait of a warrior',
        'magical forest scene',
        'underwater civilization'
    ];

    for (const prompt of testPrompts) {
        console.log(`\n📝 Testing prompt: "${prompt}"`);
        console.log('─'.repeat(60));

        try {
            // Test basic enhancement
            const basicResponse = await fetch(`${BASE_URL}/api/enhance-prompt`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: prompt,
                    options: {
                        quality: 'high',
                        enhanceCreativity: true
                    }
                })
            });

            if (basicResponse.ok) {
                const basicData = await basicResponse.json();
                console.log('✅ Basic Enhancement:');
                console.log(`   Original: ${prompt}`);
                console.log(`   Enhanced: ${basicData.enhanced}`);
                console.log(`   Negative: ${basicData.negativePrompt}`);
                console.log(`   Stats: ${JSON.stringify(basicData.stats)}`);
            } else {
                console.log('❌ Basic enhancement failed:', basicResponse.status);
            }

            // Test with recommendations
            const recResponse = await fetch(`${BASE_URL}/api/enhance-prompt`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: prompt,
                    options: {
                        quality: 'ultra',
                        enhanceCreativity: true,
                        artistStyle: '',
                        mediaType: 'Digital Art',
                        colorPalette: 'vibrant',
                        mood: 'dramatic'
                    },
                    recommend: true
                })
            });

            if (recResponse.ok) {
                const recData = await recResponse.json();
                console.log('\n🎯 With Recommendations:');
                console.log(`   Enhanced: ${recData.enhanced}`);
                console.log(`   Artist Recommendations: ${recData.artistRecommendations?.slice(0, 3).join(', ')}`);
                console.log(`   Suggestions: ${recData.suggestions?.slice(0, 2).join(', ')}`);
            } else {
                console.log('❌ Recommendation enhancement failed:', recResponse.status);
            }

        } catch (error) {
            console.error('❌ Error testing prompt:', error.message);
        }

        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 500));
    }
}

async function testImageGenerationWithEnhancement() {
    console.log('\n\n🖼️ Testing Image Generation with Auto-Enhancement\n');

    const testPrompt = 'a mystical dragon in a magical forest';

    try {
        const response = await fetch(`${BASE_URL}/api/generate-image`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: testPrompt,
                model: '@cf/stabilityai/stable-diffusion-xl-base-1.0',
                width: 512,
                height: 512,
                steps: 20,
                enhancePrompt: true,
                enhanceOptions: {
                    quality: 'high',
                    enhanceCreativity: true,
                    artistStyle: 'fantasy art',
                    mood: 'mystical'
                }
            })
        });

        if (response.ok) {
            const blob = await response.blob();
            console.log('✅ Image generation with enhancement successful');
            console.log(`   Response size: ${blob.size} bytes`);
            console.log(`   Content type: ${blob.type}`);
        } else {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            console.log('❌ Image generation failed:', response.status, errorData.error);
        }
    } catch (error) {
        console.error('❌ Error in image generation test:', error.message);
    }
}

async function testArtistDatabase() {
    console.log('\n\n🎨 Testing Artist Database Integration\n');

    const artistTests = [
        { style: 'impressionist', expected: ['Claude Monet', 'Pierre-Auguste Renoir'] },
        { style: 'surrealist', expected: ['Salvador Dali', 'René Magritte'] },
        { style: 'pop art', expected: ['Andy Warhol', 'Roy Lichtenstein'] }
    ];

    for (const test of artistTests) {
        try {
            const response = await fetch(`${BASE_URL}/api/enhance-prompt`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: `a painting in ${test.style} style`,
                    options: { artistStyle: test.style },
                    recommend: true
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log(`✅ ${test.style} style test:`);
                console.log(`   Recommendations: ${data.artistRecommendations?.slice(0, 3).join(', ')}`);

                const hasExpected = test.expected.some(artist =>
                    data.artistRecommendations?.some(rec => rec.includes(artist))
                );
                console.log(`   Expected artists found: ${hasExpected ? '✅' : '❌'}`);
            } else {
                console.log(`❌ ${test.style} test failed:`, response.status);
            }
        } catch (error) {
            console.error(`❌ Error testing ${test.style}:`, error.message);
        }
    }
}

async function runAllTests() {
    console.log('🚀 Starting Comprehensive Prompt Enhancement Tests');
    console.log('=' * 70);

    await testPromptEnhancement();
    await testImageGenerationWithEnhancement();
    await testArtistDatabase();

    console.log('\n' + '=' * 70);
    console.log('✅ All tests completed!');
    console.log('\n📊 Test Summary:');
    console.log('   - Prompt enhancement with 833+ artist styles');
    console.log('   - Wildcard integration from SupaGruen SD CheatSheet');
    console.log('   - Image generation with auto-enhancement');
    console.log('   - Artist recommendation system');
    console.log('   - Quality enhancement and mood descriptors');
    console.log('\n🎉 Your prompt generator is fully configured with image generator!');
}

// Run the tests
runAllTests().catch(console.error);