/****************************************************************************
 ** @license
 ** This demo file is part of yFiles for HTML 2.6.0.4.
 ** Copyright (c) 2000-2024 by yWorks GmbH, Vor dem Kreuzberg 28,
 ** 72070 Tuebingen, Germany. All rights reserved.
 **
 ** yFiles demo files exhibit yFiles for HTML functionalities. Any redistribution
 ** of demo files in source code or binary form, with or without
 ** modification, is not permitted.
 **
 ** Owners of a valid software license for a yFiles for HTML version that this
 ** demo is shipped with are allowed to use the demo source code as basis
 ** for their own yFiles for HTML powered applications. Use of such programs is
 ** governed by the rights and conditions as set out in the yFiles for HTML
 ** license agreement.
 **
 ** THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESS OR IMPLIED
 ** WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 ** MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN
 ** NO EVENT SHALL yWorks BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 ** SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 ** TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 ** PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 ** LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 ** NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 ** SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 **
 ***************************************************************************/
import { Component, createRef, RefObject } from "react";
import {
  AdjacencyGraphBuilder,
  DefaultLabelStyle,
  FreeNodePortLocationModel,
  GraphComponent,
  GraphFocusIndicatorManager,
  GraphSelectionIndicatorManager,
  HorizontalTextAlignment,
  ICanvasObjectDescriptor,
  License,
  MouseWheelBehaviors,
  Point,
  Rect,
  ScrollBarVisibility,
  TextWrapping,
  VerticalTextAlignment,
  VoidNodeStyle,
} from "yfiles";
import { ActivityNodeLabelModel } from "../ActivityNodeLabelModel";
import { ActivityNodeStyle } from "../ActivityNodeStyle";
import { applyDemoTheme } from "../demo-styles";
import {
  colorPalette,
  ganttDayWidth,
  getActivityWidth,
  getLeadWidth,
  getTaskColor,
  getTaskForId,
  getX,
} from "../gantt-utils";
import GridVisual from "../GridVisual";
import yFilesLicense from "../lib/license.json";
import { Activity } from "../resources/data-model";
import { ganttChartData as dataModel } from "../resources/gantt-chart-data";
import { RestrictedViewportLimiter } from "../RestrictedViewportLimiter";
import { RoutingEdgeStyle } from "../RoutingEdgeStyle";
import {
  ganttActivityHeight,
  getActivityY,
  getTotalTasksHeight,
  updateSubRows,
} from "../sweepline-layout";
import "./ReactGraphComponent.css";
import { TaskComponent } from "./TaskComponent";
import { TimelineComponent } from "./TimelineComponent";

export default class ReactGraphComponent extends Component {
  protected readonly graphComponentDiv: RefObject<HTMLDivElement>;
  protected readonly timelineComponentDiv: RefObject<HTMLDivElement>;

  /**
   * The main graph component displaying activities and their dependencies.
   */
  private readonly graphComponent: GraphComponent;

  /**
   * The html component that visualizes the tasks.
   */
  // private readonly timelineComponent: GraphComponent;
  private taskComponent: TaskComponent | undefined;

  constructor(props: object) {
    super(props);
    this.graphComponentDiv = createRef<HTMLDivElement>();
    this.timelineComponentDiv = createRef<HTMLDivElement>();

    // include the yFiles License
    License.value = yFilesLicense;

    // create and initializes the main graph component
    this.graphComponent = createGraphComponent();
    // // create the component that visualizes the timeline
    // this.timelineComponent = new TimelineComponent(
    //   "timeline-component",
    //   this.graphComponent
    // );

    // const timelineVisual = new TimelineVisual();
    // this.timelineComponent.backgroundGroup.addChild(
    //   timelineVisual,
    //   ICanvasObjectDescriptor.VISUAL
    // );
  }

  async componentDidMount(): Promise<void> {
    // Append the GraphComponent to the DOM
    this.graphComponentDiv.current!.appendChild(this.graphComponent.div);

    // create the component that visualizes the tasks and add the tasks from the data-model
    this.taskComponent = new TaskComponent(
      "task-component",
      this.graphComponent
    );
    // create the component that visualizes the timeline
    new TimelineComponent("timeline-component", this.graphComponent);

    // this.graphComponentDiv.current!.appendChild(this.graphComponent.div);
    // this.timelineComponentDiv.current!.appendChild(this.timelineComponent.div);
    // configure graph item styles
    this.initializeStyles();
    // configureInteraction(this.graphComponent, this.onGraphModified);

    // create the graph items from the source data
    await this.populateGraph();

    this.taskComponent.createTasks();
    this.updateScrollArea();
  }

  componentWillUnmount() {
    this.graphComponent.graph.clear();
    this.graphComponentDiv.current!.removeChild(this.graphComponent.div);
    // this.timelineComponentDiv.current!.removeChild(this.timelineComponent.div);
  }

