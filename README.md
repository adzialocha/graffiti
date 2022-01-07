# graffiti

```typescript
//   __   __        ___  ___   ___
//  / _` |__)  /\  |__  |__  |  |  |
//  \__> |  \ /~~\ |    |    |  |  |
//
// What is public space on the internet?
//
// I N S T R U C T I O N S
//
// 1. Open graffiti.place in your web browser.
// 2. Download and install the "Graffiti" browser extension. You find more
//    instructions on how to install and use the extension on the web page.
// 3. Surf any web page and place music, images or texts on top of it. The 
//    content will be visible to everyone who have the extension installed.
//
// H O W  D O E S  I T  W O R K ?
//
// Below you find a small code fragment explaining the basic principle.
//
// Imagine your browser has just downloaded a web page from someones server.
//
// Every web page consists of objects which form its structure and content.
// These objects are represented as the so-called DOM ("Document Object
// Model").
//
// Knowing the DOM we can use it to determine the position of every object on
// the web page to simply place something else on top of it.
//
// You click somewhere on the web page ..
window.addEventListener('click', (event: Event) => {
  // Get the object you just clicked on the web page
  const target = event.target as HTMLElement;

  // Determine the x and y position of it
  const { x, y } = target.getBoundingClientRect();

  // Create a new object, it does not contain anything yet, but we could give
  // it an image, video, text or audio ..
  const graffiti = document.createElement('div');

  // We want this object to be on top of everything else, similar to real
  // graffiti :-)
  graffiti.style.position = 'absolute';
  graffiti.style.zIndex = '999999';

  // Place it in the same position as the clicked object
  graffiti.style.top = `${window.scrollY + y}px`;
  graffiti.style.left = `${window.scrollX + x}px`;

  // Finally add it to the web page DOM
  document.body.appendChild(graffiti);

  // Remember the path of the clicked object and our content we placed on top
  // of it so we can tell others about it ..
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
