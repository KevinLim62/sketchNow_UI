<template>
  <ToolSelector :selected-tool="selectedTool" v-on:handleSelectTool="handleSelectedTool" />
  <div ref="boardElement" id="sketchBoard" class="flex w-full items-center justify-center border bg-slate-100 relative">
    <v-stage :config="configKonva"> </v-stage>
  </div>
</template>

<script setup lang="ts">
import Konva from 'konva';
import { ref, reactive, onMounted } from 'vue';
import type { Stage } from 'konva/lib/Stage';
import type { Layer } from 'konva/lib/Layer';
import type { Transformer } from 'konva/lib/shapes/Transformer';
import useSocket from '~/composables/socket';
import type { Shape } from 'konva/lib/Shape';

const props = defineProps({
  boardRoomId: String,
});

// Use the WebSocket composable
const { sendMessage, onMessage, connect, disconnect } = useSocket();
const THROTTLE = 50;
const sendMessageThrottle = useThrottle(sendMessage, THROTTLE);
const sessionData = localStorage.getItem('userSession');
const boardElement = ref<HTMLDivElement>();
const configKonva = ref({
  width: 0,
  height: 0,
});
const userSession = ref(JSON.parse(sessionData ?? ''));
const selectedTool = ref('pointer');
const userShapes: Shape[] = reactive([]);
const cursors = ref(new Map());
const handleSelectedTool = (tool: string) => {
  selectedTool.value = tool;
};

let linePoints: number[] = [];
let stage: Stage | null = null; // Define stage variable
let layer: Layer | null = null; // Define layer variable
let tr: Transformer | null = null;

onMounted(() => {
  if (boardElement.value) {
    configKonva.value.width = boardElement.value.clientWidth;
    configKonva.value.height = boardElement.value.clientHeight;
  }

  stage = new Konva.Stage({
    container: 'sketchBoard',
    width: configKonva.value.width,
    height: configKonva.value.height,
  });

  layer = new Konva.Layer();
  stage.add(layer);

  tr = new Konva.Transformer();
  layer.add(tr);

  connect(`/${props.boardRoomId}`);
  stage.on('pointermove', (e) => {
    const mousePos = stage?.getPointerPosition();
    const payload = JSON.stringify({
      x: mousePos?.x,
      y: mousePos?.y,
      tool: selectedTool.value,
      userId: userSession.value.id ?? '',
      name: userSession.value.name ?? '',
      roomId: props.boardRoomId,
      shapes: userShapes.map((shape) => shape.attrs),
    });
    sendMessageThrottle(payload);
  });

  tr?.on('transformend', (e) => {
    const shapeIndex = userShapes.findIndex((el) => el._id === e.target._id);
    //update new state to the selected shapes
    if (shapeIndex !== -1) {
      userShapes[shapeIndex].attrs.x = e.target.x();
      userShapes[shapeIndex].attrs.y = e.target.y();
      userShapes[shapeIndex].attrs.rotation = e.target.rotation();
      userShapes[shapeIndex].attrs.width = e.target.width();
      userShapes[shapeIndex].attrs.height = e.target.height();
    }
  });

  onMessage((data) => {
    if (data.roomId !== props.boardRoomId) return;

    cursors.value.set(data.name, data);
    // Convert the cursors map to an array for rendering
    const cursorsArray = computed(() => {
      return Array.from(cursors.value.entries());
    });

    cursorsArray.value.forEach((cursor) => {
      if (cursor[0] !== userSession.value.name) {
        const isExisting = layer?.findOne(`#${cursor[0]}`);
        if (isExisting) {
          //remove the existing cursor and recreate new one
          isExisting.remove();
        }

        const c = new Konva.Arrow({
          x: cursor[1].x,
          y: cursor[1].y,
          points: [1, 1, 0, 0],
          pointerLength: 5,
          pointerWidth: 5,
          fill: 'black',
          stroke: 'black',
          strokeWidth: 2,
          id: cursor[1].name,
        });

        layer?.add(c);
        layer?.draw();
      }
    });
  });
});

// onUnmounted(() => {
//   disconnect();
// });

