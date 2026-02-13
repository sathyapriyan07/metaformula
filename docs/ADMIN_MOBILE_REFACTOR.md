# Admin Panel Mobile Refactor Documentation

## Overview
Complete mobile-first refactor of the F1 Archive admin panel with drawer sidebar, responsive tables, and optimized spacing.

## Changes Implemented

### 1. Admin Layout (`app/admin/layout.tsx`)

#### Desktop Layout
- Fixed sidebar (264px width) on the left
- Main content area with left margin
- Sticky header at top

#### Mobile Layout
- Hamburger menu button in header
- Off-canvas drawer sidebar (slides in from left)
- Full-width main content
- Overlay backdrop when sidebar is open

#### Key Features
- **Client Component**: Uses useState for sidebar toggle
- **Active State**: Highlights current page in sidebar
- **Auto-close**: Sidebar closes when clicking a link or overlay
- **Smooth Transitions**: 300ms slide animation

### 2. Admin Table (`app/admin/components/AdminTable.tsx`)

#### Desktop View
- Traditional table layout
- Horizontal scrolling if needed
- Actions column on the right

#### Mobile View
- Card-based layout
- Each row becomes a card
- Label + value pairs stacked vertically
- Actions at bottom of each card
- No horizontal scrolling needed

### 3. Module List (`app/admin/components/ModuleList.tsx`)

#### Button Updates
- Full-width buttons on mobile
- Compact buttons on desktop
- Improved hover states
- Better spacing

### 4. Admin Header (`app/admin/components/AdminHeader.tsx`)

#### Responsive Changes
- Reduced padding on mobile (p-4 vs p-6)
- Smaller title on mobile (text-2xl vs text-3xl)
- Full-width action button on mobile
- Compact spacing (gap-4 vs gap-6)

### 5. Form Layout (`app/admin/components/FormLayout.tsx`)

#### Mobile Optimizations
- Stacked header layout on mobile
- Full-width back button on mobile
- Reduced padding (p-4 vs p-6)
- Compact spacing throughout

## Layout Structure

```
┌─────────────────────────────────────┐
│  Header (Sticky)                    │
│  [☰] F1 CMS    View Site | Sign Out │
├─────────────────────────────────────┤
│                                     │
│  Sidebar (Drawer)    Main Content   │
│  - Dashboard         ┌────────────┐ │
│  - Seasons           │  Header    │ │
│  - Drivers           ├────────────┤ │
│  - Teams             │  Table/    │ │
│  - Circuits          │  Cards     │ │
│  ...                 └────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

## Responsive Breakpoints

| Breakpoint | Behavior |
|------------|----------|
| < 768px (mobile) | Drawer sidebar, card layout, full-width buttons |
| ≥ 768px (desktop) | Fixed sidebar, table layout, compact buttons |

## CSS Classes Used

### Sidebar
```css
/* Mobile: Hidden by default */
-translate-x-full

/* Mobile: Open state */
translate-x-0

/* Desktop: Always visible */
md:translate-x-0 md:static
```

### Main Content
```css
/* Mobile: Full width */
p-3

/* Desktop: Left margin for sidebar */
md:ml-64 md:p-6
```

### Tables
```css
/* Desktop only */
hidden md:block

/* Mobile only */
md:hidden
```

### Buttons
```css
/* Mobile: Full width */
w-full flex-1

/* Desktop: Auto width */
md:w-auto md:flex-none
```

## Component Hierarchy

```
AdminLayout (Client Component)
├── Header (Sticky)
│   ├── Hamburger Button (Mobile)
│   ├── Logo
│   └── Actions (View Site, Sign Out)
├── Sidebar (Drawer)
│   ├── Close Button (Mobile)
│   └── Navigation Links
└── Main Content
    ├── AdminHeader
    │   ├── Title & Description
    │   └── Action Button
    └── AdminTable / ModuleList
        ├── Desktop: Table View
        └── Mobile: Card View
```

## State Management

### Sidebar Toggle
```tsx
const [sidebarOpen, setSidebarOpen] = useState(false);

// Open
setSidebarOpen(true)

// Close
setSidebarOpen(false)

// Toggle
setSidebarOpen(!sidebarOpen)
```

### Active Link Detection
```tsx
const pathname = usePathname();
const isActive = pathname === link.href;
```

## Styling Patterns

### Dark Theme
- Background: `bg-[#0c0c0c]` or `bg-black`
- Borders: `border-white/10`
- Text: `text-white` with opacity variants
- Glass effect: `glass` or `glass-strong`

### Spacing
- Mobile: `p-3`, `gap-3`, `space-y-3`
- Desktop: `p-6`, `gap-6`, `space-y-6`

### Transitions
- Sidebar: `transition-transform duration-300`
- Buttons: `transition-colors`
- Hover: `hover:bg-white/5`

## Accessibility

- ✅ Keyboard navigation
- ✅ Focus states
- ✅ ARIA labels (implicit through semantic HTML)
- ✅ Touch-friendly tap targets (min 44px)
- ✅ Proper heading hierarchy

## Performance

- Client-side state management (no server round-trips)
- CSS transforms for smooth animations
- Conditional rendering for mobile/desktop views
- Minimal re-renders

## Browser Support

- Chrome/Edge: ✅
- Firefox: ✅
- Safari: ✅
- Mobile browsers: ✅

## Future Enhancements

- [ ] Swipe gestures to open/close sidebar
- [ ] Persistent sidebar state (localStorage)
- [ ] Keyboard shortcuts (Cmd+B to toggle sidebar)
- [ ] Breadcrumb navigation
- [ ] Bulk actions in tables
- [ ] Export table data
- [ ] Column sorting and filtering

## Testing Checklist

- [x] Sidebar opens/closes on mobile
- [x] Overlay closes sidebar
- [x] Links close sidebar on mobile
- [x] Active state highlights current page
- [x] Tables show as cards on mobile
- [x] Buttons are full-width on mobile
- [x] Forms are responsive
- [x] No horizontal scrolling on mobile
- [x] Desktop layout unchanged
- [x] Build successful with no errors
