export interface ValidationResult {
    status: boolean;
    message: string;
}

export interface ItemConfig {
    isRoot: boolean;
    name: string;
    annotation: string;
    value: any;
    required: boolean;
    enabled: boolean;
    typeAnnotation: string;
    choice: boolean;
    sequence: boolean;
    attributes: ItemConfig[];
    childelements: ItemConfig[];
    allOf: ItemConfig[];
    oneOf: ItemConfig[];
    choiceElementIdentifiers: string[];
    elementPath: string;
    model: string;
    modelType: any;
    restrictionAnnotation: string;
    modelDescription: string;
    restrictionPattern: string;
    minInclusive: number;
    maxInclusive: number;
    minExclusive: number;
    maxExclusive: number;
    pattern: string;
    minOccurs: number;
    maxOccurs: number;
    restrictionEnumList: string[];
    type: string;
    hC: boolean;  // hasChildren
    hA: boolean;  // hasAttributes
    uuid: string;
    minLength: number;
    maxLength: number;
    description: string;
    enumList: string[];
    first: boolean;
    last: boolean;
    sequenceAttribute: boolean;
    union: any[];
    annon: boolean;
    nillable: boolean;
    choiceHead: boolean;
}
