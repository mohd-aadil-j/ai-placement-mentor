// Convert LaTeX mathematical notation to readable text
const convertLatexToReadable = (latex) => {
  let readable = latex;
  
  // Fractions: \frac{a}{b} -> (a)/(b)
  readable = readable.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)');
  
  // Superscripts: ^{x} or ^x -> ^(x)
  readable = readable.replace(/\^\{([^}]+)\}/g, '^($1)');
  readable = readable.replace(/\^(\w)/g, '^$1');
  
  // Subscripts: _{x} or _x -> ₓ (using unicode subscripts where possible)
  readable = readable.replace(/\_\{([^}]+)\}/g, '_($1)');
  readable = readable.replace(/\_(\w)/g, '_$1');
  
  // Square roots: \sqrt{x} -> √(x)
  readable = readable.replace(/\\sqrt\{([^}]+)\}/g, '√($1)');
  readable = readable.replace(/\\sqrt\[(\d+)\]\{([^}]+)\}/g, '$1√($2)');
  
  // Greek letters
  readable = readable.replace(/\\alpha/g, 'α');
  readable = readable.replace(/\\beta/g, 'β');
  readable = readable.replace(/\\gamma/g, 'γ');
  readable = readable.replace(/\\delta/g, 'δ');
  readable = readable.replace(/\\theta/g, 'θ');
  readable = readable.replace(/\\pi/g, 'π');
  readable = readable.replace(/\\sigma/g, 'σ');
  readable = readable.replace(/\\lambda/g, 'λ');
  
  // Mathematical symbols
  readable = readable.replace(/\\times/g, '×');
  readable = readable.replace(/\\div/g, '÷');
  readable = readable.replace(/\\pm/g, '±');
  readable = readable.replace(/\\leq/g, '≤');
  readable = readable.replace(/\\geq/g, '≥');
  readable = readable.replace(/\\neq/g, '≠');
  readable = readable.replace(/\\approx/g, '≈');
  readable = readable.replace(/\\infty/g, '∞');
  readable = readable.replace(/\\sum/g, 'Σ');
  readable = readable.replace(/\\prod/g, 'Π');
  readable = readable.replace(/\\int/g, '∫');
  
  // Arrows
  readable = readable.replace(/\\rightarrow/g, '→');
  readable = readable.replace(/\\Rightarrow/g, '⇒');
  readable = readable.replace(/\\leftarrow/g, '←');
  readable = readable.replace(/\\Leftarrow/g, '⇐');
  
  // Spacing commands
  readable = readable.replace(/\\quad/g, '  ');
  readable = readable.replace(/\\qquad/g, '    ');
  readable = readable.replace(/\\,/g, ' ');
  readable = readable.replace(/\\ /g, ' ');
  
  // Text in math mode: \text{...}
  readable = readable.replace(/\\text\{([^}]+)\}/g, '$1');
  
  // Parentheses (sometimes LaTeX uses \left and \right)
  readable = readable.replace(/\\left/g, '');
  readable = readable.replace(/\\right/g, '');
  
  // Brackets
  readable = readable.replace(/\\{/g, '{');
  readable = readable.replace(/\\}/g, '}');
  
  // Remove any remaining backslashes from unknown commands
  readable = readable.replace(/\\([a-zA-Z]+)/g, '$1');
  
  // Clean up multiple spaces
  readable = readable.replace(/\s+/g, ' ').trim();
  
  return readable;
};

