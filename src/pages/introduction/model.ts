export interface IntroductionState {
  data: {
    list: any[]
    pagination: any
  }
  detailInfo: any
}

export interface IntroductionModel {
  name: 'introduction'
  initialState: IntroductionState
  reducers: {
    save: (state: IntroductionState, _: { payload: any }) => void
  }
}

const introductionModel: IntroductionModel = {
  name: "introduction",
  initialState: {
    data: {
      list: [],
      pagination: {},
    },
    detailInfo: {},
  },
  reducers: {
    save: (state, { payload }) => {
      let _state = state
      _state = Object.assign(state, {
        ...payload,
      })
    },
  },
}

export default introductionModel
