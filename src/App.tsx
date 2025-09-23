
import { ReactLikeC4 } from 'likec4:react'
import { useHash } from 'react-use'
import { ElementNode } from './CustomNodes'
import { CustomOverlay } from './CustomOverlay'
import { useCustomOverlay } from './context'
import injectStyles from './App.css?inline'


function App() {
  const [hash, setHash] = useHash()
  const { close } = useCustomOverlay()

  const viewId = hash.slice(1) || 'index'

  return (
    <ReactLikeC4
      colorScheme='dark'
      viewId={viewId}
      controls
      background='dots'
      enableElementDetails
      enableFocusMode
      enableSearch
      enableElementTags={false}
      dynamicViewVariant='sequence'
      enableRelationshipBrowser={false}
      enableRelationshipDetails={false}
      onNavigateTo={(id) => setHash(`#${id}`)}
      onCanvasClick={() => close}
      renderNodes={{
        element: ElementNode,
      }}
    >
      {/* Inject the custom styles inside the shadow DOM */}
      <style type="text/css" dangerouslySetInnerHTML={{ __html: injectStyles }} />
      <CustomOverlay />
    </ReactLikeC4>
  )
}

export default App
