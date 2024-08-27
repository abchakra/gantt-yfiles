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
import type { ChartData } from './data-model'

export const ganttChartData: ChartData = {
  originDate: '2023-03-21',
  tasks: [
    {
      id: 1,
      name: 'OFM'
    },
    {
      id: 2,
      name: 'CORE'
    },
    {
      id: 3,
      name: 'IFM'
    },
    {
      id: 4,
      name: 'ONNX'
    },

  ],
  activities: [
    {
      id: 111,
      name: 'select node',
      taskId: 1,
      startTime: 0,
      endTime: 200,
    },
    // {
    //   id: 110,
    //   name: 'Cannot select node',
    //   taskId: 1,
    //   startTime: 2223690,
    //   endTime: 2223790,
    // },
    // {
    //   id: 0,
    //   name: 'User Polls',
    //   taskId: 1,
    //   startTime: 2223796,
    //   endTime: 2333178,
    //   leadTime: 24
    // },
    // {
    //   id: 1,
    //   name: 'UI Spec',
    //   taskId: 2,
    //   startTime: 2206869,
    //   endTime: 2211655,
    //   dependencies: [0],
    //   followUpTime: 6
    // },
    // {
    //   id: 13,
    //   name: 'API Spec',
    //   taskId: 2,
    //   startTime: 2219169,
    //   endTime: 2223795
    // },
    // {
    //   id: 2,
    //   taskId: 3,
    //   startTime: 2255648,
    //   endTime: 2333178,
    //   dependencies: [1]
    // },
    // {
    //   id: 3,
    //   name: 'Personnel Assignment',
    //   taskId: 1,
    //   startTime: 2342006,
    //   endTime: 2380004,
    //   dependencies: [1]
    // },
    // {
    //   id: 4,
    //   name: 'UI Design',
    //   taskId: 2,
    //   startTime: 2337603,
    //   endTime: 2342005,
    //   leadTime: 24,
    //   dependencies: [3]
    // },
    // {
    //   id: 5,
    //   name: 'Implementation',
    //   taskId: 2,
    //   startTime: 2374888,
    //   endTime: 2380004,
    //   leadTime: 24,
    //   followUpTime: 24,
    //   dependencies: [2, 13]
    // },
    // {
    //   id: 6,
    //   name: 'Conv_65',
    //   taskId: 1,
    //   startTime: 2388477,
    //   endTime: 2442569,
    //   leadTime: 24,
    //   followUpTime: 24,
    //   dependencies: [2, 13]
    // },
    // {
    //   id: 7,
    //   name: 'WTS-0-Conv_65',
    //   taskId: 1,
    //   startTime: 2384149,
    //   endTime: 2388476,
    // },
    {
      id: 8,
      name: 'OFM-0-Conv_65-0',
      taskId: 3,
      startTime: 170864160,
      endTime: 170864960,
    }
    ,
    {
      id: 9,
      name: 'Conv_104',
      taskId: 2,
      startTime: 170865520,
      endTime: 170865320,
    },
  ]
}
