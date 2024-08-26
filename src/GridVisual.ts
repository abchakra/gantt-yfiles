// (c) Copyright 2023 - 2024 Advanced Micro Devices, Inc. All Rights reserved.

import {
  BaseClass,
  HtmlCanvasVisual,
  IRenderContext,
  IVisualCreator,
  Visual,
} from "yfiles"
import { ganttDayWidth } from "./gantt-utils"
/**
 * Manages and renders the background of the main component.
 */
export default class GridVisual extends BaseClass<
  HtmlCanvasVisual,
  IVisualCreator
>(HtmlCanvasVisual, IVisualCreator) {
  renderContext: IRenderContext | undefined
  renderingContext2D: CanvasRenderingContext2D | undefined
  textColor: string = "black"
  // private zoomFactor: number
  /**
   * Creates a new instance.
   * @param mapper The mapper to help with converting from coordinate to date.
   * @param dataModel The model data to create the grid for.
   */
  constructor() {
    super()
  }

  setTextColor(textColor: string): void {
    this.textColor = textColor
  }

  /**
   * Paints the grid visualization.
   * @param renderContext The render context of the {@link CanvasComponent}
   * @param renderingContext2D The HTML5 Canvas context to use for rendering.
   */
  paint(
    renderContext: IRenderContext,
    renderingContext2D: CanvasRenderingContext2D,
  ): void {
    this.renderContext = renderContext
    this.renderingContext2D = renderingContext2D
    this.paintTime()
  }

  /**
   * Paints the day separators.
   */
  public paintTime(): void {
    if (!this.renderContext || !this.renderingContext2D) {
      return
    }
    const { x, maxX } = this.renderContext.canvasComponent!.viewport
    if (x === maxX) {
      return
    }

    const component = this.renderContext.canvasComponent!
    const y1 = component.viewport.y
    const y2 = component.viewport.bottomLeft.y


    const tickGap = ganttDayWidth

    this.renderingContext2D.strokeStyle = this.textColor
    this.renderingContext2D.lineWidth = 0.2

    this.renderingContext2D.beginPath()
    for (let sx = x < 0 ? 0 : x; sx < maxX; sx += tickGap) {
      this.renderingContext2D.moveTo(sx, y1)
      this.renderingContext2D.lineTo(sx, y2)
    }
    this.renderingContext2D.stroke()
  }


  /**
   * Returns this instance.
   */
  createVisual(context: IRenderContext): Visual {
    return this
  }

  /**
   * Returns this instance.
   */
  updateVisual(context: IRenderContext, oldVisual: Visual): Visual {
    return oldVisual
  }
}
