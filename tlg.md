# TLG HTML - Empty Anchor Links (SEO Errors)

This document lists all anchor tags with empty `href="#"` attributes found in tlg.html that are causing SEO errors.

## Total Count: 26 instances

---

## Navigation Menu Items (Lines 573-692)

### First Menu Section
1. **Line 573** - Healthcare navigation item
   ```html
   <a href="#" class="elementor-item elementor-item-anchor">Healthcare</a>
   ```

2. **Line 582** - Technology navigation item
   ```html
   <a href="#" class="elementor-item elementor-item-anchor">Technology</a>
   ```

3. **Line 591** - Finance navigation item
   ```html
   <a href="#" class="elementor-item elementor-item-anchor">Finance</a>
   ```

4. **Line 610** - Retail navigation item
   ```html
   <a href="#" class="elementor-item elementor-item-anchor">Retail</a>
   ```

5. **Line 619** - Food navigation item
   ```html
   <a href="#" class="elementor-item elementor-item-anchor">Food</a>
   ```

6. **Line 641** - Navigation item with tabindex="-1"
   ```html
   <a href="#" class="elementor-item elementor-item-anchor" tabindex="-1">
   ```

7. **Line 651** - Navigation item with tabindex="-1"
   ```html
   <a href="#" class="elementor-item elementor-item-anchor" tabindex="-1">
   ```

8. **Line 661** - Navigation item with tabindex="-1"
   ```html
   <a href="#" class="elementor-item elementor-item-anchor" tabindex="-1">
   ```

9. **Line 682** - Navigation item with tabindex="-1"
   ```html
   <a href="#" class="elementor-item elementor-item-anchor" tabindex="-1">
   ```

10. **Line 692** - Navigation item with tabindex="-1"
    ```html
    <a href="#" class="elementor-item elementor-item-anchor" tabindex="-1">
    ```

---

## Navigation Menu Items (Lines 1434-1555) - Duplicate Section

### Second Menu Section
11. **Line 1434** -


    <a href="#" class="elementor-item elementor-item-anchor">Healthcare</a>
    ```

12. **Line 1443** - Technology navigation item (duplicate)
    ```html
    <a href="#" class="elementor-item elementor-item-anchor">Technology</a>
    ```

13. **Line 1452** - Finance navigation item (duplicate)
    ```html
    <a href="#" class="elementor-item elementor-item-anchor">Finance</a>
    ```

14. **Line 1471** - Retail navigation item (duplicate)
    ```html
    <a href="#" class="elementor-item elementor-item-anchor">Retail</a>
    ```

15. **Line 1480** - Food navigation item (duplicate)
    ```html
    <a href="#" class="elementor-item elementor-item-anchor">Food</a>
    ```

16. **Line 1502** - Navigation item with tabindex="-1"
    ```html
    <a href="#" class="elementor-item elementor-item-anchor" tabindex="-1">
    ```

17. **Line 1512** - Navigation item with tabindex="-1"
    ```html
    <a href="#" class="elementor-item elementor-item-anchor" tabindex="-1">
    ```

18. **Line 1522** - Navigation item with tabindex="-1"
    ```html
    <a href="#" class="elementor-item elementor-item-anchor" tabindex="-1">
    ```

19. **Line 1543** - Navigation item with tabindex="-1"
    ```html
    <a href="#" class="elementor-item elementor-item-anchor" tabindex="-1">
    ```

20. **Line 1553** - Navigation item with tabindex="-1"
    ```html
    <a href="#" class="elementor-item elementor-item-anchor" tabindex="-1">
    ```

---

## TLG Tiles (Lines 2776-2880)

21. **Line 2776** - Active tile link
    ```html
    <a class="tlg-tile active" href="#">
    ```

22. **Line 2797** - Tile link
    ```html
    <a class="tlg-tile" href="#">
    ```

23. **Line 2817** - Tile link
    ```html
    <a class="tlg-tile" href="#">
    ```

24. **Line 2838** - Tile link
    ```html
    <a class="tlg-tile" href="#">
    ```

25. **Line 2859** - Tile link
    ```html
    <a class="tlg-tile" href="#">
    ```

26. **Line 2880** - Tile link
    ```html
    <a class="tlg-tile" href="#">
    ```

---

## Summary

- **Navigation Items (Industry categories)**: 10 links (Healthcare, Technology, Finance, Retail, Food + 5 with tabindex)
- **Duplicate Navigation Section**: 10 links (same pattern repeated)
- **TLG Tiles**: 6 links (image-based tiles)

## Recommendations

1. Replace `href="#"` with actual destination URLs for industry pages
2. If these are meant to be non-clickable elements, consider using `<button>` or `<span>` instead
3. For the TLG tiles, add proper navigation targets
4. Remove duplicate navigation sections if not needed
