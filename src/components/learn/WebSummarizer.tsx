import { useState, useEffect } from 'react';
import { Link2, Loader2, History, ChevronRight, Trash2 } from 'lucide-react';
import { getAIResponse } from '../../services/ai';

interface SummaryHistoryItem {
  id: string;
  url: string;
  summary: string;
  timestamp: number;
}

// Constants for localStorage
const STORAGE_KEY = 'webpage_summary_history';

// Helper functions for localStorage
const loadHistoryFromStorage = (): SummaryHistoryItem[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading history:', error);
    return [];
  }
};

const saveHistoryToStorage = (history: SummaryHistoryItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving history:', error);
  }
};

async function scrapeWebpage(url: string): Promise<string> {
  try {
    // Try multiple CORS proxies in case one fails
    const proxies = [
      `https://api.allorigins.win/raw?url=`,
      `https://corsproxy.io/?`,
      `https://api.codetabs.com/v1/proxy?quest=`
    ];

    let htmlContent = '';
    let error = null;

    // Try each proxy until one works
    for (const proxy of proxies) {
      try {
        const encodedUrl = encodeURIComponent(url);
        const response = await fetch(proxy + encodedUrl);
        if (response.ok) {
          htmlContent = await response.text();
          break;
        }
      } catch (err) {
        error = err;
        continue;
      }
    }

    if (!htmlContent) {
      throw error || new Error('Failed to fetch webpage content');
    }

    // Create a temporary DOM element to parse the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    // Get the title
    const title = doc.title || '';

    // Get meta description
    const metaDescription = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';

    // Remove unwanted elements
    const selectorsToRemove = [
      'script', 'style', 'iframe', 'nav', 'footer', 'header', 'aside',
      '[role="complementary"]', '[role="advertisement"]', '.ad', '#ad',
      '.advertisement', '.banner', '.cookie', '.popup', '.modal'
    ];
    selectorsToRemove.forEach(selector => {
      doc.querySelectorAll(selector).forEach(el => el.remove());
    });

    // Extract text content from main content areas first
    const mainContent = doc.querySelector('main, article, [role="main"]');
    let textContent = '';

    if (mainContent) {
      textContent = extractContent(mainContent);
    } else {
      // Fallback to body content if no main content area found
      textContent = extractContent(doc.body);
    }

    // Combine all content with metadata
    return `
      Title: ${title}
      Description: ${metaDescription}
      
      Content:
      ${textContent}
    `.trim();
  } catch (error) {
    console.error('Scraping error:', error);
    throw new Error('Failed to fetch webpage content');
  }
}

function extractContent(element: Element): string {
  // Get all text-containing elements
  const textElements = element.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, article, section');
  
  // Process and filter the text content
  return Array.from(textElements)
    .map(el => {
      const text = el.textContent?.trim() || '';
      // Add proper formatting based on element type
      if (el.tagName.toLowerCase().startsWith('h')) {
        return `\n### ${text}\n`;
      }
      return text;
    })
    .filter(text => text.length > 20) // Filter out short snippets
    .join('\n\n');
}

