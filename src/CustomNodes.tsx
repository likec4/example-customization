import {
  DefaultHandles,
  ElementActions,
  ElementData,
  ElementNodeContainer,
  XYFlow,
  elementNode,
  useDiagram,
  useLikeC4Styles
} from 'likec4/react';
import { useDeferredValue } from 'react';
import { Fragment } from 'react/jsx-runtime';
import { useCustomOverlay } from './context';
import { CustomShape } from './CustomShapes';

export const ElementNode = elementNode(({ nodeModel, nodeProps }) => {
  const { open } = useCustomOverlay()

  // This is how we can access the diagram
  const diagram = useDiagram();

  // This is how we can access the colors
  const _color = useLikeC4Styles().colors(nodeModel.color);

  const isHovered = useDeferredValue(!!nodeProps.data.hovered);

  const isHoveredOrSelected = isHovered || nodeProps.selected;

  return (
    <ElementNodeContainer nodeProps={nodeProps}>
      <CustomShape nodeModel={nodeModel} nodeProps={nodeProps} />
      <ElementData {...nodeProps} />
      <ElementActions {...nodeProps}
        extraButtons={[{
          key: 'bolt',
          icon: <IconBolt/>,
          onClick(e) {
            e.stopPropagation();
            open(nodeModel.id);
          },
        }]}
      />
      <DefaultHandles />
      {(isHoveredOrSelected && nodeModel.element.hasMetadata()) && (
        <XYFlow.NodeToolbar
          isVisible
          offset={0}
          position={XYFlow.Position.Top}
          align={'center'}
          data-likec4-color={nodeProps.data.color}
          // ❇️ This is a class from styles.css
          //    injected in the shadow DOM
          className='node-toolbar '
        >
          <div style={{ fontSize: 24 }}>🛠️</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className='metadata'>
              Metadata
            </div>
            <div className='metadata'>
              {Object.entries(nodeModel.element.getMetadata()).map(([key, value]) => (
                <Fragment key={key}>
                <div data-metadata-key>{key}</div>
                <div data-metadata-value>{value}</div>
              </Fragment>))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={(e) => {
                  e.stopPropagation();
                  diagram.openElementDetails(nodeModel.id)
                }}>
                Open Details
              </button>
              <button onClick={(e) => {
                  e.stopPropagation();
                  diagram.focusNode(nodeModel.id)
                }}
              >Focus</button>
            </div>
          </div>
        </XYFlow.NodeToolbar>
      )}
    </ElementNodeContainer>
  );
})

const IconBolt = () => (
  <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M12 2.02c-5.51 0-9.98 4.47-9.98 9.98s4.47 9.98 9.98 9.98 9.98-4.47 9.98-9.98S17.51 2.02 12 2.02zm0 17.96c-4.4 0-7.98-3.58-7.98-7.98S7.6 4.02 12 4.02 19.98 7.6 19.98 12 16.4 19.98 12 19.98zM12.75 5l-4.5 8.5h3.14V19l4.36-8.5h-3z"></path></svg>
)
