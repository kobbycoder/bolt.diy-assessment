import { useStore } from '@nanostores/react';
import { ClientOnly } from 'remix-utils/client-only';
import { chatStore } from '~/lib/stores/chat';
import { classNames } from '~/utils/classNames';
import { HeaderActionButtons } from './HeaderActionButtons.client';
import { ChatDescription } from '~/lib/persistence/ChatDescription.client';

export function Header() {
  const chat = useStore(chatStore);

  return (
    <header
      className={classNames('flex items-center px-4 border-b h-[var(--header-height)]', {
        'border-transparent': !chat.started,
        'border-bolt-elements-borderColor': chat.started,
      })}
    >
      <div className="flex items-center gap-3 z-logo text-bolt-elements-textPrimary cursor-pointer">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-accent-500 to-accent-600 shadow-sm">
          <div className="i-ph:sidebar-simple-duotone text-white text-lg" />
        </div>
        <a href="/" className="flex items-center group transition-all duration-200">
          <img
            src="/logo-light-styled.png"
            alt="logo"
            className="w-[90px] inline-block dark:hidden transition-transform duration-200 group-hover:scale-105"
          />
          <img
            src="/logo-dark-styled.png"
            alt="logo"
            className="w-[90px] inline-block hidden dark:block transition-transform duration-200 group-hover:scale-105"
          />
        </a>
      </div>
      {chat.started && ( // Display ChatDescription and HeaderActionButtons only when the chat has started.
        <>
          <span className="flex-1 px-4 truncate text-center text-bolt-elements-textPrimary">
            <ClientOnly>{() => <ChatDescription />}</ClientOnly>
          </span>
          <ClientOnly>
            {() => (
              <div className="">
                <HeaderActionButtons chatStarted={chat.started} />
              </div>
            )}
          </ClientOnly>
        </>
      )}
    </header>
  );
}
