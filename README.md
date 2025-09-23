# LikeC4 Custom Nodes Example

This project demonstrates advanced customization capabilities of **LikeC4** - a powerful architecture diagramming tool that combines the expressiveness of a domain-specific language with the flexibility of React components.

## 🎯 Purpose

The main purpose of this example is to showcase how to extend and customize LikeC4's default behavior through:

- **Custom Element Nodes**: Override default node rendering with custom React components
- **Custom Overlays**: Create interactive overlays for displaying detailed information
- **Custom Shapes**: Implement unique visual representations using SVG and drawing libraries
- **Enhanced Interactions**: Add custom buttons, toolbars, and interactive behaviors
- **Style Customization**: Inject custom CSS and theming

## ▶️ Open Online

- StackBlitz: [Open in StackBlitz](https://stackblitz.com/github/OWNER/REPO)
- CodeSandbox: [Open in CodeSandbox](https://codesandbox.io/p/github/OWNER/REPO)
- Gitpod: [Open in Gitpod](https://gitpod.io/#https://github.com/OWNER/REPO)

Replace `OWNER/REPO` with your GitHub repository path after pushing this project to GitHub.

## 🏗️ Architecture Source

View the complete architecture model in the [LikeC4 DSL source file](likec4/showcase.c4).

## 🚀 Key Customizations Demonstrated

### 1. Custom Element Nodes (`src/CustomNodes.tsx`)

```tsx
export const ElementNode = elementNode(({ nodeModel, nodeProps }) => {
  // Custom node with additional buttons and metadata display
  return (
    <ElementNodeContainer nodeProps={nodeProps}>
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
      {isHoveredOrSelected && nodeModel.element.hasMetadata() && (
        <XYFlow.NodeToolbar>
          <div className='metadata'>
            {Object.entries(nodeModel.element.getMetadata()).map(([key, value]) => (
              <Fragment key={key}>
                <div data-metadata-key>{key}</div>
                <div data-metadata-value>{value}</div>
              </Fragment>
            ))}
          </div>
        </XYFlow.NodeToolbar>
      )}
    </ElementNodeContainer>
  );
})
```

### 2. Custom Overlay System (`src/CustomOverlay.tsx`)

```tsx
export function CustomOverlay() {
  const likec4model = useLikeC4Model()
  const { visibleElement, close } = useCustomOverlay()

  const element = visibleElement ? likec4model.findElement(visibleElement) : null

  return (
    <PortalToContainer>
      {element && (
        <Overlay onClose={close} openDelay={100}>
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

### 3. Custom Shapes (`src/CustomShapes.tsx`)

- **Stripe Logo Integration**: Dynamically displays Stripe logo based on metadata
- **Hand-drawn Rectangles**: Uses RoughJS to create organic, sketch-like rectangles

```tsx
export function CustomShape({nodeModel, nodeProps}: ElementNodeProps<UnknownLayouted>) {
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

### 4. Enhanced Styling (`src/styles.css`)

Custom CSS injected into the LikeC4 shadow DOM for consistent theming and additional visual effects.

### 5. Context and State Management (`src/context.ts`)

```tsx
export const CustomOverlayCtx = createContext({
  visibleElement: null as Fqn | null,
  open: (_fqn: Fqn) => { },
  close: () => { }
} as const)
```

### 6. Configuration-Based Styling (`likec4/likec4.config.ts`)

You can override default colors and relationship styles globally using `likec4/likec4.config.ts`.

```ts
import { defineConfig } from 'likec4/config'

export default defineConfig({
  name: 'cloud-system',
  title: 'Cloud System',
  styles: {
    theme: {
      colors: {
        primary: '#256828ff',
        muted: '#484e4cff'
      }
    },
    defaults: {
      color: 'sky',
      opacity: 10,
      relationship: {
        color: 'muted',
        line: 'dotted',
        arrow: 'open'
      }
    }
  }
})
```

- Theme: overrides global palette (e.g., `primary`, `muted`).
- Defaults: sets baseline element `color`, `opacity`, and relationship style (`color`, `line`, `arrow`).

## 🔧 Technical Stack

- **LikeC4**: Core diagramming engine
- **React 19**: UI framework with hooks and context
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and development server
- **RoughJS**: Hand-drawn style graphics
- **React Use**: Additional React utilities

## 📋 Prerequisites

- Node.js 20+
- pnpm (recommended) or npm

## 🚀 Getting Started

> Note: This project uses the LikeC4 Vite plugin to load and compile the `.c4` model files. See the docs: https://likec4.dev/tooling/vite-plugin/

1. **Install dependencies**:
   ```bash
   pnpm install
   ```
   The Vite plugin is automatically enabled via your project configuration - `vite.config.ts`.  
   TypeScript ambient types are hooked up via `src/vite-env.d.ts`.

2. **Start development server**:
   ```bash
   pnpm dev
   ```

3. **Open your browser**:
   Navigate to `http://localhost:5173`

4. **Reference types** (already set up):
   In `src/vite-env.d.ts`, we include:
   ```ts
   /// <reference types="likec4/vite-plugin-modules" />
   ```
   This augments TypeScript with module declarations exposed by the LikeC4 Vite plugin so imports like `likec4:react` and `likec4/react` resolve with proper types.

5. **Explore the diagram**:
   - Hover over elements to see custom toolbars
   - Click the "+" button on elements to open custom overlays
   - Notice the hand-drawn style rectangles and Stripe logo

## 🔗 Routing and View Navigation

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

## 🎨 Customization Examples

### Adding New Shape Types

1. Define the shape logic in `CustomShapes.tsx`
2. Add corresponding styles in `styles.css`
3. Use metadata in your LikeC4 model to trigger the custom shape

### Extending Node Behavior

1. Modify `CustomNodes.tsx` to add new buttons or interactions
2. Use the `useDiagram` hook to access diagram functionality
3. Leverage `useLikeC4Model` for programmatic model access

### Creating Custom Overlays

1. Extend the context in `context.ts`
2. Add new overlay components in `CustomOverlay.tsx`
3. Connect overlay triggers in your custom nodes

## 📖 Learn More

- [LikeC4 Documentation](https://likec4.org)
- [React Integration Guide](https://likec4.org/docs/react)
- [DSL Reference](https://likec4.org/docs/dsl)
- [Vite Plugin Docs](https://likec4.dev/tooling/vite-plugin/)

## 🤝 Contributing

This example project demonstrates various customization patterns. Feel free to:

- Experiment with new shape implementations
- Add interactive features
- Improve the styling and theming
- Extend the model with additional elements

## 📄 License

This project is provided as an educational example for LikeC4 customization.
