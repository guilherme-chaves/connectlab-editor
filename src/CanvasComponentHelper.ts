import { error } from "console"

export const componentHelper = {
    newComponent(list: ComponentsListClass, type: ComponentType, name: String, position: Position, extraParams: {className?: String, connectedTo?: Array<Position>, content?: String}) {
        switch(type) {
            case ComponentType.LINE:
                if (extraParams.connectedTo == undefined) {
                    console.warn("No parameter named 'connectedTo' found in extraParams when its required to add a new component of type LINE, defaulting to empty array.")
                }
                let component : LineComponent = {
                    id: list.getLastComponentId() + 1,
                    type,
                    name,
                    position,
                    connectedTo: extraParams.connectedTo ?? []
                }
                return component
            case ComponentType.NODE:
                break;
            case ComponentType.TEXT:
                break;
            default:
                return null;
                
        }
        return null;
    }
}