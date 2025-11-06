import {
  addPropertyControls,
  // @ts-ignore
  getPropertyControls,
  // @ts-ignore
  useQueryData,
  ControlType,
  RenderTarget,
} from "framer";
import { cloneElement, Children } from "react";

import Carousel from "https://framer.com/m/Carousel-bt0d.js";
import {
  CanvasPlaceholder,
  getCollectionListItems,
} from "https://framer.com/m/CMSSlideshow-xxTt.js@Gwq5XNGR2fw3oxqNnFeg";

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 * @framerIntrinsicWidth 400
 * @framerIntrinsicHeight 200
 */
export default function CMSCarousel(props) {
  const { startLayers, endLayers, ...otherProps } = props;
  const isCanvas = RenderTarget.current() === RenderTarget.canvas;

  const items = isCanvas
    ? []
    : getCollectionListItems(props.collectionList?.[0]);

  let layers = [];

  if (startLayers) {
    layers = layers.concat(startLayers);
  }

  if (!isCanvas) {
    for (let i = 0; i < items.length; i++) {
      layers.push(items[i].props.children.props.children);
    }
  } else {
    let count = 1;

    if (props.axis) {
      // Horizontal
      if (props.sizingObject.widthType == "columns") {
        count = props.sizingObject.widthColumns;
      }
    } else {
      // Vertical
      if (props.sizingObject.heightType == "columns") {
        count = props.sizingObject.heightColumns;
      }
    }

    for (let i = 0; i < count; i++) {
      layers.push(
        <CanvasPlaceholder
          title="Run project to view carousel content"
          subtitle="Collection List content is not accessible to the carousel component in the editor. Run your project or visit the live website to view the carousel with CMS content."
        />,
      );
    }
  }

  if (endLayers) {
    layers = layers.concat(endLayers);
  }

  return <Carousel {...otherProps} slots={layers} />;
}

CMSCarousel.displayName = "CMS Carousel";

addPropertyControls(CMSCarousel, {
  collectionList: {
    type: ControlType.ComponentInstance,
  },
  startLayers: {
    type: ControlType.Array,
    control: {
      type: ControlType.ComponentInstance,
    },
    title: "Start",
  },
  endLayers: {
    type: ControlType.Array,
    control: {
      type: ControlType.ComponentInstance,
    },
    title: "End",
  },
  ...getComponentProps(Carousel),
});

function getComponentProps(component) {
  const { slots, ...otherProps } = getPropertyControls(component);
  return otherProps;
}
