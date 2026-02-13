"""
B2B Lead Scorer
Custom AI model for scoring B2B leads
"""

from typing import Dict, List, Any

class B2BLeadScorer:
    """
    Score B2B leads based on various criteria
    """
    
    def __init__(self, weights: Dict[str, float] = None):
        """
        Initialize scorer with custom weights
        """
        self.weights = weights or {
            'company_size': 0.25,
            'industry': 0.20,
            'budget': 0.30,
            'urgency': 0.15,
            'fit': 0.10
        }
    
    def score_lead(self, lead: Dict[str, Any]) -> Dict[str, Any]:
        """
        Score a single lead
        
        Args:
            lead: Dictionary with lead information
            
        Returns:
            Dictionary with score and breakdown
        """
        scores = {}
        
        # Company size score
        company_size = lead.get('company_size', 0)
        scores['company_size'] = self._score_company_size(company_size)
        
        # Industry score
        industry = lead.get('industry', '')
        scores['industry'] = self._score_industry(industry)
        
        # Budget score
        budget = lead.get('budget', 0)
        scores['budget'] = self._score_budget(budget)
        
        # Urgency score
        urgency = lead.get('urgency', 'low')
        scores['urgency'] = self._score_urgency(urgency)
        
        # Fit score
        fit_indicators = lead.get('fit_indicators', [])
        scores['fit'] = self._score_fit(fit_indicators)
        
        # Calculate weighted total
        total_score = sum(
            scores[key] * self.weights[key]
            for key in scores.keys()
        )
        
        return {
            'lead_id': lead.get('id', 'unknown'),
            'total_score': round(total_score, 2),
            'breakdown': scores,
            'priority': self._get_priority(total_score)
        }
    
    def _score_company_size(self, size: int) -> float:
        """Score based on company size (employees)"""
        if size >= 1000:
            return 100
        elif size >= 500:
            return 80
        elif size >= 100:
            return 60
        elif size >= 50:
            return 40
        else:
            return 20
    
    def _score_industry(self, industry: str) -> float:
        """Score based on industry fit"""
        high_value_industries = ['technology', 'finance', 'healthcare']
        medium_value_industries = ['retail', 'manufacturing', 'education']
        
        if industry.lower() in high_value_industries:
            return 100
        elif industry.lower() in medium_value_industries:
            return 70
        else:
            return 40
    
    def _score_budget(self, budget: float) -> float:
        """Score based on budget"""
        if budget >= 100000:
            return 100
        elif budget >= 50000:
            return 80
        elif budget >= 25000:
            return 60
        elif budget >= 10000:
            return 40
        else:
            return 20
    
    def _score_urgency(self, urgency: str) -> float:
        """Score based on urgency"""
        urgency_scores = {
            'immediate': 100,
            'high': 80,
            'medium': 60,
            'low': 40,
            'none': 20
        }
        return urgency_scores.get(urgency.lower(), 50)
    
    def _score_fit(self, indicators: List[str]) -> float:
        """Score based on fit indicators"""
        if not indicators:
            return 50
        
        positive_indicators = [
            'decision_maker_contact',
            'previous_customer',
            'referral',
            'engaged_with_content',
            'attended_event'
        ]
        
        matches = sum(1 for ind in indicators if ind in positive_indicators)
        return min(100, matches * 25)
    
    def _get_priority(self, score: float) -> str:
        """Convert score to priority label"""
        if score >= 80:
            return 'high'
        elif score >= 60:
            return 'medium'
        else:
            return 'low'


def score_leads(leads: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Score multiple leads
    """
    scorer = B2BLeadScorer()
    return [scorer.score_lead(lead) for lead in leads]


if __name__ == '__main__':
    # Example usage
    sample_lead = {
        'id': 'LEAD-001',
        'company_size': 500,
        'industry': 'technology',
        'budget': 75000,
        'urgency': 'high',
        'fit_indicators': ['decision_maker_contact', 'engaged_with_content']
    }
    
    scorer = B2BLeadScorer()
    result = scorer.score_lead(sample_lead)
    print(f"Lead Score: {result}")
