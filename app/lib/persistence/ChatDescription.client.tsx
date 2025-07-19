import { useStore } from '@nanostores/react';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import WithTooltip from '~/components/ui/Tooltip';
import { useEditChatDescription } from '~/lib/hooks';
import { description as descriptionStore } from '~/lib/persistence';

export function ChatDescription() {
  const initialDescription = useStore(descriptionStore)!;

  const { editing, handleChange, handleBlur, handleSubmit, handleKeyDown, currentDescription, toggleEditMode } =
    useEditChatDescription({
      initialDescription,
      syncWithGlobalStore: true,
    });

  if (!initialDescription) {
    // doing this to prevent showing edit button until chat description is set
    return null;
  }

  return (
    <div className="flex items-center justify-center">
      {editing ? (
        <form onSubmit={handleSubmit} className="flex items-center justify-center gap-2">
          <input
            type="text"
            className="bg-bolt-elements-background-depth-2 text-bolt-elements-textPrimary rounded-lg px-3 py-1.5 text-sm border border-bolt-elements-borderColor focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all duration-200"
            autoFocus
            value={currentDescription}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            style={{ width: `${Math.max(currentDescription.length * 8, 120)}px` }}
            placeholder="Enter chat title..."
          />
          <TooltipProvider>
            <WithTooltip tooltip="Save title">
              <button
                type="submit"
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent-500 hover:bg-accent-600 text-white transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent-500/20"
                onMouseDown={handleSubmit}
              >
                <div className="i-ph:check-bold text-sm" />
              </button>
            </WithTooltip>
          </TooltipProvider>
        </form>
      ) : (
        <div className="flex items-center gap-2 group">
          <span className="text-bolt-elements-textPrimary font-medium text-sm px-3 py-1.5 rounded-lg bg-bolt-elements-background-depth-2/50 border border-bolt-elements-borderColor/50 transition-all duration-200 group-hover:bg-bolt-elements-background-depth-2 group-hover:border-bolt-elements-borderColor">
            {currentDescription}
          </span>
          <TooltipProvider>
            <WithTooltip tooltip="Rename chat">
              <button
                type="button"
                className="flex items-center justify-center w-6 h-6 rounded-md text-bolt-elements-textSecondary hover:text-accent-500 hover:bg-accent-500/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-500/20"
                onClick={(event) => {
                  event.preventDefault();
                  toggleEditMode();
                }}
              >
                <div className="i-ph:pencil-simple text-sm" />
              </button>
            </WithTooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
}
