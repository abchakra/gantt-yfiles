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
import type { Class, IEdge, IEdgeStyleRenderer, Tangent } from 'yfiles'
import {
  Arrow,
  ArrowType,
  BaseClass,
  EdgeStyleDecorationInstaller,
  GeneralPath,
  IArrow,
  IEdgeStyle,
  IHighlightIndicatorInstaller,
  PathBasedEdgeStyleRenderer,
  Point,
  Stroke
} from 'yfiles'

/**
 * An edge style that draws an edge in an orthogonal fashion.
 * All existing bends of the edge are ignored.
 */
export class RoutingEdgeStyle extends BaseClass<IEdgeStyle>(IEdgeStyle) {
  /**
   * Creates a new instance of RoutingEdgeStyle.
   * @param outSegmentLength The length of the horizontal segment that connects to the source node.
   * @param inSegmentLength The length of the horizontal segment that connects to the target node.
   * @param stroke The edge stroke.
   */
  constructor(
    public outSegmentLength: number,
    public inSegmentLength: number,
    public stroke: Stroke = new Stroke(100, 100, 100, 255, 2)
  ) {
    super()
    this.sourceArrow = IArrow.NONE
    this.targetArrow = new Arrow({
      fill: stroke.fill,
      type: ArrowType.TRIANGLE
    })
  }

  /**
   * The distance on the y-axis between the source port and the horizontal middle segment.
   * This only has an effect when the source location is right of the target location.
   */
  middleSegmentOffset = 32

  /** The amount of corner rounding */
  smoothing = 10

  /** The source arrow. */
  sourceArrow: IArrow = IArrow.NONE

  /** The target arrow. */
  targetArrow: IArrow

  get renderer(): IEdgeStyleRenderer {
    return new RoutingEdgeStyleRenderer()
  }

  clone(): this {
    return new RoutingEdgeStyle(this.outSegmentLength, this.inSegmentLength, this.stroke) as this
  }
}

/**
 * Responsible for drawing the edge path using the given {@link RoutingEdgeStyle}.
 */
class RoutingEdgeStyleRenderer extends PathBasedEdgeStyleRenderer<RoutingEdgeStyle> {
  constructor() {
    super(RoutingEdgeStyle.$class as Class<RoutingEdgeStyle>)
  }

  /**
   * Creates the orthogonal edge-path.
   */
  createPath(): GeneralPath {
    // create a new GeneralPath with the edge points
    const generalPath = new GeneralPath()
    const points = this.getEdgePoints(this.edge)
    generalPath.moveTo(points[0])
    for (const item of points) {
      generalPath.lineTo(item)
    }
    return generalPath
  }

  /**
   * Calculates the points that define the edge path.
   * If the source and target are in the same row, it draws a straight-line,
   * i.e., only the source/target locations are needed.
   * Otherwise, we have to calculate some bend-points.
   */
  private getEdgePoints(edge: IEdge): Point[] {
    const sourcePoint = edge.sourcePort!.location
    const targetPoint = edge.targetPort!.location
    const points: Point[] = []
    points.push(sourcePoint)

    // the source location with the x-offset
    const sourceX = sourcePoint.x + this.style.outSegmentLength
    // the target location with the x-offset
    const targetX = targetPoint.x - this.style.inSegmentLength

    if (sourceX <= targetX) {
      // the source is left of target and not in the same row, add two bends
      if (sourcePoint.y !== targetPoint.y) {
        points.push(new Point(sourceX, sourcePoint.y))
        points.push(new Point(sourceX, targetPoint.y))
      }
    } else {
      // source is right of target
      // get the y-coordinate of the vertical middle segment
      const middleSegmentY =
        sourcePoint.y <= targetPoint.y
          ? sourcePoint.y + this.style.middleSegmentOffset
          : sourcePoint.y - this.style.middleSegmentOffset
      points.push(new Point(sourceX, sourcePoint.y))
      points.push(new Point(sourceX, middleSegmentY))
      points.push(new Point(targetX, middleSegmentY))
      points.push(new Point(targetX, targetPoint.y))
    }

    points.push(targetPoint)
    return points
  }

  /**
   * Returns the tangent on this path at the given ratio.
   */
  getTangent(ratio: number): Tangent | null {
    return this.getPath()!.getTangent(ratio)!
  }

  /**
   * Returns the tangent on this path instance at the segment and segment ratio.
   */
  getTangentForSegment(segmentIndex: number, ratio: number): Tangent | null {
    return this.getPath()!.getTangentForSegment(segmentIndex, ratio)!
  }

  /**
   * Returns the segment count which is the number of edge points -1.
   */
  getSegmentCount(): number {
    // the segment count is the number of edge points - 1
    const p = this.getEdgePoints(this.edge)
    return p.length - 1
  }

  /**
   * Returns the target arrow.
   */
  getTargetArrow(): IArrow {
    return this.style.targetArrow
  }

  /**
   * Returns the source arrow.
   */
  getSourceArrow(): IArrow {
    return this.style.sourceArrow
  }

  /**
   * Returns the pen used by style.
   */
  getStroke(): Stroke {
    return this.style.stroke
  }

  /**
   * Returns the smoothing length used by style.
   */
  getSmoothingLength(): number {
    return this.style.smoothing
  }

  /**
   * Returns an instance that implements the given type or null if no such instance is available.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lookup(type: Class): any {
    if (type === IHighlightIndicatorInstaller.$class) {
      const edgeStyle = new RoutingEdgeStyle(20, 20, new Stroke('goldenrod', 3))
      return new EdgeStyleDecorationInstaller({ edgeStyle })
    }
    return super.lookup.call(this, type)
  }
}
