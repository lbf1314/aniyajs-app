
/**
 * 防抖函数
 *
 * @export
 * @param {()=>any} fn
 * @param {number} [wait]
 */
export function debounce(fn:(...args: any)=>any ,wait?:number) {
  let timer:any = null 

  return () => {
    if (timer !== null) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      fn()
    }, wait);
  }
}

/**
 * 获取容器
 *
 * @param {{className: string, element?: keyof HTMLElementTagNameMap}} {className, element="div"}
 * @return {Element} 
 */
export const getContainer = ({className, element="div"}: {className: string, element?: keyof HTMLElementTagNameMap}):Element => {
  const _container = document.createElement(element);
  _container.className = className;
  document.body.appendChild(_container);

  // @ts-ignore
  const doms = [...document.querySelectorAll(`.${className}`)]

  doms.forEach((i: Element, index:any) => {
    i.id = `${className}_${index}`
  })

  return _container
}


/**
 * 重组一维为多维
 * 对应 flatArr 函数使用，当然后面可以优化
 *
 * @param {Array} initArr 初始一维数组
 * @returns
 */
export function convertData({ initArr }: { initArr: Array<any> }) {
  if (!initArr?.length) {
    return [];
  }
  // 先获取最低层级数
  const sortedArr = initArr.sort((a, b) => b.level - a.level)
  const minLevel = sortedArr?.[0]?.level
  const maxLevel = sortedArr?.[sortedArr.length - 1]?.level;

  // 如果只有一层，则直接返回该层数据，不再进行进一步处理
  if (minLevel === maxLevel) {
    return initArr.map(item => ({
      ...item,
      routes: []
    }));
  }

  const minLevelData = initArr.filter(i => i.level === minLevel)
  let newInitArr = [...initArr].filter(i => i.level !== minLevel)

  if (minLevelData.length) {
    for (let i = 0; i < minLevelData.length; i++) {
      const ele = minLevelData[i];
      const lastIndex = ele.parentId.lastIndexOf("_");
      const parentId = ele.parentId.substring(0, lastIndex);
      const findIndex = newInitArr.findIndex(i => i.parentId === parentId);

      if (findIndex > -1) {
        newInitArr[findIndex].routes = [...newInitArr[findIndex]?.routes, {
          ...ele, 
          flag: true,
        }].filter(i => i.flag);
      }
    }
  }

  if ((minLevel - maxLevel) <= 1) {
    return newInitArr;
  } else {
    return convertData({ initArr: newInitArr });
  }
}

/**
 * 将具有嵌套结构的数组展平为一维数组。
 * @param {Array} initArr 初始数组，需要被展平的数组
 * @param {string} childrenField 子元素字段名，标识数组元素中的子元素属性
 * @returns {Array} 返回展平后的一维数组
 */
export function flatArr({
  initArr,
  childrenField,
  newArr = [],
  parentId = "",
  level = 1,
}: {
  initArr: Array<any>;
  childrenField: string;
  newArr?: Array<any>;
  parentId?: string;
  level?: number;
}) {
  // 遍历初始数组中的每个元素
  for (let i = 0; i < initArr.length; i++) {
    const newParentId = (parentId === '') ? String(i) : (parentId + "_" + String(i))
    const ele = initArr[i];
    // 如果当前元素包含子元素且子元素数组不为空
    if (ele[childrenField] && ele[childrenField].length) {
      // 递归调用flatArr函数处理子元素数组
      flatArr({
        initArr: ele[childrenField],
        newArr,
        childrenField,
        parentId: newParentId,
        level: level + 1,
      });
    }

    // 将当前元素及其附加信息（父ID和层级）添加到展平后的数组
    newArr.push({
      ...ele,
      parentId: newParentId,
      level,
      [childrenField]: ele[childrenField],
    });
  }

  return newArr;
}


/**
 * 重新定义多维数组结构
 * @date 2022-11-19
 * @param {any} initArr  初始多维数组
 * @param {any} initChildrenFieldName 初始多维数组子节点字段名
 * @param {any} resChildrenFieldName 结果多维数组子节点字段名
 * @param {any} rotorObj 重定义结构返回函数
 * @returns {any[]}
 */