  /**
   *  Creates and assigns the default styles for graph items
   */
  initializeStyles(): void {
    // set the activity node style as default in the graph
    const graph = this.graphComponent.graph;
    graph.nodeDefaults.style = new ActivityNodeStyle(colorPalette[0]);
    // set a default label style with character wrapping
    graph.nodeDefaults.labels.style = new DefaultLabelStyle({
      textFill: "#fff",
      wrapping: TextWrapping.CHARACTER_ELLIPSIS,
      horizontalTextAlignment: HorizontalTextAlignment.CENTER,
      verticalTextAlignment: VerticalTextAlignment.CENTER,
    });
    // set the label model that places the label centered in the "main" activity part of the node
    graph.nodeDefaults.labels.layoutParameter =
      new ActivityNodeLabelModel().createDefaultParameter();

    // set the edge style as graph default
    graph.edgeDefaults.style = new RoutingEdgeStyle(20, 20);

    // disable default node decorators
    const nodeDecorator = graph.decorator.nodeDecorator;
    nodeDecorator.reshapeHandleProviderDecorator.hideImplementation();
    // nodeDecorator.positionHandlerDecorator.setImplementationWrapper(
    //   (node, wrappedHandler) =>
    //     new ActivityNodePositionHandler(node!, wrappedHandler)
    // );
    this.graphComponent.selectionIndicatorManager =
      new GraphSelectionIndicatorManager({
        nodeStyle: VoidNodeStyle.INSTANCE,
      });
    this.graphComponent.focusIndicatorManager = new GraphFocusIndicatorManager({
      nodeStyle: VoidNodeStyle.INSTANCE,
    });
  }
  /**
   * Does the necessary updates after all structural graph changes,
   * i.e. updating the sub-row information and refreshing the background.
   */
  async onGraphModified(): Promise<void> {
    // update the multi-line placement
    await updateSubRows(this.graphComponent, true);
    // update the lane height of each task
    this.taskComponent!.updateTasks();

    this.updateScrollArea();

    // trigger a background refresh
    this.graphComponent.backgroundGroup.dirty = true;
    this.graphComponent.invalidate();
  }

  /**
   * Creates the graph from the data model.
   */
  async populateGraph(): Promise<void> {
    const graph = this.graphComponent.graph;
    const graphBuilder = new AdjacencyGraphBuilder(graph);

    const nodesSource = graphBuilder.createNodesSource(
      dataModel.activities,
      (activity) => activity.id
    );
    nodesSource.nodeCreator.layoutProvider = (activity): Rect => {
      return new Rect(
        getX(activity.startTime) - getLeadWidth(activity),
        getActivityY(activity),
        getActivityWidth(activity),
        ganttActivityHeight
      );
    };
    nodesSource.nodeCreator.styleProvider = (activity): ActivityNodeStyle => {
      const task = getTaskForId(activity.taskId);
      return new ActivityNodeStyle(getTaskColor(task));
    };
    nodesSource.nodeCreator.tagProvider = (activity): Activity => activity;

    nodesSource.nodeCreator.createLabelBinding("name");

    // Create all nodes of the graph
    graphBuilder.buildGraph();

    // Now add the edges, which require specific port location models, so we cannot create
    // them via GraphBuilder
    for (const activity of dataModel.activities) {
      const targetNode = graphBuilder.getNodeById(activity.id)!;
      for (const dependency of activity.dependencies || []) {
        const sourceNode = graphBuilder.getNodeById(dependency);
        if (sourceNode) {
          const sourcePort = graph.addPort(
            sourceNode,
            FreeNodePortLocationModel.NODE_RIGHT_ANCHORED
          );
          const targetPort = graph.addPort(
            targetNode,
            FreeNodePortLocationModel.NODE_LEFT_ANCHORED
          );
          graph.createEdge(sourcePort, targetPort);
        }
      }
    }

    // put overlapping nodes in sub rows
    await updateSubRows(this.graphComponent, false);

    this.graphComponent.viewPoint = new Point(
      2223690,
      this.graphComponent.viewPoint.y
    );
  }

  /**
   * Updates the scrollable area for the component.
   */
  updateScrollArea(): void {
    this.graphComponent.updateContentRect();
    const mainCr = this.graphComponent.contentRect;

    // updateContentRect for the graphComponent will calculate the y-coordinate and the height
    // of the content rectangle from the bounds of all activity nodes.
    // Instead, we want the y-direction to extend from 0 to the total height of all tasks.
    this.graphComponent.contentRect = new Rect(
      mainCr.x,
      0,
      mainCr.width,
      getTotalTasksHeight()
    );
  }

  render() {
    return (
      <div style={{ width: "100vw", height: "100vh" }}>
        <div id="task-component"></div>
        <div className="graph-component-container">
          <div id="timeline-component" ref={this.timelineComponentDiv}></div>
          <div id="graphComponent" ref={this.graphComponentDiv}></div>
        </div>

        <div id="info" className="info elevation-4 hidden"></div>
        <div id="node-info" className="node-info elevation-8 hidden"></div>
      </div>
    );
  }
}
/**
 * Configures the main graph component displaying activities and their dependencies.
 */
function createGraphComponent(): GraphComponent {
  const gc = new GraphComponent();
  applyDemoTheme(gc);

  // switch on the horizontal scrollbar
  gc.horizontalScrollBarPolicy = ScrollBarVisibility.ALWAYS;
  // switch off mousewheel zoom
  gc.mouseWheelBehavior = MouseWheelBehaviors.SCROLL;
  gc.mouseWheelScrollFactor = 50;

  // install a viewport limiter, so it's impossible to scroll out of the graph area
  gc.viewportLimiter = new RestrictedViewportLimiter();

  // limit zoom to 1
  gc.maximumZoom = 1;
  gc.minimumZoom = 1;

  // add the background visualization to the component
  const gridVisual = new GridVisual();
  gc.backgroundGroup.addChild(
    gridVisual,
    ICanvasObjectDescriptor.ALWAYS_DIRTY_INSTANCE
  );

  // Use a different look for the handles that change the lead/follow-up time of activities
  // gc.resources.set(
  //   HandleInputMode.HANDLE_DRAWING_RESIZE_VARIANT2_KEY,
  //   new TimeHandleTemplate()
  // );

  // gc.addViewportChangedListener(() => hideActivityInfo());

  return gc;
}
