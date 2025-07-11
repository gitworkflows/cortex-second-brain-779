import yaml from 'js-yaml';
import { Workflow, ParsedWorkflow } from '@/types/workflow';

export function parseWorkflowYaml(yamlContent: string): Workflow {
  try {
    const parsed = yaml.load(yamlContent) as Workflow;
    
    // Validate required fields
    if (!parsed.name) {
      throw new Error('Workflow name is required');
    }
    if (!parsed.command) {
      throw new Error('Workflow command is required');
    }

    // Validate shells if provided
    if (parsed.shells) {
      const validShells = ['zsh', 'bash', 'fish'];
      const invalidShells = parsed.shells.filter(shell => !validShells.includes(shell));
      if (invalidShells.length > 0) {
        throw new Error(`Invalid shells: ${invalidShells.join(', ')}. Valid shells are: ${validShells.join(', ')}`);
      }
    }

    return parsed;
  } catch (error) {
    if (error instanceof yaml.YAMLException) {
      throw new Error(`Invalid YAML: ${error.message}`);
    }
    throw error;
  }
}

export function workflowToYaml(workflow: Workflow): string {
  const cleanWorkflow = { ...workflow };
  
  // Remove undefined/empty fields for cleaner YAML
  Object.keys(cleanWorkflow).forEach(key => {
    const value = cleanWorkflow[key as keyof Workflow];
    if (value === undefined || value === null || (Array.isArray(value) && value.length === 0)) {
      delete cleanWorkflow[key as keyof Workflow];
    }
  });

  return yaml.dump(cleanWorkflow, {
    indent: 2,
    lineWidth: -1,
    noRefs: true,
    sortKeys: false
  });
}

export function extractArguments(command: string): string[] {
  const argumentRegex = /\{\{([^}]+)\}\}/g;
  const matches = [];
  let match;
  
  while ((match = argumentRegex.exec(command)) !== null) {
    matches.push(match[1]);
  }
  
  return [...new Set(matches)]; // Remove duplicates
}

export function replaceArguments(command: string, argumentValues: Record<string, string>): string {
  let result = command;
  
  Object.entries(argumentValues).forEach(([name, value]) => {
    const regex = new RegExp(`\\{\\{${name}\\}\\}`, 'g');
    result = result.replace(regex, value);
  });
  
  return result;
}

export function validateWorkflow(workflow: Workflow): string[] {
  const errors: string[] = [];
  
  if (!workflow.name?.trim()) {
    errors.push('Name is required');
  }
  
  if (!workflow.command?.trim()) {
    errors.push('Command is required');
  }
  
  if (workflow.shells) {
    const validShells = ['zsh', 'bash', 'fish'];
    const invalidShells = workflow.shells.filter(shell => !validShells.includes(shell));
    if (invalidShells.length > 0) {
      errors.push(`Invalid shells: ${invalidShells.join(', ')}`);
    }
  }
  
  // Validate that all arguments in command are defined in arguments array
  if (workflow.command) {
    const commandArgs = extractArguments(workflow.command);
    const definedArgs = workflow.arguments?.map(arg => arg.name) || [];
    const undefinedArgs = commandArgs.filter(arg => !definedArgs.includes(arg));
    
    if (undefinedArgs.length > 0) {
      errors.push(`Undefined arguments in command: ${undefinedArgs.join(', ')}`);
    }
  }
  
  return errors;
}

// Mock data for development
export const mockWorkflows: ParsedWorkflow[] = [
  {
    id: '1',
    name: 'Git Status and Push',
    command: 'git status && git add {{files}} && git commit -m "{{message}}" && git push',
    description: 'Check git status, stage files, commit with message, and push to remote',
    tags: ['git', 'version-control'],
    shells: ['bash', 'zsh'],
    arguments: [
      { 
        name: 'files', 
        description: 'Files to stage (use . for all files)', 
        default_value: '.' 
      },
      { 
        name: 'message', 
        description: 'Commit message' 
      }
    ],
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'Docker Container Cleanup',
    command: 'docker stop {{container}} && docker rm {{container}} && docker rmi {{image}}',
    description: 'Stop, remove container, and remove image',
    tags: ['docker', 'cleanup'],
    shells: ['bash', 'zsh', 'fish'],
    arguments: [
      { 
        name: 'container', 
        description: 'Container name or ID' 
      },
      { 
        name: 'image', 
        description: 'Image name or ID' 
      }
    ],
    created_at: new Date('2024-01-02'),
    updated_at: new Date('2024-01-02')
  },
  {
    id: '3',
    name: 'Create React Component',
    command: 'mkdir -p src/components/{{component_name}} && echo "import React from \'react\';\n\nconst {{component_name}} = () => {\n  return (\n    <div>\n      <h1>{{component_name}}</h1>\n    </div>\n  );\n};\n\nexport default {{component_name}};" > src/components/{{component_name}}/{{component_name}}.tsx',
    description: 'Create a new React component with TypeScript',
    tags: ['react', 'typescript', 'component'],
    shells: ['bash', 'zsh'],
    arguments: [
      { 
        name: 'component_name', 
        description: 'Name of the React component' 
      }
    ],
    created_at: new Date('2024-01-03'),
    updated_at: new Date('2024-01-03')
  }
];