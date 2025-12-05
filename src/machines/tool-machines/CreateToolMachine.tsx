import { assign, fromPromise, setup } from "xstate";
import type { Tool, NewTool, ToolCategory, ToolTag } from "../../types";
import { createTool as createToolApi } from "../../services/tools.service";

const createToolMachine = setup({
  types: {
    context: {} as {
      name: string;
      logo: string;
      category: ToolCategory[];
      primaryCategory: ToolCategory | '';
      shortDescription: string;
      fullDetail: string;
      toolImages: string[];
      tags: ToolTag[];
      links: {
        telegram: string;
        x: string;
        website: string;
      };
      error: string | null;
      toolResponse: Tool | null;
    },
    events: {} as
      | { type: 'CHANGE_FIELD'; field: keyof NewTool; value: NewTool[keyof NewTool] }
      | { type: 'SUBMIT' }
      | { type: 'RESET' },
  },
  actors: {
    createTool: fromPromise(async ({ input }: { input: { name: string; logo: string; category: ToolCategory[]; primaryCategory: ToolCategory; shortDescription: string; fullDetail: string; toolImages: string[]; tags: ToolTag[]; links: { telegram: string; x: string; website: string } } }) => {
      const response = await createToolApi(input);
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
    clearForm: assign(({ context }) => ({
      ...context,
      name: '',
      logo: 'https://picsum.photos/200',
      category: [],
      primaryCategory: '' as ToolCategory | '',
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
    })),
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
      const output = (event as unknown as { output: Tool }).output;
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
  /** @xstate-layout N4IgpgJg5mDOIC5QGMBOYCGAXMAVA9vgDYCyGyAFgJYB2YAdFREWAMQDCAEgIIByA4gFEA+gDEAkoIAyAEQDaABgC6iUAAd8sKlir4aqkAA9EAdgCM9AJyWAbAoAcJkwFYFAZhtmXAGhABPRDNLC0tnNzM3e3tnACZ7GLcnAF8k3zRMHAJiMkpaBiYWVgBlAFUAIRJxXEUVJBANLR09A2MEOLcrExtnF3tQ2JjbXwCEcJN6DxMYhRsYwcT7MxsUtPRsPEJScmo6RmY2UoqquTNa9U1tXX061oAWEOtHp8f7G2HEUImXBQVLW5tbs5LK97CsQOl1lktrldrAAK4AIwAttodDQoKwIHp8jQAG74ADWDAhmU2OR2DHhyNRtCgCFo+OQ2CuNRqBgal2aN1MCXo7giPzMXnst0S71GCmc9EBko8Zn+ChcJjBJI22W2eXoVJRWDRGLAqFQ+FQ9DURGwADNjUj6KqoeTNdqaej6Xj8EymjRWcp2RdPS1EG4evQTH0ZrcFLdLDETJK3v5EHMOqHLIqzNMfk5LCq1qT1TDKXDkMg4LBWIZYFh1vQMBacKgABRmH4KACUrDtZI1sKLJdgsDZdQ5-u5CBcUpjblu9iDziFi3Fi3orhbHmitxjXRSqRANHwEDgBk7+YpvsaVwDCAAtDY+S37w-5eKbzmMmroRS9iwz5zrqBWgC9DxO4DiJGYfRuHE4rzMu4QxDY8T3JGUTOK+kJdgWWqIjqeo-iO-6ILE9jLoqIo-JBSyWG44puO4Vh9HY4FTKKERoXmH6Or2pZ4Reo59Lcy7RNYNgIeY5jODRMQhDMcTTAhYyoduQA */
  id: 'createToolMachine',
  initial: 'idle',
  context: {
    name: '',
    logo: '',
    category: [],
    primaryCategory: '' as ToolCategory | '',
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
        src: 'createTool',
        input: ({ context }) => {
          const primaryCategory = context.primaryCategory;
          if (!primaryCategory || (primaryCategory as string) === '') {
            throw new Error('Primary category is required');
          }
          return {
            name: context.name,
            logo: context.logo,
            category: context.category,
            primaryCategory: primaryCategory as ToolCategory,
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
        1000: { target: 'idle', actions: 'clearForm' },
      },
    },
  },
});

export default createToolMachine;

