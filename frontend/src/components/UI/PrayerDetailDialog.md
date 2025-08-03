# PrayerDetailDialog Component

A sophisticated shadcn Dialog component for displaying detailed prayer information with cosmic theme and glassmorphism effects.

## Features

✨ **Enhanced Visual Design:**
- Frosted, translucent background with backdrop blur
- Starry overlay for cosmic depth
- Gradient borders and glowing effects
- Smooth animations and transitions

🎨 **Cosmic Theme Integration:**
- Deep space color palette
- Ethereal glassmorphism effects
- Floating shadows and glows
- Radiant gold accent elements

📱 **Responsive Layout:**
- Clean two-panel design
- Mobile-first responsive approach
- Accessible keyboard navigation
- Touch-friendly interactions

## Usage

```tsx
import { PrayerDetailDialog } from '@/components/UI';
import { GeneratedPrayer } from '@/types/ai';

const MyComponent = () => {
  const [selectedPrayer, setSelectedPrayer] = useState<GeneratedPrayer | null>(null);
  
  const handleShare = async () => {
    // Share prayer logic
  };
  
  const handleJoinPrayer = () => {
    // Join global prayer logic
  };

  return (
    <PrayerDetailDialog
      prayer={selectedPrayer}
      isOpen={!!selectedPrayer}
      onClose={() => setSelectedPrayer(null)}
      onShare={handleShare}
      onJoinPrayer={handleJoinPrayer}
      userName="Sebastian"
      userLocation="Global Prayer Network"
    />
  );
};
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `prayer` | `GeneratedPrayer \| null` | ✅ | Prayer data object |
| `isOpen` | `boolean` | ✅ | Controls dialog visibility |
| `onClose` | `() => void` | ✅ | Close dialog handler |
| `onShare` | `() => void` | ❌ | Share prayer handler |
| `onJoinPrayer` | `() => void` | ❌ | Join prayer handler |
| `userName` | `string` | ❌ | Override user display name |
| `userLocation` | `string` | ❌ | User location display |

## Design Elements

### Background & Glassmorphism
- `bg-glass-bg-heavy/85` - Primary translucent background
- `backdrop-blur-ethereal` - Strong blur effect
- Layered starry overlay for cosmic depth

### Typography & Layout
- `font-elegant` - Sacred typography for titles
- `font-modern` - Clean typography for content
- Responsive grid system with proper spacing

### Interactive Elements
- Hover effects with scale transforms
- Glowing borders and shadows
- Smooth color transitions
- Pulsing accent elements

### Color Palette
- Primary: `cosmic-starlight` (white/light)
- Secondary: `cosmic-silver-mist` (muted)
- Accents: `cosmic-ethereal-purple`, `cosmic-solar-gold`
- Backgrounds: Glass variants with transparency

## Integration

The component is fully integrated with:
- WallOfPrayersPage for prayer viewing
- shadcn/ui Dialog system
- Cosmic theme design system
- TypeScript type safety

## Accessibility

- Proper ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader compatibility
- Color contrast compliance

---

*Created with ✨ cosmic inspiration for the AYA prayer platform*
