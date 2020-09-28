const createError = require('http-errors');

class DynamicGroupPlugin {
  constructor(config, stuff) {
    this.pluginsConfig = config
  }

  checkPkgAction(pkg,action){
    return pkg[action]
  }

  authenticate(action) {
    // here your code
    return (user, pkg, cb)=>{
      // 获取当前用户以及原生权限组
      let { name:userName,groups:userGroups } = user
      // 获取当前是哪个权限并且把权限组取出 [$all,publisharr]
      let authArr = pkg[action]
      // 判断当前是否可以给权限
      let isTrue = authArr.some((authItem)=>{
        // 如果当前用户和其中字段相等就给权限
        if(authItem === userName){
          return true
        }
        // 是原生权限组的某一个
       else if(userGroups.includes(authItem)){
          return true
        }
        // 判断是否是插件配置中的项
        else{
          let key = authItem;
          let pluginsArr = this.pluginsConfig[`${key}`]
            return pluginsArr!=null && pluginsArr.some((item)=>{
              if(item === userName){
                return true
              }
            })
        }
      })

      // 判断isTrue
      if(isTrue){
        return cb(null, true);
      }

      if (userName) {
        cb(createError(403, `user ${userName} is not allowed to ${action} package ${pkg.name}`));
      } else {
        cb(createError(401, `authorization required to ${action} package ${pkg.name}`));
      }
    }
  }
  /**
   * check grants for such user.
   */
  allow_access(user, pkg, cb) {
    let action = 'access';
    if(this.checkPkgAction(pkg,action)){
      return cb(null, false)
    }
    // in case of restrict the access
    return this.authenticate(action)(user,pkg,cb)
  }
  /**
   * check grants to publish
   */
  allow_publish(user, pkg, cb) {
    let action = 'publish';
    if(this.checkPkgAction(pkg,action)){
      return cb(null, false)
    }
    // in cass to check if has permission to publish
    return this.authenticate(action)(user,pkg,cb)
  }

  allow_unpublish(user, pkg, cb){
    let action = 'unpublish';
    if(this.checkPkgAction(pkg,action)){
      return cb(null, false)
    }
    return this.authenticate(action)(user,pkg,cb)
  }

  
}

module.exports = (cfg, stuff) => new DynamicGroupPlugin(cfg, stuff);
