export interface ValidationResult{
    status:boolean,
    message:string
}

export interface ItemConfig{
    name : string,
    annotation : string,
    value : any,
    required : boolean,
    enabled : boolean,
    typeAnnotation :string,
    choice: boolean,
    sequence: boolean,
    attributes : ItemConfig[],
    childelements : ItemConfig[],
    allOf : ItemConfig[],
    oneOf : ItemConfig[],
    choiceElementIdentifiers : string[],
    elementPath : string,
    model: string,
    modelType: any;
    restrictionAnnotation: string,
    modelDescription: string,
    restrictionPattern: string,
    minInclusive: number,
    maxInclusive: number,
    pattern:string,
    minOccurs : number,
    maxOccurs : number,
    restrictionEnumList: string[],
    type : string,
    hasChildren : boolean,
    hasAttributes : boolean,
    uuid : string
}