watch(selectedTool, (val, oldVal) => {
  switch (val) {
    case 'rect':
      stage?.off('mousemove');
      stage?.off('mousedown tap');
      stage?.off('dblclick dbltap');
      tr?.nodes([]);
      stage!.container().style.cursor = 'crosshair';

      // Event for drawing Rect
      let rect: any; // Store the reference to the rectangle shape
      let isRectDrawing = false;
      let rectX: number = 0;
      let rectY: number = 0;

      stage?.on('mousedown touchstart', (e) => {
        isRectDrawing = true;
        const mousePos = stage?.getPointerPosition();
        rectX = mousePos?.x ?? 0;
        rectY = mousePos?.y ?? 0;
        rect = drawRect(rectX, rectY); // Start drawing the rectangle
      });

      stage?.on('mousemove touchmove', (e) => {
        if (!isRectDrawing) return;
        const mousePos = stage?.getPointerPosition();
        const width = (mousePos?.x ?? 0) - rectX;
        const height = (mousePos?.y ?? 0) - rectY;
        rect.width(width); // Update the width of the rectangle
        rect.height(height); // Update the height of the rectangle
        layer?.add(rect);
        layer?.batchDraw(); // Batch draw to update the layer
      });

      stage?.on('mouseup touchend', (e) => {
        isRectDrawing = false;
        userShapes.push(rect);
        selectedTool.value = 'pointer';
      });
      break;

    case 'circle':
      stage?.off('mousemove');
      stage?.off('mousedown tap');
      stage?.off('dblclick dbltap');
      tr?.nodes([]);

      stage!.container().style.cursor = 'crosshair';

      // Event for drawing Circle
      let circle: any; // Store the reference to the rectangle shape
      let isCircleDrawing = false;

      let cirX: number = 0;
      let cirY: number = 0;

      stage?.on('mousedown touchstart', (e) => {
        isCircleDrawing = true;
        const mousePos = stage?.getPointerPosition();
        cirX = mousePos?.x ?? 0;
        cirY = mousePos?.y ?? 0;
        circle = drawCircle(cirX, cirY); // Start drawing the rectangle
      });

      stage?.on('mousemove touchmove', (e) => {
        if (!isCircleDrawing) return;
        const mousePos = stage?.getPointerPosition();
        const radius = (mousePos?.x ?? 0) - cirX;
        circle.radius(radius); // Update the width of the rectangle
        layer?.add(circle);
        layer?.batchDraw(); // Batch draw to update the layer
      });

      stage?.on('mouseup touchend', (e) => {
        isCircleDrawing = false;
        userShapes.push(circle);
        selectedTool.value = 'pointer';
      });

      break;

    case 'line':
      stage?.off('mousedown touchstart');
      stage?.off('mouseup touchend');
      stage?.off('mousedown tap');
      stage?.off('dblclick dbltap');
      tr?.nodes([]);

      // Event for drawing line
      stage?.on('mousemove', (e) => {
        const mousePos = stage?.getPointerPosition();
        if (e.evt.buttons !== 1) {
          // If the left mouse button is not pressed, exit
          linePoints = [];
          return;
        }
        drawLine(layer, mousePos?.x ?? 0, mousePos?.y ?? 0);
      });
      break;

    case 'pointer':
      stage?.off('mousedown touchstart');
      stage?.off('mouseup touchend');
      stage?.off('mousemove');
      stage?.off('dblclick dbltap');

      stage!.container().style.cursor = 'default';
      // Event listener for mousedown on the stage
      stage?.on('mousedown tap', function (e) {
        //If user click on stage, clear the transformer
        if (e.target === e.target.getStage()) {
          tr?.nodes([]);
        } else {
          const pos = stage?.getPointerPosition();
          const shapeIndex = userShapes.findIndex((s) => {
            return s.intersects(pos);
          });
          if (shapeIndex !== -1) {
            handleSelection(shapeIndex, layer);
          }
        }
      });
      break;

    case 'text':
      stage?.off('mousedown touchstart');
      stage?.off('mouseup touchend');
      stage?.off('mousemove');
      stage?.off('mousedown tap');

      // Event for writing text
      stage?.on('dblclick dbltap', (e) => {
        // Get mouse position relative to the stage
        const mousePos = stage?.getPointerPosition();

        if (mousePos) {
          drawText(layer, mousePos.x, mousePos.y, ' ');
        }
      });
      break;

    default:
      break;
  }
});

