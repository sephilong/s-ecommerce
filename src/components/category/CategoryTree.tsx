
'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryTreeItem {
  id: string;
  name: string;
  slug: string;
  productCount: number;
  children?: CategoryTreeItem[];
}

interface CategoryTreeProps {
  categories: CategoryTreeItem[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  maxDepth?: number;
  depth?: number;
}

export function CategoryTree({ categories, selectedIds, onToggle, maxDepth = 3, depth = 0 }: CategoryTreeProps) {
  return (
    <ul className={cn("space-y-1", depth > 0 ? 'ml-4 border-l border-white/5 pl-3 mt-1' : '')} role="tree">
      {categories.map(cat => (
        <CategoryTreeNode
          key={cat.id}
          category={cat}
          selectedIds={selectedIds}
          onToggle={onToggle}
          maxDepth={maxDepth}
          depth={depth}
        />
      ))}
    </ul>
  );
}

function CategoryTreeNode({ category, selectedIds, onToggle, maxDepth, depth }: any) {
  const [isExpanded, setIsExpanded] = useState(
    category.children?.some((c: any) => selectedIds.includes(c.id)) ?? false
  );
  const hasChildren = category.children && category.children.length > 0 && depth < maxDepth - 1;
  const isSelected = selectedIds.includes(category.id);

  return (
    <li role="treeitem" aria-selected={isSelected} aria-expanded={hasChildren ? isExpanded : undefined}>
      <div className="flex items-center gap-1 py-1 group">
        {hasChildren ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-4 h-4 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
          >
            {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </button>
        ) : (
          <span className="w-4" />
        )}

        <button
          onClick={() => onToggle(category.id)}
          className={cn(
            "flex-1 text-left text-sm py-0.5 transition-all flex justify-between items-center",
            isSelected ? "text-primary font-bold italic" : "text-muted-foreground hover:text-white"
          )}
        >
          <span className="truncate">{category.name}</span>
          <span className="text-[10px] text-muted-foreground/40 ml-1 shrink-0 font-mono">({category.productCount})</span>
        </button>
      </div>

      {hasChildren && isExpanded && (
        <CategoryTree
          categories={category.children}
          selectedIds={selectedIds}
          onToggle={onToggle}
          maxDepth={maxDepth}
          depth={depth + 1}
        />
      )}
    </li>
  );
}
