import React, { useState } from 'react';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Input, Textarea, Card, CardContent, CardTitle, Label } from '@/components/UI';
import { NewsEvent } from '@/types';
import { apiService, CreateLightWithPrayerRequest } from '@/services';

// Define the form schema for validation
const prayerFormSchema = z.object({
  userIntent: z.string().min(5, 'Intention must be at least 5 characters').max(500, 'Intention cannot exceed 500 characters'),
  name: z.string().optional(),
  email: z.string().email('Please enter a valid email').optional(),
  location: z.string().min(1, 'Location is required to light your candle'),
  age: z.number().int().positive('Age must be a positive number').optional(),
});

const SubmitPrayerPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedEvent = location.state?.selectedEvent as NewsEvent | undefined;

  const [form, setForm] = useState({
    userIntent: '',
    name: '',
    email: '',
    location: '',
    age: '',
  });
  
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);

  const createLightWithPrayerMutation = useMutation({
    mutationFn: (data: CreateLightWithPrayerRequest) => apiService.createLightWithPrayer(data),
    onSuccess: (response) => {
      navigate('/prayer-confirmation', { 
        state: { 
          light: response.data.light,
          prayerNote: response.data.prayerNote,
          selectedEvent 
        } 
      });
    },
    onError: (error: Error) => {
      console.error('Error creating light with prayer:', error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validatedData = prayerFormSchema.parse({
        ...form,
        age: form.age ? Number(form.age) : undefined,
      });
      
      setErrors([]);
      
      createLightWithPrayerMutation.mutate({
        location: validatedData.location,
        title: validatedData.name ? `Prayer by ${validatedData.name}` : 'Anonymous Prayer',
        description: selectedEvent ? `Prayer for: ${selectedEvent.title}` : 'Global prayer intention',
        isAnonymous: !validatedData.name,
        eventId: selectedEvent?._id,
        prayerContent: validatedData.userIntent,
        prayerIsPublic: true,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.issues);
      }
    }
  };

  const getFieldError = (fieldName: string) => {
    const error = errors.find(err => err.path.includes(fieldName));
    return error?.message;
  };

  // Helper function to render starry background
  const renderStarryBackground = () => {
    const stars = Array.from({ length: 200 }, (_, i) => i);
    return (
      <div className="absolute inset-0">
        {stars.map((i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.8 + 0.2,
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Starry background */}
      <div className="absolute inset-0 opacity-40">
        {renderStarryBackground()}
      </div>

      {/* Earth/Globe background effect */}
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/4">
        <div 
          className="w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.8) 0%, rgba(37, 99, 235, 0.6) 25%, rgba(29, 78, 216, 0.4) 50%, transparent 70%)',
            filter: 'blur(1px)',
          }}
        />
      </div>

      {/* Top Navigation */}
      <div className="absolute top-0 left-0 right-0 z-30 p-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="text-white font-bold text-xl">AYA</div>
            <div className="text-gray-400 text-sm">
              <div>One prayer</div>
              <div>One world</div>
            </div>
          </div>
          
          {/* Wall of Prayers */}
          <div className="text-white font-medium tracking-wide">
            Wall of Prayers
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-20 w-full h-full flex items-center justify-center p-8">
        <Card className="w-full max-w-7xl h-full max-h-[80vh] bg-glass-bg-medium/20 backdrop-blur-cosmic border-glass-border-light/40 shadow-float-heavy hover:shadow-glow-purple/20 flex overflow-hidden rounded-2xl transition-all duration-500">
          
          {/* Left Panel - Event Information */}
          <CardContent className="w-1/3 p-8 border-r border-glass-border-light/30 bg-gradient-to-br from-cosmic-void/20 to-cosmic-deep-space/30">
            <div className="h-full flex flex-col">
              <CardTitle className="text-xl font-elegant text-cosmic-starlight mb-6 text-shadow-cosmic">
                {selectedEvent ? 'Current Event' : 'Global Prayer'}
              </CardTitle>

              {selectedEvent ? (
                <div className="space-y-4 flex-1">
                  <h4 className="text-xl font-bold text-cosmic-light leading-tight">
                    {selectedEvent.title}
                  </h4>
                  
                  <p className="text-cosmic-muted text-sm leading-relaxed">
                    {selectedEvent.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center text-xs text-cosmic-muted">
                      <div className="w-2 h-2 bg-cosmic-secondary rounded-full mr-2"></div>
                      {new Date(selectedEvent.published_at).toLocaleDateString()}
                    </div>
                    
                    {selectedEvent.country && (
                      <div className="flex items-center text-xs text-cosmic-muted">
                        <div className="w-2 h-2 bg-cosmic-accent rounded-full mr-2"></div>
                        {selectedEvent.country}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4 flex-1">
                  <p className="text-cosmic-muted text-sm leading-relaxed">
                    Join millions around the world in a moment of unity and hope. 
                    Your prayer will be part of a global tapestry of intentions for 
                    peace, healing, and love.
                  </p>
                </div>
              )}

              {selectedEvent && (
                <div>
                  <h4 className="text-sm font-semibold text-cosmic-muted mb-2">SOURCES</h4>
                  <div className="space-y-1">
                    <p className="text-cosmic-secondary text-sm hover:underline cursor-pointer hover:text-cosmic-primary transition-colors">
                      {selectedEvent.source}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Close button */}
            <button
              onClick={() => navigate(-1)}
              className="mt-4 text-cosmic-muted hover:text-cosmic-light transition-colors text-sm"
            >
              ← Back to Globe
            </button>
          </CardContent>

          {/* Right Panel - Prayer Form */}
          <CardContent className="w-2/3 p-8 flex flex-col">
            <CardTitle className="text-2xl font-semibold text-cosmic-light mb-6">
              Write your intention here
            </CardTitle>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
              
              {/* Main textarea */}
              <div className="flex-1 mb-4">
                <Textarea
                  value={form.userIntent}
                  onChange={(e) => setForm({ ...form, userIntent: e.target.value })}
                  className="w-full h-full cosmic-glow-focus"
                  placeholder="Your prayer intention..."
                  maxLength={500}
                />
                {getFieldError('userIntent') && (
                  <p className="text-cosmic-destructive text-sm mt-1">{getFieldError('userIntent')}</p>
                )}
                <p className="text-right text-cosmic-muted text-xs mt-1">
                  {form.userIntent.length}/500 character limit
                </p>
              </div>

              {/* Optional fields */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-cosmic-muted">Name (optional)</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="cosmic-glow-focus"
                  />
                  {getFieldError('name') && (
                    <p className="text-cosmic-destructive text-sm mt-1">{getFieldError('name')}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-cosmic-muted">Email (optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="cosmic-glow-focus"
                  />
                  {getFieldError('email') && (
                    <p className="text-cosmic-destructive text-sm mt-1">{getFieldError('email')}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-cosmic-muted">Location (required)</Label>
                  <Input
                    id="location"
                    type="text"
                    placeholder="Enter your location"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="cosmic-glow-focus"
                    required
                  />
                  {getFieldError('location') && (
                    <p className="text-cosmic-destructive text-sm mt-1">{getFieldError('location')}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age" className="text-cosmic-muted">Age (optional)</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter your age"
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                    className="cosmic-glow-focus"
                  />
                  {getFieldError('age') && (
                    <p className="text-cosmic-destructive text-sm mt-1">{getFieldError('age')}</p>
                  )}
                </div>
              </div>

              {/* Submit button */}
              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={createLightWithPrayerMutation.isPending || !form.userIntent.trim() || !form.location.trim()}
                  variant="cosmic-gold"
                  size="lg"
                  className="px-8 py-3 cosmic-pulse"
                >
                  {createLightWithPrayerMutation.isPending ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cosmic-dark mr-2"></div>
                      Lighting your candle...
                    </span>
                  ) : (
                    'Light your candle'
                  )}
                </Button>
              </div>

              {/* Error message */}
              {createLightWithPrayerMutation.isError && (
                <p className="text-cosmic-destructive text-center mt-4">
                  Error: {createLightWithPrayerMutation.error?.message || 'Failed to light your candle'}
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubmitPrayerPage;