const handleSelection = (shapeIndex: number, layer: Layer | null) => {
  tr?.nodes([userShapes[shapeIndex]]);
};

const drawLine = (layer: Layer | null, xPos: number, yPos: number) => {
  linePoints = [...linePoints, xPos, yPos];

  // Create a Konva.Line with current points
  const line = new Konva.Line({
    points: linePoints,
    stroke: 'red',
    strokeWidth: 5,
    lineCap: 'round',
    lineJoin: 'round',
    tension: 1,
  });
  console.log(line);
  // Add the new line to the layer
  layer?.add(line);
  layer?.batchDraw();
  userShapes.push(line);
};

const drawRect = (startX: number, startY: number) => {
  return new Konva.Shape({
    x: startX,
    y: startY,
    fill: 'green',
    stroke: 'black',
    strokeWidth: 4,
    draggable: true,
    sceneFunc: function (context, shape) {
      context.beginPath();
      context.moveTo(startX, startY);
      context.rect(0, 0, shape.getAttr('width'), shape.getAttr('height'));
      context.closePath();
      context.fillStrokeShape(shape);
    },
  });
};

const drawCircle = (startX: number, startY: number) => {
  return new Konva.Circle({
    x: startX,
    y: startY,
    fill: 'red',
    stroke: 'black',
    strokeWidth: 4,
    draggable: true,
    sceneFunc: function (context, shape) {
      context.beginPath();
      context.arc(0, 0, shape.getAttr('radius'), 0, Math.PI * 2); // Draw a full circle
      context.closePath();
      context.fillStrokeShape(shape);
    },
  });
};

const drawText = (layer: Layer | null, startX: number, startY: number, text: string) => {
  const textNode = new Konva.Text({
    text: text,
    x: startX,
    y: startY,
    fontSize: 20,
    draggable: true,
  });

  layer?.add(textNode);
  tr?.nodes([textNode]);
  textNode.hide();
  //tr?.hide();

  const textPosition = textNode.absolutePosition();
  const areaPosition = {
    x: stage!.container().offsetLeft + textPosition.x,
    y: stage!.container().offsetTop + textPosition.y,
  };
  // create textarea and style it
  const textarea = document.createElement('textarea');
  document.body.appendChild(textarea);

  textarea.value = textNode.text();
  textarea.style.position = 'absolute';
  textarea.style.top = areaPosition.y + 'px';
  textarea.style.left = areaPosition.x + 'px';
  textarea.style.width = textNode.width() - textNode.padding() * 2 + 'px';
  textarea.style.height = textNode.height() - textNode.padding() * 2 + 5 + 'px';
  textarea.style.fontSize = textNode.fontSize() + 'px';
  textarea.style.border = 'none';
  textarea.style.padding = '0px';
  textarea.style.margin = '0px';
  textarea.style.overflow = 'hidden';
  textarea.style.background = 'none';
  textarea.style.outline = 'none';
  textarea.style.resize = 'none';
  textarea.style.lineHeight = String(textNode.lineHeight());
  textarea.style.fontFamily = textNode.fontFamily();
  textarea.style.transformOrigin = 'left top';
  textarea.style.textAlign = textNode.align();
  textarea.style.color = textNode.fill();
  textarea.focus();

  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      textarea.removeChild(textarea);
      textNode.show();
      tr?.show();
      tr?.forceUpdate();
    }
  });

  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      textNode.text(textarea.value);
      const scaleY = textNode.getAbsoluteScale().y;
      const newHeight = textNode.height() * (scaleY + 0.5);
      textarea.style.height = newHeight + 'px';
    } else {
      textNode.text(textarea.value);
      const scaleX = textNode.getAbsoluteScale().x;
      const newWidth = textNode.width() * (scaleX + 0.5);
      textarea.style.width = newWidth + 'px';
    }
  });
};
</script>

<style scoped></style>
