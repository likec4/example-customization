import type { Fqn } from 'likec4/model';
import { Overlay, PortalToContainer } from 'likec4/react';
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
  const { visibleElement, close } = useCustomOverlay()

  const element = visibleElement ? likec4model.findElement(visibleElement) : null

  if (visibleElement && !element) {
    throw new Error(`Element with FQN ${visibleElement} not found`)
  }

  return (
    <PortalToContainer>
      {element && (
        <Overlay onClose={close} openDelay={100}>
          <h1>Custom Overlay</h1>
          {/* Stringify source data of element */}
          <pre>
            <code>{JSON.stringify(element.$element, null, 2)}</code>
          </pre>
        </Overlay>
      )}
    </PortalToContainer>
  )
}
