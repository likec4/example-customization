import type { Fqn } from 'likec4/model';
import { Overlay, PortalToContainer, useDiagram } from 'likec4/react';
import { useLikeC4Model } from 'likec4:react';
import { useMemo, useState, type PropsWithChildren } from 'react';
import { CustomOverlayCtx, useCustomOverlay } from './context';

export const CustomOverlayProvider = ({ children }: PropsWithChildren) => {
  const [visibleElement, setElement] = useState<Fqn | null>(null);

  return (
    <CustomOverlayCtx value={useMemo(() => ({
      visibleElement,
      open: setElement,
      close: () => setElement(null)
    }), [visibleElement])}>
      {children}
    </CustomOverlayCtx>
  )
}

export function CustomOverlay() {
  const likec4model = useLikeC4Model()
  const diagram = useDiagram()
  const { visibleElement, close } = useCustomOverlay()

  const element = visibleElement ? likec4model.findElement(visibleElement) : null

  if (visibleElement && !element) {
    throw new Error(`Element with FQN ${visibleElement} not found`)
  }

  return (
    // This is a portal to the diagram container, so the overlay is rendered above the diagram
    <PortalToContainer>
      {element && (
        <Overlay onClose={close} openDelay={100}>
          <div style={{ padding: 32 }}>
            <h2>Custom Overlay</h2>
            <p>Here you have access to the LikeC4 ModelAPI and can display any custom content</p>
            {element.hasMetadata() ? (
              <>
                <p>For example, you can display the element's metadata:</p>
                <pre>
                  <code>{JSON.stringify(element.getMetadata(), null, 2)}</code>
                </pre>
              </>
            ) : (
              <>
                <p>For example, you can display the element's source data:</p>
                {/* Stringify source data of element */}
                <pre>
                  <code>{JSON.stringify(element.$element, null, 2)}</code>
                </pre>
              </>
            )}
            <p>You can also trigger Diagram API:</p>
            <button
              onClick={() => {
                const viewId = diagram.currentView.id
                const another = [...likec4model.views()].find(v => v.id !== viewId)
                if (another) {
                  setTimeout(() => {
                    // Animate transition to another view from the current node
                    const fromNode = likec4model.view(viewId).findNodeWithElement(element)
                    diagram.navigateTo(another.id, fromNode?.id)
                  }, 100)
                }
                close()
              }}>
              Open another view
            </button>

          </div>
        </Overlay>
      )}
    </PortalToContainer>
  )
}
