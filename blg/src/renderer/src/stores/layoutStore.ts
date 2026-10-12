import { create } from 'zustand';
import { LayoutMetadata, TableSchema, GenerateOptions, GenerateOutput } from '../../shared/types';

interface LayoutState {
  layouts: any[];
  selectedLayout: any | null;
  metadata: LayoutMetadata | null;
  schemas: TableSchema[];
  options: GenerateOptions;
  outputs: GenerateOutput | null;
  isGenerating: boolean;
  isConnected: boolean;
  connectionConfig: any;
  searchQuery: string;
  filterType: string;

  setLayouts: (layouts: any[]) => void;
  selectLayout: (layout: any) => void;
  setMetadata: (metadata: LayoutMetadata) => void;
  setSchemas: (schemas: TableSchema[]) => void;
  setOptions: (options: Partial<GenerateOptions>) => void;
  setOutputs: (outputs: GenerateOutput) => void;
  setIsGenerating: (v: boolean) => void;
  setIsConnected: (v: boolean) => void;
  setConnectionConfig: (config: any) => void;
  setSearchQuery: (q: string) => void;
  setFilterType: (t: string) => void;
  reset: () => void;
}

const defaultOptions: GenerateOptions = {
  includeAuditColumns: true,
  includeSeedData: false,
  includeViews: false,
  includeTriggers: false,
  includeIndexes: true,
  schemaName: 'dbo',
  language: 'Vietnamese',
};

export const useLayoutStore = create<LayoutState>((set) => ({
  layouts: [],
  selectedLayout: null,
  metadata: null,
  schemas: [],
  options: defaultOptions,
  outputs: null,
  isGenerating: false,
  isConnected: false,
  connectionConfig: null,
  searchQuery: '',
  filterType: '',

  setLayouts: (layouts) => set({ layouts }),
  selectLayout: (layout) => set({ selectedLayout: layout }),
  setMetadata: (metadata) => set({ metadata }),
  setSchemas: (schemas) => set({ schemas }),
  setOptions: (options) => set((state) => ({ options: { ...state.options, ...options } })),
  setOutputs: (outputs) => set({ outputs }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setIsConnected: (isConnected) => set({ isConnected }),
  setConnectionConfig: (connectionConfig) => set({ connectionConfig }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setFilterType: (filterType) => set({ filterType }),
  reset: () => set({
    layouts: [], selectedLayout: null, metadata: null, schemas: [],
    outputs: null, isGenerating: false
  }),
}));
