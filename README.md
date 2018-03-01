# Golden-layout in Angular5

这是一个使用Angular2+开发的DEMO,这个项目中引入:

- [Angular Meterial](https://material.angular.io/)
- [GoldenLayout](http://golden-layout.com/)



**目录**

1. [引入Golden-layout](#improt)
2. [BUG](#bug)
   1. ~~添加不了没注册的组件，只能添加已经注册过的组件~~




<a id="improt"></a>

### 引入 Golden-layout


index.html:

```javascript
<link type="text/css" rel="stylesheet" href="https://golden-layout.com/files/latest/css/goldenlayout-base.css" />
<link type="text/css" rel="stylesheet" href="https://golden-layout.com/files/latest/css/goldenlayout-light-theme.css" />

<script type="text/javascript" src="https://code.jquery.com/jquery-1.11.1.min.js"</script>
<script type="text/javascript" src="https://golden-layout.com/files/latest/js/goldenlayout.min.js"></script>
```



Modules.ts:

```javascript
import { MapboxComponent } from './mapbox/mapbox.component';
import { GroupComponent } from './group/group.component';
import { UsersComponent } from './users/users.component';

@NgModule({
  ...
  declarations: [
    GroupComponent,
    MapboxComponent,
    UsersComponent,
  ],
  entryComponents: [
    GroupComponent,
    MapboxComponent,
    UsersComponent
  ]
})
```



Home.component.ts:



```javascript
import { Component, OnInit, ViewContainerRef, OnDestroy, ElementRef, ComponentRef, ComponentFactoryResolver } from '@angular/core';
import { MapboxComponent } from './mapbox/mapbox.component';
import { GroupComponent } from './group/group.component';
import { UsersComponent } from './users/users.component';

declare var GoldenLayout: any;
declare var $: any;

export class HomeComponent implements OnInit {
  private config: any;
  private layout: any;
	
  constructor(
    private el: ElementRef,
    private viewContainer: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    this.config = {
      settings: {
        selectionEnabled: true
      },
      content: [{
        type: 'row',
        content: [{
          type: 'component',
          componentName: 'group',
          componentState: {
            message: 'Top Left',
            label: 'Group'
          }
        }, {
          type: 'column',
          content: [{
            type: 'component',
            componentName: 'mapbox',
            componentState: {
              message: 'Top Right',
              label: 'Map'
            }
          }, {
            type: 'component',
            componentName: 'mapbox',
            componentState: {
              message: 'Bottom Right',
              label: 'Map'
            }
          }]
        }]
      }]
    };
  }
  
  ngOnInit() {
    this.layout = new GoldenLayout(this.config, $(this.el.nativeElement).find("#layout"));

	// 注册到golden-layout
    this.layout.registerComponent('group', (container, componentState) => {
      let group = this.componentFactoryResolver.resolveComponentFactory(GroupComponent);
      let groupRef = this.viewContainer.createComponent(group);

      container.getElement().append($(groupRef.location.nativeElement));
    });

	// 注册到golden-layout
    this.layout.registerComponent('mapbox', (container, componentState) => {
      let mapbox = this.componentFactoryResolver.resolveComponentFactory(MapboxComponent);
      let mapboxRef = this.viewContainer.createComponent(mapbox);

      container.getElement().append($(mapboxRef.location.nativeElement));
    });

    this.layout.init();
  }
}
```

<a id="bug"></a>

### bug

1. ~~添加不了没注册的组件，只能添加已经注册过的组件~~

**解决:**

config 为空，生命周期钩子(ngOnInit)里面注册(registerComponent)即可

```javascript
this.config = {
  settings: {
    selectionEnabled: true
  },
  content: [{
    type: 'row',
    content: [{
      type: 'component',
      componentName: 'group',
      componentState: {
        message: 'Bottom Right',
        label: 'group'
      }
    }]
  }]
};
ngOnInit() {
  this.layout = new GoldenLayout(this.config, $(this.el.nativeElement).find("#layout"));

  this.layout.registerComponent('group', (container, componentState) => {
    let group = this.componentFactoryResolver.resolveComponentFactory(GroupComponent);
    let groupRef = this.viewContainer.createComponent(group);

    container.getElement().append($(groupRef.location.nativeElement));
  });

  this.layout.registerComponent('mapbox', (container, componentState) => {
    let mapbox = this.componentFactoryResolver.resolveComponentFactory(MapboxComponent);
    let mapboxRef = this.viewContainer.createComponent(mapbox);

    container.getElement().append($(mapboxRef.location.nativeElement));
  });

  this.layout.registerComponent('users', (container, componentState) => {
    let users = this.componentFactoryResolver.resolveComponentFactory(UsersComponent);
    let usersRef = this.viewContainer.createComponent(users);

    container.getElement().append($(usersRef.location.nativeElement));
  });

  this.layout.init();
}
addLayout(com): void {
  let newConfig = {
    type: 'component',
    componentName: com.name,
    componentState: {
      message: 'Bottom Right',
      label: com.name
    }
  };
  this.layout.root.contentItems[0].addChild(newConfig);
}
```



***这里首先把所有要的component注册一遍，在addLayout()里插入component视图.***