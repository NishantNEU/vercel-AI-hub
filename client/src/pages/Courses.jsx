import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, BookOpen, Clock, Users, Star, 
  Filter, Loader2, GraduationCap, X,
  ChevronRight, BarChart3
} from 'lucide-react';
import { coursesAPI } from '../services/api';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const categories = [
  { id: 'all', name: 'All Courses' },
  { id: 'ai-fundamentals', name: 'AI Fundamentals' },
  { id: 'machine-learning', name: 'Machine Learning' },
  { id: 'deep-learning', name: 'Deep Learning' },
  { id: 'nlp', name: 'Natural Language Processing' },
  { id: 'computer-vision', name: 'Computer Vision' },
  { id: 'generative-ai', name: 'Generative AI' },
  { id: 'ai-tools', name: 'AI Tools' },
  { id: 'prompt-engineering', name: 'Prompt Engineering' },
  { id: 'ai-ethics', name: 'AI Ethics' },
  { id: 'other', name: 'Other' },
];

const difficulties = [
  { id: 'all', name: 'All Levels' },
  { id: 'beginner', name: 'Beginner', color: '#00E3A5' },
  { id: 'intermediate', name: 'Intermediate', color: '#4FC3F7' },
  { id: 'advanced', name: 'Advanced', color: '#F472B6' },
];

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadCourses();
  }, [selectedCategory, selectedDifficulty]);

  const loadCourses = async () => {
    try {
      setIsLoading(true);
      const params = { isPublished: true };
      if (selectedCategory !== 'all') params.category = selectedCategory;
      if (selectedDifficulty !== 'all') params.difficulty = selectedDifficulty;
      
      const response = await coursesAPI.getAll(params);
      setCourses(response.data.data.courses || []);
    } catch (error) {
      console.error('Failed to load courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadCourses();
  };

  const filteredCourses = courses.filter(course => {
    if (!searchQuery) return true;
    return (
      course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const getDifficultyColor = (difficulty) => {
    const diff = difficulties.find(d => d.id === difficulty);
    return diff?.color || '#00E3A5';
  };

  const formatDuration = (minutes) => {
    if (!minutes) return 'Self-paced';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Hero Section */}
      <div className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[var(--color-primary)] opacity-10 rounded-full blur-[128px]" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[var(--color-secondary)] opacity-10 rounded-full blur-[128px]" />
        </div>
        
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
            Learn <span className="text-gradient">Artificial Intelligence</span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto mb-8" style={{ color: 'var(--color-text-secondary)' }}>
            Master AI with our expert-led courses. From fundamentals to advanced topics,
            start your journey into the future of technology.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-text-muted)' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search courses..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl border focus:outline-none focus:border-[var(--color-primary)]"
                  style={{ 
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)'
                  }}
                />
              </div>
              <Button type="submit">Search</Button>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="p-3 rounded-xl border transition-colors lg:hidden"
                style={{ 
                  backgroundColor: 'var(--color-surface)',
                  borderColor: showFilters ? 'var(--color-primary)' : 'var(--color-border)',
                  color: showFilters ? 'var(--color-primary)' : 'var(--color-text)'
                }}
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="container-custom pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Categories */}
              <div className="card">
                <h3 className="font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Categories</h3>
                <div className="space-y-1">
                  {categories.map((category) => {
                    const isActive = selectedCategory === category.id;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                          isActive ? 'bg-[rgba(0,227,165,0.1)]' : ''
                        }`}
                        style={{ 
                          color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)'
                        }}
                      >
                        {category.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Difficulty Filter */}
              <div className="card">
                <h3 className="font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Difficulty</h3>
                <div className="space-y-1">
                  {difficulties.map((diff) => {
                    const isActive = selectedDifficulty === diff.id;
                    return (
                      <button
                        key={diff.id}
                        onClick={() => setSelectedDifficulty(diff.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                          isActive ? 'bg-[rgba(0,227,165,0.1)]' : ''
                        }`}
                        style={{ 
                          color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)'
                        }}
                      >
                        {diff.id !== 'all' && (
                          <span 
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: diff.color }}
                          />
                        )}
                        {diff.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="lg:hidden card mb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>Filters</h3>
                <button onClick={() => setShowFilters(false)}>
                  <X className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--color-text-secondary)' }}>
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border focus:outline-none"
                    style={{ 
                      backgroundColor: 'var(--color-bg)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)'
                    }}
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--color-text-secondary)' }}>
                    Difficulty
                  </label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border focus:outline-none"
                    style={{ 
                      backgroundColor: 'var(--color-bg)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)'
                    }}
                  >
                    {difficulties.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Courses Grid */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p style={{ color: 'var(--color-text-secondary)' }}>
                {isLoading ? 'Loading...' : `${filteredCourses.length} courses found`}
              </p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-primary)' }} />
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="text-center py-20">
                <GraduationCap className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
                  No courses found
                </h3>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <Link 
                    key={course._id} 
                    to={`/courses/${course._id}`}
                    className="card card-hover group block"
                  >
                    {/* Thumbnail */}
                    <div 
                      className="h-40 rounded-lg mb-4 flex items-center justify-center overflow-hidden"
                      style={{ backgroundColor: 'var(--color-bg)' }}
                    >
                      {course.thumbnail ? (
                        <img 
                          src={course.thumbnail} 
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <BookOpen className="w-12 h-12" style={{ color: 'var(--color-primary)', opacity: 0.5 }} />
                      )}
                    </div>

                    {/* Category & Difficulty */}
                    <div className="flex items-center gap-2 mb-3">
                      <span 
                        className="text-xs px-2 py-1 rounded-full"
                        style={{ 
                          backgroundColor: 'rgba(0,227,165,0.1)',
                          color: 'var(--color-primary)'
                        }}
                      >
                        {categories.find(c => c.id === course.category)?.name || course.category}
                      </span>
                      <span 
                        className="text-xs px-2 py-1 rounded-full"
                        style={{ 
                          backgroundColor: `${getDifficultyColor(course.difficulty)}20`,
                          color: getDifficultyColor(course.difficulty)
                        }}
                      >
                        {course.difficulty}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 
                      className="font-semibold mb-2 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2"
                      style={{ color: 'var(--color-text)' }}
                    >
                      {course.title}
                    </h3>

                    {/* Short Description */}
                    <p 
                      className="text-sm mb-4 line-clamp-2"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {course.shortDescription || course.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatDuration(course.duration)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{course.lessons?.length || 0} lessons</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{course.enrollmentCount || 0}</span>
                      </div>
                    </div>

                    {/* Rating */}
                    {course.rating?.average > 0 && (
                      <div className="flex items-center gap-1 mt-3">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                          {course.rating.average.toFixed(1)}
                        </span>
                        <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                          ({course.rating.count} reviews)
                        </span>
                      </div>
                    )}

                    {/* View Course Arrow */}
                    <div className="flex items-center gap-1 mt-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--color-primary)' }}>
                      <span className="text-sm font-medium">View Course</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
