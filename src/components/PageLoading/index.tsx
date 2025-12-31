import { useSelector } from '@aniyajs/plugin-tooltik';
import React from 'react';

export interface PageLoadingPropsType {

}

const PageLoading: React.FC<PageLoadingPropsType> = (props) => {
  const state = useSelector((state: RootState) => state.settings)

  return (
    <div className={`min-h-screen flex flex-col bg-${state?.navTheme === 'realDark' ? '#585656' : 'gradient-to-br'} from-primary-50 to-secondary-100`}>
      <div className="flex-1 flex items-center justify-center">
        <div className={`bg-${state?.navTheme} rounded-2xl shadow-sm p-8 transition-all duration-300 hover:shadow-md`}>
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary-500 border-opacity-50"></div>
              <div className="absolute top-0 left-0 animate-ping rounded-full h-12 w-12 border-4 border-primary-300 opacity-75"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageLoading;
