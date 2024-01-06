const Action = {
  POP: 'POP',
  PUSH: 'PUSH',
  REPLACE: 'REPLACE'
};

let action = Action.POP;

/**
 * 创建浏览器路由
 */
export function createBrowserHistory() {
  function getBrowserLocation(window, globalHistory) {
    let { pathname } = window.location;
    const state = globalHistory.state;
    return { pathname, state: state.usr };
  }

  function createHref(to) {
    return to;
  }

  return getUrlBasedHistory(getBrowserLocation, createHref);
}

/**
 * 创建 hash 路由
 */
export function createHashHistory() {
  function getHashLocation(window, globalHistory) {
    // TODO: hash 不存在时
    let pathname = window.location.hash.substr(1);
    const state = globalHistory.state;
    return {
      pathname,
      state: state.usr
    };
  }

  function createHref(to) {
    const href = window.location.href;
    let hashIndex = href.indexOf('#');
    return hashIndex === -1 ? '#' + to : href.slice(0, hashIndex) + '#' + to;
  }

  return getUrlBasedHistory(getHashLocation, createHref);
}

function getUrlBasedHistory(getLocation, createHref) {
  let globalHistory = window.history;
  let listener;
  let index = getIndex();
  if (index === null) {
    // 首次打开页面肯定是不存在 globalHistory.state
    index = 0;
    // 首次打开，直接替换当前 URL，增加索引
    globalHistory.replaceState(
      {
        usr: globalHistory.state, // 用户 state
        idx: index // router 记录的索引
      },
      ''
    );
  }

  /**
   * 获取当前页面索引
   * 索引用于记录当前页面堆栈
   */
  function getIndex() {
    let state = globalHistory.state || { idx: null };
    return state.idx;
  }

  function push(to, state) {
    action = Action.PUSH;
    const url = createHref(to); // 创建新的路径 这里有差异化的
    index = getIndex() + 1;
    globalHistory.pushState(
      {
        // 调用 pushApi 时会增加一次新的索引
        idx: index,
        // 用户的 state
        usr: state
      },
      null,
      url
    );
    if (listener) {
      listener({
        location: history.location,
        action
      });
    }
  }

  function handlePop() {
    action = Action.POP;
    // 获取切换后页面的索引
    const nextIndex = getIndex();
    index = nextIndex; // 更新索引
    if (listener) {
      // 调用 listener 更新页面
      listener({
        location: history.location,
        action
      });
    }
  }

  let history = {
    get action() {
      return action;
    },
    get location() {
      return getLocation(window, globalHistory);
    },
    // history.push 会发生路径跳转
    push,
    listen(fn) {
      window.addEventListener('popstate', handlePop);
      listener = fn;
      return () => {
        window.removeEventListener('popstate', handlePop);
        listener = null;
      };
    },
    go(n) {
      globalHistory.go(n);
    }
  };
  window.his = history;

  return history;
}
