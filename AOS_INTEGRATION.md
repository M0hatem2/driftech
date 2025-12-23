# AOS (Animate On Scroll) Integration for Angular SPA

This implementation ensures AOS animations work correctly on every route change in a standalone Angular Single Page Application (SPA).

## Features

- ✅ Initialize AOS only on the client (browser), not during SSR
- ✅ Ensure animations re-run for elements with `data-aos` when navigating to a new route
- ✅ Use Angular Router events (`NavigationEnd`) to detect route changes
- ✅ Delay the AOS refresh slightly to let Angular render the new DOM
- ✅ Keep animations reusable for any element that uses `data-aos`
- ✅ Compatible with bootstrapApplication (standalone Angular setup)
- ✅ Use `once: false` so animations can repeat on route visits

## Files Modified

### 1. `src/app/core/services/aos.service.ts` (New)

- Complete AOS service implementation
- Handles initialization, route change detection, and cleanup
- SSR-safe implementation using `isPlatformBrowser`

### 2. `src/app/app.component.ts` (Modified)

- Added AOS service injection and initialization
- Integrated AOS lifecycle management with component lifecycle

### 3. `src/app/app.component.html` (Modified)

- Added example AOS animation to the loading spinner
- Demonstrates basic AOS usage with `data-aos` attributes

### 4. `src/app/features/client/home/home.html` (Modified)

- Added AOS animations to all home page components
- Shows various AOS animation types and configurations

## Usage

### Basic AOS Animation

Add `data-aos` attributes to any HTML element:

```html
<div data-aos="fade-up" data-aos-duration="800" data-aos-easing="ease-in-out">
  Content to animate
</div>
```

### Available AOS Animation Types

- `fade-up`, `fade-down`, `fade-left`, `fade-right`
- `zoom-in`, `zoom-out`
- `slide-up`, `slide-down`, `slide-left`, `slide-right`
- `flip-left`, `flip-right`, `flip-up`, `flip-down`

### AOS Configuration Options

- `data-aos-duration`: Animation duration in milliseconds (default: 1000)
- `data-aos-easing`: Animation easing function (default: 'ease-in-out')
- `data-aos-delay`: Delay before animation starts in milliseconds
- `data-aos-offset`: Offset from the trigger point (default: 120)
- `data-aos-once`: Whether animation should happen only once (default: false)

## SSR Compatibility Notes

1. **Platform Detection**: The service uses `isPlatformBrowser()` to ensure AOS only initializes on the client side
2. **No SSR Issues**: AOS is completely disabled during server-side rendering to prevent hydration mismatches
3. **Client-Only**: All AOS functionality is isolated to browser execution

## Service API

### Methods

- `init()`: Initialize AOS with configuration
- `refresh()`: Refresh AOS for newly rendered elements
- `refreshHard()`: Hard refresh AOS (re-initializes)
- `destroy()`: Clean up AOS and unsubscribe from events

### Configuration

The AOS service is configured with:

- `once: false` - Allows animations to repeat on route visits
- `duration: 1000` - Standard animation duration
- `easing: 'ease-in-out'` - Smooth animation curve
- `offset: 100` - Trigger point offset

## Route Change Handling

The service automatically:

1. Listens for `NavigationEnd` router events
2. Waits 100ms for Angular to render new DOM
3. Calls `AOS.refresh()` to animate new elements
4. Ensures animations work on every route navigation

## Dependencies

- `aos`: ^2.3.4 (already installed)
- `@types/aos`: ^3.0.7 (already installed)
- Angular Router for navigation events

## Testing

To test the implementation:

1. Navigate between different routes in your application
2. Observe that AOS animations trigger on each route change
3. Verify animations work correctly on initial page load
4. Check that animations repeat when revisiting routes

## Troubleshooting

### Common Issues

1. **Animations not working**: Ensure AOS service is initialized in AppComponent
2. **SSR errors**: Verify `isPlatformBrowser()` check is in place
3. **Animations not repeating**: Check `once: false` configuration
4. **Delayed animations**: Adjust the delay in route change listener if needed

### Performance

- AOS refresh is debounced to prevent performance issues
- Service properly unsubscribes on component destruction
- Minimal overhead for route change detection
