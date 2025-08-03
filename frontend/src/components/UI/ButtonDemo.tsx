import React, { useState } from 'react';
import { Button, Input, Textarea, Card, CardHeader, CardContent, CardTitle, CardDescription, Label, Badge, Avatar, AvatarImage, AvatarFallback, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/UI';

/**
 * ButtonDemo component to showcase cosmic-themed UI components
 * Enhanced with shadcn/ui and glassmorphism effects
 */
const ButtonDemo: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');

  return (
    <div className="min-h-screen bg-gradient-deep-space p-8 space-y-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-elegant font-bold text-cosmic-starlight mb-4 text-shadow-cosmic">
            Cosmic UI Components
          </h1>
          <p className="text-lg text-cosmic-silver-mist font-modern">
            Shadcn/ui components enhanced with glassmorphism and cosmic theming
          </p>
        </div>

        {/* Buttons Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Cosmic Buttons</CardTitle>
            <CardDescription>Enhanced button variants with ethereal glowing effects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <Button variant="default">Default</Button>
                <Button variant="cosmic-primary">Primary Cosmic</Button>
                <Button variant="secondary">Secondary Glass</Button>
                <Button variant="outline">Outline Ethereal</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button variant="cosmic-gold" size="lg">Radiant Gold</Button>
                <Button variant="cosmic-green" size="lg">Aurora Green</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Components Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Form Components</CardTitle>
            <CardDescription>Input fields with cosmic glassmorphism styling</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label variant="cosmic">Cosmic Input</Label>
                <Input 
                  placeholder="Enter your celestial message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label variant="golden">Golden Label</Label>
                <Input 
                  type="email"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label variant="ethereal">Ethereal Textarea</Label>
              <Textarea 
                placeholder="Share your thoughts with the cosmos..."
                value={textareaValue}
                onChange={(e) => setTextareaValue(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Badges and Avatars Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Badges and Avatars</CardTitle>
            <CardDescription>Status indicators and profile components</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Badge variant="cosmic">Cosmic</Badge>
                <Badge variant="cosmic-gold">Stellar Gold</Badge>
                <Badge variant="cosmic-green">Aurora Green</Badge>
                <Badge variant="cosmic-purple">Ethereal Purple</Badge>
                <Badge variant="priority">High Priority</Badge>
              </div>
              
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg">AY</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dialog Component */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Dialog Component</CardTitle>
            <CardDescription>Modal dialogs with cosmic backdrop blur</CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="cosmic-gold">Open Cosmic Dialog</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-cosmic-starlight">Cosmic Dialog</DialogTitle>
                  <DialogDescription className="text-cosmic-silver-mist">
                    This is a cosmic-themed dialog with glassmorphism effects and ethereal styling.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right" variant="cosmic">
                      Name
                    </Label>
                    <Input
                      id="name"
                      defaultValue="Cosmic Traveler"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right" variant="ethereal">
                      Username
                    </Label>
                    <Input
                      id="username"
                      defaultValue="@starwalker"
                      className="col-span-3"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Cancel</Button>
                  <Button variant="cosmic-gold">Save Changes</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Interactive Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-glow-gold transition-all duration-500">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Badge variant="cosmic-gold">Featured</Badge>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">🌟</AvatarFallback>
                </Avatar>
              </div>
              <CardTitle>Stellar Prayer</CardTitle>
              <CardDescription>A prayer that reaches across the galaxy</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-cosmic-starlight text-sm">
                May the light of a thousand stars guide your path through the cosmos...
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-glow-purple transition-all duration-500">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Badge variant="cosmic-purple">Ethereal</Badge>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">🔮</AvatarFallback>
                </Avatar>
              </div>
              <CardTitle>Mystical Meditation</CardTitle>
              <CardDescription>Connect with the ethereal realm</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-cosmic-starlight text-sm">
                In the silence between heartbeats, find the rhythm of the universe...
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-glow-blue transition-all duration-500">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Badge variant="cosmic-green">Harmony</Badge>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">🌍</AvatarFallback>
                </Avatar>
              </div>
              <CardTitle>Global Unity</CardTitle>
              <CardDescription>One world, one prayer</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-cosmic-starlight text-sm">
                Together we weave the tapestry of peace across all nations...
              </p>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};;

export { ButtonDemo };
