import { Brain, Wand2, Scan, Link2, BookOpen, Calculator, Languages, PenTool, Cpu } from 'lucide-react';
import { questions } from '../../data/questions';

interface QuestionListProps {
  onQuestionClick: (question: string) => void;
}

export function QuestionList({ onQuestionClick }: QuestionListProps) {
  return (
    <div className="h-full overflow-y-auto scrollbar-hide">
      <div className="space-y-8 pb-20">
        {/* PRO Section */}
        <div className="rounded-2xl bg-gradient-to-br from-secondary/5 to-secondary/10 p-5 space-y-4 border border-border/40 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-primary/10 text-primary">PRO</span>
          </div>
          
          <button className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-background/80 hover:bg-background transition-all duration-200 border border-border/40 active:scale-[0.99] shadow-sm hover:shadow-md">
            <Scan className="w-5 h-5 text-primary/70" />
            <span className="text-sm font-medium">What is this image about?</span>
          </button>

          <button className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-background/80 hover:bg-background transition-all duration-200 border border-border/40 active:scale-[0.99] shadow-sm hover:shadow-md">
            <Link2 className="w-5 h-5 text-primary/70" />
            <span className="text-sm font-medium">Summarize this web page</span>
          </button>
        </div>

        {/* Explain Section */}
        <div className="space-y-4">
          <h2 className="flex items-center gap-2 font-semibold text-lg px-1 sticky top-0 bg-background py-2">
            <Brain className="w-5 h-5 text-primary" />
            Explain Indian Culture
          </h2>
          <div className="space-y-2.5">
            {questions.explain.map((q) => (
              <button
                key={q.id}
                onClick={() => onQuestionClick(q.text)}
                className="w-full text-left p-3.5 rounded-xl bg-secondary/10 hover:bg-secondary/20 transition-all duration-200 border border-border/40 text-sm font-medium active:scale-[0.99] shadow-sm hover:shadow-md"
              >
                {q.text}
              </button>
            ))}
          </div>
        </div>

        {/* Mathematics Section */}
        <div className="space-y-4">
          <h2 className="flex items-center gap-2 font-semibold text-lg px-1 sticky top-0 bg-background py-2">
            <Calculator className="w-5 h-5 text-primary" />
            Mathematics Help
          </h2>
          <div className="space-y-2.5">
            {questions.mathematics.map((q) => (
              <button
                key={q.id}
                onClick={() => onQuestionClick(q.text)}
                className="w-full text-left p-3.5 rounded-xl bg-secondary/10 hover:bg-secondary/20 transition-all duration-200 border border-border/40 text-sm font-medium active:scale-[0.99] shadow-sm hover:shadow-md"
              >
                {q.text}
              </button>
            ))}
          </div>
        </div>

        {/* Bengali Section */}
        <div className="space-y-4">
          <h2 className="flex items-center gap-2 font-semibold text-lg px-1 sticky top-0 bg-background py-2">
            <Languages className="w-5 h-5 text-primary" />
            Bengali Language & Culture
          </h2>
          <div className="space-y-2.5">
            {questions.bengali.map((q) => (
              <button
                key={q.id}
                onClick={() => onQuestionClick(q.text)}
                className="w-full text-left p-3.5 rounded-xl bg-secondary/10 hover:bg-secondary/20 transition-all duration-200 border border-border/40 text-sm font-medium active:scale-[0.99] shadow-sm hover:shadow-md"
              >
                {q.text}
              </button>
            ))}
          </div>
        </div>

        {/* Write Section */}
        <div className="space-y-4">
          <h2 className="flex items-center gap-2 font-semibold text-lg px-1 sticky top-0 bg-background py-2">
            <PenTool className="w-5 h-5 text-primary" />
            Writing Assistant
          </h2>
          <div className="space-y-2.5">
            {questions.write.map((q) => (
              <button
                key={q.id}
                onClick={() => onQuestionClick(q.text)}
                className="w-full text-left p-3.5 rounded-xl bg-secondary/10 hover:bg-secondary/20 transition-all duration-200 border border-border/40 text-sm font-medium active:scale-[0.99] shadow-sm hover:shadow-md"
              >
                {q.text}
              </button>
            ))}
          </div>
        </div>

        {/* Create Section */}
        <div className="space-y-4">
          <h2 className="flex items-center gap-2 font-semibold text-lg px-1 sticky top-0 bg-background py-2">
            <Wand2 className="w-5 h-5 text-primary" />
            Create Content
          </h2>
          <div className="space-y-2.5">
            {questions.create.map((q) => (
              <button
                key={q.id}
                onClick={() => onQuestionClick(q.text)}
                className="w-full text-left p-3.5 rounded-xl bg-secondary/10 hover:bg-secondary/20 transition-all duration-200 border border-border/40 text-sm font-medium active:scale-[0.99] shadow-sm hover:shadow-md"
              >
                {q.text}
              </button>
            ))}
          </div>
        </div>

        {/* Technology Section */}
        <div className="space-y-4">
          <h2 className="flex items-center gap-2 font-semibold text-lg px-1 sticky top-0 bg-background py-2">
            <Cpu className="w-5 h-5 text-primary" />
            Technology in India
          </h2>
          <div className="space-y-2.5">
            {questions.technology.map((q) => (
              <button
                key={q.id}
                onClick={() => onQuestionClick(q.text)}
                className="w-full text-left p-3.5 rounded-xl bg-secondary/10 hover:bg-secondary/20 transition-all duration-200 border border-border/40 text-sm font-medium active:scale-[0.99] shadow-sm hover:shadow-md"
              >
                {q.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 