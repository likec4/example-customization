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
          key: 'details',
          icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>,
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
          // This is a class from styles.css, injected in the shadow DOM
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
