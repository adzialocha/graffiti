# graffiti

```typescript
// What is public space on the internet?
//
// This browser extension can't answer this question but can extend your
// browser to paint graffiti on any web page on the internet. These will be
// visible to everyone else who have this extension installed.
//
// Here is a small code fragment explaining the basic principle. Imagine your
// browser has just downloaded any web page from someones server.
//
// Every web page consists of objects which form its structure and content.
// These objects are represented as the so-called DOM ("Document Object
// Model").
//
// Knowing the DOM we can use it to determine the position of every object on
// the web page to simply place something else on top of it ..
window.addEventListener('mousedown', (event: Event) => {
  // Get the object the user just clicked on the web page
  const target = event.target as HTMLElement;

  // Determine the x and y position of this object
  const { x, y } = target.getBoundingClientRect();

  // Create a new object, it does not contain anything yet, but we could give
  // it an image, video, text or audio ..
  const graffiti = document.createElement('div');

  // We want this object to be on top of everything else, similar to real
  // graffiti :-)
  graffiti.style.position = 'absolute';
  graffiti.style.zIndex = '999999';

  // Place it in the same position as the selected object
  graffiti.style.top = `${window.scrollY + y}px`;
  graffiti.style.left = `${window.scrollX + x}px`;

  // Finally add the object to the web page DOM
  document.body.appendChild(graffiti);

  // Remember the clicked object and our content we placed on top of it so we
  // can tell others about it ..
  const path = getSelectorPath(target);
});
```

## Development

```bash
# Install dependencies
npm install

# Run web-extension in browser
npm run watch

# Check style and formatting
npm run lint

# Bundle web-extension
npm run build
```

## License

`MIT`
