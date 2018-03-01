import { Component, OnInit, ViewContainerRef, OnDestroy, ElementRef, ComponentRef, ComponentFactoryResolver } from '@angular/core';
import { MapboxComponent } from './mapbox/mapbox.component';
import { GroupComponent } from './group/group.component';
import { UsersComponent } from './users/users.component';


declare var GoldenLayout: any;
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private config: any;
  private layout: any;

  private title = { text: 'Tokie Dispatch', cols: 4, rows: 1, color: 'lightblue' };
  private addMenuItem = [
    {
      name: 'mapbox',
      componentName: 'MapboxComponent'
    },
    {
      name: 'group',
      componentName: 'GroupComponent'
    }, {
      name: 'users',
      componentName: 'UsersComponent'
    }
  ];

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
    }
    // 不创建新的,而是直接插入.否则拖动面板的时候会重新绘制。导致多出窗口。
    // this.layout.createDragSource($(this.el.nativeElement).find("#layout"), newConfig);

    if (this.layout.getComponent(com.name)) {
      this.layout.registerComponent(com.name, (container, componentState) => {
        let users = this.componentFactoryResolver.resolveComponentFactory(UsersComponent);
        let usersRef = this.viewContainer.createComponent(users);

        container.getElement().append($(usersRef.location.nativeElement));
      });
    }
    this.layout.root.contentItems[0].addChild(newConfig);
  }
}