export const multiArrayFormatter = <T = any, Y = any>({
  initArr,
  initChildrenFieldName,
  resChildrenFieldName,
  rotorObj,
}: {
  initArr: T[] | [];
  initChildrenFieldName: keyof T;
  resChildrenFieldName: keyof Y;
  rotorObj: (item: T) => Y;
}) => {
  return initArr?.map((item: T) => {
    const result = { ...rotorObj(item) };

    if (item?.[initChildrenFieldName]) {
      const child = multiArrayFormatter({
        // @ts-ignore
        initArr: item?.[initChildrenFieldName],
        initChildrenFieldName,
        resChildrenFieldName,
        rotorObj,
      });

      // @ts-ignore
      result[resChildrenFieldName] = child;
    }

    return result;
  });
};

/**
 * 将下划线分隔的字符串转换为逐级路径数组（不包含完整路径）
 * @param {string} str - 输入字符串，如 "1_2_3_4_5"
 * @returns {string[]} 逐级路径数组，如 ["1", "1_2", "1_2_3", "1_2_3_4"]
 */
export function generateHierarchyPaths(str: string) {
  if (!str || typeof str !== 'string') {
    return [];
  }

  const parts = str.split('_');
  const paths = [];

  // 只取到倒数第二个部分（即排除完整路径）
  for (let i = 1; i < parts.length; i++) {
    paths.push(parts.slice(0, i).join('_'));
  }

  return paths;
}


/**
 * 处理多维数组，返回符合匹配规则的元素，以及逐级向下的所有元素，并返回为一个一维数组
 * @date 2022-10-05
 * @param {any} initArr  初始多维数组
 * @param {any} newArr=[]  每次递归结束数组
 * @param {any} matchField  匹配字段
 * @param {any} matchReg  匹配规则
 * @param {any} childrenField  子集集合字段
 *
 *
 * @returns {any}
 */
export function floorFlatArr<T>({
  initArr,
  newArr = [],
  matchField,
  matchReg,
  childrenField,
}: {
  initArr: T[];
  newArr?: T[];
  matchField: keyof T;
  matchReg: string;
  childrenField: keyof T;
}): T[] {
  for (let i = 0; i < initArr.length; i++) {
    const ele: any = initArr[i];

    if (ele[childrenField] && ele[childrenField]?.length && !newArr.length) {
      floorFlatArr({
        newArr,
        initArr: ele[childrenField],
        matchField,
        matchReg,
        childrenField,
      });
    }

    if (matchReg === ele[matchField]) {
      newArr.push(ele);
    }
  }

  return flatArr({
    initArr: newArr,
    // @ts-ignore
    childrenField,
  });
}

/**
 * 多维数组重新赋值父级ID字段，并新增排序字段，转一维数组
 * @date 2022-12-01
 * @param {any} initArr 初始多维数组
 * @param {any} parentId 一级父级ID字段值
 * @param {any} newArr 递归结束数组
 * @param {any} childrenFieldName 子节点字段名
 * @param {any} cField 当前ID字段名
 * @param {any} pField 匹配父级ID字段名
 * @param {any} orderField 排序字段名
 * @returns {any}
 */
export const deassignFlatArr = <T = any>({
  initArr,
  parentId,
  newArr = [],
  childrenFieldName,
  cField,
  pField,
  orderField,
}: {
  initArr: T[] | [];
  parentId: any;
  newArr?: any;
  childrenFieldName: keyof T;
  cField: keyof T;
  pField: keyof T;
  orderField: keyof T;
}) => {
  for (let i = 0; i < initArr.length; i++) {
    const ele = initArr[i];

    if ((ele?.[childrenFieldName] as any)?.length > 0) {
      deassignFlatArr({
        initArr: ele?.[childrenFieldName] as T[] | [],
        parentId: ele?.[cField],
        newArr,
        childrenFieldName,
        cField,
        pField,
        orderField,
      });
    }
    newArr.push({
      ...ele,
      [pField]: parentId,
      [orderField]: i - 0 + 1,
    });
  }

  return newArr;
};

/**
 * 获取base64
 * 
 * @param {any} file 
 * @returns 
 */
export const getBase64 = (file: any): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });


/**
 * 数组相等
 * @param a 
 * @param b 
 * @returns 
 */
export const arraysEqualAsSet = (a: any[], b: any[]): boolean => {
  const setA = new Set(a);
  const setB = new Set(b);
  if (setA.size !== setB.size) return false;
  for (const item of setA) {
    if (!setB.has(item)) return false;
  }
  return true;
}