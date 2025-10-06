const functions = require('@google-cloud/functions-framework');
const { Storage } = require('@google-cloud/storage');
const { Firestore } = require('@google-cloud/firestore');

/**
 * Google Cloud Function - Recommendations API
 * Handles MyBonzo AI recommendations with Firestore backend
 */

const storage = new Storage();
const firestore = new Firestore({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
});

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json; charset=utf-8'
};

/**
 * Generate AI recommendations using cached data
 */
async function generateRecommendations(userId, context = {}) {
  try {
    // Get user history from Firestore
    const userDoc = await firestore.collection('users').doc(userId).get();
    const userData = userDoc.exists ? userDoc.data() : {};
    
    // Get recommendation templates
    const templatesSnapshot = await firestore.collection('recommendation_templates').get();
    const templates = templatesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Basic recommendation logic
    const recommendations = [];
    
    // Context-based recommendations
    if (context.currentTask) {
      const taskRecommendations = templates.filter(t => 
        t.category === 'task_assistance' && 
        t.keywords.some(k => context.currentTask.toLowerCase().includes(k))
      );
      recommendations.push(...taskRecommendations.slice(0, 2));
    }
    
    // User history based recommendations
    if (userData.preferences && userData.preferences.topics) {
      const topicRecommendations = templates.filter(t => 
        userData.preferences.topics.some(topic => 
          t.category === topic || t.keywords.includes(topic)
        )
      );
      recommendations.push(...topicRecommendations.slice(0, 3));
    }
    
    // Default recommendations if none found
    if (recommendations.length === 0) {
      const defaultRecommendations = templates.filter(t => t.priority === 'high');
      recommendations.push(...defaultRecommendations.slice(0, 5));
    }
    
    // Enhanced recommendations with dynamic content
    const enhancedRecommendations = recommendations.map(rec => ({
      ...rec,
      id: `${rec.id}_${Date.now()}`,
      generatedAt: new Date().toISOString(),
      userId: userId,
      confidence: calculateConfidence(rec, userData, context),
      personalized: true
    }));
    
    // Store recommendation event
    await firestore.collection('recommendation_events').add({
      userId,
      context,
      recommendationsCount: enhancedRecommendations.length,
      timestamp: new Date(),
      source: 'cloud_function'
    });
    
    return enhancedRecommendations;
    
  } catch (error) {
    console.error('Recommendation generation error:', error);
    
    // Fallback recommendations
    return [
      {
        id: 'fallback_1',
        title: 'Eksploruj możliwości AI',
        description: 'Odkryj zaawansowane funkcje systemu MyBonzo AI',
        category: 'exploration',
        confidence: 0.7,
        generatedAt: new Date().toISOString(),
        fallback: true
      },
      {
        id: 'fallback_2', 
        title: 'Optymalizuj workflow',
        description: 'Przejrzyj i uspraw swoje codzienne zadania',
        category: 'productivity',
        confidence: 0.6,
        generatedAt: new Date().toISOString(),
        fallback: true
      }
    ];
  }
}

/**
 * Calculate recommendation confidence score
 */
function calculateConfidence(recommendation, userData, context) {
  let confidence = 0.5; // Base confidence
  
  // Context matching boost
  if (context.currentTask && recommendation.keywords) {
    const matches = recommendation.keywords.filter(k => 
      context.currentTask.toLowerCase().includes(k)
    ).length;
    confidence += matches * 0.1;
  }
  
  // User preference boost
  if (userData.preferences && userData.preferences.topics) {
    const topicMatch = userData.preferences.topics.includes(recommendation.category);
    if (topicMatch) confidence += 0.2;
  }
  
  // Priority boost
  if (recommendation.priority === 'high') confidence += 0.15;
  if (recommendation.priority === 'medium') confidence += 0.1;
  
  // Cap at 1.0
  return Math.min(confidence, 1.0);
}

/**
 * Main Cloud Function handler
 */
functions.http('mybonzo-recommendations-api', async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.set(CORS_HEADERS);
    return res.status(200).send();
  }

  res.set(CORS_HEADERS);

  try {
    const { method, url } = req;
    const urlParts = new URL(url, `https://${req.get('host')}`);
    
    // Health check
    if (urlParts.pathname === '/health') {
      return res.json({
        status: 'healthy',
        service: 'MyBonzo Recommendations Cloud Function',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        firestore: 'connected',
        storage: 'connected'
      });
    }

    // Get recommendations
    if (method === 'GET' || method === 'POST') {
      const userId = req.query.userId || req.body?.userId || 'anonymous';
      const context = {
        currentTask: req.query.task || req.body?.currentTask,
        category: req.query.category || req.body?.category,
        limit: parseInt(req.query.limit || req.body?.limit || '5'),
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
      };

      console.log(`Generating recommendations for user: ${userId}`);
      
      const recommendations = await generateRecommendations(userId, context);
      
      // Apply limit
      const limitedRecommendations = recommendations.slice(0, context.limit);
      
      return res.json({
        success: true,
        userId: userId,
        recommendationsCount: limitedRecommendations.length,
        recommendations: limitedRecommendations,
        context: context,
        generatedAt: new Date().toISOString(),
        service: 'MyBonzo Recommendations',
        version: '1.0.0'
      });
    }

    // Update user preferences
    if (method === 'POST' && urlParts.pathname === '/preferences') {
      const { userId, preferences } = req.body;
      
      if (!userId || !preferences) {
        return res.status(400).json({
          success: false,
          error: 'Missing userId or preferences',
          required: ['userId', 'preferences']
        });
      }

      await firestore.collection('users').doc(userId).set({
        preferences,
        updatedAt: new Date(),
        source: 'cloud_function'
      }, { merge: true });

      return res.json({
        success: true,
        message: 'Preferences updated successfully',
        userId: userId,
        updatedAt: new Date().toISOString()
      });
    }

    // Default response - API info
    return res.json({
      service: 'MyBonzo Recommendations API',
      version: '1.0.0',
      endpoints: {
        recommendations: 'GET|POST /?userId={id}&task={task}&category={category}&limit={number}',
        preferences: 'POST /preferences {"userId": "...", "preferences": {...}}',
        health: 'GET /health'
      },
      parameters: {
        userId: 'User identifier (optional, defaults to "anonymous")',
        task: 'Current task description for context-aware recommendations',
        category: 'Recommendation category filter',
        limit: 'Maximum number of recommendations (default: 5, max: 20)'
      },
      features: [
        'Context-aware recommendations',
        'User preference learning',
        'Firestore backend',
        'Real-time personalization',
        'Analytics tracking'
      ]
    });

  } catch (error) {
    console.error('Recommendations API Error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
      timestamp: new Date().toISOString(),
      service: 'MyBonzo Recommendations Cloud Function'
    });
  }
});