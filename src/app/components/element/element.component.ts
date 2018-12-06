import { AttributeComponent } from './../attribute/attribute.component';
import { ItemConfig } from '../../interfaces/interfaces';
import { Input, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';

export abstract class ElementComponent {
  @ViewChild('container', { read: ViewContainerRef }) container;
  @ViewChild('attributes', { read: ViewContainerRef }) attributes;
  @Input() id: any;
  componentRef: any;
  config: ItemConfig;
  children: ElementComponent[] = [];
  parent: ElementComponent;
  attchildren: any[] = [];
  hasChildren = false;

  parentID: string;
  mfactory: any;
  public siblings: ElementComponent[] = [];
  attributesRequired = false;
  in = '  ';
  isRoot = false;
  creator: any;
  public depth = 1;
  public siblingCounter = 0;
  public topLevel = false;
  public isCollapsed = true;
  public elementPath: string;
  public numRequiredAttributes = 0;
  public numOptionalAttributes = 0;

  constructor(public resolver: ComponentFactoryResolver) { }

  abstract getElementString(): string;
  abstract getSiblingString(): string;
  abstract setConfig(conf: ItemConfig, parentObject: any, topLevel: boolean): void;
  abstract remove(): void;
  abstract removeChild(childIDtoRemove: string): void;


  getAttributeString() {
    let attString = '';
    this.attchildren.forEach(function (att) {
       if (att.config.enabled || att.config.required) {
        attString = attString.concat(' ' + att.config.name + '="' + att.controlRef.instance.getValue() + '" ');
      }
    });
    return attString;
  }

  addAttributes(conf) {

    if (conf.hA) {
      this.sortAttributes('DESC');
      this.config.attributes.forEach((att) => {
        if (att.required) {
          this.isCollapsed = false;
          this.numRequiredAttributes++;
        } else {
          this.numOptionalAttributes++;
        }

        if (this.config.type === 'sequence') {
          att.sequenceAttribute = true;
        } else {
          att.sequenceAttribute = false;
        }

        const factory = this.resolver.resolveComponentFactory(AttributeComponent);
        const ref = this.attributes.createComponent(factory);
        ref.instance.setAttribute(att, this.elementPath + '@' + att.name);
        this.attchildren.push(ref.instance);
      });
    }
  }

  getChildString() {
    let e = '';
    if (this.children != null) {
      this.children.forEach(function (value) {
        e = e.concat(value.getElementString());
      });
    }
    return e;
  }

  sortAttributes(order: String): void {

    // Sort the order of the attributes so that the required ones are listed first
    this.config.attributes.sort((a, b) => {
      if ((a.required && b.required) || (!a.required && !b.required)) {
        return 0;
      }
      if ((a.required && !b.required)) {
        return 1;
      }

      if ((!a.required && b.required)) {
        return -1;
      }

    });

    if (order === 'DESC') {
      this.config.attributes.reverse();
    }
  }

  isOddDepth() {
    return this.depth % 2 === 1;
  }
  isEvenDepth() {
    return this.depth % 2 !== 1;
  }
  hasAttributes() {
    return this.config.hA;
  }
  hasRequiredAttributes() {
    return this.numRequiredAttributes > 0;
  }
  hasOptionalAttributes() {
    return this.numOptionalAttributes > 0;
  }
  getValueString() {
    return this.config.value;
  }
  getID() {
    return this.id;
  }
  setParentID(id) {
    this.parentID = id;
  }
 getContainer() {
    return this.container;
  }
  getSiblingContainer() {
    return this.container;
  }
  setParent(parent: ElementComponent) {
    this.parent = parent;
  }
}
