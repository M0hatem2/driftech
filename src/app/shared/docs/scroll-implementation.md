# Smooth Scrolling Implementation

This implementation provides automatic smooth scrolling to the top of pages when navigating between routes in the Angular application.

## Features

- **Automatic scroll to top**: Pages automatically scroll to the top with smooth animation when navigating via router links
- **Fallback support**: Works on all browsers, with graceful fallbacks for older browsers that don't support smooth scrolling
- **Configurable behavior**: Customizable scroll duration and target positions
- **Directive support**: Additional directive for manual scroll control
- **Service-based**: Reusable scroll service for programmatic control

## How it works

1. **Router Configuration**: The router is configured with `withInMemoryScrolling` to enable scroll position restoration
2. **Scroll Service**: Listens to NavigationEnd events and automatically scrolls to top with smooth behavior
3. **CSS Enhancement**: Global CSS provides smooth scrolling behavior for the entire application
4. **Browser Fallback**: Graceful degradation for browsers that don't support smooth scrolling

## Usage

### Automatic Scrolling
The scroll service is automatically initialized and will handle all route navigation. No additional code is required.

### Manual Control with Service

```typescript
import { ScrollService } from './shared/services/scroll.service';

constructor(private scrollService: ScrollService) {}

// Scroll to top manually
this.scrollService.scrollToTopSmooth();

// Scroll to specific element
this.scrollService.scrollToElementSmooth('#element-id', 64); // 64px offset

// Get current position
const position = this.scrollService.getCurrentScrollPosition();

// Check if at top
const isAtTop = this.scrollService.isAtTop();
```

### Using the Directive

```typescript
// Import the directive in your component
import { ScrollToTopDirective } from './shared/directives/scroll-to-top.directive';

@Component({
  // ... other config
  imports: [ScrollToTopDirective]
})
export class YourComponent { }
```

```html
<!-- Simple scroll to top button -->
<button appScrollToTop>Scroll to Top</button>

<!-- Scroll to specific element -->
<div appScrollToTop="element-id">Scroll to Element</div>

<!-- With custom offset -->
<button [appScrollToTop]="{element: 'target-element', offset: 100}">
  Scroll with Offset
</button>
```

## Configuration

### Router Configuration (app.config.ts)
The router is configured with the following options:
- `scrollPositionRestoration: 'enabled'` - Restores scroll position on navigation
- `anchorScrolling: 'enabled'` - Enables anchor-based scrolling

### CSS Configuration (styles.scss)
Global styles include:
- `scroll-behavior: smooth` on html element for smooth scrolling
- Additional utility classes for scroll behavior

## Browser Support

- **Modern browsers**: Full smooth scrolling support
- **Older browsers**: Automatic fallback to instant scrolling
- **Mobile devices**: Optimized for touch scrolling behavior

## Files Modified/Created

1. **src/app/shared/services/scroll.service.ts** - Main scroll service
2. **src/app/shared/directives/scroll-to-top.directive.ts** - Scroll directive
3. **src/app/app.config.ts** - Router configuration update
4. **src/styles.scss** - CSS smooth scrolling rules

## Performance Considerations

- Uses `throttleTime(100)` to prevent multiple rapid scroll calls
- Efficient event handling with RxJS operators
- Graceful error handling with fallbacks
- Minimal DOM manipulation

## Customization

You can customize the scrolling behavior by modifying:

1. **Scroll duration**: Update the smooth scroll implementation in ScrollService
2. **Scroll easing**: Modify CSS `scroll-behavior` or implement custom easing functions
3. **Scroll offset**: Adjust for fixed headers by modifying the scroll offset in router config or service

## Testing

To test the implementation:
1. Navigate between different pages in the application
2. Verify that pages scroll to top smoothly on navigation
3. Test on different browsers to ensure fallbacks work
4. Test anchor scrolling with `#element-id` in URLs
5. Test manual scroll control with service and directive