import { useState } from 'react';
import { 
  Brain, ChevronLeft, ChevronRight, RotateCcw, Check, X, Trophy, Timer,
  Languages, BookOpen, Code, Calculator, Lightbulb, History, Globe, Palette,
  Music, Microscope, Heart, Leaf, Building, Shirt, Utensils, Map
} from 'lucide-react';

interface Category {
  id: string;
  title: string;
  icon: any;
  color: string;
  description: string;
}

const categories: Category[] = [
  {
    id: 'bengali',
    title: 'Bengali Language',
    icon: Languages,
    color: 'purple',
    description: 'Learn Bengali grammar, vocabulary, and conversation'
  },
  {
    id: 'english',
    title: 'English Skills',
    icon: BookOpen,
    color: 'blue',
    description: 'Improve your English reading, writing, and speaking'
  },
  {
    id: 'arabic',
    title: 'Arabic Studies',
    icon: Globe,
    color: 'green',
    description: 'Learn Arabic language and Islamic studies'
  },
  {
    id: 'technology',
    title: 'Technology',
    icon: Code,
    color: 'cyan',
    description: 'Programming, AI, and modern technology'
  },
  {
    id: 'mathematics',
    title: 'Mathematics',
    icon: Calculator,
    color: 'red',
    description: 'From basic math to advanced concepts'
  },
  {
    id: 'science',
    title: 'Science',
    icon: Microscope,
    color: 'yellow',
    description: 'Physics, Chemistry, and Biology'
  },
  {
    id: 'history',
    title: 'History & Culture',
    icon: History,
    color: 'orange',
    description: 'World history and cultural studies'
  },
  {
    id: 'arts',
    title: 'Arts & Literature',
    icon: Palette,
    color: 'pink',
    description: 'Visual arts, literature, and poetry'
  },
  {
    id: 'music',
    title: 'Music',
    icon: Music,
    color: 'indigo',
    description: 'Music theory and appreciation'
  },
  {
    id: 'health',
    title: 'Health & Wellness',
    icon: Heart,
    color: 'rose',
    description: 'Health, fitness, and well-being'
  },
  {
    id: 'environment',
    title: 'Environment',
    icon: Leaf,
    color: 'emerald',
    description: 'Environmental science and sustainability'
  },
  {
    id: 'business',
    title: 'Business',
    icon: Building,
    color: 'slate',
    description: 'Business, economics, and finance'
  },
  {
    id: 'fashion',
    title: 'Fashion & Style',
    icon: Shirt,
    color: 'fuchsia',
    description: 'Fashion design and style tips'
  },
  {
    id: 'cooking',
    title: 'Cooking',
    icon: Utensils,
    color: 'amber',
    description: 'Cooking techniques and recipes'
  },
  {
    id: 'geography',
    title: 'Geography',
    icon: Map,
    color: 'teal',
    description: 'World geography and cultures'
  }
];

interface FlashCard {
  id: string;
  topic: string;
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const sampleCards: FlashCard[] = [
  {
    id: '1',
    topic: 'Indian Culture',
    question: 'What is the significance of Diwali in Indian culture?',
    answer: 'Diwali is the festival of lights that symbolizes the victory of light over darkness and good over evil. It celebrates Lord Rama\'s return to Ayodhya.',
    difficulty: 'easy'
  },
  {
    id: '2',
    topic: 'Bengali Language',
    question: 'What are the basic greetings in Bengali?',
    answer: 'Common Bengali greetings include "Nomoshkar" (নমস্কার) for formal greetings and "Kemon acho?" (কেমন আছো?) for "How are you?"',
    difficulty: 'easy'
  },
  {
    id: '3',
    topic: 'Mathematics',
    question: 'Explain the Pythagorean theorem.',
    answer: 'The Pythagorean theorem states that in a right triangle, the square of the hypotenuse (c) equals the sum of squares of the other two sides (a and b). Written as: a² + b² = c²',
    difficulty: 'medium'
  }
];

export function LearnPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [studyStreak, setStudyStreak] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [reviewMode, setReviewMode] = useState<'flashcard' | 'quiz'>('flashcard');

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentIndex(0);
    setShowAnswer(false);
  };

  const handleBack = () => {
    setSelectedCategory(null);
    setCurrentIndex(0);
    setShowAnswer(false);
  };

  if (!selectedCategory) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-primary" />
            <h1 className="text-lg font-semibold">Choose a Topic</h1>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 overflow-y-auto pb-20">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className="flex flex-col items-start p-4 rounded-xl bg-secondary/10 hover:bg-secondary/20 
                transition-all duration-200 border border-border/40 group animate-in fade-in-50"
            >
              <div className={`p-2 rounded-lg bg-${category.color}-500/10 text-${category.color}-500 mb-3 
                group-hover:bg-${category.color}-500/20 transition-colors`}>
                <category.icon className="w-5 h-5" />
              </div>
              <h3 className="font-medium text-sm">{category.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{category.description}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const currentCard = sampleCards[currentIndex];

  const handleNext = () => {
    if (currentIndex < sampleCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
    }
  };

  const handleFlip = () => {
    setShowAnswer(!showAnswer);
  };

  const handleResponse = (correct: boolean) => {
    if (correct) {
      setCorrectAnswers(prev => prev + 1);
      setStudyStreak(prev => prev + 1);
    } else {
      setStudyStreak(0);
    }
    handleNext();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <button 
            onClick={handleBack}
            className="p-2 rounded-lg hover:bg-secondary/20 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">
            {categories.find(c => c.id === selectedCategory)?.title}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium">{studyStreak}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Timer className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">{correctAnswers}/{sampleCards.length}</span>
          </div>
        </div>
      </div>

      {/* Card */}
      <div className="flex-1 flex flex-col">
        <div 
          className="flex-1 relative rounded-2xl bg-gradient-to-br from-secondary/5 to-secondary/10 p-6 border border-border/40 shadow-sm"
          onClick={handleFlip}
        >
          <div className="absolute top-4 left-4">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-md ${
              currentCard.difficulty === 'easy' ? 'bg-green-500/10 text-green-500' :
              currentCard.difficulty === 'medium' ? 'bg-yellow-500/10 text-yellow-500' :
              'bg-red-500/10 text-red-500'
            }`}>
              {currentCard.difficulty}
            </span>
          </div>
          
          <div className="absolute top-4 right-4">
            <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-primary/10 text-primary">
              {currentCard.topic}
            </span>
          </div>

          <div className="h-full flex items-center justify-center text-center p-4">
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <p className="text-lg font-medium">
                {showAnswer ? currentCard.answer : currentCard.question}
              </p>
              <p className="text-sm text-muted-foreground">
                {showAnswer ? 'Question' : 'Answer'} on the other side
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-6 flex items-center justify-between gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="p-3 rounded-xl bg-secondary/10 hover:bg-secondary/20 transition-all duration-200 disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {reviewMode === 'quiz' && showAnswer ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleResponse(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all duration-200"
              >
                <X className="w-4 h-4" />
                <span>Incorrect</span>
              </button>
              <button
                onClick={() => handleResponse(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-all duration-200"
              >
                <Check className="w-4 h-4" />
                <span>Correct</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleFlip}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-200"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Flip Card</span>
            </button>
          )}

          <button
            onClick={handleNext}
            disabled={currentIndex === sampleCards.length - 1}
            className="p-3 rounded-xl bg-secondary/10 hover:bg-secondary/20 transition-all duration-200 disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
} 