// Format AI responses with proper structure and emojis
export const formatMessage = (content) => {
  if (!content) return '';

  // Try to parse if it's JSON-like content
  try {
    // Remove markdown code blocks if present
    let cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    // Try to parse as JSON
    const jsonData = JSON.parse(cleanContent);
    
    // Format JSON object into readable text
    return formatJsonToText(jsonData);
  } catch (e) {
    // Not JSON, proceed with regular formatting
  }

  // Add emojis based on keywords
  let formatted = content;

  // Protect and convert LaTeX math expressions (both inline $ and block $$)
  const mathExpressions = [];
  
  // Handle block math with \[ \]
  formatted = formatted.replace(/\\\[[\s\S]*?\\\]/g, (match) => {
    const cleanMath = match.replace(/\\\[|\\\]/g, '').trim();
    const readable = convertLatexToReadable(cleanMath);
    mathExpressions.push({ content: readable, isBlock: true });
    return `__MATH_${mathExpressions.length - 1}__`;
  });
  
  // Handle block math with $$
  formatted = formatted.replace(/\$\$[\s\S]*?\$\$/g, (match) => {
    const cleanMath = match.replace(/\$\$/g, '').trim();
    const readable = convertLatexToReadable(cleanMath);
    mathExpressions.push({ content: readable, isBlock: true });
    return `__MATH_${mathExpressions.length - 1}__`;
  });
  
  // Handle inline math with \( \)
  formatted = formatted.replace(/\\\([\s\S]*?\\\)/g, (match) => {
    const cleanMath = match.replace(/\\\(|\\\)/g, '').trim();
    const readable = convertLatexToReadable(cleanMath);
    mathExpressions.push({ content: readable, isBlock: false });
    return `__MATH_${mathExpressions.length - 1}__`;
  });
  
  // Handle inline math with $
  formatted = formatted.replace(/\$[^\$\n]+?\$/g, (match) => {
    const cleanMath = match.replace(/\$/g, '').trim();
    const readable = convertLatexToReadable(cleanMath);
    mathExpressions.push({ content: readable, isBlock: false });
    return `__MATH_${mathExpressions.length - 1}__`;
  });

  // Protect inline code
  const codeBlocks = [];
  formatted = formatted.replace(/`([^`]+)`/g, (match, code) => {
    codeBlocks.push(`<code class="px-1.5 py-0.5 bg-gray-200 rounded text-sm font-mono">${code}</code>`);
    return `__CODE_${codeBlocks.length - 1}__`;
  });

  // Headers and sections with emojis
  formatted = formatted.replace(/^###\s*(.+)$/gm, (match, text) => {
    const emoji = getHeaderEmoji(text);
    return `\n<div class="mt-4 mb-2"><strong class="text-lg text-blue-700">${emoji} ${text}</strong></div>`;
  });
  formatted = formatted.replace(/^##\s*(.+)$/gm, (match, text) => {
    const emoji = getHeaderEmoji(text);
    return `\n<div class="mt-5 mb-3"><strong class="text-xl text-blue-800">${emoji} ${text}</strong></div>`;
  });
  formatted = formatted.replace(/^#\s*(.+)$/gm, (match, text) => {
    const emoji = getHeaderEmoji(text);
    return `\n<div class="mt-6 mb-4"><strong class="text-2xl text-blue-900">${emoji} ${text}</strong></div>`;
  });

  // Bold text
  formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
  
  // Italic text
  formatted = formatted.replace(/\*(.+?)\*/g, '<em class="italic text-gray-700">$1</em>');

  // Lists - unordered (must come before ordered to avoid conflicts)
  formatted = formatted.replace(/^[-*]\s+(.+)$/gm, (match, text) => {
    const emoji = getListEmoji(text);
    return `<div class="ml-4 my-1">${emoji} ${text}</div>`;
  });

  // Lists - ordered
  formatted = formatted.replace(/^\d+\.\s+(.+)$/gm, (match, text) => {
    const emoji = getListEmoji(text);
    return `<div class="ml-4 my-1">${emoji} ${text}</div>`;
  });

  // Restore code blocks
  codeBlocks.forEach((code, index) => {
    formatted = formatted.replace(`__CODE_${index}__`, code);
  });

  // Restore math expressions and render them
  mathExpressions.forEach((math, index) => {
    if (math.isBlock) {
      formatted = formatted.replace(`__MATH_${index}__`, 
        `<div class="my-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-500 shadow-sm"><div class="text-gray-800 font-medium text-base leading-relaxed">${math.content}</div></div>`);
    } else {
      formatted = formatted.replace(`__MATH_${index}__`, 
        `<span class="px-2 py-1 bg-blue-100 text-blue-900 rounded font-medium">${math.content}</span>`);
    }
  });

  // Add contextual emojis to lines
  formatted = addContextualEmojis(formatted);

  // Highlight final answer or conclusion
  formatted = formatted.replace(/^(Final Answer|Answer|Conclusion|Summary):?\s*(.+)$/gim, 
    '<div class="mt-4 p-4 bg-green-50 border-l-4 border-green-500 rounded"><strong class="text-green-800">🎯 Final Answer:</strong> <span class="text-green-900 font-semibold">$2</span></div>');

  return formatted;
};

const formatJsonToText = (obj, indent = 0) => {
  const spaces = '  '.repeat(indent);
  let result = '';

  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      if (typeof item === 'object') {
        result += formatJsonToText(item, indent);
      } else {
        result += `${spaces}${getListEmoji(String(item))} ${item}\n`;
      }
    });
  } else if (typeof obj === 'object' && obj !== null) {
    Object.entries(obj).forEach(([key, value]) => {
      const emoji = getKeyEmoji(key);
      const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      if (Array.isArray(value)) {
        result += `\n${spaces}${emoji} **${formattedKey}:**\n`;
        value.forEach(item => {
          if (typeof item === 'object') {
            result += formatJsonToText(item, indent + 1);
          } else {
            result += `${spaces}  • ${item}\n`;
          }
        });
      } else if (typeof value === 'object' && value !== null) {
        result += `\n${spaces}${emoji} **${formattedKey}:**\n`;
        result += formatJsonToText(value, indent + 1);
      } else {
        result += `${spaces}${emoji} **${formattedKey}:** ${value}\n`;
      }
    });
  } else {
    result += `${spaces}${obj}\n`;
  }

  return result;
};

const getHeaderEmoji = (text) => {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('step')) return '📍';
  if (lowerText.includes('problem') || lowerText.includes('question')) return '❓';
  if (lowerText.includes('solution') || lowerText.includes('solve')) return '💡';
  if (lowerText.includes('formula') || lowerText.includes('equation')) return '🔢';
  if (lowerText.includes('understand')) return '🤔';
  if (lowerText.includes('calculate') || lowerText.includes('compute')) return '🧮';
  if (lowerText.includes('final') || lowerText.includes('answer') || lowerText.includes('result')) return '🎯';
  if (lowerText.includes('example')) return '📝';
  if (lowerText.includes('note') || lowerText.includes('important')) return '⚠️';
  if (lowerText.includes('tip') || lowerText.includes('advice')) return '💡';
  
  return '📌';
};

const getKeyEmoji = (key) => {
  const lowerKey = key.toLowerCase();
  
  const emojiMap = {
    // Skills and technical
    skill: '💻', skills: '💻', technical: '💻', technology: '💻',
    tool: '🛠️', tools: '🛠️',
    language: '📝', languages: '📝',
    framework: '⚙️', frameworks: '⚙️',
    
    // Career and jobs
    job: '💼', position: '💼', role: '💼', career: '💼',
    company: '🏢', companies: '🏢', employer: '🏢',
    salary: '💰', compensation: '💰', pay: '💰',
    
    // Education and learning
    education: '🎓', degree: '🎓', course: '📚', learning: '📚',
    certification: '📜', certificate: '📜',
    
    // Experience and projects
    experience: '⭐', project: '🚀', projects: '🚀',
    achievement: '🏆', achievements: '🏆',
    
    // Interview and preparation
    interview: '🎤', preparation: '📋', question: '❓', questions: '❓',
    answer: '💡', tip: '💡', tips: '💡', advice: '💡',
    
    // Timeline and dates
    date: '📅', deadline: '⏰', timeline: '📆', duration: '⏱️',
    
    // Communication
    email: '📧', contact: '📞', phone: '📱',
    
    // Strengths and weaknesses
    strength: '💪', strengths: '💪', strong: '💪',
    weakness: '⚠️', weaknesses: '⚠️', improve: '📈', improvement: '📈',
    
    // Action items
    action: '✅', todo: '✅', task: '✅', tasks: '✅',
    step: '👣', steps: '👣',
    
    // Results and feedback
    result: '📊', results: '📊', feedback: '💬',
    score: '🎯', rating: '⭐',
    
    // Others
    name: '👤', title: '📌', description: '📝',
    summary: '📄', overview: '👀',
    recommendation: '🌟', recommendations: '🌟',
    resource: '📚', resources: '📚',
  };

  for (const [keyword, emoji] of Object.entries(emojiMap)) {
    if (lowerKey.includes(keyword)) {
      return emoji;
    }
  }

  return '📌';
};

const getListEmoji = (text) => {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('resume') || lowerText.includes('cv')) return '📄';
  if (lowerText.includes('skill') || lowerText.includes('technical')) return '💻';
  if (lowerText.includes('interview')) return '🎤';
  if (lowerText.includes('project')) return '🚀';
  if (lowerText.includes('experience')) return '⭐';
  if (lowerText.includes('education') || lowerText.includes('degree')) return '🎓';
  if (lowerText.includes('company') || lowerText.includes('employer')) return '🏢';
  if (lowerText.includes('job') || lowerText.includes('position')) return '💼';
  if (lowerText.includes('tip') || lowerText.includes('advice')) return '💡';
  if (lowerText.includes('practice') || lowerText.includes('prepare')) return '📚';
  if (lowerText.includes('achieve') || lowerText.includes('success')) return '🏆';
  if (lowerText.includes('improve') || lowerText.includes('enhance')) return '📈';
  if (lowerText.includes('strength')) return '💪';
  if (lowerText.includes('question')) return '❓';
  if (lowerText.includes('answer')) return '💬';
  
  return '•';
};

const addContextualEmojis = (text) => {
  // Add emojis at the start of sentences based on content
  const lines = text.split('\n');
  const enhanced = lines.map(line => {
    const trimmed = line.trim();
    if (!trimmed) return line;
    
    // Skip if line already has an emoji or is very short
    if (/[\u{1F300}-\u{1F9FF}]/u.test(trimmed) || trimmed.length < 10) return line;
    
    const lowerLine = trimmed.toLowerCase();
    
    // Questions
    if (lowerLine.includes('?')) {
      if (!lowerLine.startsWith('❓')) return line.replace(trimmed, `❓ ${trimmed}`);
    }
    
    // Positive outcomes
    if (lowerLine.includes('great') || lowerLine.includes('excellent') || lowerLine.includes('perfect')) {
      return line.replace(trimmed, `✨ ${trimmed}`);
    }
    
    // Warnings or areas to improve
    if (lowerLine.includes('however') || lowerLine.includes('but') || lowerLine.includes('improve')) {
      return line.replace(trimmed, `⚠️ ${trimmed}`);
    }
    
    // Recommendations
    if (lowerLine.includes('recommend') || lowerLine.includes('suggest')) {
      return line.replace(trimmed, `🌟 ${trimmed}`);
    }
    
    // Action items
    if (lowerLine.includes('should') || lowerLine.includes('need to') || lowerLine.includes('must')) {
      return line.replace(trimmed, `✅ ${trimmed}`);
    }
    
    return line;
  });
  
  return enhanced.join('\n');
};
