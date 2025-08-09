import { QueryRequest, QueryResponse } from '../types/api';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class MockDocumentQueryAPI {
  async queryDocuments(request: QueryRequest): Promise<QueryResponse> {
    // Simulate processing time
    await delay(2000 + Math.random() * 1000);

    // Generate mock responses based on questions
    const mockAnswers = request.questions.map((question, index) => {
      // Different mock responses based on question content
      if (question.toLowerCase().includes('maternity') || question.toLowerCase().includes('pregnancy')) {
        return {
          answer: "Yes, maternity benefits are covered after a 10-month waiting period with coverage up to ₹50,000 per delivery.",
          clause: "Maternity Benefits: The policy covers normal delivery, cesarean section, and pre/post-natal expenses up to the sum insured limit of ₹50,000 per delivery, subject to a waiting period of 10 months from the policy commencement date.",
          section: "MATERNITY BENEFITS",
          page: 15,
          rationale: "This clause explicitly outlines maternity coverage including the waiting period, coverage amount, and types of expenses covered."
        };
      }
      
      if (question.toLowerCase().includes('grace') || question.toLowerCase().includes('payment')) {
        return {
          answer: "The grace period for premium payment is 30 days for monthly premiums and 15 days for annual premiums.",
          clause: "Grace Period: A grace period of thirty (30) days for monthly premium payment mode and fifteen (15) days for annual premium payment mode shall be allowed for the payment of renewal premium during which period the policy shall remain in force.",
          section: "PREMIUM PAYMENT",
          page: 8,
          rationale: "This section clearly defines the grace period duration based on the premium payment frequency."
        };
      }

      if (question.toLowerCase().includes('waiting') || question.toLowerCase().includes('period')) {
        return {
          answer: "Pre-existing diseases have a 48-month waiting period, while specific diseases like cataract, hernia have a 24-month waiting period.",
          clause: "Waiting Period: Pre-existing diseases are covered after 48 months. Specific diseases including but not limited to Cataract, Benign Prostatic Hypertrophy, Hernia, Hydrocele are covered after 24 months from policy inception.",
          section: "WAITING PERIODS",
          page: 12,
          rationale: "The policy clearly distinguishes between different types of waiting periods based on the nature of the medical condition."
        };
      }

      if (question.toLowerCase().includes('exclusion') || question.toLowerCase().includes('not covered')) {
        return {
          answer: "Cosmetic surgery, dental treatment (unless due to accident), and treatment outside India are excluded from coverage.",
          clause: "The following are not covered under this policy: (a) Cosmetic or plastic surgery unless necessitated due to an accident, (b) Dental treatment unless requiring hospitalization, (c) Treatment taken outside India, (d) Self-inflicted injuries.",
          section: "EXCLUSIONS",
          page: 22,
          rationale: "This exclusions clause specifically lists treatments and conditions that are not covered under the policy terms."
        };
      }

      if (question.toLowerCase().includes('claim') || question.toLowerCase().includes('process')) {
        return {
          answer: "Claims must be intimated within 24 hours of hospitalization and all documents must be submitted within 30 days of discharge.",
          clause: "Claim Intimation: The insured must intimate the claim within 24 hours of hospitalization or as soon as reasonably possible. All claim documents including discharge summary, bills, and investigation reports must be submitted within 30 days of discharge.",
          section: "CLAIM PROCEDURES",
          page: 18,
          rationale: "This clause establishes the timeline requirements for both claim intimation and document submission to ensure timely processing."
        };
      }

      // Default mock response for other questions
      return {
        answer: `Based on the policy document, this query relates to ${question.toLowerCase().includes('cover') ? 'coverage terms' : 'policy conditions'} as outlined in the relevant sections.`,
        clause: `The policy states that "${question.slice(0, 50)}..." is addressed under the general terms and conditions with specific provisions for eligibility and coverage limits.`,
        section: "GENERAL CONDITIONS",
        page: 5 + index,
        rationale: `This clause provides the specific guidance needed to answer the question about ${question.toLowerCase().split(' ').slice(0, 3).join(' ')}.`
      };
    });

    return {
      answers: mockAnswers
    };
  }
}