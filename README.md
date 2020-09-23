# verdaccio-dugroup

verdaccio 的权限拓展插件，以用户组的形式来配置相关权限。

## 使用方式

```yarml

auth:
   dugroup:
      publish: user1 user2
      unpublish: user3 user4

packages:
   '@company/*':
       access: $all
       publish: publish
       unpublish: unpublish
```

以上的配置设置了两个用户组，一个用于publish，一个用于unpublish，用户组的名字见名知意即可，可配置多组，也可以和自带的htpasswd插件组合使用。


