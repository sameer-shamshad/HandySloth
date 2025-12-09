import { assign, fromPromise, setup } from "xstate";
import { updateTool as updateToolApi } from "../../services/tools.service";
import type { Tool, NewTool, ToolCategory, ToolTag, SocialLinks, ToolCard, UpdateToolInput } from "../../types";

const updateToolMachine = setup({
  types: {
    context: {} as {
      _id: string;
      name: string;
      logo: string;
      primaryCategory: ToolCategory;
      category: ToolCategory[];
      shortDescription: string;
      fullDetail: string;
      toolImages: string[];
      tags: ToolTag[];
      links: SocialLinks;
      error: string | null;
      toolResponse: ToolCard | null;
    },
    events: {} as
      | { type: 'CHANGE_FIELD'; field: keyof NewTool; value: NewTool[keyof NewTool] }
      | { type: 'SUBMIT' }
      | { type: 'RESET' }
      | { type: 'INIT'; tool: Tool },
  },
  actors: {
    updateTool: fromPromise(async ({ input }: { input: UpdateToolInput }) => {
      const response = await updateToolApi(input._id, input);
      return response;
    }),
  },
  actions: {
    changeField: assign(({ context, event }) => {
      if (event.type !== 'CHANGE_FIELD') return context;
      
      return { ...context, [event.field]: event.value };
    }),
    setError: assign(({ context, event }) => {
      const error = (event as unknown as { error: Error | unknown }).error;
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      
      return { ...context, error: errorMessage };
    }),
    clearError: assign(({ context }) => ({ ...context, error: null })),
    initializeTool: assign(({ context, event }) => {
      if (event.type !== 'INIT') return context;

      const tool = event.tool as Tool;
      return {
        ...context,
        _id: tool._id,
        name: tool.name,
        logo: tool.logo,
        category: tool.category || [],
        primaryCategory: (tool.primaryCategory || '') as ToolCategory,
        shortDescription: tool.shortDescription || '',
        fullDetail: tool.fullDetail || '',
        toolImages: tool.toolImages || [],
        tags: tool.tags || [],
        links: tool.links || {
          telegram: '',
          x: '',
          website: '',
        error: null,
        toolResponse: null,
        },
      };
    }),
    setValidationError: assign(({ context }) => {
      const name = context.name.trim();
      const logo = context.logo.trim();
      const category = context.category;
      const primaryCategory = context.primaryCategory;
      const shortDescription = context.shortDescription.trim();

      if (!name) {
        return { ...context, error: 'Tool name is required' };
      }

      if (!logo) {
        return { ...context, error: 'Tool logo URL is required' };
      }
      
      if (!primaryCategory || (primaryCategory as string) === '') {
        return { ...context, error: 'Primary category is required' };
      }
      
      if (!category || category.length === 0) {
        return { ...context, error: 'At least one category is required' };
      }

      if (!shortDescription) {
        return { ...context, error: 'Short description is required' };
      }

      return context;
    }),
    storeTool: assign(({ context, event }) => {
      const output = (event as unknown as { output: ToolCard }).output;
      return { ...context, toolResponse: output };
    }),
  },
  guards: {
    isValidForm: ({ context }) => {
      const name = context.name.trim();
      const logo = context.logo.trim();
      const category = context.category;
      const primaryCategory = context.primaryCategory;
      const shortDescription = context.shortDescription.trim();
      
      return name.length > 0 && logo.length > 0 && (primaryCategory as string) !== '' && category.length > 0 && shortDescription.length > 0;
    },
  },
}).createMachine({
  id: 'updateToolMachine',
  initial: 'idle',
  context: {
    _id: '',
    name: '',
    logo: '',
    category: [],
    primaryCategory: '' as ToolCategory,
    shortDescription: '',
    fullDetail: '',
    toolImages: [],
    tags: [],
    links: {
      telegram: '',
      x: '',
      website: '',
    },
    error: null,
    toolResponse: null,
  },
  states: {
    idle: {
      entry: 'clearError',
      on: {
        INIT: { actions: 'initializeTool' },
        CHANGE_FIELD: { actions: 'changeField' },
        SUBMIT: [
          {
            guard: 'isValidForm',
            target: 'submitting',
            actions: 'clearError',
          },
          {
            actions: 'setValidationError',
            target: 'idle',
          },
        ],
      },
    },
    submitting: {
      invoke: {
        src: 'updateTool',
        input: ({ context }: { context: UpdateToolInput }) => {
          return {
            _id: context._id,
            name: context.name,
            logo: context.logo,
            category: context.category,
            primaryCategory: context.primaryCategory,
            shortDescription: context.shortDescription,
            fullDetail: context.fullDetail,
            toolImages: context.toolImages,
            tags: context.tags,
            links: context.links,
          };
        },
        onDone: {
          target: 'success',
          actions: 'storeTool',
        },
        onError: {
          target: 'idle',
          actions: 'setError',
        },
      },
    },
    success: {
      after: {
        1000: { target: 'idle' },
      },
    },
  },
});

export default updateToolMachine;

