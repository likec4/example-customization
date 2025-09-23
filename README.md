# LikeC4 Customization Example

This repository demonstrates advanced customization capabilities of **LikeC4**.

## Purpose

The main purpose of this example is to showcase how to extend and customize LikeC4's default behavior through:

- **Custom Element Nodes**: Override default node rendering with custom React components
- **Custom Overlays**: Create interactive dialogs for displaying detailed information
- **Custom Shapes**: Implement unique visual representations using SVG and drawing libraries
- **Enhanced Interactions**: Add custom buttons, toolbars, and interactive behaviors
- **Style Customization**: Override default theme and inject custom CSS

## Try Online

Open this repository with:
- StackBlitz: [Open in StackBlitz](https://stackblitz.com/github/likec4/example-customization)
- CodeSandbox: [Open in CodeSandbox](https://codesandbox.io/p/github/likec4/example-customization)
- Gitpod: [Open in Gitpod](https://gitpod.io/#https://github.com/likec4/example-customization)


## Architecture Source

View the architecture model in the [LikeC4 DSL source file](likec4/showcase.c4).

## 🚀 Key Customizations Demonstrated

This project created by `npx create-vite --template react-ts`.  
It uses the [LikeC4 Vite plugin](https://likec4.dev/tooling/vite-plugin/) to load and compile the `.c4` model files.

### 1. Custom Nodes (`src/CustomNodes.tsx`)

```tsx
import {
  DefaultHandles,
  ElementActions,
  ElementData,
  ElementNodeContainer,
  XYFlow,
  elementNode,
  useDiagram,
} from 'likec4/react'

// Custom rendering of logical elements:
// - adds extra action button
// - displays toolbar with metadata on hover
export const ElementNode = elementNode(({ nodeModel, nodeProps }) => {
  const diagram = useDiagram()
  
  return (
    <ElementNodeContainer nodeProps={nodeProps}>
      {/* Use custom shape, see below */}
      <CustomShape nodeModel={nodeModel} nodeProps={nodeProps} />
      <ElementData {...nodeProps} />
      <ElementActions {...nodeProps}
        extraButtons={[{
          key: 'details',
          icon: <PlusIcon />,
          onClick(e) {
            e.stopPropagation();
            open(nodeModel.id);
          },
        }]}
      />
      <DefaultHandles />
      {/* Custom toolbar with metadata */}
      {nodeProps.data.hovered
       && nodeModel.element.hasMetadata()
       && (
          <XYFlow.NodeToolbar>
            {entries(nodeModel.element.getMetadata())
              .map(([key, value]) => (
                <MetadataValue key={key} label={key} value={value} />
              ))}
          </XYFlow.NodeToolbar>
        )
      }
    </ElementNodeContainer>
  );
})
```

### 2. Custom Shapes (`src/CustomShapes.tsx`)

- **Render anything on top of default shape**: This example displays Stripe logo based on metadata
- **Hand-drawn Rectangles**: Uses RoughJS to create organic, sketch-like rectangles
- **Fallback to default shape**: If no custom shape is found, the default shape is rendered

```tsx
import type { ElementNodeProps } from 'likec4/react'
import { ElementShape } from 'likec4/react'

export function CustomShape({nodeModel, nodeProps}: ElementNodeProps) {
  const metadata = nodeModel.element.getMetadata()
  const nodeData = nodeProps.data

  switch(true) {
    case metadata._shape === 'stripe': {
      return <>
        <ElementShape {...nodeProps}/>
        <StripeLogo/>
      </>
    }
    case nodeData.shape === 'rectangle': {
      return <RoughRectangle width={nodeData.width} height={nodeData.height}/>
    }
    default: {
      return <ElementShape {...nodeProps}/>
    }
  }
}
```

### 3. Custom Overlay (`src/CustomOverlay.tsx`)

LikeC4 provides a `PortalToContainer` that can be used to render your components in the diagram's Shadow DOM.

```tsx
import { 
  Overlay,
  PortalToContainer,
  useLikeC4Model,
} from 'likec4/react'

export function CustomOverlay({ elementId, close }: Props) {
  const likec4model = useLikeC4Model()
  const element = likec4model.findElement(elementId)

  return (
    <PortalToContainer>
      {element && (
        <Overlay onClose={close}>
          <h1>Custom Overlay</h1>
          <pre>
            <code>{JSON.stringify(element.$element, null, 2)}</code>
          </pre>
        </Overlay>
      )}
    </PortalToContainer>
  )
}
```

### 4. Override Default Theme (`likec4/likec4.config.ts`)

You can override default colors and styles globally using `likec4/likec4.config.ts`.

```ts
import { defineConfig } from 'likec4/config'

export default defineConfig({
  name: 'example',
  styles: {
    theme: {
      colors: {
        // This will override the default primary color
        primary: '#256828',
      }
    },
    defaults: {
      color: 'sky', // Set default color for nodes,
                    // replacing "primary"
      opacity: 10,
      relationship: {
        line: 'solid',
        arrow: 'open'
      }
    }
  }
})
```

## Prerequisites

- Node.js 20+
- pnpm (recommended) or npm

## Getting Started

1. **Install dependencies**:
   ```bash
   pnpm install
   ```
   The Vite plugin is automatically enabled via your project configuration - `vite.config.ts`.  


2. **Start development server**:
   ```bash
   pnpm dev
   ```

3. **Open your browser**:
   Navigate to `http://localhost:5173`

4. **Reference types** (already set up):  
   In `src/vite-env.d.ts`, we include:
   TypeScript ambient types are hooked up via `src/vite-env.d.ts`.  
   ```ts
   /// <reference types="likec4/vite-plugin-modules" />
   ```   
   This augments TypeScript with module declarations exposed by the LikeC4 Vite plugin so imports like `likec4:react` resolve with proper types.

## Routing and View Navigation

Routing between views is handled via the URL hash. The app reads the hash to decide which LikeC4 view to display and updates it on navigation:

```tsx
// src/App.tsx
const [hash, setHash] = useHash()
const viewId = hash.slice(1) || 'index'

<ReactLikeC4
  viewId={viewId}
  onNavigateTo={(id) => setHash(`#${id}`)}
  ...
/>
```

- Deep-linking: shareable URLs like `/#saas` open the `saas` view.
- Back/forward navigation: browser history works naturally with hash changes.

## Learn More

- [LikeC4 website](https://likec4.dev)
- [DSL Reference](hhttps://likec4.dev/dsl/intro/)
- [Vite Plugin Docs](https://likec4.dev/tooling/vite-plugin/)
- [React Integration Guide](https://likec4.dev/tooling/react/)

## License

This project is provided as an educational example for LikeC4 customization.