export function WebSummarizer() {
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [summaryHistory, setSummaryHistory] = useState<SummaryHistoryItem[]>(() => loadHistoryFromStorage());

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (summaryHistory.length > 0) {
      saveHistoryToStorage(summaryHistory);
    }
  }, [summaryHistory]);

  const addToHistory = (url: string, summary: string) => {
    const newItem: SummaryHistoryItem = {
      id: Date.now().toString(),
      url,
      summary,
      timestamp: Date.now()
    };

    const updatedHistory = [newItem, ...summaryHistory].slice(0, 10); // Keep only last 10 items
    setSummaryHistory(updatedHistory);
    saveHistoryToStorage(updatedHistory); // Save immediately
  };

  const loadFromHistory = (item: SummaryHistoryItem) => {
    setUrl(item.url);
    setSummary(item.summary);
    setShowHistory(false);
  };

  const clearHistory = () => {
    setSummaryHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const removeFromHistory = (id: string) => {
    const updatedHistory = summaryHistory.filter(item => item.id !== id);
    setSummaryHistory(updatedHistory);
    saveHistoryToStorage(updatedHistory); // Save immediately
  };

  const handleSummarize = async () => {
    if (!url.trim() || loading) return;

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      setError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    setLoading(true);
    setError(null);
    setSummary(null);

    try {
      // First, scrape the webpage content
      const webpageContent = await scrapeWebpage(url);

      if (!webpageContent || webpageContent.length < 100) {
        throw new Error('Could not extract enough content from the webpage');
      }

      // Create a more structured prompt with explicit formatting instructions
      const prompt = `Analyze this webpage content and provide a detailed summary. 
Format your response exactly as shown below, maintaining all line breaks and sections:

# ${url}

## 📝 Overview
[Write 2-3 sentences describing the webpage's main purpose and target audience]

## 🎯 Key Points
• [First key point with detail]
• [Second key point with detail]
• [Third key point with detail]

## 📚 Main Topics

### 1. [First Topic]
[Write a paragraph explaining this topic in detail]

### 2. [Second Topic]
[Write a paragraph explaining this topic in detail]

### 3. [Third Topic]
[Write a paragraph explaining this topic in detail]

## 📊 Important Details
• [Specific detail or statistic]
• [Another important detail]
• [Additional relevant information]

## 💡 Key Takeaways
1. [First takeaway with explanation]
2. [Second takeaway with explanation]
3. [Third takeaway with explanation]

## 🔍 Conclusion
[Write a concluding paragraph summarizing the main points and significance]

Here's the content to analyze:
${webpageContent}

Remember to:
1. Keep paragraphs short and focused
2. Use bullet points for lists
3. Include specific details and examples
4. Maintain proper spacing between sections
5. Format headings consistently`;

      const response = await getAIResponse(prompt);

      // Format the response with proper line breaks and spacing
      const formattedResponse = response
        .replace(/\n\n/g, '\n\n') // Ensure consistent line breaks
        .replace(/^#/gm, '\n#') // Add space before headings
        .replace(/^##/gm, '\n##') // Add space before subheadings
        .replace(/^•/gm, '\n•') // Add space before bullet points
        .replace(/^\d\./gm, '\n$&') // Add space before numbered lists
        .trim();

      setSummary(formattedResponse);
      addToHistory(url, formattedResponse);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to summarize the webpage. Please check the URL and try again.');
      }
      console.error('Summarization error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Webpage Summarizer</h2>
          <p className="text-sm text-muted-foreground">
            Enter a webpage URL to get an AI-powered summary
          </p>
        </div>
        {summaryHistory.length > 0 && (
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 rounded-lg bg-secondary/10 hover:bg-secondary/20 text-muted-foreground 
              hover:text-foreground transition-colors relative"
            title="View History"
          >
            <History className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-[10px] flex items-center justify-center">
              {summaryHistory.length}
            </span>
          </button>
        )}
      </div>

      {showHistory && summaryHistory.length > 0 && (
        <div className="space-y-2 animate-in slide-in-from-top-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium">Recent Summaries</h3>
            <button
              onClick={clearHistory}
              className="text-xs text-red-500 hover:text-red-400 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              Clear History
            </button>
          </div>
          <div className="space-y-2">
            {summaryHistory.map((item) => (
              <div
                key={item.id}
                className="group p-3 rounded-lg bg-secondary/10 hover:bg-secondary/20 
                  transition-colors border border-border/40 relative"
              >
                <button
                  onClick={() => loadFromHistory(item)}
                  className="w-full text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 truncate mr-8">
                      <div className="text-sm font-medium truncate">{item.url}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(item.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromHistory(item.id);
                  }}
                  className="absolute right-2 top-2 p-1 rounded-md opacity-0 group-hover:opacity-100
                    hover:bg-secondary/20 text-muted-foreground hover:text-red-400 transition-all"
                  title="Remove from history"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* URL Input */}
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 via-secondary/50 to-primary/50 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter webpage URL (https://...)"
                className="w-full px-4 py-3 rounded-xl bg-secondary/10 border border-border/40 
                  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50
                  placeholder:text-muted-foreground/70"
                disabled={loading}
              />
              <Link2 className="absolute right-4 top-3.5 w-5 h-5 text-muted-foreground" />
            </div>
            <button
              onClick={handleSummarize}
              disabled={!url.trim() || loading}
              className="px-6 rounded-xl bg-primary text-primary-foreground flex items-center gap-2
                hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Summarizing...
                </>
              ) : (
                'Summarize'
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
            {error}
          </div>
        )}

        {/* Summary Result */}
        {summary && (
          <div className="p-6 rounded-xl bg-secondary/10 border border-border/40 space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="prose prose-invert max-w-none whitespace-pre-line">
              {summary}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 