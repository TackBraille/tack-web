
import { SummaryOutput } from '@/types';

export const exportChatAsText = (
  chatTitle: string,
  history: SummaryOutput[]
): void => {
  if (history.length === 0) return;

  let content = `# ${chatTitle}\n\n`;
  
  history.forEach((item, index) => {
    content += `## Message ${index + 1}\n`;
    
    if (item.originalQuery) {
      content += `Query: ${item.originalQuery}\n\n`;
    }
    
    content += `${item.summary}\n\n`;
    
    if (item.sources && item.sources.length > 0) {
      content += `Sources:\n`;
      item.sources.forEach(source => {
        content += `- ${source.title}: ${source.briefSummary}\n`;
        if (source.url) {
          content += `  URL: ${source.url}\n`;
        }
      });
      content += '\n';
    }
    
    content += '---\n\n';
  });

  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  
  a.href = url;
  a.download = `${chatTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
