import { createAsyncThunk, CreateSliceOptions } from '@aniyajs/plugin-tooltik';
import api from '@/services/user';

export interface UserState {
  currentUserData: Partial<UserTypes.UserInfoReturn>
  verificationCode: string;
  loading: boolean;
  verificationLoading: boolean;
  updateUserInfoLoading: boolean;
  updateAvatarLoading: boolean;
}

export const getUserInfoAsync = createAsyncThunk(
  'user/getUserInfo',
  api.getUserInfo
);

export const getCodeAsync = createAsyncThunk(
  'user/getCode',
  api.getCode
);

export const loginAsync = createAsyncThunk(
  'user/login',
  api.login
);

export const registerAsync = createAsyncThunk(
  'user/register',
  api.register
);

export const updateUserInfoAsync = createAsyncThunk(
  'user/updateUserInfo',
  api.updateUserInfo
);

export const updateAvatarAsync = createAsyncThunk(
  'user/updateAvatar',
  api.updateAvatar
);

// export const getCodeThunkHandle = createAsyncThunk(
//   'user/login',
//   async (_, { dispatch }) => {
//     const verificationCode = await dispatch(getCodeAsync()).unwrap();
//     const currentUserData = await dispatch(getUserInfoAsync()).unwrap();

//     return { currentUserData, verificationCode };
//   }
// );

const userModel: CreateSliceOptions<UserState> = {
  name: "user",
  initialState: {
    currentUserData: {
      userInfo: {},
      doms: [],
      menus: [],
    },
    verificationCode: '',
    loading: false,
    verificationLoading: false,
    updateUserInfoLoading: false,
    updateAvatarLoading: false,
  },
  reducers: {
     save: (state, { payload }) => {
      let _state = state || {};
      _state = Object.assign(_state, {
        ...payload,
      })
    },
  },
  extraReducers: (builder) => {
    builder
      // 获取用户信息
      .addCase(getUserInfoAsync.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getUserInfoAsync.fulfilled, (state, { payload }) => {
        state.loading = false

        state.currentUserData = payload ?? {}
      })
      .addCase(getUserInfoAsync.rejected, (state, action) => {
        state.loading = false
      })
      // 获取验证码
      .addCase(getCodeAsync.pending, (state, action) => {
        state.verificationLoading = true;
      })
      .addCase(getCodeAsync.fulfilled, (state, { payload }) => {
        state.verificationLoading = false
        state.verificationCode = (payload?.image as string) ?? ''
      })
      .addCase(getCodeAsync.rejected, (state, action) => {
        state.verificationLoading = false
      })
      // 登录
      .addCase(loginAsync.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(loginAsync.fulfilled, (state, { payload }) => {
        state.loading = false
        localStorage.setItem('token', (payload as { token: string })?.token)
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false
      })
      // 修改用户信息
      .addCase(updateUserInfoAsync.pending, (state, action) => {
        state.updateUserInfoLoading = true;
      })
      .addCase(updateUserInfoAsync.fulfilled, (state, { payload }) => {
        state.currentUserData.userInfo = payload ?? {}
        state.updateUserInfoLoading = false
      })
      .addCase(updateUserInfoAsync.rejected, (state, action) => {
        state.updateUserInfoLoading = false
      })
      // 修改用户头像
      .addCase(updateAvatarAsync.pending, (state, action) => {
        state.updateAvatarLoading = true;
      })
      .addCase(updateAvatarAsync.fulfilled, (state, { payload }) => {
        state.currentUserData.userInfo = payload ?? {}
        state.updateAvatarLoading = false
      })
      .addCase(updateAvatarAsync.rejected, (state, action) => {
        state.updateAvatarLoading = false
      })
  }
}

export default userModel;