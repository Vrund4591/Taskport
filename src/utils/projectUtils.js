/**
 * Utility functions for handling project IDs and lookups
 */

// Find a project by various ID formats
export const findProjectById = (projects, projectId) => {
  if (!projectId || !projects || projects.length === 0) {
    return projects[0]; // Return first project if no ID or no projects
  }

  // Try multiple formats for matching
  const idStr = String(projectId).toLowerCase().trim();
  
  // Direct ID match (proj1, proj2, etc.)
  let project = projects.find(p => p.id === projectId);
  
  // Try with 'proj' prefix if numeric
  if (!project && /^\d+$/.test(idStr)) {
    project = projects.find(p => p.id === `proj${idStr}`);
  }
  
  // Remove 'proj' prefix if present and try as numeric index
  if (!project && idStr.startsWith('proj')) {
    const numericPart = idStr.substring(4);
    if (/^\d+$/.test(numericPart)) {
      project = projects.find(p => p.id === `proj${numericPart}`);
    }
  }
  
  // Try matching by name or partial name
  if (!project) {
    project = projects.find(p => 
      p.name.toLowerCase() === idStr || 
      p.name.toLowerCase().includes(idStr)
    );
  }
  
  // Special case for "Marketing Campaign"
  if (!project && idStr.includes('marketing')) {
    project = projects.find(p => p.name.toLowerCase().includes('marketing'));
  }
  
  // Return found project or first project as fallback
  return project || projects[0];
};

// Normalize project ID to standard format (proj1, proj2, etc.)
export const normalizeProjectId = (projectId) => {
  if (!projectId) return null;
  
  const idStr = String(projectId).trim();
  
  // If already in format projX, return as is
  if (/^proj\d+$/.test(idStr)) {
    return idStr;
  }
  
  // If numeric, add proj prefix
  if (/^\d+$/.test(idStr)) {
    return `proj${idStr}`;
  }
  
  // Otherwise return as is (might be a name or other identifier)
  return idStr;
};
