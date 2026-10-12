const fs = require('fs/promises');
const path = require('path');
const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema
} = require('@modelcontextprotocol/sdk/types.js');

const knowledgeRoot = path.resolve(process.env.KNOWLEDGE_DIR || path.join(process.cwd(), 'knowledge'));

function resolveKnowledgePath(relativePath = '') {
  const target = path.resolve(knowledgeRoot, relativePath);
  if (target !== knowledgeRoot && !target.startsWith(`${knowledgeRoot}${path.sep}`)) {
    throw new Error('Path is outside knowledge directory');
  }
  return target;
}

async function walkFiles(dir, base = '') {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const rel = path.join(base, entry.name);
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walkFiles(full, rel));
    } else {
      files.push(rel.replace(/\\/g, '/'));
    }
  }

  return files;
}

async function listKnowledgeFiles() {
  try {
    return await walkFiles(knowledgeRoot);
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

const server = new Server(
  {
    name: 'mcp-bravo-knowledge',
    version: '1.0.0'
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'list_knowledge_files',
      description: 'List files available in the local Bravo knowledge folder.',
      inputSchema: {
        type: 'object',
        properties: {}
      }
    },
    {
      name: 'read_knowledge_file',
      description: 'Read a text, JSON, SQL, XML, or Markdown file from the local Bravo knowledge folder.',
      inputSchema: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'Path relative to the knowledge folder.'
          }
        },
        required: ['path']
      }
    },
    {
      name: 'search_knowledge_files',
      description: 'Search file names in the local Bravo knowledge folder.',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Case-insensitive text to match against relative file paths.'
          }
        },
        required: ['query']
      }
    }
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;

  if (name === 'list_knowledge_files') {
    const files = await listKnowledgeFiles();
    return {
      content: [{ type: 'text', text: JSON.stringify(files, null, 2) }]
    };
  }

  if (name === 'search_knowledge_files') {
    const query = String(args.query || '').toLowerCase();
    const files = await listKnowledgeFiles();
    const matches = files.filter((file) => file.toLowerCase().includes(query));
    return {
      content: [{ type: 'text', text: JSON.stringify(matches, null, 2) }]
    };
  }

  if (name === 'read_knowledge_file') {
    const filePath = resolveKnowledgePath(args.path);
    const text = await fs.readFile(filePath, 'utf8');
    return {
      content: [{ type: 'text', text }]
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});

async function main() {
  await fs.mkdir(knowledgeRoot, { recursive: true });
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
