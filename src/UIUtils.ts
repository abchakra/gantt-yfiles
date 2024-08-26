import { BoxesList } from "./resources/data-model"

/**
 * Displays or hides the loading indicator which is a div element with id 'loadingIndicator'.
 * @param visible Whether to show or hide the loading indicator.
 * @param message A text on the loading indicator.
 */
export async function showLoadingIndicator(
    visible: boolean,
    element: HTMLDivElement,
): Promise<void> {
    const loadingIndicator =
        element.querySelector<HTMLElement>("#loading-indicator")!
    loadingIndicator.style.display = visible ? "flex" : "none"
    return new Promise((resolve) => setTimeout(resolve, 0))
}

/**
 * Returns the width of the activity's 'main' part i.e., the 'solid' one without
 * considering lead/follow-up time.
 */
export function getMainActivityWidth(activity: BoxesList, node?: INode): number {
    if (node) {
        return node.layout.width
    }
    const activityStartX = getX(new GanttTimestamp(activity.startDate))
    const activityEndX = getX(new GanttTimestamp(activity.endDate))
    return activityEndX - activityStartX
}

/**
 * Returns the complete width of the activity including lead/follow-up time.
 */
export function getActivityWidth(activity: Activity): number {
    return getMainActivityWidth(activity) + getLeadWidth(activity) + getFollowUpWidth(activity)
}