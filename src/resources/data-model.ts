import { INode } from "yfiles"

/**
 *  Type describing an activity in business data.
 *  The activity is associated with a task and must have start/end dates.
 */
export type Activity = {
  id?: number
  name?: string
  taskId: number
  startTime: number
  endTime: number
  dependencies?: number[]
  leadTime?: number
  followUpTime?: number
}

/**
 * Type describing a task in business data.
 */
export type Task = {
  id: number
  name: string
}

/**
 * Type describing the data of this Gantt chart containing of tasks and activities.
 */
export type ChartData = {
  originDate: string
  tasks: Task[]
  activities: Activity[]
}

/**
 * Type-safe getter for activity data stored in the node tag.
 */
export function getActivity(node: INode): Activity {
  return node.tag as Activity
}
