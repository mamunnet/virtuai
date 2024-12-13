import { useState } from 'react';
import { questions } from '../../data/questions';
import { WebSummarizer } from './WebSummarizer';
import { Link2 } from 'lucide-react';

interface QuestionListProps {
  onQuestionClick: (question: string) => void;
}

export function QuestionList({ onQuestionClick }: QuestionListProps) {
  const [showSummarizer, setShowSummarizer] = useState(false);

  return (
    <div className="space-y-6">
      {/* Webpage Summarizer Button */}
      <button
        onClick={() => setShowSummarizer(!showSummarizer)}
        className="w-full p-4 rounded-xl bg-secondary/10 hover:bg-secondary/20 transition-all duration-200 
          border border-border/40 hover:shadow-md flex items-center gap-3"
      >
        <Link2 className="w-5 h-5 text-primary/70" />
        <div className="text-left">
          <span className="text-sm font-medium block">Summarize Webpage</span>
          <span className="text-xs text-muted-foreground">Get AI-powered summaries of any webpage</span>
        </div>
      </button>

      {/* Show Summarizer or Question Categories */}
      {showSummarizer ? (
        <WebSummarizer />
      ) : (
        <div className="space-y-6">
          {Object.entries(questions).map(([category, items]) => (
            <div key={category} className="space-y-2">
              <h3 className="text-sm font-medium capitalize">{category.replace('-', ' ')}</h3>
              <div className="space-y-2">
                {items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onQuestionClick(item.text)}
                    className="w-full p-4 rounded-xl bg-secondary/10 hover:bg-secondary/20 transition-all duration-200 
                      border border-border/40 hover:shadow-md text-left"
                  >
                    <span className="text-sm">{item.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 