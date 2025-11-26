import { createMachine } from "xstate";

const ToolMachine = createMachine({
    id: 'tool',
    initial: 'idle',
    states: {
        idle: {
            on: {
                TOOL_SELECTED: 'selected'
            }
        },
        selected: {
            on: {
                TOOL_UNSELECTED: 'idle'
            }
        } },
    },
    {
    actions: {
        setTool: (context, event) => {
            
        }
    }
});

export default ToolMachine;