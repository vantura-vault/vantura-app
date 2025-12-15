import { useState } from 'react';
import {
  useHistoricalMetrics,
  useRecentPosts,
  useCompetitors,
  useGenerateSuggestions,
  useAddCompetitor,
  useCompanyId,
} from '../hooks';

/**
 * API Testing Page
 * Tests all three new API modules: Analytics, Suggestions, and Vault
 */
export function ApiTest() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const companyId = useCompanyId();

  // Test Analytics - Historical Metrics
  const { data: historicalData, isLoading: historicalLoading, error: historicalError } =
    useHistoricalMetrics({
      companyId,
      platform: 'LinkedIn',
      range: '1M',
      ma: 7,
    });

  // Test Analytics - Recent Posts
  const { data: recentPostsData, isLoading: recentPostsLoading, error: recentPostsError } =
    useRecentPosts({
      companyId,
      limit: 5,
    });

  // Test Vault - Competitors List
  const { data: competitorsData, isLoading: competitorsLoading, error: competitorsError } =
    useCompetitors({
      companyId,
    });

  // Test Suggestions - Generate (mutation, called on button click)
  const generateSuggestionsMutation = useGenerateSuggestions();

  // Test Vault - Add Competitor (mutation, called on button click)
  const addCompetitorMutation = useAddCompetitor();

  const handleGenerateSuggestions = () => {
    generateSuggestionsMutation.mutate(
      {
        companyId,
        platform: 'LinkedIn',
        objective: 'engagement',
        nVariants: 2,
      },
      {
        onSuccess: (data) => {
          setTestResults((prev) => [
            ...prev,
            `✅ Generated ${data.variants.length} suggestions`,
          ]);
        },
        onError: (error) => {
          setTestResults((prev) => [
            ...prev,
            `❌ Suggestions failed: ${error.message}`,
          ]);
        },
      }
    );
  };

  const handleAddCompetitor = () => {
    addCompetitorMutation.mutate(
      {
        companyId,
        name: 'Test Competitor ' + Date.now(),
        platforms: [
          {
            platform: 'LinkedIn',
            url: 'https://linkedin.com/company/testhandle' + Date.now(),
            type: 'company',
          },
        ],
      },
      {
        onSuccess: (data) => {
          setTestResults((prev) => [
            ...prev,
            `✅ Added competitor: ${data.name}`,
          ]);
        },
        onError: (error) => {
          setTestResults((prev) => [
            ...prev,
            `❌ Add competitor failed: ${error.message}`,
          ]);
        },
      }
    );
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>API Integration Test</h1>
      <p>Company ID: {companyId}</p>

      <div style={{ marginTop: '20px', padding: '20px', background: '#f5f5f5' }}>
        <h2>📊 Analytics API</h2>

        <div style={{ marginTop: '10px' }}>
          <h3>Historical Metrics (LinkedIn, 1M, MA=7)</h3>
          {historicalLoading && <p>Loading...</p>}
          {historicalError && <p style={{ color: 'red' }}>Error: {historicalError.message}</p>}
          {historicalData && (
            <div>
              <p>✅ Platform: {historicalData.platform}</p>
              <p>✅ Range: {historicalData.range}</p>
              <p>✅ Data points: {historicalData.dates.length}</p>
              <p>✅ Latest followers: {historicalData.followers[historicalData.followers.length - 1]}</p>
            </div>
          )}
        </div>

        <div style={{ marginTop: '10px' }}>
          <h3>Recent Posts (Limit: 5)</h3>
          {recentPostsLoading && <p>Loading...</p>}
          {recentPostsError && <p style={{ color: 'red' }}>Error: {recentPostsError.message}</p>}
          {recentPostsData && (
            <div>
              <p>✅ Posts found: {recentPostsData.items.length}</p>
              {recentPostsData.items.map((post, i) => (
                <div key={post.postId} style={{ marginLeft: '20px', marginTop: '5px' }}>
                  <p>
                    Post {i + 1}: {post.platform} | Engagement: {post.engagementRate.toFixed(1)}%
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '20px', padding: '20px', background: '#f5f5f5' }}>
        <h2>🕵️ Competitor Vault API</h2>

        <div style={{ marginTop: '10px' }}>
          <h3>Competitors List</h3>
          {competitorsLoading && <p>Loading...</p>}
          {competitorsError && <p style={{ color: 'red' }}>Error: {competitorsError.message}</p>}
          {competitorsData && (
            <div>
              <p>✅ Competitors found: {competitorsData.items.length}</p>
              {competitorsData.items.map((comp) => (
                <div key={comp.id} style={{ marginLeft: '20px', marginTop: '5px' }}>
                  <p>
                    {comp.name} | Followers: {comp.totalFollowers} | Engagement: {comp.averageEngagement.toFixed(1)}%
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginTop: '10px' }}>
          <button
            onClick={handleAddCompetitor}
            disabled={addCompetitorMutation.isPending}
            style={{ padding: '10px 20px', cursor: 'pointer' }}
          >
            {addCompetitorMutation.isPending ? 'Adding...' : 'Test Add Competitor'}
          </button>
        </div>
      </div>

      <div style={{ marginTop: '20px', padding: '20px', background: '#f5f5f5' }}>
        <h2>🧠 Post Suggestions API</h2>

        <div style={{ marginTop: '10px' }}>
          <button
            onClick={handleGenerateSuggestions}
            disabled={generateSuggestionsMutation.isPending}
            style={{ padding: '10px 20px', cursor: 'pointer' }}
          >
            {generateSuggestionsMutation.isPending ? 'Generating...' : 'Test Generate Suggestions'}
          </button>

          {generateSuggestionsMutation.data && (
            <div style={{ marginTop: '10px' }}>
              <p>✅ Generated {generateSuggestionsMutation.data.variants.length} variants</p>
              {generateSuggestionsMutation.data.variants.map((variant, i) => (
                <div key={i} style={{ marginLeft: '20px', marginTop: '5px' }}>
                  <p>
                    Variant {i + 1} | Score: {variant.finalScore.toFixed(2)} | Length: {variant.text.length}
                  </p>
                </div>
              ))}
            </div>
          )}

          {generateSuggestionsMutation.error && (
            <p style={{ color: 'red' }}>Error: {generateSuggestionsMutation.error.message}</p>
          )}
        </div>
      </div>

      {testResults.length > 0 && (
        <div style={{ marginTop: '20px', padding: '20px', background: '#e8f5e9' }}>
          <h2>Test Results</h2>
          {testResults.map((result, i) => (
            <p key={i}>{result}</p>
          ))}
        </div>
      )}
    </div>
  );
}
